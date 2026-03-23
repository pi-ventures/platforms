/**
 * medicines.discount — Search-Based Price Matcher
 *
 * Instead of crawling entire catalogs (which gets blocked),
 * this takes every drug in our DB and searches for it
 * on each portal's search API. Much more reliable.
 *
 * Usage:
 *   node src/scraper-price-match.js              -- all portals
 *   node src/scraper-price-match.js pharmeasy    -- one portal
 */

const path  = require('path');
// Load .env from the API project (no dotenv dependency needed — manual parse)
try {
  const fs   = require('fs');
  const envFile = path.resolve(__dirname, '../../apps/api/.env');
  if (fs.existsSync(envFile)) {
    fs.readFileSync(envFile, 'utf8').split('\n').forEach(line => {
      const m = line.match(/^([^#=\s]+)\s*=\s*(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].trim().replace(/^["']|["']$/g, '');
    });
  }
} catch { /* ignore */ }

const axios = require('axios');
const { Pool } = require('pg');

const DB = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:5432@localhost:5432/medicines_discount',
});

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

// Chemical suffixes that pharmacies strip from display names
const SALT_SUFFIXES = [
  'hydrochloride','hcl','sodium','potassium','calcium','magnesium',
  'sulphate','sulfate','phosphate','acetate','citrate','tartrate',
  'maleate','fumarate','succinate','gluconate','lactate','carbonate',
  'trihydrate','monohydrate','dihydrate','anhydrous','base',
  'bromide','chloride','iodide','nitrate','oxide',
];

function normalize(text) {
  return (text || '').toLowerCase().trim().replace(/\s+/g, ' ');
}

// Extract the primary molecule — strip salt forms like "Hydrochloride", "Sodium" etc.
// "Metformin Hydrochloride"  → "Metformin"
// "Amoxycillin Trihydrate"   → "Amoxycillin"
// "Atorvastatin Calcium"     → "Atorvastatin"
// "Aceclofenac + Paracetamol" → "Aceclofenac Paracetamol" (keep both molecules)
function primaryMolecule(saltName) {
  const words = normalize(saltName).split(/[\s+]+/);
  const kept = words.filter(w => !SALT_SUFFIXES.includes(w) && w.length > 2);
  return kept.join(' ');
}

// Build smart search terms — tries most specific to least specific
function searchTerms(saltName, strength, brandName) {
  const primary = primaryMolecule(saltName);
  const terms = [];
  if (strength) terms.push(`${primary} ${strength}`);  // "Metformin 500mg"
  terms.push(primary);                                  // "Metformin"
  if (brandName && brandName !== saltName) {
    const bn = primaryMolecule(brandName.replace(/tablets?|capsules?|injection|ip|bp/gi, '').trim());
    if (bn && !terms.includes(bn)) terms.push(bn);
  }
  return [...new Set(terms)];
}

function similarity(a, b) {
  a = normalize(a); b = normalize(b);
  if (a === b) return 1;
  if (a.includes(b) || b.includes(a)) return 0.85;
  const wordsA = new Set(a.split(' ').filter(w => w.length > 2));
  const wordsB = new Set(b.split(' ').filter(w => w.length > 2));
  const common = [...wordsA].filter(w => wordsB.has(w)).length;
  return common / Math.max(wordsA.size, wordsB.size);
}

// Check if result name contains our primary molecule words
function isGoodMatch(resultName, saltName) {
  const primary = primaryMolecule(saltName);
  const primaryWords = primary.split(' ').filter(w => w.length > 3);
  const result = normalize(resultName);
  // All primary molecule words must appear in result
  return primaryWords.every(w => result.includes(w));
}

// ── HTML / __NEXT_DATA__ helpers ──────────────────────────────

// Both PharmEasy and 1mg now use Next.js SSR — product data is in
// <script id="__NEXT_DATA__"> JSON embedded in the HTML page.
function extractNextData(html) {
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch { return null; }
}

const HTML_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-IN,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
};

// ── Portal search functions ───────────────────────────────────

