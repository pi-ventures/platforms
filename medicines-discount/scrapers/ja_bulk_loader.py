"""
ja_bulk_loader.py  — Jan Aushadhi Full Catalog Loader
Loads all 2438 products from the official PMBI product list CSV into
the medicines_discount database.

Usage:
    python ja_bulk_loader.py "C:\\path\\to\\Product List.csv"
    (or just run it — it will look for the CSV in the same folder)

Run from: E:\\platforms\\medicines-discount\\scrapers
"""

import asyncio
import asyncpg
import csv
import os
import re
import sys
import unicodedata
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────

DATABASE_URL = os.environ.get(
    "DATABASE_URL",
    "postgresql://postgres:5432@localhost:5432/medicines_discount"
)

# Default CSV path — adjust if needed
DEFAULT_CSV = r"C:\Users\CHIST\Downloads\Product List_14_3_2026 @ 23_40_44.csv"

# ── Dosage form detection ─────────────────────────────────────────────────────

DOSAGE_FORMS = [
    # tablets — order matters (longest first)
    "Prolonged-release Tablets",
    "Prolonged Release Tablets",
    "Modified Release Tablets",
    "Sustained Release Tablets",
    "Extended Release Tablets",
    "Gastro-resistant Tablets",
    "Gastro Resistant Tablets",
    "Dispersible Tablets",
    "Chewable Tablets",
    "Effervescent Tablets",
    "Film Coated Tablets",
    "Tablets",
    # capsules
    "Hard Capsules",
    "Soft Capsules",
    "Capsules",
    # liquid / oral
    "Paediatric Oral Suspension",
    "Paediatric Drops",
    "Oral Suspension",
    "Oral Solution",
    "Oral Drops",
    "Suspension",
    "Syrup",
    "Elixir",
    "Linctus",
    "Drops",
    # injections
    "Solution for Injection",
    "Powder for Injection",
    "Injection",
    # topical
    "Cream",
    "Ointment",
    "Lotion",
    "Gel",
    "Foam",
    "Spray",
    "Transdermal Patch",
    "Patch",
    # ophthalmic / otic
    "Ophthalmic Solution",
    "Eye Drops",
    "Ear Drops",
    "Nasal Drops",
    "Nasal Spray",
    # other
    "Inhaler",
    "Suppositories",
    "Suppository",
    "Powder",
    "Granules",
]

DOSAGE_FORM_PATTERN = re.compile(
    r'\b(' + '|'.join(re.escape(f) for f in DOSAGE_FORMS) + r')\b',
    re.IGNORECASE
)

# Pharmacopoeia suffixes to strip from salt names
PHARMA_SUFFIX = re.compile(r'\b(IP|BP|USP|EP|NF|INN|BPC|PhEur|Ph\.Eur)\b', re.IGNORECASE)

# Strength patterns: 500mg, 10 mg, 2%, 125mg/5ml, 100mcg, 10IU, 1.16%w/w
STRENGTH_PATTERN = re.compile(
    r'(\d+(?:\.\d+)?)\s*(mg|mcg|g|ml|%w/w|%|iu|mu|units?|lakh\s*iu)[^\s,]*(?:\s*per\s*\d+\s*m[lg])?',
    re.IGNORECASE
)

# ── Group Name → category mapping ─────────────────────────────────────────────

