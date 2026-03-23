/**
 * medicines.discount — Flipkart Health+ Scraper
 * Portal: flipkart.com/health (part of main Flipkart)
 * Strategy: Flipkart product API / search API
 */

const axios = require('axios');
const { PortalScraper, sleep, parseStrength } = require('./base');

class FlipkartHealthScraper extends PortalScraper {
  constructor() {
    super({
      portal:      'flipkart_health',
      portalName:  'Flipkart Health+',
      baseUrl:     'https://www.flipkart.com',
      concurrency: 2,
      delayMs:     2500,
    });
  }

  async getProductUrls(browser) {
    console.log('Fetching Flipkart Health+ URLs...');
    const urls = [];

    // Flipkart Health category searches
    const searches = ['tablet medicine', 'capsule medicine', 'syrup medicine', 'vitamin supplement', 'diabetes medicine'];

    for (const query of searches) {
      let page = 1;
      while (page <= 10) {
        try {
          const res = await axios.get('https://www.flipkart.com/api/5/page/fetch', {
            params: {
              q: query,
              category: 'health',
              page,
              ajax: true,
            },
            headers: {
              'Accept': 'application/json',
              'User-Agent': 'Mozilla/5.0 (compatible)',
              'X-user-agent': 'Mozilla/5.0 (Windows NT 10.0) FKUA/website/41/website/Desktop',
            },
            timeout: 15000,
          });

          const slots = res.data?.RESPONSE?.slots || [];
          let found = 0;
          for (const slot of slots) {
            const widgets = slot.widget?.data?.products || [];
            for (const p of widgets) {
              const url = p.productInfo?.value?.urls?.get?.url;
              if (url) {
                urls.push(url.startsWith('http') ? url : `https://www.flipkart.com${url}`);
                found++;
              }
            }
          }
          if (found === 0) break;
          page++;
          await sleep(800);
        } catch {
          break;
        }
      }
      await sleep(500);
    }

    // Flipkart health sitemap
    if (urls.length < 200) {
      try {
        const { parseStringPromise } = require('xml2js');
        const res = await axios.get('https://www.flipkart.com/sitemap/fk-health-sitemap.xml', { timeout: 15000 });
        const parsed = await parseStringPromise(res.data);
        const smUrls = (parsed.urlset?.url || []).map(u => u.loc[0]);
        urls.push(...smUrls);
      } catch {}
    }

    return [...new Set(urls)];
  }

  async scrapeProductPage(page, url) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await page.waitForTimeout(2000); // Flipkart is JS-heavy

      return await page.evaluate((portalUrl) => {
        const getText = (sel) => document.querySelector(sel)?.textContent?.trim() || '';
        const getNum  = (sel) => parseFloat(getText(sel).replace(/[^0-9.]/g, '')) || null;

        // Flipkart product page structure
        const brandName    = getText('span.B_NuCI') || getText('h1') || getText('[class*="ProductName"]');
        const priceSection = document.querySelector('[class*="CEmiEL"]') || document.querySelector('[class*="price"]');
        const mrpEl        = document.querySelector('[class*="yRaY8j"]') || document.querySelector('[class*="MRP"]');
        const priceEl      = document.querySelector('[class*="Nx9bqj"]') || document.querySelector('[class*="selling-price"]');

        // Flipkart product specs
        const specs = {};
        document.querySelectorAll('[class*="RmoJbe"] tr, table tr').forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 2) {
            specs[cells[0].textContent.trim().toLowerCase()] = cells[1].textContent.trim();
          }
        });

        return {
          brandName,
          saltName:     specs['composition'] || specs['salt composition'] || specs['active ingredient'] || '',
          packSize:     specs['pack size'] || specs['pack of'] || '',
          manufacturer: specs['manufacturer'] || specs['brand'] || '',
          mrp:          mrpEl ? parseFloat(mrpEl.textContent.replace(/[^0-9.]/g, '')) : null,
          sellingPrice: priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : null,
          inStock:      !document.querySelector('[class*="out-of-stock"]') && !document.querySelector('[class*="OutOfStock"]'),
          portalUrl,
        };
      }, url);
    } catch {
      return null;
    }
  }
}

