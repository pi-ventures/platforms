"""medicines.discount — Prices router"""
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import get_db

router = APIRouter()

@router.get("/compare/{drug_id}")
async def compare_prices(drug_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("""
        SELECT portal, selling_price, mrp, discount_pct,
               price_per_unit, in_stock, effective_price, last_checked
        FROM drug_prices
        WHERE drug_id = :drug_id
        ORDER BY CASE WHEN in_stock THEN 0 ELSE 1 END, selling_price ASC
    """), {"drug_id": drug_id})
    return [dict(r._mapping) for r in result.fetchall()]
