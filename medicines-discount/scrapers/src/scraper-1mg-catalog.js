/*
medicines.discount - 1mg Catalog Scraper
Strategy:
  1. Fetch 1mg sitemap index -> find all medicine sitemaps
  2. Parse each sitemap -> extract medicine URLs
  3. For each URL -> scrape drug details (name, salt, strength, manufacturer, price, MRP)
  4. Upsert into drugs + drug_prices tables

Run: node scrapers/src/scraper-1mg-catalog.js
*/

const { chromium } = require('playwright');
const axios = require('axios');
const { parseStringPromise } = require('xml2js');
const { Pool } = require('pg');
const PQueue = require('p-queue').default;

// ── Config ────────────────────────────────────────────────────

const DB = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medicines_discount'
});

const CONCURRENCY   = 3;   // parallel pages — keep low to avoid blocks
const DELAY_MS      = 1500; // delay between requests
const MAX_RETRIES   = 3;
const BATCH_SIZE    = 100;  // DB upsert batch size

const SITEMAP_INDEX = 'https://www.1mg.com/sitemap_index.xml';

// ── Slugify ───────────────────────────────────────────────────

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeName(text) {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

// ── Parse strength from drug name ─────────────────────────────

function parseStrength(name) {
  const match = name.match(/(\d+(?:\.\d+)?(?:mg|mcg|ml|iu|g|%|mg\/ml|mg\/5ml|mcg\/dose))/i);
  return match ? match[1].toLowerCase() : '';
}

// ── Sitemap fetcher ───────────────────────────────────────────

async function fetchSitemapIndex() {
  console.log('Fetching 1mg sitemap index...');
  const res = await axios.get(SITEMAP_INDEX, {
    headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MedicinesDiscountBot/1.0)' },
    timeout: 15000,
  });
  const parsed = await parseStringPromise(res.data);
  const sitemaps = parsed.sitemapindex.sitemap.map(s => s.loc[0]);
  console.log(`Found ${sitemaps.length} sitemaps`);
  return sitemaps;
}

async function fetchMedicineSitemaps(sitemaps) {
  // Filter to medicine-related sitemaps only
  const medicineUrls = sitemaps.filter(url =>
    url.includes('medicine') || url.includes('drug') || url.includes('product')
  );
  console.log(`Medicine sitemaps: ${medicineUrls.length}`);

  const allUrls = [];
  for (const sitemapUrl of medicineUrls) {
    try {
      const res = await axios.get(sitemapUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; MedicinesDiscountBot/1.0)' },
        timeout: 15000,
      });
      const parsed = await parseStringPromise(res.data);
      if (parsed.urlset && parsed.urlset.url) {
        const urls = parsed.urlset.url
          .map(u => u.loc[0])
          .filter(u => u.includes('/drugs/') || u.includes('/medicine/'));
        allUrls.push(...urls);
        console.log(`  ${sitemapUrl}: ${urls.length} URLs`);
      }
    } catch (err) {
      console.error(`  Failed: ${sitemapUrl} — ${err.message}`);
    }
    await sleep(500);
  }

  console.log(`Total medicine URLs: ${allUrls.length}`);
  return allUrls;
}

// ── Drug page scraper ─────────────────────────────────────────

