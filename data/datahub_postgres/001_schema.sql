-- ============================================================
-- DATAHUB — PostgreSQL Schema
-- 8 Tables | People • Companies • Locations • Relationships
-- ============================================================

-- ── 1. PEOPLE ──
CREATE TABLE IF NOT EXISTS people (
    id                  SERIAL PRIMARY KEY,
    first_name          TEXT,
    last_name           TEXT,
    full_name           TEXT,
    father_husband_name TEXT,
    gender              VARCHAR(10),
    date_of_birth       DATE,
    age                 INTEGER,
    address             TEXT,
    city                TEXT,
    district            TEXT,
    state               TEXT DEFAULT 'Telangana',
    pincode             VARCHAR(10),

    -- Identity (quick access — detailed IDs in contact_identifiers)
    aadhar_number       VARCHAR(12),
    pan_number          VARCHAR(10),
    epic_number         VARCHAR(20),
    passport_number     VARCHAR(20),
    driving_license     VARCHAR(30),

    -- Primary contact (quick access — all contacts in contact_identifiers)
    mobile_primary      VARCHAR(15),
    mobile_secondary    VARCHAR(15),
    email_primary       TEXT,
    email_secondary     TEXT,
    whatsapp_number     VARCHAR(15),

    -- Generic UID slots
    uid_1               TEXT,
    uid_1_source        TEXT,
    uid_2               TEXT,
    uid_2_source        TEXT,
    uid_3               TEXT,
    uid_3_source        TEXT,

    -- Metadata
    source              TEXT,
    source_detail       TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW(),
    notes               TEXT
);

CREATE INDEX idx_people_epic ON people(epic_number);
CREATE INDEX idx_people_aadhar ON people(aadhar_number);
CREATE INDEX idx_people_pan ON people(pan_number);
CREATE INDEX idx_people_mobile ON people(mobile_primary);
CREATE INDEX idx_people_email ON people(email_primary);
CREATE INDEX idx_people_name ON people(full_name);


-- ── 2. COMPANIES ──
CREATE TABLE IF NOT EXISTS companies (
    id                      SERIAL PRIMARY KEY,
    name                    TEXT NOT NULL,
    trade_name              TEXT,
    registration_number     TEXT,
    gst_number              VARCHAR(15),
    pan_number              VARCHAR(10),
    cin_number              VARCHAR(21),

    -- Type classification
    category                VARCHAR(20),        -- GOVERNMENT / PRIVATE / NON_PROFIT
    sub_category            VARCHAR(30),        -- PVT_LTD / LLP / PARTNERSHIP / PROPRIETORSHIP / COOPERATIVE / PSU etc.
    company_type            TEXT,               -- Free text legacy

    -- Industry
    industry                TEXT,
    nic_code                VARCHAR(10),
    hsn_sac_code            VARCHAR(10),

    -- UDYAM / MSME
    udyam_number            VARCHAR(25),
    udyam_type              VARCHAR(10),        -- MICRO / SMALL / MEDIUM
    udyam_sector            VARCHAR(15),        -- MANUFACTURING / SERVICES

    -- Brand / Franchise
    brand_name              TEXT,
    trademark_name          TEXT,
    trademark_reg_no        TEXT,
    parent_company_id       INTEGER REFERENCES companies(id),
    parent_company_name     TEXT,
    franchise_type          VARCHAR(25),        -- OWNER / FRANCHISEE / MASTER_FRANCHISEE / LICENSEE / DISTRIBUTOR / SUBSIDIARY
    franchise_territory     TEXT,
    franchise_id            TEXT,

    -- Financials
    date_of_incorporation   DATE,
    annual_turnover         NUMERIC,
    employee_count          INTEGER,
    is_listed               BOOLEAN DEFAULT FALSE,
    stock_symbol            VARCHAR(20),

    -- Address
    address                 TEXT,
    city                    TEXT,
    district                TEXT,
    state                   TEXT DEFAULT 'Telangana',
    pincode                 VARCHAR(10),
    phone                   VARCHAR(15),
    email                   TEXT,
    website                 TEXT,

    -- Metadata
    source                  TEXT,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    updated_at              TIMESTAMPTZ DEFAULT NOW(),
    notes                   TEXT
);

