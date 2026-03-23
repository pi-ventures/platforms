/**
 * medicines.discount — Master Scraper Orchestrator
 * Runs all 14 portal scrapers with smart scheduling:
 *
 * CATALOG RUN (weekly): Full product discovery, new drugs
 * PRICE RUN (daily):    Just update prices for existing drugs
 * STOCK RUN (6-hourly): In-stock / out-of-stock updates
 *
 * Usage:
 *   node run-all.js catalog     # Full catalog scrape (slow, weekly)
 *   node run-all.js prices      # Price-only update (fast, daily)
 *   node run-all.js stock       # Stock check only (fastest, 6-hourly)
 *   node run-all.js single pharmeasy  # Run one portal
 */

const { DB } = require('./base');

// ── Import all scrapers ───────────────────────────────────────

// Tier 1 — Branded
const Scraper1mg           = require('./scraper-1mg-catalog');     // handled by existing scraper
const PharmEasyScraper     = require('./scraper-pharmeasy');
const NetmedsScraper       = require('./scraper-netmeds');
const ApolloPharmacyScraper= require('./scraper-apollo');
const MedPlusScraper       = require('./scraper-medplus');
const { FlipkartHealthScraper, AmazonPharmacyScraper } = require('./scraper-fk-amazon');

// Tier 2 — Generic focused
const { TruemedisScraper, MedkartScraper, ZeelabScraper } = require('./scraper-tier2-generics');
const { SayaCareScraper, MedbuzzScraper, GenericAadhaarScraper, ApiJanAushadhiScraper } = require('./scraper-tier2-others');

// ── Portal registry ───────────────────────────────────────────

const ALL_PORTALS = [
  // Tier 1 — run first, highest volume
  { key: '1mg',            Scraper: null,                   tier: 1, priority: 1, note: 'Use scraper-1mg-catalog.js' },
  { key: 'pharmeasy',      Scraper: PharmEasyScraper,        tier: 1, priority: 2 },
  { key: 'netmeds',        Scraper: NetmedsScraper,          tier: 1, priority: 3 },
  { key: 'apollo',         Scraper: ApolloPharmacyScraper,   tier: 1, priority: 4 },
  { key: 'medplus',        Scraper: MedPlusScraper,          tier: 1, priority: 5 },
  { key: 'flipkart_health',Scraper: FlipkartHealthScraper,   tier: 1, priority: 6 },
  { key: 'amazon_pharmacy',Scraper: AmazonPharmacyScraper,   tier: 1, priority: 7, rateLimit: 'slow' },

  // Tier 2 — Generic focused (critical for savings comparison)
  { key: 'truemeds',       Scraper: TruemedisScraper,        tier: 2, priority: 8 },
  { key: 'medkart',        Scraper: MedkartScraper,          tier: 2, priority: 9 },
  { key: 'zeelab',         Scraper: ZeelabScraper,           tier: 2, priority: 10 },
  { key: 'sayacare',       Scraper: SayaCareScraper,         tier: 2, priority: 11 },
  { key: 'medbuzz',        Scraper: MedbuzzScraper,          tier: 2, priority: 12 },
  { key: 'generic_aadhaar',Scraper: GenericAadhaarScraper,   tier: 2, priority: 13 },
  { key: 'api_janaushadhi',Scraper: ApiJanAushadhiScraper,   tier: 2, priority: 14 },
];

// ── Price-only updater (uses existing drug_prices rows) ───────
// Faster than full catalog — just re-checks selling_price + in_stock

class PriceUpdater {
  constructor(portal) {
    this.portal = portal;
    this.stats  = { checked: 0, updated: 0, errors: 0 };
  }

