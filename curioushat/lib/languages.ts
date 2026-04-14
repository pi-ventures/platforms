/**
 * IQEdge.ai Language Registry — shared across CuriousHat.ai, IQEdge OCR, and all KnowledgeHub products.
 *
 * Maps: language name → Google Translate code, Tesseract OCR code, native name, script
 * 98 languages (83 Tesseract + 15 EasyOCR) covering 95%+ of world's literate population.
 */

export interface Language {
  name: string;
  nativeName: string;
  googleCode: string;    // Google Translate API code
  tesseractCode: string; // Tesseract OCR code
  script: string;
  engine?: "tesseract" | "easyocr";  // default: tesseract
  region: "indian" | "south_asian" | "western_europe" | "eastern_europe" | "scandinavia" | "middle_east" | "east_asia" | "southeast_asia" | "central_asia" | "africa" | "caucasus" | "balkans";
}

export const LANGUAGES: Record<string, Language> = {
  // ─── Indian Languages (18) ───────────────────────────────────
  hindi:      { name: "Hindi",      nativeName: "हिन्दी",      googleCode: "hi", tesseractCode: "hin", script: "Devanagari", region: "indian" },
  telugu:     { name: "Telugu",     nativeName: "తెలుగు",      googleCode: "te", tesseractCode: "tel", script: "Telugu",     region: "indian" },
  tamil:      { name: "Tamil",      nativeName: "தமிழ்",       googleCode: "ta", tesseractCode: "tam", script: "Tamil",      region: "indian" },
  kannada:    { name: "Kannada",    nativeName: "ಕನ್ನಡ",       googleCode: "kn", tesseractCode: "kan", script: "Kannada",    region: "indian" },
  malayalam:  { name: "Malayalam",  nativeName: "മലയാളം",      googleCode: "ml", tesseractCode: "mal", script: "Malayalam",  region: "indian" },
  bengali:    { name: "Bengali",    nativeName: "বাংলা",        googleCode: "bn", tesseractCode: "ben", script: "Bengali",    region: "indian" },
  gujarati:   { name: "Gujarati",   nativeName: "ગુજરાતી",     googleCode: "gu", tesseractCode: "guj", script: "Gujarati",   region: "indian" },
  marathi:    { name: "Marathi",    nativeName: "मराठी",        googleCode: "mr", tesseractCode: "mar", script: "Devanagari", region: "indian" },
  punjabi:    { name: "Punjabi",    nativeName: "ਪੰਜਾਬੀ",       googleCode: "pa", tesseractCode: "pan", script: "Gurmukhi",  region: "indian" },
  odia:       { name: "Odia",       nativeName: "ଓଡ଼ିଆ",        googleCode: "or", tesseractCode: "ori", script: "Odia",       region: "indian" },
  urdu:       { name: "Urdu",       nativeName: "اردو",         googleCode: "ur", tesseractCode: "urd", script: "Arabic",     region: "indian" },
  assamese:   { name: "Assamese",   nativeName: "অসমীয়া",      googleCode: "as", tesseractCode: "asm", script: "Bengali",    region: "indian" },
  nepali:     { name: "Nepali",     nativeName: "नेपाली",       googleCode: "ne", tesseractCode: "nep", script: "Devanagari", region: "indian" },
  sanskrit:   { name: "Sanskrit",   nativeName: "संस्कृतम्",     googleCode: "sa", tesseractCode: "san", script: "Devanagari", region: "indian" },
  maithili:   { name: "Maithili",   nativeName: "मैथिली",       googleCode: "mai",tesseractCode: "mai", script: "Devanagari", region: "indian" },
  santali:    { name: "Santali",    nativeName: "ᱥᱟᱱᱛᱟᱲᱤ",      googleCode: "sat",tesseractCode: "sat", script: "Ol Chiki",   region: "indian" },
  sindhi:     { name: "Sindhi",     nativeName: "سنڌي",         googleCode: "sd", tesseractCode: "snd", script: "Arabic",     region: "indian" },
  bodo:       { name: "Bodo",       nativeName: "बड़ो",          googleCode: "brx",tesseractCode: "brx", script: "Devanagari", region: "indian" },

  // ─── South Asian (2) ───────────────────────────────────────
  sinhala:    { name: "Sinhala",    nativeName: "සිංහල",        googleCode: "si", tesseractCode: "sin", script: "Sinhala",    region: "south_asian" },
  pashto:     { name: "Pashto",     nativeName: "پښتو",         googleCode: "ps", tesseractCode: "pus", script: "Arabic",     region: "south_asian" },

  // ─── Western Europe (12) ─────────────────────────────────────
  english:    { name: "English",    nativeName: "English",    googleCode: "en", tesseractCode: "eng", script: "Latin",  region: "western_europe" },
  spanish:    { name: "Spanish",    nativeName: "Español",    googleCode: "es", tesseractCode: "spa", script: "Latin",  region: "western_europe" },
  french:     { name: "French",     nativeName: "Français",   googleCode: "fr", tesseractCode: "fra", script: "Latin",  region: "western_europe" },
  german:     { name: "German",     nativeName: "Deutsch",    googleCode: "de", tesseractCode: "deu", script: "Latin",  region: "western_europe" },
  italian:    { name: "Italian",    nativeName: "Italiano",   googleCode: "it", tesseractCode: "ita", script: "Latin",  region: "western_europe" },
  portuguese: { name: "Portuguese", nativeName: "Português",  googleCode: "pt", tesseractCode: "por", script: "Latin",  region: "western_europe" },
  dutch:      { name: "Dutch",      nativeName: "Nederlands", googleCode: "nl", tesseractCode: "nld", script: "Latin",  region: "western_europe" },
  catalan:    { name: "Catalan",    nativeName: "Català",     googleCode: "ca", tesseractCode: "cat", script: "Latin",  region: "western_europe" },

  basque:     { name: "Basque",     nativeName: "Euskara",    googleCode: "eu", tesseractCode: "eus", script: "Latin",  region: "western_europe" },
  welsh:      { name: "Welsh",      nativeName: "Cymraeg",    googleCode: "cy", tesseractCode: "cym", script: "Latin",  region: "western_europe" },
  irish:      { name: "Irish",      nativeName: "Gaeilge",    googleCode: "ga", tesseractCode: "gle", script: "Latin",  region: "western_europe" },
  maori:      { name: "Maori",      nativeName: "Te Reo Māori",googleCode: "mi", tesseractCode: "mri", script: "Latin",  region: "western_europe" },

  // ─── Scandinavia (4) ─────────────────────────────────────────
  swedish:    { name: "Swedish",    nativeName: "Svenska",    googleCode: "sv", tesseractCode: "swe", script: "Latin",  region: "scandinavia" },
  norwegian:  { name: "Norwegian",  nativeName: "Norsk",      googleCode: "no", tesseractCode: "nor", script: "Latin",  region: "scandinavia" },
  danish:     { name: "Danish",     nativeName: "Dansk",      googleCode: "da", tesseractCode: "dan", script: "Latin",  region: "scandinavia" },
  finnish:    { name: "Finnish",    nativeName: "Suomi",      googleCode: "fi", tesseractCode: "fin", script: "Latin",  region: "scandinavia" },

  // ─── Eastern Europe (14) ─────────────────────────────────────
  russian:    { name: "Russian",    nativeName: "Русский",    googleCode: "ru", tesseractCode: "rus", script: "Cyrillic", region: "eastern_europe" },
  polish:     { name: "Polish",     nativeName: "Polski",     googleCode: "pl", tesseractCode: "pol", script: "Latin",    region: "eastern_europe" },
  ukrainian:  { name: "Ukrainian",  nativeName: "Українська", googleCode: "uk", tesseractCode: "ukr", script: "Cyrillic", region: "eastern_europe" },
  czech:      { name: "Czech",      nativeName: "Čeština",    googleCode: "cs", tesseractCode: "ces", script: "Latin",    region: "eastern_europe" },
  hungarian:  { name: "Hungarian",  nativeName: "Magyar",     googleCode: "hu", tesseractCode: "hun", script: "Latin",    region: "eastern_europe" },
  romanian:   { name: "Romanian",   nativeName: "Română",     googleCode: "ro", tesseractCode: "ron", script: "Latin",    region: "eastern_europe" },
  bulgarian:  { name: "Bulgarian",  nativeName: "Български",  googleCode: "bg", tesseractCode: "bul", script: "Cyrillic", region: "eastern_europe" },
  croatian:   { name: "Croatian",   nativeName: "Hrvatski",   googleCode: "hr", tesseractCode: "hrv", script: "Latin",    region: "eastern_europe" },
  serbian:    { name: "Serbian",    nativeName: "Српски",     googleCode: "sr", tesseractCode: "srp", script: "Cyrillic", region: "eastern_europe" },
  slovak:     { name: "Slovak",     nativeName: "Slovenčina", googleCode: "sk", tesseractCode: "slk", script: "Latin",    region: "eastern_europe" },
  lithuanian: { name: "Lithuanian", nativeName: "Lietuvių",   googleCode: "lt", tesseractCode: "lit", script: "Latin",    region: "eastern_europe" },
  latvian:    { name: "Latvian",    nativeName: "Latviešu",   googleCode: "lv", tesseractCode: "lav", script: "Latin",    region: "eastern_europe" },
  estonian:   { name: "Estonian",   nativeName: "Eesti",      googleCode: "et", tesseractCode: "est", script: "Latin",    region: "eastern_europe" },
  slovenian:  { name: "Slovenian", nativeName: "Slovenščina",googleCode: "sl", tesseractCode: "slv", script: "Latin",    region: "eastern_europe" },

  // ─── Caucasus (3) ────────────────────────────────────────────
  georgian:   { name: "Georgian",   nativeName: "ქართული",    googleCode: "ka", tesseractCode: "kat", script: "Georgian",  region: "caucasus" },
  armenian:   { name: "Armenian",   nativeName: "Հայերեն",    googleCode: "hy", tesseractCode: "hye", script: "Armenian",  region: "caucasus" },
  azerbaijani:{ name: "Azerbaijani",nativeName: "Azərbaycan", googleCode: "az", tesseractCode: "aze", script: "Latin",     region: "caucasus" },

  // ─── Middle East (4) ─────────────────────────────────────────
  arabic:     { name: "Arabic",     nativeName: "العربية",     googleCode: "ar", tesseractCode: "ara", script: "Arabic",   region: "middle_east" },
  hebrew:     { name: "Hebrew",     nativeName: "עברית",       googleCode: "he", tesseractCode: "heb", script: "Hebrew",   region: "middle_east" },
  persian:    { name: "Persian",    nativeName: "فارسی",       googleCode: "fa", tesseractCode: "fas", script: "Arabic",   region: "middle_east" },
  turkish:    { name: "Turkish",    nativeName: "Türkçe",     googleCode: "tr", tesseractCode: "tur", script: "Latin",    region: "middle_east" },

  // ─── East Asia (4) ───────────────────────────────────────────
  chinese_simplified:  { name: "Chinese (Simplified)",  nativeName: "简体中文",  googleCode: "zh-CN", tesseractCode: "chi_sim", script: "Han", region: "east_asia" },
  chinese_traditional: { name: "Chinese (Traditional)", nativeName: "繁體中文",  googleCode: "zh-TW", tesseractCode: "chi_tra", script: "Han", region: "east_asia" },
  japanese:   { name: "Japanese",   nativeName: "日本語",      googleCode: "ja", tesseractCode: "jpn", script: "Kanji/Kana", region: "east_asia" },
  korean:     { name: "Korean",     nativeName: "한국어",       googleCode: "ko", tesseractCode: "kor", script: "Hangul",     region: "east_asia" },

  // ─── Southeast Asia (9) ──────────────────────────────────────
  thai:       { name: "Thai",       nativeName: "ไทย",        googleCode: "th", tesseractCode: "tha", script: "Thai",    region: "southeast_asia" },
  vietnamese: { name: "Vietnamese", nativeName: "Tiếng Việt", googleCode: "vi", tesseractCode: "vie", script: "Latin",   region: "southeast_asia" },
  indonesian: { name: "Indonesian", nativeName: "Bahasa Indonesia", googleCode: "id", tesseractCode: "ind", script: "Latin", region: "southeast_asia" },
  malay:      { name: "Malay",      nativeName: "Bahasa Melayu",   googleCode: "ms", tesseractCode: "msa", script: "Latin", region: "southeast_asia" },
  filipino:   { name: "Filipino",   nativeName: "Filipino",   googleCode: "tl", tesseractCode: "tgl", script: "Latin",   region: "southeast_asia" },
  cebuano:    { name: "Cebuano",    nativeName: "Cebuano",    googleCode: "ceb",tesseractCode: "ceb", script: "Latin",   region: "southeast_asia" },
  burmese:    { name: "Burmese",    nativeName: "မြန်မာဘာသာ",   googleCode: "my", tesseractCode: "mya", script: "Myanmar",  region: "southeast_asia" },
  khmer:      { name: "Khmer",      nativeName: "ភាសាខ្មែរ",     googleCode: "km", tesseractCode: "khm", script: "Khmer",   region: "southeast_asia" },
  lao:        { name: "Lao",        nativeName: "ພາສາລາວ",      googleCode: "lo", tesseractCode: "lao", script: "Lao",     region: "southeast_asia" },

  // ─── Central Asia (4) ────────────────────────────────────────
  uzbek:      { name: "Uzbek",      nativeName: "Oʻzbek",    googleCode: "uz", tesseractCode: "uzb", script: "Latin",     region: "central_asia" },
  kazakh:     { name: "Kazakh",     nativeName: "Қазақ",      googleCode: "kk", tesseractCode: "kaz", script: "Cyrillic",  region: "central_asia" },
  mongolian:  { name: "Mongolian",  nativeName: "Монгол",     googleCode: "mn", tesseractCode: "mon", script: "Cyrillic",  region: "central_asia" },
  tajik:      { name: "Tajik",      nativeName: "Тоҷикӣ",    googleCode: "tg", tesseractCode: "tgk", script: "Cyrillic",  region: "central_asia" },

  // ─── Africa + Mediterranean (5) ─────────────────────────────
  swahili:    { name: "Swahili",    nativeName: "Kiswahili",  googleCode: "sw", tesseractCode: "swa", script: "Latin",    region: "africa" },
  amharic:    { name: "Amharic",    nativeName: "አማርኛ",       googleCode: "am", tesseractCode: "amh", script: "Ethiopic", region: "africa" },
  yoruba:     { name: "Yoruba",     nativeName: "Yorùbá",     googleCode: "yo", tesseractCode: "yor", script: "Latin",    region: "africa" },
  afrikaans:  { name: "Afrikaans",  nativeName: "Afrikaans",  googleCode: "af", tesseractCode: "afr", script: "Latin",    region: "africa" },
  maltese:    { name: "Maltese",    nativeName: "Malti",      googleCode: "mt", tesseractCode: "mt",  script: "Latin",    region: "africa", engine: "easyocr" },

  // ─── Greek (1) ───────────────────────────────────────────────
  greek:      { name: "Greek",      nativeName: "Ελληνικά",   googleCode: "el", tesseractCode: "ell", script: "Greek",    region: "western_europe" },

  // ─── Scandinavia + Iceland — new (1) ────────────────────────
  icelandic:  { name: "Icelandic",  nativeName: "Íslenska",   googleCode: "is", tesseractCode: "isl", script: "Latin",    region: "scandinavia" },

  // ─── Eastern Europe — new (2) ──────────────────────────────
  belarusian: { name: "Belarusian", nativeName: "Беларуская", googleCode: "be", tesseractCode: "bel", script: "Cyrillic", region: "eastern_europe" },
  occitan:    { name: "Occitan",    nativeName: "Occitan",    googleCode: "oc", tesseractCode: "oc",  script: "Latin",    region: "western_europe", engine: "easyocr" },

  // ─── Balkans (2) ────────────────────────────────────────────
  albanian:   { name: "Albanian",   nativeName: "Shqip",      googleCode: "sq", tesseractCode: "sqi", script: "Latin",    region: "balkans" },
  bosnian:    { name: "Bosnian",    nativeName: "Bosanski",   googleCode: "bs", tesseractCode: "bos", script: "Latin",    region: "balkans" },

  // ─── Middle East — EasyOCR (2) ─────────────────────────────
  uyghur:     { name: "Uyghur",     nativeName: "ئۇيغۇرچە",    googleCode: "ug", tesseractCode: "ug",  script: "Arabic",   region: "middle_east", engine: "easyocr" },
  kurdish:    { name: "Kurdish",    nativeName: "Kurdî",      googleCode: "ku", tesseractCode: "ku",  script: "Latin",    region: "middle_east", engine: "easyocr" },

  // ─── Caucasus — EasyOCR (4) ────────────────────────────────
  chechen:    { name: "Chechen",    nativeName: "Нохчийн",    googleCode: "ce", tesseractCode: "che", script: "Cyrillic", region: "caucasus", engine: "easyocr" },
  avar:       { name: "Avar",       nativeName: "Авар",       googleCode: "av", tesseractCode: "ava", script: "Cyrillic", region: "caucasus", engine: "easyocr" },
  kabardian:  { name: "Kabardian",  nativeName: "Адыгэбзэ",   googleCode: "kbd",tesseractCode: "kbd", script: "Cyrillic", region: "caucasus", engine: "easyocr" },
  adyghe:     { name: "Adyghe",     nativeName: "Адыгабзэ",   googleCode: "ady",tesseractCode: "ady", script: "Cyrillic", region: "caucasus", engine: "easyocr" },

  // ─── Indian — EasyOCR (6) ──────────────────────────────────
  bhojpuri:   { name: "Bhojpuri",   nativeName: "भोजपुरी",     googleCode: "bho",tesseractCode: "bho", script: "Devanagari", region: "indian", engine: "easyocr" },
  haryanvi:   { name: "Haryanvi",   nativeName: "हरियाणवी",    googleCode: "bgc",tesseractCode: "bgc", script: "Devanagari", region: "indian", engine: "easyocr" },
  angika:     { name: "Angika",     nativeName: "अंगिका",      googleCode: "anp",tesseractCode: "ang", script: "Devanagari", region: "indian", engine: "easyocr" },
  manipuri:   { name: "Manipuri",   nativeName: "মৈতৈলোন্",     googleCode: "mni",tesseractCode: "mni", script: "Bengali",    region: "indian", engine: "easyocr" },
  konkani:    { name: "Konkani",    nativeName: "कोंकणी",       googleCode: "gom",tesseractCode: "gom", script: "Devanagari", region: "indian", engine: "easyocr" },
  newari:     { name: "Newari",     nativeName: "नेपाल भाषा",   googleCode: "new",tesseractCode: "new", script: "Devanagari", region: "south_asian", engine: "easyocr" },

  // ─── South Asian — EasyOCR (1) ─────────────────────────────
  bihari:     { name: "Bihari",     nativeName: "बिहारी",       googleCode: "bh", tesseractCode: "bh",  script: "Devanagari", region: "south_asian", engine: "easyocr" },
};

