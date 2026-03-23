"""
medicines.discount — NPPA Price Ceiling Loader
NPPA (National Pharmaceutical Pricing Authority) publishes price ceilings
for essential medicines under DPCO 2013.

Sources:
  1. NPPA official site: https://www.nppaindia.nic.in/
  2. NPPA price list CSV (updated monthly)
  3. SOS (Scheduled to Other Drugs) list

Run: python scrapers/nppa_loader.py
"""

import asyncio
import asyncpg
import aiohttp
import csv
import io
import re
import os
from datetime import datetime, date
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/medicines_discount")

# NPPA publishes CSV exports — we fetch & parse
NPPA_SOURCES = [
    # Scheduled formulations (price controlled)
    "https://www.nppaindia.nic.in/wp-content/uploads/2024/01/MAPP-Jan-2024.csv",
    # Fallback — cached from NPPA
    "https://raw.githubusercontent.com/OpenHealthData/nppa-data/main/nppa_prices.csv",
]


def normalize_salt(salt: str) -> str:
    return re.sub(r'\s+', ' ', salt.lower().strip())


def normalize_strength(s: str) -> str:
    """Normalize 500MG → 500mg, 10 mg → 10mg etc."""
    s = s.strip().lower()
    s = re.sub(r'\s+', '', s)
    s = re.sub(r'(\d)(mg|mcg|ml|g|iu|%)', r'\1\2', s)
    return s


async def fetch_nppa_csv(session: aiohttp.ClientSession, url: str) -> list[dict]:
    """Fetch and parse NPPA price CSV."""
    try:
        async with session.get(url, timeout=aiohttp.ClientTimeout(total=30)) as resp:
            if resp.status != 200:
                logger.warning(f"HTTP {resp.status} for {url}")
                return []
            text = await resp.text(encoding='utf-8', errors='replace')

        reader = csv.DictReader(io.StringIO(text))
        rows = []
        for row in reader:
            # NPPA CSV columns vary — try multiple known formats
            salt = (
                row.get('Formulation') or
                row.get('Salt') or
                row.get('Drug Name') or
                row.get('Generic Name') or ''
            ).strip()

            strength = (
                row.get('Strength') or
                row.get('Dosage') or ''
            ).strip()

            ceiling_price_str = (
                row.get('Ceiling Price') or
                row.get('Price Ceiling') or
                row.get('MRP') or
                row.get('Retail Price') or ''
            ).replace(',', '').replace('₹', '').strip()

            notified_date_str = (
                row.get('Date of Notification') or
                row.get('Notification Date') or ''
            ).strip()

            if not salt or not ceiling_price_str:
                continue

            try:
                ceiling_price = float(ceiling_price_str)
            except ValueError:
                continue

            # Parse notification date
            notified_at = None
            for fmt in ('%d/%m/%Y', '%d-%m-%Y', '%Y-%m-%d', '%d %b %Y'):
                try:
                    notified_at = datetime.strptime(notified_date_str, fmt).date()
                    break
                except (ValueError, TypeError):
                    pass

            rows.append({
                'salt_normalized': normalize_salt(salt),
                'strength_normalized': normalize_strength(strength),
                'ceiling_price': ceiling_price,
                'notified_at': notified_at,
                'source': url,
            })

        logger.info(f"Parsed {len(rows)} rows from {url}")
        return rows

    except Exception as e:
        logger.error(f"Failed to fetch {url}: {e}")
        return []


async def match_and_update_drugs(conn: asyncpg.Connection, nppa_rows: list[dict]) -> dict:
    """Match NPPA data to drugs table and update ceiling prices."""
    stats = {'matched': 0, 'unmatched': 0, 'updated': 0}

    for row in nppa_rows:
        # Find matching drugs by salt name (normalized)
        drugs = await conn.fetch("""
            SELECT id, salt_normalized, strength, mrp
            FROM drugs
            WHERE salt_normalized ILIKE $1
              AND is_active = TRUE
        """, f"%{row['salt_normalized']}%")

        if not drugs:
            stats['unmatched'] += 1
            continue

        stats['matched'] += len(drugs)

        # Update ceiling price for all matching drugs
        for drug in drugs:
            await conn.execute("""
                UPDATE drugs SET
                    nppa_ceiling_price = $1,
                    nppa_notified_at   = $2,
                    updated_at         = NOW()
                WHERE id = $3
                  AND (nppa_ceiling_price IS NULL OR nppa_ceiling_price > $1)
            """, row['ceiling_price'], row['notified_at'], drug['id'])
            stats['updated'] += 1

    return stats


