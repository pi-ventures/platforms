/**
 * Portal structure discovery — finds real product data keys
 * Usage: node test-portal.js "Cefixime" "100mg"
 */
const axios = require('axios');

const drug = process.argv[2] || 'Cefixime';
const strength = process.argv[3] || '100mg';
const query = `${drug} ${strength}`;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-IN,en;q=0.9',
};

function extractNextData(html) {
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  try { return JSON.parse(m[1]); } catch(e) { return null; }
}

// Recursively find first array with 3+ items that has a 'name' field
function findProductArray(obj, depth=0, path='') {
  if (depth > 6 || !obj || typeof obj !== 'object') return null;
  if (Array.isArray(obj) && obj.length >= 2 && obj[0] && typeof obj[0] === 'object' && ('name' in obj[0] || 'title' in obj[0])) {
    return { path, sample: obj[0], count: obj.length };
  }
  for (const [k, v] of Object.entries(obj)) {
    const result = findProductArray(v, depth+1, path ? `${path}.${k}` : k);
    if (result) return result;
  }
  return null;
}

async function main() {
  console.log(`Testing: "${query}"\n`);

  // ── PharmEasy ────────────────────────────────────────────────
  console.log('━'.repeat(60));
  console.log('PHARMEASY');
  try {
    const r = await axios.get('https://pharmeasy.in/search/all', {
      params: { name: drug }, // try without strength first
      headers: { ...HEADERS, Referer: 'https://pharmeasy.in/' },
      timeout: 15000,
    });
    const nd = extractNextData(r.data);
    if (nd) {
      const pp = nd?.props?.pageProps || {};
      console.log('pageProps keys:', Object.keys(pp));
      // Look inside searchResults
      const sr = pp.searchResults || pp.searchResult;
      if (sr) {
        console.log('searchResults keys:', Object.keys(sr));
        const found = findProductArray(sr, 0, 'searchResults');
        if (found) {
          console.log(`Products at: ${found.path} (${found.count} items)`);
          console.log('Sample keys:', Object.keys(found.sample));
          console.log('Sample:', JSON.stringify(found.sample).slice(0, 400));
        } else {
          console.log('searchResults value:', JSON.stringify(sr).slice(0, 600));
        }
      }
    } else {
      console.log('No __NEXT_DATA__');
    }
  } catch(e) { console.log('ERROR:', e.message); }

  // ── 1mg ─────────────────────────────────────────────────────
  console.log('\n' + '━'.repeat(60));
  console.log('1MG');
  try {
    const r = await axios.get('https://www.1mg.com/search/all', {
      params: { name: drug },
      headers: { ...HEADERS, Referer: 'https://www.1mg.com/' },
      timeout: 15000,
    });
    // Try __NEXT_DATA__ first
    const nd = extractNextData(r.data);
    if (nd) {
      const pp = nd?.props?.pageProps || {};
      console.log('pageProps keys:', Object.keys(pp));
      const found = findProductArray(pp);
      if (found) {
        console.log(`Products at: ${found.path} (${found.count} items)`);
        console.log('Sample:', JSON.stringify(found.sample).slice(0, 400));
      }
    } else {
      // Look for window.__STATE__ or window.__PRELOADED_STATE__
      const stateMatch = r.data.match(/window\.__(?:PRELOADED_)?STATE__\s*=\s*(\{[\s\S]{0,50000}?\});?\s*(?:<\/script>|window\.)/);
      if (stateMatch) {
        console.log('Found __STATE__, parsing...');
        try {
          const state = JSON.parse(stateMatch[1]);
          const found = findProductArray(state);
          if (found) {
            console.log(`Products at: ${found.path} (${found.count} items)`);
            console.log('Sample:', JSON.stringify(found.sample).slice(0, 400));
          } else {
            console.log('State keys:', Object.keys(state).slice(0, 15));
          }
        } catch(e2) { console.log('Parse error:', e2.message); }
      } else {
        // Search for any JSON array of products inline
        const jsonMatch = r.data.match(/"products"\s*:\s*(\[[\s\S]{0,5000}?\])/);
        if (jsonMatch) {
          console.log('Found "products" array in HTML');
          try {
            const prods = JSON.parse(jsonMatch[1]);
            console.log(`Count: ${prods.length}`);
            console.log('Sample:', JSON.stringify(prods[0]).slice(0, 400));
          } catch(e2) { console.log(jsonMatch[1].slice(0, 300)); }
        } else {
          console.log('No structured data found. Checking for redirect...');
          console.log('Final URL:', r.request?.res?.responseUrl || 'unknown');
          console.log('HTML snippet (contains "Cefixime"?):', r.data.includes('Cefixime') || r.data.includes('cefixime'));
        }
      }
    }
  } catch(e) { console.log('ERROR:', e.message); }

  // ── Netmeds ──────────────────────────────────────────────────
  console.log('\n' + '━'.repeat(60));
  console.log('NETMEDS');
  try {
    const r = await axios.get('https://www.netmeds.com/catalogsearch/result', {
      params: { q: drug },
      headers: { ...HEADERS, Referer: 'https://www.netmeds.com/' },
      timeout: 15000,
    });
    // Look for inline JSON product data
    const patterns = [
      [/"catalogue"\s*:\s*(\[[\s\S]{0,10000}?\](?=\s*[,}]))/,   'catalogue array'],
      [/"products"\s*:\s*(\[[\s\S]{0,10000}?\](?=\s*[,}]))/,    'products array'],
      [/"items"\s*:\s*(\[[\s\S]{0,10000}?\](?=\s*[,}]))/,       'items array'],
      [/window\.__data\s*=\s*(\{[\s\S]{0,50000}?\});/,           'window.__data'],
      [/window\.INITIAL_STATE\s*=\s*(\{[\s\S]{0,50000}?\});/,   'INITIAL_STATE'],
    ];
    let found = false;
    for (const [re, label] of patterns) {
      const m = r.data.match(re);
      if (m) {
        console.log(`Found: ${label}`);
        try {
          const data = JSON.parse(m[1]);
          const arr = Array.isArray(data) ? data : null;
          if (arr && arr.length > 0) {
            console.log(`Count: ${arr.length}, Sample:`, JSON.stringify(arr[0]).slice(0, 400));
          } else {
            const pf = findProductArray(data);
            if (pf) console.log(`Products at: ${pf.path}, Sample:`, JSON.stringify(pf.sample).slice(0, 400));
            else console.log('Keys:', Object.keys(data).slice(0,10));
          }
        } catch(e2) { console.log(m[1].slice(0, 300)); }
        found = true;
        break;
      }
    }
    if (!found) {
      const hasDrug = r.data.toLowerCase().includes(drug.toLowerCase());
      console.log(`Contains "${drug}": ${hasDrug}. HTML size: ${(r.data.length/1024).toFixed(0)}KB`);
      // Try their old API
      const api = await axios.get('https://www.netmeds.com/api/v1/page/full/search', {
        params: { q: drug, offset: 0, limit: 10 },
        headers: { ...HEADERS, 'x-requested-with': 'XMLHttpRequest' },
        timeout: 10000,
      }).catch(e => ({ data: null, status: e?.response?.status }));
      if (api.data) {
        console.log('Old API worked! Status:', api.status);
        const pf = findProductArray(api.data);
        if (pf) console.log(`Products at: ${pf.path}`, JSON.stringify(pf.sample).slice(0,300));
        else console.log(JSON.stringify(api.data).slice(0,500));
      } else {
        console.log('Old API status:', api.status);
      }
    }
  } catch(e) { console.log('ERROR:', e.message); }
}

main();
