/**
 * CuriousHat Shared Library Data
 * ──────────────────────────────────
 * Single source of truth for all library content across all dashboards.
 * Imported by: Student, Teacher, College, University, Coaching libraries.
 */

export const DOMAINS = ['School Education', 'Higher Education', 'Govt Job Prep', 'Languages', 'Aviation', 'Music & Performing Arts', 'Fashion & Design', 'Vocational']

/* ── Language Learning Zones ── */
export const LANGUAGE_ZONES = {
  'Indian Languages': {
    emoji: '🇮🇳',
    desc: '10 most spoken Indian languages',
    languages: ['Hindi', 'Bengali', 'Marathi', 'Telugu', 'Tamil', 'Gujarati', 'Kannada', 'Malayalam', 'Punjabi', 'Odia'],
  },
  'Global': {
    emoji: '🌐',
    desc: 'Universal language',
    languages: ['English'],
  },
  'Europe': {
    emoji: '🇪🇺',
    desc: 'European languages',
    languages: ['French', 'Spanish', 'German', 'Portuguese', 'Russian', 'Italian', 'Polish', 'Ukrainian', 'Romanian', 'Dutch', 'Greek', 'Swedish'],
  },
  'East & Southeast Asia': {
    emoji: '🌏',
    desc: 'Asian languages',
    languages: ['Mandarin Chinese', 'Japanese', 'Korean', 'Vietnamese', 'Thai', 'Indonesian', 'Malay'],
  },
  'Middle East & Central Asia': {
    emoji: '🕌',
    desc: 'Middle Eastern & Central Asian languages',
    languages: ['Arabic', 'Turkish', 'Persian (Farsi)', 'Hebrew'],
  },
  'Africa': {
    emoji: '🌍',
    desc: 'African languages',
    languages: ['Swahili'],
  },
} as const

export const BROWSE_DATA = {
  subjects: [
    'Physics','Chemistry','Mathematics','Biology','Geography','Commerce',
    'History','Vocational Studies','General Science','Economics','The Arts',
    'Computer Science','Political Science','English','Hindi','Regional Languages',
    'Psychology','Sociology','Physical Education','Fine Arts','Home Science',
    'Music','Fashion Design','Performing Arts',
    // Indian Languages
    'Bengali','Marathi','Telugu','Tamil','Gujarati','Kannada','Malayalam','Punjabi','Odia',
    // Global Languages
    'French','Spanish','German','Mandarin Chinese','Japanese','Korean','Arabic',
    'Portuguese','Russian','Italian','Polish','Ukrainian','Romanian','Dutch','Greek','Swedish',
    'Indonesian','Malay','Turkish','Persian (Farsi)','Hebrew','Thai','Vietnamese','Swahili',
    // Higher Ed / Professional
    'Engineering','Medicine','Law','Management','Architecture','Pharmacy',
    'Nursing','Agriculture','Biotechnology','Data Science','AI & ML',
    // Govt Job Prep
    'General Studies','Aptitude & Reasoning','Current Affairs','Indian Polity',
    'Indian Economy','Ethics & Integrity','Banking Awareness','Railway GK',
    // Aviation
    'Aviation','Air Navigation','Meteorology','Aircraft Systems',
    // ITI Trades & Vocational
    'Fitter','Electrician','Turner','Welder','Plumber','Mechanic (Motor Vehicle)',
    'Mechanic (Diesel)','Mechanic (Refrigeration & AC)','Carpenter','Machinist',
    'Wireman','Electronics Mechanic','Information Technology (IT-ITI)',
    'Copa (IT)','Draughtsman (Mechanical)','Draughtsman (Civil)',
    'Sheet Metal Worker','Painter (General)','Foundry Man',
    'Stenographer (English)','Stenographer (Hindi)',
    'Dress Making','Hair & Skin Care','Basic Cosmetology',
    'Food Production','Front Office Assistant','Housekeeper',
    'Workshop Calculation','Engineering Drawing','Employability Skills',
  ],
  levels: [
    'Class I','Class II','Class III','Class IV','Class V','Class VI',
    'Class VII','Class VIII','Class IX','Class X','Class XI','Class XII',
    'JEE Main Preparatory','JEE Advanced Preparatory','NEET (UG) Preparatory',
    'CLAT Preparatory','CUET Preparatory','NIFT/NID Preparatory',
    // Higher Ed
    'Diploma','Undergraduate','Postgraduate',
    // Govt Job Prep
    'UPSC CSE Prep','SSC CGL Prep','Banking (IBPS/SBI) Prep','Railways (RRB) Prep',
    'State PSC Prep','CTET / Teaching Prep','Defence (NDA/CDS) Prep',
    // Aviation
    'CPL (Pilot) Training','AME Training','Cabin Crew Training',
    // ITI / Vocational
    'ITI (1 Year)','ITI (2 Year)','ITI CITS (Craft Instructor)',
  ],
  languages: [
    // Top 10 Indian languages
    'Hindi','Bengali','Marathi','Telugu','Tamil','Gujarati','Kannada','Malayalam','Punjabi','Odia',
    // Other Indian languages (Eighth Schedule)
    'English','Assamese','Bodo','Dogri','Kashmiri','Konkani','Maithili','Manipuri',
    'Nepali','Sanskrit','Santali','Sindhi','Urdu',
    // Europe
    'French','Spanish','German','Portuguese','Russian','Italian','Polish','Ukrainian','Romanian','Dutch','Greek','Swedish',
    // East & Southeast Asia
    'Mandarin Chinese','Japanese','Korean','Vietnamese','Thai','Indonesian','Malay',
    // Middle East & Central Asia
    'Arabic','Turkish','Persian (Farsi)','Hebrew',
    // Africa
    'Swahili',
  ],
  boards: [
    'CBSE','ICSE','IB (International Baccalaureate)','Cambridge IGCSE','NIOS','NCVT (ITI)','SCVT (State ITI)',
    'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar',
    'Chandigarh','Chhattisgarh','Gujarat','Haryana','Himachal Pradesh',
    'Jammu & Kashmir','Karnataka','Kerala','Madhya Pradesh','Maharashtra',
    'Manipur','Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu',
    'Telangana','Tripura','Uttarakhand','Uttar Pradesh','West Bengal',
  ],
  /** Accreditation / certification bodies */
  certifications: [
    'CBSE Board Certificate','ICSE Board Certificate','IB Diploma',
    'Trinity College London (Music)','ABRSM (Music)','London College of Music',
    'NIFT Certificate (Fashion)','Pearl Academy Certificate','Parsons Affiliate',
    'Cambridge IGCSE Certificate','DELF/DALF (French)','Goethe-Zertifikat (German)',
    'JLPT (Japanese)','HSK (Mandarin)','TOPIK (Korean)','DELE (Spanish)',
    'Gurukul Global Vidyaniketan Certificate','UGC Recognised','AICTE Approved',
    'CILS (Italian)','TORFL (Russian)','TYS (Turkish)','UKPI (Indonesian)',
  ],
}

export const RESOURCE_TYPES = ['Textbook','Reference Book','Workbook','Study Guide','Question Paper','Video Lecture','Notes','Lab Manual','AI Dataset','Corpus']
export const CONTENT_PROVIDERS = ['NCERT','NIOS','IIT Madras','IIT Kharagpur','IGNOU','State Board','CuriousHat','Kendriya Vidyalaya','AI4Bharat (IITM)','NPTEL','NDLI (IIT KGP)','IIIT Hyderabad','NIMI (ITI)','DGT (Directorate General of Training)']

/** IIT Madras / AI4Bharat language resources — reference for content pipeline */
export const IITM_LANGUAGE_SOURCES = {
  'AI4Bharat (IIT Madras)': {
    url: 'https://ai4bharat.iitm.ac.in',
    desc: 'India\'s largest open-source Indian language AI project — NLP models, translation, transliteration, TTS',
    resources: [
      { name: 'IndicTrans2', type: 'Translation', langs: 22, desc: 'Open-source translation model for 22 Indian languages — state of the art' },
      { name: 'IndicNLP Suite', type: 'NLP Toolkit', langs: 22, desc: 'Tokenization, sentence splitting, script normalization for all Indic scripts' },
      { name: 'Samanantar', type: 'Parallel Corpus', langs: 11, desc: '49.7M sentence pairs — largest Indian language parallel corpus' },
      { name: 'IndicGLUE', type: 'Benchmark', langs: 6, desc: 'NLU benchmark for Indian languages — text classification, NER, paraphrase' },
      { name: 'Vakyansh', type: 'Speech', langs: 22, desc: 'ASR + TTS models for 22 Indian languages' },
      { name: 'Aksharantar', type: 'Transliteration', langs: 21, desc: '26M transliteration pairs — romanized ↔ native script' },
      { name: 'Naamapadam', type: 'NER Dataset', langs: 11, desc: 'Named Entity Recognition dataset for Indian languages' },
      { name: 'IndicCorp', type: 'Monolingual Corpus', langs: 22, desc: '8.5B tokens across 22 Indian languages — crawled text' },
    ],
  },
  'NPTEL (IIT Madras)': {
    url: 'https://nptel.ac.in',
    desc: 'National Programme on Technology Enhanced Learning — free course content in multiple Indian languages',
    resources: [
      { name: 'NPTEL Courses', type: 'Video Lectures', langs: 5, desc: '2600+ courses, many with Hindi/Tamil/Telugu subtitles' },
      { name: 'NPTEL Transcripts', type: 'Text Corpus', langs: 2, desc: 'English + Hindi transcripts for engineering/science courses' },
    ],
  },
  'NDLI (IIT Kharagpur)': {
    url: 'https://ndl.iitkgp.ac.in',
    desc: 'National Digital Library of India — 90M+ resources including Indian language textbooks and literature',
    resources: [
      { name: 'NDLI Collection', type: 'Digital Library', langs: 23, desc: '90M+ resources — textbooks, theses, journals in all scheduled Indian languages' },
      { name: 'NDLI School', type: 'K-12 Content', langs: 8, desc: 'Curated school-level content mapped to CBSE/state board curricula' },
    ],
  },
  'IIIT Hyderabad': {
    url: 'https://ltrc.iiit.ac.in',
    desc: 'Language Technologies Research Centre — parallel corpora, morphological analyzers, POS taggers',
    resources: [
      { name: 'ILCI Parallel Corpus', type: 'Parallel Corpus', langs: 11, desc: 'Indian Languages Corpora Initiative — tourism/health domain sentences' },
      { name: 'Hindi WordNet', type: 'Lexical Database', langs: 18, desc: 'Linked WordNets for 18 Indian languages' },
    ],
  },
} as const