async function scrapeDrugPage(page, url, retries = 0) {
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(800);

    const data = await page.evaluate(() => {
      // ── Brand name
      const brandName =
        document.querySelector('h1.DrugHeader__title')?.textContent?.trim() ||
        document.querySelector('[class*="ProductTitle"]')?.textContent?.trim() ||
        document.querySelector('h1')?.textContent?.trim() ||
        '';

      // ── Salt / composition
      const saltEl =
        document.querySelector('[class*="saltInfo"]') ||
        document.querySelector('[class*="composition"]') ||
        document.querySelector('.DrugHeader__meta-value') ||
        document.querySelector('[data-testid="composition"]');
      const saltName = saltEl?.textContent?.trim() || '';

      // ── Pack size / strength
      const packSizeEl =
        document.querySelector('[class*="PackSizeLabel"]') ||
        document.querySelector('[class*="pack-size"]') ||
        document.querySelector('.DrugHeader__pack-size');
      const packSize = packSizeEl?.textContent?.trim() || '';

      // ── MRP
      const mrpEl =
        document.querySelector('[class*="PriceBox__mrp"]') ||
        document.querySelector('[class*="price-wrapper"] [class*="mrp"]') ||
        document.querySelector('.DrugPriceBox__mrp');
      const mrpText = mrpEl?.textContent?.replace(/[^\d.]/g, '') || '';
      const mrp = mrpText ? parseFloat(mrpText) : null;

      // ── Selling price
      const priceEl =
        document.querySelector('[class*="PriceBox__price"]') ||
        document.querySelector('[class*="drug-price"]') ||
        document.querySelector('.DrugPriceBox__price');
      const priceText = priceEl?.textContent?.replace(/[^\d.]/g, '') || '';
      const sellingPrice = priceText ? parseFloat(priceText) : null;

      // ── Manufacturer
      const mfrEl =
        document.querySelector('[class*="manufacturer"]') ||
        document.querySelector('[class*="Manufacturer"]') ||
        document.querySelector('[data-testid="manufacturer"]');
      const manufacturer = mfrEl?.textContent?.trim()?.replace(/^Manufacturer:\s*/i, '') || '';

      // ── Uses
      const usesEl = document.querySelector('[class*="uses"]') || document.querySelector('#uses');
      const uses = usesEl?.textContent?.trim()?.slice(0, 500) || '';

      // ── Rx required
      const rxEl = document.querySelector('[class*="rx"]') || document.querySelector('[class*="prescription"]');
      const rxRequired = !!rxEl || document.body.textContent.includes('Prescription required');

      // ── In stock
      const outOfStockEl = document.querySelector('[class*="OutOfStock"]') || document.querySelector('[class*="out-of-stock"]');
      const inStock = !outOfStockEl;

      // ── Dosage form
      const formKeywords = ['Tablet', 'Capsule', 'Syrup', 'Injection', 'Drops', 'Cream', 'Ointment', 'Gel', 'Spray', 'Inhaler', 'Powder', 'Suspension'];
      let dosageForm = '';
      for (const form of formKeywords) {
        if (brandName.includes(form) || packSize.includes(form)) {
          dosageForm = form;
          break;
        }
      }

      // ── Discount pct
      const discountEl = document.querySelector('[class*="discount"]') || document.querySelector('[class*="Discount"]');
      const discountText = discountEl?.textContent?.match(/(\d+)%/)?.[1];
      const discountPct = discountText ? parseFloat(discountText) : null;

      return {
        brandName,
        saltName,
        packSize,
        mrp,
        sellingPrice,
        manufacturer,
        uses,
        rxRequired,
        inStock,
        dosageForm,
        discountPct,
      };
    });

    if (!data.brandName) {
      console.log(`  ⚠ No brand name found: ${url}`);
      return null;
    }

    // Extract strength from brand name or pack size
    const strength = parseStrength(data.brandName) || parseStrength(data.packSize) || '';

    // Extract 1mg drug ID from URL
    const urlMatch = url.match(/\/(\d+)$/);
    const source1mgId = urlMatch ? urlMatch[1] : null;

    return {
      brandName:    data.brandName,
      saltName:     data.saltName || data.brandName,
      strength:     strength,
      packSize:     data.packSize,
      dosageForm:   data.dosageForm,
      manufacturer: data.manufacturer,
      mrp:          data.mrp,
      sellingPrice: data.sellingPrice,
      discountPct:  data.discountPct,
      rxRequired:   data.rxRequired,
      inStock:      data.inStock,
      uses:         data.uses,
      source1mgId:  source1mgId,
      source1mgUrl: url,
    };

  } catch (err) {
    if (retries < MAX_RETRIES) {
      console.log(`  Retry ${retries + 1}/${MAX_RETRIES}: ${url}`);
      await sleep(DELAY_MS * (retries + 1));
      return scrapeDrugPage(page, url, retries + 1);
    }
    console.error(`  ✗ Failed after ${MAX_RETRIES} retries: ${url} — ${err.message}`);
    return null;
  }
}

