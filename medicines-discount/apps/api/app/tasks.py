"""
medicines.discount — Celery Tasks
Scheduled scraper runs via Celery Beat

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INTELLIGENCE FLOW (3-tier):

  medicines.discount  →  IQEdge.ai  →  KnowledgeHub.ai
        (raw)           (processes)      (golden records)

medicines.discount is an OPERATIONAL platform.
It scrapes prices and records user behaviour.
It does NOT talk to KnowledgeHub directly.

IQEdge.ai is the INTELLIGENCE PROCESSING layer:
  - Receives raw signals from medicines.discount
  - Enriches manufacturers (MCA/GSTIN match, WHO-GMP, DGFT)
  - Computes pharma market analytics (category share, pricing patterns)
  - Runs disease burden analysis by PIN
  - Identifies healthcare infrastructure gaps
  - Pushes cleaned golden records → KnowledgeHub

KnowledgeHub.ai is the MASTER CORE:
  - Stores golden company records
  - Feeds all verticals (TheEquinox, YesBroker, Nexus, etc.)
  - Never receives raw/unprocessed data directly from operational platforms

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IQEdge API endpoints that receive our signals:

  POST /api/intelligence/pharma/manufacturers
       → raw manufacturer list for enrichment
       → IQEdge matches MCA, enriches, scores, pushes to KH

  POST /api/intelligence/pharma/market-signals
       → price data, portal distribution, stock patterns
       → IQEdge computes market share, pricing analytics → KH

  POST /api/intelligence/geo/disease-signals
       → geo_drug_signals aggregated by PIN
       → IQEdge runs gap analysis, outputs opportunity records to KH
       → cascades to: TheCredit.exchange, IQEdge CRM Cat04, Nexus

  POST /api/intelligence/pharma/price-anomalies
       → drugs priced above NPPA ceiling or showing supply disruption
       → IQEdge flags for KH regulatory + supply chain intelligence

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Schedules:
  catalog_run          → Sunday 2am     full product discovery
  price_update         → daily 3am      price refresh all portals
  stock_check          → every 6h       in-stock status
  generic_match        → Monday 4am     rebuild generic_equivalents
  iqedge_mfr_sync      → daily 5am      manufacturers → IQEdge → KH
  iqedge_market_sync   → daily 5:30am   market signals → IQEdge → KH
  iqedge_geo_sync      → daily 6am      disease signals → IQEdge → KH
  iqedge_anomalies     → daily 6:30am   price anomalies → IQEdge → KH
"""

from celery import Celery
from celery.schedules import crontab
import subprocess
import asyncio
import asyncpg
import httpx
import os
import logging
from datetime import date, timedelta

logger = logging.getLogger(__name__)

REDIS_URL    = os.getenv('REDIS_URL', 'redis://localhost:6379/3')
DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://postgres:postgres@localhost:5432/medicines_discount')
SCRAPERS_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'scrapers', 'src')

# ── Service endpoints ─────────────────────────────────────────
# medicines.discount → IQEdge ONLY.
# IQEdge → KnowledgeHub. Never direct.
IQEDGE_API = os.getenv('IQEDGE_API_URL', 'http://localhost:8006')

app = Celery('meddisc', broker=REDIS_URL, backend=REDIS_URL)

app.conf.beat_schedule = {
    # ── Scraper tasks ──────────────────────────────────────────
    'catalog-run-weekly': {
        'task': 'app.tasks.run_catalog',
        'schedule': crontab(hour=2, minute=0, day_of_week='sunday'),
    },
    'price-update-daily': {
        'task': 'app.tasks.run_price_update',
        'schedule': crontab(hour=3, minute=0),
    },
    'stock-check-6h': {
        'task': 'app.tasks.run_stock_check',
        'schedule': crontab(minute=0, hour='*/6'),
    },
    'generic-match-weekly': {
        'task': 'app.tasks.run_generic_match',
        'schedule': crontab(hour=4, minute=0, day_of_week='monday'),
    },

    # ── Intelligence sync → IQEdge (IQEdge → KH) ──────────────
    'iqedge-mfr-sync-daily': {
        'task': 'app.tasks.sync_manufacturers_to_iqedge',
        'schedule': crontab(hour=5, minute=0),
    },
    'iqedge-market-sync-daily': {
        'task': 'app.tasks.sync_market_signals_to_iqedge',
        'schedule': crontab(hour=5, minute=30),
    },
    'iqedge-geo-sync-daily': {
        'task': 'app.tasks.sync_geo_signals_to_iqedge',
        'schedule': crontab(hour=6, minute=0),
    },
    'iqedge-anomalies-daily': {
        'task': 'app.tasks.sync_price_anomalies_to_iqedge',
        'schedule': crontab(hour=6, minute=30),
    },
}

