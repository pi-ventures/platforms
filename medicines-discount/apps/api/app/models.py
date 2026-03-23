"""
medicines.discount — SQLAlchemy ORM Models
"""

from sqlalchemy import (
    Column, Integer, BigInteger, String, Text, Boolean, Numeric,
    DateTime, Date, ForeignKey, UniqueConstraint, Index, JSON
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base


class Manufacturer(Base):
    __tablename__ = "manufacturers"

    id                     = Column(Integer, primary_key=True)
    name_raw               = Column(Text, nullable=False)
    name_normalized        = Column(Text, nullable=False)
    slug                   = Column(Text, nullable=False, unique=True)
    mca_cin                = Column(Text)
    knowledgehub_entity_id = Column(Text)
    website_url            = Column(Text)
    who_gmp_certified      = Column(Boolean, default=False)
    drug_count             = Column(Integer, default=0)
    portal_count           = Column(Integer, default=0)
    city                   = Column(Text)
    state                  = Column(Text)
    is_govt                = Column(Boolean, default=False)
    synced_to_kh_at        = Column(DateTime(timezone=True))
    created_at             = Column(DateTime(timezone=True), server_default=func.now())
    updated_at             = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    drugs = relationship("Drug", back_populates="manufacturer_obj")


class Drug(Base):
    __tablename__ = "drugs"

    id                     = Column(Integer, primary_key=True)
    brand_name             = Column(Text, nullable=False)
    brand_name_normalized  = Column(Text, nullable=False)
    slug                   = Column(Text, nullable=False, unique=True)
    salt_name              = Column(Text, nullable=False)
    salt_normalized        = Column(Text, nullable=False)
    salt_slug              = Column(Text, nullable=False)
    strength               = Column(Text, nullable=False)
    pack_size              = Column(Text)
    dosage_form            = Column(Text)
    therapeutic_category   = Column(Text)
    therapeutic_slug       = Column(Text)
    atc_code               = Column(Text)
    rx_required            = Column(Boolean, default=True)
    schedule               = Column(Text)
    is_generic             = Column(Boolean, default=False)
    is_govt_brand          = Column(Boolean, default=False)
    manufacturer_id        = Column(Integer, ForeignKey("manufacturers.id"))
    manufacturer_name      = Column(Text)
    mrp                    = Column(Numeric(10, 2))
    nppa_ceiling_price     = Column(Numeric(10, 2))
    nppa_notified_at       = Column(Date)
    jan_aushadhi_price     = Column(Numeric(10, 2))
    price_per_unit         = Column(Numeric(10, 4))
    source_1mg_id          = Column(Text, unique=True)
    source_1mg_url         = Column(Text)
    uses                   = Column(Text)
    side_effects           = Column(Text)
    search_volume_estimate = Column(Integer, default=0)
    is_active              = Column(Boolean, default=True)
    created_at             = Column(DateTime(timezone=True), server_default=func.now())
    updated_at             = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    manufacturer_obj = relationship("Manufacturer", back_populates="drugs")
    prices           = relationship("DrugPrice", back_populates="drug", cascade="all, delete-orphan")
    generics         = relationship("GenericEquivalent", foreign_keys="GenericEquivalent.branded_drug_id", back_populates="branded_drug")


class DrugPrice(Base):
    __tablename__ = "drug_prices"

    id             = Column(BigInteger, primary_key=True)
    drug_id        = Column(Integer, ForeignKey("drugs.id", ondelete="CASCADE"), nullable=False)
    portal         = Column(Text, nullable=False)
    portal_url     = Column(Text)
    affiliate_url  = Column(Text)
    mrp            = Column(Numeric(10, 2))
    selling_price  = Column(Numeric(10, 2))
    discount_pct   = Column(Numeric(5, 2))
    price_per_unit = Column(Numeric(10, 4))
    in_stock       = Column(Boolean, default=True)
    cashback_pct   = Column(Numeric(5, 2), default=0)
    effective_price= Column(Numeric(10, 2))
    last_checked   = Column(DateTime(timezone=True), server_default=func.now())

    drug = relationship("Drug", back_populates="prices")

    __table_args__ = (
        UniqueConstraint("drug_id", "portal", name="uq_drug_portal"),
    )


class PriceHistory(Base):
    __tablename__ = "price_history"

    id            = Column(BigInteger, primary_key=True)
    drug_id       = Column(Integer, ForeignKey("drugs.id", ondelete="CASCADE"), nullable=False)
    portal        = Column(Text, nullable=False)
    selling_price = Column(Numeric(10, 2))
    mrp           = Column(Numeric(10, 2))
    in_stock      = Column(Boolean)
    recorded_at   = Column(DateTime(timezone=True), server_default=func.now())


class GenericEquivalent(Base):
    __tablename__ = "generic_equivalents"

    id              = Column(Integer, primary_key=True)
    branded_drug_id = Column(Integer, ForeignKey("drugs.id"), nullable=False)
    generic_drug_id = Column(Integer, ForeignKey("drugs.id"), nullable=False)
    same_salt       = Column(Boolean, default=True)
    same_strength   = Column(Boolean, default=True)
    same_form       = Column(Boolean, default=True)
    confidence      = Column(Numeric(3, 2), default=1.0)
    savings_pct     = Column(Numeric(5, 2))
    created_at      = Column(DateTime(timezone=True), server_default=func.now())

    branded_drug = relationship("Drug", foreign_keys=[branded_drug_id], back_populates="generics")
    generic_drug = relationship("Drug", foreign_keys=[generic_drug_id])

    __table_args__ = (
        UniqueConstraint("branded_drug_id", "generic_drug_id", name="uq_generic_pair"),
    )


class JaKendra(Base):
    __tablename__ = "ja_kendras"

    id              = Column(Integer, primary_key=True)
    pmbi_id         = Column(Text, unique=True)
    name            = Column(Text, nullable=False)
    address         = Column(Text)
    pin_code        = Column(Text, nullable=False)
    area            = Column(Text)
    city            = Column(Text)
    state           = Column(Text, nullable=False)
    lat             = Column(Numeric(10, 7))
    lng             = Column(Numeric(10, 7))
    phone           = Column(Text)
    hours           = Column(Text)
    google_place_id = Column(Text)
    is_verified     = Column(Boolean, default=False)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class AffiliateClick(Base):
    __tablename__ = "affiliate_clicks"

    id             = Column(BigInteger, primary_key=True)
    drug_id        = Column(Integer, ForeignKey("drugs.id"))
    portal         = Column(Text, nullable=False)
    session_id     = Column(Text)
    ip_hash        = Column(Text)
    user_agent     = Column(Text)
    referrer       = Column(Text)
    converted      = Column(Boolean, default=False)
    commission_amt = Column(Numeric(10, 2))
    clicked_at     = Column(DateTime(timezone=True), server_default=func.now())


class GeoSignal(Base):
    __tablename__ = "geo_drug_signals"

    id               = Column(BigInteger, primary_key=True)
    pin_code         = Column(Text, nullable=False)
    drug_id          = Column(Integer, ForeignKey("drugs.id"))
    disease_category = Column(Text)
    search_count     = Column(Integer, default=0)
    click_count      = Column(Integer, default=0)
    week             = Column(Date, nullable=False)

    __table_args__ = (
        UniqueConstraint("pin_code", "drug_id", "week", name="uq_geo_drug_week"),
    )


class ScraperRun(Base):
    __tablename__ = "scraper_runs"

    id             = Column(Integer, primary_key=True)
    portal         = Column(Text, nullable=False)
    run_type       = Column(Text, nullable=False)
    status         = Column(Text, default="running")
    drugs_scraped  = Column(Integer, default=0)
    drugs_new      = Column(Integer, default=0)
    drugs_updated  = Column(Integer, default=0)
    errors         = Column(Integer, default=0)
    started_at     = Column(DateTime(timezone=True), server_default=func.now())
    completed_at   = Column(DateTime(timezone=True))
    error_log      = Column(JSON, default=list)
