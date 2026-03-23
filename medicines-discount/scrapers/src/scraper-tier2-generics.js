/**
 * medicines.discount — Generic Portal Scrapers (Tier 2)
 * Truemeds, Medkart, Zeelab Pharmacy
 * These are generic-focused portals — important for savings comparison
 */

const axios = require('axios');
const { PortalScraper, sleep, parseStrength } = require('./base');

// ── Truemeds ──────────────────────────────────────────────────
class TruemedisScraper extends PortalScraper {
  constructor() {
    super({
      portal:      'truemeds',
      portalName:  'Truemeds',
      baseUrl:     'https://www.truemeds.in',
      concurrency: 3,
      delayMs:     1500,
    });
  }

  async getProductUrls(browser) {
    console.log('Fetching Truemeds URLs...');
    const urls = [];

    // Truemeds has a public search API
    const salts = [
      'metformin', 'atorvastatin', 'amlodipine', 'losartan', 'telmisartan',
      'omeprazole', 'pantoprazole', 'amoxicillin', 'azithromycin', 'paracetamol',
      'ibuprofen', 'cetirizine', 'montelukast', 'levothyroxine', 'aspirin',
      'clopidogrel', 'rosuvastatin', 'metoprolol', 'glimepiride', 'sitagliptin',
    ];

    for (const salt of salts) {
      try {
        const res = await axios.get(`https://www.truemeds.in/api/search`, {
          params: { q: salt, type: 'medicine' },
          headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
          timeout: 10000,
        });
        const products = res.data?.data?.products || res.data?.products || [];
        for (const p of products) {
          const slug = p.slug || p.id;
          if (slug) urls.push(`https://www.truemeds.in/medicine/${slug}`);
        }
        await sleep(400);
      } catch {}
    }

    // Sitemap
    const { parseStringPromise } = require('xml2js');
    try {
      const res = await axios.get('https://www.truemeds.in/sitemap.xml', { timeout: 15000 });
      const parsed = await parseStringPromise(res.data);
      const smUrls = (parsed.urlset?.url || [])
        .map(u => u.loc[0])
        .filter(u => u.includes('/medicine/'));
      urls.push(...smUrls);
    } catch {}

    return [...new Set(urls)];
  }

  async scrapeProductPage(page, url) {
    try {
      const slugMatch = url.match(/medicine\/([^/?]+)/);
      if (slugMatch) {
        try {
          const res = await axios.get(`https://www.truemeds.in/api/product/${slugMatch[1]}`, {
            headers: { 'Accept': 'application/json' },
            timeout: 10000,
          });
          const p = res.data?.data;
          if (p) return {
            brandName:    p.name || p.productName,
            saltName:     p.saltComposition || p.composition,
            strength:     parseStrength(p.name || ''),
            packSize:     p.packSize || p.packaging,
            manufacturer: p.manufacturer,
            mrp:          parseFloat(p.mrp) || null,
            sellingPrice: parseFloat(p.price || p.discountedPrice) || null,
            discountPct:  parseFloat(p.discount) || null,
            inStock:      p.inStock !== false,
            is_generic:   true, // Truemeds is generic-first
            portalUrl:    url,
          };
        } catch {}
      }

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1000);

      return await page.evaluate((portalUrl) => {
        const getText = (sel) => document.querySelector(sel)?.textContent?.trim() || '';
        return {
          brandName:    getText('h1') || getText('[class*="productName"]'),
          saltName:     getText('[class*="composition"]') || getText('[class*="saltInfo"]'),
          mrp:          parseFloat(getText('[class*="mrp"]').replace(/[^0-9.]/g, '')) || null,
          sellingPrice: parseFloat(getText('[class*="price"]').replace(/[^0-9.]/g, '')) || null,
          inStock:      !document.querySelector('[class*="outOfStock"]'),
          is_generic:   true,
          portalUrl,
        };
      }, url);
    } catch {
      return null;
    }
  }
}

// ── Medkart ───────────────────────────────────────────────────
class MedkartScraper extends PortalScraper {
  constructor() {
    super({
      portal:      'medkart',
      portalName:  'Medkart',
      baseUrl:     'https://medkart.in',
      concurrency: 2,
      delayMs:     2000,
    });
  }

