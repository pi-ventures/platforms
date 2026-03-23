/**
 * Inspect PharmEasy sitemap structure.
 * Run: node src/debug-sitemap.js
 */
'use strict';
const axios = require('axios');

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/122 Safari/537.36',
  'Accept': 'text/html,application/xml,*/*',
};

(async () => {
  // Step 1: fetch sitemap index, list ALL loc entries
  console.log('=== Sitemap Index ===');
  const idx = await axios.get('https://pharmeasy.in/sitemap.xml', { headers: HEADERS, timeout: 20000 });
  const allSitemaps = [...idx.data.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  allSitemaps.forEach(u => console.log(' ', u));

  // Step 2: for each sitemap, show first 5 <loc> URLs with NO filtering
  for (const smUrl of allSitemaps) {
    console.log(`\n=== ${smUrl.split('/').pop()} ===`);
    try {
      const res = await axios.get(smUrl, { headers: HEADERS, timeout: 20000 });
      const urls = [...res.data.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
      console.log(`  Total URLs: ${urls.length}`);
      console.log('  First 8:');
      urls.slice(0, 8).forEach(u => console.log('   ', u));
    } catch (e) {
      console.log('  ERROR:', e.message);
    }
    await new Promise(r => setTimeout(r, 400));
  }
})();