function buildPharmeasyResult(p) {
  const selling = parseFloat(p.salePriceDecimal) || null;
  const mrp     = parseFloat(p.mrpDecimal) || null;
  return {
    portal: 'pharmeasy',
    matchedName: p.name,   // logged so you can verify quality of matches
    portalProductId: String(p.productId || p.slug || ''),
    portalUrl: `https://pharmeasy.in/online-pharmacy/medicines/${p.slug}`,
    sellingPrice: selling,
    mrp,
    discountPct: parseFloat(p.discountPercent) || null,
    inStock: p.productAvailabilityFlags?.isAvailable !== false,
    cashbackPct: null,
  };
}

async function searchPharmeasy(saltName, strength, brandName) {
  for (const query of searchTerms(saltName, strength, brandName)) {
    try {
      const res = await axios.get('https://pharmeasy.in/search/all', {
        params: { name: query },
        headers: { ...HTML_HEADERS, Referer: 'https://pharmeasy.in/' },
        timeout: 15000,
      });

      const nd = extractNextData(res.data);
      const pageProps = nd?.props?.pageProps || {};

      // searchResults can now be either a plain Array or a numeric-keyed object
      const sr = pageProps.searchResults || {};
      const all = (Array.isArray(sr) ? sr : Object.values(sr))
        .filter(p => p && typeof p === 'object' && p.name &&
                     (parseFloat(p.salePriceDecimal) > 0 || parseFloat(p.mrpDecimal) > 0));

      if (all.length === 0) continue;

      // ── Pass 1: strict name/slug match (generic drug name visible) ──────
      for (const p of all) {
        if (isGoodMatch(p.name, saltName) || isGoodMatch(p.slug || '', saltName)) {
          return buildPharmeasyResult(p);
        }
      }

      // ── Pass 2: trust PharmEasy's search engine ──────────────────────────
      // PharmEasy returns brand-name products for generic searches
      // (e.g. "Dolo 650mg" for "Paracetamol"). Their search is accurate —
      // take the first in-stock result with a valid price.
      // Only do this on the first (most specific) search term to avoid
      // picking up completely unrelated results on broad fallback queries.
      if (query === searchTerms(saltName, strength, brandName)[0]) {
        const best = all.find(p => p.productAvailabilityFlags?.isAvailable !== false) || all[0];
        if (best) return buildPharmeasyResult(best);
      }

    } catch { /* try next query */ }
  }
  return null;
}

