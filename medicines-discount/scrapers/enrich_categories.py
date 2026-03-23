"""
medicines.discount — Category Enrichment via OpenFDA
Queries the free OpenFDA API to get therapeutic categories
for every drug in our database.

OpenFDA is free, no API key needed, no blocking.
pharm_class_epc = "Established Pharmacologic Class" — exactly what we need.

Run: python scrapers/enrich_categories.py
"""

import asyncio
import asyncpg
import aiohttp
import os
import re
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(message)s')
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://postgres:postgres@localhost:5432/medicines_discount"
)

FDA_API = "https://api.fda.gov/drug/label.json"

# Manual overrides for common Indian salts where FDA names differ
CATEGORY_OVERRIDES = {
    'metformin':        'Antidiabetic — Biguanide',
    'glimepiride':      'Antidiabetic — Sulfonylurea',
    'voglibose':        'Antidiabetic — Alpha Glucosidase Inhibitor',
    'amlodipine':       'Antihypertensive — Calcium Channel Blocker',
    'atenolol':         'Antihypertensive — Beta Blocker',
    'enalapril':        'Antihypertensive — ACE Inhibitor',
    'losartan':         'Antihypertensive — ARB',
    'telmisartan':      'Antihypertensive — ARB',
    'atorvastatin':     'Cardiac — Statin',
    'rosuvastatin':     'Cardiac — Statin',
    'aspirin':          'Antiplatelet',
    'clopidogrel':      'Antiplatelet',
    'amoxicillin':      'Antibiotic — Penicillin',
    'azithromycin':     'Antibiotic — Macrolide',
    'ciprofloxacin':    'Antibiotic — Fluoroquinolone',
    'doxycycline':      'Antibiotic — Tetracycline',
    'paracetamol':      'Analgesic — Antipyretic',
    'ibuprofen':        'Analgesic — NSAID',
    'diclofenac':       'Analgesic — NSAID',
    'omeprazole':       'Gastrointestinal — PPI',
    'pantoprazole':     'Gastrointestinal — PPI',
    'rabeprazole':      'Gastrointestinal — PPI',
    'domperidone':      'Gastrointestinal — Prokinetic',
    'levothyroxine':    'Thyroid — Hormone Replacement',
    'vitamin d':        'Vitamin & Supplement',
    'vitamin d3':       'Vitamin & Supplement',
    'folic acid':       'Vitamin & Supplement',
    'calcium':          'Vitamin & Supplement',
    'salbutamol':       'Respiratory — Bronchodilator',
    'montelukast':      'Respiratory — Leukotriene Antagonist',
    'cetirizine':       'Antihistamine',
    'jan aushadhi':     'Jan Aushadhi — Generic',
}

# Friendly name mapping for FDA pharm_class_epc values
FDA_CLASS_MAP = {
    'biguanide':                     'Antidiabetic — Biguanide',
    'sulfonylurea':                  'Antidiabetic — Sulfonylurea',
    'hmg-coa reductase inhibitor':   'Cardiac — Statin',
    'calcium channel blocker':       'Antihypertensive — Calcium Channel Blocker',
    'ace inhibitor':                 'Antihypertensive — ACE Inhibitor',
    'angiotensin receptor blocker':  'Antihypertensive — ARB',
    'beta-adrenergic blocker':       'Antihypertensive — Beta Blocker',
    'penicillin':                    'Antibiotic — Penicillin',
    'macrolide':                     'Antibiotic — Macrolide',
    'fluoroquinolone':               'Antibiotic — Fluoroquinolone',
    'tetracycline':                  'Antibiotic — Tetracycline',
    'proton pump inhibitor':         'Gastrointestinal — PPI',
    'cyclooxygenase inhibitor':      'Analgesic — NSAID',
    'analgesic':                     'Analgesic',
    'antiplatelet':                  'Antiplatelet',
    'bronchodilator':                'Respiratory — Bronchodilator',
    'thyroid hormone':               'Thyroid — Hormone Replacement',
    'vitamin':                       'Vitamin & Supplement',
    'antihistamine':                 'Antihistamine',
    'antidiabetic':                  'Antidiabetic',
    'antihypertensive':              'Antihypertensive',
    'antibiotic':                    'Antibiotic',
    'antimicrobial':                 'Antibiotic',
}