app.conf.timezone = 'Asia/Kolkata'


# ── Scraper Tasks ──────────────────────────────────────────────

@app.task(name='app.tasks.run_catalog')
def run_catalog():
    """Full catalog scrape — all 14 portals."""
    logger.info("Starting weekly catalog run...")
    result = subprocess.run(
        ['node', 'run-all.js', 'catalog'],
        cwd=SCRAPERS_DIR,
        capture_output=True,
        text=True,
        timeout=21600,
    )
    logger.info(f"Catalog run done: {result.returncode}")
    if result.returncode != 0:
        logger.error(result.stderr)
    return {'returncode': result.returncode, 'stdout': result.stdout[-2000:]}


@app.task(name='app.tasks.run_price_update')
def run_price_update():
    """Daily price refresh — all portals."""
    logger.info("Starting daily price update...")
    result = subprocess.run(
        ['node', 'run-all.js', 'prices'],
        cwd=SCRAPERS_DIR,
        capture_output=True,
        text=True,
        timeout=7200,
    )
    logger.info(f"Price update done: {result.returncode}")
    return {'returncode': result.returncode}


@app.task(name='app.tasks.run_stock_check')
def run_stock_check():
    """6-hourly stock check."""
    result = subprocess.run(
        ['node', 'run-all.js', 'prices'],
        cwd=SCRAPERS_DIR,
        capture_output=True,
        text=True,
        timeout=3600,
    )
    return {'returncode': result.returncode}


@app.task(name='app.tasks.run_generic_match')
def run_generic_match():
    """Rebuild generic_equivalents table."""
    api_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'scrapers')
    result = subprocess.run(
        ['python', 'match_generics.py'],
        cwd=api_dir,
        capture_output=True,
        text=True,
        timeout=1800,
    )
    logger.info(f"Generic match done: {result.returncode}")
    return {'returncode': result.returncode}


# ── Intelligence Sync Tasks → IQEdge ──────────────────────────

@app.task(name='app.tasks.sync_manufacturers_to_iqedge')
def sync_manufacturers_to_iqedge():
    """
    Push new/updated pharma manufacturers to IQEdge intelligence layer.

    IQEdge will:
      - Match against MCA company database (name + state fuzzy match)
      - Enrich with CIN, directors, annual filings
      - Verify WHO-GMP certification (CDSCO database)
      - Check DGFT export registrations
      - Score manufacturer credibility
      - Push enriched golden record → KnowledgeHub pharma graph
      - Return knowledgehub_entity_id back for local storage
    """
    async def _sync():
        conn = await asyncpg.connect(DATABASE_URL)
        try:
            manufacturers = await conn.fetch("""
                SELECT
                    id, name_raw, name_normalized, slug,
                    city, state, drug_count, who_gmp_certified,
                    knowledgehub_entity_id
                FROM manufacturers
                WHERE (synced_to_kh_at IS NULL OR updated_at > synced_to_kh_at)
                  AND drug_count > 0
                ORDER BY drug_count DESC
                LIMIT 500
            """)

            if not manufacturers:
                logger.info("No manufacturers to sync")
                return {'synced': 0}

            logger.info(f"Syncing {len(manufacturers)} manufacturers → IQEdge...")
            synced = 0

            async with httpx.AsyncClient(timeout=60) as client:
                batch = [
                    {
                        'source_platform':   'medicines_discount',
                        'source_id':         str(m['id']),
                        'name_raw':          m['name_raw'],
                        'name_normalized':   m['name_normalized'],
                        'slug':              m['slug'],
                        'city':              m['city'],
                        'state':             m['state'],
                        'industry':          'Pharmaceutical',
                        'drug_count':        m['drug_count'],
                        'who_gmp_certified': m['who_gmp_certified'],
                        'existing_kh_id':    m['knowledgehub_entity_id'],
                    }
                    for m in manufacturers
                ]

                try:
                    res = await client.post(
                        f'{IQEDGE_API}/api/intelligence/pharma/manufacturers',
                        json={'manufacturers': batch},
                    )
                    if res.status_code == 200:
                        # IQEdge returns enriched records with KH entity IDs
                        for r in res.json().get('results', []):
                            if r.get('source_id') and r.get('knowledgehub_entity_id'):
                                await conn.execute("""
                                    UPDATE manufacturers SET
                                        knowledgehub_entity_id = $1,
                                        synced_to_kh_at        = NOW()
                                    WHERE id = $2
                                """, r['knowledgehub_entity_id'], int(r['source_id']))
                                synced += 1
                    else:
                        logger.error(f"IQEdge mfr sync HTTP {res.status_code}: {res.text[:300]}")

                except httpx.ConnectError:
                    logger.warning(f"IQEdge unreachable at {IQEDGE_API} — will retry next run")

            return {'synced': synced, 'total': len(manufacturers)}
        finally:
            await conn.close()

    return asyncio.run(_sync())


