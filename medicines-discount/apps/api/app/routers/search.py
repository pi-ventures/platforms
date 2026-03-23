"""
medicines.discount — Search Router
GET /api/search?q=metformin        → combined drugs + salts (used by UI search bar + search page)
GET /api/search/full?q=metformin   → full paginated results with filters
"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.database import get_db
from typing import Optional
import re

router = APIRouter()


@router.get("/")
async def search(
    q: str = Query(..., min_length=2, max_length=100),
    limit: int = Query(20, le=50),
    db: AsyncSession = Depends(get_db)
):
    """
    Combined search — returns { drugs, salts, total }.
    Used by both autocomplete dropdown and search page.
    """
    q_clean = re.sub(r'[^\w\s]', '', q).strip().lower()

    drugs_result = await db.execute(text("""
        SELECT
            d.id, d.brand_name, d.slug, d.salt_name, d.strength,
            d.manufacturer_name, d.mrp,
            MIN(dp.selling_price) AS best_price,
            (SELECT dp2.portal FROM drug_prices dp2
             WHERE dp2.drug_id = d.id AND dp2.in_stock = TRUE
             ORDER BY dp2.selling_price ASC LIMIT 1) AS best_portal
        FROM drugs d
        LEFT JOIN drug_prices dp ON dp.drug_id = d.id AND dp.in_stock = TRUE
        WHERE d.is_active = TRUE
          AND (
              d.brand_name_normalized ILIKE :prefix
              OR d.salt_normalized ILIKE :prefix
              OR d.brand_name_normalized % :q
              OR d.salt_normalized % :q
          )
        GROUP BY d.id
        ORDER BY
            GREATEST(
                similarity(d.brand_name_normalized, :q),
                similarity(d.salt_normalized, :q)
            ) DESC,
            d.search_volume_estimate DESC
        LIMIT :limit
    """), {"q": q_clean, "prefix": f"{q_clean}%", "limit": limit})
    drugs = drugs_result.fetchall()

    salts_result = await db.execute(text("""
        SELECT
            d.salt_slug, d.salt_name, d.therapeutic_category,
            COUNT(DISTINCT d.id) AS brand_count,
            MIN(dp.selling_price) AS cheapest_price
        FROM drugs d
        LEFT JOIN drug_prices dp ON dp.drug_id = d.id AND dp.in_stock = TRUE
        WHERE d.is_active = TRUE
          AND (d.salt_normalized ILIKE :prefix OR d.salt_normalized % :q)
        GROUP BY d.salt_slug, d.salt_name, d.therapeutic_category
        ORDER BY similarity(d.salt_normalized, :q) DESC, brand_count DESC
        LIMIT 6
    """), {"q": q_clean, "prefix": f"{q_clean}%"})
    salts = salts_result.fetchall()

    drug_list = [
        {
            "id": r.id,
            "brand_name": r.brand_name,
            "slug": r.slug,
            "salt_name": r.salt_name,
            "strength": r.strength,
            "manufacturer_name": r.manufacturer_name,
            "mrp": float(r.mrp) if r.mrp else None,
            "best_price": float(r.best_price) if r.best_price else None,
            "best_portal": r.best_portal,
        }
        for r in drugs
    ]
    salt_list = [
        {
            "salt_slug": r.salt_slug,
            "salt_name": r.salt_name,
            "brand_count": r.brand_count,
            "cheapest_price": float(r.cheapest_price) if r.cheapest_price else None,
        }
        for r in salts
    ]
    return {"drugs": drug_list, "salts": salt_list, "total": len(drug_list) + len(salt_list)}


@router.get("/full")
async def full_search(
    q: str = Query(..., min_length=2),
    category: Optional[str] = None,
    form: Optional[str] = None,
    rx: Optional[bool] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(20, le=50),
    db: AsyncSession = Depends(get_db)
):
    q_clean = re.sub(r'[^\w\s]', '', q).strip().lower()
    offset = (page - 1) * limit
    filters = ["d.is_active = TRUE"]
    params: dict = {"q": q_clean, "prefix": f"{q_clean}%", "limit": limit, "offset": offset}
    if category:
        filters.append("d.therapeutic_slug = :category")
        params["category"] = category
    if form:
        filters.append("d.dosage_form ILIKE :form")
        params["form"] = form
    if rx is not None:
        filters.append("d.rx_required = :rx")
        params["rx"] = rx
    where_clause = " AND ".join(filters)
    result = await db.execute(text(f"""
        SELECT d.id, d.brand_name, d.slug, d.salt_name, d.strength,
               d.pack_size, d.dosage_form, d.therapeutic_category,
               d.manufacturer_name, d.rx_required, d.is_generic,
               d.jan_aushadhi_price, d.nppa_ceiling_price,
               MIN(dp.selling_price) AS best_price,
               (SELECT dp2.portal FROM drug_prices dp2
                WHERE dp2.drug_id = d.id AND dp2.in_stock = TRUE
                ORDER BY dp2.selling_price ASC LIMIT 1) AS best_portal,
               MAX(dp.mrp) AS max_mrp,
               COUNT(dp.id) AS portal_count
        FROM drugs d
        LEFT JOIN drug_prices dp ON dp.drug_id = d.id AND dp.in_stock = TRUE
        WHERE {where_clause}
          AND (d.brand_name_normalized ILIKE :prefix OR d.salt_normalized ILIKE :prefix
               OR d.brand_name_normalized % :q OR d.salt_normalized % :q)
        GROUP BY d.id
        ORDER BY GREATEST(similarity(d.brand_name_normalized, :q),
                          similarity(d.salt_normalized, :q)) DESC,
                 d.search_volume_estimate DESC
        LIMIT :limit OFFSET :offset
    """), params)
    rows = result.fetchall()
    return {
        "query": q, "page": page,
        "results": [
            {
                "id": r.id, "brand_name": r.brand_name, "slug": r.slug,
                "salt_name": r.salt_name, "strength": r.strength,
                "manufacturer_name": r.manufacturer_name,
                "therapeutic_category": r.therapeutic_category,
                "best_price": float(r.best_price) if r.best_price else None,
                "best_portal": r.best_portal,
                "max_mrp": float(r.max_mrp) if r.max_mrp else None,
                "portal_count": r.portal_count,
                "saving_pct": round(100*(1-float(r.best_price)/float(r.max_mrp)),1)
                              if r.best_price and r.max_mrp else None,
            } for r in rows
        ]
    }
