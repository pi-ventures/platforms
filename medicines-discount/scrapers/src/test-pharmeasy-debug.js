/**
 * Quick PharmEasy diagnostics — run with:
 *   node src/test-pharmeasy-debug.js
 *
 * Shows exactly what PharmEasy returns so we can fix the scraper.
 */

const axios = require('axios');

const QUERY = 'Paracetamol';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-IN,en;q=0.9',
  'Accept-Encoding': 'gzip, deflate, br',
  'Connection': 'keep-alive',
  'Referer': 'https://pharmeasy.in/',
};

(async () => {
  console.log(`\nFetching PharmEasy search for: "${QUERY}"\n`);

  let res;
  try {
    res = await axios.get('https://pharmeasy.in/search/all', {
      params: { name: QUERY },
      headers: HEADERS,
      timeout: 20000,
    });
  } catch (err) {
    console.error('❌ Request failed:', err.message);
    if (err.response) {
      console.log('   Status:', err.response.status);
      console.log('   Body (first 500):', String(err.response.data).slice(0, 500));
    }
    process.exit(1);
  }

  const html = res.data;
  console.log('✓ HTTP status:', res.status);
  console.log('  Response size:', (html.length / 1024).toFixed(1), 'KB');
  console.log('  Content-Type:', res.headers['content-type']);

  // --- Check for bot/captcha detection ---
  if (html.includes('captcha') || html.includes('robot') || html.includes('blocked')) {
    console.log('\n⚠️  Possible bot detection (captcha/blocked/robot found in page)');
  }

  // --- Check __NEXT_DATA__ ---
  const ndMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!ndMatch) {
    console.log('\n❌ No __NEXT_DATA__ found in page');
    // Show what scripts ARE present
    const scripts = [...html.matchAll(/<script[^>]*id="([^"]+)"/g)].map(m => m[1]);
    console.log('   Script ids on page:', scripts.length ? scripts.join(', ') : '(none)');

    // Show first 1000 chars to see what kind of page we got
    console.log('\n--- First 1000 chars of response ---');
    console.log(html.slice(0, 1000));
    process.exit(1);
  }

  console.log('\n✓ Found __NEXT_DATA__');
  let nd;
  try {
    nd = JSON.parse(ndMatch[1]);
    console.log('✓ Parsed as JSON — size:', (ndMatch[1].length / 1024).toFixed(1), 'KB');
  } catch (e) {
    console.log('❌ JSON parse error:', e.message);
    console.log('Raw (first 300):', ndMatch[1].slice(0, 300));
    process.exit(1);
  }

  // --- Walk the tree showing all keys up to depth 3 ---
  function showKeys(obj, prefix, depth) {
    if (depth > 3 || !obj || typeof obj !== 'object') return;
    for (const [k, v] of Object.entries(obj)) {
      const type = Array.isArray(v) ? `Array(${v.length})` : typeof v;
      console.log(`  ${prefix}${k}: ${type}`);
      if (typeof v === 'object' && !Array.isArray(v) && depth < 3) {
        showKeys(v, prefix + '  ', depth + 1);
      }
    }
  }

  console.log('\n--- __NEXT_DATA__ structure (props.pageProps keys, depth 3) ---');
  showKeys(nd?.props?.pageProps || nd?.props || nd, '', 0);

  // --- Try to find searchResults ---
  const pp = nd?.props?.pageProps || {};
  const sr = pp.searchResults || pp.searchResult || pp.data?.searchResults || null;

  if (!sr) {
    console.log('\n❌ No searchResults found under pageProps');
    console.log('   pageProps top-level keys:', Object.keys(pp).join(', '));
  } else {
    const products = Array.isArray(sr) ? sr : Object.values(sr).filter(p => p && p.name);
    console.log(`\n✓ Found searchResults — ${products.length} products`);
    console.log('\n--- First 3 products ---');
    products.slice(0, 3).forEach((p, i) => {
      console.log(`[${i}] name="${p.name}" salePriceDecimal=${p.salePriceDecimal} mrpDecimal=${p.mrpDecimal} slug="${p.slug}"`);
    });
  }
})();
