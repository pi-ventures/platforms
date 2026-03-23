/**
 * medicines.discount — Apollo Pharmacy Scraper
 * Portal: apollopharmacy.in
 * Apollo has a product search API + sitemap
 */

const axios = require('axios');
const { PortalScraper, sleep, parseStrength } = require('./base');

class ApolloPharmacyScraper extends PortalScraper {
  constructor() {
    super({
      portal:      'apollo',
      portalName:  'Apollo Pharmacy',
      baseUrl:     'https://www.apollopharmacy.in',
      concurrency: 2,
      delayMs:     2000,
    });
  }

  async getProductUrls(browser) {
    console.log('Fetching Apollo Pharmacy product URLs...');
    const urls = [];

    // Apollo Search API
    const queryTerms = [
      'tablet', 'capsule', 'syrup', 'injection', 'cream', 'ointment',
      'metformin', 'atorvastatin', 'amlodipine', 'losartan', 'pantoprazole',
      'vitamin', 'calcium', 'iron', 'antibiotic', 'antifungal',
    ];

    for (const term of queryTerms) {
      let page = 1;
      while (page <= 20) {
        try {
          const res = await axios.get('https://www.apollopharmacy.in/api/search', {
            params: { searchQuery: term, page, pageSize: 50 },
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (compatible)',
            },
            timeout: 15000,
          });

          const products = res.data?.data?.products || res.data?.products || [];
          if (!products.length) break;

          for (const p of products) {
            const slug = p.url || p.slug || p.id;
            if (slug) {
              const fullUrl = slug.startsWith('http') ? slug : `https://www.apollopharmacy.in/medicine/${slug}`;
              urls.push(fullUrl);
            }
          }

          if (products.length < 50) break;
          page++;
          await sleep(700);
        } catch {
          break;
        }
      }
      await sleep(400);
    }

    // Sitemap fallback
    if (urls.length < 500) {
      const smUrls = await this._getSitemapUrls();
      urls.push(...smUrls);
    }

    return [...new Set(urls)];
  }

  async _getSitemapUrls() {
    const { parseStringPromise } = require('xml2js');
    const urls = [];
    try {
      const res = await axios.get('https://www.apollopharmacy.in/sitemap.xml', { timeout: 15000 });
      const parsed = await parseStringPromise(res.data);
      const sitemaps = (parsed.sitemapindex?.sitemap || [])
        .map(s => s.loc[0])
        .filter(u => u.includes('medicine') || u.includes('product'));

      for (const sm of sitemaps.slice(0, 10)) {
        try {
          const r = await axios.get(sm, { timeout: 15000 });
          const p2 = await parseStringPromise(r.data);
          const smUrls = (p2.urlset?.url || [])
            .map(u => u.loc[0])
            .filter(u => u.includes('/medicine/') || u.includes('/product/'));
          urls.push(...smUrls);
          await sleep(400);
        } catch {}
      }
    } catch {}
    return urls;
  }

  async scrapeProductPage(page, url) {
    try {
      // Try Apollo product API
      const idMatch = url.match(/\/([A-Z0-9]+)(?:\?|$)/);
      if (idMatch) {
        try {
          const res = await axios.get(`https://www.apollopharmacy.in/api/product/${idMatch[1]}`, {
            headers: { 'Accept': 'application/json' },
            timeout: 10000,
          });
          if (res.data?.data) return this._parseApiProduct(res.data.data, url);
        } catch {}
      }

      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1000);

      return await page.evaluate((portalUrl) => {
        const getText = (sel) => document.querySelector(sel)?.textContent?.trim() || '';
        const getNum  = (sel) => parseFloat(getText(sel).replace(/[^0-9.]/g, '')) || null;

        return {
          brandName:    getText('h1') || getText('[class*="productName"]') || getText('[data-testid="product-name"]'),
          saltName:     getText('[class*="saltInfo"]') || getText('[class*="composition"]') || getText('[data-testid="composition"]'),
          packSize:     getText('[class*="packSize"]') || getText('[data-testid="pack-size"]'),
          manufacturer: getText('[class*="manufacturer"]') || getText('[data-testid="manufacturer"]'),
          mrp:          getNum('[class*="mrp"]') || getNum('[data-testid="mrp"]'),
          sellingPrice: getNum('[class*="discountedPrice"]') || getNum('[class*="price"]') || getNum('[data-testid="price"]'),
          inStock:      !document.querySelector('[class*="outOfStock"]') && !document.querySelector('[data-testid="out-of-stock"]'),
          portalUrl,
        };
      }, url);
    } catch {
      return null;
    }
  }

  _parseApiProduct(p, url) {
    return {
      brandName:    p.name || p.productName,
      saltName:     p.saltComposition || p.genericName,
      strength:     parseStrength(p.name || ''),
      packSize:     p.packSize || p.packing,
      dosageForm:   p.productForm || p.type,
      manufacturer: p.manufacturer,
      mrp:          parseFloat(p.mrp) || null,
      sellingPrice: parseFloat(p.price || p.discountedPrice) || null,
      discountPct:  parseFloat(p.discountPercent) || null,
      inStock:      p.inStock !== false,
      portalUrl:    url,
    };
  }
}

if (require.main === module) {
  new ApolloPharmacyScraper().run().catch(console.error);
}

module.exports = ApolloPharmacyScraper;
