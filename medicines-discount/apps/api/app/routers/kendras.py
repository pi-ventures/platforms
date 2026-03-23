"""medicines.discount — Jan Aushadhi Kendras router"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import get_db

router = APIRouter()

@router.get("/")
async def kendras_near_pin(
    pin_code: str = Query(..., min_length=6, max_length=6),
    limit: int = Query(20, le=50),
    db: AsyncSession = Depends(get_db)
):
    """Kendras near a PIN code. UI sends ?pin_code=XXXXXX"""
    result = await db.execute(text("""
        SELECT id, name, address, pin_code, area, city, state,
               lat, lng, phone, hours, google_place_id, is_verified
        FROM ja_kendras
        WHERE pin_code = :pin OR pin_code LIKE :pin_prefix
        ORDER BY pin_code = :pin DESC, name ASC
        LIMIT :limit
    """), {"pin": pin_code, "pin_prefix": pin_code[:4] + "%", "limit": limit})
    return [dict(r._mapping) for r in result.fetchall()]


@router.get("/state/{state}")
async def kendras_by_state(state: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(text("""
        SELECT id, name, address, pin_code, area, city, state,
               lat, lng, phone, hours, is_verified
        FROM ja_kendras
        WHERE LOWER(state) = LOWER(:state)
        ORDER BY city, name
        LIMIT 200
    """), {"state": state})
    return [dict(r._mapping) for r in result.fetchall()]
