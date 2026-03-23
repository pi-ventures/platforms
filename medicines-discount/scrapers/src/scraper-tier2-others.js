/**
 * medicines.discount — Remaining Tier 2 Scrapers
 * SayaCare, Medbuzz, Generic Aadhaar, API JanAushadhi
 */

const axios = require('axios');
const { PortalScraper, sleep, parseStrength } = require('./base');

// ── SayaCare ──────────────────────────────────────────────────
class SayaCareScraper extends PortalScraper {
  constructor() {
    super({
      portal:      'sayacare',
      portalName:  'SayaCare',
      baseUrl:     'https://www.sayacare.in',
      concurrency: 2,
      delayMs:     2000,
    });
  }

  async getProductUrls(browser) {
    console.log('Fetching SayaCare URLs...');
    const { parseStringPromise } = require('xml2js');
    const urls = [];

    try {
      const res = await axios.get('https://www.sayacare.in/sitemap.xml', { timeout: 15000 });
      const parsed = await parseStringPromise(res.data);
      const smUrls = (parsed.urlset?.url || [])
        .map(u => u.loc[0])
        .filter(u => u.includes('/product') || u.includes('/medicine'));
      urls.push(...smUrls);
    } catch {}

    if (urls.length < 50) {
      // Try SayaCare search API
      const terms = ['tablet', 'capsule', 'syrup', 'generic', 'vitamin'];
      for (const term of terms) {
        try {
          const res = await axios.get(`https://www.sayacare.in/api/products/search`, {
            params: { q: term, limit: 200 },
            headers: { 'Accept': 'application/json' },
            timeout: 10000,
          });
          const products = res.data?.data || res.data?.products || [];
          for (const p of products) {
            if (p.slug || p.url) urls.push(`https://www.sayacare.in/medicine/${p.slug || p.url}`);
          }
        } catch {}
        await sleep(500);
      }
    }

    return [...new Set(urls)];
  }

  async scrapeProductPage(page, url) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1000);

      return await page.evaluate((portalUrl) => {
        const getText = (sel) => document.querySelector(sel)?.textContent?.trim() || '';
        return {
          brandName:    getText('h1') || getText('.product-name'),
          saltName:     getText('.composition, .salt-name, [class*="composition"]'),
          packSize:     getText('.pack-size, [class*="packSize"]'),
          manufacturer: getText('.manufacturer, [class*="manufacturer"]'),
          mrp:          parseFloat(getText('.mrp, [class*="mrp"]').replace(/[^0-9.]/g, '')) || null,
          sellingPrice: parseFloat(getText('.price, .selling-price, [class*="price"]').replace(/[^0-9.]/g, '')) || null,
          inStock:      !document.querySelector('.out-of-stock, [class*="outOfStock"]'),
          is_generic:   true,
          portalUrl,
        };
      }, url);
    } catch { return null; }
  }
}

// ── Medbuzz ───────────────────────────────────────────────────
class MedbuzzScraper extends PortalScraper {
  constructor() {
    super({
      portal:      'medbuzz',
      portalName:  'Medbuzz',
      baseUrl:     'https://www.medbuzz.in',
      concurrency: 2,
      delayMs:     2000,
    });
  }

  async getProductUrls(browser) {
    console.log('Fetching Medbuzz URLs...');
    const { parseStringPromise } = require('xml2js');
    const urls = [];

    // Medbuzz is a Jan Aushadhi delivery portal — get JA products
    try {
      const res = await axios.get('https://www.medbuzz.in/sitemap.xml', { timeout: 15000 });
      const parsed = await parseStringPromise(res.data);
      const directUrls = (parsed.urlset?.url || [])
        .map(u => u.loc[0])
        .filter(u => u.includes('/product') || u.includes('/medicine'));
      urls.push(...directUrls);

      const sitemaps = parsed.sitemapindex?.sitemap?.map(s => s.loc[0]) || [];
      for (const sm of sitemaps) {
        try {
          const r = await axios.get(sm, { timeout: 15000 });
          const p2 = await parseStringPromise(r.data);
          urls.push(...(p2.urlset?.url || []).map(u => u.loc[0]));
          await sleep(300);
        } catch {}
      }
    } catch {}

    // Medbuzz catalog API
    if (urls.length < 100) {
      try {
        const res = await axios.get('https://www.medbuzz.in/api/v1/products', {
          params: { category: 'jan-aushadhi', limit: 500 },
          headers: { 'Accept': 'application/json' },
          timeout: 15000,
        });
        const products = res.data?.data || res.data?.products || [];
        for (const p of products) {
          if (p.slug) urls.push(`https://www.medbuzz.in/product/${p.slug}`);
        }
      } catch {}
    }

    return [...new Set(urls)];
  }