  async getProductUrls(browser) {
    console.log('Fetching Medkart URLs...');
    const { parseStringPromise } = require('xml2js');
    const urls = [];

    try {
      const res = await axios.get('https://medkart.in/sitemap.xml', { timeout: 15000 });
      const parsed = await parseStringPromise(res.data);
      const smUrls = (parsed.urlset?.url || parsed.sitemapindex?.sitemap || [])
        .map(u => (u.loc || u)[0])
        .filter(u => typeof u === 'string' && (u.includes('/product/') || u.includes('/medicine/')));
      urls.push(...smUrls);
    } catch {}

    // Category crawl
    const categories = ['diabetes', 'cardiac', 'gastro', 'antibiotics', 'pain'];
    const page = await browser.newPage();
    for (const cat of categories) {
      try {
        await page.goto(`https://medkart.in/category/${cat}`, { waitUntil: 'domcontentloaded', timeout: 20000 });
        await page.waitForTimeout(1000);
        const catUrls = await page.evaluate(() =>
          Array.from(document.querySelectorAll('a[href*="/product/"], a[href*="/medicine/"]'))
            .map(a => a.href)
        );
        urls.push(...catUrls);
      } catch {}
      await sleep(800);
    }
    await page.close();

    return [...new Set(urls)];
  }

  async scrapeProductPage(page, url) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1000);

      return await page.evaluate((portalUrl) => {
        const getText = (sel) => document.querySelector(sel)?.textContent?.trim() || '';
        return {
          brandName:    getText('h1') || getText('.product-title'),
          saltName:     getText('.composition') || getText('.salt-name'),
          packSize:     getText('.pack-size') || getText('.packaging'),
          manufacturer: getText('.manufacturer'),
          mrp:          parseFloat(getText('.mrp').replace(/[^0-9.]/g, '')) || null,
          sellingPrice: parseFloat(getText('.selling-price, .discounted-price, .price').replace(/[^0-9.]/g, '')) || null,
          inStock:      !document.querySelector('.out-of-stock'),
          is_generic:   true,
          portalUrl,
        };
      }, url);
    } catch {
      return null;
    }
  }
}

// ── Zeelab Pharmacy ───────────────────────────────────────────
class ZeelabScraper extends PortalScraper {
  constructor() {
    super({
      portal:      'zeelab',
      portalName:  'Zeelab Pharmacy',
      baseUrl:     'https://www.zeelabpharmacy.com',
      concurrency: 2,
      delayMs:     2000,
    });
  }

  async getProductUrls(browser) {
    console.log('Fetching Zeelab URLs...');
    const { parseStringPromise } = require('xml2js');
    const urls = [];

    try {
      const res = await axios.get('https://www.zeelabpharmacy.com/sitemap.xml', { timeout: 15000 });
      const parsed = await parseStringPromise(res.data);
      // Handle both sitemap index and direct urlset
      const sitemaps = parsed.sitemapindex?.sitemap?.map(s => s.loc[0]) || [];

      if (sitemaps.length) {
        for (const sm of sitemaps.filter(u => u.includes('product'))) {
          try {
            const r = await axios.get(sm, { timeout: 15000 });
            const p2 = await parseStringPromise(r.data);
            const smUrls = (p2.urlset?.url || []).map(u => u.loc[0]);
            urls.push(...smUrls);
            await sleep(300);
          } catch {}
        }
      } else {
        // Direct urlset
        const smUrls = (parsed.urlset?.url || []).map(u => u.loc[0]).filter(u => u.includes('/product'));
        urls.push(...smUrls);
      }
    } catch {}

    // Category crawl fallback
    if (urls.length < 50) {
      const page = await browser.newPage();
      const cats = ['tablet', 'capsule', 'syrup', 'injection'];
      for (const cat of cats) {
        try {
          await page.goto(`https://www.zeelabpharmacy.com/category/${cat}`, {
            waitUntil: 'domcontentloaded', timeout: 20000
          });
          const catUrls = await page.evaluate(() =>
            Array.from(document.querySelectorAll('a[href*="/product"]')).map(a => a.href)
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
          saltName:     getText('.composition') || getText('.ingredients'),
          packSize:     getText('.pack-size'),
          manufacturer: getText('.manufacturer'),
          mrp:          parseFloat(getText('.mrp-price, .original-price').replace(/[^0-9.]/g, '')) || null,
          sellingPrice: parseFloat(getText('.selling-price, .current-price, .price').replace(/[^0-9.]/g, '')) || null,
          inStock:      !document.querySelector('.out-of-stock, .sold-out'),
          is_generic:   true,
          portalUrl,
        };
      }, url);
    } catch {
      return null;
    }
  }
}

if (require.main === module) {
  const target = process.argv[2] || 'truemeds';
  const scrapers = { truemeds: TruemedisScraper, medkart: MedkartScraper, zeelab: ZeelabScraper };
  const Scraper = scrapers[target] || TruemedisScraper;
  new Scraper().run().catch(console.error);
}

module.exports = { TruemedisScraper, MedkartScraper, ZeelabScraper };