async function search1mg(saltName, strength, brandName) {
  for (const query of searchTerms(saltName, strength, brandName)) {
    try {
      const res = await axios.get('https://www.1mg.com/search/all', {
        params: { name: query },
        headers: { ...HTML_HEADERS, Referer: 'https://www.1mg.com/' },
        timeout: 15000,
      });
      const html = res.data;

      // ── Strategy 1: window.__PRELOADED_STATE__ (single-quoted encoded JSON) ──
      // 1mg does NOT use Next.js __NEXT_DATA__; it uses a Redux PRELOADED_STATE
      const psMatch = html.match(/window\.__PRELOADED_STATE__\s*=\s*'([\s\S]+?)'\s*;/);
      if (psMatch) {
        try {
          // Value is a JSON string with escape sequences (\\u, \\x, etc.)
          const raw = psMatch[1]
            .replace(/\\x([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)))
            .replace(/\\u([0-9A-Fa-f]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
          const state = JSON.parse(raw);

          // Walk the state tree looking for an array of products
          function findArr(obj, depth) {
            if (depth > 6 || !obj || typeof obj !== 'object') return null;
            if (Array.isArray(obj) && obj.length > 0 &&
                obj[0] && ('name' in obj[0] || 'title' in obj[0])) return obj;
            for (const v of Object.values(obj)) {
              const f = findArr(v, depth + 1);
              if (f) return f;
            }
            return null;
          }
          const products = findArr(state, 0) || [];
          for (const p of products) {
            const name = p.name || p.title || '';
            if (!isGoodMatch(name, saltName)) continue;
            const selling = parseFloat(p.discountedPrice || p.selling_price || p.price) || null;
            const mrp     = parseFloat(p.mrp || p.maxRetailPrice) || null;
            const slug    = p.slug || '';
            return {
              portal: '1mg',
              portalProductId: String(p.id || p.sku || ''),
              portalUrl: slug ? `https://www.1mg.com/drugs/${slug}` : null,
              sellingPrice: selling,
              mrp,
              discountPct: (selling && mrp && mrp > selling) ? Math.round((1 - selling/mrp)*100) : null,
              inStock: p.is_available !== false && p.outOfStock !== true,
              cashbackPct: null,
            };
          }
        } catch { /* parse failed, fall through */ }
      }

      // ── Strategy 2: Scan HTML for /drugs/<slug>-<id> links + nearby JSON prices ──
      // 1mg SSR renders drug links even when JS state is obfuscated.
      // Prices appear as JSON fields  "discountedPrice":"41.2"  near the link.
      const drugLinkRe = /href="(\/drugs\/[a-z0-9\-]+-(\d+))"/gi;
      let m;
      const seen = new Set();

      while ((m = drugLinkRe.exec(html)) !== null) {
        const relUrl    = m[1];
        const productId = m[2];
        if (seen.has(productId)) continue;
        seen.add(productId);

        // Look in a window around the link
        const start = Math.max(0, m.index - 800);
        const ctx   = html.slice(start, m.index + 1200);

        // Name: from JSON field or HTML class
        const nameJson = ctx.match(/"name"\s*:\s*"([^"]{5,80})"/);
        const nameHtml = ctx.match(/class="[^"]*(?:name|title)[^"]*"[^>]*>([^<]{5,60})</i);
        const name     = (nameJson?.[1] || nameHtml?.[1] || '').trim();
        if (!name || !isGoodMatch(name, saltName)) continue;

        // Prices: try JSON fields then ₹ symbol
        const dpMatch  = ctx.match(/"discountedPrice"\s*:\s*"?([\d.]+)"?/);
        const mrpMatch = ctx.match(/"mrp"\s*:\s*"?([\d.]+)"?/);
        const selling  = dpMatch  ? parseFloat(dpMatch[1])  : null;
        const mrp      = mrpMatch ? parseFloat(mrpMatch[1]) : null;
        if (!selling) continue;

        return {
          portal: '1mg',
          portalProductId: productId,
          portalUrl: `https://www.1mg.com${relUrl}`,
          sellingPrice: selling,
          mrp: mrp || selling,
          discountPct: (selling && mrp && mrp > selling) ? Math.round((1 - selling/mrp)*100) : null,
          inStock: !ctx.match(/out[\s-]of[\s-]stock/i),
          cashbackPct: null,
        };
      }
    } catch { /* try next query */ }
  }
  return null;
}

async function searchNetmeds(saltName, strength, brandName) {
  // Helper: walk a JSON object tree looking for a product array
  function findProductArr(obj, depth) {
    if (depth > 6 || !obj || typeof obj !== 'object') return null;
    if (Array.isArray(obj) && obj.length > 0 && obj[0] &&
        ('name' in obj[0] || 'product_name' in obj[0] || 'sku' in obj[0])) return obj;
    for (const v of Object.values(obj)) {
      const f = findProductArr(v, depth + 1);
      if (f) return f;
    }
    return null;
  }

  function makeResult(p) {
    const name     = p.name || p.product_name || p.title || '';
    const urlKey   = p.url_key || p.urlKey || p.sku || '';
    const selling  = parseFloat(p.selling_price || p.special_price || p.price) || null;
    const mrp      = parseFloat(p.mrp || p.price) || null;
    return {
      portal: 'netmeds',
      name,
      portalProductId: String(p.id || p.sku || urlKey),
      portalUrl: p.url || (urlKey ? `https://www.netmeds.com/prescriptions/${urlKey}` : null),
      sellingPrice: selling,
      mrp,
      discountPct: parseFloat(p.discount_percent) || null,
      inStock: p.availability !== 'out_of_stock' && p.is_in_stock !== false,
      cashbackPct: null,
    };
  }

  for (const query of searchTerms(saltName, strength, brandName)) {
    // ── Strategy 1: JSON API endpoints (several variants tried) ────────────
    const apiVariants = [
      {
        url: 'https://www.netmeds.com/api/v1/page/full/search',
        params: { q: query, offset: 0, limit: 10, sort: 'relevance' },
        headers: { ...HTML_HEADERS, 'x-requested-with': 'XMLHttpRequest', 'x-domain-id': '1' },
      },
      {
        url: 'https://www.netmeds.com/api/v2/page/full/search',
        params: { q: query, offset: 0, limit: 10 },
        headers: { ...HTML_HEADERS, 'x-requested-with': 'XMLHttpRequest', 'x-domain-id': '1' },
      },
      {
        url: 'https://www.netmeds.com/api/v1/products/search',
        params: { q: query, limit: 10 },
        headers: { ...HTML_HEADERS, 'Accept': 'application/json' },
      },
      {
        url: 'https://search.netmeds.com/searchresult/getResult',
        params: { searchKey: query, pageIndex: 0, pageSize: 10 },
        headers: { ...HTML_HEADERS, 'Accept': 'application/json' },
      },
    ];

    for (const v of apiVariants) {
      try {
        const res = await axios.get(v.url, { params: v.params, headers: v.headers, timeout: 10000 });
        if (!res.data || typeof res.data !== 'object') continue;
        const products = findProductArr(res.data, 0);
        if (!products) continue;
        for (const p of products) {
          const r = makeResult(p);
          if (isGoodMatch(r.name, saltName) && r.sellingPrice) return r;
        }
      } catch { /* try next variant */ }
    }

    // ── Strategy 2: Scan the SSR HTML for embedded inline JSON arrays ───────
    // Netmeds renders a skeleton page; occasionally some product data leaks
    // into window.* variables or script tags before the SPA hydrates.
    try {
      const res = await axios.get('https://www.netmeds.com/catalogsearch/result', {
        params: { q: query },
        headers: { ...HTML_HEADERS, Referer: 'https://www.netmeds.com/' },
        timeout: 20000,
      });
      const html = res.data;

      const htmlPatterns = [
        /window\.catalogue\s*=\s*(\[[\s\S]{10,200000}?\]);/,
        /window\.searchResult\s*=\s*(\{[\s\S]{10,200000}?\});/,
        /"catalogue"\s*:\s*(\[[\s\S]{10,200000}?\])\s*[,}]/,
        /"searchProducts"\s*:\s*(\[[\s\S]{10,200000}?\])\s*[,}]/,
        /"medicines"\s*:\s*(\[[\s\S]{10,200000}?\])\s*[,}]/,
        /"products"\s*:\s*(\[[^\[\]]{200,200000}?\])\s*[,}]/,  // must be non-empty (>200 chars)
        /"items"\s*:\s*(\[[^\[\]]{200,200000}?\])\s*[,}]/,
      ];

      for (const re of htmlPatterns) {
        const m = html.match(re);
        if (!m) continue;
        try {
          const parsed = JSON.parse(m[1]);
          const arr = Array.isArray(parsed) ? parsed : findProductArr(parsed, 0);
          if (!arr || arr.length === 0) continue;
          for (const p of arr) {
            const r = makeResult(p);
            if (isGoodMatch(r.name, saltName) && r.sellingPrice) return r;
          }
        } catch { /* parse error */ }
      }
    } catch { /* network error */ }
  }
  return null;
}

