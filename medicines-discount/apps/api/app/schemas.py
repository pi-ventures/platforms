"""
medicines.discount — Pydantic Schemas
"""

from pydantic import BaseModel
from typing import Optional, List
from decimal import Decimal


class PriceRow(BaseModel):
    portal: str
    portal_url: Optional[str]
    affiliate_url: Optional[str]
    mrp: Optional[Decimal]
    selling_price: Optional[Decimal]
    discount_pct: Optional[Decimal]
    price_per_unit: Optional[Decimal]
    in_stock: bool
    cashback_pct: Optional[Decimal]
    effective_price: Optional[Decimal]

    class Config:
        from_attributes = True


class GenericEquivalent(BaseModel):
    id: int
    brand_name: str
    slug: str
    manufacturer_name: Optional[str]
    mrp: Optional[Decimal]
    jan_aushadhi_price: Optional[Decimal]
    best_price: Optional[Decimal]
    best_portal: Optional[str]
    savings_pct: Optional[Decimal]
    is_generic: bool
    is_govt_brand: bool

    class Config:
        from_attributes = True


class DrugDetail(BaseModel):
    id: int
    brand_name: str
    slug: str
    salt_name: str
    salt_slug: str
    strength: str
    pack_size: Optional[str]
    dosage_form: Optional[str]
    therapeutic_category: Optional[str]
    therapeutic_slug: Optional[str]
    rx_required: bool
    schedule: Optional[str]
    manufacturer_name: Optional[str]
    mrp: Optional[Decimal]
    nppa_ceiling_price: Optional[Decimal]
    jan_aushadhi_price: Optional[Decimal]
    uses: Optional[str]
    side_effects: Optional[str]
    prices: List[PriceRow]
    generic_equivalents: List[GenericEquivalent]
    best_price: Optional[Decimal]
    best_portal: Optional[str]
    generic_price: Optional[Decimal]
    max_saving_pct: Optional[float]
    portal_count: int

    class Config:
        from_attributes = True


class DrugSummary(BaseModel):
    id: int
    brand_name: str
    slug: str
    salt_name: str
    strength: str
    manufacturer_name: Optional[str]
    best_price: Optional[Decimal]
    best_portal: Optional[str]
    jan_aushadhi_price: Optional[Decimal]
    portal_count: int
    saving_pct: Optional[float]

    class Config:
        from_attributes = True
