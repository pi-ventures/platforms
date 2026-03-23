"""medicines.discount — Salts router"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import get_db

router = APIRouter()

@router.get("/{salt_slug}")
async def get_salt(salt_slug: str, db: AsyncSession = Depends(get_db)):
    # Summary row
    summary = await db.execute(text("""
        SELECT d.salt_name, d.salt_slug, d.therapeutic_category,
               COUNT(DISTINCT d.id) AS brand_count,
               MIN(dp.selling_price) AS cheapest_price,
               MIN(d.jan_aushadhi_price) AS ja_price,
               ROUND(100.0*(1-MIN(dp.selling_price)/NULLIF(MAX(dp.mrp),0)),1) AS max_saving_pct
        FROM drugs d
        LEFT JOIN drug_prices dp ON dp.drug_id = d.id AND dp.in_stock = TRUE
        WHERE d.salt_slug = :s AND d.is_active = TRUE
        GROUP BY d.salt_name, d.salt_slug, d.therapeutic_category
    """), {"s": salt_slug})
    row = summary.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Salt not found")

    # All brands — sorted: govt first, then generic, then branded; cheapest first within group
    brands_result = await db.execute(text("""
        SELECT
            d.id, d.brand_name, d.slug, d.strength, d.pack_size,
            d.manufacturer_name, d.is_generic, d.is_govt_brand,
            d.mrp, d.jan_aushadhi_price,
            MIN(dp.selling_price) AS best_price,
            (SELECT dp2.portal FROM drug_prices dp2
             WHERE dp2.drug_id = d.id AND dp2.in_stock = TRUE
             ORDER BY dp2.selling_price ASC LIMIT 1) AS best_portal
        FROM drugs d
        LEFT JOIN drug_prices dp ON dp.drug_id = d.id AND dp.in_stock = TRUE
        WHERE d.salt_slug = :s AND d.is_active = TRUE
        GROUP BY d.id
        ORDER BY
            d.is_govt_brand DESC,
            d.is_generic DESC,
            COALESCE(MIN(dp.selling_price), d.jan_aushadhi_price, d.mrp, 999999) ASC
    """), {"s": salt_slug})
    brands = brands_result.fetchall()

    return {
        **dict(row._mapping),
        "brands": [
            {
                "id": b.id,
                "brand_name": b.brand_name,
                "slug": b.slug,
                "strength": b.strength,
                "pack_size": b.pack_size,
                "manufacturer_name": b.manufacturer_name,
                "is_generic": b.is_generic,
                "is_govt_brand": b.is_govt_brand,
                "mrp": float(b.mrp) if b.mrp else None,
                "jan_aushadhi_price": float(b.jan_aushadhi_price) if b.jan_aushadhi_price else None,
                "best_price": float(b.best_price) if b.best_price else None,
                "best_portal": b.best_portal,
                "savings_pct": None,
            }
            for b in brands
        ]
    }