// ─────────────────────────────────────────────────────────────

/**
 * medicines.discount — Amazon Pharmacy India Scraper
 * Portal: amazon.in/pharmacy
 * Strategy: Amazon Product Advertising API or page scraping
 * Note: Amazon blocks heavily — use with proxies + low rate
 */

class AmazonPharmacyScraper extends PortalScraper {
  constructor() {
    super({
      portal:      'amazon_pharmacy',
      portalName:  'Amazon Pharmacy',
      baseUrl:     'https://www.amazon.in',
      concurrency: 1,   // Very conservative — Amazon blocks aggressively
      delayMs:     4000,
    });
  }

  async getProductUrls(browser) {
    console.log('Fetching Amazon Pharmacy product URLs...');
    const urls = [];

    // Amazon search by category
    const searches = [
      'tablet+medicine+prescription', 'vitamin+supplement+india',
      'diabetes+medicine+india', 'blood+pressure+medicine',
      'antacid+medicine+india',
    ];

    for (const query of searches) {
      const ctx = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      });
      const page = await ctx.newPage();

      try {
        await page.goto(
          `https://www.amazon.in/s?k=${query}&rh=n%3A1350380031`,  // Health & Beauty node
          { waitUntil: 'domcontentloaded', timeout: 25000 }
        );
        await page.waitForTimeout(2000);

        const pageUrls = await page.evaluate(() =>
          Array.from(document.querySelectorAll('[data-component-type="s-search-result"] h2 a'))
            .map(a => a.href)
            .filter(u => u.includes('/dp/'))
        );
        urls.push(...pageUrls);
      } catch {}

      await page.close();
      await ctx.close();
      await sleep(3000);
    }

    return [...new Set(urls)];
  }

  async scrapeProductPage(page, url) {
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      await page.waitForTimeout(2500);

      // Check for CAPTCHA
      const isCaptcha = await page.$('#captchacharacters');
      if (isCaptcha) {
        console.log(`  CAPTCHA detected: ${url}`);
        return null;
      }

      return await page.evaluate((portalUrl) => {
        const getText = (sel) => document.querySelector(sel)?.textContent?.trim() || '';
        const getNum  = (sel) => parseFloat(getText(sel).replace(/[^0-9.,]/g, '').replace(',', '')) || null;

        // Amazon product detail structure
        const brandName = getText('#productTitle') || getText('#title');
        const priceEl   = document.querySelector('.a-price .a-offscreen') || document.querySelector('#priceblock_dealprice') || document.querySelector('#priceblock_ourprice');
        const mrpEl     = document.querySelector('.a-price[data-a-strike] .a-offscreen') || document.querySelector('#listPrice');

        // Extract specs from product description table
        const specs = {};
        document.querySelectorAll('#productDetails_techSpec_section_1 tr, #detailBullets_feature_div li').forEach(row => {
          const label = row.querySelector('th, .a-text-bold')?.textContent?.trim()?.replace(/[:\s]+$/, '').toLowerCase();
          const value = row.querySelector('td, .a-list-item')?.textContent?.trim();
          if (label && value) specs[label] = value;
        });

        return {
          brandName: brandName.replace(/\[.*?\]/g, '').trim(),
          saltName:     specs['active ingredient'] || specs['composition'] || specs['generic name'] || '',
          packSize:     specs['package quantity'] || specs['unit count'] || specs['item form'] || '',
          manufacturer: specs['manufacturer'] || specs['brand'] || getText('#bylineInfo'),
          mrp:          mrpEl ? parseFloat(mrpEl.textContent.replace(/[^0-9.]/g, '')) : null,
          sellingPrice: priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : null,
          inStock:      !document.querySelector('#availability')?.textContent?.includes('Currently unavailable'),
          portalUrl,
        };
      }, url);
    } catch {
      return null;
    }
  }
}

if (require.main === module) {
  const target = process.argv[2] || 'flipkart';
  if (target === 'amazon') new AmazonPharmacyScraper().run().catch(console.error);
  else new FlipkartHealthScraper().run().catch(console.error);
}

module.exports = { FlipkartHealthScraper, AmazonPharmacyScraper };