async function searchApollo(saltName, strength, brandName) {
  const APOLLO_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-IN,en;q=0.9',
    'Referer': 'https://www.apollopharmacy.in/',
    'Origin': 'https://www.apollopharmacy.in',
  };

  function pickResult(p) {
    const name    = p.name || p.productName || p.title || '';
    const urlKey  = p.url_key || p.urlKey || p.sku || '';
    const price   = parseFloat(
      p.selling_price || p.discounted_price ||
      p.price?.regularPrice?.amount || p.price || 0
    ) || null;
    const mrp     = parseFloat(p.mrp || p.max_retail_price || price) || null;
    return {
      portal: 'apollo',
      name,
      portalProductId: String(p.id || p.sku || urlKey),
      portalUrl: urlKey
        ? `https://www.apollopharmacy.in/otc/${urlKey}`
        : `https://www.apollopharmacy.in/medicine/${urlKey}`,
      sellingPrice: price,
      mrp,
      discountPct: (price && mrp && mrp > price) ? Math.round((1 - price/mrp)*100) : null,
      inStock: p.stock_status !== 'OUT_OF_STOCK' && p.inStock !== false,
      cashbackPct: null,
    };
  }

  for (const query of searchTerms(saltName, strength, brandName)) {
    // ── Strategy 1: Apollo REST/JSON search endpoints ─────────────────────
    const apiVariants = [
      // Their mobile / internal search API (most reliable as of early 2025)
      {
        url: 'https://www.apollopharmacy.in/api/products/search',
        params: { searchQuery: query, pageSize: 10, currentPage: 1 },
        headers: APOLLO_HEADERS,
      },
      // Older endpoint (still seen in some network traces)
      {
        url: 'https://www.apollopharmacy.in/pharmacy/pc/search',
        params: { q: query, currentPage: 1, pageSize: 10 },
        headers: { ...APOLLO_HEADERS, 'store': 'default' },
      },
      // GraphQL (Apollo uses Magento 2 GraphQL under the hood)
      {
        url: 'https://www.apollopharmacy.in/graphql',
        method: 'post',
        data: {
          query: `{products(search:"${query.replace(/"/g,'')}",pageSize:10){items{name sku url_key selling_price mrp stock_status}}}`,
        },
        headers: { ...APOLLO_HEADERS, 'Content-Type': 'application/json', 'store': 'default' },
      },
    ];

    for (const v of apiVariants) {
      try {
        const res = v.method === 'post'
          ? await axios.post(v.url, v.data, { headers: v.headers, timeout: 12000 })
          : await axios.get(v.url, { params: v.params, headers: v.headers, timeout: 12000 });

        if (!res.data || typeof res.data !== 'object') continue;
        const d = res.data;

        // Handle GraphQL shape
        const items =
          d.data?.products?.items ||
          d.data?.productList?.items ||
          d.products?.items ||
          d.data?.items ||
          d.items ||
          d.products ||
          [];

        if (!Array.isArray(items) || items.length === 0) continue;
        for (const p of items) {
          const r = pickResult(p);
          if (isGoodMatch(r.name, saltName) && r.sellingPrice) return r;
        }
      } catch { /* try next variant */ }
    }

    // ── Strategy 2: Parse __NEXT_DATA__ or Apollo's HTML page ────────────
    try {
      const res = await axios.get('https://www.apollopharmacy.in/search-medicines', {
        params: { searchQuery: query },
        headers: { ...APOLLO_HEADERS, Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8' },
        timeout: 15000,
      });
      const html = res.data;

      // Apollo uses Next.js — check __NEXT_DATA__
      const nd = extractNextData(html);
      if (nd) {
        const pp = nd?.props?.pageProps || {};
        const products =
          pp.searchResult?.products?.items ||
          pp.products?.items ||
          pp.items ||
          [];
        for (const p of products) {
          const r = pickResult(p);
          if (isGoodMatch(r.name, saltName) && r.sellingPrice) return r;
        }
      }
    } catch { /* network error */ }
  }
  return null;
}

