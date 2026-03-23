/**
 * medicines.discount — PharmEasy Dedicated Scraper
 *
 * Searches PharmEasy for every drug in the DB and stores:
 *   - Live price in drug_prices (upserted on drug_id + portal)
 *   - Product ID + URL back into drugs.source_pharmeasy_id/url
 *
 * Structure confirmed working (Mar 2026):
 *   GET https://pharmeasy.in/search/all?name=<query>
 *   → HTML page with __NEXT_DATA__ JSON
 *   → props.pageProps.searchResults  (plain Array or numeric-keyed object)
 *   → each product: { name, slug, productId, salePriceDecimal, mrpDecimal,
 *                     discountPercent, productAvailabilityFlags.isAvailable }
 *   → product URL: https://pharmeasy.in/online-pharmacy/medicines/<slug>
 *
 * Usage:
 *   node src/scraper-pharmeasy.js                     -- resume (skip already priced)
 *   node src/scraper-pharmeasy.js --refresh           -- re-check every drug
 *   node src/scraper-pharmeasy.js --offset=500        -- start from drug #500
 *   node src/scraper-pharmeasy.js --limit=100         -- only process 100 drugs
 *   node src/scraper-pharmeasy.js --delay=1000        -- 1 sec between requests
 *   node src/scraper-pharmeasy.js --category=Antidiabetic  -- one category only
 */

'use strict';

const path = require('path');
const fs   = require('fs');

// ── Load .env ─────────────────────────────────────────────────────────────────
try {
  const envFile = path.resolve(__dirname, '../../apps/api/.env');
  if (fs.existsSync(envFile)) {
    fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
      const m = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
      if (m && !process.env[m[1]])
        process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    });
  }
} catch { /* ignore */ }

const axios    = require('axios');
const { Pool } = require('pg');

const DB = new Pool({
  connectionString: process.env.DATABASE_URL ||
    'postgresql://postgres:5432@localhost:5432/medicines_discount',
});

// ── Parse CLI args ────────────────────────────────────────────────────────────
const argv      = process.argv.slice(2);
const REFRESH   = argv.includes('--refresh');
const OFFSET    = +(argv.find(a => a.startsWith('--offset='))?.split('=')[1]   ?? 0);
const LIMIT     = +(argv.find(a => a.startsWith('--limit='))?.split('=')[1]    ?? 999999);
const DELAY_MS  = +(argv.find(a => a.startsWith('--delay='))?.split('=')[1]    ?? 700);
const CATEGORY  = argv.find(a => a.startsWith('--category='))?.split('=')[1]  ?? null;

// ── Logging ───────────────────────────────────────────────────────────────────
const logsDir = path.resolve(__dirname, '../logs');
if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir, { recursive: true });
const logPath = path.join(logsDir, `pharmeasy-${new Date().toISOString().slice(0,10)}.log`);
const logStream = fs.createWriteStream(logPath, { flags: 'a' });

function log(msg) {
  process.stdout.write(msg + '\n');
  logStream.write(`[${new Date().toISOString()}] ${msg}\n`);
}

// ── Utilities ─────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms));

const normalize = t => (t || '').toLowerCase().trim().replace(/\s+/g, ' ');

const SALT_SUFFIXES = new Set([
  'hydrochloride','hcl','sodium','potassium','calcium','magnesium',
  'sulphate','sulfate','phosphate','acetate','citrate','tartrate',
  'maleate','fumarate','succinate','gluconate','lactate','carbonate',
  'trihydrate','monohydrate','dihydrate','anhydrous','base',
  'bromide','chloride','iodide','nitrate','oxide',
]);

function primaryMolecule(saltName) {
  return normalize(saltName)
    .split(/[\s+]+/)
    .filter(w => !SALT_SUFFIXES.has(w) && w.length > 2)
    .join(' ');
}

function buildSearchTerms(saltName, strength) {
  const mol = primaryMolecule(saltName);
  const terms = strength ? [`${mol} ${strength}`, mol] : [mol];
  return [...new Set(terms)];
}

// All primary-molecule words must appear in result
function isStrictMatch(text, saltName) {
  const words  = primaryMolecule(saltName).split(' ').filter(w => w.length > 3);
  const normed = normalize(text);
  return words.length > 0 && words.every(w => normed.includes(w));
}

