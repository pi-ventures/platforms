"""
medicines.discount — Drugs Router
GET /api/drugs                 → paginated drug list (for sitemap/category pages)
GET /api/drugs/{slug}          → full drug page data (prices, generics, schema)
GET /api/drugs/{slug}/history  → price history chart data
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, text
from app.database import get_db
from app.models import Drug, DrugPrice, GenericEquivalent as GenericEquivalentModel
from app.schemas import DrugDetail, PriceRow, GenericEquivalent
from typing import List, Optional

router = APIRouter()


@router.get("/")
async def list_drugs(
    therapeutic_category: Optional[str] = None,
    is_generic: Optional[bool] = None,
    manufacturer_slug: Optional[str] = None,
    limit: int = Query(20, le=100),
    offset: int = Query(0, ge=0),
    db: AsyncSession = Depends(get_db),
):
    """Paginated drug list — used by sitemap, category pages, manufacturer pages."""
    filters = ["d.is_active = TRUE"]
    params: dict = {"limit": limit, "offset": offset}

    if therapeutic_category:
        filters.append("d.therapeutic_slug = :cat")
        params["cat"] = therapeutic_category
    if is_generic is not None:
        filters.append("d.is_generic = :is_generic")
        params["is_generic"] = is_generic
    if manufacturer_slug:
        filters.append("m.slug = :mfr_slug")
        params["mfr_slug"] = manufacturer_slug

    where = " AND ".join(filters)
    join = "LEFT JOIN manufacturers m ON m.id = d.manufacturer_id" if manufacturer_slug else ""

    result = await db.execute(text(f"""
        SELECT
            d.id, d.brand_name, d.slug, d.salt_name, d.strength,
            d.manufacturer_name, d.therapeutic_category, d.is_generic,
            d.is_govt_brand, d.mrp, d.jan_aushadhi_price,
            MIN(dp.selling_price) AS best_price,
            (SELECT dp2.portal FROM drug_prices dp2
             WHERE dp2.drug_id = d.id AND dp2.in_stock = TRUE
             ORDER BY dp2.selling_price ASC LIMIT 1) AS best_portal,
            COUNT(dp.id) AS portal_count
        FROM drugs d
        {join}
        LEFT JOIN drug_prices dp ON dp.drug_id = d.id AND dp.in_stock = TRUE
        WHERE {where}
        GROUP BY d.id
        ORDER BY d.search_volume_estimate DESC, d.brand_name ASC
        LIMIT :limit OFFSET :offset
    """), params)

    rows = result.fetchall()
    return [dict(r._mapping) for r in rows]


@router.get("/{slug}", response_model=DrugDetail)
async def get_drug(slug: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Drug).where(Drug.slug == slug, Drug.is_active == True)
    )
    drug = result.scalar_one_or_none()
    if not drug:
        raise HTTPException(status_code=404, detail="Drug not found")

    # Prices
    prices_result = await db.execute(
        select(DrugPrice)
        .where(DrugPrice.drug_id == drug.id)
        .order_by(DrugPrice.selling_price.asc().nullslast())
    )
    prices = prices_result.scalars().all()

    # Generic equivalents — enriched with best online prices
    generics_result = await db.execute(text("""
        SELECT
            gd.id, gd.brand_name, gd.slug,
            gd.manufacturer_name, gd.mrp, gd.jan_aushadhi_price,
            gd.is_generic, gd.is_govt_brand,
            ge.savings_pct,
            MIN(dp.selling_price) AS best_price,
            (SELECT dp2.portal FROM drug_prices dp2
             WHERE dp2.drug_id = gd.id AND dp2.in_stock = TRUE
             ORDER BY dp2.selling_price ASC LIMIT 1) AS best_portal
        FROM generic_equivalents ge
        JOIN drugs gd ON gd.id = ge.generic_drug_id
        LEFT JOIN drug_prices dp ON dp.drug_id = gd.id AND dp.in_stock = TRUE
        WHERE ge.branded_drug_id = :drug_id
        GROUP BY gd.id, ge.savings_pct
        ORDER BY ge.confidence DESC, COALESCE(MIN(dp.selling_price), gd.jan_aushadhi_price, 999999) ASC
        LIMIT 10
    """), {"drug_id": drug.id})
    generics = generics_result.fetchall()

    # Best price across portals
    in_stock_prices = [p for p in prices if p.in_stock and p.selling_price]
    best_price = min((p.selling_price for p in in_stock_prices), default=None)
    best_portal = next((p.portal for p in in_stock_prices if p.selling_price == best_price), None)
    generic_price = min(
        (g.best_price or g.jan_aushadhi_price for g in generics
         if g.best_price or g.jan_aushadhi_price),
        default=None
    )

    max_mrp = max((p.mrp for p in prices if p.mrp), default=drug.mrp)
    max_saving_pct = None
    if best_price and max_mrp:
        max_saving_pct = round(100 * (1 - float(best_price) / float(max_mrp)), 1)

    return DrugDetail(
        id=drug.id,
        brand_name=drug.brand_name,
        slug=drug.slug,
        salt_name=drug.salt_name,
        salt_slug=drug.salt_slug,
        strength=drug.strength,
        pack_size=drug.pack_size,
        dosage_form=drug.dosage_form,
        therapeutic_category=drug.therapeutic_category,
        therapeutic_slug=drug.therapeutic_slug,
        rx_required=drug.rx_required,
        schedule=drug.schedule,
        manufacturer_name=drug.manufacturer_name,
        mrp=drug.mrp,
        nppa_ceiling_price=drug.nppa_ceiling_price,
        jan_aushadhi_price=drug.jan_aushadhi_price,
        uses=drug.uses,
        side_effects=drug.side_effects,
        prices=[PriceRow(
            portal=p.portal,
            portal_url=p.portal_url,
            affiliate_url=p.affiliate_url,
            mrp=p.mrp,
            selling_price=p.selling_price,
            discount_pct=p.discount_pct,
            price_per_unit=p.price_per_unit,
            in_stock=p.in_stock,
            cashback_pct=p.cashback_pct,
            effective_price=p.effective_price,
        ) for p in prices],
        generic_equivalents=[GenericEquivalent(
            id=g.id,
            brand_name=g.brand_name,
            slug=g.slug,
            manufacturer_name=g.manufacturer_name,
            mrp=g.mrp,
            jan_aushadhi_price=g.jan_aushadhi_price,
            best_price=g.best_price,
            best_portal=g.best_portal,
            savings_pct=g.savings_pct,
            is_generic=g.is_generic,
            is_govt_brand=g.is_govt_brand,
        ) for g in generics],
        best_price=best_price,
        best_portal=best_portal,
        generic_price=generic_price,
        max_saving_pct=max_saving_pct,
        portal_count=len(prices),
    )


@router.get("/{slug}/history")
async def get_price_history(slug: str, portal: Optional[str] = None, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Drug.id).where(Drug.slug == slug))
    drug_id = result.scalar_one_or_none()
    if not drug_id:
        raise HTTPException(status_code=404, detail="Drug not found")

    query = """
        SELECT portal, selling_price, recorded_at
        FROM price_history
        WHERE drug_id = :drug_id
        {}
        ORDER BY recorded_at DESC
        LIMIT 500
    """.format("AND portal = :portal" if portal else "")

    params = {"drug_id": drug_id}
    if portal:
        params["portal"] = portal

    rows = await db.execute(text(query), params)
    return [{"portal": r.portal, "price": float(r.selling_price), "date": r.recorded_at.isoformat()} for r in rows]
