/**
 * medicines.discount — PharmEasy Catalog Discovery Scraper
 *
 * Finds drugs listed on PharmEasy that are NOT in our Jan Aushadhi DB
 * and inserts them as new drug records.
 *
 * Pipeline:
 *   1. DISCOVER  — parse PharmEasy's sitemap XMLs → all product slugs + IDs
 *   2. DIFF      — remove slugs already stored in drugs.source_pharmeasy_id
 *   3. FETCH     — visit each new product page → __NEXT_DATA__ → full details
 *                  (salt composition, dosage form, manufacturer, price)
 *   4. INSERT    — add to drugs + drug_prices tables
 *
 * Usage:
 *   node src/scraper-pharmeasy-catalog.js                  -- full run
 *   node src/scraper-pharmeasy-catalog.js --discover-only  -- print slug count & exit
 *   node src/scraper-pharmeasy-catalog.js --limit=500      -- process first N new products
 *   node src/scraper-pharmeasy-catalog.js --offset=1000    -- skip first N new products
 *   node src/scraper-pharmeasy-catalog.js --delay=800      -- ms between requests (default 600)
 *   node src/scraper-pharmeasy-catalog.js --concurrency=3  -- parallel fetches (default 2)
 */

'use strict';

const path  = require('path');
const fs    = require('fs');

// ── Load .env ─────────────────────────────────────────────────────────────────
try {
  const envFile = path.resolve(__dirname, '../../apps/api/.env');
  if (fs.existsSync(envFile))
    fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
      const m = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
      if (m && !process.env[m[1]])
        process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    });
} catch {}

const axios    = require('axios');
const { Pool } = require('pg');

const DB = new Pool({
  connectionString: process.env.DATABASE_URL ||
    'postgresql://postgres:5432@localhost:5432/medicines_discount',
});

// ── CLI args ──────────────────────────────────────────────────────────────────
const argv         = process.argv.slice(2);
const DISCOVER_ONLY = argv.includes('--discover-only');
const LIMIT        = +(argv.find(a => a.startsWith('--limit='))?.split('=')[1]       ?? 999999);
const OFFSET       = +(argv.find(a => a.startsWith('--offset='))?.split('=')[1]      ?? 0);
const DELAY_MS     = +(argv.find(a => a.startsWith('--delay='))?.split('=')[1]       ?? 600);
const CONCURRENCY  = +(argv.find(a => a.startsWith('--concurrency='))?.split('=')[1] ?? 2);

