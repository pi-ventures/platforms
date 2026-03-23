-- ═══════════════════════════════════════════════════════════════
-- medicines.discount — Core Schema
-- Migration 001
-- ═══════════════════════════════════════════════════════════════

-- ── Extensions ───────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";   -- fuzzy search on drug names
CREATE EXTENSION IF NOT EXISTS "unaccent";  -- normalize drug names

-- ── Manufacturers ─────────────────────────────────────────────
CREATE TABLE manufacturers (
    id                      SERIAL PRIMARY KEY,
    name_raw                TEXT NOT NULL,
    name_normalized         TEXT NOT NULL,
    slug                    TEXT NOT NULL UNIQUE,
    mca_cin                 TEXT,
    knowledgehub_entity_id  TEXT,
    website_url             TEXT,
    who_gmp_certified       BOOLEAN DEFAULT FALSE,
    drug_count              INT DEFAULT 0,
    portal_count            INT DEFAULT 0,
    city                    TEXT,
    state                   TEXT,
    is_govt                 BOOLEAN DEFAULT FALSE,  -- PMBI etc
    synced_to_kh_at         TIMESTAMPTZ,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mfr_slug             ON manufacturers(slug);
CREATE INDEX idx_mfr_name_trgm        ON manufacturers USING GIN (name_normalized gin_trgm_ops);
CREATE INDEX idx_mfr_kh_entity        ON manufacturers(knowledgehub_entity_id);

-- ── Drugs (master catalog) ────────────────────────────────────
CREATE TABLE drugs (
    id                      SERIAL PRIMARY KEY,
    -- Identity
    brand_name              TEXT NOT NULL,
    brand_name_normalized   TEXT NOT NULL,
    slug                    TEXT NOT NULL UNIQUE,
    -- Composition
    salt_name               TEXT NOT NULL,       -- "Metformin Hydrochloride"
    salt_normalized         TEXT NOT NULL,       -- "metformin hydrochloride"
    salt_slug               TEXT NOT NULL,       -- "metformin-hydrochloride"
    strength                TEXT NOT NULL,       -- "500mg", "10mg/5ml"
    pack_size               TEXT,               -- "10 Tablets", "60ml Syrup"
    dosage_form             TEXT,               -- "Tablet","Capsule","Syrup","Injection"
    -- Classification
    therapeutic_category    TEXT,               -- "Antidiabetic", "Antibiotic"
    therapeutic_slug        TEXT,
    atc_code                TEXT,               -- WHO ATC classification
    rx_required             BOOLEAN DEFAULT TRUE,
    schedule                TEXT,               -- "H", "H1", "X", "OTC"
    is_generic              BOOLEAN DEFAULT FALSE,
    is_govt_brand           BOOLEAN DEFAULT FALSE,  -- Jan Aushadhi
    -- Manufacturer
    manufacturer_id         INT REFERENCES manufacturers(id),
    manufacturer_name       TEXT,               -- denormalized for speed
    -- Pricing
    mrp                     NUMERIC(10,2),
    nppa_ceiling_price      NUMERIC(10,2),
    nppa_notified_at        DATE,
    jan_aushadhi_price      NUMERIC(10,2),
    price_per_unit          NUMERIC(10,4),      -- per tablet/ml etc
    -- Source
    source_1mg_id           TEXT UNIQUE,
    source_1mg_url          TEXT,
    -- Metadata
    uses                    TEXT,
    side_effects            TEXT,
    search_volume_estimate  INT DEFAULT 0,
    is_active               BOOLEAN DEFAULT TRUE,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_drugs_slug           ON drugs(slug);
CREATE INDEX idx_drugs_salt_slug      ON drugs(salt_slug);
CREATE INDEX idx_drugs_salt_norm      ON drugs(salt_normalized);
CREATE INDEX idx_drugs_brand_trgm     ON drugs USING GIN (brand_name_normalized gin_trgm_ops);
CREATE INDEX idx_drugs_salt_trgm      ON drugs USING GIN (salt_normalized gin_trgm_ops);
CREATE INDEX idx_drugs_therapeutic    ON drugs(therapeutic_slug);
CREATE INDEX idx_drugs_mfr_id         ON drugs(manufacturer_id);
CREATE INDEX idx_drugs_source_1mg     ON drugs(source_1mg_id);
CREATE INDEX idx_drugs_is_active      ON drugs(is_active);
CREATE INDEX idx_drugs_schedule       ON drugs(schedule);

-- ── Drug Prices (per portal) ──────────────────────────────────
CREATE TABLE drug_prices (
    id                      BIGSERIAL PRIMARY KEY,
    drug_id                 INT NOT NULL REFERENCES drugs(id) ON DELETE CASCADE,
    portal                  TEXT NOT NULL,  -- '1mg','pharmeasy','netmeds','apollo' etc
    portal_url              TEXT,
    affiliate_url           TEXT,           -- our tracked affiliate link
    mrp                     NUMERIC(10,2),
    selling_price           NUMERIC(10,2),
    discount_pct            NUMERIC(5,2),
    price_per_unit          NUMERIC(10,4),
    in_stock                BOOLEAN DEFAULT TRUE,
    cashback_pct            NUMERIC(5,2) DEFAULT 0,
    effective_price         NUMERIC(10,2),  -- after cashback
    last_checked            TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(drug_id, portal)
);

CREATE INDEX idx_dp_drug_id           ON drug_prices(drug_id);
CREATE INDEX idx_dp_portal            ON drug_prices(portal);
CREATE INDEX idx_dp_selling_price     ON drug_prices(selling_price);
CREATE INDEX idx_dp_in_stock          ON drug_prices(in_stock);
CREATE INDEX idx_dp_last_checked      ON drug_prices(last_checked);

-- ── Price History ─────────────────────────────────────────────
CREATE TABLE price_history (
    id                      BIGSERIAL PRIMARY KEY,
    drug_id                 INT NOT NULL REFERENCES drugs(id) ON DELETE CASCADE,
    portal                  TEXT NOT NULL,
    selling_price           NUMERIC(10,2),
    mrp                     NUMERIC(10,2),
    in_stock                BOOLEAN,
    recorded_at             TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ph_drug_portal       ON price_history(drug_id, portal);
CREATE INDEX idx_ph_recorded_at       ON price_history(recorded_at DESC);

-- Auto-archive price changes
CREATE OR REPLACE FUNCTION archive_price_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.selling_price IS DISTINCT FROM NEW.selling_price
       OR OLD.in_stock IS DISTINCT FROM NEW.in_stock THEN
        INSERT INTO price_history(drug_id, portal, selling_price, mrp, in_stock)
        VALUES (OLD.drug_id, OLD.portal, OLD.selling_price, OLD.mrp, OLD.in_stock);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_archive_price
    BEFORE UPDATE ON drug_prices
    FOR EACH ROW EXECUTE FUNCTION archive_price_change();

-- ── Generic Equivalents ───────────────────────────────────────
CREATE TABLE generic_equivalents (
    id                      SERIAL PRIMARY KEY,
    branded_drug_id         INT NOT NULL REFERENCES drugs(id),
    generic_drug_id         INT NOT NULL REFERENCES drugs(id),
    same_salt               BOOLEAN DEFAULT TRUE,
    same_strength           BOOLEAN DEFAULT TRUE,
    same_form               BOOLEAN DEFAULT TRUE,
    confidence              NUMERIC(3,2) DEFAULT 1.0,  -- 0.0–1.0
    savings_pct             NUMERIC(5,2),
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(branded_drug_id, generic_drug_id)
);

CREATE INDEX idx_ge_branded           ON generic_equivalents(branded_drug_id);
CREATE INDEX idx_ge_generic           ON generic_equivalents(generic_drug_id);

-- ── Jan Aushadhi Kendras ──────────────────────────────────────
CREATE TABLE ja_kendras (
    id                      SERIAL PRIMARY KEY,
    pmbi_id                 TEXT UNIQUE,
    name                    TEXT NOT NULL,
    address                 TEXT,
    pin_code                TEXT NOT NULL,
    area                    TEXT,
    city                    TEXT,
    state                   TEXT NOT NULL,
    lat                     NUMERIC(10,7),
    lng                     NUMERIC(10,7),
    phone                   TEXT,
    hours                   TEXT,
    google_place_id         TEXT,
    is_verified             BOOLEAN DEFAULT FALSE,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_jak_pin_code         ON ja_kendras(pin_code);
CREATE INDEX idx_jak_state            ON ja_kendras(state);

-- ── Affiliate Clicks ──────────────────────────────────────────
CREATE TABLE affiliate_clicks (
    id                      BIGSERIAL PRIMARY KEY,
    drug_id                 INT REFERENCES drugs(id),
    portal                  TEXT NOT NULL,
    session_id              TEXT,
    ip_hash                 TEXT,
    user_agent              TEXT,
    referrer                TEXT,
    converted               BOOLEAN DEFAULT FALSE,
    commission_amt          NUMERIC(10,2),
    clicked_at              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ac_drug_id           ON affiliate_clicks(drug_id);
CREATE INDEX idx_ac_portal            ON affiliate_clicks(portal);
CREATE INDEX idx_ac_clicked_at        ON affiliate_clicks(clicked_at DESC);

-- ── Geo Drug Signals (feeds KnowledgeHub) ────────────────────
CREATE TABLE geo_drug_signals (
    id                      BIGSERIAL PRIMARY KEY,
    pin_code                TEXT NOT NULL,
    drug_id                 INT REFERENCES drugs(id),
    disease_category        TEXT,
    search_count            INT DEFAULT 0,
    click_count             INT DEFAULT 0,
    week                    DATE NOT NULL,  -- Monday of the week
    UNIQUE(pin_code, drug_id, week)
);

CREATE INDEX idx_gds_pin_code         ON geo_drug_signals(pin_code);
CREATE INDEX idx_gds_drug_id          ON geo_drug_signals(drug_id);
CREATE INDEX idx_gds_week             ON geo_drug_signals(week DESC);
CREATE INDEX idx_gds_disease_cat      ON geo_drug_signals(disease_category);

-- ── Disease Burden by PIN ─────────────────────────────────────
CREATE TABLE disease_burden_by_pin (
    pin_code                TEXT PRIMARY KEY,
    diabetes_index          NUMERIC(5,2) DEFAULT 0,
    cardiac_index           NUMERIC(5,2) DEFAULT 0,
    respiratory_index       NUMERIC(5,2) DEFAULT 0,
    oncology_index          NUMERIC(5,2) DEFAULT 0,
    neurological_index      NUMERIC(5,2) DEFAULT 0,
    infectious_index        NUMERIC(5,2) DEFAULT 0,
    overall_burden          NUMERIC(5,2) DEFAULT 0,
    sample_size             INT DEFAULT 0,
    last_computed           TIMESTAMPTZ DEFAULT NOW()
);

-- ── Scraper Run Log ───────────────────────────────────────────
CREATE TABLE scraper_runs (
    id                      SERIAL PRIMARY KEY,
    portal                  TEXT NOT NULL,
    run_type                TEXT NOT NULL,  -- 'catalog','prices','stock'
    status                  TEXT DEFAULT 'running',  -- 'running','completed','failed'
    drugs_scraped           INT DEFAULT 0,
    drugs_new               INT DEFAULT 0,
    drugs_updated           INT DEFAULT 0,
    errors                  INT DEFAULT 0,
    started_at              TIMESTAMPTZ DEFAULT NOW(),
    completed_at            TIMESTAMPTZ,
    error_log               JSONB DEFAULT '[]'
);

CREATE INDEX idx_sr_portal            ON scraper_runs(portal);
CREATE INDEX idx_sr_started_at        ON scraper_runs(started_at DESC);

-- ── Useful Views ──────────────────────────────────────────────

-- Best price per drug across all portals
CREATE VIEW drug_best_prices AS
SELECT
    d.id                    AS drug_id,
    d.brand_name,
    d.slug,
    d.salt_name,
    d.strength,
    d.pack_size,
    d.jan_aushadhi_price,
    d.nppa_ceiling_price,
    MIN(dp.selling_price)   AS best_price,
    (SELECT portal FROM drug_prices dp2
     WHERE dp2.drug_id = d.id AND dp2.in_stock = TRUE
     ORDER BY dp2.selling_price ASC LIMIT 1) AS best_portal,
    MAX(dp.mrp)             AS max_mrp,
    ROUND(100.0 * (1 - MIN(dp.selling_price) / NULLIF(MAX(dp.mrp), 0)), 1) AS max_saving_pct,
    COUNT(dp.portal)        AS portal_count
FROM drugs d
LEFT JOIN drug_prices dp ON dp.drug_id = d.id AND dp.in_stock = TRUE
WHERE d.is_active = TRUE
GROUP BY d.id;

-- Salt-level cheapest options
CREATE VIEW salt_cheapest AS
SELECT
    d.salt_slug,
    d.salt_name,
    d.therapeutic_category,
    COUNT(DISTINCT d.id)    AS brand_count,
    MIN(dp.selling_price)   AS cheapest_price,
    MIN(dp.price_per_unit)  AS cheapest_per_unit,
    MIN(d.jan_aushadhi_price) AS ja_price,
    ROUND(100.0 * (1 - MIN(dp.selling_price) / NULLIF(MAX(dp.mrp), 0)), 1) AS max_saving_pct
FROM drugs d
LEFT JOIN drug_prices dp ON dp.drug_id = d.id AND dp.in_stock = TRUE
WHERE d.is_active = TRUE
GROUP BY d.salt_slug, d.salt_name, d.therapeutic_category;