// ── DB upsert ─────────────────────────────────────────────────

async function upsertManufacturer(client, name) {
  if (!name) return null;
  const normalized = normalizeName(name);
  const slug = slugify(name);

  const res = await client.query(`
    INSERT INTO manufacturers (name_raw, name_normalized, slug)
    VALUES ($1, $2, $3)
    ON CONFLICT (slug) DO UPDATE SET
      name_raw = EXCLUDED.name_raw,
      updated_at = NOW()
    RETURNING id
  `, [name, normalized, slug]);

  return res.rows[0].id;
}

async function upsertDrug(client, drug, manufacturerId) {
  const brandNorm  = normalizeName(drug.brandName);
  const saltNorm   = normalizeName(drug.saltName);
  const saltSlug   = slugify(drug.saltName);
  const slug       = slugify(`${drug.brandName}-${drug.strength}`);
  const therSlug   = drug.therapeuticCategory ? slugify(drug.therapeuticCategory) : null;

  // Price per unit (if pack size has count)
  const unitMatch = drug.packSize?.match(/(\d+)/);
  const unitCount = unitMatch ? parseInt(unitMatch[1]) : 1;
  const pricePerUnit = drug.sellingPrice && unitCount > 0
    ? drug.sellingPrice / unitCount
    : null;

  const res = await client.query(`
    INSERT INTO drugs (
      brand_name, brand_name_normalized, slug,
      salt_name, salt_normalized, salt_slug,
      strength, pack_size, dosage_form,
      therapeutic_category, therapeutic_slug,
      rx_required, manufacturer_id, manufacturer_name,
      mrp, price_per_unit, uses,
      source_1mg_id, source_1mg_url
    ) VALUES (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19
    )
    ON CONFLICT (source_1mg_id) DO UPDATE SET
      mrp             = EXCLUDED.mrp,
      pack_size       = EXCLUDED.pack_size,
      uses            = COALESCE(EXCLUDED.uses, drugs.uses),
      updated_at      = NOW()
    RETURNING id, (xmax = 0) AS is_new
  `, [
    drug.brandName, brandNorm, slug,
    drug.saltName, saltNorm, saltSlug,
    drug.strength, drug.packSize, drug.dosageForm,
    drug.therapeuticCategory || null, therSlug,
    drug.rxRequired, manufacturerId, drug.manufacturer,
    drug.mrp, pricePerUnit, drug.uses,
    drug.source1mgId, drug.source1mgUrl,
  ]);

  return res.rows[0];
}

async function upsertPrice(client, drugId, drug) {
  if (!drug.sellingPrice) return;

  const unitMatch = drug.packSize?.match(/(\d+)/);
  const unitCount = unitMatch ? parseInt(unitMatch[1]) : 1;
  const pricePerUnit = drug.sellingPrice / unitCount;
  const effectivePrice = drug.sellingPrice;

  await client.query(`
    INSERT INTO drug_prices (
      drug_id, portal, portal_url, mrp, selling_price,
      discount_pct, price_per_unit, in_stock, effective_price
    ) VALUES ($1,'1mg',$2,$3,$4,$5,$6,$7,$8)
    ON CONFLICT (drug_id, portal) DO UPDATE SET
      portal_url    = EXCLUDED.portal_url,
      mrp           = EXCLUDED.mrp,
      selling_price = EXCLUDED.selling_price,
      discount_pct  = EXCLUDED.discount_pct,
      price_per_unit= EXCLUDED.price_per_unit,
      in_stock      = EXCLUDED.in_stock,
      effective_price=EXCLUDED.effective_price,
      last_checked  = NOW()
  `, [
    drugId, drug.source1mgUrl, drug.mrp, drug.sellingPrice,
    drug.discountPct, pricePerUnit, drug.inStock, effectivePrice,
  ]);
}

// ── Log run to DB ─────────────────────────────────────────────

async function createRunLog(client) {
  const res = await client.query(`
    INSERT INTO scraper_runs (portal, run_type, status)
    VALUES ('1mg', 'catalog', 'running')
    RETURNING id
  `);
  return res.rows[0].id;
}