// Utility functions
export const getLanguageByGoogleCode = (code: string): Language | undefined =>
  Object.values(LANGUAGES).find((l) => l.googleCode === code);

export const getLanguageByTesseractCode = (code: string): Language | undefined =>
  Object.values(LANGUAGES).find((l) => l.tesseractCode === code);

export const getLanguagesByRegion = (region: Language["region"]): Language[] =>
  Object.values(LANGUAGES).filter((l) => l.region === region);

export const getIndianLanguages = (): Language[] => getLanguagesByRegion("indian");

export const getAllGoogleCodes = (): string[] =>
  Object.values(LANGUAGES).map((l) => l.googleCode);

export const getAllTesseractCodes = (): string[] =>
  Object.values(LANGUAGES).map((l) => l.tesseractCode);

// For Google Translate dropdown
export const TRANSLATE_OPTIONS = Object.entries(LANGUAGES)
  .map(([key, lang]) => ({
    value: lang.googleCode,
    label: `${lang.name} (${lang.nativeName})`,
    key,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

export const LANGUAGE_COUNT = Object.keys(LANGUAGES).length;

export const INDIAN_LANGUAGE_COUNT = Object.values(LANGUAGES).filter(
  (l) => l.region === "indian"
).length;

export const INTERNATIONAL_LANGUAGE_COUNT = LANGUAGE_COUNT - INDIAN_LANGUAGE_COUNT;

export const REGION_COUNT = new Set(Object.values(LANGUAGES).map((l) => l.region)).size;

/** Pre-computed label for stats: "98 Languages (24 Indian + 74 International)" */
export const LANGUAGE_STAT_LABEL = `Languages (${INDIAN_LANGUAGE_COUNT} Indian + ${INTERNATIONAL_LANGUAGE_COUNT} International)`;
