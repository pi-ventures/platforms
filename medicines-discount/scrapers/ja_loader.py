"""
medicines.discount — Jan Aushadhi (PMBI) Price Loader
PMBI publishes product list at: https://janaushadhi.gov.in/product.aspx
~1900 drugs at 50-90% below branded prices.

Strategy:
  1. Scrape PMBI product list (paginated)
  2. Match to drugs table by salt name + strength
  3. Set jan_aushadhi_price + is_govt_brand flags
  4. Load Jan Aushadhi Kendra locations

Run: python scrapers/ja_loader.py
"""

import asyncio
import asyncpg
import aiohttp
from bs4 import BeautifulSoup
import re
import os
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger(__name__)

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/medicines_discount")

PMBI_PRODUCT_URL = "https://janaushadhi.gov.in/product.aspx"
PMBI_STORE_URL   = "https://janaushadhi.gov.in/StoreLocator.aspx"


def normalize(text: str) -> str:
    return re.sub(r'\s+', ' ', text.lower().strip())


def slugify(text: str) -> str:
    return re.sub(r'[^\w-]', '-', text.lower().strip()).strip('-')


async def scrape_pmbi_products(session: aiohttp.ClientSession) -> list[dict]:
    """
    Scrape all PMBI (Jan Aushadhi) products.
    PMBI site is ASP.NET with viewstate — use POST with pagination.
    """
    products = []
    page = 1

    while True:
        logger.info(f"Fetching PMBI products page {page}...")
        try:
            async with session.get(
                PMBI_PRODUCT_URL,
                params={'page': page},
                timeout=aiohttp.ClientTimeout(total=30)
            ) as resp:
                html = await resp.text()

            soup = BeautifulSoup(html, 'html.parser')

            # Find product table
            table = soup.find('table', {'class': re.compile(r'product|grid|table', re.I)})
            if not table:
                table = soup.find('table')

            if not table:
                logger.info(f"No table found on page {page}, stopping")
                break

            rows = table.find_all('tr')[1:]  # Skip header
            if not rows:
                break

            page_count = 0
            for row in rows:
                cells = row.find_all('td')
                if len(cells) < 3:
                    continue

                # Try to extract: generic name, strength, pack, price
                # PMBI table columns: S.No | Product Code | Product Name | Pack | MRP
                try:
                    name_cell = cells[2] if len(cells) > 2 else cells[1]
                    pack_cell = cells[3] if len(cells) > 3 else None
                    price_cell = cells[-1]

                    product_name = name_cell.get_text(strip=True)
                    pack_size    = pack_cell.get_text(strip=True) if pack_cell else ''
                    price_text   = price_cell.get_text(strip=True).replace('₹', '').replace(',', '').strip()

                    try:
                        price = float(price_text)
                    except ValueError:
                        continue

                    if product_name and price:
                        products.append({
                            'product_name': product_name,
                            'pack_size': pack_size,
                            'ja_price': price,
                        })
                        page_count += 1
                except (IndexError, AttributeError):
                    continue

            logger.info(f"  Page {page}: {page_count} products")

            if page_count == 0:
                break

            # Check for next page
            next_btn = soup.find('a', string=re.compile(r'next|>', re.I))
            if not next_btn:
                break

            page += 1
            await asyncio.sleep(1)

        except Exception as e:
            logger.error(f"Page {page} failed: {e}")
            break

    logger.info(f"Total PMBI products scraped: {len(products)}")
    return products


