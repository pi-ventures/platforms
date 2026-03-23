/**
 * medicines.discount — Netmeds Scraper
 * Portal: netmeds.com (Reliance-owned)
 * Strategy: Netmeds has a public product API at /api/catalog
 */

const axios = require('axios');
const { PortalScraper, sleep, parseStrength } = require('./base');

class NetmedsScraper extends PortalScraper {
  constructor() {
    super({
      portal:      'netmeds',
      portalName:  'Netmeds',
      baseUrl:     'https://www.netmeds.com',
      concurrency: 3,
      delayMs:     1500,
    });
  }

  async getProductUrls(browser) {
    console.log('Fetching Netmeds category pages...');
    const urls = [];

    // Netmeds organises by therapeutic category — scrape each
    const categories = [
      'diabetes', 'cardiac', 'respiratory', 'gastro', 'pain-management',
      'antibiotics', 'thyroid', 'vitamins', 'skin-care', 'eye-ear',
      'neuro-psychiatry', 'oncology', 'urology', 'orthopaedic', 'gynaecology',
      'immunity', 'liver', 'kidney', 'surgical', 'dental',
    ];

    for (const cat of categories) {
      let page = 1;
      while (true) {
        try {
          const res = await axios.get(`https://www.netmeds.com/prescriptions/${cat}`, {
            params: { page_id: page },
            headers: {
              'User-Agent': 'Mozilla/5.0 (compatible)',
              'Accept': 'application/json, text/html',
            },
            timeout: 15000,
          });

          // Try JSON response from Netmeds API
          const data = typeof res.data === 'object' ? res.data : {};
          const products = data?.data?.catalog_list || data?.catalog_list || [];

          if (products.length === 0) break;

          for (const p of products) {
            const slug = p.seo_name || p.url_key || p.sku;
            if (slug) urls.push(`https://www.netmeds.com/prescriptions/${slug}`);
          }

          if (products.length < 20) break;
          page++;
          await sleep(600);
        } catch {
          break;
        }
      }
      console.log(`  ${cat}: collected ${urls.length} so far`);
      await sleep(500);
    }

    // Also try sitemap
    if (urls.length < 100) {
      const sitemapUrls = await this._getSitemapUrls();
      urls.push(...sitemapUrls);
    }

    return [...new Set(urls)]; // dedupe
  }

  async _getSitemapUrls() {
    const { parseStringPromise } = require('xml2js');
    const urls = [];
    try {
      const res = await axios.get('https://www.netmeds.com/sitemap.xml', { timeout: 15000 });
      const parsed = await parseStringPromise(res.data);
      const sitemaps = (parsed.sitemapindex?.sitemap || [])
        .map(s => s.loc[0])
        .filter(u => u.includes('prescription') || u.includes('medicine'));

      for (const sm of sitemaps.slice(0, 8)) {
        try {
          const r = await axios.get(sm, { timeout: 15000 });
          const p2 = await parseStringPromise(r.data);
          const smUrls = (p2.urlset?.url || []).map(u => u.loc[0]).filter(u => u.includes('/prescriptions/'));
          urls.push(...smUrls);
          await sleep(400);
        } catch {}
      }
    } catch {}
    return urls;
  }

  async scrapeProductPage(page, url) {
    try {
      // Try Netmeds product API
      const skuMatch = url.match(/prescriptions\/([^/?]+)/);
      if (skuMatch) {
        try {
          const res = await axios.get(`https://www.netmeds.com/api/prescription/medicine_detail`, {
            params: { sku: skuMatch[1] },
            headers: { 'Accept': 'application/json', 'Referer': url },
            timeout: 10000,
          });
          if (res.data?.data) return this._parseApiProduct(res.data.data, url);
        } catch {}
      }

      // Page scraping fallback
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(800);

      return await page.evaluate((portalUrl) => {
        const getText = (sel) => document.querySelector(sel)?.textContent?.trim() || '';
        const getNum  = (sel) => parseFloat(getText(sel).replace(/[^0-9.]/g, '')) || null;

        return {
          brandName:    getText('h1') || getText('.product-name') || getText('[class*="medicineName"]'),
          saltName:     getText('.composition-info') || getText('[class*="composition"]'),
          packSize:     getText('.pack-size') || getText('[class*="packSize"]'),
          manufacturer: getText('.mfg-info') || getText('[class*="manufacturer"]'),
          mrp:          getNum('.price-MRP') || getNum('[class*="mrp"]'),
          sellingPrice: getNum('.price-final') || getNum('[class*="selling"]') || getNum('[class*="price"]'),
          inStock:      !document.querySelector('.out-of-stock') && !document.querySelector('[class*="outOfStock"]'),
          portalUrl,
        };
      }, url);
    } catch {
      return null;
    }
  }

  _parseApiProduct(p, url) {
    return {
      brandName:    p.name || p.title,
      saltName:     p.salt_composition || p.composition,
      strength:     parseStrength(p.name || ''),
      packSize:     p.packing,
      dosageForm:   p.dosage_form,
      manufacturer: p.manufacturer,
      mrp:          parseFloat(p.mrp) || null,
      sellingPrice: parseFloat(p.price || p.special_price) || null,
      discountPct:  parseFloat(p.discount) || null,
      inStock:      p.availability === '1' || p.is_in_stock === true,
      portalUrl:    url,
    };
  }
}

if (require.main === module) {
  new NetmedsScraper().run().catch(console.error);
}

module.exports = NetmedsScraper;