GROUP_CATEGORY_MAP = {
    "Analgesic/Antipyretic/Anti-Inflammatory": "Analgesic / Anti-Inflammatory",
    "Antibiotics":                              "Antibiotic",
    "Anti-Diabetic":                            "Antidiabetic",
    "Central Nervous System (CNS)":             "CNS / Neurological",
    "Cardiovascular System (CVS)":              "Cardiovascular",
    "Gastrointestinal (GIT)":                   "Gastrointestinal",
    "Respiratory":                              "Respiratory",
    "Supplement/Vitamin/Mineral":               "Supplement / Vitamin",
    "Oncology":                                 "Oncology",
    "Dermatology/Topical/External":             "Dermatology / Topical",
    "Opthalmic/Otic":                           "Ophthalmic / Otic",
    "Urology":                                  "Urology",
    "Nutraceuticals":                           "Nutraceutical",
    "Gynaecology":                              "Gynaecology",
    "Ortho":                                    "Orthopaedic",
    "Anti-Histaminic":                          "Antihistaminic",
    "Derma Care":                               "Dermatology / Topical",
    "Anti-Fungal":                              "Antifungal",
    "Anti-fungal":                              "Antifungal",
    "Steroids & Hormones":                      "Steroid / Hormone",
    "Antiseptic/Disinfectants":                 "Antiseptic",
    "Diuretic":                                 "Diuretic",
    "Hepato-Protective":                        "Hepatoprotective",
    "Hepato-protective":                        "Hepatoprotective",
    "Electrolytes":                             "Electrolyte",
    "Anti-Malarial":                            "Antimalarial",
    "Immunosuppressant":                        "Immunosuppressant",
    "Anti-Thyroid":                             "Antithyroid",
    "Enzyme Preparation":                       "Enzyme",
    "Anthelmintic":                             "Anthelmintic",
    "Anti-Emetic":                              "Antiemetic",
    "Anticoagulant":                            "Anticoagulant",
    "Anaesthetics":                             "Anaesthetic",
    "Anti-Viral":                               "Antiviral",
    "Anti-viral":                               "Antiviral",
    "Anti-Retroviral":                          "Antiretroviral",
    "Anti-retroviral":                          "Antiretroviral",
    "Stomatologicals":                          "Dental / Oral Care",
    "STOMATOLOGICALS":                          "Dental / Oral Care",
    "Coagulants":                               "Coagulant",
    "Iron-Chelating Agents":                    "Iron Chelator",
    "Nephrology":                               "Nephrology",
    "Ayurvedic":                                "Ayurvedic",
    "Burn Relief":                              "Burn Relief",
    "Vaccines":                                 "Vaccine",
    "Anti-Alcoholism":                          "Addiction Treatment",
    "Smoking Cessation":                        "Addiction Treatment",
    "Treatment of Gout":                        "Gout Treatment",
    "Irrigation Fluid":                         "Irrigation Fluid",
    "Erythropoiesis":                           "Erythropoiesis",
    "Weight management":                        "Weight Management",
    "Covid-19":                                 "COVID-19",
    "Surgical & Medical Consumables":           "Surgical / Consumable",
    "Polycystic ovary/ovarian Syndrome":        "Gynaecology",
    "Hemorrhoids & Anal fissures":              "Gastroenterology",
    "Hemorrhoids & Anal Fissures":              "Gastroenterology",
    "Anti-Migraine":                            "Antimigraine",
    "Anti-Diuretic":                            "Antidiuretic",
    "Immunostimulator":                         "Immunostimulant",
    "Mouth Ulcer Gel":                          "Dental / Oral Care",
    "Throat Spray for Freshness":               "Dental / Oral Care",
    "Footcare Cream":                           "Dermatology / Topical",
    "Antidote":                                 "Antidote",
    "Anti-T.B":                                 "Antitubercular",
    "Mosquito Repellent":                       "Mosquito Repellent",
    "Altitude Sickness":                        "Altitude Sickness",
    "Anti-Rabies":                              "Antiviral",
    "Treatment of Severe Aplastic Anemia":      "Haematology",
}

# ── Helpers ───────────────────────────────────────────────────────────────────

def slugify(text: str) -> str:
    """Convert text to URL-safe slug."""
    text = text.lower().strip()
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = re.sub(r"[^\w\s-]", "", text)
    text = re.sub(r"[\s_]+", "-", text)
    text = re.sub(r"-+", "-", text)
    return text.strip("-")


def detect_dosage_form(generic_name: str) -> str:
    """Extract the dosage form from the generic name string."""
    m = DOSAGE_FORM_PATTERN.search(generic_name)
    if m:
        form = m.group(1).strip()
        # Normalise capitalisation
        return form.title()
    # Fallback hints
    name_lower = generic_name.lower()
    if "injection" in name_lower:
        return "Injection"
    if "cream" in name_lower:
        return "Cream"
    if "gel" in name_lower:
        return "Gel"
    if "ointment" in name_lower:
        return "Ointment"
    if "syrup" in name_lower:
        return "Syrup"
    if "suspension" in name_lower:
        return "Suspension"
    if "drops" in name_lower:
        return "Drops"
    if "spray" in name_lower:
        return "Spray"
    if "capsule" in name_lower:
        return "Capsules"
    if "tablet" in name_lower:
        return "Tablets"
    return "Other"


