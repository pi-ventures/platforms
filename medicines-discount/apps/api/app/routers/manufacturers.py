"""medicines.discount — Manufacturers router"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, select
from app.database import get_db
from app.models import Manufacturer

router = APIRouter()

@router.get("/{slug}")
async def get_manufacturer(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Manufacturer).where(Manufacturer.slug == slug))
    mfr = result.scalar_one_or_none()
    if not mfr:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Manufacturer not found")

    drugs = await db.execute(text("""
        SELECT d.brand_name, d.slug, d.salt_name, d.strength,
               MIN(dp.selling_price) AS best_price
        FROM drugs d
        LEFT JOIN drug_prices dp ON dp.drug_id = d.id AND dp.in_stock = TRUE
        WHERE d.manufacturer_id = :mfr_id AND d.is_active = TRUE
        GROUP BY d.id
        ORDER BY d.brand_name
        LIMIT 100
    """), {"mfr_id": mfr.id})

    return {
        "id": mfr.id,
        "name": mfr.name_raw,
        "slug": mfr.slug,
        "who_gmp": mfr.who_gmp_certified,
        "drug_count": mfr.drug_count,
        "city": mfr.city,
        "state": mfr.state,
        "drugs": [dict(r._mapping) for r in drugs.fetchall()],
    }