def normalize(text):
    return re.sub(r'\s+', ' ', (text or '').lower().strip())


def get_override(salt_name):
    """Check manual override map first."""
    norm = normalize(salt_name)
    for key, category in CATEGORY_OVERRIDES.items():
        if key in norm:
            return category
    return None


def parse_fda_class(pharm_classes):
    """Convert FDA pharm_class_epc list to friendly category name."""
    if not pharm_classes:
        return None
    for cls in pharm_classes:
        cls_lower = cls.lower()
        for key, friendly in FDA_CLASS_MAP.items():
            if key in cls_lower:
                return friendly
    # Return cleaned first class if no mapping found
    first = pharm_classes[0]
    first = re.sub(r'\[.*?\]', '', first).strip()
    return first if first else None


async def fetch_fda_category(session, salt_name):
    """Query OpenFDA for therapeutic category of a salt."""
    # Try override first (instant, no API call)
    override = get_override(salt_name)
    if override:
        return override

    # Clean salt name for FDA query (remove strength, HCl etc)
    query_name = re.sub(r'\s*(hydrochloride|hcl|sodium|maleate|besylate|acetate)\s*', ' ', salt_name, flags=re.I).strip()
    query_name = re.sub(r'\s+', ' ', query_name).strip()

    try:
        params = {
            'search': f'openfda.generic_name:"{query_name}"',
            'limit': 1,
        }
        async with session.get(FDA_API, params=params, timeout=aiohttp.ClientTimeout(total=10)) as resp:
            if resp.status != 200:
                return None
            data = await resp.json()
            results = data.get('results', [])
            if not results:
                return None

            openfda = results[0].get('openfda', {})
            pharm_classes = openfda.get('pharm_class_epc', [])
            return parse_fda_class(pharm_classes)

    except Exception:
        return None


async def main():
    logger.info("Category enrichment starting...")

    conn = await asyncpg.connect(DATABASE_URL)

    # Get all drugs that need category enrichment
    drugs = await conn.fetch("""
        SELECT id, brand_name, salt_name, therapeutic_category
        FROM drugs
        WHERE is_active = TRUE
        ORDER BY id
    """)

    logger.info(f"Found {len(drugs)} drugs in DB")

    stats = {'updated': 0, 'already_set': 0, 'not_found': 0}

    async with aiohttp.ClientSession(headers={
        'User-Agent': 'MedicinesDiscountBot/1.0 (price transparency; contact@medicines.discount)',
        'Accept': 'application/json',
    }) as session:

        for drug in drugs:
            # Skip if already has a category
            if drug['therapeutic_category']:
                stats['already_set'] += 1
                continue

            salt = drug['salt_name'] or drug['brand_name']
            category = await fetch_fda_category(session, salt)

            if category:
                await conn.execute("""
                    UPDATE drugs
                    SET therapeutic_category = $1,
                        therapeutic_slug = $2,
                        updated_at = NOW()
                    WHERE id = $3
                """,
                    category,
                    re.sub(r'[^\w-]', '-', category.lower()).strip('-'),
                    drug['id']
                )
                logger.info(f"  {salt} → {category}")
                stats['updated'] += 1
            else:
                logger.debug(f"  {salt} → not found")
                stats['not_found'] += 1

            await asyncio.sleep(0.3)  # Respect FDA rate limit (240 req/min)

    await conn.close()

    logger.info(f"\nDone:")
    logger.info(f"  Updated:     {stats['updated']}")
    logger.info(f"  Already set: {stats['already_set']}")
    logger.info(f"  Not found:   {stats['not_found']}")


if __name__ == '__main__':
    asyncio.run(main())
