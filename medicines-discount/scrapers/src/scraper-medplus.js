/**
 * medicines.discount — MedPlus Scraper
 * Portal: medplusin.com (South India focused, 4000+ stores)
 * Strategy: Sitemap + page scraping. MedPlus doesn't have a public API.
 */

const axios = require('axios');
const { PortalScraper, sleep, parseStrength } = require('./base');

class MedPlusScraper extends PortalScraper {
  constructor() {
    super({
      portal:      'medplus',
      portalName:  'MedPlus',
      baseUrl:     'https://www.medplusin.com',
      concurrency: 2,
      delayMs:     2500,
    });
  }

  async getProductUrls(browser) {
    console.log('Fetching MedPlus product URLs via sitemap...');
    const { parseStringPromise } = require('xml2js');
    const urls = [];

    try {
      const res = await axios.get('https://www.medplusin.com/sitemap.xml', { timeout: 15000 });
      const parsed = await parseStringPromise(res.data);
      const sitemaps = (parsed.sitemapindex?.sitemap || [])
        .map(s => s.loc[0])
        .filter(u => u.includes('medicine') || u.includes('product') || u.includes('drug'));

      for (const sm of sitemaps) {
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
    } catch (err) {
      console.log(`Sitemap failed: ${err.message}. Trying category crawl...`);
      // Category crawl fallback
      const categories = ['diabetes', 'cardiac', 'gastroenterology', 'pain-management', 'antibiotics'];
      for (const cat of categories) {
        try {
          const page = await browser.newPage();
          await page.goto(`https://www.medplusin.com/medicine-online/${cat}`, {
            waitUntil: 'domcontentloaded', timeout: 20000
          });
          const catUrls = await page.evaluate(() =>
            Array.from(document.querySelectorAll('a[href*="/medicine/"]'))
              .map(a => a.href)
          );
          urls.push(...catUrls);
          await page.close();
        } catch {}
        await sleep(1000);
      }
    }

    return [...new Set(urls)];
  }

  async scrapeProductPage(page, url) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await page.waitForTimeout(1200);

      return await page.evaluate((portalUrl) => {
        const getText = (sel) => document.querySelector(sel)?.textContent?.trim() || '';
        const getNum  = (sel) => parseFloat(getText(sel).replace(/[^0-9.]/g, '')) || null;

        const brandName    = getText('h1') || getText('.product-name') || getText('[class*="MedicineName"]');
        const saltEl       = document.querySelector('.salt-composition') || document.querySelector('[class*="salt"]');
        const mrpEl        = document.querySelector('.mrp-price') || document.querySelector('[class*="mrp"]');
        const priceEl      = document.querySelector('.selling-price') || document.querySelector('[class*="discount-price"]') || document.querySelector('[class*="price"]');

        return {
          brandName,
          saltName:     saltEl?.textContent?.trim() || '',
          packSize:     getText('.pack-size-info') || getText('[class*="packSize"]'),
          manufacturer: getText('.manufacturer') || getText('[class*="manufacturer"]'),
          mrp:          mrpEl ? parseFloat(mrpEl.textContent.replace(/[^0-9.]/g, '')) : null,
          sellingPrice: priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : null,
          inStock:      !document.querySelector('.out-of-stock') && !document.querySelector('[class*="outOfStock"]'),
          portalUrl,
        };
      }, url);
    } catch {
      return null;
    }
  }
}

if (require.main === module) {
  new MedPlusScraper().run().catch(console.error);
}

module.exports = MedPlusScraper;