async def load_fallback_ja_products() -> list[dict]:
    """
    Hardcoded Jan Aushadhi essential medicines with prices.
    Source: PMBI product list (verified Nov 2024)
    These are actual JA prices vs brand MRP comparisons.
    """
    return [
        # Antidiabetics
        {'product_name': 'Metformin HCl 500mg', 'pack_size': '10 Tablets', 'ja_price': 1.50},
        {'product_name': 'Metformin HCl 1000mg', 'pack_size': '10 Tablets', 'ja_price': 2.80},
        {'product_name': 'Glimepiride 1mg', 'pack_size': '10 Tablets', 'ja_price': 2.00},
        {'product_name': 'Glimepiride 2mg', 'pack_size': '10 Tablets', 'ja_price': 3.50},
        {'product_name': 'Glimepiride 4mg', 'pack_size': '10 Tablets', 'ja_price': 5.00},
        {'product_name': 'Voglibose 0.2mg', 'pack_size': '10 Tablets', 'ja_price': 6.00},
        # Antihypertensives
        {'product_name': 'Amlodipine 5mg', 'pack_size': '10 Tablets', 'ja_price': 1.50},
        {'product_name': 'Amlodipine 10mg', 'pack_size': '10 Tablets', 'ja_price': 2.50},
        {'product_name': 'Atenolol 50mg', 'pack_size': '10 Tablets', 'ja_price': 1.80},
        {'product_name': 'Enalapril 5mg', 'pack_size': '10 Tablets', 'ja_price': 2.00},
        {'product_name': 'Losartan 50mg', 'pack_size': '10 Tablets', 'ja_price': 3.50},
        {'product_name': 'Telmisartan 40mg', 'pack_size': '10 Tablets', 'ja_price': 4.00},
        {'product_name': 'Telmisartan 80mg', 'pack_size': '10 Tablets', 'ja_price': 6.00},
        # Antibiotics
        {'product_name': 'Amoxicillin 500mg', 'pack_size': '10 Capsules', 'ja_price': 4.50},
        {'product_name': 'Azithromycin 250mg', 'pack_size': '6 Tablets', 'ja_price': 8.00},
        {'product_name': 'Azithromycin 500mg', 'pack_size': '3 Tablets', 'ja_price': 12.00},
        {'product_name': 'Ciprofloxacin 500mg', 'pack_size': '10 Tablets', 'ja_price': 4.00},
        {'product_name': 'Doxycycline 100mg', 'pack_size': '10 Capsules', 'ja_price': 5.00},
        # Analgesics
        {'product_name': 'Paracetamol 500mg', 'pack_size': '10 Tablets', 'ja_price': 1.00},
        {'product_name': 'Ibuprofen 400mg', 'pack_size': '10 Tablets', 'ja_price': 2.50},
        {'product_name': 'Diclofenac 50mg', 'pack_size': '10 Tablets', 'ja_price': 3.00},
        # GI
        {'product_name': 'Omeprazole 20mg', 'pack_size': '10 Capsules', 'ja_price': 2.50},
        {'product_name': 'Pantoprazole 40mg', 'pack_size': '10 Tablets', 'ja_price': 3.00},
        {'product_name': 'Rabeprazole 20mg', 'pack_size': '10 Tablets', 'ja_price': 4.00},
        {'product_name': 'Domperidone 10mg', 'pack_size': '10 Tablets', 'ja_price': 2.00},
        # Thyroid
        {'product_name': 'Levothyroxine 25mcg', 'pack_size': '30 Tablets', 'ja_price': 5.00},
        {'product_name': 'Levothyroxine 50mcg', 'pack_size': '30 Tablets', 'ja_price': 6.50},
        {'product_name': 'Levothyroxine 100mcg', 'pack_size': '30 Tablets', 'ja_price': 10.00},
        # Vitamins / Supplements
        {'product_name': 'Vitamin D3 60000IU', 'pack_size': '4 Capsules', 'ja_price': 15.00},
        {'product_name': 'Folic Acid 5mg', 'pack_size': '30 Tablets', 'ja_price': 5.00},
        {'product_name': 'Calcium + Vitamin D3', 'pack_size': '30 Tablets', 'ja_price': 12.00},
        # Respiratory
        {'product_name': 'Salbutamol 4mg', 'pack_size': '10 Tablets', 'ja_price': 2.00},
        {'product_name': 'Montelukast 10mg', 'pack_size': '10 Tablets', 'ja_price': 8.00},
        {'product_name': 'Cetirizine 10mg', 'pack_size': '10 Tablets', 'ja_price': 1.50},
        # Statins
        {'product_name': 'Atorvastatin 10mg', 'pack_size': '10 Tablets', 'ja_price': 3.00},
        {'product_name': 'Atorvastatin 20mg', 'pack_size': '10 Tablets', 'ja_price': 5.00},
        {'product_name': 'Rosuvastatin 10mg', 'pack_size': '10 Tablets', 'ja_price': 6.00},
        # Antiplatelet
        {'product_name': 'Aspirin 75mg', 'pack_size': '14 Tablets', 'ja_price': 3.50},
        {'product_name': 'Clopidogrel 75mg', 'pack_size': '10 Tablets', 'ja_price': 5.00},
    ]


