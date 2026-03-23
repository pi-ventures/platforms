"""medicines.discount — Geo signals router (feeds KnowledgeHub)"""
from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import get_db
from datetime import date, timedelta
import re

router = APIRouter()

def get_week_start(d: date) -> date:
    return d - timedelta(days=d.weekday())


@router.post("/signal")
async def record_geo_signal(
    drug_id: int,
    pin_code: str,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """Record a drug search/click with PIN code for geo intelligence."""
    if not re.match(r'^\d{6}$', pin_code):
        return {"ok": False, "reason": "invalid pin"}

    # Get disease category for this drug
    result = await db.execute(text("""
        SELECT therapeutic_category FROM drugs WHERE id = :drug_id
    """), {"drug_id": drug_id})
    row = result.fetchone()
    if not row:
        return {"ok": False, "reason": "drug not found"}

    disease_cat = row.therapeutic_category
    week = get_week_start(date.today())

    await db.execute(text("""
        INSERT INTO geo_drug_signals (pin_code, drug_id, disease_category, search_count, week)
        VALUES (:pin, :drug_id, :disease_cat, 1, :week)
        ON CONFLICT (pin_code, drug_id, week) DO UPDATE SET
            search_count = geo_drug_signals.search_count + 1
    """), {"pin": pin_code, "drug_id": drug_id, "disease_cat": disease_cat, "week": week})

    return {"ok": True}


@router.get("/burden/{pin_code}")
async def disease_burden(pin_code: str, db: AsyncSession = Depends(get_db)):
    """Disease burden signals for a PIN code — for KnowledgeHub sync."""
    result = await db.execute(text("""
        SELECT disease_category,
               SUM(search_count) AS total_searches,
               COUNT(DISTINCT drug_id) AS drug_count,
               MAX(week) AS latest_week
        FROM geo_drug_signals
        WHERE pin_code = :pin
          AND week >= :since
        GROUP BY disease_category
        ORDER BY total_searches DESC
    """), {"pin": pin_code, "since": get_week_start(date.today()) - timedelta(weeks=12)})

    return {
        "pin_code": pin_code,
        "signals": [dict(r._mapping) for r in result.fetchall()]
    }