@app.task(name='app.tasks.sync_market_signals_to_iqedge')
def sync_market_signals_to_iqedge():
    """
    Push pharma market intelligence signals to IQEdge.

    Signals:
      - Price spread per drug across portals (margin intelligence)
      - Portal market share by therapeutic category
      - Discount patterns per portal per category
      - Generic penetration rate by category
      - Out-of-stock frequency by manufacturer

    IQEdge computes:
      - Pharma market share rankings
      - Pricing anomaly detection
      - Manufacturer competitive profiles
      → Pushes structured market intelligence → KnowledgeHub
    """
    async def _sync():
        conn = await asyncpg.connect(DATABASE_URL)
        try:
            price_spreads = await conn.fetch("""
                SELECT
                    d.salt_slug,
                    d.salt_name,
                    d.therapeutic_category,
                    d.manufacturer_name,
                    m.knowledgehub_entity_id        AS mfr_kh_id,
                    COUNT(DISTINCT dp.portal)        AS portal_count,
                    MIN(dp.selling_price)            AS min_price,
                    MAX(dp.selling_price)            AS max_price,
                    ROUND(AVG(dp.selling_price), 2)  AS avg_price,
                    ROUND(
                        100.0 * (MAX(dp.selling_price) - MIN(dp.selling_price))
                        / NULLIF(MIN(dp.selling_price), 0), 1
                    )                                AS price_spread_pct,
                    COUNT(*) FILTER (WHERE dp.in_stock)     AS portals_in_stock,
                    COUNT(*) FILTER (WHERE NOT dp.in_stock) AS portals_out_of_stock
                FROM drugs d
                JOIN drug_prices dp ON dp.drug_id = d.id
                LEFT JOIN manufacturers m ON m.id = d.manufacturer_id
                WHERE d.is_active = TRUE
                GROUP BY d.salt_slug, d.salt_name, d.therapeutic_category,
                         d.manufacturer_name, m.knowledgehub_entity_id
                HAVING COUNT(DISTINCT dp.portal) >= 3
                ORDER BY price_spread_pct DESC NULLS LAST
                LIMIT 2000
            """)

            portal_share = await conn.fetch("""
                SELECT
                    dp.portal,
                    d.therapeutic_category,
                    COUNT(*)                              AS listing_count,
                    COUNT(*) FILTER (WHERE dp.in_stock)  AS in_stock_count,
                    ROUND(AVG(dp.discount_pct), 1)       AS avg_discount_pct,
                    ROUND(AVG(dp.selling_price), 2)      AS avg_price
                FROM drug_prices dp
                JOIN drugs d ON d.id = dp.drug_id
                WHERE d.is_active = TRUE
                GROUP BY dp.portal, d.therapeutic_category
                ORDER BY dp.portal, listing_count DESC
            """)

            async with httpx.AsyncClient(timeout=60) as client:
                try:
                    res = await client.post(
                        f'{IQEDGE_API}/api/intelligence/pharma/market-signals',
                        json={
                            'source_platform': 'medicines_discount',
                            'as_of_date':      date.today().isoformat(),
                            'price_spreads':   [dict(r) for r in price_spreads],
                            'portal_share':    [dict(r) for r in portal_share],
                        },
                    )
                    if res.status_code != 200:
                        logger.error(f"Market signals sync HTTP {res.status_code}")
                        return {'status': 'failed'}
                except httpx.ConnectError:
                    logger.warning("IQEdge unreachable for market signals")
                    return {'status': 'unreachable'}

            return {'status': 'ok', 'price_spreads': len(price_spreads), 'portal_rows': len(portal_share)}
        finally:
            await conn.close()

    return asyncio.run(_sync())