CREATE INDEX idx_comp_gst ON companies(gst_number);
CREATE INDEX idx_comp_pan ON companies(pan_number);
CREATE INDEX idx_comp_cin ON companies(cin_number);
CREATE INDEX idx_comp_name ON companies(name);
CREATE INDEX idx_comp_brand ON companies(brand_name);
CREATE INDEX idx_comp_category ON companies(category);
CREATE INDEX idx_comp_udyam ON companies(udyam_number);
CREATE INDEX idx_comp_parent ON companies(parent_company_id);


-- ── 3. PEOPLE ↔ COMPANIES ──
CREATE TABLE IF NOT EXISTS people_companies (
    id                  SERIAL PRIMARY KEY,
    person_id           INTEGER NOT NULL REFERENCES people(id),
    company_id          INTEGER NOT NULL REFERENCES companies(id),

    -- Role
    role                TEXT,               -- DIRECTOR / PARTNER / MEMBER / EMPLOYEE / PROMOTER / FOUNDER
    designation         TEXT,               -- Free text: "Chief Financial Officer"
    level               VARCHAR(10),        -- BOARD / CXO / TOP / MID / EMPLOYEE
    level_rank          INTEGER,            -- 1=Board to 5=Employee
    department          TEXT,

    -- Employment
    employment_type     VARCHAR(15),        -- FULL_TIME / PART_TIME / CONTRACT / CONSULTANT / FREELANCE
    is_current          BOOLEAN DEFAULT TRUE,
    start_date          DATE,
    end_date            DATE,
    salary_band         TEXT,
    reporting_to        INTEGER REFERENCES people(id),

    -- Metadata
    is_active           BOOLEAN DEFAULT TRUE,
    source              TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pc_person ON people_companies(person_id);
CREATE INDEX idx_pc_company ON people_companies(company_id);
CREATE INDEX idx_pc_level ON people_companies(level);
CREATE INDEX idx_pc_current ON people_companies(is_current);


-- ── 4. CONTACT IDENTIFIERS ──
CREATE TABLE IF NOT EXISTS contact_identifiers (
    id              SERIAL PRIMARY KEY,
    person_id       INTEGER NOT NULL REFERENCES people(id),
    id_type         VARCHAR(25) NOT NULL,   -- PHONE / WHATSAPP / TELEGRAM / UPI / EMAIL / FACEBOOK / INSTAGRAM
                                            -- TWITTER_X / LINKEDIN / YOUTUBE / AADHAR / PAN / EPIC / PASSPORT
                                            -- DRIVING_LICENSE / GST / MEMBERSHIP / OTHER
    id_value        TEXT NOT NULL,
    platform        TEXT,                   -- Platform name if applicable
    is_verified     BOOLEAN DEFAULT FALSE,
    is_primary      BOOLEAN DEFAULT FALSE,
    source          TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    notes           TEXT
);

CREATE INDEX idx_ci_person ON contact_identifiers(person_id);
CREATE INDEX idx_ci_type_value ON contact_identifiers(id_type, id_value);
CREATE INDEX idx_ci_value ON contact_identifiers(id_value);


-- ── 5. LOCATIONS ──
CREATE TABLE IF NOT EXISTS locations (
    id                      SERIAL PRIMARY KEY,
    name                    TEXT NOT NULL,
    name_local              TEXT,
    location_type           VARCHAR(20) NOT NULL,   -- VILLAGE / TOWN / COLONY / COMMUNITY / APARTMENT / BUILDING
                                                    -- MALL / INDUSTRIAL / CAMPUS / UNIT
    -- Hierarchy
    parent_location_id      INTEGER REFERENCES locations(id),

    -- Administrative
    pincode                 VARCHAR(10),
    post_office             TEXT,
    post_office_type        VARCHAR(5),
    sub_district            TEXT,
    district                TEXT,
    state                   TEXT,
    country                 TEXT DEFAULT 'India',

    -- Census / LGD
    census_code_2011        TEXT,
    lgd_code                TEXT,

    -- Electoral
    ac_id                   INTEGER,
    ac_name                 TEXT,
    pc_id                   INTEGER,
    pc_name                 TEXT,

    -- Geography
    latitude                DOUBLE PRECISION,
    longitude               DOUBLE PRECISION,
    area_sq_km              DOUBLE PRECISION,

    -- Demographics
    population              INTEGER,
    households              INTEGER,

    -- Property / Building fields
    building_name           TEXT,
    building_type           VARCHAR(15),        -- RESIDENTIAL / COMMERCIAL / MIXED / GOVT / INDUSTRIAL
    floor_count             INTEGER,
    unit_count              INTEGER,
    developer               TEXT,
    rera_number             TEXT,
    survey_number           TEXT,
    municipal_number        TEXT,
    door_number             TEXT,

    -- Postal
    postal_division         TEXT,
    postal_region           TEXT,
    postal_circle           TEXT,

    -- Metadata
    source                  TEXT,
    created_at              TIMESTAMPTZ DEFAULT NOW(),
    notes                   TEXT
);

CREATE INDEX idx_loc_name ON locations(name);
CREATE INDEX idx_loc_type ON locations(location_type);
CREATE INDEX idx_loc_parent ON locations(parent_location_id);
CREATE INDEX idx_loc_pincode ON locations(pincode);
CREATE INDEX idx_loc_district ON locations(district);
CREATE INDEX idx_loc_state ON locations(state);
CREATE INDEX idx_loc_ac ON locations(ac_id);
CREATE INDEX idx_loc_lgd ON locations(lgd_code);
CREATE INDEX idx_loc_census ON locations(census_code_2011);
CREATE INDEX idx_loc_survey ON locations(survey_number);


-- ── 6. PEOPLE ↔ LOCATIONS ──
CREATE TABLE IF NOT EXISTS people_locations (
    id              SERIAL PRIMARY KEY,
    person_id       INTEGER NOT NULL REFERENCES people(id),
    location_id     INTEGER NOT NULL REFERENCES locations(id),
    address_type    VARCHAR(15) NOT NULL,   -- PERMANENT / CURRENT / NATIVE / OFFICE / PROPERTY
    address_line    TEXT,
    is_current      BOOLEAN DEFAULT TRUE,
    source          TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    notes           TEXT
);

CREATE INDEX idx_ploc_person ON people_locations(person_id);
CREATE INDEX idx_ploc_location ON people_locations(location_id);


-- ── 7. COMPANY ↔ LOCATIONS ──
CREATE TABLE IF NOT EXISTS company_locations (
    id              SERIAL PRIMARY KEY,
    company_id      INTEGER NOT NULL REFERENCES companies(id),
    location_id     INTEGER REFERENCES locations(id),

    -- Branch details (self-contained)
    branch_name     TEXT,
    branch_code     TEXT,
    branch_type     VARCHAR(25),        -- RAILWAY_STATION / POST_OFFICE / BRANCH / HQ / WAREHOUSE / STORE

    -- Address
    address         TEXT,
    city            TEXT,
    district        TEXT,
    state           TEXT,
    pincode         VARCHAR(10),
    latitude        DOUBLE PRECISION,
    longitude       DOUBLE PRECISION,

    -- Org-specific
    zone            TEXT,
    zone_full       TEXT,

    is_active       BOOLEAN DEFAULT TRUE,
    source          TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    notes           TEXT
);

CREATE INDEX idx_cl_company ON company_locations(company_id);
CREATE INDEX idx_cl_location ON company_locations(location_id);
CREATE INDEX idx_cl_type ON company_locations(branch_type);
CREATE INDEX idx_cl_pincode ON company_locations(pincode);
CREATE INDEX idx_cl_code ON company_locations(branch_code);


-- ── 8. RELATIONSHIPS ──
CREATE TABLE IF NOT EXISTS relationships (
    id                  SERIAL PRIMARY KEY,
    person_id_1         INTEGER NOT NULL REFERENCES people(id),
    person_id_2         INTEGER NOT NULL REFERENCES people(id),
    relationship_type   TEXT NOT NULL,
    reverse_type        TEXT NOT NULL,
    relation_category   VARCHAR(20) NOT NULL,   -- IMMEDIATE_FAMILY / EXTENDED_FAMILY / IN_LAW / BUSINESS / PERSONAL
    relation_hindi      TEXT,
    relation_telugu     TEXT,
    gender_specific     VARCHAR(5),
    generation          INTEGER,
    is_verified         BOOLEAN DEFAULT FALSE,
    source              TEXT,
    created_at          TIMESTAMPTZ DEFAULT NOW(),
    notes               TEXT
);

CREATE INDEX idx_rel_p1 ON relationships(person_id_1);
CREATE INDEX idx_rel_p2 ON relationships(person_id_2);
CREATE INDEX idx_rel_type ON relationships(relationship_type);
CREATE INDEX idx_rel_cat ON relationships(relation_category);