async def main():
    logger.info("NPPA price loader starting...")

    conn = await asyncpg.connect(DATABASE_URL)

    async with aiohttp.ClientSession(headers={
        'User-Agent': 'MedicinesDiscountBot/1.0 (price transparency service)',
    }) as session:

        all_rows = []
        for url in NPPA_SOURCES:
            rows = await fetch_nppa_csv(session, url)
            all_rows.extend(rows)
            if rows:
                break  # Use first successful source

    if not all_rows:
        logger.warning("No NPPA data fetched. Check sources.")
        # Fallback: use known essential medicines data
        all_rows = get_fallback_nppa_data()

    logger.info(f"Total NPPA records: {len(all_rows)}")

    stats = await match_and_update_drugs(conn, all_rows)
    await conn.close()

    logger.info(f"NPPA load complete:")
    logger.info(f"  Matched drugs: {stats['matched']}")
    logger.info(f"  Unmatched:     {stats['unmatched']}")
    logger.info(f"  Updated:       {stats['updated']}")


def get_fallback_nppa_data():
    """
    Hardcoded fallback for key essential medicines.
    DPCO Schedule 1 drugs — price controlled by government.
    Prices are approximate NPPA ceiling prices as of 2024.
    Update from: https://www.nppaindia.nic.in/price-fixed-by-govt/
    """
    return [
        # Antidiabetics
        {'salt_normalized': 'metformin hydrochloride', 'strength_normalized': '500mg', 'ceiling_price': 5.56, 'notified_at': date(2023, 4, 1)},
        {'salt_normalized': 'metformin hydrochloride', 'strength_normalized': '1000mg', 'ceiling_price': 9.87, 'notified_at': date(2023, 4, 1)},
        {'salt_normalized': 'glimepiride', 'strength_normalized': '1mg', 'ceiling_price': 4.50, 'notified_at': date(2023, 4, 1)},
        {'salt_normalized': 'glimepiride', 'strength_normalized': '2mg', 'ceiling_price': 7.20, 'notified_at': date(2023, 4, 1)},
        # Antihypertensives
        {'salt_normalized': 'amlodipine besylate', 'strength_normalized': '5mg', 'ceiling_price': 3.20, 'notified_at': date(2023, 4, 1)},
        {'salt_normalized': 'atenolol', 'strength_normalized': '50mg', 'ceiling_price': 3.60, 'notified_at': date(2023, 4, 1)},
        {'salt_normalized': 'enalapril maleate', 'strength_normalized': '5mg', 'ceiling_price': 4.80, 'notified_at': date(2023, 4, 1)},
        # Antibiotics
        {'salt_normalized': 'amoxicillin', 'strength_normalized': '500mg', 'ceiling_price': 8.50, 'notified_at': date(2023, 4, 1)},
        {'salt_normalized': 'azithromycin', 'strength_normalized': '500mg', 'ceiling_price': 21.00, 'notified_at': date(2023, 4, 1)},
        {'salt_normalized': 'ciprofloxacin hydrochloride', 'strength_normalized': '500mg', 'ceiling_price': 8.90, 'notified_at': date(2023, 4, 1)},
        # Analgesics / Anti-inflammatory
        {'salt_normalized': 'paracetamol', 'strength_normalized': '500mg', 'ceiling_price': 2.30, 'notified_at': date(2023, 4, 1)},
        {'salt_normalized': 'ibuprofen', 'strength_normalized': '400mg', 'ceiling_price': 5.50, 'notified_at': date(2023, 4, 1)},
        # Gastrointestinal
        {'salt_normalized': 'omeprazole', 'strength_normalized': '20mg', 'ceiling_price': 5.80, 'notified_at': date(2023, 4, 1)},
        {'salt_normalized': 'pantoprazole sodium', 'strength_normalized': '40mg', 'ceiling_price': 9.20, 'notified_at': date(2023, 4, 1)},
        # Thyroid
        {'salt_normalized': 'levothyroxine sodium', 'strength_normalized': '25mcg', 'ceiling_price': 2.10, 'notified_at': date(2023, 4, 1)},
        {'salt_normalized': 'levothyroxine sodium', 'strength_normalized': '50mcg', 'ceiling_price': 2.80, 'notified_at': date(2023, 4, 1)},
        # Vitamins
        {'salt_normalized': 'vitamin d3', 'strength_normalized': '60000iu', 'ceiling_price': 18.00, 'notified_at': date(2023, 4, 1)},
        {'salt_normalized': 'folic acid', 'strength_normalized': '5mg', 'ceiling_price': 1.90, 'notified_at': date(2023, 4, 1)},
    ]


if __name__ == '__main__':
    asyncio.run(main())