  async scrapeProductPage(page, url) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1000);

      // Check if Jan Aushadhi delivery available
      const jaAvailable = await page.$('[class*="jan-aushadhi"], [class*="janAushadhi"], .ja-badge');

      return await page.evaluate((portalUrl, hasJa) => {
        const getText = (sel) => document.querySelector(sel)?.textContent?.trim() || '';
        return {
          brandName:    getText('h1') || getText('.product-title, .product-name'),
          saltName:     getText('.composition, .salt-info'),
          packSize:     getText('.pack-size'),
          manufacturer: getText('.manufacturer') || 'PMBI',
          mrp:          parseFloat(getText('.mrp, .original-price').replace(/[^0-9.]/g, '')) || null,
          sellingPrice: parseFloat(getText('.selling-price, .price, .final-price').replace(/[^0-9.]/g, '')) || null,
          inStock:      !document.querySelector('.out-of-stock'),
          is_generic:   true,
          is_govt_brand: hasJa,
          portalUrl,
        };
      }, url, !!jaAvailable);
    } catch { return null; }
  }
}

// ── Generic Aadhaar ───────────────────────────────────────────
class GenericAadhaarScraper extends PortalScraper {
  constructor() {
    super({
      portal:      'generic_aadhaar',
      portalName:  'Generic Aadhaar',
      baseUrl:     'https://www.genericaadhaar.com',
      concurrency: 2,
      delayMs:     2000,
    });
  }

