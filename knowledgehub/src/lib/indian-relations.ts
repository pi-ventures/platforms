// ─────────────────────────────────────────────────────────────────────────────
// Indian Relationship Terms — All Languages, All States, All Succession Rules
//
// 22 Official Languages + Regional Variations
// Hindu / Muslim / Christian / Parsi / Tribal succession rules
// State-specific: Goa Civil Code, Kerala Marumakkathayam, NE Tribal customs
// ─────────────────────────────────────────────────────────────────────────────

export type Language =
  | 'hindi' | 'tamil' | 'telugu' | 'kannada' | 'malayalam'
  | 'bengali' | 'marathi' | 'gujarati' | 'punjabi' | 'odia'
  | 'assamese' | 'urdu' | 'kashmiri' | 'konkani' | 'manipuri'
  | 'nepali' | 'sanskrit' | 'sindhi' | 'dogri' | 'maithili'
  | 'santali' | 'bodo' | 'english'

export interface RelationTerm {
  key: string           // canonical key: father, mother, chacha, etc.
  path: string[]        // chain of labels to match
  category: 'paternal' | 'maternal' | 'in_law' | 'spouse_side' | 'sibling' | 'child' | 'grandparent' | 'grandchild' | 'extended' | 'professional' | 'educational'
  gender: 'male' | 'female' | 'neutral'
  generation: number    // 0 = same, +1 = parent, +2 = grandparent, -1 = child, etc.
  terms: Partial<Record<Language, { roman: string; script: string }>>
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETE INDIAN RELATIONSHIP DICTIONARY
// ═══════════════════════════════════════════════════════════════════════════════

export const RELATIONS: RelationTerm[] = [

  // ── PARENTS ─────────────────────────────────────────────────────────────────
  {
    key: 'father', path: ['father'], category: 'paternal', gender: 'male', generation: 1,
    terms: {
      hindi: { roman: 'Pita / Babuji / Papa', script: 'पिता / बाबूजी / पापा' },
      tamil: { roman: 'Appa / Thanthai', script: 'அப்பா / தந்தை' },
      telugu: { roman: 'Nanna / Naanna', script: 'నాన్న' },
      kannada: { roman: 'Appa / Tande', script: 'ಅಪ್ಪ / ತಂದೆ' },
      malayalam: { roman: 'Achan / Appan', script: 'അച്ഛൻ / അപ്പൻ' },
      bengali: { roman: 'Baba / Abba', script: 'বাবা' },
      marathi: { roman: 'Baba / Vadil', script: 'बाबा / वडील' },
      gujarati: { roman: 'Pita / Bapuji', script: 'પિતા / બાપુજી' },
      punjabi: { roman: 'Pita ji / Daddy ji', script: 'ਪਿਤਾ ਜੀ' },
      odia: { roman: 'Bapa / Pita', script: 'ବାପା / ପିତା' },
      assamese: { roman: 'Deutak / Pitri', script: 'দেউতাক' },
      urdu: { roman: 'Abbu / Walid', script: 'ابو / والد' },
      kashmiri: { roman: 'Moji / Bab', script: 'موجی' },
      konkani: { roman: 'Bapui / Pai', script: 'बापुय' },
      nepali: { roman: 'Buwa / Baba', script: 'बुवा / बाबा' },
      sanskrit: { roman: 'Pita', script: 'पिता' },
      maithili: { roman: 'Babuji / Pita', script: 'बाबूजी' },
      english: { roman: 'Father', script: 'Father' },
    },
  },
  {
    key: 'mother', path: ['mother'], category: 'maternal', gender: 'female', generation: 1,
    terms: {
      hindi: { roman: 'Maa / Mata / Amma', script: 'माँ / माता / अम्मा' },
      tamil: { roman: 'Amma / Thaai', script: 'அம்மா / தாய்' },
      telugu: { roman: 'Amma / Talli', script: 'అమ్మ / తల్లి' },
      kannada: { roman: 'Amma / Tayi', script: 'ಅಮ್ಮ / ತಾಯಿ' },
      malayalam: { roman: 'Amma', script: 'അമ്മ' },
      bengali: { roman: 'Maa / Ma', script: 'মা' },
      marathi: { roman: 'Aai', script: 'आई' },
      gujarati: { roman: 'Maa / Ba', script: 'મા / બા' },
      punjabi: { roman: 'Maa ji / Bebe', script: 'ਮਾਂ ਜੀ / ਬੇਬੇ' },
      odia: { roman: 'Maa / Maata', script: 'ମା / ମାତା' },
      assamese: { roman: 'Maa / Aai', script: 'মা / আই' },
      urdu: { roman: 'Ammi / Walida', script: 'امی / والدہ' },
      kashmiri: { roman: 'Mouj', script: 'موج' },
      konkani: { roman: 'Avoi / Aai', script: 'आवय' },
      nepali: { roman: 'Aama', script: 'आमा' },
      sanskrit: { roman: 'Mata', script: 'माता' },
      maithili: { roman: 'Maai / Amma', script: 'माई' },
      english: { roman: 'Mother', script: 'Mother' },
    },
  },

  // ── SPOUSE ──────────────────────────────────────────────────────────────────
  {
    key: 'husband', path: ['husband'], category: 'spouse_side', gender: 'male', generation: 0,
    terms: {
      hindi: { roman: 'Pati / Shauhar', script: 'पति / शौहर' },
      tamil: { roman: 'Kanavan / Purushan', script: 'கணவன்' },
      telugu: { roman: 'Bharta / Mogudu', script: 'భర్త' },
      kannada: { roman: 'Ganda / Pati', script: 'ಗಂಡ / ಪತಿ' },
      malayalam: { roman: 'Bharthav / Chettan', script: 'ഭർത്താവ്' },
      bengali: { roman: 'Swami / Bor', script: 'স্বামী' },
      marathi: { roman: 'Navra / Pati', script: 'नवरा / पती' },
      gujarati: { roman: 'Pati / Vahaalaa', script: 'પતિ' },
      punjabi: { roman: 'Pati / Khasam', script: 'ਪਤੀ' },
      urdu: { roman: 'Shohar / Khaavind', script: 'شوہر' },
      english: { roman: 'Husband', script: 'Husband' },
    },
  },
  {
    key: 'wife', path: ['wife'], category: 'spouse_side', gender: 'female', generation: 0,
    terms: {
      hindi: { roman: 'Patni / Biwi / Dharampatni', script: 'पत्नी / बीवी' },
      tamil: { roman: 'Manaivi / Ponnu', script: 'மனைவி' },
      telugu: { roman: 'Bharya / Pellam', script: 'భార్య' },
      kannada: { roman: 'Hendati / Patni', script: 'ಹೆಂಡತಿ / ಪತ್ನಿ' },
      malayalam: { roman: 'Bharya / Ponnu', script: 'ഭാര്യ' },
      bengali: { roman: 'Stri / Bou', script: 'স্ত্রী / বউ' },
      marathi: { roman: 'Bayko / Patni', script: 'बायको / पत्नी' },
      gujarati: { roman: 'Patni / Vahaalii', script: 'પત્ની' },
      punjabi: { roman: 'Patni / Gharwaali', script: 'ਪਤਨੀ' },
      urdu: { roman: 'Biwi / Begum', script: 'بیوی / بیگم' },
      english: { roman: 'Wife', script: 'Wife' },
    },
  },

  // ── CHILDREN ────────────────────────────────────────────────────────────────
  {
    key: 'son', path: ['son'], category: 'child', gender: 'male', generation: -1,
    terms: {
      hindi: { roman: 'Beta / Putra', script: 'बेटा / पुत्र' },
      tamil: { roman: 'Magan / Kumaran', script: 'மகன்' },
      telugu: { roman: 'Koduku / Putrudu', script: 'కొడుకు' },
      kannada: { roman: 'Maga', script: 'ಮಗ' },
      malayalam: { roman: 'Makan / Mon', script: 'മകൻ' },
      bengali: { roman: 'Chhele / Putra', script: 'ছেলে' },
      marathi: { roman: 'Mulga / Putra', script: 'मुलगा / पुत्र' },
      gujarati: { roman: 'Dikro / Putra', script: 'દીકરો' },
      punjabi: { roman: 'Putt / Puttar', script: 'ਪੁੱਤ / ਪੁੱਤਰ' },
      odia: { roman: 'Pua / Putra', script: 'ପୁଅ' },
      urdu: { roman: 'Beta', script: 'بیٹا' },
      english: { roman: 'Son', script: 'Son' },
    },
  },
  {
    key: 'daughter', path: ['daughter'], category: 'child', gender: 'female', generation: -1,
    terms: {
      hindi: { roman: 'Beti / Putri', script: 'बेटी / पुत्री' },
      tamil: { roman: 'Magal', script: 'மகள்' },
      telugu: { roman: 'Kuturu / Putrika', script: 'కూతురు' },
      kannada: { roman: 'Magalu', script: 'ಮಗಳು' },
      malayalam: { roman: 'Makal / Mol', script: 'മകൾ' },
      bengali: { roman: 'Meye / Kanya', script: 'মেয়ে' },
      marathi: { roman: 'Mulgi / Kanya', script: 'मुलगी' },
      gujarati: { roman: 'Dikri', script: 'દીકરી' },
      punjabi: { roman: 'Dhee', script: 'ਧੀ' },
      odia: { roman: 'Jhia', script: 'ଝିଅ' },
      urdu: { roman: 'Beti', script: 'بیٹی' },
      english: { roman: 'Daughter', script: 'Daughter' },
    },
  },

  // ── SIBLINGS ────────────────────────────────────────────────────────────────
  {
    key: 'elder_brother', path: ['brother'], category: 'sibling', gender: 'male', generation: 0,
    terms: {
      hindi: { roman: 'Bhaiya / Dada', script: 'भैया / दादा' },
      tamil: { roman: 'Anna / Annan', script: 'அண்ணா / அண்ணன்' },
      telugu: { roman: 'Anna / Annayya', script: 'అన్న / అన్నయ్య' },
      kannada: { roman: 'Anna', script: 'ಅಣ್ಣ' },
      malayalam: { roman: 'Chettan / Ettan', script: 'ചേട്ടൻ / ഏട്ടൻ' },
      bengali: { roman: 'Dada', script: 'দাদা' },
      marathi: { roman: 'Dada / Bhau', script: 'दादा / भाऊ' },
      gujarati: { roman: 'Moto Bhai', script: 'મોટો ભાઈ' },
      punjabi: { roman: 'Veer ji / Paaji', script: 'ਵੀਰ ਜੀ / ਪਾਜੀ' },
      odia: { roman: 'Bada Bhai / Bhauja', script: 'ବଡ଼ ଭାଇ' },
      urdu: { roman: 'Bhaijaan / Bhai', script: 'بھائی جان' },
      english: { roman: 'Elder Brother', script: 'Elder Brother' },
    },
  },
  {
    key: 'younger_brother', path: ['brother'], category: 'sibling', gender: 'male', generation: 0,
    terms: {
      hindi: { roman: 'Chhota Bhai', script: 'छोटा भाई' },
      tamil: { roman: 'Thambi', script: 'தம்பி' },
      telugu: { roman: 'Tammudu', script: 'తమ్ముడు' },
      kannada: { roman: 'Tamma', script: 'ತಮ್ಮ' },
      malayalam: { roman: 'Aniyan', script: 'അനിയൻ' },
      bengali: { roman: 'Bon / Chhoto Bhai', script: 'ছোট ভাই' },
      marathi: { roman: 'Lahan Bhau', script: 'लहान भाऊ' },
      gujarati: { roman: 'Nano Bhai', script: 'નાનો ભાઈ' },
      punjabi: { roman: 'Chhota Veer', script: 'ਛੋਟਾ ਵੀਰ' },
      urdu: { roman: 'Chhota Bhai', script: 'چھوٹا بھائی' },
      english: { roman: 'Younger Brother', script: 'Younger Brother' },
    },
  },
  {
    key: 'elder_sister', path: ['sister'], category: 'sibling', gender: 'female', generation: 0,
    terms: {
      hindi: { roman: 'Didi / Jiji', script: 'दीदी / जीजी' },
      tamil: { roman: 'Akka', script: 'அக்கா' },
      telugu: { roman: 'Akka', script: 'అక్క' },
      kannada: { roman: 'Akka', script: 'ಅಕ್ಕ' },
      malayalam: { roman: 'Chechi / Echi', script: 'ചേച്ചി' },
      bengali: { roman: 'Didi', script: 'দিদি' },
      marathi: { roman: 'Tai / Akka', script: 'ताई / अक्का' },
      gujarati: { roman: 'Moti Ben', script: 'મોટી બેન' },
      punjabi: { roman: 'Bhain ji / Didi', script: 'ਭੈਣ ਜੀ' },
      odia: { roman: 'Api / Nani', script: 'ଅପି' },
      urdu: { roman: 'Aapa / Baji', script: 'آپا / باجی' },
      english: { roman: 'Elder Sister', script: 'Elder Sister' },
    },
  },
  {
    key: 'younger_sister', path: ['sister'], category: 'sibling', gender: 'female', generation: 0,
    terms: {
      hindi: { roman: 'Chhoti Behen', script: 'छोटी बहन' },
      tamil: { roman: 'Thangai / Thangachi', script: 'தங்கை / தங்கச்சி' },
      telugu: { roman: 'Chelli / Chellelu', script: 'చెల్లి' },
      kannada: { roman: 'Tangi', script: 'ತಂಗಿ' },
      malayalam: { roman: 'Aniyathi', script: 'അനിയത്തി' },
      bengali: { roman: 'Bon', script: 'বোন' },
      marathi: { roman: 'Lahan Bahin', script: 'लहान बहीण' },
      gujarati: { roman: 'Nani Ben', script: 'નાની બેન' },
      punjabi: { roman: 'Chhoti Bhain', script: 'ਛੋਟੀ ਭੈਣ' },
      urdu: { roman: 'Chhoti Behen', script: 'چھوٹی بہن' },
      english: { roman: 'Younger Sister', script: 'Younger Sister' },
    },
  },

  // ── PATERNAL UNCLES & AUNTS ─────────────────────────────────────────────────
  {
    key: 'chacha', path: ['father', 'brother'], category: 'paternal', gender: 'male', generation: 1,
    terms: {
      hindi: { roman: 'Chacha', script: 'चाचा' },
      tamil: { roman: 'Chithappa / Periyappa', script: 'சித்தப்பா / பெரியப்பா' },
      telugu: { roman: 'Chinnaanna / Pedanaanna', script: 'చిన్నన్న / పెదనాన్న' },
      kannada: { roman: 'Chikkappa / Doddappa', script: 'ಚಿಕ್ಕಪ್ಪ / ದೊಡ್ಡಪ್ಪ' },
      malayalam: { roman: 'Cheriyachan / Valiyachan', script: 'ചെറിയച്ഛൻ / വലിയച്ഛൻ' },
      bengali: { roman: 'Kaka / Jethu', script: 'কাকা / জেঠু' },
      marathi: { roman: 'Kaka', script: 'काका' },
      gujarati: { roman: 'Kaka', script: 'કાકા' },
      punjabi: { roman: 'Chacha ji / Taya ji', script: 'ਚਾਚਾ ਜੀ / ਤਾਇਆ ਜੀ' },
      odia: { roman: 'Kaku / Bada Bapa', script: 'କାକୁ / ବଡ଼ ବାପା' },
      assamese: { roman: 'Khura / Bor Deutak', script: 'খুৰা' },
      urdu: { roman: 'Chacha / Tau', script: 'چاچا / تاؤ' },
      nepali: { roman: 'Kaka / Thulo Buwa', script: 'काका / ठूलो बुवा' },
      english: { roman: "Father's Brother (Chacha/Tau)", script: "Uncle (paternal)" },
    },
  },
  {
    key: 'chachi', path: ['chacha', 'wife'], category: 'paternal', gender: 'female', generation: 1,
    terms: {
      hindi: { roman: 'Chachi', script: 'चाची' },
      tamil: { roman: 'Chithhi / Periyamma', script: 'சித்தி / பெரியம்மா' },
      telugu: { roman: 'Pinni / Peddamma', script: 'పిన్ని / పెద్దమ్మ' },
      kannada: { roman: 'Chikkamma / Doddamma', script: 'ಚಿಕ್ಕಮ್ಮ / ದೊಡ್ಡಮ್ಮ' },
      malayalam: { roman: 'Cheriyamma / Valiyamma', script: 'ചെറിയമ്മ / വലിയമ്മ' },
      bengali: { roman: 'Kaki / Jethi Maa', script: 'কাকিমা / জেঠিমা' },
      marathi: { roman: 'Kaku', script: 'काकू' },
      gujarati: { roman: 'Kaki', script: 'કાકી' },
      punjabi: { roman: 'Chachi ji / Tayi ji', script: 'ਚਾਚੀ ਜੀ / ਤਾਈ ਜੀ' },
      urdu: { roman: 'Chachi', script: 'چاچی' },
      english: { roman: "Father's Brother's Wife", script: "Aunt (paternal)" },
    },
  },
  {
    key: 'bua', path: ['father', 'sister'], category: 'paternal', gender: 'female', generation: 1,
    terms: {
      hindi: { roman: 'Bua / Phuphii', script: 'बुआ / फूफी' },
      tamil: { roman: 'Athai', script: 'அத்தை' },
      telugu: { roman: 'Attayya', script: 'అత్తయ్య' },
      kannada: { roman: 'Atthe', script: 'ಅತ್ತೆ' },
      malayalam: { roman: 'Ammaayi', script: 'അമ്മായി' },
      bengali: { roman: 'Pishi / Pisi', script: 'পিসি' },
      marathi: { roman: 'Aatya', script: 'आत्या' },
      gujarati: { roman: 'Fai / Foi', script: 'ફોઈ' },
      punjabi: { roman: 'Bhua ji / Phuphi', script: 'ਭੂਆ ਜੀ' },
      odia: { roman: 'Pisi / Bapa Bhaunia', script: 'ପିସି' },
      urdu: { roman: 'Phuphii', script: 'پھوپھی' },
      english: { roman: "Father's Sister", script: "Aunt (paternal)" },
    },
  },
  {
    key: 'fufa', path: ['bua', 'husband'], category: 'paternal', gender: 'male', generation: 1,
    terms: {
      hindi: { roman: 'Fufa / Phupha', script: 'फूफा / फूफा' },
      tamil: { roman: 'Athaan / Maaman', script: 'அத்தான்' },
      telugu: { roman: 'Maava', script: 'మావ' },
      bengali: { roman: 'Pise Moshai / Pisha', script: 'পিসেমশাই' },
      marathi: { roman: 'Aatoba', script: 'आतोबा' },
      gujarati: { roman: 'Fua / Fova', script: 'ફુવા' },
      punjabi: { roman: 'Phuphar ji', script: 'ਫੁੱਫੜ ਜੀ' },
      urdu: { roman: 'Phupha', script: 'پھوپھا' },
      english: { roman: "Father's Sister's Husband", script: "Uncle (by marriage, paternal)" },
    },
  },

  // ── MATERNAL UNCLES & AUNTS ─────────────────────────────────────────────────
  {
    key: 'mama', path: ['mother', 'brother'], category: 'maternal', gender: 'male', generation: 1,
    terms: {
      hindi: { roman: 'Mama / Maamu', script: 'मामा / मामू' },
      tamil: { roman: 'Maaman / Maama', script: 'மாமா / மாமன்' },
      telugu: { roman: 'Maama / Maamayya', script: 'మామ / మామయ్య' },
      kannada: { roman: 'Maava / Sohdaramma', script: 'ಮಾವ' },
      malayalam: { roman: 'Ammavan / Maaman', script: 'അമ്മാവൻ' },
      bengali: { roman: 'Mama', script: 'মামা' },
      marathi: { roman: 'Mama', script: 'मामा' },
      gujarati: { roman: 'Mama', script: 'મામા' },
      punjabi: { roman: 'Mama ji', script: 'ਮਾਮਾ ਜੀ' },
      odia: { roman: 'Mamu / Mausa', script: 'ମାମୁ' },
      assamese: { roman: 'Mama', script: 'মামা' },
      urdu: { roman: 'Maamu / Khalu', script: 'مامو / خالو' },
      nepali: { roman: 'Mama', script: 'मामा' },
      english: { roman: "Mother's Brother", script: "Uncle (maternal)" },
    },
  },
  {
    key: 'mami', path: ['mama', 'wife'], category: 'maternal', gender: 'female', generation: 1,
    terms: {
      hindi: { roman: 'Mami', script: 'मामी' },
      tamil: { roman: 'Maami', script: 'மாமி' },
      telugu: { roman: 'Attamma', script: 'అత్తమ్మ' },
      kannada: { roman: 'Attige', script: 'ಅತ್ತಿಗೆ' },
      malayalam: { roman: 'Ammaayi', script: 'അമ്മായി' },
      bengali: { roman: 'Mami', script: 'মামি' },
      marathi: { roman: 'Mami', script: 'मामी' },
      gujarati: { roman: 'Mami', script: 'મામી' },
      punjabi: { roman: 'Mami ji', script: 'ਮਾਮੀ ਜੀ' },
      urdu: { roman: 'Mami / Khala', script: 'مامی' },
      english: { roman: "Mother's Brother's Wife", script: "Aunt (maternal, by marriage)" },
    },
  },
  {
    key: 'mausi', path: ['mother', 'sister'], category: 'maternal', gender: 'female', generation: 1,
    terms: {
      hindi: { roman: 'Mausi / Maasi', script: 'मौसी / मासी' },
      tamil: { roman: 'Chithhi / Periyamma', script: 'சித்தி / பெரியம்மா' },
      telugu: { roman: 'Pinni / Peddamma', script: 'పిన్ని' },
      kannada: { roman: 'Chikkamma / Doddamma', script: 'ಚಿಕ್ಕಮ್ಮ' },
      malayalam: { roman: 'Kunjamma / Valiyamma', script: 'കുഞ്ഞമ്മ' },
      bengali: { roman: 'Masi / Mashima', script: 'মাসি / মাশিমা' },
      marathi: { roman: 'Maushi / Mavshi', script: 'मावशी' },
      gujarati: { roman: 'Masi / Maasi', script: 'માસી' },
      punjabi: { roman: 'Maasi ji', script: 'ਮਾਸੀ ਜੀ' },
      odia: { roman: 'Maausi', script: 'ମାଉସୀ' },
      urdu: { roman: 'Khala', script: 'خالہ' },
      english: { roman: "Mother's Sister", script: "Aunt (maternal)" },
    },
  },
  {
    key: 'mausa', path: ['mausi', 'husband'], category: 'maternal', gender: 'male', generation: 1,
    terms: {
      hindi: { roman: 'Mausa / Maasad', script: 'मौसा' },
      tamil: { roman: 'Maaman', script: 'மாமன்' },
      telugu: { roman: 'Maava', script: 'మావ' },
      bengali: { roman: 'Meso / Mesho', script: 'মেসো' },
      marathi: { roman: 'Kaka / Mavsoba', script: 'काका' },
      gujarati: { roman: 'Maasa', script: 'માસા' },
      punjabi: { roman: 'Masar ji', script: 'ਮਾਸੜ ਜੀ' },
      urdu: { roman: 'Khalu', script: 'خالو' },
      english: { roman: "Mother's Sister's Husband", script: "Uncle (maternal, by marriage)" },
    },
  },

  // ── GRANDPARENTS ────────────────────────────────────────────────────────────
  {
    key: 'dada', path: ['father', 'father'], category: 'grandparent', gender: 'male', generation: 2,
    terms: {
      hindi: { roman: 'Dada / Dada ji', script: 'दादा / दादाजी' },
      tamil: { roman: 'Thatha / Paattaa', script: 'தாத்தா / பாட்டா' },
      telugu: { roman: 'Thaatha', script: 'తాత' },
      kannada: { roman: 'Ajja / Thaatha', script: 'ಅಜ್ಜ' },
      malayalam: { roman: 'Muthachan / Appuppan', script: 'മുത്തച്ഛൻ / അപ്പൂപ്പൻ' },
      bengali: { roman: 'Thakurda / Dadu', script: 'ঠাকুরদা / দাদু' },
      marathi: { roman: 'Ajoba', script: 'आजोबा' },
      gujarati: { roman: 'Dada', script: 'દાદા' },
      punjabi: { roman: 'Dada ji / Baba ji', script: 'ਦਾਦਾ ਜੀ' },
      odia: { roman: 'Buda Bapa / Ajaa', script: 'ଆଜା' },
      urdu: { roman: 'Dada', script: 'دادا' },
      english: { roman: 'Paternal Grandfather', script: 'Grandfather (paternal)' },
    },
  },
  {
    key: 'dadi', path: ['father', 'mother'], category: 'grandparent', gender: 'female', generation: 2,
    terms: {
      hindi: { roman: 'Dadi / Dadi ji', script: 'दादी / दादीजी' },
      tamil: { roman: 'Paatti', script: 'பாட்டி' },
      telugu: { roman: 'Naayanamma / Ammamma', script: 'నాయనమ్మ' },
      kannada: { roman: 'Ajji', script: 'ಅಜ್ಜಿ' },
      malayalam: { roman: 'Muthashi / Ammumma', script: 'മുത്തശ്ശി / അമ്മൂമ്മ' },
      bengali: { roman: 'Thakurma / Dida', script: 'ঠাকুরমা / দিদা' },
      marathi: { roman: 'Aaji', script: 'आजी' },
      gujarati: { roman: 'Dadi / Ba', script: 'દાદી' },
      punjabi: { roman: 'Dadi ji / Bebe ji', script: 'ਦਾਦੀ ਜੀ' },
      urdu: { roman: 'Dadi', script: 'دادی' },
      english: { roman: 'Paternal Grandmother', script: 'Grandmother (paternal)' },
    },
  },
  {
    key: 'nana', path: ['mother', 'father'], category: 'grandparent', gender: 'male', generation: 2,
    terms: {
      hindi: { roman: 'Nana / Nana ji', script: 'नाना / नानाजी' },
      tamil: { roman: 'Thatha (maternal)', script: 'தாத்தா' },
      telugu: { roman: 'Thaatha (maternal)', script: 'తాత' },
      kannada: { roman: 'Ajja (maternal)', script: 'ಅಜ್ಜ' },
      malayalam: { roman: 'Muthachan (maternal)', script: 'മുത്തച്ഛൻ' },
      bengali: { roman: 'Didabhai / Dadu (maternal)', script: 'দাদু' },
      marathi: { roman: 'Ajoba (maternal)', script: 'आजोबा' },
      gujarati: { roman: 'Nana', script: 'નાના' },
      punjabi: { roman: 'Nana ji', script: 'ਨਾਨਾ ਜੀ' },
      urdu: { roman: 'Nana', script: 'نانا' },
      english: { roman: 'Maternal Grandfather', script: 'Grandfather (maternal)' },
    },
  },
  {
    key: 'nani', path: ['mother', 'mother'], category: 'grandparent', gender: 'female', generation: 2,
    terms: {
      hindi: { roman: 'Nani / Nani ji', script: 'नानी / नानीजी' },
      tamil: { roman: 'Paatti (maternal)', script: 'பாட்டி' },
      telugu: { roman: 'Ammamma', script: 'అమ్మమ్మ' },
      kannada: { roman: 'Ajji (maternal)', script: 'ಅಜ್ಜಿ' },
      malayalam: { roman: 'Ammumma (maternal)', script: 'അമ്മൂമ്മ' },
      bengali: { roman: 'Dida (maternal)', script: 'দিদা' },
      marathi: { roman: 'Aaji (maternal)', script: 'आजी' },
      gujarati: { roman: 'Nani', script: 'નાની' },
      punjabi: { roman: 'Nani ji', script: 'ਨਾਨੀ ਜੀ' },
      urdu: { roman: 'Nani', script: 'نانی' },
      english: { roman: 'Maternal Grandmother', script: 'Grandmother (maternal)' },
    },
  },

  // ── IN-LAWS ─────────────────────────────────────────────────────────────────
  {
    key: 'sasur', path: ['spouse', 'father'], category: 'in_law', gender: 'male', generation: 1,
    terms: {
      hindi: { roman: 'Sasur ji', script: 'ससुर जी' },
      tamil: { roman: 'Mamanar', script: 'மாமனார்' },
      telugu: { roman: 'Mamagaaru', script: 'మామగారు' },
      kannada: { roman: 'Maava', script: 'ಮಾವ' },
      malayalam: { roman: 'Ammavan / Achan', script: 'അമ്മാവൻ' },
      bengali: { roman: 'Shoshur', script: 'শশুর' },
      marathi: { roman: 'Sasre', script: 'सासरे' },
      gujarati: { roman: 'Sasra', script: 'સસરા' },
      punjabi: { roman: 'Susar ji', script: 'ਸਹੁਰਾ ਜੀ' },
      urdu: { roman: 'Susur / Khusur', script: 'سسر' },
      english: { roman: 'Father-in-law', script: 'Father-in-law' },
    },
  },
  {
    key: 'saas', path: ['spouse', 'mother'], category: 'in_law', gender: 'female', generation: 1,
    terms: {
      hindi: { roman: 'Saas / Sasu Maa', script: 'सास / सासू माँ' },
      tamil: { roman: 'Maami / Mamaiyar', script: 'மாமியார்' },
      telugu: { roman: 'Atthamma', script: 'అత్తమ్మ' },
      kannada: { roman: 'Atte', script: 'ಅತ್ತೆ' },
      malayalam: { roman: 'Ammaayi', script: 'അമ്മായി' },
      bengali: { roman: 'Shashuri', script: 'শাশুড়ি' },
      marathi: { roman: 'Sasu', script: 'सासू' },
      gujarati: { roman: 'Sasu', script: 'સાસુ' },
      punjabi: { roman: 'Sass ji', script: 'ਸੱਸ ਜੀ' },
      urdu: { roman: 'Saas', script: 'ساس' },
      english: { roman: 'Mother-in-law', script: 'Mother-in-law' },
    },
  },
  {
    key: 'bahu', path: ['son', 'wife'], category: 'in_law', gender: 'female', generation: -1,
    terms: {
      hindi: { roman: 'Bahu / Putravadhu', script: 'बहू / पुत्रवधू' },
      tamil: { roman: 'Marumagal', script: 'மருமகள்' },
      telugu: { roman: 'Kodalu', script: 'కోడలు' },
      kannada: { roman: 'Sose', script: 'ಸೊಸೆ' },
      malayalam: { roman: 'Marumakal', script: 'മരുമകൾ' },
      bengali: { roman: 'Bou / Bouma', script: 'বউ / বৌমা' },
      marathi: { roman: 'Sun / Suun', script: 'सून' },
      gujarati: { roman: 'Vahu', script: 'વહુ' },
      punjabi: { roman: 'Nuh', script: 'ਨੂੰਹ' },
      urdu: { roman: 'Bahu', script: 'بہو' },
      english: { roman: 'Daughter-in-law', script: 'Daughter-in-law' },
    },
  },
  {
    key: 'damaad', path: ['daughter', 'husband'], category: 'in_law', gender: 'male', generation: -1,
    terms: {
      hindi: { roman: 'Damaad / Jamai', script: 'दामाद / जमाई' },
      tamil: { roman: 'Marumagan / Maapillai', script: 'மருமகன் / மாப்பிள்ளை' },
      telugu: { roman: 'Alludu', script: 'అల్లుడు' },
      kannada: { roman: 'Aliya', script: 'ಅಳಿಯ' },
      malayalam: { roman: 'Marumakan', script: 'മരുമകൻ' },
      bengali: { roman: 'Jamai', script: 'জামাই' },
      marathi: { roman: 'Jaavai / Bhaaoji', script: 'जावई' },
      gujarati: { roman: 'Jamai', script: 'જમાઈ' },
      punjabi: { roman: 'Jawaai', script: 'ਜਵਾਈ' },
      urdu: { roman: 'Damaad', script: 'داماد' },
      english: { roman: 'Son-in-law', script: 'Son-in-law' },
    },
  },
  {
    key: 'bhabhi', path: ['brother', 'wife'], category: 'in_law', gender: 'female', generation: 0,
    terms: {
      hindi: { roman: 'Bhabhi', script: 'भाभी' },
      tamil: { roman: 'Anni', script: 'அண்ணி' },
      telugu: { roman: 'Vadina / Maradalu', script: 'వదిన' },
      kannada: { roman: 'Attige', script: 'ಅತ್ತಿಗೆ' },
      malayalam: { roman: 'Chechiamma / Edathiamma', script: 'ചേച്ചിയമ്മ' },
      bengali: { roman: 'Boudi / Boudidi', script: 'বৌদি' },
      marathi: { roman: 'Vahini / Bhabhi', script: 'वहिनी' },
      gujarati: { roman: 'Bhabhi', script: 'ભાભી' },
      punjabi: { roman: 'Bhabi ji / Bhrajayi', script: 'ਭਾਬੀ ਜੀ' },
      urdu: { roman: 'Bhabhi / Bhawaj', script: 'بھابھی' },
      english: { roman: "Brother's Wife", script: 'Sister-in-law' },
    },
  },
  {
    key: 'jija', path: ['sister', 'husband'], category: 'in_law', gender: 'male', generation: 0,
    terms: {
      hindi: { roman: 'Jija / Jijaji / Bahnoi', script: 'जीजा / बहनोई' },
      tamil: { roman: 'Athtan / Machchan', script: 'அத்தான் / மச்சான்' },
      telugu: { roman: 'Baava / Baamardhi', script: 'బావ' },
      kannada: { roman: 'Bhava', script: 'ಭಾವ' },
      malayalam: { roman: 'Aaliyan / Chettan', script: 'ആളിയൻ' },
      bengali: { roman: 'Jaamai Babu / Bhagnipatni', script: 'জামাইবাবু' },
      marathi: { roman: 'Bhavoji / Mehuna', script: 'भावोजी' },
      gujarati: { roman: 'Banevee', script: 'બનેવી' },
      punjabi: { roman: 'Jija ji', script: 'ਜੀਜਾ ਜੀ' },
      urdu: { roman: 'Bahnoi / Jija', script: 'بہنوئی' },
      english: { roman: "Sister's Husband", script: 'Brother-in-law' },
    },
  },
  {
    key: 'devar', path: ['husband', 'brother'], category: 'in_law', gender: 'male', generation: 0,
    terms: {
      hindi: { roman: 'Devar (younger) / Jeth (elder)', script: 'देवर / जेठ' },
      tamil: { roman: 'Kozhundhan / Athan', script: 'கொழுந்தன் / அத்தான்' },
      telugu: { roman: 'Maridhi / Baava', script: 'మరిది / బావ' },
      kannada: { roman: 'Maiduna / Bhava', script: 'ಮೈದುನ' },
      malayalam: { roman: 'Ilayanachan / Muthachan', script: 'ഇളയനച്ഛൻ' },
      bengali: { roman: 'Bhasur (elder) / Deor (younger)', script: 'ভাশুর / দেওর' },
      marathi: { roman: 'Deevar / Bhausaheb', script: 'दीर' },
      gujarati: { roman: 'Divar / Jeth', script: 'દિયર / જેઠ' },
      punjabi: { roman: 'Devar / Jeth', script: 'ਦਿਉਰ / ਜੇਠ' },
      urdu: { roman: 'Devar / Jeth', script: 'دیور / جیٹھ' },
      english: { roman: "Husband's Brother", script: 'Brother-in-law' },
    },
  },
  {
    key: 'nanad', path: ['husband', 'sister'], category: 'in_law', gender: 'female', generation: 0,
    terms: {
      hindi: { roman: 'Nanad', script: 'ननद' },
      tamil: { roman: 'Kozhundhi / Naathhanaar', script: 'கொழுந்தி' },
      telugu: { roman: 'Aadapadduchulu', script: 'ఆడపడుచు' },
      kannada: { roman: 'Nadini', script: 'ನಾದಿನಿ' },
      bengali: { roman: 'Nanad / Jaa', script: 'ননদ' },
      marathi: { roman: 'Nanad', script: 'नणंद' },
      gujarati: { roman: 'Nand', script: 'નણંદ' },
      punjabi: { roman: 'Nand', script: 'ਨਣਦ' },
      urdu: { roman: 'Nanad', script: 'نند' },
      english: { roman: "Husband's Sister", script: 'Sister-in-law' },
    },
  },
  {
    key: 'sala', path: ['wife', 'brother'], category: 'in_law', gender: 'male', generation: 0,
    terms: {
      hindi: { roman: 'Sala / Saala', script: 'साला' },
      tamil: { roman: 'Machchan / Alangathu', script: 'மச்சான்' },
      telugu: { roman: 'Baava', script: 'బావ' },
      bengali: { roman: 'Shala', script: 'শালা' },
      marathi: { roman: 'Mehuna', script: 'मेहुणा' },
      gujarati: { roman: 'Saaro', script: 'સાળો' },
      punjabi: { roman: 'Saala', script: 'ਸਾਲਾ' },
      urdu: { roman: 'Saala', script: 'سالا' },
      english: { roman: "Wife's Brother", script: 'Brother-in-law' },
    },
  },
  {
    key: 'sali', path: ['wife', 'sister'], category: 'in_law', gender: 'female', generation: 0,
    terms: {
      hindi: { roman: 'Sali / Saali', script: 'साली' },
      tamil: { roman: 'Machchini', script: 'மச்சினி' },
      telugu: { roman: 'Maradalu', script: 'మరదలు' },
      bengali: { roman: 'Shali', script: 'শালী' },
      marathi: { roman: 'Mehuni', script: 'मेहुणी' },
      gujarati: { roman: 'Saali', script: 'સાળી' },
      punjabi: { roman: 'Saali', script: 'ਸਾਲੀ' },
      urdu: { roman: 'Saali', script: 'سالی' },
      english: { roman: "Wife's Sister", script: 'Sister-in-law' },
    },
  },
  {
    key: 'samdhi', path: ['son', 'wife', 'father'], category: 'in_law', gender: 'male', generation: 1,
    terms: {
      hindi: { roman: 'Samdhi', script: 'समधी' },
      tamil: { roman: 'Samandhi', script: 'சம்பந்தி' },
      telugu: { roman: 'Viyyankudu / Sambandhi', script: 'వియ్యంకుడు' },
      kannada: { roman: 'Odahuttidavaru', script: 'ಒಡಹುಟ್ಟಿದವರು' },
      bengali: { roman: 'Sambandhi', script: 'সম্বন্ধী' },
      marathi: { roman: 'Vyaahi', script: 'व्याही' },
      gujarati: { roman: 'Vyaahi / Vevaai', script: 'વેવાઈ' },
      punjabi: { roman: 'Samdhi', script: 'ਸਮਧੀ' },
      urdu: { roman: 'Samdhi', script: 'سمدھی' },
      english: { roman: "Child's Father/Mother-in-law", script: 'Co-in-law' },
    },
  },

  // ── COUSINS (shortcut names) ────────────────────────────────────────────────
  {
    key: 'chachera_bhai', path: ['chacha', 'son'], category: 'paternal', gender: 'male', generation: 0,
    terms: {
      hindi: { roman: 'Chachera Bhai', script: 'चचेरा भाई' },
      tamil: { roman: 'Chitthappa Paiyan', script: 'சித்தப்பா பையன்' },
      telugu: { roman: 'Babbai', script: 'బాబాయి' },
      bengali: { roman: 'Jaato Bhai', script: 'জাতো ভাই' },
      marathi: { roman: 'Chulat Bhau', script: 'चुलत भाऊ' },
      gujarati: { roman: 'Kakana Dikro', script: 'કાકાનો દીકરો' },
      punjabi: { roman: 'Chachera Bhai', script: 'ਚਚੇਰਾ ਭਰਾ' },
      urdu: { roman: 'Chachazaad Bhai', script: 'چچازاد بھائی' },
      english: { roman: "Paternal Uncle's Son", script: "Cousin (paternal)" },
    },
  },
  {
    key: 'mamera_bhai', path: ['mama', 'son'], category: 'maternal', gender: 'male', generation: 0,
    terms: {
      hindi: { roman: 'Mamera Bhai', script: 'ममेरा भाई' },
      tamil: { roman: 'Mama Paiyan', script: 'மாமா பையன்' },
      telugu: { roman: 'Menamamudu', script: 'మేనమామడు' },
      bengali: { roman: 'Mamer Bhai', script: 'মামের ভাই' },
      marathi: { roman: 'Mamacha Mulga', script: 'मामाचा मुलगा' },
      gujarati: { roman: 'Mamano Dikro', script: 'મામાનો દીકરો' },
      punjabi: { roman: 'Mamera Bhai', script: 'ਮਮੇਰਾ ਭਰਾ' },
      urdu: { roman: 'Mamuzaad Bhai', script: 'ماموزاد بھائی' },
      english: { roman: "Maternal Uncle's Son", script: "Cousin (maternal)" },
    },
  },
  {
    key: 'mausera_bhai', path: ['mausa', 'son'], category: 'maternal', gender: 'male', generation: 0,
    terms: {
      hindi: { roman: 'Mausera Bhai', script: 'मौसेरा भाई' },
      tamil: { roman: 'Athai Paiyan', script: 'அத்தை பையன்' },
      telugu: { roman: 'Menarikam', script: 'మేనరికం' },
      bengali: { roman: 'Maaser Bhai', script: 'মাসের ভাই' },
      marathi: { roman: 'Mavsacha Mulga', script: 'मावसाचा मुलगा' },
      gujarati: { roman: 'Masino Dikro', script: 'માસીનો દીકરો' },
      punjabi: { roman: 'Masera Bhai', script: 'ਮਸੇਰਾ ਭਰਾ' },
      urdu: { roman: 'Khaalazaad Bhai', script: 'خالہ زاد بھائی' },
      english: { roman: "Maternal Aunt's Son", script: "Cousin (maternal aunt)" },
    },
  },
  {
    key: 'phuphera_bhai', path: ['bua', 'son'], category: 'paternal', gender: 'male', generation: 0,
    terms: {
      hindi: { roman: 'Phuphera Bhai', script: 'फुफेरा भाई' },
      tamil: { roman: 'Athai Paiyan', script: 'அத்தை பையன்' },
      telugu: { roman: 'Attavaari Koduku', script: 'అత్తవారి కొడుకు' },
      bengali: { roman: 'Pisher Bhai', script: 'পিশের ভাই' },
      marathi: { roman: 'Atyacha Mulga', script: 'आत्याचा मुलगा' },
      gujarati: { roman: 'Foino Dikro', script: 'ફોઈનો દીકરો' },
      punjabi: { roman: 'Phupphera Bhai', script: 'ਫੁੱਫੇਰਾ ਭਰਾ' },
      urdu: { roman: 'Phupheezaad Bhai', script: 'پھوپھی زاد بھائی' },
      english: { roman: "Paternal Aunt's Son", script: "Cousin (paternal aunt)" },
    },
  },

  // ── NEPHEW / NIECE ──────────────────────────────────────────────────────────
  {
    key: 'bhatija', path: ['brother', 'son'], category: 'paternal', gender: 'male', generation: -1,
    terms: {
      hindi: { roman: 'Bhatija', script: 'भतीजा' },
      tamil: { roman: 'Annan/Thambi Magan', script: 'மருமகன்' },
      telugu: { roman: 'Menalludu', script: 'మేనల్లుడు' },
      bengali: { roman: 'Bhaipo', script: 'ভাইপো' },
      marathi: { roman: 'Putatnya', script: 'पुतण्या' },
      gujarati: { roman: 'Bhatijo', script: 'ભત્રીજો' },
      punjabi: { roman: 'Bhatija', script: 'ਭਤੀਜਾ' },
      urdu: { roman: 'Bhatija', script: 'بھتیجا' },
      english: { roman: "Brother's Son", script: "Nephew" },
    },
  },
  {
    key: 'bhanja', path: ['sister', 'son'], category: 'maternal', gender: 'male', generation: -1,
    terms: {
      hindi: { roman: 'Bhanja', script: 'भांजा' },
      tamil: { roman: 'Akka/Thangai Magan', script: 'மருமகன்' },
      telugu: { roman: 'Menalludu', script: 'మేనల్లుడు' },
      bengali: { roman: 'Bhaagne', script: 'ভাগ্নে' },
      marathi: { roman: 'Bhaacha', script: 'भाचा' },
      gujarati: { roman: 'Bhaanejo', script: 'ભાણેજ' },
      punjabi: { roman: 'Bhanja', script: 'ਭਾਣਜਾ' },
      urdu: { roman: 'Bhanja', script: 'بھانجا' },
      english: { roman: "Sister's Son", script: "Nephew" },
    },
  },

  // ── GRANDCHILDREN ───────────────────────────────────────────────────────────
  {
    key: 'pota', path: ['son', 'son'], category: 'grandchild', gender: 'male', generation: -2,
    terms: {
      hindi: { roman: 'Pota', script: 'पोता' },
      tamil: { roman: 'Peran', script: 'பேரன்' },
      telugu: { roman: 'Manavaralu', script: 'మనవరాలు' },
      bengali: { roman: 'Nati', script: 'নাতি' },
      marathi: { roman: 'Naat', script: 'नात' },
      gujarati: { roman: 'Potro', script: 'પૌત્ર' },
      punjabi: { roman: 'Potra', script: 'ਪੋਤਰਾ' },
      urdu: { roman: 'Pota', script: 'پوتا' },
      english: { roman: "Son's Son", script: "Grandson (paternal)" },
    },
  },
  {
    key: 'dohta', path: ['daughter', 'son'], category: 'grandchild', gender: 'male', generation: -2,
    terms: {
      hindi: { roman: 'Dohta / Naati', script: 'दोहता / नाती' },
      tamil: { roman: 'Peran', script: 'பேரன்' },
      telugu: { roman: 'Manavadu', script: 'మనవడు' },
      bengali: { roman: 'Nati', script: 'নাতি' },
      marathi: { roman: 'Naat', script: 'नात' },
      gujarati: { roman: 'Dohitro', script: 'દોહિત્ર' },
      punjabi: { roman: 'Dohtra', script: 'ਦੋਹਤਰਾ' },
      urdu: { roman: 'Nawasa', script: 'نواسہ' },
      english: { roman: "Daughter's Son", script: "Grandson (maternal)" },
    },
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// SUCCESSION RULES BY RELIGION & STATE
// ═══════════════════════════════════════════════════════════════════════════════

export interface SuccessionRule {
  religion: string
  applicableLaw: string
  heirClasses: { class: string; heirs: string[]; shareRule: string }[]
  specialRules?: string[]
  stateExceptions?: { state: string; rule: string }[]
}

export const SUCCESSION_RULES: SuccessionRule[] = [
  {
    religion: 'Hindu',
    applicableLaw: 'Hindu Succession Act 1956 (amended 2005)',
    heirClasses: [
      {
        class: 'Class I',
        heirs: ['Son', 'Daughter', 'Widow/Widower', 'Mother', "Son of pre-deceased son", "Daughter of pre-deceased son", "Son of pre-deceased daughter", "Daughter of pre-deceased daughter", "Widow of pre-deceased son"],
        shareRule: 'Equal share among all Class I heirs. Daughters have equal rights as sons (2005 amendment).',
      },
      {
        class: 'Class II',
        heirs: ['Father', "Son's daughter's son/daughter", 'Brother', 'Sister', "Daughter's son's son/daughter", "Father's father/mother", "Father's widow", "Brother's widow", "Father's brother/sister", "Mother's father/mother/brother/sister"],
        shareRule: 'Inherit only if NO Class I heirs exist. Priority within Class II entries.',
      },
      {
        class: 'Agnates',
        heirs: ['Relatives connected through males only'],
        shareRule: 'Inherit only if no Class I or Class II heirs.',
      },
      {
        class: 'Cognates',
        heirs: ['Relatives connected through females'],
        shareRule: 'Inherit only if no Class I, Class II, or Agnates.',
      },
    ],
    specialRules: [
      'Coparcenary: After 2005 amendment, daughters are coparceners in Hindu joint family property (HUF)',
      'Karta: Eldest male member manages HUF property, but daughters can now be Karta too',
      'Streedhan: Property gifted to a woman before/during/after marriage is her absolute property',
      'Self-acquired vs Ancestral: Self-acquired property can be willed freely; ancestral property follows succession rules',
    ],
    stateExceptions: [
      { state: 'Kerala', rule: 'Kerala Joint Hindu Family System (Abolition) Act 1975 — no joint family property, all individual' },
      { state: 'Goa', rule: 'Goa Civil Code — uniform succession for all religions, Portuguese-era law' },
      { state: 'Andhra Pradesh', rule: 'Hindu Succession (AP Amendment) Act 1986 — daughters equal rights even before 2005 central amendment' },
      { state: 'Tamil Nadu', rule: 'Hindu Succession (TN Amendment) Act 1989 — daughters equal rights before 2005' },
      { state: 'Karnataka', rule: 'Hindu Succession (Karnataka Amendment) Act 1994 — daughters equal rights before 2005' },
      { state: 'Maharashtra', rule: 'Hindu Succession (Maharashtra Amendment) Act 1994 — daughters equal rights before 2005' },
    ],
  },
  {
    religion: 'Muslim',
    applicableLaw: 'Muslim Personal Law (Shariat) Application Act 1937 / Quran',
    heirClasses: [
      {
        class: 'Sharers (Quranic Heirs)',
        heirs: ['Husband (1/4 or 1/2)', 'Wife (1/8 or 1/4)', 'Father (1/6)', 'Mother (1/6 or 1/3)', 'Daughter (1/2 or 2/3)', "Son's daughter (1/2 or 1/6)", 'Full sister (1/2 or 2/3)', 'Consanguine sister', 'Uterine brother/sister (1/6 or 1/3)'],
        shareRule: 'Fixed shares as prescribed in Quran. Remaining goes to Residuaries.',
      },
      {
        class: 'Residuaries (Asaba)',
        heirs: ['Son', 'Father', "Father's father", 'Full brother', 'Consanguine brother', "Full brother's son"],
        shareRule: 'Take remainder after Sharers. Male gets double the female share.',
      },
      {
        class: 'Distant Kindred',
        heirs: ["Daughter's children", "Sister's children", "Brother's daughters", 'Maternal uncle/aunt'],
        shareRule: 'Inherit only when no Sharers or Residuaries exist.',
      },
    ],
    specialRules: [
      'Cannot will more than 1/3 of estate (remaining 2/3 must follow Shariat)',
      'Sunni vs Shia: Different rules — Shia allows exclusion of distant relatives more strictly',
      'Mehr: Dower amount is wife\'s absolute right, paid before estate distribution',
      'No concept of joint family property — all property is individual',
    ],
  },
  {
    religion: 'Christian',
    applicableLaw: 'Indian Succession Act 1925',
    heirClasses: [
      {
        class: 'Primary',
        heirs: ['Spouse (1/3 of property)', 'Children (2/3 shared equally, sons = daughters)'],
        shareRule: 'Spouse gets 1/3, children share 2/3 equally. If no children, spouse gets 1/2, rest to kindred.',
      },
      {
        class: 'Kindred',
        heirs: ['Father', 'Mother', 'Brothers', 'Sisters', 'Grandparents'],
        shareRule: 'In order of proximity. Full blood preferred over half blood.',
      },
    ],
    specialRules: [
      'Full testamentary freedom — can will entire estate to anyone',
      'No distinction between ancestral and self-acquired property',
      'Applies to Parsis, Jews, and those not covered by Hindu or Muslim law',
    ],
    stateExceptions: [
      { state: 'Goa', rule: 'Goa Civil Code applies instead — community of property between spouses' },
      { state: 'Kerala', rule: 'Travancore Cochin Christian Succession Act for Syrian Christians — daughters get 1/4 of son\'s share (controversial, challenged in courts)' },
    ],
  },
  {
    religion: 'Parsi',
    applicableLaw: 'Indian Succession Act 1925 (Part V — Special Rules for Parsis)',
    heirClasses: [
      {
        class: 'Primary',
        heirs: ['Widow gets equal share as each child', 'Sons and daughters get equal shares', 'If no children, widow gets 1/2'],
        shareRule: 'Widow and each child get equal shares. No distinction between son and daughter.',
      },
    ],
    specialRules: [
      'Widow who remarries loses inheritance rights',
      'Full testamentary freedom',
      'If a Parsi marries outside the community, different rules may apply',
    ],
  },
  {
    religion: 'Sikh',
    applicableLaw: 'Hindu Succession Act 1956 (Sikhs are covered under Hindu law)',
    heirClasses: [
      { class: 'Same as Hindu', heirs: ['Same as Hindu Succession Act'], shareRule: 'Same rules as Hindu succession' },
    ],
    specialRules: ['Anand Marriage Act 1909 governs marriage, but succession follows Hindu law'],
  },
  {
    religion: 'Buddhist',
    applicableLaw: 'Hindu Succession Act 1956 (Buddhists are covered under Hindu law)',
    heirClasses: [
      { class: 'Same as Hindu', heirs: ['Same as Hindu Succession Act'], shareRule: 'Same rules as Hindu succession' },
    ],
  },
  {
    religion: 'Jain',
    applicableLaw: 'Hindu Succession Act 1956 (Jains are covered under Hindu law)',
    heirClasses: [
      { class: 'Same as Hindu', heirs: ['Same as Hindu Succession Act'], shareRule: 'Same rules as Hindu succession' },
    ],
  },
  {
    religion: 'Tribal',
    applicableLaw: 'Customary Law (varies by tribe and state)',
    heirClasses: [
      { class: 'Varies', heirs: ['Per tribal custom — often patrilineal, some matrilineal'], shareRule: 'No uniform rule. Governed by tribal customs recognized under Constitution Article 13(3)(a)' },
    ],
    specialRules: [
      'NE states (Meghalaya Khasi, Garo): Matrilineal — property passes through youngest daughter',
      'Scheduled Tribes in Jharkhand/Chhattisgarh: Customary patrilineal inheritance',
      'Constitution allows tribal customs to override general succession laws',
      'Hindu Succession Act specifically exempts Scheduled Tribes (Section 2(2))',
    ],
    stateExceptions: [
      { state: 'Meghalaya', rule: 'Khasi: Youngest daughter (ka khadduh) inherits ancestral property. Garo: Youngest daughter inherits.' },
      { state: 'Mizoram', rule: 'Mizo customary law — eldest son inherits, youngest son gets parental house' },
      { state: 'Nagaland', rule: 'Various tribal customs — generally patrilineal, clan-based' },
      { state: 'Arunachal Pradesh', rule: 'Varies by tribe — Adi, Nyishi, Apatani each have different rules' },
      { state: 'Jharkhand', rule: 'Santhals, Mundas, Oraons — patrilineal with tribal council adjudication' },
    ],
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// MATRILINEAL SYSTEMS (special case — Kerala, Meghalaya)
// ═══════════════════════════════════════════════════════════════════════════════

export const MATRILINEAL_SYSTEMS = [
  {
    name: 'Marumakkathayam',
    region: 'Kerala (Nairs, Ezhavas)',
    status: 'Abolished by Kerala Joint Hindu Family System (Abolition) Act 1975',
    rule: 'Property descended through the female line. Taravad (joint family house) owned by matrilineal family. Karanavar (eldest male) managed property but it belonged to the women.',
  },
  {
    name: 'Aliyasantana',
    region: 'Tuluva (Coastal Karnataka — Bunt community)',
    status: 'Largely abolished, some customs persist',
    rule: 'Similar to Marumakkathayam — matrilineal descent. Property through mother\'s line.',
  },
  {
    name: 'Khasi Matriliny',
    region: 'Meghalaya (Khasi tribe)',
    status: 'Still practiced',
    rule: 'Youngest daughter (ka khadduh) inherits ancestral home and land. Children take mother\'s surname. Maternal uncle (kñi) has authority. Husband moves to wife\'s house.',
  },
  {
    name: 'Garo Matriliny',
    region: 'Meghalaya (Garo tribe)',
    status: 'Still practiced',
    rule: 'Youngest daughter inherits. Nokma (husband of heiress) manages village. A-kim (clan property) passes matrilineally.',
  },
]

// ═══════════════════════════════════════════════════════════════════════════════
// LOOKUP FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

// Build path lookup map
const pathMap = new Map<string, RelationTerm>()
for (const r of RELATIONS) {
  pathMap.set(r.path.join('|'), r)
}

/**
 * Given a chain of relationship labels, find the Indian shortcut term
 */
export function resolveRelationship(labels: string[], language: Language = 'hindi') {
  const normalized = labels.map(l => l.toLowerCase().replace(/[^a-z_]/g, ''))
  const resolvedChain: { original: string; resolved: string; script: string }[] = []

  let i = 0
  while (i < normalized.length) {
    let matched = false

    for (let len = Math.min(4, normalized.length - i); len >= 1; len--) {
      const subPath = normalized.slice(i, i + len)
      const key = subPath.join('|')
      const relation = pathMap.get(key)

      if (relation) {
        const term = relation.terms[language] || relation.terms.hindi || relation.terms.english!
        resolvedChain.push({
          original: labels.slice(i, i + len).join("'s "),
          resolved: term.roman,
          script: term.script,
        })
        i += len
        matched = true
        break
      }
    }

    if (!matched) {
      resolvedChain.push({ original: labels[i], resolved: labels[i], script: labels[i] })
      i++
    }
  }

  // Full chain match
  const fullKey = normalized.join('|')
  const fullMatch = pathMap.get(fullKey)

  return {
    shortcut: fullMatch ? {
      key: fullMatch.key,
      terms: fullMatch.terms,
      category: fullMatch.category,
    } : null,
    resolvedChain,
  }
}

/**
 * Get relationship term in any language
 */
export function getRelationTerm(key: string, language: Language): { roman: string; script: string } | null {
  const relation = RELATIONS.find(r => r.key === key)
  if (!relation) return null
  return relation.terms[language] || relation.terms.hindi || null
}

/**
 * Get succession rules for a religion
 */
export function getSuccessionRules(religion: string, state?: string): SuccessionRule | null {
  const rule = SUCCESSION_RULES.find(r => r.religion.toLowerCase() === religion.toLowerCase())
  return rule || null
}

/**
 * Get all terms for a relation across all languages
 */
export function getAllLanguageTerms(key: string): Partial<Record<Language, { roman: string; script: string }>> | null {
  const relation = RELATIONS.find(r => r.key === key)
  return relation?.terms || null
}
