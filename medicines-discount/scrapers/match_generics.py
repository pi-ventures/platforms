"""
medicines.discount — Generic Equivalents Matcher
After catalog is loaded, run this to build the generic_equivalents table.

Logic:
  For each branded drug → find all drugs with same salt + strength
  → If cheaper → it's a generic alternative
  → Compute savings_pct

Run: python scrapers/match_generics.py
"""

import asyncio
import asyncpg
import os
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/medicines_discount")


async def main():
    logger.info("Generic matcher starting...")
    conn = await asyncpg.connect(DATABASE_URL)

    # Clear existing mappings
    await conn.execute("DELETE FROM generic_equivalents")

    # Find all branded drugs that have cheaper generics with same salt + strength
    count = await conn.fetchval("""
        INSERT INTO generic_equivalents (
            branded_drug_id, generic_drug_id,
            same_salt, same_strength, same_form,
            confidence, savings_pct
        )
        SELECT
            b.id                    AS branded_drug_id,
            g.id                    AS generic_drug_id,
            TRUE                    AS same_salt,
            (b.strength = g.strength) AS same_strength,
            (b.dosage_form = g.dosage_form OR b.dosage_form IS NULL OR g.dosage_form IS NULL) AS same_form,
            CASE
                WHEN b.strength = g.strength AND b.dosage_form = g.dosage_form THEN 1.0
                WHEN b.strength = g.strength THEN 0.9
                ELSE 0.7
            END                     AS confidence,
            ROUND(
                100.0 * (1 - COALESCE(g.mrp, gp.selling_price) / NULLIF(COALESCE(b.mrp, bp.selling_price), 0)),
                1
            )                       AS savings_pct
        FROM drugs b
        LEFT JOIN drug_prices bp ON bp.drug_id = b.id AND bp.in_stock = TRUE
        -- Find generics: same salt, not the same drug, cheaper
        JOIN drugs g ON
            g.salt_normalized = b.salt_normalized
            AND g.id != b.id
            AND (g.is_generic = TRUE OR g.is_govt_brand = TRUE)
            AND g.is_active = TRUE
        LEFT JOIN drug_prices gp ON gp.drug_id = g.id AND gp.in_stock = TRUE
        WHERE b.is_active = TRUE
          AND (g.is_govt_brand = TRUE OR COALESCE(g.mrp, gp.selling_price) < COALESCE(b.mrp, bp.selling_price) * 0.8)
        ON CONFLICT (branded_drug_id, generic_drug_id) DO NOTHING
        RETURNING 1
    """)

    logger.info(f"Generic pairs created: {count}")

    # Update drug_count on manufacturers
    await conn.execute("""
        UPDATE manufacturers m SET
            drug_count = (SELECT COUNT(*) FROM drugs d WHERE d.manufacturer_id = m.id AND d.is_active = TRUE)
    """)
    logger.info("Manufacturer drug counts updated")

    # Update search_volume_estimate based on salt popularity
    await conn.execute("""
        UPDATE drugs d SET
            search_volume_estimate = sub.salt_count * 100
        FROM (
            SELECT salt_slug, COUNT(*) AS salt_count
            FROM drugs
            WHERE is_active = TRUE
            GROUP BY salt_slug
        ) sub
        WHERE d.salt_slug = sub.salt_slug
    """)
    logger.info("Search volume estimates set")

    await conn.close()
    logger.info("Generic matching complete")


if __name__ == '__main__':
    asyncio.run(main())