export const ALL_BOOKS = [
  // ★ SAMPLE BOOK — fully processed with EPUB reader, audiobook, bookmarks, translation
  { id:9999, title:'Mathematics — We the Travellers (Ch 1)', subject:'Mathematics', class:'Class V', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:16 },
  { id:1,  title:'Mathematics',               subject:'Mathematics',    class:'Class I',    board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:120 },
  { id:2,  title:'Marigold (English)',         subject:'English',        class:'Class I',    board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:140 },
  { id:3,  title:'Rimjhim (Hindi)',            subject:'Hindi',          class:'Class II',   board:'CBSE',  author:'NCERT', lang:'Hindi',   type:'Textbook',   pages:130 },
  { id:4,  title:'Ganit',                      subject:'Mathematics',    class:'Class III',  board:'CBSE',  author:'NCERT', lang:'Hindi',   type:'Textbook',   pages:148 },
  { id:5,  title:'EVS – Looking Around',       subject:'General Science',class:'Class IV',   board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:180 },
  { id:6,  title:'Mathematics',               subject:'Mathematics',    class:'Class V',    board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:210 },
  { id:7,  title:'Science',                    subject:'General Science',class:'Class VI',   board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:280 },
  { id:8,  title:'Mathematics',               subject:'Mathematics',    class:'Class VI',   board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:310 },
  { id:9,  title:'History – Our Pasts I',     subject:'History',        class:'Class VI',   board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:220 },
  { id:10, title:'Science',                    subject:'General Science',class:'Class VII',  board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:290 },
  { id:11, title:'Mathematics',               subject:'Mathematics',    class:'Class VII',  board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:324 },
  { id:12, title:'Science',                    subject:'General Science',class:'Class VIII', board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:304 },
  { id:13, title:'Mathematics',               subject:'Mathematics',    class:'Class IX',   board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:338 },
  { id:14, title:'Science',                    subject:'General Science',class:'Class IX',   board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:312 },
  { id:15, title:'Social Science – India & Contemporary World', subject:'History', class:'Class IX', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:256 },
  { id:16, title:'Mathematics',               subject:'Mathematics',    class:'Class X',    board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:334 },
  { id:17, title:'Science',                    subject:'General Science',class:'Class X',    board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:294 },
  { id:18, title:'First Flight (English)',     subject:'English',        class:'Class X',    board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:190 },
  { id:19, title:'Mathematics Part I',        subject:'Mathematics',    class:'Class XI',   board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:382 },
  { id:20, title:'Mathematics Part II',       subject:'Mathematics',    class:'Class XI',   board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:194 },
  { id:21, title:'Physics Part I',            subject:'Physics',        class:'Class XI',   board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:296 },
  { id:22, title:'Physics Part II',           subject:'Physics',        class:'Class XI',   board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:310 },
  { id:23, title:'Chemistry Part I',          subject:'Chemistry',      class:'Class XI',   board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:264 },
  { id:24, title:'Chemistry Part II',         subject:'Chemistry',      class:'Class XI',   board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:288 },
  { id:25, title:'Biology',                   subject:'Biology',        class:'Class XI',   board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:408 },
  { id:26, title:'Hornbill – English Reader', subject:'English',        class:'Class XI',   board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:174 },
  { id:27, title:'Statistics for Economics',  subject:'Economics',      class:'Class XI',   board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:196 },
  { id:28, title:'Computer Science with Python', subject:'Computer Science', class:'Class XI', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:320 },
  { id:29, title:'Mathematics Part I',        subject:'Mathematics',    class:'Class XII',  board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:352 },
  { id:30, title:'Mathematics Part II',       subject:'Mathematics',    class:'Class XII',  board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:298 },
  { id:31, title:'Physics Part I',            subject:'Physics',        class:'Class XII',  board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:334 },
  { id:32, title:'Physics Part II',           subject:'Physics',        class:'Class XII',  board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:286 },
  { id:33, title:'Chemistry Part I',          subject:'Chemistry',      class:'Class XII',  board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:270 },
  { id:34, title:'Chemistry Part II',         subject:'Chemistry',      class:'Class XII',  board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:292 },
  { id:35, title:'Biology',                   subject:'Biology',        class:'Class XII',  board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:388 },
  { id:36, title:'Flamingo (English)',        subject:'English',        class:'Class XII',  board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:210 },
  { id:37, title:'Macro Economics',           subject:'Economics',      class:'Class XII',  board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:224 },
  { id:38, title:'Computer Science (Python)', subject:'Computer Science',class:'Class XII',  board:'CBSE',  author:'NCERT', lang:'English', type:'Textbook',   pages:340 },
  { id:39, title:'Concepts of Physics Vol 1', subject:'Physics',        class:'JEE Main Preparatory', board:'CBSE', author:'H.C. Verma', lang:'English', type:'Reference Book', pages:468 },
  { id:40, title:'Concepts of Physics Vol 2', subject:'Physics',        class:'JEE Main Preparatory', board:'CBSE', author:'H.C. Verma', lang:'English', type:'Reference Book', pages:490 },
  { id:41, title:'Organic Chemistry',         subject:'Chemistry',      class:'JEE Advanced Preparatory', board:'CBSE', author:'O.P. Tandon', lang:'English', type:'Reference Book', pages:512 },
  { id:42, title:'Objective Biology (NEET)', subject:'Biology',         class:'NEET (UG) Preparatory', board:'CBSE', author:'Dinesh', lang:'English', type:'Reference Book', pages:620 },
  // ── Music (School → Higher Ed) ──
  { id:43, title:'Music — Singing & Rhythm',         subject:'Music',          class:'Class III',  board:'CBSE',  author:'CuriousHat', lang:'English', type:'Textbook',   pages:80,  cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:44, title:'Indian Classical Music Basics',     subject:'Music',          class:'Class VI',   board:'CBSE',  author:'CuriousHat', lang:'English', type:'Textbook',   pages:140, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:45, title:'Hindustani Music — Raag & Taal',    subject:'Music',          class:'Class IX',   board:'CBSE',  author:'CuriousHat', lang:'Hindi',   type:'Textbook',   pages:210, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:46, title:'Carnatic Music — Theory & Practice', subject:'Music',         class:'Class XI',   board:'CBSE',  author:'CuriousHat', lang:'English', type:'Textbook',   pages:280, cert:'Trinity College London (Music)' },
  { id:47, title:'Western Music Theory & Composition', subject:'Music',         class:'Class XII',  board:'CBSE',  author:'CuriousHat', lang:'English', type:'Reference Book', pages:320, cert:'ABRSM (Music)' },
  { id:48, title:'Music Production & Technology',      subject:'Music',         class:'Undergraduate', board:'CBSE', author:'CuriousHat', lang:'English', type:'Reference Book', pages:400, cert:'London College of Music' },
  { id:49, title:'Film Scoring & Sound Design',        subject:'Music',         class:'Postgraduate',  board:'CBSE', author:'CuriousHat', lang:'English', type:'Reference Book', pages:360, cert:'London College of Music' },
  // ── Fashion & Design (Higher Ed) ──
  { id:50, title:'Fashion Design Fundamentals',        subject:'Fashion Design', class:'Undergraduate', board:'CBSE', author:'CuriousHat', lang:'English', type:'Textbook', pages:350, cert:'NIFT Certificate (Fashion)' },
  { id:51, title:'Textile Science & Indian Fabrics',   subject:'Fashion Design', class:'Undergraduate', board:'CBSE', author:'CuriousHat', lang:'English', type:'Textbook', pages:290, cert:'NIFT Certificate (Fashion)' },
  { id:52, title:'Fashion Illustration & Draping',     subject:'Fashion Design', class:'Undergraduate', board:'CBSE', author:'CuriousHat', lang:'English', type:'Reference Book', pages:240, cert:'Pearl Academy Certificate' },
  { id:53, title:'Sustainable Fashion & Circular Design', subject:'Fashion Design', class:'Postgraduate', board:'CBSE', author:'CuriousHat', lang:'English', type:'Reference Book', pages:280, cert:'Parsons Affiliate' },
  { id:54, title:'Fashion Business & Merchandising',   subject:'Fashion Design', class:'Postgraduate', board:'CBSE', author:'CuriousHat', lang:'English', type:'Reference Book', pages:310, cert:'NIFT Certificate (Fashion)' },
  // ── Performing Arts ──
  { id:55, title:'Bharatanatyam — Theory & Practice',  subject:'Performing Arts', class:'Class IX',  board:'CBSE', author:'CuriousHat', lang:'English', type:'Textbook', pages:180, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:56, title:'Theatre Arts & Stagecraft',          subject:'Performing Arts', class:'Class XI',  board:'CBSE', author:'CuriousHat', lang:'English', type:'Textbook', pages:220, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:57, title:'Dance Forms of India',               subject:'Performing Arts', class:'Undergraduate', board:'CBSE', author:'CuriousHat', lang:'English', type:'Reference Book', pages:300, cert:'UGC Recognised' },
  // ── International Language Courses (with certifications) ──
  { id:58, title:'French A1 — Bonjour',                subject:'French',         class:'Class VI',   board:'CBSE', author:'CuriousHat', lang:'French',   type:'Textbook', pages:160, cert:'DELF/DALF (French)' },
  { id:59, title:'French A2 — Conversations',          subject:'French',         class:'Class VIII', board:'CBSE', author:'CuriousHat', lang:'French',   type:'Textbook', pages:190, cert:'DELF/DALF (French)' },
  { id:60, title:'French B1 — Intermediate',           subject:'French',         class:'Class X',    board:'CBSE', author:'CuriousHat', lang:'French',   type:'Textbook', pages:240, cert:'DELF/DALF (French)' },
  { id:61, title:'Spanish A1 — Hola',                  subject:'Spanish',        class:'Class VI',   board:'CBSE', author:'CuriousHat', lang:'Spanish',  type:'Textbook', pages:160, cert:'DELE (Spanish)' },
  { id:62, title:'Spanish A2 — Conversaciones',        subject:'Spanish',        class:'Class VIII', board:'CBSE', author:'CuriousHat', lang:'Spanish',  type:'Textbook', pages:185, cert:'DELE (Spanish)' },
  { id:63, title:'German A1 — Willkommen',             subject:'German',         class:'Class VI',   board:'CBSE', author:'CuriousHat', lang:'German',   type:'Textbook', pages:170, cert:'Goethe-Zertifikat (German)' },
  { id:64, title:'German A2 — Sprechen',               subject:'German',         class:'Class VIII', board:'CBSE', author:'CuriousHat', lang:'German',   type:'Textbook', pages:195, cert:'Goethe-Zertifikat (German)' },
  { id:65, title:'Mandarin Chinese HSK 1',             subject:'Mandarin Chinese', class:'Class VII', board:'CBSE', author:'CuriousHat', lang:'Mandarin Chinese', type:'Textbook', pages:180, cert:'HSK (Mandarin)' },
  { id:66, title:'Mandarin Chinese HSK 2',             subject:'Mandarin Chinese', class:'Class IX',  board:'CBSE', author:'CuriousHat', lang:'Mandarin Chinese', type:'Textbook', pages:210, cert:'HSK (Mandarin)' },
  { id:67, title:'Japanese N5 — Hajimemashite',        subject:'Japanese',       class:'Class VII',  board:'CBSE', author:'CuriousHat', lang:'Japanese', type:'Textbook', pages:190, cert:'JLPT (Japanese)' },
  { id:68, title:'Japanese N4 — Nihongo',              subject:'Japanese',       class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Japanese', type:'Textbook', pages:220, cert:'JLPT (Japanese)' },
  { id:69, title:'Korean Level 1 — Hangul',            subject:'Korean',         class:'Class VII',  board:'CBSE', author:'CuriousHat', lang:'Korean',   type:'Textbook', pages:175, cert:'TOPIK (Korean)' },
  { id:70, title:'Korean Level 2 — Hanja Basics',      subject:'Korean',         class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Korean',   type:'Textbook', pages:200, cert:'TOPIK (Korean)' },
  { id:71, title:'Arabic for Beginners',               subject:'Arabic',         class:'Class VII',  board:'CBSE', author:'CuriousHat', lang:'Arabic',   type:'Textbook', pages:165, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:72, title:'Portuguese A1',                      subject:'Portuguese',     class:'Class VIII', board:'CBSE', author:'CuriousHat', lang:'Portuguese', type:'Textbook', pages:160, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:73, title:'Russian for Beginners',              subject:'Russian',        class:'Class VIII', board:'CBSE', author:'CuriousHat', lang:'Russian',  type:'Textbook', pages:185, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:74, title:'Italian A1 — Ciao',                  subject:'Italian',        class:'Class VIII', board:'CBSE', author:'CuriousHat', lang:'Italian',  type:'Textbook', pages:155, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:75, title:'Thai for Beginners',                 subject:'Thai',           class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Thai',     type:'Textbook', pages:170, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:76, title:'Vietnamese Level 1',                 subject:'Vietnamese',     class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Vietnamese', type:'Textbook', pages:165, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:77, title:'Swahili for Beginners',              subject:'Swahili',        class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Swahili',  type:'Textbook', pages:150, cert:'Gurukul Global Vidyaniketan Certificate' },

  // ═══════════════════════════════════════════════════════════
  // INDIAN LANGUAGE LEARNING (Top 10)
  // ═══════════════════════════════════════════════════════════
  // Hindi (additional advanced levels)
  { id:210, title:'Hindi — Beginner (Devanagari & Grammar)',   subject:'Hindi',      class:'Class I',    board:'CBSE', author:'CuriousHat', lang:'Hindi',      type:'Textbook', pages:140, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:211, title:'Hindi — Intermediate Composition',          subject:'Hindi',      class:'Class VI',   board:'CBSE', author:'CuriousHat', lang:'Hindi',      type:'Textbook', pages:210, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:212, title:'Hindi — Advanced Literature & Sahitya',     subject:'Hindi',      class:'Class XI',   board:'CBSE', author:'CuriousHat', lang:'Hindi',      type:'Textbook', pages:320, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Bengali
  { id:213, title:'Bengali — Beginner (Bangla Lipi)',          subject:'Bengali',    class:'Class I',    board:'CBSE', author:'CuriousHat', lang:'Bengali',    type:'Textbook', pages:150, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:214, title:'Bengali — Intermediate Rachana',            subject:'Bengali',    class:'Class VI',   board:'CBSE', author:'CuriousHat', lang:'Bengali',    type:'Textbook', pages:200, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:215, title:'Bengali — Advanced Sahitya & Kabya',        subject:'Bengali',    class:'Class XI',   board:'West Bengal', author:'CuriousHat', lang:'Bengali', type:'Textbook', pages:310, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Marathi
  { id:216, title:'Marathi — Beginner (Balbharati)',           subject:'Marathi',    class:'Class I',    board:'Maharashtra', author:'CuriousHat', lang:'Marathi',  type:'Textbook', pages:140, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:217, title:'Marathi — Intermediate Vyakaran',           subject:'Marathi',    class:'Class VI',   board:'Maharashtra', author:'CuriousHat', lang:'Marathi',  type:'Textbook', pages:195, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:218, title:'Marathi — Advanced Sahitya',                subject:'Marathi',    class:'Class XI',   board:'Maharashtra', author:'CuriousHat', lang:'Marathi',  type:'Textbook', pages:290, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Telugu
  { id:219, title:'Telugu — Beginner (Aksharalu)',             subject:'Telugu',     class:'Class I',    board:'Telangana', author:'CuriousHat', lang:'Telugu',   type:'Textbook', pages:145, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:220, title:'Telugu — Intermediate Vyakaranam',          subject:'Telugu',     class:'Class VI',   board:'Andhra Pradesh', author:'CuriousHat', lang:'Telugu', type:'Textbook', pages:205, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:221, title:'Telugu — Advanced Sahityam',                subject:'Telugu',     class:'Class XI',   board:'Telangana', author:'CuriousHat', lang:'Telugu',   type:'Textbook', pages:300, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Tamil
  { id:222, title:'Tamil — Beginner (Ezhuthugal)',             subject:'Tamil',      class:'Class I',    board:'Tamil Nadu', author:'CuriousHat', lang:'Tamil',    type:'Textbook', pages:150, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:223, title:'Tamil — Intermediate Ilakkanam',            subject:'Tamil',      class:'Class VI',   board:'Tamil Nadu', author:'CuriousHat', lang:'Tamil',    type:'Textbook', pages:210, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:224, title:'Tamil — Advanced Ilakkiyam & Sangam',       subject:'Tamil',      class:'Class XI',   board:'Tamil Nadu', author:'CuriousHat', lang:'Tamil',    type:'Textbook', pages:320, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Gujarati
  { id:225, title:'Gujarati — Beginner (Kakko & Barakhadi)',   subject:'Gujarati',   class:'Class I',    board:'Gujarat', author:'CuriousHat', lang:'Gujarati',  type:'Textbook', pages:135, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:226, title:'Gujarati — Intermediate Rachana',           subject:'Gujarati',   class:'Class VI',   board:'Gujarat', author:'CuriousHat', lang:'Gujarati',  type:'Textbook', pages:190, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:227, title:'Gujarati — Advanced Sahitya',               subject:'Gujarati',   class:'Class XI',   board:'Gujarat', author:'CuriousHat', lang:'Gujarati',  type:'Textbook', pages:280, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Kannada
  { id:228, title:'Kannada — Beginner (Aksharamale)',          subject:'Kannada',    class:'Class I',    board:'Karnataka', author:'CuriousHat', lang:'Kannada',  type:'Textbook', pages:140, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:229, title:'Kannada — Intermediate Vyakarana',          subject:'Kannada',    class:'Class VI',   board:'Karnataka', author:'CuriousHat', lang:'Kannada',  type:'Textbook', pages:200, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:230, title:'Kannada — Advanced Sahitya',                subject:'Kannada',    class:'Class XI',   board:'Karnataka', author:'CuriousHat', lang:'Kannada',  type:'Textbook', pages:295, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Malayalam
  { id:231, title:'Malayalam — Beginner (Aksharamala)',         subject:'Malayalam',  class:'Class I',    board:'Kerala', author:'CuriousHat', lang:'Malayalam',   type:'Textbook', pages:145, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:232, title:'Malayalam — Intermediate Vyakaranam',        subject:'Malayalam',  class:'Class VI',   board:'Kerala', author:'CuriousHat', lang:'Malayalam',   type:'Textbook', pages:205, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:233, title:'Malayalam — Advanced Sahityam',              subject:'Malayalam',  class:'Class XI',   board:'Kerala', author:'CuriousHat', lang:'Malayalam',   type:'Textbook', pages:305, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Punjabi
  { id:234, title:'Punjabi — Beginner (Gurmukhi Lipi)',        subject:'Punjabi',    class:'Class I',    board:'Punjab', author:'CuriousHat', lang:'Punjabi',    type:'Textbook', pages:140, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:235, title:'Punjabi — Intermediate Rachana',            subject:'Punjabi',    class:'Class VI',   board:'Punjab', author:'CuriousHat', lang:'Punjabi',    type:'Textbook', pages:195, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:236, title:'Punjabi — Advanced Sahit & Kavita',         subject:'Punjabi',    class:'Class XI',   board:'Punjab', author:'CuriousHat', lang:'Punjabi',    type:'Textbook', pages:285, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Odia
  { id:237, title:'Odia — Beginner (Aksharamala)',             subject:'Odia',       class:'Class I',    board:'Odisha', author:'CuriousHat', lang:'Odia',      type:'Textbook', pages:140, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:238, title:'Odia — Intermediate Byakarana',             subject:'Odia',       class:'Class VI',   board:'Odisha', author:'CuriousHat', lang:'Odia',      type:'Textbook', pages:195, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:239, title:'Odia — Advanced Sahitya',                   subject:'Odia',       class:'Class XI',   board:'Odisha', author:'CuriousHat', lang:'Odia',      type:'Textbook', pages:280, cert:'Gurukul Global Vidyaniketan Certificate' },

  // ═══════════════════════════════════════════════════════════
  // GLOBAL LANGUAGE LEARNING — Europe
  // ═══════════════════════════════════════════════════════════
  // Polish
  { id:240, title:'Polish A1 — Cześć',                subject:'Polish',           class:'Class VII',  board:'CBSE', author:'CuriousHat', lang:'Polish',    type:'Textbook', pages:170, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:241, title:'Polish A2 — Rozmowy',              subject:'Polish',           class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Polish',    type:'Textbook', pages:200, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Ukrainian
  { id:242, title:'Ukrainian A1 — Привіт',            subject:'Ukrainian',        class:'Class VII',  board:'CBSE', author:'CuriousHat', lang:'Ukrainian', type:'Textbook', pages:165, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:243, title:'Ukrainian A2 — Розмови',           subject:'Ukrainian',        class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Ukrainian', type:'Textbook', pages:195, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Romanian
  { id:244, title:'Romanian A1 — Salut',              subject:'Romanian',         class:'Class VII',  board:'CBSE', author:'CuriousHat', lang:'Romanian',  type:'Textbook', pages:160, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:245, title:'Romanian A2 — Conversații',         subject:'Romanian',         class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Romanian',  type:'Textbook', pages:190, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Dutch
  { id:246, title:'Dutch A1 — Hallo',                 subject:'Dutch',            class:'Class VII',  board:'CBSE', author:'CuriousHat', lang:'Dutch',     type:'Textbook', pages:165, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:247, title:'Dutch A2 — Gesprekken',            subject:'Dutch',            class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Dutch',     type:'Textbook', pages:195, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Greek
  { id:248, title:'Greek A1 — Γεια σας',              subject:'Greek',            class:'Class VII',  board:'CBSE', author:'CuriousHat', lang:'Greek',     type:'Textbook', pages:175, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:249, title:'Greek A2 — Συνομιλίες',            subject:'Greek',            class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Greek',     type:'Textbook', pages:200, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Swedish
  { id:280, title:'Swedish A1 — Hej',                subject:'Swedish',          class:'Class VII',  board:'CBSE', author:'CuriousHat', lang:'Swedish',   type:'Textbook', pages:165, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:281, title:'Swedish A2 — Samtal',              subject:'Swedish',          class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Swedish',   type:'Textbook', pages:195, cert:'Gurukul Global Vidyaniketan Certificate' },

  // ═══════════════════════════════════════════════════════════
  // GLOBAL LANGUAGE LEARNING — East & Southeast Asia
  // ═══════════════════════════════════════════════════════════
  // Indonesian
  { id:250, title:'Indonesian A1 — Halo',              subject:'Indonesian',       class:'Class VII',  board:'CBSE', author:'CuriousHat', lang:'Indonesian', type:'Textbook', pages:155, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:251, title:'Indonesian A2 — Percakapan',        subject:'Indonesian',       class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Indonesian', type:'Textbook', pages:185, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Malay
  { id:252, title:'Malay A1 — Selamat Datang',        subject:'Malay',            class:'Class VII',  board:'CBSE', author:'CuriousHat', lang:'Malay',     type:'Textbook', pages:150, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:253, title:'Malay A2 — Perbualan',             subject:'Malay',            class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Malay',     type:'Textbook', pages:180, cert:'Gurukul Global Vidyaniketan Certificate' },

  // ═══════════════════════════════════════════════════════════
  // GLOBAL LANGUAGE LEARNING — Middle East & Central Asia
  // ═══════════════════════════════════════════════════════════
  // Turkish
  { id:254, title:'Turkish A1 — Merhaba',             subject:'Turkish',          class:'Class VII',  board:'CBSE', author:'CuriousHat', lang:'Turkish',   type:'Textbook', pages:170, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:255, title:'Turkish A2 — Konuşmalar',          subject:'Turkish',          class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Turkish',   type:'Textbook', pages:200, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Persian (Farsi)
  { id:256, title:'Persian A1 — سلام (Salaam)',       subject:'Persian (Farsi)',   class:'Class VII',  board:'CBSE', author:'CuriousHat', lang:'Persian (Farsi)', type:'Textbook', pages:175, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:257, title:'Persian A2 — گفتگو (Goftogoo)',    subject:'Persian (Farsi)',   class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Persian (Farsi)', type:'Textbook', pages:205, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Hebrew
  { id:258, title:'Hebrew A1 — שלום (Shalom)',        subject:'Hebrew',           class:'Class VII',  board:'CBSE', author:'CuriousHat', lang:'Hebrew',    type:'Textbook', pages:170, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:259, title:'Hebrew A2 — שיחות (Sichot)',       subject:'Hebrew',           class:'Class IX',   board:'CBSE', author:'CuriousHat', lang:'Hebrew',    type:'Textbook', pages:195, cert:'Gurukul Global Vidyaniketan Certificate' },

  // ═══════════════════════════════════════════════════════════
  // GLOBAL LANGUAGE LEARNING — Advanced / Higher Education levels
  // ═══════════════════════════════════════════════════════════
  { id:260, title:'French B2 — Advanced',              subject:'French',           class:'Undergraduate', board:'CBSE', author:'CuriousHat', lang:'French',   type:'Reference Book', pages:320, cert:'DELF/DALF (French)' },
  { id:261, title:'Spanish B1 — Intermediate',         subject:'Spanish',          class:'Class X',    board:'CBSE', author:'CuriousHat', lang:'Spanish',  type:'Textbook', pages:240, cert:'DELE (Spanish)' },
  { id:262, title:'Spanish B2 — Advanced',             subject:'Spanish',          class:'Undergraduate', board:'CBSE', author:'CuriousHat', lang:'Spanish', type:'Reference Book', pages:310, cert:'DELE (Spanish)' },
  { id:263, title:'German B1 — Intermediate',          subject:'German',           class:'Class X',    board:'CBSE', author:'CuriousHat', lang:'German',   type:'Textbook', pages:230, cert:'Goethe-Zertifikat (German)' },
  { id:264, title:'German B2 — Advanced',              subject:'German',           class:'Undergraduate', board:'CBSE', author:'CuriousHat', lang:'German', type:'Reference Book', pages:300, cert:'Goethe-Zertifikat (German)' },
  { id:265, title:'Mandarin Chinese HSK 3',            subject:'Mandarin Chinese', class:'Class XI',   board:'CBSE', author:'CuriousHat', lang:'Mandarin Chinese', type:'Textbook', pages:260, cert:'HSK (Mandarin)' },
  { id:266, title:'Mandarin Chinese HSK 4',            subject:'Mandarin Chinese', class:'Undergraduate', board:'CBSE', author:'CuriousHat', lang:'Mandarin Chinese', type:'Reference Book', pages:310, cert:'HSK (Mandarin)' },
  { id:267, title:'Japanese N3 — Intermediate',        subject:'Japanese',         class:'Class XI',   board:'CBSE', author:'CuriousHat', lang:'Japanese', type:'Textbook', pages:260, cert:'JLPT (Japanese)' },
  { id:268, title:'Japanese N2 — Advanced',            subject:'Japanese',         class:'Undergraduate', board:'CBSE', author:'CuriousHat', lang:'Japanese', type:'Reference Book', pages:320, cert:'JLPT (Japanese)' },
  { id:269, title:'Korean Level 3 — Intermediate',     subject:'Korean',           class:'Class XI',   board:'CBSE', author:'CuriousHat', lang:'Korean',   type:'Textbook', pages:240, cert:'TOPIK (Korean)' },
  { id:270, title:'Korean Level 4 — Advanced',         subject:'Korean',           class:'Undergraduate', board:'CBSE', author:'CuriousHat', lang:'Korean', type:'Reference Book', pages:300, cert:'TOPIK (Korean)' },
  { id:271, title:'Arabic — Intermediate',             subject:'Arabic',           class:'Class X',    board:'CBSE', author:'CuriousHat', lang:'Arabic',   type:'Textbook', pages:220, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:272, title:'Arabic — Advanced',                 subject:'Arabic',           class:'Undergraduate', board:'CBSE', author:'CuriousHat', lang:'Arabic', type:'Reference Book', pages:280, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:273, title:'Portuguese B1 — Intermediate',      subject:'Portuguese',       class:'Class X',    board:'CBSE', author:'CuriousHat', lang:'Portuguese', type:'Textbook', pages:210, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:274, title:'Russian — Intermediate',            subject:'Russian',          class:'Class X',    board:'CBSE', author:'CuriousHat', lang:'Russian',  type:'Textbook', pages:220, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:275, title:'Italian B1 — Intermediate',         subject:'Italian',          class:'Class X',    board:'CBSE', author:'CuriousHat', lang:'Italian',  type:'Textbook', pages:210, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:276, title:'Turkish B1 — Intermediate',         subject:'Turkish',          class:'Class XI',   board:'CBSE', author:'CuriousHat', lang:'Turkish',  type:'Textbook', pages:230, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:277, title:'Indonesian B1 — Intermediate',      subject:'Indonesian',       class:'Class XI',   board:'CBSE', author:'CuriousHat', lang:'Indonesian', type:'Textbook', pages:210, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:278, title:'Swahili — Intermediate',            subject:'Swahili',          class:'Class XI',   board:'CBSE', author:'CuriousHat', lang:'Swahili',  type:'Textbook', pages:200, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:279, title:'Persian B1 — Intermediate',         subject:'Persian (Farsi)',  class:'Class XI',   board:'CBSE', author:'CuriousHat', lang:'Persian (Farsi)', type:'Textbook', pages:240, cert:'Gurukul Global Vidyaniketan Certificate' },

  // ═══════════════════════════════════════════════════════════
  // SCHOOL EDUCATION — After 10th (Class XI–XII stream subjects)
  // ═══════════════════════════════════════════════════════════
  { id:78,  title:'Accountancy Part I',              subject:'Commerce',       class:'Class XI',   board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:340 },
  { id:79,  title:'Accountancy Part II',             subject:'Commerce',       class:'Class XI',   board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:280 },
  { id:80,  title:'Business Studies',                subject:'Commerce',       class:'Class XI',   board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:310 },
  { id:81,  title:'Indian Economic Development',     subject:'Economics',      class:'Class XI',   board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:260 },
  { id:82,  title:'Political Theory',                subject:'Political Science', class:'Class XI', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:240 },
  { id:83,  title:'Indian Constitution at Work',     subject:'Political Science', class:'Class XI', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:270 },
  { id:84,  title:'Introducing Sociology',           subject:'Sociology',      class:'Class XI',   board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:210 },
  { id:85,  title:'Understanding Society',           subject:'Sociology',      class:'Class XI',   board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:230 },
  { id:86,  title:'Psychology',                      subject:'Psychology',     class:'Class XI',   board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:280 },
  { id:87,  title:'Geography — Fundamentals of Physical Geography', subject:'Geography', class:'Class XI', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:260 },
  { id:88,  title:'Geography — India Physical Environment', subject:'Geography', class:'Class XI', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:230 },
  { id:89,  title:'History — Themes in World History', subject:'History',      class:'Class XI',   board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:310 },
  { id:90,  title:'Informatics Practices',           subject:'Computer Science', class:'Class XI', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:280 },
  { id:91,  title:'Home Science',                    subject:'Home Science',   class:'Class XI',   board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:240 },
  { id:92,  title:'Physical Education',              subject:'Physical Education', class:'Class XI', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:180 },
  { id:93,  title:'Accountancy Part I',              subject:'Commerce',       class:'Class XII',  board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:360 },
  { id:94,  title:'Accountancy Part II',             subject:'Commerce',       class:'Class XII',  board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:310 },
  { id:95,  title:'Business Studies Part I',         subject:'Commerce',       class:'Class XII',  board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:290 },
  { id:96,  title:'Business Studies Part II',        subject:'Commerce',       class:'Class XII',  board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:280 },
  { id:97,  title:'Micro Economics',                 subject:'Economics',      class:'Class XII',  board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:210 },
  { id:98,  title:'Political Science — Contemporary World Politics', subject:'Political Science', class:'Class XII', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:280 },
  { id:99,  title:'Politics in India since Independence', subject:'Political Science', class:'Class XII', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:260 },
  { id:100, title:'Psychology',                      subject:'Psychology',     class:'Class XII',  board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:310 },
  { id:101, title:'History — Themes in Indian History Part I', subject:'History', class:'Class XII', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:260 },
  { id:102, title:'History — Themes in Indian History Part II', subject:'History', class:'Class XII', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:240 },
  { id:103, title:'Geography — Fundamentals of Human Geography', subject:'Geography', class:'Class XII', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:220 },
  { id:104, title:'Geography — India People and Economy', subject:'Geography', class:'Class XII', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:240 },
  { id:105, title:'Sociology — Indian Society',      subject:'Sociology',      class:'Class XII',  board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:200 },
  { id:106, title:'Sociology — Social Change in India', subject:'Sociology',   class:'Class XII',  board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:210 },
  { id:107, title:'Legal Studies',                   subject:'Law',            class:'Class XII',  board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:280 },

  // ═══════════════════════════════════════════════════════════
  // HIGHER EDUCATION — UG/PG Textbooks & References
  // ═══════════════════════════════════════════════════════════
  // Engineering
  { id:110, title:'Engineering Mathematics',         subject:'Engineering',    class:'Undergraduate', board:'CBSE', author:'B.S. Grewal', lang:'English', type:'Textbook', pages:1200 },
  { id:111, title:'Data Structures & Algorithms',    subject:'Computer Science', class:'Undergraduate', board:'CBSE', author:'Cormen (CLRS)', lang:'English', type:'Reference Book', pages:1312 },
  { id:112, title:'Database Management Systems',     subject:'Computer Science', class:'Undergraduate', board:'CBSE', author:'Korth', lang:'English', type:'Textbook', pages:680 },
  { id:113, title:'Operating Systems',               subject:'Computer Science', class:'Undergraduate', board:'CBSE', author:'Galvin', lang:'English', type:'Textbook', pages:920 },
  { id:114, title:'Computer Networks',               subject:'Computer Science', class:'Undergraduate', board:'CBSE', author:'Tanenbaum', lang:'English', type:'Textbook', pages:810 },
  { id:115, title:'Artificial Intelligence — A Modern Approach', subject:'AI & ML', class:'Undergraduate', board:'CBSE', author:'Russell & Norvig', lang:'English', type:'Reference Book', pages:1152 },
  { id:116, title:'Machine Learning',                subject:'AI & ML',       class:'Postgraduate', board:'CBSE', author:'Tom Mitchell', lang:'English', type:'Reference Book', pages:432 },
  // Medicine
  { id:117, title:'Gray\'s Anatomy',                 subject:'Medicine',       class:'Undergraduate', board:'CBSE', author:'Gray', lang:'English', type:'Reference Book', pages:1568 },
  { id:118, title:'Guyton — Medical Physiology',     subject:'Medicine',       class:'Undergraduate', board:'CBSE', author:'Guyton & Hall', lang:'English', type:'Textbook', pages:1120 },
  { id:119, title:'Robbins Pathology',               subject:'Medicine',       class:'Undergraduate', board:'CBSE', author:'Robbins', lang:'English', type:'Reference Book', pages:1392 },
  { id:120, title:'Harper\'s Biochemistry',          subject:'Medicine',       class:'Undergraduate', board:'CBSE', author:'Harper', lang:'English', type:'Textbook', pages:850 },
  // Law
  { id:121, title:'Indian Polity — M. Laxmikanth',  subject:'Indian Polity',  class:'Undergraduate', board:'CBSE', author:'M. Laxmikanth', lang:'English', type:'Reference Book', pages:820 },
  { id:122, title:'Indian Constitution',             subject:'Law',            class:'Undergraduate', board:'CBSE', author:'D.D. Basu', lang:'English', type:'Reference Book', pages:680 },
  { id:123, title:'Law of Contracts',                subject:'Law',            class:'Undergraduate', board:'CBSE', author:'Avtar Singh', lang:'English', type:'Textbook', pages:520 },
  { id:124, title:'Criminal Law — IPC',              subject:'Law',            class:'Undergraduate', board:'CBSE', author:'K.D. Gaur', lang:'English', type:'Textbook', pages:640 },
  // Management
  { id:125, title:'Financial Management',            subject:'Management',     class:'Undergraduate', board:'CBSE', author:'I.M. Pandey', lang:'English', type:'Textbook', pages:480 },
  { id:126, title:'Marketing Management',            subject:'Management',     class:'Postgraduate',  board:'CBSE', author:'Philip Kotler', lang:'English', type:'Reference Book', pages:816 },
  // Pharmacy
  { id:127, title:'Pharmacology',                    subject:'Pharmacy',       class:'Undergraduate', board:'CBSE', author:'K.D. Tripathi', lang:'English', type:'Textbook', pages:960 },
  // Architecture
  { id:128, title:'Building Construction',           subject:'Architecture',   class:'Undergraduate', board:'CBSE', author:'B.C. Punmia', lang:'English', type:'Textbook', pages:420 },
  // Agriculture
  { id:129, title:'Principles of Agronomy',          subject:'Agriculture',    class:'Undergraduate', board:'CBSE', author:'S.R. Reddy', lang:'English', type:'Textbook', pages:380 },
  // Biotechnology
  { id:130, title:'Molecular Biology of the Cell',   subject:'Biotechnology',  class:'Undergraduate', board:'CBSE', author:'Alberts', lang:'English', type:'Reference Book', pages:1464 },
  // Data Science
  { id:131, title:'Python for Data Science',         subject:'Data Science',   class:'Undergraduate', board:'CBSE', author:'CuriousHat', lang:'English', type:'Textbook', pages:380 },
  // Nursing
  { id:132, title:'Nursing Foundations',              subject:'Nursing',        class:'Undergraduate', board:'CBSE', author:'B.T. Basavanthappa', lang:'English', type:'Textbook', pages:520 },

  // ═══════════════════════════════════════════════════════════
  // GOVT JOB PREP — Study Material
  // ═══════════════════════════════════════════════════════════
  // UPSC
  { id:140, title:'UPSC General Studies Manual',     subject:'General Studies', class:'UPSC CSE Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:840, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:141, title:'Indian Polity — UPSC Edition',    subject:'Indian Polity',  class:'UPSC CSE Prep', board:'CBSE', author:'M. Laxmikanth', lang:'English', type:'Reference Book', pages:820 },
  { id:142, title:'Indian Economy — UPSC',           subject:'Indian Economy', class:'UPSC CSE Prep', board:'CBSE', author:'Ramesh Singh', lang:'English', type:'Reference Book', pages:680 },
  { id:143, title:'Modern India — Spectrum',          subject:'History',        class:'UPSC CSE Prep', board:'CBSE', author:'Rajiv Ahir', lang:'English', type:'Reference Book', pages:520 },
  { id:144, title:'Geography of India — UPSC',       subject:'Geography',      class:'UPSC CSE Prep', board:'CBSE', author:'Majid Husain', lang:'English', type:'Reference Book', pages:480 },
  { id:145, title:'Ethics, Integrity & Aptitude',    subject:'Ethics & Integrity', class:'UPSC CSE Prep', board:'CBSE', author:'Lexicon', lang:'English', type:'Study Guide', pages:380 },
  { id:146, title:'CSAT — Aptitude & Reasoning',     subject:'Aptitude & Reasoning', class:'UPSC CSE Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:420 },
  { id:147, title:'UPSC Previous Year Papers (30 yrs)', subject:'General Studies', class:'UPSC CSE Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Question Paper', pages:640 },
  // SSC
  { id:150, title:'SSC CGL — Complete Guide',        subject:'Aptitude & Reasoning', class:'SSC CGL Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:560 },
  { id:151, title:'Quantitative Aptitude',           subject:'Mathematics',    class:'SSC CGL Prep', board:'CBSE', author:'R.S. Aggarwal', lang:'English', type:'Reference Book', pages:780 },
  { id:152, title:'Reasoning & General Intelligence', subject:'Aptitude & Reasoning', class:'SSC CGL Prep', board:'CBSE', author:'R.S. Aggarwal', lang:'English', type:'Reference Book', pages:540 },
  { id:153, title:'General Awareness for SSC',        subject:'Current Affairs', class:'SSC CGL Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:420 },
  { id:154, title:'English Language for SSC',          subject:'English',        class:'SSC CGL Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:380 },
  { id:155, title:'SSC CHSL — Complete Guide',        subject:'Aptitude & Reasoning', class:'SSC CGL Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:440 },
  // Banking
  { id:160, title:'Banking Awareness Compendium',     subject:'Banking Awareness', class:'Banking (IBPS/SBI) Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:380 },
  { id:161, title:'Quantitative Aptitude for Bank PO', subject:'Mathematics',  class:'Banking (IBPS/SBI) Prep', board:'CBSE', author:'Arun Sharma', lang:'English', type:'Reference Book', pages:620 },
  { id:162, title:'Reasoning for Bank Exams',         subject:'Aptitude & Reasoning', class:'Banking (IBPS/SBI) Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:480 },
  { id:163, title:'English for Bank Exams',           subject:'English',        class:'Banking (IBPS/SBI) Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:340 },
  { id:164, title:'RBI Grade B — Complete Guide',     subject:'Indian Economy', class:'Banking (IBPS/SBI) Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:520 },
  { id:165, title:'IBPS PO PYQs (10 Years)',          subject:'Banking Awareness', class:'Banking (IBPS/SBI) Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Question Paper', pages:480 },
  // Railways
  { id:170, title:'RRB NTPC — Complete Guide',        subject:'Railway GK',     class:'Railways (RRB) Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:420 },
  { id:171, title:'Railway Mathematics',              subject:'Mathematics',    class:'Railways (RRB) Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:340 },
  { id:172, title:'Railway GK & Current Affairs',     subject:'Railway GK',     class:'Railways (RRB) Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:280 },
  { id:173, title:'General Science for Railways',     subject:'General Science', class:'Railways (RRB) Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:320 },
  { id:174, title:'RRB Group D — Complete Guide',     subject:'Railway GK',     class:'Railways (RRB) Prep', board:'CBSE', author:'CuriousHat', lang:'Hindi', type:'Study Guide', pages:360 },
  // State PSC
  { id:175, title:'State PSC General Studies',        subject:'General Studies', class:'State PSC Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:680 },
  { id:176, title:'State-wise GK Compendium',         subject:'Current Affairs', class:'State PSC Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:520 },
  // Teaching
  { id:177, title:'CTET — Child Development & Pedagogy', subject:'Psychology', class:'CTET / Teaching Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:280 },
  { id:178, title:'UGC NET — Paper I Complete',       subject:'General Studies', class:'CTET / Teaching Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:420, cert:'Gurukul Global Vidyaniketan Certificate' },
  // Defence
  { id:179, title:'NDA Mathematics Complete',         subject:'Mathematics',    class:'Defence (NDA/CDS) Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:480 },
  { id:180, title:'CDS — General Ability',            subject:'General Studies', class:'Defence (NDA/CDS) Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:420 },
  { id:181, title:'SSB Interview Complete Guide',     subject:'General Studies', class:'Defence (NDA/CDS) Prep', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:260 },

  // ═══════════════════════════════════════════════════════════
  // AVIATION — Training Materials
  // ═══════════════════════════════════════════════════════════
  { id:185, title:'Air Navigation — CPL',             subject:'Air Navigation', class:'CPL (Pilot) Training', board:'CBSE', author:'CuriousHat', lang:'English', type:'Textbook', pages:380, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:186, title:'Aviation Meteorology',             subject:'Meteorology',    class:'CPL (Pilot) Training', board:'CBSE', author:'CuriousHat', lang:'English', type:'Textbook', pages:320, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:187, title:'Air Regulations (DGCA)',           subject:'Aviation',       class:'CPL (Pilot) Training', board:'CBSE', author:'CuriousHat', lang:'English', type:'Textbook', pages:280, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:188, title:'Technical General — Aircraft Systems', subject:'Aircraft Systems', class:'CPL (Pilot) Training', board:'CBSE', author:'CuriousHat', lang:'English', type:'Textbook', pages:420, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:189, title:'DGCA CPL — Previous Year Papers', subject:'Aviation',       class:'CPL (Pilot) Training', board:'CBSE', author:'CuriousHat', lang:'English', type:'Question Paper', pages:340 },
  { id:190, title:'AME Module 1 — Mathematics & Physics', subject:'Aircraft Systems', class:'AME Training', board:'CBSE', author:'CuriousHat', lang:'English', type:'Textbook', pages:460 },
  { id:191, title:'AME Module 2 — Aircraft Maintenance', subject:'Aircraft Systems', class:'AME Training', board:'CBSE', author:'CuriousHat', lang:'English', type:'Textbook', pages:520 },
  { id:192, title:'Cabin Crew Training Manual',       subject:'Aviation',       class:'Cabin Crew Training', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:220 },

  // ═══════════════════════════════════════════════════════════
  // ITI (Industrial Training Institutes) — After 8th/10th
  // NCVT (National Council for Vocational Training) curriculum
  // ═══════════════════════════════════════════════════════════
  // ── Engineering Trades (2 Year) ──
  { id:300, title:'Fitter — Trade Theory',              subject:'Fitter',         class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:480 },
  { id:301, title:'Fitter — Trade Practical',           subject:'Fitter',         class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Workbook', pages:360 },
  { id:302, title:'Electrician — Trade Theory',         subject:'Electrician',    class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:520 },
  { id:303, title:'Electrician — Trade Practical',      subject:'Electrician',    class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Workbook', pages:380 },
  { id:304, title:'Turner — Trade Theory',              subject:'Turner',         class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:420 },
  { id:305, title:'Turner — Trade Practical',           subject:'Turner',         class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Workbook', pages:310 },
  { id:306, title:'Welder — Trade Theory',              subject:'Welder',         class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:460 },
  { id:307, title:'Welder — Trade Practical',           subject:'Welder',         class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Workbook', pages:340 },
  { id:308, title:'Machinist — Trade Theory',           subject:'Machinist',      class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:440 },
  { id:309, title:'Machinist — Trade Practical',        subject:'Machinist',      class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Workbook', pages:320 },
  { id:310, title:'Mechanic Motor Vehicle — Trade Theory', subject:'Mechanic (Motor Vehicle)', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:540 },
  { id:311, title:'Mechanic Motor Vehicle — Practical', subject:'Mechanic (Motor Vehicle)', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Workbook', pages:380 },
  { id:312, title:'Mechanic Diesel — Trade Theory',     subject:'Mechanic (Diesel)', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:480 },
  { id:313, title:'Mechanic Diesel — Practical',        subject:'Mechanic (Diesel)', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Workbook', pages:350 },
  { id:314, title:'Mechanic RAC — Trade Theory',        subject:'Mechanic (Refrigeration & AC)', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:460 },
  { id:315, title:'Mechanic RAC — Practical',           subject:'Mechanic (Refrigeration & AC)', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Workbook', pages:340 },
  { id:316, title:'Electronics Mechanic — Theory',      subject:'Electronics Mechanic', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:500 },
  { id:317, title:'Electronics Mechanic — Practical',   subject:'Electronics Mechanic', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Workbook', pages:360 },
  { id:318, title:'Draughtsman Mechanical — Theory',    subject:'Draughtsman (Mechanical)', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:420 },
  { id:319, title:'Draughtsman Civil — Theory',         subject:'Draughtsman (Civil)', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:400 },
  // ── Engineering Trades (1 Year) ──
  { id:320, title:'Plumber — Trade Theory',             subject:'Plumber',        class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:320 },
  { id:321, title:'Plumber — Trade Practical',          subject:'Plumber',        class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Workbook', pages:240 },
  { id:322, title:'Carpenter — Trade Theory',           subject:'Carpenter',      class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:300 },
  { id:323, title:'Carpenter — Trade Practical',        subject:'Carpenter',      class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Workbook', pages:220 },
  { id:324, title:'Wireman — Trade Theory',             subject:'Wireman',        class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:340 },
  { id:325, title:'Painter General — Trade Theory',     subject:'Painter (General)', class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:280 },
  { id:326, title:'Sheet Metal Worker — Trade Theory',  subject:'Sheet Metal Worker', class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:310 },
  { id:327, title:'Foundry Man — Trade Theory',         subject:'Foundry Man',    class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:290 },
  // ── Non-Engineering / Service Trades (1–2 Year) ──
  { id:330, title:'COPA (Computer Operator) — Theory',  subject:'Copa (IT)',      class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:360 },
  { id:331, title:'COPA — Practical & Lab',             subject:'Copa (IT)',      class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Workbook', pages:280 },
  { id:332, title:'IT (Information Technology) — Theory', subject:'Information Technology (IT-ITI)', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:480 },
  { id:333, title:'IT — Practical & Networking',        subject:'Information Technology (IT-ITI)', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Workbook', pages:340 },
  { id:334, title:'Stenographer English — Theory',      subject:'Stenographer (English)', class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:260 },
  { id:335, title:'Stenographer Hindi — Theory',        subject:'Stenographer (Hindi)', class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'Hindi', type:'Textbook', pages:260 },
  { id:336, title:'Dress Making — Trade Theory',        subject:'Dress Making',   class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:240 },
  { id:337, title:'Hair & Skin Care — Trade Theory',    subject:'Hair & Skin Care', class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:220 },
  { id:338, title:'Basic Cosmetology — Trade Theory',   subject:'Basic Cosmetology', class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:200 },
  { id:339, title:'Food Production — Trade Theory',     subject:'Food Production', class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:280 },
  { id:340, title:'Front Office Assistant — Theory',    subject:'Front Office Assistant', class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:240 },
  { id:341, title:'Housekeeper — Trade Theory',         subject:'Housekeeper',    class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:200 },
  // ── Common / Core Subjects (All ITI trades) ──
  { id:345, title:'Workshop Calculation & Science',     subject:'Workshop Calculation', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:320 },
  { id:346, title:'Engineering Drawing',                subject:'Engineering Drawing', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:280 },
  { id:347, title:'Employability Skills',               subject:'Employability Skills', class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Textbook', pages:180 },
  { id:348, title:'Employability Skills — Communication & IT', subject:'Employability Skills', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'English', type:'Study Guide', pages:160 },
  // ── ITI Entrance & Competitive Exam Prep ──
  { id:350, title:'ITI Entrance Exam — Complete Guide', subject:'Workshop Calculation', class:'ITI (1 Year)', board:'NCVT', author:'CuriousHat', lang:'English', type:'Study Guide', pages:340 },
  { id:351, title:'ITI Entrance — Maths & Science',    subject:'Workshop Calculation', class:'ITI (1 Year)', board:'NCVT', author:'CuriousHat', lang:'English', type:'Study Guide', pages:280 },
  { id:352, title:'ITI Entrance — GK & Reasoning',     subject:'Employability Skills', class:'ITI (1 Year)', board:'NCVT', author:'CuriousHat', lang:'English', type:'Study Guide', pages:220 },
  { id:353, title:'ITI Previous Year Papers (All Trades)', subject:'Workshop Calculation', class:'ITI (1 Year)', board:'NCVT', author:'CuriousHat', lang:'English', type:'Question Paper', pages:400 },
  // ── ITI Hindi Medium (popular in UP, MP, Bihar, Rajasthan) ──
  { id:355, title:'फिटर — ट्रेड थ्योरी (Hindi)',        subject:'Fitter',         class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'Hindi', type:'Textbook', pages:480 },
  { id:356, title:'इलेक्ट्रीशियन — ट्रेड थ्योरी (Hindi)', subject:'Electrician',  class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'Hindi', type:'Textbook', pages:520 },
  { id:357, title:'वेल्डर — ट्रेड थ्योरी (Hindi)',      subject:'Welder',         class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'Hindi', type:'Textbook', pages:460 },
  { id:358, title:'कोपा — कंप्यूटर ऑपरेटर (Hindi)',    subject:'Copa (IT)',      class:'ITI (1 Year)', board:'NCVT', author:'NIMI', lang:'Hindi', type:'Textbook', pages:360 },
  { id:359, title:'कार्यशाला गणना एवं विज्ञान (Hindi)', subject:'Workshop Calculation', class:'ITI (2 Year)', board:'NCVT', author:'NIMI', lang:'Hindi', type:'Textbook', pages:320 },

  // ═══════════════════════════════════════════════════════════
  // SCHOOL — Entrance Exam Prep (after 10th, during 11–12)
  // ═══════════════════════════════════════════════════════════
  { id:195, title:'CLAT — Legal Reasoning & GK',     subject:'Law',            class:'CLAT Preparatory',  board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:420 },
  { id:196, title:'CUET — General Test Prep',         subject:'General Studies', class:'CUET Preparatory', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:380 },
  { id:197, title:'CUET — Domain Subject Prep',       subject:'General Studies', class:'CUET Preparatory', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:420 },
  { id:198, title:'NIFT / NID — Design Aptitude',     subject:'Fashion Design', class:'NIFT/NID Preparatory', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:280, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:199, title:'UPSC Foundation (Class 11–12)',     subject:'General Studies', class:'Class XI', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:340, cert:'Gurukul Global Vidyaniketan Certificate' },
  { id:200, title:'Banking Foundation (Class 11–12)',  subject:'Mathematics',    class:'Class XI', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:260 },
  { id:201, title:'NDA Foundation (Class 11–12)',      subject:'Mathematics',    class:'Class XI', board:'CBSE', author:'CuriousHat', lang:'English', type:'Study Guide', pages:340 },
]

export type LibraryBook = { id: number; title: string; subject: string; class: string; board: string; author: string; lang: string; type: string; pages: number; cert?: string }

export const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: '#4F46E5', Physics: '#0891B2', Chemistry: '#059669',
  Biology: '#7C3AED', English: '#D97706', History: '#B45309',
  Geography: '#0D9488', Economics: '#1D4ED8', 'Computer Science': '#BE185D',
  'General Science': '#DC2626', Commerce: '#F59E0B', 'The Arts': '#EC4899',
  'Political Science': '#6D28D9', 'Regional Languages': '#065F46',
  Sociology: '#7C3AED', Psychology: '#1D4ED8', Hindi: '#DC2626',
  // Creative & Performing Arts
  Music: '#8B5CF6', 'Fashion Design': '#EC4899', 'Performing Arts': '#F59E0B',
  // International Languages
  French: '#2563EB', Spanish: '#DC2626', German: '#1D4ED8', 'Mandarin Chinese': '#B91C1C',
  Japanese: '#BE185D', Korean: '#7C3AED', Arabic: '#065F46', Portuguese: '#059669',
  Russian: '#0891B2', Italian: '#D97706', Thai: '#0D9488', Vietnamese: '#B45309',
  Swahili: '#6D28D9',
  // Indian Languages
  Bengali: '#DC2626', Marathi: '#D97706', Telugu: '#059669', Tamil: '#B91C1C',
  Gujarati: '#1D4ED8', Kannada: '#BE185D', Malayalam: '#0891B2', Punjabi: '#D97706', Odia: '#065F46',
  // Additional Global Languages
  Polish: '#DC2626', Ukrainian: '#1D4ED8', Romanian: '#0891B2', Dutch: '#D97706',
  Greek: '#4F46E5', Swedish: '#1D4ED8', Indonesian: '#DC2626', Malay: '#059669', Turkish: '#DC2626',
  'Persian (Farsi)': '#065F46', Hebrew: '#1D4ED8',
  // Higher Ed / Professional
  Engineering: '#4F46E5', Medicine: '#059669', Law: '#B45309', Management: '#1D4ED8',
  Architecture: '#BE185D', Pharmacy: '#059669', Nursing: '#EC4899', Agriculture: '#059669',
  Biotechnology: '#7C3AED', 'Data Science': '#4F46E5', 'AI & ML': '#7C3AED',
  // Govt Job Prep
  'General Studies': '#DC2626', 'Aptitude & Reasoning': '#D97706', 'Current Affairs': '#1D4ED8',
  'Indian Polity': '#4F46E5', 'Indian Economy': '#059669', 'Ethics & Integrity': '#7C3AED',
  'Banking Awareness': '#1D4ED8', 'Railway GK': '#D97706',
  // Aviation
  Aviation: '#0891B2', 'Air Navigation': '#0891B2', Meteorology: '#0D9488', 'Aircraft Systems': '#D97706',
  // ITI Trades
  Fitter: '#D97706', Electrician: '#F59E0B', Turner: '#B45309', Welder: '#DC2626',
  Plumber: '#0891B2', 'Mechanic (Motor Vehicle)': '#4F46E5', 'Mechanic (Diesel)': '#1D4ED8',
  'Mechanic (Refrigeration & AC)': '#0D9488', Carpenter: '#B45309', Machinist: '#6D28D9',
  Wireman: '#F59E0B', 'Electronics Mechanic': '#BE185D', 'Information Technology (IT-ITI)': '#7C3AED',
  'Copa (IT)': '#4F46E5', 'Draughtsman (Mechanical)': '#D97706', 'Draughtsman (Civil)': '#059669',
  'Sheet Metal Worker': '#6B7280', 'Painter (General)': '#EC4899', 'Foundry Man': '#DC2626',
  'Stenographer (English)': '#1D4ED8', 'Stenographer (Hindi)': '#DC2626',
  'Dress Making': '#EC4899', 'Hair & Skin Care': '#BE185D', 'Basic Cosmetology': '#EC4899',
  'Food Production': '#D97706', 'Front Office Assistant': '#4F46E5', Housekeeper: '#0D9488',
  'Workshop Calculation': '#F59E0B', 'Engineering Drawing': '#6D28D9', 'Employability Skills': '#059669',
}
export function subjectColor(s: string) { return SUBJECT_COLORS[s] || '#6B7280' }

/** Type alias — defined above after ALL_BOOKS */

export const SUBJECT_ICONS: Record<string, string> = {
  Mathematics: '📐', Physics: '⚡', Chemistry: '🧪', Biology: '🌿',
  'General Science': '🔬', History: '🏛️', Geography: '🌍', Economics: '📈',
  Commerce: '📊', 'Computer Science': '💻', English: '📖', Hindi: '🔤',
  'Regional Languages': '🗣️', 'Political Science': '⚖️', 'The Arts': '🎨',
  Psychology: '🧠', Sociology: '👥', 'Physical Education': '🏃',
  'Fine Arts': '🖌️', 'Home Science': '🏡', 'Vocational Studies': '🔧',
  // Creative & Performing Arts
  Music: '🎵', 'Fashion Design': '👗', 'Performing Arts': '🎭',
  // International Languages
  French: '🇫🇷', Spanish: '🇪🇸', German: '🇩🇪', 'Mandarin Chinese': '🇨🇳',
  Japanese: '🇯🇵', Korean: '🇰🇷', Arabic: '🇸🇦', Portuguese: '🇧🇷',
  Russian: '🇷🇺', Italian: '🇮🇹', Thai: '🇹🇭', Vietnamese: '🇻🇳',
  Swahili: '🇰🇪',
  // Indian Languages
  Bengali: '🇮🇳', Marathi: '🇮🇳', Telugu: '🇮🇳', Tamil: '🇮🇳',
  Gujarati: '🇮🇳', Kannada: '🇮🇳', Malayalam: '🇮🇳', Punjabi: '🇮🇳', Odia: '🇮🇳',
  // Additional Global Languages
  Polish: '🇵🇱', Ukrainian: '🇺🇦', Romanian: '🇷🇴', Dutch: '🇳🇱',
  Greek: '🇬🇷', Swedish: '🇸🇪', Indonesian: '🇮🇩', Malay: '🇲🇾', Turkish: '🇹🇷',
  'Persian (Farsi)': '🇮🇷', Hebrew: '🇮🇱',
  // Higher Ed / Professional
  Engineering: '⚙️', Medicine: '🏥', Law: '⚖️', Management: '💼',
  Architecture: '🏗️', Pharmacy: '💊', Nursing: '🩺', Agriculture: '🌾',
  Biotechnology: '🧬', 'Data Science': '📊', 'AI & ML': '🤖',
  // Govt Job Prep
  'General Studies': '📋', 'Aptitude & Reasoning': '🧩', 'Current Affairs': '📰',
  'Indian Polity': '🏛️', 'Indian Economy': '💹', 'Ethics & Integrity': '🛡️',
  'Banking Awareness': '🏦', 'Railway GK': '🚆',
  // Aviation
  Aviation: '✈️', 'Air Navigation': '🧭', Meteorology: '🌤️', 'Aircraft Systems': '🔧',
  // ITI Trades
  Fitter: '🔧', Electrician: '⚡', Turner: '🔩', Welder: '🔥',
  Plumber: '🚿', 'Mechanic (Motor Vehicle)': '🚗', 'Mechanic (Diesel)': '🚛',
  'Mechanic (Refrigeration & AC)': '❄️', Carpenter: '🪚', Machinist: '⚙️',
  Wireman: '🔌', 'Electronics Mechanic': '📻', 'Information Technology (IT-ITI)': '💻',
  'Copa (IT)': '🖥️', 'Draughtsman (Mechanical)': '📐', 'Draughtsman (Civil)': '🏗️',
  'Sheet Metal Worker': '🔨', 'Painter (General)': '🖌️', 'Foundry Man': '🏭',
  'Stenographer (English)': '⌨️', 'Stenographer (Hindi)': '⌨️',
  'Dress Making': '👗', 'Hair & Skin Care': '💇', 'Basic Cosmetology': '💄',
  'Food Production': '🍳', 'Front Office Assistant': '🏨', Housekeeper: '🧹',
  'Workshop Calculation': '🧮', 'Engineering Drawing': '📏', 'Employability Skills': '🎯',
}