// ── Portal registry ───────────────────────────────────────────

const SEARCH_PORTALS = [
  { key: 'pharmeasy', fn: searchPharmeasy, delay: 800 },
  { key: '1mg',       fn: search1mg,       delay: 1000 },
  { key: 'netmeds',   fn: searchNetmeds,   delay: 800 },
  { key: 'apollo',    fn: searchApollo,    delay: 800 },
];

// ── Save price to DB ──────────────────────────────────────────

// Map portal key -> drugs table column names for product ID + URL
const PORTAL_ID_COLUMNS = {
  'pharmeasy': { id: 'source_pharmeasy_id', url: 'source_pharmeasy_url' },
  '1mg':       { id: 'source_1mg_id',       url: 'source_1mg_url'       },
  'netmeds':   { id: 'source_netmeds_id',   url: 'source_netmeds_url'   },
  'apollo':    { id: 'source_apollo_id',    url: 'source_apollo_url'    },
  'medplus':   { id: 'source_medplus_id',   url: 'source_medplus_url'   },
};

async function savePrice(drugId, result) {
  if (!result || !result.sellingPrice) return false;

  const client = await DB.connect();
  try {
    // 1. Save price row
    await client.query(`
      INSERT INTO drug_prices (
        drug_id, portal, portal_url, mrp, selling_price,
        discount_pct, in_stock, cashback_pct, effective_price
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      ON CONFLICT (drug_id, portal) DO UPDATE SET
        portal_url      = COALESCE(EXCLUDED.portal_url, drug_prices.portal_url),
        mrp             = COALESCE(EXCLUDED.mrp, drug_prices.mrp),
        selling_price   = EXCLUDED.selling_price,
        discount_pct    = EXCLUDED.discount_pct,
        in_stock        = EXCLUDED.in_stock,
        effective_price = EXCLUDED.effective_price,
        last_checked    = NOW()
    `, [
      drugId,
      result.portal,
      result.portalUrl,
      result.mrp,
      result.sellingPrice,
      result.discountPct,
      result.inStock !== false,
      result.cashbackPct || 0,
      result.sellingPrice,
    ]);

    // 2. Store portal product ID back into drugs table so future runs
    //    can directly hit the product page instead of searching again
    const cols = PORTAL_ID_COLUMNS[result.portal];
    if (cols && result.portalProductId) {
      await client.query(`
        UPDATE drugs
        SET ${cols.id}  = COALESCE(${cols.id}, $1),
            ${cols.url} = COALESCE(${cols.url}, $2),
            updated_at  = NOW()
        WHERE id = $3
      `, [result.portalProductId, result.portalUrl, drugId]);
    }

    return true;
  } finally {
    client.release();
  }
}

