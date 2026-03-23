'use strict';
/**
 * medicines.discount — Product Category Classification
 *
 * Adds a `product_category` column to the drugs table and classifies all
 * 226k products into one of 7 categories using rule-based heuristics on:
 *   • brand_name / salt_name keywords
 *   • therapeutic_category (from PharmEasy)
 *   • manufacturer_name patterns
 *   • dosage_form
 *   • presence/absence of a meaningful pharmaceutical salt composition
 *
 * Categories (mutually exclusive, priority-ordered):
 *   medical_device   — instruments, monitors, aids, wearables
 *   diagnostic       — test kits, test strips, reagents, lab consumables
 *   ayurvedic        — ayurvedic, unani, homeopathic, herbal, naturopathy
 *   nutrition        — protein, whey, supplements, health foods, baby nutrition
 *   skincare         — face creams, sunscreen, serums, cosmetic topicals
 *   personal_care    — shampoo, body wash, soap, deodorant, oral hygiene
 *   medicine         — default; pharmaceutical drugs (Rx + OTC)
 *
 * Usage:
 *   node src/classify-products.js [--dry-run] [--report-only]
 *   --dry-run      : print counts without writing to DB
 *   --report-only  : just print current distribution, no classification
 */

const path = require('path');
const fs   = require('fs');
try {
  const f = path.resolve(__dirname, '../../apps/api/.env');
  if (fs.existsSync(f)) fs.readFileSync(f,'utf8').split('\n').forEach(l=>{
    const m=l.match(/^([^#=\s]+)\s*=\s*(.*)$/);
    if(m&&!process.env[m[1]]) process.env[m[1]]=m[2].trim().replace(/^["']|["']$/g,'');
  });
} catch {}

const { Pool } = require('pg');
const DB = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });

const DRY_RUN     = process.argv.includes('--dry-run');
const REPORT_ONLY = process.argv.includes('--report-only');

// ─────────────────────────────────────────────────────────────────────────────
// Classification rules — each returns true if the product belongs to that category
// All matching is case-insensitive.
// ─────────────────────────────────────────────────────────────────────────────

// Helper: does the text contain any of the given tokens?
function hasAny(text, tokens) {
  if (!text) return false;
  const t = text.toLowerCase();
  return tokens.some(tok => t.includes(tok.toLowerCase()));
}

// Pharma salt: does the drug have a real pharmaceutical composition?
// Products whose salt_name == brand_name (or is empty) are likely non-pharma OTC items.
function hasPharmaComposition(row) {
  if (!row.salt_name) return false;
  if (row.salt_name.toLowerCase().trim() === row.brand_name.toLowerCase().trim()) return false;
  // If salt_name is purely the brand name + pack info → not a real INN composition
  if (row.salt_name.length < 3) return false;
  return true;
}

// ── 1. MEDICAL DEVICES ────────────────────────────────────────────────────────
const DEVICE_BRAND_KEYWORDS = [
  'glucometer', 'glucose meter', 'glucose monitor', 'blood glucose',
  'thermometer', 'bp monitor', 'blood pressure monitor', 'sphygmomanometer',
  'nebulizer', 'nebuliser', 'pulse oximeter', 'oximeter', 'stethoscope',
  'otoscope', 'ophthalmoscope', 'peak flow meter', 'spirometer',
  'lancet', 'lancing device', 'pen needle', 'insulin pen',
  'syringe', 'iv cannula', 'catheter', 'urine bag', 'colostomy',
  'surgical tape', 'bandage', 'crepe bandage', 'orthopedic', 'cervical collar',
  'knee brace', 'knee support', 'ankle support', 'wrist support', 'lumbar',
  'heating pad', 'hot water bag', 'ice pack', 'traction',
  'cpap', 'bipap', 'oxygen concentrator', 'oxygen cylinder',
  'hearing aid', 'wheelchair', 'walker', 'crutch', 'commode',
  'hospital bed', 'iv stand', 'infusion set', 'blood bag',
  'ppe', 'gloves', 'mask n95', 'surgical mask', 'face shield',
  'cotton roll', 'gauze', 'wound dressing', 'absorbent pad',
  'digital thermometer', 'forehead thermometer', 'ear thermometer',
  'acupressure', 'tens machine', 'ultrasound gel',
  // NOTE: bare 'strip' / 'test strip' removed — too many pharma tablets are named
  //       "Drug 500mg Tablet Strip of 10", causing 55k false device matches.
  //       Specific strip types are handled in DIAGNOSTIC_KEYWORDS instead.
  'glucose test strip', 'ketone test strip', 'glucostrip',
  'autoclave', 'sterilization',
  'vaporizer', 'steam inhaler',
];

const DEVICE_THERAPEUTIC = [
  'medical device', 'surgical', 'orthopaedic', 'orthopedic', 'wound care',
  'monitoring', 'homecare device', 'diagnostic device',
];

const DEVICE_BRAND_EXACT = [
  // Major device brands sometimes scraped as "drugs"
  'accu-chek', 'freestyle', 'contour', 'one touch', 'glucoplus',
  'dr morepen', 'omron', 'microlife', 'beurer', 'braun',
];

function isMedicalDevice(row) {
  const brand = (row.brand_name || '').toLowerCase();
  const tc    = (row.therapeutic_category || '').toLowerCase();
  if (DEVICE_BRAND_EXACT.some(b => brand.includes(b))) return true;
  if (hasAny(brand, DEVICE_BRAND_KEYWORDS)) return true;
  if (hasAny(tc, DEVICE_THERAPEUTIC)) return true;
  // Dosage form = device-like
  if (hasAny(row.dosage_form, ['device', 'kit (device)', 'equipment'])) return true;
  return false;
}

// ── 2. DIAGNOSTICS ────────────────────────────────────────────────────────────
const DIAGNOSTIC_KEYWORDS = [
  'test kit', 'rapid test', 'covid test', 'antigen test', 'antibody test',
  'pregnancy test', 'ovulation test', 'lh test', 'fertility test',
  'hba1c kit', 'hemoglobin kit', 'creatinine kit', 'uric acid kit',
  'cholesterol kit', 'triglyceride kit', 'bilirubin kit',
  'urine test strip', 'urine dipstick', 'urinalysis strip',
  'blood glucose strip', 'glucose test strip', 'ketone strip', 'glucostrip',
  'stool test', 'occult blood', 'h. pylori', 'dengue ns1',
  'malaria kit', 'typhoid kit', 'hepatitis kit', 'hiv test',
  'pcr kit', 'culture media', 'reagent', 'elisa kit',
  'microscope slide', 'collection tube', 'specimen container',
  'drug test kit', 'alcohol test',
];

const DIAGNOSTIC_THERAPEUTIC = [
  'diagnostic', 'diagnostics', 'laboratory', 'lab consumable',
];

const DIAGNOSTIC_MFR = [
  'tulip diagnostics', 'erba mannheim', 'agappe', 'reckon diagnostics',
  'span diagnostics', 'coral clinical', 'meril diagnostics',
];

function isDiagnostic(row) {
  if (hasAny(row.brand_name, DIAGNOSTIC_KEYWORDS)) return true;
  if (hasAny(row.therapeutic_category, DIAGNOSTIC_THERAPEUTIC)) return true;
  if (hasAny(row.manufacturer_name, DIAGNOSTIC_MFR)) return true;
  return false;
}

// ── 3. AYURVEDIC / UNANI / HOMEOPATHIC ────────────────────────────────────────
const AYURVEDIC_BRAND_KEYWORDS = [
  // Dosage forms
  'churna', 'churn', 'vati', 'gutika', 'bhasma', 'parpati', 'mandoor',
  'arishta', 'asava', 'kwath', 'kashayam', 'kadha', 'syrup (ayurvedic)',
  'ghrita', 'ghee (medicated)', 'taila', 'tail', 'avaleha', 'lehyam',
  'lehya', 'rasayana', 'rasa', 'loha', 'lauh',
  'guggul', 'guggulu', 'shilajit', 'ashwagandha', 'triphala', 'chyawanprash',
  'brahmi', 'shankhpushpi', 'arjuna', 'tulsi', 'giloy', 'neem (tablet)',
  'amla', 'haritaki', 'bibhitaki', 'pippali', 'trikatu',
  'dashamool', 'dashmoola', 'shatavari', 'yashtimadhu', 'licorice root',
  'punarnava', 'gokshura', 'vidari', 'bala',
  'homeopathic', 'homoeopathic', 'mother tincture', 'dilution', 'globules',
  'unani', 'hamdard', 'joshanda', 'majoon', 'qurs', 'sharbat',
  'bach flower', 'flower remedy',
];

const AYURVEDIC_THERAPEUTIC = [
  'ayurvedic', 'ayurveda', 'unani', 'homeopathy', 'homoeopathy',
  'herbal', 'naturopathy', 'siddha', 'traditional medicine',
];

const AYURVEDIC_MFR = [
  'baidyanath', 'dabur', 'himalaya', 'patanjali', 'zandu', 'hamdard',
  'charak', 'arya vaidya', 'kottakkal', 'dhootapapeshwar', 'dootapapeshwar',
  'sharangdhar', 'sandu brothers', 'vaidyaratnam', 'nagarjuna',
  'arya vaidya sala', 'jeevan', 'avn', 'alarsin', 'frank ross',
  'multani', 'sv ayurveda', 'shathayu', 'kerala ayurveda',
  'unjha', 'gujarat ayurvedic', 'maharishi ayurveda', 'maharishi',
  'allen', 'sbl homeo', 'sbl homoeo', 'bjain', 'b jain',
  'reckeweg', 'boiron', 'wheezal', 'adel', 'dolisos',
  'schwabe', 'medisynth', 'dr willmar schwabe',
  'swami ramdev', 'divya pharmacy',
  'shree baidyanath',
];

function isAyurvedic(row) {
  if (hasAny(row.therapeutic_category, AYURVEDIC_THERAPEUTIC)) return true;
  if (hasAny(row.manufacturer_name, AYURVEDIC_MFR)) return true;
  if (hasAny(row.brand_name, AYURVEDIC_BRAND_KEYWORDS)) return true;
  if (hasAny(row.salt_name, ['herbal extract', 'plant extract', 'ayurvedic'])) return true;
  return false;
}

// ── 4. NUTRITION ─────────────────────────────────────────────────────────────
const NUTRITION_BRAND_KEYWORDS = [
  'whey protein', 'protein powder', 'protein shake', 'mass gainer',
  'weight gainer', 'creatine monohydrate', 'bcaa', 'amino acid supplement',
  'pre workout', 'post workout', 'energy drink', 'sports nutrition',
  'meal replacement', 'nutrition shake',
  'probiotic supplement', 'prebiotic', 'synbiotic',
  'omega 3', 'fish oil', 'flaxseed oil', 'krill oil',
  'multivitamin', 'multimineral', 'b-complex (supplement)',
  'health drink', 'horlicks', 'complan', 'pediasure', 'ensure',
  'baby formula', 'infant formula', 'follow-up formula',
  'baby food', 'cerelac', 'nestum', 'porridge',
  'glucose powder', 'electrolyte powder', 'ors (nutrition)',
  'spirulina', 'chlorella', 'collagen supplement',
  'apple cider vinegar', 'green tea extract (supplement)',
  'garcinia', 'moringa supplement', 'ashwagandha (supplement)',
];

const NUTRITION_THERAPEUTIC = [
  'nutrition', 'nutritional supplement', 'sports nutrition',
  'infant nutrition', 'baby nutrition', 'health food',
  'weight management', 'fitness supplement',
];

const NUTRITION_MFR = [
  'isha agro', 'optimum nutrition', 'muscleblaze', 'myfitness',
  'gritzo', 'fast&up', 'fast and up', 'oziva', 'healthkart',
  'nestle health', 'abbott nutrition', 'mead johnson',
  'danone', 'nutricia',
];

function isNutrition(row) {
  // NOTE: rx_required guard removed — PharmEasy scraper defaults rx_required=TRUE
  //       for ALL products including OTC nutrition items, so this guard was blocking
  //       all nutrition classification. Use brand/category/mfr keywords instead.
  if (hasAny(row.therapeutic_category, NUTRITION_THERAPEUTIC)) return true;
  if (hasAny(row.manufacturer_name, NUTRITION_MFR)) return true;
  if (hasAny(row.brand_name, NUTRITION_BRAND_KEYWORDS)) return true;
  return false;
}

// ── 5. SKINCARE ───────────────────────────────────────────────────────────────
const SKINCARE_BRAND_KEYWORDS = [
  'sunscreen', 'spf', 'sun protection', 'uv protection', 'uva uvb',
  'anti-aging', 'anti aging', 'antiaging', 'wrinkle', 'retinol serum',
  'vitamin c serum', 'hyaluronic acid serum', 'niacinamide serum',
  'face serum', 'face moisturizer', 'face cream', 'night cream',
  'day cream', 'eye cream', 'under eye', 'lip serum', 'lip balm',
  'toner', 'micellar water', 'makeup remover',
  'face mask', 'sheet mask', 'clay mask', 'peel off',
  'exfoliator', 'scrub (face)', 'face scrub',
  'acne cream', 'acne gel', 'spot treatment', 'pimple cream',
  'fairness cream', 'brightening cream', 'skin lightening',
  'bb cream', 'cc cream', 'foundation', 'concealer',
  'kojic acid cream', 'glycolic acid cream', 'salicylic acid face wash',
  'derma', 'dermatological',
];

const SKINCARE_THERAPEUTIC = [
  'skincare', 'skin care', 'cosmetic dermatology', 'cosmetics',
];

const SKINCARE_MFR = [
  'lotus herbals', 'mamaearth', 'dot & key', 'minimalist', 'the derma co',
  're\'equil', 'fixderma', 'cipla skin', 'la shield', 'bioderma',
  'la roche-posay', 'cetaphil', 'dove', 'nivea', 'olay', 'pond\'s',
  'neutrogena', 'garnier', 'l\'oreal', 'loreal', 'vichy',
  'duck back', 'himalaya (skincare)',
];

function isSkincare(row) {
  // NOTE: rx_required guard removed — same reason as isNutrition()
  if (hasAny(row.therapeutic_category, SKINCARE_THERAPEUTIC)) return true;
  if (hasAny(row.manufacturer_name, SKINCARE_MFR)) return true;
  if (hasAny(row.brand_name, SKINCARE_BRAND_KEYWORDS)) return true;
  return false;
}

// ── 6. PERSONAL CARE ─────────────────────────────────────────────────────────
const PERSONAL_CARE_BRAND_KEYWORDS = [
  'shampoo', 'conditioner', 'hair oil', 'hair serum', 'hair mask',
  'anti dandruff', 'hair fall', 'hair color', 'henna powder',
  'body wash', 'shower gel', 'bath gel', 'soap bar', 'bathing soap',
  'face wash', 'foaming face wash', 'face cleanser',
  'deodorant', 'antiperspirant', 'roll on', 'body spray', 'talcum powder',
  'toothpaste', 'toothbrush', 'mouthwash', 'dental floss', 'mouth freshener',
  'hand wash', 'sanitizer', 'hand sanitizer',
  'feminine hygiene', 'sanitary pad', 'tampons', 'menstrual cup',
  'intimate wash', 'feminine wash',
  'baby shampoo', 'baby body wash', 'baby lotion', 'baby oil', 'baby powder',
  'baby wipes', 'diaper', 'nappy',
  'condom', 'contraceptive device', 'lubricant gel',
  'perfume', 'cologne', 'fragrance', 'eau de',
  'nail care', 'nail polish', 'nail remover',
  'cotton swab', 'cotton bud',
  'lip balm (cosmetic)', 'lip gloss', 'lipstick',
  'mosquito repellent', 'insect repellent',
];

const PERSONAL_CARE_THERAPEUTIC = [
  'personal care', 'hair care', 'oral care', 'baby care',
  'sexual wellness', 'feminine hygiene', 'contraceptive',
];

const PERSONAL_CARE_MFR = [
  'ajmal', 'godrej consumer', 'hul', 'hindustan unilever',
  'procter & gamble', 'p&g', 'colgate', 'kimberly-clark',
  'johnson & johnson (consumer)', 'jntson & jntson',
  'reckitt benckiser', 'reckitt', 'henkel', 'emami',
  'jyothy labs', 'bajaj consumer', 'parachute', 'marico',
  'himalaya (personal care)', 'park avenue', 'fogg',
  'set wet', 'engage', 'wild stone', 'denver',
  'wella', 'pantene', 'head & shoulders', 'herbal essences',
];

function isPersonalCare(row) {
  // NOTE: rx_required guard removed — same reason as isNutrition()
  if (hasAny(row.therapeutic_category, PERSONAL_CARE_THERAPEUTIC)) return true;
  if (hasAny(row.manufacturer_name, PERSONAL_CARE_MFR)) return true;
  if (hasAny(row.brand_name, PERSONAL_CARE_BRAND_KEYWORDS)) return true;
  return false;
}

// ── MASTER CLASSIFIER ─────────────────────────────────────────────────────────
// Priority order: device > diagnostic > ayurvedic > nutrition > skincare > personal_care > medicine
function classify(row) {
  if (isMedicalDevice(row))  return 'medical_device';
  if (isDiagnostic(row))     return 'diagnostic';
  if (isAyurvedic(row))      return 'ayurvedic';
  if (isNutrition(row))      return 'nutrition';
  if (isSkincare(row))       return 'skincare';
  if (isPersonalCare(row))   return 'personal_care';
  return 'medicine';
}

// ─────────────────────────────────────────────────────────────────────────────
// Migration
// ─────────────────────────────────────────────────────────────────────────────
async function run() {
  console.log('=== Product Category Classification ===');
  if (DRY_RUN) console.log('DRY RUN — counts only, no DB writes\n');

  const client = await DB.connect();
  try {
    // -- Add column if missing
    const colCheck = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name='drugs' AND column_name='product_category'
    `);
    if (colCheck.rows.length === 0) {
      console.log("Adding product_category column...");
      if (!DRY_RUN) {
        await client.query(`ALTER TABLE drugs ADD COLUMN product_category TEXT NOT NULL DEFAULT 'medicine'`);
        await client.query(`CREATE INDEX IF NOT EXISTS idx_drugs_product_category ON drugs(product_category)`);
      }
    }

    if (REPORT_ONLY) {
      const { rows } = await client.query(`
        SELECT product_category, COUNT(*) n FROM drugs WHERE is_active=TRUE
        GROUP BY product_category ORDER BY n DESC
      `);
      console.log('\nCurrent distribution:');
      rows.forEach(r => console.log(`  ${r.product_category?.padEnd(20)} ${r.n}`));
      return;
    }

    // -- Fetch all active drugs (just the fields we need for classification)
    console.log('Fetching all active drugs...');
    const { rows: drugs } = await client.query(`
      SELECT id, brand_name, salt_name, therapeutic_category,
             manufacturer_name, dosage_form, rx_required
      FROM drugs
      WHERE is_active = TRUE
      ORDER BY id
    `);
    console.log(`  Fetched ${drugs.length} drugs`);

    // -- Classify
    const buckets = {
      medicine: [], ayurvedic: [], personal_care: [],
      skincare: [], medical_device: [], diagnostic: [], nutrition: [],
    };
    for (const d of drugs) {
      buckets[classify(d)].push(d.id);
    }

    console.log('\nClassification results:');
    const sorted = Object.entries(buckets).sort(([,a],[,b]) => b.length - a.length);
    sorted.forEach(([cat, ids]) => {
      const pct = ((ids.length / drugs.length) * 100).toFixed(1);
      console.log(`  ${cat.padEnd(20)} ${String(ids.length).padStart(7)} (${pct}%)`);
    });

    if (DRY_RUN) {
      // Print some samples per non-medicine category
      for (const [cat, ids] of sorted.filter(([c]) => c !== 'medicine').slice(0, 6)) {
        const sample = ids.slice(0, 3);
        if (sample.length === 0) continue;
        const { rows: ex } = await client.query(
          `SELECT brand_name, therapeutic_category, manufacturer_name FROM drugs WHERE id = ANY($1)`,
          [sample]
        );
        console.log(`\n  Sample ${cat}:`);
        ex.forEach(r => console.log(`    "${r.brand_name}"  |  ${r.therapeutic_category ?? '-'}  |  ${r.manufacturer_name ?? '-'}`));
      }
      console.log('\n(dry-run: no writes)');
      return;
    }

    // -- Bulk update in batches per category
    console.log('\nWriting to DB...');
    await client.query('BEGIN');
    try {
      for (const [cat, ids] of Object.entries(buckets)) {
        if (ids.length === 0) continue;
        // Update in chunks of 10k to keep query size manageable
        for (let i = 0; i < ids.length; i += 10000) {
          const chunk = ids.slice(i, i + 10000);
          await client.query(
            `UPDATE drugs SET product_category = $1 WHERE id = ANY($2)`,
            [cat, chunk]
          );
        }
        process.stdout.write(`  ${cat}: ${ids.length} updated\n`);
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    }

    // -- Verify
    const { rows: verify } = await client.query(`
      SELECT product_category, COUNT(*) n FROM drugs WHERE is_active=TRUE
      GROUP BY product_category ORDER BY n DESC
    `);
    console.log('\n=== Final DB distribution ===');
    verify.forEach(r => console.log(`  ${(r.product_category||'null').padEnd(20)} ${r.n}`));

  } finally {
    client.release();
    await DB.end();
  }
}

run().catch(e => { console.error(e.message); process.exit(1); });