// ── Logging ───────────────────────────────────────────────────────────────────
const logsDir   = path.resolve(__dirname, '../logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
const logPath   = path.join(logsDir, `pharmeasy-catalog-${new Date().toISOString().slice(0,10)}.log`);
const logStream = fs.createWriteStream(logPath, { flags: 'a' });

function log(msg) {
  process.stdout.write(msg + '\n');
  logStream.write(`[${new Date().toISOString()}] ${msg}\n`);
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// ── HTTP headers ──────────────────────────────────────────────────────────────
const HTML_HEADERS = {
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-IN,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection':      'keep-alive',
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function normalize(t) { return (t || '').toLowerCase().trim().replace(/\s+/g, ' '); }

function slugify(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractNextData(html) {
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

// Parse strength from a product name like "Metformin 500mg Tablet"
function parseStrength(name) {
  const m = (name || '').match(/(\d+(?:\.\d+)?\s*(?:mg|mcg|g|ml|iu|%|units?|lakh\s*iu)(?:\s*\/\s*\d+\s*(?:mg|ml|g))?)/i);
  return m ? m[1].trim() : null;
}

// Guess dosage form from product name
function parseDosageForm(name, productForm) {
  if (productForm) return productForm;
  const n = normalize(name);
  if (n.includes('injection') || n.includes('vial') || n.includes('ampoule')) return 'Injection';
  if (n.includes('syrup') || n.includes('suspension') || n.includes('oral drops')) return 'Syrup';
  if (n.includes('capsule')) return 'Capsule';
  if (n.includes('cream') || n.includes('ointment') || n.includes('gel')) return 'Topical';
  if (n.includes('drops') || n.includes('solution')) return 'Solution';
  if (n.includes('inhaler') || n.includes('respicap')) return 'Inhaler';
  if (n.includes('sachet') || n.includes('granules') || n.includes('powder')) return 'Powder';
  if (n.includes('patch') || n.includes('transdermal')) return 'Patch';
  if (n.includes('strip') || n.includes('tablet') || n.includes('tab ')) return 'Tablet';
  return 'Tablet'; // default
}

// Unique DB slug — appends pharmeasy ID to avoid conflicts with JA slugs
function makeDbSlug(productName, productId) {
  return `${slugify(productName)}-pe${productId}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 1: DISCOVER — 3-level sitemap crawl + molecule pages
//
// PharmEasy sitemap hierarchy (confirmed Mar 2026):
//
//   sitemap.xml
//   ├── sitemap-otc-products.xml          (7 sub-sitemaps)
//   │     └── /sitemaps/otc-products/sitemap-otc-products-N.xml  → product URLs
//   ├── sitemap-prescription-medicines.xml (29 sub-sitemaps)
//   │     └── /sitemaps/online-medicine-order/sitemap-prescription-medicine-N.xml → product URLs
//   └── sitemap-molecule.xml              (3,117 molecule pages at /molecules/<name>-<id>)
//         → each molecule page lists all PharmEasy products for that salt
//
// ─────────────────────────────────────────────────────────────────────────────
function extractLocs(xml) {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1].trim());
}

async function fetchXml(url) {
  const res = await axios.get(url, { headers: HTML_HEADERS, timeout: 25000 });
  return res.data;
}

// Extract a product entry from any pharmeasy product URL
// Handles: /online-medicine-order/<slug>-<id>
//          /online-pharmacy/medicines/<slug>-<id>
//          /otc/<slug>-<id>
function urlToProduct(url) {
  const m = url.match(/\/([a-z0-9][a-z0-9\-]*-(\d{4,}))\/?$/i);
  if (!m) return null;
  return { slug: m[1], productId: m[2], url };
}

async function discoverSlugs() {
  log('\n── Phase 1: Discover (3-level sitemap + molecule pages) ──');

  const products = [];
  const seenIds  = new Set();

  function addProduct(p) {
    if (!p || seenIds.has(p.productId)) return;
    seenIds.add(p.productId);
    products.push(p);
  }

  // ── Path A: OTC + Prescription medicines (3-level deep) ─────────────────
  const LEVEL1_TARGETS = [
    'sitemap-otc-products.xml',
    'sitemap-prescription-medicines.xml',
  ];

  log('\n  [A] Crawling OTC + Prescription medicine sitemaps...');
  try {
    const indexXml   = await fetchXml('https://pharmeasy.in/sitemap.xml');
    const level1Locs = extractLocs(indexXml)
      .filter(u => LEVEL1_TARGETS.some(t => u.endsWith(t)));

    log(`      Level-1 sitemaps: ${level1Locs.length} (${level1Locs.map(u => u.split('/').pop()).join(', ')})`);

    for (const l1Url of level1Locs) {
      await sleep(350);
      let level2Locs;
      try {
        const l1Xml  = await fetchXml(l1Url);
        level2Locs   = extractLocs(l1Xml);
        log(`      ${l1Url.split('/').pop()}: ${level2Locs.length} sub-sitemaps`);
      } catch (e) {
        log(`      ⚠ ${l1Url.split('/').pop()}: ${e.message}`);
        continue;
      }

      // Level 3: each sub-sitemap contains actual product URLs
      for (const l2Url of level2Locs) {
        await sleep(300);
        try {
          const l2Xml   = await fetchXml(l2Url);
          const rawUrls = extractLocs(l2Xml);
          let added = 0;
          for (const url of rawUrls) {
            const p = urlToProduct(url);
            if (p) { addProduct(p); added++; }
          }
          log(`      ${l2Url.split('/').pop()}: ${rawUrls.length} URLs (${added} products) → total ${products.length}`);
        } catch (e) {
          if (!e.message.includes('404'))
            log(`      ⚠ ${l2Url.split('/').pop()}: ${e.message}`);
        }
      }
    }
  } catch (e) {
    log(`  ⚠ Level-1 sitemap fetch failed: ${e.message}`);
  }

  // ── Path B: Molecule pages — 3,117 molecules, each lists its products ────
  // Each page at /molecules/<name>-<id> has __NEXT_DATA__ with a product list.
  // We collect molecule page URLs here; actual product details come in Phase 3.
  log('\n  [B] Collecting molecule pages from sitemap-molecule.xml...');
  const moleculeEntries = [];  // { moleculeId, moleculeSlug, url }
  try {
    const molXml  = await fetchXml('https://pharmeasy.in/sitemap-molecule.xml');
    const molUrls = extractLocs(molXml)
      .filter(u => u.includes('/molecules/'));

    for (const url of molUrls) {
      const m = url.match(/\/molecules\/([a-z0-9\-]+-(\d+))\/?$/i);
      if (m) moleculeEntries.push({ moleculeSlug: m[1], moleculeId: m[2], url });
    }
    log(`      ${moleculeEntries.length} molecule pages found`);
  } catch (e) {
    log(`  ⚠ Molecule sitemap failed: ${e.message}`);
  }

  log(`\n  Total product URLs from sitemaps : ${products.length}`);
  log(`  Molecule pages to scan           : ${moleculeEntries.length}`);

  return { products, moleculeEntries };
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 2: DIFF — remove products already in our DB
// ─────────────────────────────────────────────────────────────────────────────
async function diffAgainstDB(products) {
  log('\n── Phase 2: Diff against DB ──');

  const { rows } = await DB.query(`
    SELECT source_pharmeasy_id FROM drugs
    WHERE source_pharmeasy_id IS NOT NULL
  `);
  const existingIds = new Set(rows.map(r => String(r.source_pharmeasy_id)));

  const newProducts = products.filter(p => !existingIds.has(p.productId));
  log(`  Already in DB : ${existingIds.size}`);
  log(`  New to import : ${newProducts.length}`);

  return { newProducts, existingIds };
}

// ─────────────────────────────────────────────────────────────────────────────
// MOLECULE PAGE PARSER — extract product list from /molecules/<name>-<id>
// Each molecule page's __NEXT_DATA__ contains all PharmEasy products for
// that salt. We use this to discover products not in the sitemap product lists.
// ─────────────────────────────────────────────────────────────────────────────
function parseMoleculePage(nd, moleculeSlug) {
  const pp = nd?.props?.pageProps ?? {};

  // PharmEasy molecule pages typically have productData or medicineList
  const productList =
    pp.productData      ??
    pp.medicineList     ??
    pp.products         ??
    pp.data?.products   ??
    pp.data             ??
    [];

  const arr = Array.isArray(productList) ? productList : Object.values(productList);

  return arr
    .filter(p => p && (p.name || p.productName) && p.slug)
    .map(p => ({
      slug:      p.slug,
      productId: String(p.productId || p.id || p.slug.match(/-(\d+)$/)?.[1] || ''),
      url:       `https://pharmeasy.in/online-pharmacy/medicines/${p.slug}`,
      // Bonus: molecule pages often include price data directly
      inlineData: {
        name:        p.name || p.productName,
        saltName:    moleculeSlug.replace(/-\d+$/, '').replace(/-/g, ' '),
        sellingPrice: parseFloat(p.salePriceDecimal || p.price) || null,
        mrp:          parseFloat(p.mrpDecimal || p.mrp) || null,
        discountPct:  parseFloat(p.discountPercent) || null,
        inStock:      p.productAvailabilityFlags?.isAvailable !== false,
        packSize:     p.packSize || '',
        dosageForm:   parseDosageForm(p.name || '', p.productForm || ''),
        manufacturer: p.manufacturer || '',
      },
    }))
    .filter(p => p.productId); // must have an ID
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 3: FETCH — visit product page and extract full details
// ─────────────────────────────────────────────────────────────────────────────

// Pull all useful fields out of PharmEasy's __NEXT_DATA__ on a product page
function parseProductPage(nd, url, slug) {
  const pp = nd?.props?.pageProps ?? {};

  // PharmEasy stores product data under several possible keys
  const raw =
    pp.productData     ??
    pp.medicineDetails ??
    pp.data            ??
    pp.product         ??
    {};

  // Sometimes nested under a "medicine" key
  const p = raw.medicine ?? raw.product ?? raw.medicineDetails ?? raw;

  if (!p || !p.name) return null;

  const productId = String(p.productId || p.id || slug.match(/-(\d+)$/)?.[1] || '');

  // Salt / composition — PharmEasy uses several field names
  const saltRaw =
    p.saltComposition       ||
    p.compositionMapping    ||
    p.composition           ||
    p.saltDesc              ||
    p.salt                  ||
    '';

  // Price fields
  const selling  = parseFloat(p.price || p.sellingPrice || p.salePriceDecimal)    || null;
  const mrp      = parseFloat(p.mrp   || p.maxRetailPrice || p.mrpDecimal)         || null;
  const discount = parseFloat(p.discountPercent || p.discountPercentage)           || null;

  // Pack / form
  const packSize    = p.packSize || p.unitSize  || p.packLabel || '';
  const productForm = p.productForm || p.form   || p.medicineType || '';
  const name        = p.name || p.productName   || '';

  return {
    productId,
    slug,
    portalUrl: url,
    // Drug fields
    brandName:    name,
    saltName:     saltRaw || name,          // fallback to product name if no composition
    strength:     parseStrength(name),
    packSize,
    dosageForm:   parseDosageForm(name, productForm),
    manufacturer: p.manufacturer || p.manufacturerName || p.mfgName || '',
    // Pricing
    sellingPrice: selling,
    mrp,
    discountPct:  discount || (selling && mrp ? Math.round((1 - selling/mrp)*100) : null),
    inStock:      p.productAvailabilityFlags?.isAvailable !== false &&
                  p.inStock !== false &&
                  p.outOfStock !== true,
    // Extra
    uses:         p.uses || p.introduction || '',
  };
}

async function fetchProductDetails(item) {
  const res = await axios.get(item.url, {
    headers: { ...HTML_HEADERS, Referer: 'https://pharmeasy.in/online-pharmacy/medicines' },
    timeout: 15000,
  });

  const nd = extractNextData(res.data);
  if (!nd) throw new Error('No __NEXT_DATA__ on product page');

  const details = parseProductPage(nd, item.url, item.slug);
  if (!details?.brandName) throw new Error('Could not parse product data from __NEXT_DATA__');

  return details;
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 4: INSERT — add drug + price to DB
// ─────────────────────────────────────────────────────────────────────────────
async function insertDrug(details) {
  const client = await DB.connect();
  try {
    const dbSlug     = makeDbSlug(details.brandName, details.productId);
    const saltNorm   = normalize(details.saltName);
    const saltSlug   = slugify(details.saltName);
    const brandNorm  = normalize(details.brandName);

    // Insert drug record (skip if slug already exists — idempotent)
    const { rows } = await client.query(`
      INSERT INTO drugs (
        brand_name, brand_name_normalized, slug,
        salt_name,  salt_normalized,       salt_slug,
        strength,   pack_size,             dosage_form,
        manufacturer_name,
        mrp,        jan_aushadhi_price,
        is_generic, is_govt_brand,         is_active,
        source_pharmeasy_id,               source_pharmeasy_url,
        uses
      ) VALUES (
        $1,  $2,  $3,
        $4,  $5,  $6,
        $7,  $8,  $9,
        $10,
        $11, NULL,
        FALSE, FALSE, TRUE,
        $12, $13,
        $14
      )
      ON CONFLICT (slug) DO UPDATE SET
        source_pharmeasy_id  = COALESCE(drugs.source_pharmeasy_id,  EXCLUDED.source_pharmeasy_id),
        source_pharmeasy_url = COALESCE(drugs.source_pharmeasy_url, EXCLUDED.source_pharmeasy_url),
        mrp                  = COALESCE(drugs.mrp,                  EXCLUDED.mrp),
        updated_at           = NOW()
      RETURNING id, (xmax = 0) AS inserted
    `, [
      details.brandName,  brandNorm,         dbSlug,
      details.saltName,   saltNorm,          saltSlug,
      details.strength,   details.packSize,  details.dosageForm,
      details.manufacturer,
      details.mrp,
      details.productId,  details.portalUrl,
      details.uses?.slice(0, 500) || null,
    ]);

    const drugId  = rows[0].id;
    const isNew   = rows[0].inserted;

    // Upsert price
    if (details.sellingPrice) {
      await client.query(`
        INSERT INTO drug_prices
          (drug_id, portal, portal_url, mrp, selling_price,
           discount_pct, in_stock, cashback_pct, effective_price)
        VALUES ($1, 'pharmeasy', $2, $3, $4, $5, $6, 0, $4)
        ON CONFLICT (drug_id, portal) DO UPDATE SET
          portal_url      = EXCLUDED.portal_url,
          mrp             = COALESCE(EXCLUDED.mrp, drug_prices.mrp),
          selling_price   = EXCLUDED.selling_price,
          discount_pct    = EXCLUDED.discount_pct,
          in_stock        = EXCLUDED.in_stock,
          effective_price = EXCLUDED.selling_price,
          last_checked    = NOW()
      `, [
        drugId, details.portalUrl, details.mrp,
        details.sellingPrice, details.discountPct, details.inStock,
      ]);
    }

    return { drugId, isNew };
  } finally {
    client.release();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Concurrency pool — run N async tasks at once
// ─────────────────────────────────────────────────────────────────────────────
async function runPool(items, concurrency, fn) {
  const results = [];
  let idx = 0;

  async function worker() {
    while (idx < items.length) {
      const i    = idx++;
      const item = items[i];
      results[i] = await fn(item, i);
    }
  }

  await Promise.all(Array.from({ length: concurrency }, worker));
  return results;
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────────────────────────
async function main() {
  const border = '═'.repeat(64);
  log(`\n${border}`);
  log(`  PharmEasy Catalog Scraper  —  ${new Date().toLocaleString('en-IN')}`);
  log(`  Delay: ${DELAY_MS}ms   Concurrency: ${CONCURRENCY}   Limit: ${LIMIT}`);
  log(`${border}\n`);

  // ── Phase 1: Discover ────────────────────────────────────────────────────
  const { products: allProducts, moleculeEntries } = await discoverSlugs();

  if (DISCOVER_ONLY) {
    log(`\nDiscover-only mode.`);
    log(`  Products from sitemaps : ${allProducts.length}`);
    log(`  Molecule pages found   : ${moleculeEntries.length}`);
    await DB.end();
    return;
  }

  // If sitemaps yielded 0 products, we'll rely entirely on molecule pages below
  if (allProducts.length === 0 && moleculeEntries.length === 0) {
    log('\n⚠ Nothing discovered from any source. Check sitemap structure.');
    await DB.end();
    return;
  }

  // ── Phase 2: Diff ────────────────────────────────────────────────────────
  const { newProducts, existingIds } = await diffAgainstDB(allProducts);

  // ── Phase 3+4: Process sitemap products (fetch page → insert) ────────────
  let inserted = 0, updated = 0, failed = 0;
  const startTime = Date.now();

  if (newProducts.length > 0) {
    const batch = newProducts.slice(OFFSET, OFFSET + LIMIT);
    log(`\n── Phase 3+4: Fetch product pages & insert (${batch.length} from sitemaps) ──`);

    await runPool(batch, CONCURRENCY, async (item, idx) => {
      await sleep(DELAY_MS + Math.random() * 200);
      const num = OFFSET + idx + 1;
      try {
        const details = await fetchProductDetails(item);
        const { isNew } = await insertDrug(details);
        if (isNew) inserted++; else updated++;
        const priceStr = details.sellingPrice ? `₹${details.sellingPrice} (MRP ₹${details.mrp ?? '?'})` : 'no price';
        log(`[${num}] ${isNew ? '+NEW' : '~UPD'}  ${details.brandName}  |  ${details.saltName || '—'}  |  ${priceStr}`);
      } catch (err) {
        failed++;
        log(`[${num}] ✗  ${item.slug}: ${err.message}`);
      }
      if ((idx + 1) % 100 === 0) {
        log(`\n── [${idx+1}/${batch.length}] +${inserted} new | ~${updated} upd | ✗${failed} fail | ${((Date.now()-startTime)/60000).toFixed(1)}min ──\n`);
      }
    });
  } else {
    log('\n  All sitemap products already in DB.');
  }

  // ── Phase 3+4: Process molecule pages ────────────────────────────────────
  // Each molecule page lists products for one salt — great for discovery +
  // salt-name enrichment. We crawl them and pick up any products not yet seen.
  if (moleculeEntries.length > 0) {
    const molBatch = moleculeEntries.slice(OFFSET, OFFSET + LIMIT);
    log(`\n── Phase 3+4b: Molecule pages (${molBatch.length} molecules) ──`);
    log('  Scanning each molecule page for products not yet in DB...\n');

    let molInserted = 0, molSkipped = 0;

    for (let i = 0; i < molBatch.length; i++) {
      const entry = molBatch[i];
      await sleep(DELAY_MS);
      try {
        const res = await axios.get(entry.url, {
          headers: { ...HTML_HEADERS, Referer: 'https://pharmeasy.in/molecules' },
          timeout: 15000,
        });
        const nd       = extractNextData(res.data);
        if (!nd) { molSkipped++; continue; }

        const molProducts = parseMoleculePage(nd, entry.moleculeSlug);
        let addedThisMol  = 0;

        for (const mp of molProducts) {
          if (existingIds.has(mp.productId)) continue;
          existingIds.add(mp.productId); // mark as seen so we don't double-insert

          try {
            // Use inline data if available, otherwise fetch the product page
            let details;
            if (mp.inlineData?.sellingPrice) {
              details = {
                productId:    mp.productId,
                portalUrl:    mp.url,
                brandName:    mp.inlineData.name,
                saltName:     mp.inlineData.saltName,
                strength:     parseStrength(mp.inlineData.name),
                packSize:     mp.inlineData.packSize,
                dosageForm:   mp.inlineData.dosageForm,
                manufacturer: mp.inlineData.manufacturer,
                sellingPrice: mp.inlineData.sellingPrice,
                mrp:          mp.inlineData.mrp,
                discountPct:  mp.inlineData.discountPct,
                inStock:      mp.inlineData.inStock,
                uses:         null,
              };
            } else {
              await sleep(400);
              details = await fetchProductDetails(mp);
            }

            const { isNew } = await insertDrug(details);
            if (isNew) { inserted++; molInserted++; addedThisMol++; }
            else { updated++; }
          } catch { failed++; }
        }

        if (addedThisMol > 0 || (i + 1) % 50 === 0) {
          const mol = entry.moleculeSlug.replace(/-\d+$/, '');
          log(`  [mol ${i+1}/${molBatch.length}] ${mol}: ${molProducts.length} products, ${addedThisMol} new`);
        }
      } catch (err) {
        molSkipped++;
        if (!err.message.includes('404'))
          log(`  ⚠ molecule ${entry.moleculeSlug}: ${err.message}`);
      }
    }
    log(`\n  Molecule scan done. ${molInserted} new drugs added, ${molSkipped} pages skipped.`);
  }

  const totalMin = ((Date.now() - startTime)/1000/60).toFixed(1);
  log(`\n${border}`);
  log(`  Done in ${totalMin} min`);
  log(`  Inserted : ${inserted} new drugs`);
  log(`  Updated  : ${updated} existing drug records`);
  log(`  Failed   : ${failed}`);
  log(`  Log      : ${logPath}`);
  log(`${border}\n`);

  logStream.end();
  await DB.end();
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
