-- ================================================================
-- medicines.discount — Migration 002
-- Adds official drug codes + per-portal product ID columns
-- ================================================================

-- JA / PMBI official drug code (from product list CSV, column "Drug Code")
ALTER TABLE drugs ADD COLUMN IF NOT EXISTS ja_drug_code TEXT;
CREATE INDEX IF NOT EXISTS idx_drugs_ja_code ON drugs(ja_drug_code);

-- Per-portal product identifiers (filled by price scraper after first match)
ALTER TABLE drugs ADD COLUMN IF NOT EXISTS source_pharmeasy_id   TEXT;
ALTER TABLE drugs ADD COLUMN IF NOT EXISTS source_pharmeasy_url  TEXT;
ALTER TABLE drugs ADD COLUMN IF NOT EXISTS source_netmeds_id     TEXT;
ALTER TABLE drugs ADD COLUMN IF NOT EXISTS source_netmeds_url    TEXT;
ALTER TABLE drugs ADD COLUMN IF NOT EXISTS source_apollo_id      TEXT;
ALTER TABLE drugs ADD COLUMN IF NOT EXISTS source_apollo_url     TEXT;
ALTER TABLE drugs ADD COLUMN IF NOT EXISTS source_medplus_id     TEXT;
ALTER TABLE drugs ADD COLUMN IF NOT EXISTS source_medplus_url    TEXT;

-- Indexes for portal lookups
CREATE INDEX IF NOT EXISTS idx_drugs_src_pharmeasy ON drugs(source_pharmeasy_id);
CREATE INDEX IF NOT EXISTS idx_drugs_src_netmeds   ON drugs(source_netmeds_id);
CREATE INDEX IF NOT EXISTS idx_drugs_src_apollo    ON drugs(source_apollo_id);
CREATE INDEX IF NOT EXISTS idx_drugs_src_medplus   ON drugs(source_medplus_id);

-- ATC code index (was missing)
CREATE INDEX IF NOT EXISTS idx_drugs_atc ON drugs(atc_code);
