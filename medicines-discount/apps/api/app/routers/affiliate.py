"""
medicines.discount — Affiliate Router
GET /api/affiliate/redirect/{drug_id}/{portal}  → track click + redirect
POST /api/affiliate/conversion                  → mark conversion (webhook from portals)
"""

from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from app.database import get_db
from app.models import Drug, DrugPrice, AffiliateClick
import hashlib
import uuid

router = APIRouter()

# Affiliate link builders per portal
AFFILIATE_BUILDERS = {
    "1mg": lambda url, drug_id: f"{url}?utm_source=medicinesdiscount&utm_medium=affiliate&utm_campaign=price_compare",
    "pharmeasy": lambda url, drug_id: f"{url}?ref=medicinesdiscount",
    "netmeds": lambda url, drug_id: f"{url}?utm_source=medicinesdiscount",
    "apollo": lambda url, drug_id: f"{url}?utm_source=medicinesdiscount",
    "medplus": lambda url, drug_id: f"{url}?ref=medicinesdiscount",
    "flipkart_health": lambda url, drug_id: f"{url}?affid=medicinesdiscount",
    "amazon_pharmacy": lambda url, drug_id: f"{url}?tag=medicinesdiscount-21",
}


@router.get("/redirect/{drug_id}/{portal}")
async def affiliate_redirect(
    drug_id: int,
    portal: str,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Track click → redirect to portal.
    Session ID from cookie or generate new.
    """
    # Get portal URL
    result = await db.execute(
        select(DrugPrice).where(
            DrugPrice.drug_id == drug_id,
            DrugPrice.portal == portal,
        )
    )
    price = result.scalar_one_or_none()
    if not price or not price.portal_url:
        raise HTTPException(status_code=404, detail="Portal listing not found")

    # Build affiliate URL
    builder = AFFILIATE_BUILDERS.get(portal)
    redirect_url = builder(price.portal_url, drug_id) if builder else price.portal_url

    # Hash IP for analytics (privacy-safe)
    ip = request.client.host if request.client else "unknown"
    ip_hash = hashlib.sha256(ip.encode()).hexdigest()[:16]

    # Session ID
    session_id = request.cookies.get("md_session") or str(uuid.uuid4())

    # Log click
    click = AffiliateClick(
        drug_id=drug_id,
        portal=portal,
        session_id=session_id,
        ip_hash=ip_hash,
        user_agent=request.headers.get("user-agent", "")[:500],
        referrer=request.headers.get("referer", "")[:500],
    )
    db.add(click)
    await db.commit()

    # Redirect with session cookie
    response = RedirectResponse(url=redirect_url, status_code=302)
    response.set_cookie("md_session", session_id, max_age=86400 * 30, httponly=True)
    return response


@router.get("/stats/{drug_id}")
async def affiliate_stats(drug_id: int, db: AsyncSession = Depends(get_db)):
    """Internal — click stats per drug."""
    from sqlalchemy import text
    result = await db.execute(
        text("""
            SELECT portal,
                   COUNT(*) AS clicks,
                   COUNT(*) FILTER (WHERE converted) AS conversions,
                   SUM(commission_amt) AS total_commission
            FROM affiliate_clicks
            WHERE drug_id = :drug_id
            GROUP BY portal
            ORDER BY clicks DESC
        """),
        {"drug_id": drug_id}
    )
    rows = result.fetchall()
    return [
        {
            "portal": r.portal,
            "clicks": r.clicks,
            "conversions": r.conversions,
            "commission": float(r.total_commission) if r.total_commission else 0,
        }
        for r in rows
    ]