  async run() {
    const { chromium } = require('playwright');
    const { sleep, randomUA, upsertPrice } = require('./base');

    console.log(`  [${this.portal}] Price update starting...`);

    // Get all known URLs for this portal
    const client = await DB.connect();
    const rows = await client.query(
      `SELECT dp.id, dp.drug_id, dp.portal_url, dp.selling_price, dp.in_stock
       FROM drug_prices dp
       WHERE dp.portal = $1
         AND dp.portal_url IS NOT NULL
         AND dp.last_checked < NOW() - INTERVAL '20 hours'
       ORDER BY dp.last_checked ASC
       LIMIT 5000`,
      [this.portal]
    );
    client.release();

    if (!rows.rows.length) {
      console.log(`  [${this.portal}] Nothing to update`);
      return;
    }

    const browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
    const ctx = await browser.newContext({ userAgent: randomUA() });

    // Use axios for faster headless price checks on APIs
    const axios = require('axios');

    for (const row of rows.rows) {
      try {
        await sleep(500 + Math.random() * 500);

        // Quick price fetch — try JSON API endpoints first
        let price = null;
        let inStock = null;

        if (this.portal === 'pharmeasy') {
          const slugMatch = row.portal_url?.match(/medicines\/([^/?]+)/);
          if (slugMatch) {
            try {
              const res = await axios.get(`https://pharmeasy.in/api/offer/get_medicine_details/${slugMatch[1]}`, {
                timeout: 8000, headers: { 'Accept': 'application/json' }
              });
              price   = parseFloat(res.data?.data?.price) || null;
              inStock = res.data?.data?.inStock !== false;
            } catch {}
          }
        }

        if (this.portal === '1mg') {
          const idMatch = row.portal_url?.match(/\/(\d+)$/);
          if (idMatch) {
            try {
              const res = await axios.get(`https://www.1mg.com/api/entity/medline/drug/${idMatch[1]}`, {
                timeout: 8000, headers: { 'Accept': 'application/json' }
              });
              price   = parseFloat(res.data?.data?.price) || null;
              inStock = res.data?.data?.inStock !== false;
            } catch {}
          }
        }

        // Fallback to page scraping for non-API portals
        if (!price && row.portal_url) {
          const page = await ctx.newPage();
          try {
            await page.goto(row.portal_url, { waitUntil: 'domcontentloaded', timeout: 15000 });
            const result = await page.evaluate(() => {
              const priceEl = document.querySelector(
                '[class*="price"], [class*="Price"], [data-testid="price"], .selling-price'
              );
              const stockEl = document.querySelector('[class*="outOfStock"], [class*="out-of-stock"], .out-of-stock');
              return {
                price:   priceEl ? parseFloat(priceEl.textContent.replace(/[^0-9.]/g, '')) : null,
                inStock: !stockEl,
              };
            });
            price   = result.price;
            inStock = result.inStock;
          } finally {
            await page.close();
          }
        }

        if (price) {
          const dbClient = await DB.connect();
          try {
            await dbClient.query(`
              UPDATE drug_prices SET
                selling_price = $1,
                in_stock = $2,
                last_checked = NOW()
              WHERE drug_id = $3 AND portal = $4
            `, [price, inStock !== false, row.drug_id, this.portal]);
            this.stats.updated++;
          } finally {
            dbClient.release(); }
        }

        this.stats.checked++;
      } catch {
        this.stats.errors++;
      }
    }

    await ctx.close();
    await browser.close();

    console.log(`  [${this.portal}] Price update done: ${this.stats.updated} updated / ${this.stats.checked} checked`);
  }
}

// ── Run all portals ───────────────────────────────────────────

async function runCatalog(skipPortals = []) {
  console.log('\n═══════════════════════════════════════════════');
  console.log('CATALOG RUN — all 14 portals');
  console.log('═══════════════════════════════════════════════\n');

  const portals = ALL_PORTALS
    .filter(p => p.Scraper && !skipPortals.includes(p.key))
    .sort((a, b) => a.priority - b.priority);

  for (const p of portals) {
    console.log(`\n[${p.priority}/14] ${p.key} (Tier ${p.tier})`);
    try {
      const scraper = new p.Scraper();
      await scraper.run();
    } catch (err) {
      console.error(`  ✗ ${p.key} failed: ${err.message}`);
    }
    // Cool-down between portals
    await new Promise(r => setTimeout(r, 5000));
  }

  console.log('\n✅ All portals complete');
}

async function runPrices() {
  console.log('\n═══════════════════════════════════════════════');
  console.log('PRICE UPDATE RUN — all portals');
  console.log('═══════════════════════════════════════════════\n');

  // Run price updates in parallel (3 at a time)
  const portals = ALL_PORTALS.filter(p => p.key !== '1mg').map(p => p.key);
  const PQueue  = require('p-queue').default;
  const queue   = new PQueue({ concurrency: 3 });

  await Promise.all(
    portals.map(portal => queue.add(async () => {
      try {
        await new PriceUpdater(portal).run();
      } catch (err) {
        console.error(`Price update ${portal} failed: ${err.message}`);
      }
    }))
  );

  console.log('\n✅ Price update complete');
}

async function runSingle(portalKey) {
  const portal = ALL_PORTALS.find(p => p.key === portalKey);
  if (!portal) { console.error(`Unknown portal: ${portalKey}`); return; }
  if (!portal.Scraper) { console.log(`${portalKey}: use standalone scraper`); return; }
  await new portal.Scraper().run();
}

// ── CLI ───────────────────────────────────────────────────────

const mode   = process.argv[2] || 'catalog';
const target = process.argv[3];

(async () => {
  switch (mode) {
    case 'catalog':
      await runCatalog(target ? [target] : []);
      break;
    case 'prices':
      await runPrices();
      break;
    case 'single':
      if (!target) { console.error('Usage: node run-all.js single <portal>'); break; }
      await runSingle(target);
      break;
    default:
      console.log('Usage: node run-all.js [catalog|prices|single <portal>]');
      console.log('Portals:', ALL_PORTALS.map(p => p.key).join(', '));
  }
  await DB.end();
})().catch(err => { console.error('Fatal:', err); process.exit(1); });