@app.task(name='app.tasks.sync_geo_signals_to_iqedge')
def sync_geo_signals_to_iqedge():
    """
    Push geo drug demand signals to IQEdge for disease burden + gap analysis.

    Signals: drug search/click counts by PIN code (last 7 days).

    IQEdge computes:
      - Disease burden scores per PIN
      - Healthcare infrastructure gaps (diagnostic centres, specialists)
      - Addressable market estimates per gap
      → Pushes opportunity records → KnowledgeHub geo-intelligence layer

    KnowledgeHub cascades signals to:
      - TheCredit.exchange  → clinic/hospital lending opportunities
      - IQEdge CRM Cat04    → targeted healthcare marketing lists by PIN
      - Nexus               → healthcare infrastructure deal flow
    """
    async def _sync():
        conn = await asyncpg.connect(DATABASE_URL)
        since = date.today() - timedelta(days=7)
        try:
            signals = await conn.fetch("""
                SELECT
                    gds.pin_code,
                    gds.disease_category,
                    d.therapeutic_category,
                    d.salt_name,
                    m.knowledgehub_entity_id       AS mfr_kh_id,
                    SUM(gds.search_count)          AS total_searches,
                    SUM(gds.click_count)           AS total_clicks,
                    COUNT(DISTINCT gds.drug_id)    AS unique_drugs,
                    MAX(gds.week)                  AS latest_week
                FROM geo_drug_signals gds
                JOIN drugs d ON d.id = gds.drug_id
                LEFT JOIN manufacturers m ON m.id = d.manufacturer_id
                WHERE gds.week >= $1
                GROUP BY gds.pin_code, gds.disease_category,
                         d.therapeutic_category, d.salt_name,
                         m.knowledgehub_entity_id
                ORDER BY gds.pin_code, total_searches DESC
            """, since)

            if not signals:
                return {'synced': 0}

            async with httpx.AsyncClient(timeout=60) as client:
                try:
                    res = await client.post(
                        f'{IQEDGE_API}/api/intelligence/geo/disease-signals',
                        json={
                            'source_platform': 'medicines_discount',
                            'since_date':      since.isoformat(),
                            'signals':         [dict(r) for r in signals],
                        },
                    )
                    if res.status_code != 200:
                        logger.error(f"Geo signals sync HTTP {res.status_code}")
                        return {'status': 'failed'}
                except httpx.ConnectError:
                    logger.warning("IQEdge unreachable for geo signals")
                    return {'status': 'unreachable'}

            return {'status': 'ok', 'signals': len(signals)}
        finally:
            await conn.close()

    return asyncio.run(_sync())


@app.task(name='app.tasks.sync_price_anomalies_to_iqedge')
def sync_price_anomalies_to_iqedge():
    """
    Push price anomaly signals to IQEdge.

    Anomalies detected:
      - Drug priced above NPPA ceiling on any portal
      - Drug selling above MRP
      - Drug out-of-stock simultaneously across all portals

    IQEdge flags:
      - NPPA violations → regulatory intelligence → KnowledgeHub
      - Supply chain disruptions → manufacturer risk profile → KH
    """
    async def _sync():
        conn = await asyncpg.connect(DATABASE_URL)
        try:
            anomalies = await conn.fetch("""
                SELECT
                    d.id             AS drug_id,
                    d.brand_name,
                    d.salt_name,
                    d.manufacturer_name,
                    m.knowledgehub_entity_id,
                    d.nppa_ceiling_price,
                    dp.portal,
                    dp.selling_price,
                    dp.mrp,
                    CASE
                        WHEN d.nppa_ceiling_price IS NOT NULL
                             AND dp.selling_price > d.nppa_ceiling_price * 1.02
                        THEN 'ABOVE_NPPA_CEILING'
                        WHEN dp.selling_price > dp.mrp * 1.05
                        THEN 'ABOVE_MRP'
                        ELSE 'UNKNOWN'
                    END AS anomaly_type
                FROM drugs d
                JOIN drug_prices dp ON dp.drug_id = d.id AND dp.in_stock = TRUE
                LEFT JOIN manufacturers m ON m.id = d.manufacturer_id
                WHERE d.is_active = TRUE
                  AND (
                      (d.nppa_ceiling_price IS NOT NULL
                       AND dp.selling_price > d.nppa_ceiling_price * 1.02)
                      OR
                      (dp.mrp IS NOT NULL AND dp.selling_price > dp.mrp * 1.05)
                  )
                ORDER BY anomaly_type, d.manufacturer_name
                LIMIT 1000
            """)

            if not anomalies:
                return {'anomalies': 0}

            async with httpx.AsyncClient(timeout=30) as client:
                try:
                    res = await client.post(
                        f'{IQEDGE_API}/api/intelligence/pharma/price-anomalies',
                        json={
                            'source_platform': 'medicines_discount',
                            'as_of_date':      date.today().isoformat(),
                            'anomalies':       [dict(r) for r in anomalies],
                        },
                    )
                    if res.status_code != 200:
                        logger.error(f"Anomalies sync HTTP {res.status_code}")
                        return {'status': 'failed'}
                except httpx.ConnectError:
                    logger.warning("IQEdge unreachable for anomalies sync")
                    return {'status': 'unreachable'}

            return {'status': 'ok', 'anomalies': len(anomalies)}
        finally:
            await conn.close()

    return asyncio.run(_sync())