async function updateRunLog(client, runId, stats) {
  await client.query(`
    UPDATE scraper_runs SET
      status       = $2,
      drugs_scraped= $3,
      drugs_new    = $4,
      drugs_updated= $5,
      errors       = $6,
      completed_at = NOW()
    WHERE id = $1
  `, [runId, stats.status, stats.scraped, stats.newCount, stats.updated, stats.errors]);
}

// ── Main ──────────────────────────────────────────────────────

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('🚀 1mg catalog scraper starting...');

  // Get already-scraped 1mg IDs to skip
  const existingRes = await DB.query('SELECT source_1mg_id FROM drugs WHERE source_1mg_id IS NOT NULL');
  const existingIds = new Set(existingRes.rows.map(r => r.source_1mg_id));
  console.log(`Already have ${existingIds.size} drugs in DB`);

  // Get all medicine URLs from sitemaps
  const allSitemaps = await fetchSitemapIndex();
  const medicineUrls = await fetchMedicineSitemaps(allSitemaps);

  // Filter already-scraped
  const toScrape = medicineUrls.filter(url => {
    const match = url.match(/\/(\d+)$/);
    return !match || !existingIds.has(match[1]);
  });
  console.log(`URLs to scrape: ${toScrape.length} (skipping ${medicineUrls.length - toScrape.length} already in DB)`);

  // Create run log
  const client = await DB.connect();
  const runId = await createRunLog(client);
  client.release();

  const stats = { scraped: 0, newCount: 0, updated: 0, errors: 0 };
  const queue = new PQueue({ concurrency: CONCURRENCY });

  // Launch browser
  const browser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  // Process in batches
  const chunks = [];
  for (let i = 0; i < toScrape.length; i += BATCH_SIZE) {
    chunks.push(toScrape.slice(i, i + BATCH_SIZE));
  }

  for (let chunkIdx = 0; chunkIdx < chunks.length; chunkIdx++) {
    const chunk = chunks[chunkIdx];
    console.log(`\nChunk ${chunkIdx + 1}/${chunks.length} (${chunk.length} URLs)`);

    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120 Safari/537.36',
      viewport: { width: 1280, height: 800 },
    });

    const promises = chunk.map(url => queue.add(async () => {
      const page = await context.newPage();
      try {
        await sleep(DELAY_MS + Math.random() * 500);
        const drug = await scrapeDrugPage(page, url);

        if (drug) {
          const dbClient = await DB.connect();
          try {
            const mfrId = await upsertManufacturer(dbClient, drug.manufacturer);
            const result = await upsertDrug(dbClient, drug, mfrId);
            await upsertPrice(dbClient, result.id, drug);

            stats.scraped++;
            if (result.is_new) stats.newCount++;
            else stats.updated++;

            if (stats.scraped % 100 === 0) {
              console.log(`  ✓ ${stats.scraped} scraped | ${stats.newCount} new | ${stats.updated} updated | ${stats.errors} errors`);
            }
          } finally {
            dbClient.release();
          }
        } else {
          stats.errors++;
        }
      } catch (err) {
        stats.errors++;
        console.error(`  ✗ ${url}: ${err.message}`);
      } finally {
        await page.close();
      }
    }));

    await Promise.all(promises);
    await context.close();

    // Update run log every chunk
    const logClient = await DB.connect();
    await updateRunLog(logClient, runId, { ...stats, status: 'running' });
    logClient.release();

    // Backoff between chunks
    await sleep(2000);
  }

  await browser.close();

  // Final log
  const finalClient = await DB.connect();
  await updateRunLog(finalClient, runId, { ...stats, status: 'completed' });
  finalClient.release();

  await DB.end();

  console.log('\n✅ Scrape complete');
  console.log(`   Scraped: ${stats.scraped}`);
  console.log(`   New:     ${stats.newCount}`);
  console.log(`   Updated: ${stats.updated}`);
  console.log(`   Errors:  ${stats.errors}`);
}

// Only run when called directly — not when imported by run-all.js
if (require.main === module) {
  main().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
  });
}