  async getProductUrls(browser) {
    console.log('Fetching Generic Aadhaar URLs...');
    const { parseStringPromise } = require('xml2js');
    const urls = [];

    try {
      const res = await axios.get('https://www.genericaadhaar.com/sitemap.xml', { timeout: 15000 });
      const parsed = await parseStringPromise(res.data);
      const allEntries = parsed.urlset?.url || parsed.sitemapindex?.sitemap || [];

      if (parsed.sitemapindex) {
        for (const sm of allEntries.map(s => s.loc[0])) {
          try {
            const r = await axios.get(sm, { timeout: 15000 });
            const p2 = await parseStringPromise(r.data);
            const smUrls = (p2.urlset?.url || []).map(u => u.loc[0]).filter(u => u.includes('/product'));
            urls.push(...smUrls);
            await sleep(300);
          } catch {}
        }
      } else {
        urls.push(...allEntries.map(u => u.loc[0]).filter(u => u.includes('/product') || u.includes('/medicine')));
      }
    } catch {}

    // Category crawl
    if (urls.length < 100) {
      const page = await browser.newPage();
      const cats = ['tablets', 'capsules', 'syrups'];
      for (const cat of cats) {
        try {
          await page.goto(`https://www.genericaadhaar.com/${cat}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
          const catUrls = await page.evaluate(() =>
            Array.from(document.querySelectorAll('a[href*="product"]')).map(a => a.href)
          );
          urls.push(...catUrls);
        } catch {}
        await sleep(800);
      }
      await page.close();
    }

    return [...new Set(urls)];
  }

  async scrapeProductPage(page, url) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1000);
      return await page.evaluate((portalUrl) => {
        const getText = (sel) => document.querySelector(sel)?.textContent?.trim() || '';
        return {
          brandName:    getText('h1') || getText('.product-name'),
          saltName:     getText('.composition, .generic-name'),
          packSize:     getText('.pack-size, .packaging'),
          manufacturer: getText('.manufacturer'),
          mrp:          parseFloat(getText('.mrp, .original-price').replace(/[^0-9.]/g, '')) || null,
          sellingPrice: parseFloat(getText('.selling-price, .offer-price, .price').replace(/[^0-9.]/g, '')) || null,
          inStock:      !document.querySelector('.out-of-stock, .sold-out'),
          is_generic:   true,
          portalUrl,
        };
      }, url);
    } catch { return null; }
  }
}

// ── API JanAushadhi ───────────────────────────────────────────
// This portal delivers Jan Aushadhi (PMBI) products online
class ApiJanAushadhiScraper extends PortalScraper {
  constructor() {
    super({
      portal:      'api_janaushadhi',
      portalName:  'API JanAushadhi',
      baseUrl:     'https://www.apijanaushadhi.in',
      concurrency: 2,
      delayMs:     2000,
    });
  }

  async getProductUrls(browser) {
    console.log('Fetching API JanAushadhi URLs...');
    const { parseStringPromise } = require('xml2js');
    const urls = [];

    try {
      const res = await axios.get('https://www.apijanaushadhi.in/sitemap.xml', { timeout: 15000 });
      const parsed = await parseStringPromise(res.data);
      const smUrls = (parsed.urlset?.url || [])
        .map(u => u.loc[0])
        .filter(u => u.includes('/product') || u.includes('/medicine'));
      urls.push(...smUrls);
    } catch {}

    // Also try their product listing API
    try {
      const res = await axios.get('https://www.apijanaushadhi.in/api/products', {
        params: { limit: 2000 },
        headers: { 'Accept': 'application/json' },
        timeout: 15000,
      });
      const products = res.data?.data || res.data?.products || [];
      for (const p of products) {
        if (p.slug) urls.push(`https://www.apijanaushadhi.in/product/${p.slug}`);
      }
    } catch {}

    // Crawl all products page
    if (urls.length < 100) {
      const page = await browser.newPage();
      try {
        let pg = 1;
        while (pg <= 50) {
          await page.goto(`https://www.apijanaushadhi.in/medicines?page=${pg}`, {
            waitUntil: 'domcontentloaded', timeout: 20000
          });
          const pageUrls = await page.evaluate(() =>
            Array.from(document.querySelectorAll('a[href*="/product"]')).map(a => a.href)
          );
          if (pageUrls.length === 0) break;
          urls.push(...pageUrls);
          pg++;
          await sleep(600);
        }
      } catch {}
      await page.close();
    }

    return [...new Set(urls)];
  }

  async scrapeProductPage(page, url) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1000);
      return await page.evaluate((portalUrl) => {
        const getText = (sel) => document.querySelector(sel)?.textContent?.trim() || '';
        return {
          brandName:    getText('h1') || getText('.product-name'),
          saltName:     getText('.composition, .generic-name, .salt-composition'),
          packSize:     getText('.pack-size, .packaging'),
          manufacturer: getText('.manufacturer') || 'PMBI',
          mrp:          parseFloat(getText('.mrp, .original-price').replace(/[^0-9.]/g, '')) || null,
          sellingPrice: parseFloat(getText('.selling-price, .ja-price, .price').replace(/[^0-9.]/g, '')) || null,
          inStock:      !document.querySelector('.out-of-stock'),
          is_generic:   true,
          is_govt_brand: true, // API JanAushadhi only sells PMBI products
          portalUrl,
        };
      }, url);
    } catch { return null; }
  }
}

if (require.main === module) {
  const scrapers = {
    sayacare:        SayaCareScraper,
    medbuzz:         MedbuzzScraper,
    generic_aadhaar: GenericAadhaarScraper,
    api_janaushadhi: ApiJanAushadhiScraper,
  };
  const target = process.argv[2] || 'sayacare';
  const Scraper = scrapers[target];
  if (!Scraper) { console.error(`Unknown: ${target}`); process.exit(1); }
  new Scraper().run().catch(console.error);
}

module.exports = { SayaCareScraper, MedbuzzScraper, GenericAadhaarScraper, ApiJanAushadhiScraper };