// ── Main ─────────────────────────────────────────────────────

async function main() {
  const targetPortal = process.argv[2] || null;

  const portals = targetPortal
    ? SEARCH_PORTALS.filter(p => p.key === targetPortal)
    : SEARCH_PORTALS;

  if (!portals.length) {
    console.log(`Unknown portal: ${targetPortal}`);
    console.log('Available:', SEARCH_PORTALS.map(p => p.key).join(', '));
    process.exit(1);
  }

  // Get all drugs from DB — include ja_drug_code for logging/reference
  const client = await DB.connect();
  const { rows: drugs } = await client.query(`
    SELECT id, brand_name, salt_name, strength, ja_drug_code,
           source_pharmeasy_id, source_1mg_id, source_netmeds_id, source_apollo_id
    FROM drugs
    WHERE is_active = TRUE
    ORDER BY therapeutic_category, salt_name
  `);
  client.release();

  console.log(`Found ${drugs.length} drugs in DB`);
  console.log(`Searching on: ${portals.map(p => p.key).join(', ')}\n`);

  let totalFound = 0;
  let drugNo = 0;

  // Drug-first: one medicine searched across ALL portals, then move to next
  for (const drug of drugs) {
    drugNo++;
    const searchName = drug.salt_name || drug.brand_name;
    const jaCode = drug.ja_drug_code ? `JA#${drug.ja_drug_code}` : `#${drug.id}`;
    const label = `${searchName}${drug.strength ? ' ' + drug.strength : ''}`;

    console.log(`\n[${drugNo}/${drugs.length}] ${jaCode} — ${label}`);

    let found = 0;
    for (const portal of portals) {
      await sleep(portal.delay);
      const result = await portal.fn(searchName, drug.strength, drug.brand_name);
      if (result && result.sellingPrice) {
        const saved = await savePrice(drug.id, result);
        if (saved) {
          found++;
          const matchedLabel = result.matchedName ? ` → "${result.matchedName}"` : '';
          console.log(`  ✓ ${portal.key.padEnd(12)} ₹${result.sellingPrice} (MRP ₹${result.mrp || '?'})${result.inStock ? '' : ' OOS'}${matchedLabel}`);
        }
      } else {
        console.log(`  ✗ ${portal.key}`);
      }
    }

    totalFound += found;
  }

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Done. ${drugNo} drugs searched, ${totalFound} prices saved.`);
  await DB.end();
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