def extract_strength(generic_name: str) -> str:
    """Extract strength string from generic name."""
    matches = STRENGTH_PATTERN.findall(generic_name)
    if not matches:
        return ""
    # Return all strengths joined (for combination products)
    parts = []
    for val, unit in matches:
        parts.append(f"{val}{unit.lower()}")
    return " + ".join(parts)


def extract_salt_name(generic_name: str) -> str:
    """
    Strip dosage form, pharmacopoeia suffixes, and strength values to get
    just the active ingredient name(s).
    """
    name = generic_name

    # Remove dosage form
    name = DOSAGE_FORM_PATTERN.sub("", name)

    # Remove pharmacopoeia codes
    name = PHARMA_SUFFIX.sub("", name)

    # Remove strength values (numbers + units)
    name = STRENGTH_PATTERN.sub("", name)

    # Clean up leftover punctuation / connectors
    name = re.sub(r"\s+(and|per|in)\s+", " + ", name, flags=re.IGNORECASE)
    name = re.sub(r",\s*", " + ", name)
    name = re.sub(r"\s+\+\s+\+\s+", " + ", name)
    name = re.sub(r"[^a-zA-Z0-9\s\+\(\)\-/]", " ", name)
    name = re.sub(r"\s+", " ", name)
    name = name.strip(" +")

    return name.strip() or generic_name  # fallback to full name


def map_category(group_name: str):
    """Return (therapeutic_category, therapeutic_slug) for a group name."""
    cat = GROUP_CATEGORY_MAP.get(group_name, group_name)
    return cat, slugify(cat)


# ── Loader ────────────────────────────────────────────────────────────────────