// Combo: at least one ingredient molecule must appear in result
function isComboMatch(text, saltName) {
  const parts = saltName.split(/[+&]/).map(p => primaryMolecule(p.trim())).filter(Boolean);
  const normed = normalize(text);
  return parts.some(mol =>
    mol.split(' ').filter(w => w.length > 3).every(w => normed.includes(w))
  );
}

// ── PharmEasy fetcher ─────────────────────────────────────────────────────────
const BASE_HEADERS = {
  'User-Agent':      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept':          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-IN,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection':      'keep-alive',
  'Referer':         'https://pharmeasy.in/',
};

function extractNextData(html) {
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

// Fetch search results for a query; returns raw product objects with prices
async function fetchResults(query) {
  const res = await axios.get('https://pharmeasy.in/search/all', {
    params:  { name: query },
    headers: BASE_HEADERS,
    timeout: 15000,
  });

  const nd       = extractNextData(res.data);
  const sr       = nd?.props?.pageProps?.searchResults ?? {};
  const raw      = Array.isArray(sr) ? sr : Object.values(sr);

  // Only keep entries that are priced medicine products (filter out lab tests etc.)
  return raw.filter(p =>
    p && typeof p === 'object' && p.name && p.slug &&
    (parseFloat(p.salePriceDecimal) > 0 || parseFloat(p.mrpDecimal) > 0)
  );
}

function toResult(p, matchPass) {
  const selling = parseFloat(p.salePriceDecimal) || null;
  const mrp     = parseFloat(p.mrpDecimal)       || null;
  return {
    // Portal identifiers
    portalProductId: String(p.productId || p.slug),
    portalUrl:       `https://pharmeasy.in/online-pharmacy/medicines/${p.slug}`,
    // Matched product info (for logging / QA)
    matchedName: p.name,
    matchPass,           // 'strict' | 'combo' | 'search-trust'
    // Prices
    sellingPrice: selling,
    mrp,
    discountPct:  parseFloat(p.discountPercent) ||
                  (selling && mrp ? Math.round((1 - selling / mrp) * 100) : null),
    inStock:      p.productAvailabilityFlags?.isAvailable !== false,
  };
}

async function searchPharmeasy(saltName, strength) {
  const terms     = buildSearchTerms(saltName, strength);
  const isCombo   = saltName.includes('+') || saltName.includes('&');

  for (const query of terms) {
    let products;
    try { products = await fetchResults(query); }
    catch { continue; }

    if (!products.length) continue;

    // ── Pass 1: strict — all primary-molecule words in name or slug ──────────
    for (const p of products) {
      if (isStrictMatch(p.name, saltName) || isStrictMatch(p.slug, saltName))
        return toResult(p, 'strict');
    }

    // ── Pass 1.5: combo — at least one ingredient matches ────────────────────
    if (isCombo) {
      for (const p of products) {
        if (isComboMatch(p.name + ' ' + p.slug, saltName))
          return toResult(p, 'combo');
      }
      // combos get no "trust" fallback — too risky for wrong matches
      continue;
    }

    // ── Pass 2: single-molecule only — trust PharmEasy's own search engine ───
    // PharmEasy returns brand names (Dolo for Paracetamol, Glycomet for Metformin).
    // Their search is accurate for single salts — take the first in-stock result.
    // Only trigger on the first (most specific) query term.
    if (query === terms[0]) {
      const best = products.find(p => p.productAvailabilityFlags?.isAvailable !== false)
                   ?? products[0];
      if (best) return toResult(best, 'search-trust');
    }
  }

  return null;
}

// ── DB writes ─────────────────────────────────────────────────────────────────
async function savePrice(drugId, r) {
  const client = await DB.connect();
  try {
    await client.query(`
      INSERT INTO drug_prices
        (drug_id, portal, portal_url, mrp, selling_price,
         discount_pct, in_stock, cashback_pct, effective_price)
      VALUES ($1, 'pharmeasy', $2, $3, $4, $5, $6, 0, $4)
      ON CONFLICT (drug_id, portal) DO UPDATE SET
        portal_url      = COALESCE(EXCLUDED.portal_url,    drug_prices.portal_url),
        mrp             = COALESCE(EXCLUDED.mrp,           drug_prices.mrp),
        selling_price   = EXCLUDED.selling_price,
        discount_pct    = EXCLUDED.discount_pct,
        in_stock        = EXCLUDED.in_stock,
        effective_price = EXCLUDED.selling_price,
        last_checked    = NOW()
    `, [drugId, r.portalUrl, r.mrp, r.sellingPrice, r.discountPct, r.inStock]);

    // Store product ID so future runs can go straight to the product page
    await client.query(`
      UPDATE drugs
      SET source_pharmeasy_id  = COALESCE(source_pharmeasy_id,  $1),
          source_pharmeasy_url = COALESCE(source_pharmeasy_url, $2),
          updated_at           = NOW()
      WHERE id = $3
    `, [r.portalProductId, r.portalUrl, drugId]);
  } finally {
    client.release();
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  const border = '═'.repeat(62);
  log(`\n${border}`);
  log(`  PharmEasy Scraper  —  ${new Date().toLocaleString('en-IN')}`);
  log(`  Mode  : ${REFRESH ? 'REFRESH ALL' : 'RESUME (skip already priced)'}`);
  log(`  Delay : ${DELAY_MS} ms   Offset: ${OFFSET}   Limit: ${LIMIT}`);
  if (CATEGORY) log(`  Filter: category = "${CATEGORY}"`);
  log(`${border}\n`);

  // Build WHERE conditions
  const conditions = ['d.is_active = TRUE'];
  const params     = [];

  if (!REFRESH) {
    conditions.push(`NOT EXISTS (
      SELECT 1 FROM drug_prices dp
      WHERE dp.drug_id = d.id AND dp.portal = 'pharmeasy'
    )`);
  }
  if (CATEGORY) {
    params.push(CATEGORY);
    conditions.push(`d.therapeutic_category ILIKE $${params.length}`);
  }

  params.push(LIMIT, OFFSET);
  const limitClause = `LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const { rows: drugs } = await DB.query(`
    SELECT id, brand_name, salt_name, strength, ja_drug_code,
           therapeutic_category, source_pharmeasy_id
    FROM drugs d
    WHERE ${conditions.join(' AND ')}
    ORDER BY therapeutic_category, salt_name
    ${limitClause}
  `, params);

  const total = drugs.length;
  log(`Drugs to process: ${total}\n`);

  if (total === 0) {
    log('Nothing to do. Use --refresh to re-check already priced drugs.');
    await DB.end();
    return;
  }

  let matched = 0, noMatch = 0, errored = 0;
  const startTime = Date.now();

  for (let i = 0; i < drugs.length; i++) {
    const drug   = drugs[i];
    const num    = OFFSET + i + 1;
    const jaCode = drug.ja_drug_code ? `JA#${drug.ja_drug_code}` : `#${drug.id}`;
    const label  = `${drug.salt_name || drug.brand_name}${drug.strength ? ' ' + drug.strength : ''}`;

    await sleep(DELAY_MS);

    try {
      const result = await searchPharmeasy(drug.salt_name || drug.brand_name, drug.strength);

      if (result?.sellingPrice) {
        await savePrice(drug.id, result);
        matched++;

        const stockTag = result.inStock ? '' : ' [OOS]';
        const passIcon = result.matchPass === 'strict'       ? '✓✓' :
                         result.matchPass === 'combo'        ? '✓~' : '~~ ';
        log(
          `[${num}/${OFFSET + total}] ${jaCode} — ${label}\n` +
          `  ${passIcon} ₹${result.sellingPrice}` +
          ` (MRP ₹${result.mrp ?? '?'})${stockTag}` +
          ` → "${result.matchedName}"`
        );
      } else {
        noMatch++;
        log(`[${num}/${OFFSET + total}] ${jaCode} — ${label}\n  ✗  no match on PharmEasy`);
      }
    } catch (err) {
      errored++;
      log(`[${num}/${OFFSET + total}] ${jaCode} — ${label}\n  ⚠  ${err.message}`);
    }

    // Rolling summary every 100 drugs
    if ((i + 1) % 100 === 0) {
      const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
      const rate    = ((i + 1) / ((Date.now() - startTime) / 1000)).toFixed(1);
      log(`\n── [${i+1}/${total}] ${matched} matched | ${noMatch} no match | ${errored} errors | ${elapsed} min | ${rate}/s ──\n`);
    }
  }

  const totalMin = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  log(`\n${border}`);
  log(`  Done in ${totalMin} min`);
  log(`  Matched : ${matched}  (✓✓ strict + ✓~ combo + ~~ search-trust)`);
  log(`  No match: ${noMatch}`);
  log(`  Errors  : ${errored}`);
  log(`  Log     : ${logPath}`);
  log(`${border}\n`);

  logStream.end();
  await DB.end();
}

main().catch(err => {
  console.error('Fatal error:', err.message);
  process.exit(1);
});