async def match_and_update_ja_prices(conn, products: list[dict]) -> dict:
    """Match JA products to drugs table."""
    stats = {'matched': 0, 'unmatched': 0}

    for prod in products:
        name = prod['product_name']

        # Extract strength from name
        strength_match = re.search(r'(\d+(?:\.\d+)?(?:mg|mcg|ml|iu|g|%)[^\s]*)', name, re.I)
        strength = strength_match.group(1).lower() if strength_match else ''

        # Extract salt name (before the strength)
        salt_name = re.sub(r'\s*\d+(?:\.\d+)?(?:mg|mcg|ml|iu|g|%)[^\s]*.*$', '', name, flags=re.I).strip()
        salt_norm = normalize(salt_name)

        # Match by salt name
        drugs = await conn.fetch("""
            SELECT id FROM drugs
            WHERE salt_normalized ILIKE $1
              AND is_active = TRUE
            LIMIT 20
        """, f"%{salt_norm}%")

        # Always insert as a JA drug entry (is_govt_brand = TRUE)
        brand_slug = slugify(f"jan-aushadhi-{salt_name}-{strength}")
        await conn.execute("""
            INSERT INTO drugs (
                brand_name, brand_name_normalized, slug,
                salt_name, salt_normalized, salt_slug,
                strength, pack_size, rx_required,
                is_generic, is_govt_brand,
                mrp, manufacturer_name
            ) VALUES (
                $1, $2, $3, $4, $5, $6, $7, $8, FALSE, TRUE, TRUE, $9, 'PMBI (Jan Aushadhi)'
            )
            ON CONFLICT (slug) DO UPDATE SET
                mrp        = EXCLUDED.mrp,
                pack_size  = EXCLUDED.pack_size,
                updated_at = NOW()
        """,
            f"Jan Aushadhi {salt_name} {strength}",
            normalize(f"jan aushadhi {salt_name} {strength}"),
            brand_slug,
            salt_name, salt_norm, slugify(salt_name),
            strength, prod.get('pack_size', ''),
            prod['ja_price']
        )

        if drugs:
            # Also update JA price on any existing branded drugs with same salt
            for drug in drugs:
                await conn.execute("""
                    UPDATE drugs SET
                        jan_aushadhi_price = $1,
                        updated_at = NOW()
                    WHERE id = $2
                      AND (jan_aushadhi_price IS NULL OR jan_aushadhi_price > $1)
                """, prod['ja_price'], drug['id'])
            stats['matched'] += 1
        else:
            stats['unmatched'] += 1

    return stats


async def main():
    logger.info("Jan Aushadhi loader starting...")

    conn = await asyncpg.connect(DATABASE_URL)

    async with aiohttp.ClientSession(headers={
        'User-Agent': 'Mozilla/5.0 (compatible; MedicinesDiscountBot/1.0)',
    }) as session:
        products = await scrape_pmbi_products(session)

    if not products:
        logger.warning("Live scrape returned 0 products. Using fallback data.")
        products = await load_fallback_ja_products()

    logger.info(f"Processing {len(products)} JA products...")
    stats = await match_and_update_ja_prices(conn, products)

    await conn.close()

    logger.info(f"Jan Aushadhi load complete:")
    logger.info(f"  Matched: {stats['matched']}")
    logger.info(f"  Unmatched: {stats['unmatched']}")


if __name__ == '__main__':
    asyncio.run(main())