async def load(csv_path: str):
    print(f"\n=== Jan Aushadhi Bulk Loader ===")
    print(f"CSV:  {csv_path}")
    print(f"DB:   {DATABASE_URL}\n")

    # Read CSV
    rows = []
    with open(csv_path, encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        for row in reader:
            rows.append(row)
    print(f"Read {len(rows)} rows from CSV")

    conn = await asyncpg.connect(DATABASE_URL)
    try:
        # Ensure pg_trgm extension (needed for future search)
        await conn.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")

        # Upsert PMBI as manufacturer
        mfr_id = await conn.fetchval("""
            INSERT INTO manufacturers (name_raw, name_normalized, slug, is_govt)
            VALUES ($1, $2, $3, TRUE)
            ON CONFLICT (slug) DO UPDATE SET name_raw = EXCLUDED.name_raw
            RETURNING id
        """, "Jan Aushadhi (PMBI)",
            "jan aushadhi pmbi",
            "jan-aushadhi-pmbi")
        print(f"Manufacturer ID: {mfr_id}")

        stats = {"inserted": 0, "updated": 0, "skipped": 0, "errors": 0}

        for row in rows:
            drug_code  = row["Drug Code"].strip()   # PMBI official code e.g. "1", "34", "512"
            generic    = row["Generic Name"].strip()
            unit_size  = row["Unit Size"].strip()
            mrp_raw    = row["MRP"].strip()
            group      = row["Group Name"].strip()

            # Skip consumables that have no price (MRP = 0 and are bandages etc.)
            mrp = float(mrp_raw) if mrp_raw else 0.0

            # Parse fields
            salt_name   = extract_salt_name(generic)
            strength    = extract_strength(generic)
            dosage_form = detect_dosage_form(generic)
            therapeutic_category, therapeutic_slug = map_category(group)

            # Brand name for JA products = full generic name
            brand_name = generic

            # Slugs — use drug code to guarantee uniqueness
            brand_slug  = slugify(f"ja-{drug_code}-{brand_name[:60]}")
            salt_slug   = slugify(salt_name)

            # Price per unit (e.g. per tablet)
            # Unit size like "10's", "15's", "30 ml", "1 ml", "Vial"
            qty_match = re.search(r"(\d+)", unit_size)
            qty = int(qty_match.group(1)) if qty_match else 1
            price_per_unit = round(mrp / qty, 4) if qty and mrp else None

            try:
                result = await conn.fetchrow("""
                    INSERT INTO drugs (
                        brand_name, brand_name_normalized, slug,
                        salt_name, salt_normalized, salt_slug,
                        strength, pack_size, dosage_form,
                        therapeutic_category, therapeutic_slug,
                        is_generic, is_govt_brand,
                        manufacturer_id, manufacturer_name,
                        mrp, jan_aushadhi_price, price_per_unit,
                        ja_drug_code,
                        is_active
                    ) VALUES (
                        $1,  $2,  $3,
                        $4,  $5,  $6,
                        $7,  $8,  $9,
                        $10, $11,
                        TRUE, TRUE,
                        $12, $13,
                        $14, $14, $15,
                        $16,
                        TRUE
                    )
                    ON CONFLICT (slug) DO UPDATE SET
                        therapeutic_category  = EXCLUDED.therapeutic_category,
                        therapeutic_slug      = EXCLUDED.therapeutic_slug,
                        jan_aushadhi_price    = EXCLUDED.jan_aushadhi_price,
                        mrp                   = EXCLUDED.mrp,
                        price_per_unit        = EXCLUDED.price_per_unit,
                        pack_size             = EXCLUDED.pack_size,
                        dosage_form           = EXCLUDED.dosage_form,
                        ja_drug_code          = EXCLUDED.ja_drug_code,
                        updated_at            = NOW()
                    RETURNING (xmax = 0) AS inserted
                """,
                    brand_name,
                    brand_name.lower(),
                    brand_slug,
                    salt_name,
                    salt_name.lower(),
                    salt_slug,
                    strength,
                    unit_size,
                    dosage_form,
                    therapeutic_category,
                    therapeutic_slug,
                    mfr_id,
                    "Jan Aushadhi (PMBI)",
                    mrp,
                    price_per_unit,
                    drug_code          # PMBI official Drug Code
                )
                if result and result["inserted"]:
                    stats["inserted"] += 1
                else:
                    stats["updated"] += 1

                # Progress
                total = stats["inserted"] + stats["updated"]
                if total % 100 == 0:
                    print(f"  ...{total} done  ({stats['inserted']} new, {stats['updated']} updated)")

            except Exception as e:
                stats["errors"] += 1
                print(f"  ERROR row {drug_code} '{generic[:40]}': {e}")

        print(f"\n=== Done ===")
        print(f"  Inserted : {stats['inserted']}")
        print(f"  Updated  : {stats['updated']}")
        print(f"  Errors   : {stats['errors']}")

        # Show sample
        sample = await conn.fetch("""
            SELECT brand_name, strength, dosage_form, therapeutic_category, jan_aushadhi_price
            FROM drugs
            WHERE is_govt_brand = TRUE
            ORDER BY therapeutic_category, brand_name
            LIMIT 10
        """)
        print(f"\nSample (first 10 JA drugs):")
        for r in sample:
            print(f"  [{r['therapeutic_category']:30s}] {r['brand_name'][:50]:50s}  ₹{r['jan_aushadhi_price']}")

        # Stats by category
        cats = await conn.fetch("""
            SELECT therapeutic_category, COUNT(*) as cnt
            FROM drugs
            WHERE is_govt_brand = TRUE
            GROUP BY therapeutic_category
            ORDER BY cnt DESC
            LIMIT 15
        """)
        print(f"\nTop 15 categories loaded:")
        for c in cats:
            print(f"  {c['cnt']:4d}  {c['therapeutic_category']}")

        total_drugs = await conn.fetchval("SELECT COUNT(*) FROM drugs WHERE is_govt_brand = TRUE")
        print(f"\nTotal JA drugs in DB: {total_drugs}")

    finally:
        await conn.close()


if __name__ == "__main__":
    csv_path = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_CSV
    if not Path(csv_path).exists():
        print(f"ERROR: CSV not found at: {csv_path}")
        print(f"Usage: python ja_bulk_loader.py \"path\\to\\Product List.csv\"")
        sys.exit(1)
    asyncio.run(load(csv_path))
