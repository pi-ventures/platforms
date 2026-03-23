/**
 * medicines.discount — Shared Scraper Base
 * All portal scrapers extend this. Handles:
 *   - DB connection + upsert logic
 *   - Rate limiting + retry
 *   - Run logging
 *   - Proxy rotation (optional)
 *   - User-agent rotation
 */

const { chromium } = require('playwright');
const { Pool } = require('pg');
const PQueue = require('p-queue').default;

// ── DB Pool ───────────────────────────────────────────────────
const DB = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/medicines_discount',
  max: 10,
});

// ── User agents ───────────────────────────────────────────────
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
];

function randomUA() {
  return USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function slugify(text) {
  return text.toLowerCase().trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function normalizeName(text) {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

function parseStrength(name) {
  const match = name.match(/(\d+(?:\.\d+)?(?:mg|mcg|ml|iu|g|%|mg\/ml|mg\/5ml|mcg\/dose))/i);
  return match ? match[1].toLowerCase() : '';
}

// ── DB Operations ─────────────────────────────────────────────

async function findDrugByName(client, brandName, strength) {
  const normalized = normalizeName(brandName);
  const slug = slugify(`${brandName}-${strength}`);

  // Try exact slug first
  let result = await client.query(
    'SELECT id FROM drugs WHERE slug = $1 AND is_active = TRUE LIMIT 1',
    [slug]
  );
  if (result.rows.length) return result.rows[0].id;

  // Try normalized brand name + strength
  result = await client.query(
    `SELECT id FROM drugs
     WHERE brand_name_normalized ILIKE $1
       AND strength ILIKE $2
       AND is_active = TRUE
     LIMIT 1`,
    [normalized, `%${strength}%`]
  );
  if (result.rows.length) return result.rows[0].id;

  // Try brand name only (fuzzy)
  result = await client.query(
    `SELECT id FROM drugs
     WHERE brand_name_normalized % $1
       AND is_active = TRUE
     ORDER BY similarity(brand_name_normalized, $1) DESC
     LIMIT 1`,
    [normalized]
  );
  if (result.rows.length) return result.rows[0].id;

  return null;
}

async function upsertManufacturer(client, name) {
  if (!name) return null;
  const normalized = normalizeName(name);
  const slug = slugify(name);
  const res = await client.query(`
    INSERT INTO manufacturers (name_raw, name_normalized, slug)
    VALUES ($1, $2, $3)
    ON CONFLICT (slug) DO UPDATE SET updated_at = NOW()
    RETURNING id
  `, [name, normalized, slug]);
  return res.rows[0].id;
}

async function upsertDrug(client, drug, manufacturerId) {
  const brandNorm  = normalizeName(drug.brandName);
  const saltNorm   = normalizeName(drug.saltName || drug.brandName);
  const saltSlug   = slugify(drug.saltName || drug.brandName);
  const slug       = slugify(`${drug.brandName}-${drug.strength || 'tablet'}`);

  const unitMatch  = (drug.packSize || '').match(/(\d+)/);
  const unitCount  = unitMatch ? parseInt(unitMatch[1]) : 1;
  const pricePerUnit = drug.mrp && unitCount > 0 ? drug.mrp / unitCount : null;

  const res = await client.query(`
    INSERT INTO drugs (
      brand_name, brand_name_normalized, slug,
      salt_name, salt_normalized, salt_slug,
      strength, pack_size, dosage_form,
      rx_required, manufacturer_id, manufacturer_name,
      mrp, price_per_unit, uses
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15)
    ON CONFLICT (slug) DO UPDATE SET
      mrp            = COALESCE(EXCLUDED.mrp, drugs.mrp),
      pack_size      = COALESCE(EXCLUDED.pack_size, drugs.pack_size),
      manufacturer_id= COALESCE(EXCLUDED.manufacturer_id, drugs.manufacturer_id),
      updated_at     = NOW()
    RETURNING id, (xmax = 0) AS is_new
  `, [
    drug.brandName, brandNorm, slug,
    drug.saltName || drug.brandName, saltNorm, saltSlug,
    drug.strength || '', drug.packSize, drug.dosageForm,
    drug.rxRequired !== false, manufacturerId, drug.manufacturer,
    drug.mrp, pricePerUnit, drug.uses,
  ]);
  return res.rows[0];
}

async function upsertPrice(client, drugId, portal, drug) {
  if (!drugId) return;

  const unitMatch  = (drug.packSize || '').match(/(\d+)/);
  const unitCount  = unitMatch ? parseInt(unitMatch[1]) : 1;
  const pricePerUnit = drug.sellingPrice && unitCount > 0 ? drug.sellingPrice / unitCount : null;
  const effectivePrice = drug.sellingPrice
    ? drug.sellingPrice * (1 - (drug.cashbackPct || 0) / 100)
    : null;

  await client.query(`
    INSERT INTO drug_prices (
      drug_id, portal, portal_url, mrp, selling_price,
      discount_pct, price_per_unit, in_stock,
      cashback_pct, effective_price
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    ON CONFLICT (drug_id, portal) DO UPDATE SET
      portal_url    = COALESCE(EXCLUDED.portal_url, drug_prices.portal_url),
      mrp           = COALESCE(EXCLUDED.mrp, drug_prices.mrp),
      selling_price = EXCLUDED.selling_price,
      discount_pct  = EXCLUDED.discount_pct,
      price_per_unit= EXCLUDED.price_per_unit,
      in_stock      = EXCLUDED.in_stock,
      cashback_pct  = EXCLUDED.cashback_pct,
      effective_price=EXCLUDED.effective_price,
      last_checked  = NOW()
  `, [
    drugId, portal, drug.portalUrl, drug.mrp, drug.sellingPrice,
    drug.discountPct, pricePerUnit, drug.inStock !== false,
    drug.cashbackPct || 0, effectivePrice,
  ]);
}

async function createRunLog(portal, runType) {
  const client = await DB.connect();
  try {
    const res = await client.query(
      `INSERT INTO scraper_runs (portal, run_type, status) VALUES ($1,$2,'running') RETURNING id`,
      [portal, runType]
    );
    return res.rows[0].id;
  } finally { client.release(); }
}

async function updateRunLog(runId, stats) {
  const client = await DB.connect();
  try {
    await client.query(`
      UPDATE scraper_runs SET
        status=$2, drugs_scraped=$3, drugs_new=$4, drugs_updated=$5,
        errors=$6, completed_at=NOW()
      WHERE id=$1
    `, [runId, stats.status, stats.scraped, stats.newCount, stats.updated, stats.errors]);
  } finally { client.release(); }
}

// ── Base Scraper Class ────────────────────────────────────────

class PortalScraper {
  constructor(config) {
    this.portal     = config.portal;       // key: 'pharmeasy', 'netmeds' etc
    this.portalName = config.portalName;   // human: 'PharmEasy'
    this.baseUrl    = config.baseUrl;
    this.concurrency= config.concurrency || 2;
    this.delayMs    = config.delayMs || 2000;
    this.batchSize  = config.batchSize || 50;
    this.stats      = { scraped: 0, newCount: 0, updated: 0, errors: 0 };
  }

  // ── Override these in subclasses ─────────────────────────────

  async getProductUrls(browser) {
    // Return array of URLs to scrape
    throw new Error('getProductUrls() must be implemented');
  }

  async scrapeProductPage(page, url) {
    // Return drug object or null
    throw new Error('scrapeProductPage() must be implemented');
  }

  // ── Run ───────────────────────────────────────────────────────

  async run() {
    console.log(`\n🚀 ${this.portalName} scraper starting...`);
    const runId = await createRunLog(this.portal, 'catalog');

    const browser = await chromium.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    try {
      const urls = await this.getProductUrls(browser);
      console.log(`Found ${urls.length} product URLs`);

      // Get already-scraped portal URLs to skip
      const client = await DB.connect();
      const existing = await client.query(
        'SELECT portal_url FROM drug_prices WHERE portal = $1 AND portal_url IS NOT NULL',
        [this.portal]
      );
      client.release();
      const existingUrls = new Set(existing.rows.map(r => r.portal_url));

      const toScrape = urls.filter(u => !existingUrls.has(u));
      console.log(`To scrape: ${toScrape.length} (skipping ${urls.length - toScrape.length} existing)`);

      const queue = new PQueue({ concurrency: this.concurrency });

      for (let i = 0; i < toScrape.length; i += this.batchSize) {
        const chunk = toScrape.slice(i, i + this.batchSize);
        const ctx   = await browser.newContext({ userAgent: randomUA() });

        const promises = chunk.map(url => queue.add(async () => {
          const page = await ctx.newPage();
          try {
            await sleep(this.delayMs + Math.random() * 1000);
            const drug = await this.scrapeProductPage(page, url);
            if (drug) {
              await this._saveDrug(drug, url);
            } else {
              this.stats.errors++;
            }
          } catch (err) {
            this.stats.errors++;
            console.error(`  ✗ ${url}: ${err.message}`);
          } finally {
            await page.close();
          }
        }));

        await Promise.all(promises);
        await ctx.close();

        if (this.stats.scraped % 200 === 0 && this.stats.scraped > 0) {
          console.log(`  ✓ ${this.stats.scraped} scraped | ${this.stats.newCount} new | ${this.stats.errors} errors`);
          await updateRunLog(runId, { ...this.stats, status: 'running' });
        }

        await sleep(2000);
      }
    } finally {
      await browser.close();
    }

    await updateRunLog(runId, { ...this.stats, status: 'completed' });
    console.log(`\n✅ ${this.portalName} complete: ${this.stats.scraped} scraped | ${this.stats.newCount} new | ${this.stats.errors} errors`);
  }

  async _saveDrug(drug, url) {
    const client = await DB.connect();
    try {
      drug.portalUrl = url;

      // Try to find existing drug by name first
      let drugId = await findDrugByName(client, drug.brandName, drug.strength || '');

      if (!drugId) {
        // Insert new drug
        const mfrId = await upsertManufacturer(client, drug.manufacturer);
        const result = await upsertDrug(client, drug, mfrId);
        drugId = result.id;
        if (result.is_new) this.stats.newCount++;
        else this.stats.updated++;
      } else {
        this.stats.updated++;
      }

      await upsertPrice(client, drugId, this.portal, drug);
      this.stats.scraped++;
    } finally {
      client.release();
    }
  }
}

module.exports = {
  PortalScraper,
  DB,
  sleep,
  slugify,
  normalizeName,
  parseStrength,
  randomUA,
  upsertManufacturer,
  upsertDrug,
  upsertPrice,
  findDrugByName,
  createRunLog,
  updateRunLog,
};
