'use client'
import { useState, useRef, useMemo, useEffect, useCallback } from 'react'
import { Languages, Mic, MicOff, Volume2, Sparkles, Copy, Check, ChevronDown, ArrowLeftRight, Globe, BookOpen, Brain, Type, Hash, Lightbulb, Star, Download, HardDrive, Wifi, WifiOff, Trash2, RefreshCw, CheckCircle2 } from 'lucide-react'
import { LANGUAGE_ZONES } from '@/lib/library-data'
import { LANGUAGES, LANGUAGE_COUNT } from '@/lib/languages'

/* ── Language metadata — auto-generated from lib/languages.ts registry ── */
const REGION_FLAGS: Record<string, string> = {
  indian: '🇮🇳', south_asian: '🌏', western_europe: '🇪🇺', eastern_europe: '🇵🇱',
  scandinavia: '🇸🇪', middle_east: '🕌', east_asia: '🌏', southeast_asia: '🌏',
  central_asia: '🏜️', africa: '🌍', caucasus: '🏔️', balkans: '🇪🇺',
}

// Build LANG_META from the canonical LANGUAGES registry (98 languages)
// Map display names used in LANGUAGE_ZONES to registry keys
const DISPLAY_NAME_MAP: Record<string, string> = {
  'Mandarin Chinese': 'chinese_simplified',
  'Persian (Farsi)': 'persian',
}

const LANG_META: Record<string, { code: string; flag: string; native: string; script?: string }> = {}
for (const [key, lang] of Object.entries(LANGUAGES)) {
  LANG_META[lang.name] = {
    code: lang.googleCode,
    flag: REGION_FLAGS[lang.region] || '🌐',
    native: lang.nativeName,
    script: lang.script !== 'Latin' ? lang.script : undefined,
  }
}
// Add display name aliases used in LANGUAGE_ZONES
LANG_META['Mandarin Chinese'] = LANG_META['Chinese (Simplified)']
LANG_META['Persian (Farsi)'] = LANG_META['Persian']

const ZONE_TABS = Object.keys(LANGUAGE_ZONES)
type ZoneKey = keyof typeof LANGUAGE_ZONES

/* ── Offline Language Pack System (IndexedDB) ── */
const DB_NAME = 'curioushat_translator'
const DB_VERSION = 1
const STORE_CACHE = 'translation_cache'    // cached translations
const STORE_PACKS = 'language_packs'       // downloaded language packs with common phrases

// Common phrases that get pre-downloaded in a language pack
const PACK_PHRASES = [
  'Hello', 'Good morning', 'Good evening', 'Good night', 'Thank you', 'Please',
  'Yes', 'No', 'How are you?', 'I am fine', 'What is your name?', 'My name is',
  'Where is', 'How much', 'Sorry', 'Excuse me', 'Goodbye', 'See you later',
  'I love you', 'Help', 'Water', 'Food', 'School', 'Teacher', 'Student',
  'Book', 'Read', 'Write', 'Learn', 'Study', 'Class', 'Exam', 'Mathematics',
  'Science', 'History', 'English', 'Computer', 'Library', 'Welcome',
  'I don\'t understand', 'Can you help me?', 'Where is the school?',
  'What time is it?', 'I am learning this language', 'Good luck',
  'Happy birthday', 'Congratulations', 'Well done', 'Very good',
  'I love learning new languages', 'Where is the library?',
  'Good morning, teacher', 'Thank you very much', 'What is your name?',
  'Numbers: one, two, three, four, five, six, seven, eight, nine, ten',
  'Days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday',
  'Colors: red, blue, green, yellow, white, black, orange, purple, pink',
  'Family: mother, father, brother, sister, son, daughter, grandfather, grandmother',
  'Body: head, eyes, ears, nose, mouth, hand, foot, heart',
  'Animals: dog, cat, bird, fish, cow, horse, elephant, lion, tiger',
  'Food: rice, bread, milk, water, tea, fruit, vegetable, egg, chicken',
  'School subjects: Mathematics, Science, English, History, Geography, Art, Music',
  'Greetings for different times of day',
  'Common classroom instructions',
  'Basic questions for daily conversation',
  'Emergency phrases',
]

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION)
    req.onupgradeneeded = () => {
      const db = req.result
      if (!db.objectStoreNames.contains(STORE_CACHE)) {
        db.createObjectStore(STORE_CACHE) // key = "srcCode:tgtCode:text"
      }
      if (!db.objectStoreNames.contains(STORE_PACKS)) {
        db.createObjectStore(STORE_PACKS) // key = langCode
      }
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function getCachedTranslation(srcCode: string, tgtCode: string, text: string): Promise<string | null> {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_CACHE, 'readonly')
    const store = tx.objectStore(STORE_CACHE)
    const key = `${srcCode}:${tgtCode}:${text.toLowerCase().trim()}`
    return new Promise((resolve) => {
      const req = store.get(key)
      req.onsuccess = () => resolve(req.result || null)
      req.onerror = () => resolve(null)
    })
  } catch { return null }
}

async function setCachedTranslation(srcCode: string, tgtCode: string, text: string, translation: string): Promise<void> {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_CACHE, 'readwrite')
    const store = tx.objectStore(STORE_CACHE)
    const key = `${srcCode}:${tgtCode}:${text.toLowerCase().trim()}`
    store.put(translation, key)
  } catch { /* silent */ }
}

interface PackInfo {
  lang: string
  code: string
  downloadedAt: number
  phraseCount: number
  sizeKB: number
}

async function getInstalledPacks(): Promise<Record<string, PackInfo>> {
  try {
    const db = await openDB()
    const tx = db.transaction(STORE_PACKS, 'readonly')
    const store = tx.objectStore(STORE_PACKS)
    return new Promise((resolve) => {
      const req = store.getAll()
      const keyReq = store.getAllKeys()
      req.onsuccess = () => {
        const packs: Record<string, PackInfo> = {}
        const values = req.result
        keyReq.onsuccess = () => {
          const keys = keyReq.result
          keys.forEach((k, i) => { packs[k as string] = values[i] })
          resolve(packs)
        }
        keyReq.onerror = () => resolve({})
      }
      req.onerror = () => resolve({})
    })
  } catch { return {} }
}

async function downloadLanguagePack(
  langName: string, langCode: string, srcCode: string,
  onProgress: (pct: number) => void
): Promise<PackInfo> {
  const phrases = PACK_PHRASES
  const batchSize = 5
  let done = 0

  for (let i = 0; i < phrases.length; i += batchSize) {
    const batch = phrases.slice(i, i + batchSize)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: batch.join('\n|||SPLIT|||\n'),
          source: srcCode,
          targets: [{ lang: langName, code: langCode }],
        }),
      })
      if (res.ok) {
        const data = await res.json()
        const joined = data.translations?.[langName] || ''
        const parts = joined.split('|||SPLIT|||').map((s: string) => s.trim())
        // Cache each phrase individually
        for (let j = 0; j < batch.length; j++) {
          const translated = parts[j] || batch[j]
          await setCachedTranslation(srcCode, langCode, batch[j], translated)
          // Also cache the reverse
          await setCachedTranslation(langCode, srcCode, translated, batch[j])
        }
      }
    } catch { /* continue with next batch */ }
    done += batch.length
    onProgress(Math.min(100, Math.round((done / phrases.length) * 100)))
  }

  const packInfo: PackInfo = {
    lang: langName,
    code: langCode,
    downloadedAt: Date.now(),
    phraseCount: phrases.length,
    sizeKB: estSize(langCode),
  }

  // Save pack metadata
  const db = await openDB()
  const tx = db.transaction(STORE_PACKS, 'readwrite')
  tx.objectStore(STORE_PACKS).put(packInfo, langCode)

  return packInfo
}

async function deleteLanguagePack(langCode: string): Promise<void> {
  try {
    const db = await openDB()
    // Delete pack metadata
    const tx1 = db.transaction(STORE_PACKS, 'readwrite')
    tx1.objectStore(STORE_PACKS).delete(langCode)
    // Delete cached translations for this language
    const tx2 = db.transaction(STORE_CACHE, 'readwrite')
    const store = tx2.objectStore(STORE_CACHE)
    const req = store.openCursor()
    req.onsuccess = () => {
      const cursor = req.result
      if (cursor) {
        const key = cursor.key as string
        if (key.includes(`:${langCode}:`)) cursor.delete()
        cursor.continue()
      }
    }
  } catch { /* silent */ }
}

/* ── Estimated pack sizes (KB) by script complexity ── */
const PACK_SIZE_EST: Record<string, number> = {
  // CJK scripts — larger due to multi-byte characters
  'zh-CN': 42, ja: 45, ko: 38,
  // Arabic/Persian/Hebrew — RTL scripts
  ar: 32, fa: 34, he: 30,
  // Indic scripts — moderate
  hi: 28, bn: 30, mr: 28, te: 32, ta: 34, gu: 30, kn: 32, ml: 34, pa: 28, or: 30,
  // Cyrillic
  ru: 26, uk: 26,
  // Thai/Vietnamese — tonal diacritics
  th: 30, vi: 22,
  // Latin scripts — smallest
  en: 18, fr: 20, es: 20, de: 22, pt: 20, it: 20, pl: 22, ro: 20, nl: 20, el: 24,
  id: 18, ms: 18, tr: 20, sw: 18, sv: 20,
}
function estSize(code: string): number { return PACK_SIZE_EST[code] || 24 }

/* ── Level 1: 700 Common Words — Chapter-wise Beginner Training ── */
interface WordChapter { title: string; emoji: string; words: string[] }

const BEGINNER_CHAPTERS: WordChapter[] = [
  { title: 'Greetings & Basics', emoji: '👋', words: [
    'Hello','Hi','Good morning','Good afternoon','Good evening','Good night','Goodbye','Bye',
    'See you','Welcome','Please','Thank you','Thanks','Sorry','Excuse me','Yes','No','Maybe',
    'OK','Of course','Sure','Really','Wow','Great','Nice','Fine','Well','Help','Stop','Wait',
  ]},
  { title: 'Self Introduction', emoji: '🙋', words: [
    'I','Me','My','You','Your','He','She','It','We','They','Name','Age','Boy','Girl','Man',
    'Woman','Friend','Person','People','Who','What','Where','When','Why','How','This','That',
    'Here','There','Am','Is','Are',
  ]},
  { title: 'Numbers & Counting', emoji: '🔢', words: [
    'One','Two','Three','Four','Five','Six','Seven','Eight','Nine','Ten','Eleven','Twelve',
    'Thirteen','Fourteen','Fifteen','Sixteen','Seventeen','Eighteen','Nineteen','Twenty',
    'Thirty','Forty','Fifty','Sixty','Seventy','Eighty','Ninety','Hundred','Thousand','Million',
    'First','Second','Third','Last','Half','Zero',
  ]},
  { title: 'Days & Time', emoji: '📅', words: [
    'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday','Today','Tomorrow',
    'Yesterday','Morning','Afternoon','Evening','Night','Day','Week','Month','Year','Hour',
    'Minute','Second','Time','Clock','Calendar','Now','Soon','Later','Early','Late','Always',
    'Never','Sometimes','Often','Usually',
  ]},
  { title: 'Colours & Shapes', emoji: '🎨', words: [
    'Red','Blue','Green','Yellow','Orange','Purple','Pink','Brown','Black','White','Grey',
    'Gold','Silver','Light','Dark','Bright','Circle','Square','Triangle','Star','Heart',
    'Line','Point','Round','Straight','Big','Small','Long','Short','Tall',
  ]},
  { title: 'Family & Relationships', emoji: '👨‍👩‍👧‍👦', words: [
    'Mother','Father','Sister','Brother','Son','Daughter','Baby','Child','Children','Parent',
    'Grandmother','Grandfather','Uncle','Aunt','Cousin','Husband','Wife','Family','Love',
    'Home','House','Together','Marry','Born','Old','Young','Elder','Twin','Nephew','Niece',
  ]},
  { title: 'Body & Health', emoji: '🧑‍⚕️', words: [
    'Head','Face','Eye','Ear','Nose','Mouth','Tooth','Tongue','Hair','Neck','Shoulder','Arm',
    'Hand','Finger','Chest','Back','Stomach','Leg','Knee','Foot','Toe','Heart','Brain','Blood',
    'Bone','Skin','Healthy','Sick','Pain','Doctor','Medicine','Hospital',
  ]},
  { title: 'Food & Drink', emoji: '🍽️', words: [
    'Water','Milk','Tea','Coffee','Juice','Rice','Bread','Egg','Chicken','Fish','Meat',
    'Fruit','Apple','Banana','Mango','Orange','Vegetable','Potato','Onion','Tomato','Salt',
    'Sugar','Oil','Butter','Cheese','Soup','Cake','Chocolate','Hungry','Thirsty','Eat','Drink',
    'Cook','Breakfast','Lunch','Dinner','Meal',
  ]},
  { title: 'Animals & Nature', emoji: '🦁', words: [
    'Dog','Cat','Bird','Fish','Cow','Horse','Elephant','Lion','Tiger','Monkey','Rabbit','Snake',
    'Frog','Butterfly','Ant','Bee','Tree','Flower','Grass','Leaf','River','Mountain','Sea',
    'Ocean','Rain','Sun','Moon','Star','Cloud','Wind','Sky','Earth','Forest','Garden',
  ]},
  { title: 'School & Education', emoji: '🏫', words: [
    'School','Class','Classroom','Teacher','Student','Book','Pen','Pencil','Paper','Notebook',
    'Desk','Chair','Board','Chalk','Eraser','Bag','Uniform','Homework','Exam','Test','Study',
    'Learn','Read','Write','Draw','Count','Question','Answer','Lesson','Subject','Library',
    'Knowledge','Smart','Pass','Fail',
  ]},
  { title: 'Home & Objects', emoji: '🏠', words: [
    'House','Room','Door','Window','Wall','Floor','Roof','Bed','Table','Chair','Lamp','Light',
    'Fan','Kitchen','Bathroom','Garden','Key','Lock','Phone','Computer','Television','Clock',
    'Mirror','Picture','Bottle','Cup','Plate','Spoon','Fork','Knife','Towel','Soap',
  ]},
  { title: 'Clothing & Appearance', emoji: '👔', words: [
    'Shirt','Pants','Dress','Skirt','Coat','Jacket','Sweater','Shoes','Socks','Hat','Scarf',
    'Gloves','Belt','Tie','Pocket','Button','Cloth','Cotton','Silk','Wool','Beautiful',
    'Handsome','Ugly','Clean','Dirty','New','Old','Wear','Wash','Iron',
  ]},
  { title: 'Travel & Places', emoji: '✈️', words: [
    'Road','Street','City','Village','Town','Country','Map','North','South','East','West',
    'Left','Right','Straight','Turn','Bus','Train','Car','Bicycle','Airplane','Ship','Station',
    'Airport','Hotel','Restaurant','Market','Shop','Bank','Hospital','Temple','Church','Mosque',
    'Park','Bridge',
  ]},
  { title: 'Weather & Seasons', emoji: '🌤️', words: [
    'Hot','Cold','Warm','Cool','Rain','Snow','Wind','Storm','Cloud','Fog','Ice','Dry','Wet',
    'Summer','Winter','Spring','Autumn','Season','Temperature','Sunny','Cloudy','Rainy',
    'Thunder','Lightning','Flood','Drought','Degree','Freeze','Melt',
  ]},
  { title: 'Actions & Verbs', emoji: '🏃', words: [
    'Go','Come','Run','Walk','Sit','Stand','Sleep','Wake','Open','Close','Give','Take','Buy',
    'Sell','Make','Break','Build','Cut','Push','Pull','Carry','Hold','Throw','Catch','Jump',
    'Fly','Swim','Climb','Fall','Hit','Touch','Feel','Think','Know','Remember','Forget',
    'Speak','Listen','Look','See','Hear','Smell','Taste','Try','Start','Stop','Finish','Win',
    'Lose','Play','Work','Dance','Sing',
  ]},
  { title: 'Feelings & Emotions', emoji: '😊', words: [
    'Happy','Sad','Angry','Afraid','Scared','Surprised','Excited','Tired','Bored','Lonely',
    'Proud','Shy','Nervous','Calm','Brave','Kind','Rude','Honest','Funny','Serious','Worry',
    'Hope','Love','Hate','Like','Dislike','Enjoy','Cry','Laugh','Smile',
  ]},
  { title: 'Common Phrases', emoji: '💬', words: [
    'How are you?','I am fine','What is your name?','Nice to meet you','Where are you from?',
    'I don\'t understand','Can you help me?','How much does this cost?','Where is the bathroom?',
    'I am hungry','I am thirsty','I am tired','I am lost','What time is it?',
    'Happy birthday','Congratulations','Good luck','Well done','I love learning',
    'See you tomorrow','Have a nice day','Take care','No problem','You\'re welcome',
    'I agree','I disagree','Let\'s go','Come here','Sit down','Stand up',
  ]},
  { title: 'Classroom Commands', emoji: '📝', words: [
    'Open your book','Close your book','Listen carefully','Repeat after me','Write this down',
    'Read aloud','Be quiet','Raise your hand','Come to the board','Go back to your seat',
    'Work in pairs','Work in groups','Do the exercise','Check your answers','Pay attention',
    'Turn to page','Copy this','Underline this','Circle the answer','Very good','Well done',
    'Try again','Practice more','Do your homework','Submit your work',
  ]},

  // ═══════════════════════════════════════════════════════════
  // SENTENCES (200+) — for translation practice
  // ═══════════════════════════════════════════════════════════
  { title: 'Daily Greetings & Introductions', emoji: '🤝', words: [
    'Good morning, how are you today?','My name is Om and I am a student','Nice to meet you, where are you from?',
    'I live in India with my family','What do you do for a living?','I am learning a new language',
    'How old are you?','I am fifteen years old','This is my first day at school',
    'Please tell me about yourself','I come from a small village','She is my best friend',
    'He works as a teacher','We are classmates','They are from Japan',
  ]},
  { title: 'At School & Classroom', emoji: '🏫', words: [
    'The teacher is explaining the lesson','Please open your textbook to page twenty','I forgot my homework at home',
    'Can I borrow your pen?','The exam will be held next Monday','I scored ninety percent in Mathematics',
    'Our school has a big library','The science lab is on the second floor','We have a holiday tomorrow',
    'The principal gave a speech today','I need to study for the test','The bell has rung, class is over',
    'May I go to the bathroom?','The homework is very difficult','We have Physical Education after lunch',
  ]},
  { title: 'Family & Home Life', emoji: '🏡', words: [
    'My mother cooks delicious food','My father goes to work every morning','I have one brother and two sisters',
    'My grandmother tells us stories at night','We eat dinner together as a family','My grandfather is eighty years old',
    'I help my mother in the kitchen','My brother is younger than me','We live in a two-bedroom apartment',
    'My uncle visits us every weekend','The baby is sleeping in the room','We celebrate festivals together',
    'My parents are very kind','I love spending time with my family','Our house has a small garden',
  ]},
  { title: 'Food & Eating', emoji: '🍛', words: [
    'I am very hungry, let us eat','What would you like for breakfast?','Rice and dal is my favourite meal',
    'Can I have a glass of water please?','The food is very spicy','I like mangoes more than apples',
    'She is cooking biryani today','We should eat more vegetables','Tea or coffee, which do you prefer?',
    'The restaurant is closed today','I do not eat meat, I am vegetarian','Let us order some pizza tonight',
    'Wash your hands before eating','The milk has gone bad','I will make chai for everyone',
  ]},
  { title: 'Shopping & Money', emoji: '🛒', words: [
    'How much does this cost?','This is too expensive for me','Can you give me a discount?',
    'I want to buy a new notebook','Where is the nearest market?','I need to withdraw money from the bank',
    'Do you accept credit cards?','Keep the change','The shop opens at ten in the morning',
    'I am just looking, thank you','This shirt is the wrong size','Can I try this on?',
    'I bought vegetables from the market','The price has increased a lot','I need to save more money',
  ]},
  { title: 'Travel & Directions', emoji: '🗺️', words: [
    'How do I get to the railway station?','Turn left at the next signal','The bus stop is two hundred metres ahead',
    'I need a ticket to Delhi please','What time does the train arrive?','The flight has been delayed by two hours',
    'Can you show me on the map?','I am lost, can you help me?','How far is the airport from here?',
    'We should take an auto rickshaw','The traffic is very heavy today','Drive carefully, the road is wet',
    'Which platform does the Mumbai train leave from?','I booked a hotel near the beach','We will reach there by evening',
  ]},
  { title: 'Health & Body', emoji: '🏥', words: [
    'I have a headache and fever','The doctor said I need rest','Take this medicine twice a day',
    'I need to drink more water','My throat is sore and painful','She broke her arm while playing',
    'The hospital is on the main road','I feel dizzy and weak','Eat healthy food and exercise daily',
    'The dentist will see you at three','I am allergic to peanuts','Wash your hands with soap',
    'He has been sick for three days','I need to visit the eye doctor','Regular exercise keeps you healthy',
  ]},
  { title: 'Weather & Nature', emoji: '⛅', words: [
    'It is raining heavily outside','The weather is very hot today','Winter is my favourite season',
    'The flowers are blooming in spring','Do not forget to carry an umbrella','The river is flowing very fast',
    'Snow has covered the mountains','The sun rises in the east','There are dark clouds in the sky',
    'The wind is blowing strongly','Today is a beautiful sunny day','The temperature is forty degrees',
    'Monsoon season starts in June','The garden looks green after the rain','Stars are shining brightly tonight',
  ]},
  { title: 'Technology & Internet', emoji: '📱', words: [
    'I need to charge my phone','The internet is not working today','Can you send me that file by email?',
    'I learned coding on the computer','This app is very useful for students','My laptop battery is low',
    'Search for the answer on Google','I will call you on video','The website is loading very slowly',
    'Take a photo with your camera','I posted a picture on social media','The printer is out of paper',
    'Download the app from the store','Turn off your phone during class','AI is changing education forever',
  ]},
  { title: 'Sports & Games', emoji: '⚽', words: [
    'Cricket is the most popular sport in India','I play football every evening','She won the gold medal in swimming',
    'The match starts at four o clock','Our team scored three goals','I like watching tennis on television',
    'He is the captain of our team','Practice makes you a better player','The stadium was full of spectators',
    'I run two kilometres every morning','Badminton is my favourite indoor game','The Olympics happen every four years',
    'She is training for the marathon','Let us play a game of chess','The referee blew the whistle',
  ]},
  { title: 'Feelings & Expressions', emoji: '💭', words: [
    'I am very happy today','She looks sad, what happened?','Do not be afraid, I am here',
    'I am excited about the trip','He is angry because he lost the game','I feel lonely without my friends',
    'Thank you for being so kind','I am proud of your achievement','I am nervous about the exam',
    'She was surprised by the gift','I feel grateful for your help','Do not worry, everything will be fine',
    'I am bored, let us do something fun','He is very brave and strong','I miss my old school friends',
  ]},
  { title: 'Jobs & Professions', emoji: '👷', words: [
    'My father is an engineer','She wants to become a doctor','The teacher teaches us every day',
    'Police officers keep us safe','Farmers grow food for everyone','The pilot flies the airplane',
    'He is a software developer','Nurses take care of patients','The lawyer argued in the court',
    'She is a famous singer','The carpenter made a wooden table','I want to become a scientist',
    'Firefighters are very brave people','The chef prepared a delicious meal','Astronauts travel to outer space',
  ]},
  { title: 'Indian Culture & Festivals', emoji: '🪔', words: [
    'Diwali is the festival of lights','We celebrate Holi with colours','Eid Mubarak to everyone',
    'Christmas is on twenty fifth December','Pongal is a harvest festival in Tamil Nadu','We visit the temple every morning',
    'Raksha Bandhan celebrates brother and sister bond','Independence Day is on fifteenth August',
    'Ganesh Chaturthi is celebrated with great joy','Durga Puja is famous in West Bengal',
    'Baisakhi marks the Punjabi new year','Onam is the harvest festival of Kerala',
    'Navratri lasts for nine nights','Republic Day is on twenty sixth January','Makar Sankranti celebrates the harvest season',
  ]},
  { title: 'Environment & Earth', emoji: '🌱', words: [
    'We should plant more trees','Pollution is a big problem in cities','Save water, every drop counts',
    'Reduce, reuse and recycle waste','The ozone layer protects us from the sun','Global warming is melting the glaciers',
    'Solar energy is clean and renewable','Do not throw garbage on the road','The forest is home to many animals',
    'Rivers are getting polluted by factories','We should use public transport more','Electric vehicles reduce air pollution',
    'Plastic is harmful to the ocean','Compost your kitchen waste at home','Earth Day is celebrated on April twenty second',
  ]},
]

const TOTAL_WORDS = BEGINNER_CHAPTERS.reduce((s, c) => s + c.words.length, 0)

/* ── Level 2: Language Book Sample Sentences ── */
const LANG_BOOK_SENTENCES: Record<string, string[]> = {
  Hindi: ['मेरा नाम क्या है?','यह किताब बहुत अच्छी है','मुझे पानी चाहिए','आज मौसम अच्छा है','कृपया दरवाज़ा बंद करें','मैं स्कूल जाता हूँ','आपका घर कहाँ है?','समय क्या हुआ है?'],
  Bengali: ['আমার নাম কী?','এই বইটি খুব ভালো','আমার জল দরকার','আজ আবহাওয়া ভালো','দয়া করে দরজা বন্ধ করুন','আমি স্কুলে যাই','আপনার বাড়ি কোথায়?','সময় কত হলো?'],
  Tamil: ['என் பெயர் என்ன?','இந்த புத்தகம் மிகவும் நல்லது','எனக்கு தண்ணீர் வேண்டும்','இன்று வானிலை நன்றாக இருக்கிறது','தயவுசெய்து கதவை மூடுங்கள்','நான் பள்ளிக்கு செல்கிறேன்'],
  Telugu: ['నా పేరు ఏమిటి?','ఈ పుస్తకం చాలా మంచిది','నాకు నీళ్ళు కావాలి','ఈ రోజు వాతావరణం బాగుంది','దయచేసి తలుపు మూయండి','నేను బడికి వెళ్తాను'],
  French: ['Comment vous appelez-vous?','Ce livre est très bon','J\'ai besoin d\'eau','Il fait beau aujourd\'hui','Fermez la porte s\'il vous plaît','Je vais à l\'école','Où habitez-vous?','Quelle heure est-il?'],
  Spanish: ['¿Cómo te llamas?','Este libro es muy bueno','Necesito agua','Hoy hace buen tiempo','Por favor cierra la puerta','Voy a la escuela','¿Dónde vives?','¿Qué hora es?'],
  German: ['Wie heißen Sie?','Dieses Buch ist sehr gut','Ich brauche Wasser','Das Wetter ist heute schön','Bitte schließen Sie die Tür','Ich gehe zur Schule','Wo wohnen Sie?','Wie spät ist es?'],
  Japanese: ['お名前は何ですか？','この本はとても良いです','水が必要です','今日は天気が良いです','ドアを閉めてください','学校に行きます','お住まいはどちらですか？','今何時ですか？'],
  Korean: ['이름이 뭐예요?','이 책은 매우 좋습니다','물이 필요합니다','오늘 날씨가 좋습니다','문을 닫아 주세요','학교에 갑니다','어디에 사세요?','지금 몇 시예요?'],
  'Mandarin Chinese': ['你叫什么名字？','这本书很好','我需要水','今天天气很好','请关门','我去上学','你住在哪里？','现在几点了？'],
  Arabic: ['ما اسمك؟','هذا الكتاب جيد جداً','أحتاج ماء','الطقس جميل اليوم','أغلق الباب من فضلك','أذهب إلى المدرسة','أين تسكن؟','كم الساعة الآن؟'],
  Russian: ['Как вас зовут?','Эта книга очень хорошая','Мне нужна вода','Сегодня хорошая погода','Пожалуйста, закройте дверь','Я хожу в школу','Где вы живёте?','Который час?'],
  Portuguese: ['Como você se chama?','Este livro é muito bom','Eu preciso de água','Hoje o tempo está bom','Por favor feche a porta','Eu vou para a escola','Onde você mora?','Que horas são?'],
  Italian: ['Come ti chiami?','Questo libro è molto buono','Ho bisogno di acqua','Oggi il tempo è bello','Per favore chiudi la porta','Vado a scuola','Dove abiti?','Che ore sono?'],
  Turkish: ['Adınız ne?','Bu kitap çok iyi','Suya ihtiyacım var','Bugün hava güzel','Lütfen kapıyı kapatın','Okula gidiyorum','Nerede oturuyorsunuz?','Saat kaç?'],
  Swahili: ['Jina lako ni nani?','Kitabu hiki ni kizuri sana','Ninahitaji maji','Leo hali ya hewa ni nzuri','Tafadhali funga mlango','Ninakwenda shuleni','Unaishi wapi?','Saa ngapi sasa?'],
  English: ['What is your name?','This book is very good','I need water','The weather is nice today','Please close the door','I go to school','Where do you live?','What time is it?'],
  Marathi: ['तुमचं नाव काय?','हे पुस्तक खूप चांगलं आहे','मला पाणी हवं','आज हवामान छान आहे','कृपया दार बंद करा','मी शाळेत जातो'],
  Gujarati: ['તમારું નામ શું છે?','આ પુસ્તક ખૂબ સારું છે','મને પાણી જોઈએ છે','આજે હવામાન સારું છે','કૃપા કરીને દરવાજો બંધ કરો','હું શાળાએ જાઉં છું'],
  Kannada: ['ನಿಮ್ಮ ಹೆಸರು ಏನು?','ಈ ಪುಸ್ತಕ ತುಂಬಾ ಒಳ್ಳೆಯದು','ನನಗೆ ನೀರು ಬೇಕು','ಇಂದು ಹವಾಮಾನ ಚೆನ್ನಾಗಿದೆ','ದಯವಿಟ್ಟು ಬಾಗಿಲು ಮುಚ್ಚಿ','ನಾನು ಶಾಲೆಗೆ ಹೋಗುತ್ತೇನೆ'],
  Malayalam: ['നിങ്ങളുടെ പേര് എന്താണ്?','ഈ പുസ്തകം വളരെ നല്ലതാണ്','എനിക്ക് വെള്ളം വേണം','ഇന്ന് കാലാവസ്ഥ നല്ലതാണ്','ദയവായി വാതിൽ അടയ്ക്കുക','ഞാൻ സ്കൂളിൽ പോകുന്നു'],
  Punjabi: ['ਤੁਹਾਡਾ ਨਾਮ ਕੀ ਹੈ?','ਇਹ ਕਿਤਾਬ ਬਹੁਤ ਵਧੀਆ ਹੈ','ਮੈਨੂੰ ਪਾਣੀ ਚਾਹੀਦਾ ਹੈ','ਅੱਜ ਮੌਸਮ ਵਧੀਆ ਹੈ','ਕਿਰਪਾ ਕਰਕੇ ਦਰਵਾਜ਼ਾ ਬੰਦ ਕਰੋ','ਮੈਂ ਸਕੂਲ ਜਾਂਦਾ ਹਾਂ'],
  Odia: ['ଆପଣଙ୍କ ନାମ କ\'ଣ?','ଏହି ବହିଟି ବହୁତ ଭଲ','ମୋତେ ପାଣି ଦରକାର','ଆଜି ପାଣିପାଗ ଭଲ ଅଛି','ଦୟାକରି କବାଟ ବନ୍ଦ କରନ୍ତୁ','ମୁଁ ସ୍କୁଲକୁ ଯାଏ'],
  Vietnamese: ['Bạn tên là gì?','Cuốn sách này rất hay','Tôi cần nước','Hôm nay thời tiết đẹp','Xin hãy đóng cửa','Tôi đi học','Bạn sống ở đâu?','Mấy giờ rồi?'],
  Thai: ['คุณชื่ออะไร?','หนังสือเล่มนี้ดีมาก','ฉันต้องการน้ำ','วันนี้อากาศดี','กรุณาปิดประตู','ฉันไปโรงเรียน','คุณอยู่ที่ไหน?','ตอนนี้กี่โมง?'],
  Indonesian: ['Siapa nama Anda?','Buku ini sangat bagus','Saya butuh air','Cuaca hari ini bagus','Tolong tutup pintunya','Saya pergi ke sekolah','Di mana Anda tinggal?','Jam berapa sekarang?'],
  Polish: ['Jak masz na imię?','Ta książka jest bardzo dobra','Potrzebuję wody','Dzisiaj jest ładna pogoda','Proszę zamknąć drzwi','Chodzę do szkoły','Gdzie mieszkasz?','Która jest godzina?'],
  Ukrainian: ['Як вас звати?','Ця книга дуже хороша','Мені потрібна вода','Сьогодні гарна погода','Будь ласка, зачиніть двері','Я ходжу до школи','Де ви живете?','Котра година?'],
  Dutch: ['Hoe heet u?','Dit boek is erg goed','Ik heb water nodig','Het weer is vandaag mooi','Sluit alstublieft de deur','Ik ga naar school','Waar woont u?','Hoe laat is het?'],
  Swedish: ['Vad heter du?','Den här boken är mycket bra','Jag behöver vatten','Vädret är fint idag','Vänligen stäng dörren','Jag går till skolan','Var bor du?','Vad är klockan?'],
  Greek: ['Πώς σε λένε;','Αυτό το βιβλίο είναι πολύ καλό','Χρειάζομαι νερό','Σήμερα ο καιρός είναι ωραίος','Παρακαλώ κλείστε την πόρτα','Πηγαίνω σχολείο','Πού μένεις;','Τι ώρα είναι;'],
  Romanian: ['Cum te cheamă?','Această carte este foarte bună','Am nevoie de apă','Astăzi vremea este frumoasă','Vă rog închideți ușa','Merg la școală','Unde locuiești?','Cât este ceasul?'],
  Hebrew: ['?מה שמך','הספר הזה מאוד טוב','אני צריך מים','היום מזג האוויר יפה','בבקשה סגור את הדלת','אני הולך לבית הספר','?איפה אתה גר','?מה השעה'],
  'Persian (Farsi)': ['اسم شما چیست؟','این کتاب بسیار خوب است','من آب نیاز دارم','امروز هوا خوب است','لطفاً در را ببندید','من به مدرسه می‌روم','کجا زندگی می‌کنید؟','ساعت چند است؟'],
  Malay: ['Siapa nama awak?','Buku ini sangat bagus','Saya perlukan air','Cuaca hari ini baik','Sila tutup pintu','Saya pergi ke sekolah','Awak tinggal di mana?','Pukul berapa sekarang?'],
}

/* ── Level 3: Subject Key Terms ── */
const SUBJECT_TERMS = [
  { emoji: '📐', subject: 'Mathematics', terms: ['Addition','Subtraction','Multiplication','Division','Fraction','Decimal','Percentage','Algebra','Geometry','Triangle','Circle','Square','Angle','Equation','Graph','Probability','Area','Volume','Perimeter','Ratio','Integer','Matrix','Calculus','Theorem'] },
  { emoji: '⚡', subject: 'Physics', terms: ['Force','Energy','Mass','Velocity','Acceleration','Gravity','Friction','Momentum','Pressure','Temperature','Electricity','Magnetism','Frequency','Wavelength','Optics','Lens','Mirror','Current','Voltage','Resistance','Newton','Joule','Watt','Atom'] },
  { emoji: '🧪', subject: 'Chemistry', terms: ['Element','Compound','Mixture','Atom','Molecule','Electron','Proton','Neutron','Acid','Base','Salt','Reaction','Oxidation','Reduction','Solution','Concentration','Periodic Table','Metal','Non-metal','Bond','Valency','Catalyst','pH','Gas'] },
  { emoji: '🌿', subject: 'Biology', terms: ['Cell','Tissue','Organ','Organism','Photosynthesis','Respiration','Digestion','Skeleton','Muscle','Nerve','Blood','Heart','Lung','Kidney','Liver','DNA','Gene','Chromosome','Evolution','Ecosystem','Habitat','Species','Bacteria','Virus'] },
  { emoji: '🏛️', subject: 'History', terms: ['Civilization','Empire','Dynasty','Revolution','Independence','Constitution','Democracy','Monarchy','War','Treaty','Colony','Ancient','Medieval','Modern','Culture','Trade','Migration','Reform','Nationalism','Freedom','Parliament','Republic','Invasion','Archaeology'] },
  { emoji: '🌍', subject: 'Geography', terms: ['Continent','Ocean','River','Mountain','Valley','Desert','Forest','Climate','Weather','Latitude','Longitude','Equator','Hemisphere','Population','Urbanization','Agriculture','Mineral','Earthquake','Volcano','Erosion','Glacier','Plateau','Island','Peninsula'] },
  { emoji: '📈', subject: 'Economics', terms: ['Supply','Demand','Market','Price','Inflation','GDP','Tax','Budget','Trade','Export','Import','Investment','Savings','Bank','Currency','Profit','Loss','Industry','Agriculture','Service','Employment','Poverty','Development','Subsidy'] },
  { emoji: '💻', subject: 'Computer Science', terms: ['Algorithm','Program','Variable','Function','Loop','Array','Database','Network','Internet','Browser','Server','Client','Binary','Software','Hardware','Processor','Memory','Storage','Encryption','Cloud','Artificial Intelligence','Machine Learning','Data','Code'] },
  { emoji: '⚖️', subject: 'Political Science', terms: ['Democracy','Constitution','Parliament','Legislature','Executive','Judiciary','Election','Vote','Citizen','Rights','Duties','Law','Justice','Federal','State','President','Prime Minister','Cabinet','Opposition','Amendment','Sovereignty','Republic','Secular','Welfare'] },
  { emoji: '📊', subject: 'Commerce', terms: ['Accounting','Balance Sheet','Profit','Loss','Asset','Liability','Capital','Revenue','Expense','Tax','Audit','Budget','Insurance','Banking','Stock','Share','Dividend','Partnership','Company','Invoice','Ledger','Journal','Depreciation','Interest'] },
  { emoji: '🧠', subject: 'Psychology', terms: ['Behavior','Cognition','Emotion','Perception','Memory','Learning','Motivation','Personality','Intelligence','Consciousness','Stress','Anxiety','Therapy','Development','Social','Abnormal','Sensation','Attention','Language','Thinking','Dream','Brain','Stimulus','Response'] },
  { emoji: '📖', subject: 'English Literature', terms: ['Poem','Novel','Drama','Prose','Fiction','Non-fiction','Character','Plot','Theme','Setting','Metaphor','Simile','Alliteration','Personification','Irony','Satire','Tragedy','Comedy','Sonnet','Stanza','Dialogue','Narrator','Protagonist','Antagonist'] },
]

/* ── Translate via server API route (avoids CORS) ── */
async function translateBatch(text: string, sourceCode: string, targets: { lang: string; code: string }[]): Promise<Record<string, string>> {
  try {
    const res = await fetch('/api/translate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, source: sourceCode, targets }),
    })
    if (!res.ok) throw new Error('API error')
    const data = await res.json()
    return data.translations || {}
  } catch {
    // fallback: return placeholders
    const results: Record<string, string> = {}
    targets.forEach(t => { results[t.lang] = `[${t.code}] ${text}` })
    return results
  }
}

/* ── AI Enrichment helpers ── */
function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}
function charCount(text: string): number {
  return text.length
}

/* ── Translation Card ── */
function TranslationCard({ lang, text, isSource, sourceText, onSpeak, isOffline }: {
  lang: string; text: string; isSource?: boolean; sourceText?: string
  onSpeak: (text: string, code: string) => void; isOffline?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const meta = LANG_META[lang]
  if (!meta) return null

  const isRTL = ['ar', 'fa', 'he', 'ur'].includes(meta.code)
  const words = wordCount(text)
  const chars = charCount(text)

  const copy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className={`rounded-xl p-4 hover:shadow-sm transition-all group border ${
      isSource ? 'bg-violet-50 border-violet-200 ring-1 ring-violet-100' : 'bg-white border-gray-200 hover:border-violet-300'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-lg">{meta.flag}</span>
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-bold text-gray-900">{lang}</p>
              {isSource && (
                <span className="text-[9px] bg-violet-600 text-white px-1.5 py-0.5 rounded-full font-bold uppercase">Source</span>
              )}
              {isOffline && !isSource && (
                <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                  <HardDrive className="w-2.5 h-2.5" /> Offline
                </span>
              )}
            </div>
            <p className="text-[10px] text-gray-400">{meta.native}{meta.script ? ` · ${meta.script}` : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setShowAI(v => !v)}
            className={`p-1.5 rounded-lg transition-colors ${showAI ? 'text-violet-600 bg-violet-100' : 'text-gray-400 hover:text-violet-600 hover:bg-violet-50'}`} title="AI Insights">
            <Brain className="w-3.5 h-3.5" />
          </button>
          <button onClick={() => onSpeak(text, meta.code)}
            className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Listen">
            <Volume2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={copy}
            className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Copy">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-700 leading-relaxed" dir={isRTL ? 'rtl' : 'ltr'}>
        {text}
      </p>

      {/* Word/char stats — always visible */}
      <div className="flex items-center gap-3 mt-2 pt-2 border-t border-gray-100">
        <span className="flex items-center gap-1 text-[10px] text-gray-400">
          <Type className="w-2.5 h-2.5" /> {words} words
        </span>
        <span className="flex items-center gap-1 text-[10px] text-gray-400">
          <Hash className="w-2.5 h-2.5" /> {chars} chars
        </span>
        {meta.script && (
          <span className="flex items-center gap-1 text-[10px] text-gray-400">
            <BookOpen className="w-2.5 h-2.5" /> {meta.script}
          </span>
        )}
      </div>

      {/* AI Insights panel — expandable */}
      {showAI && (
        <div className="mt-3 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-100 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3 h-3 text-violet-500" />
            <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wide">AI Insights</span>
            <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-medium ml-auto flex items-center gap-0.5">
              <Star className="w-2.5 h-2.5" /> Pro
            </span>
          </div>
          {isSource ? (
            <>
              <div className="text-[11px] text-gray-600 flex items-start gap-1.5">
                <Lightbulb className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                <span><b>Tip:</b> This text has {words} words. Shorter sentences translate more accurately across all languages.</span>
              </div>
              <div className="text-[11px] text-gray-600 flex items-start gap-1.5">
                <BookOpen className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                <span><b>Reading level:</b> {words <= 5 ? 'Basic' : words <= 15 ? 'Intermediate' : 'Advanced'} ({words} words)</span>
              </div>
              <div className="text-[11px] text-gray-600 flex items-start gap-1.5">
                <Brain className="w-3 h-3 text-violet-500 flex-shrink-0 mt-0.5" />
                <span><b>Grammar:</b> AI grammar check available for source text. Ensure correct punctuation for best results.</span>
              </div>
            </>
          ) : (
            <>
              <div className="text-[11px] text-gray-600 flex items-start gap-1.5">
                <BookOpen className="w-3 h-3 text-blue-500 flex-shrink-0 mt-0.5" />
                <span><b>Transliteration:</b> Tap to see romanized version (coming soon)</span>
              </div>
              <div className="text-[11px] text-gray-600 flex items-start gap-1.5">
                <Lightbulb className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                <span><b>Word-by-word:</b> Tap any word for meaning, pronunciation &amp; example sentences (coming soon)</span>
              </div>
              <div className="text-[11px] text-gray-600 flex items-start gap-1.5">
                <Brain className="w-3 h-3 text-violet-500 flex-shrink-0 mt-0.5" />
                <span><b>Learn this phrase:</b> Add to flashcard deck for {lang} vocabulary practice</span>
              </div>
              {sourceText && words !== wordCount(sourceText) && (
                <div className="text-[11px] text-gray-600 flex items-start gap-1.5">
                  <Type className="w-3 h-3 text-teal-500 flex-shrink-0 mt-0.5" />
                  <span><b>Note:</b> {lang} uses {words > wordCount(sourceText) ? 'more' : 'fewer'} words ({words} vs {wordCount(sourceText)}) — languages express ideas differently!</span>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  )
}

/* ── Main Page ── */
export default function TranslatorPage() {
  const [inputText, setInputText] = useState('')
  const [sourceLang, setSourceLang] = useState('English')
  const [activeZone, setActiveZone] = useState<ZoneKey>('Indian Languages')
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [isTranslating, setIsTranslating] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showSourcePicker, setShowSourcePicker] = useState(false)
  const [showPackManager, setShowPackManager] = useState(false)
  const [installedPacks, setInstalledPacks] = useState<Record<string, PackInfo>>({})
  const [downloadingLang, setDownloadingLang] = useState<string | null>(null)
  const [downloadPct, setDownloadPct] = useState(0)
  const [offlineHits, setOfflineHits] = useState<Set<string>>(new Set())
  const [isOnline, setIsOnline] = useState(true)
  const [activeLevel, setActiveLevel] = useState<0 | 1 | 2 | 3>(0) // 0=manual, 1=beginner, 2=lang books, 3=subject books
  const [selectedChapter, setSelectedChapter] = useState<number | null>(null)
  const [selectedWord, setSelectedWord] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  const allLanguages = useMemo(() =>
    Object.values(LANGUAGE_ZONES).flatMap(z => [...z.languages] as string[]),
    []
  )

  // Load installed packs on mount and track online status
  useEffect(() => {
    getInstalledPacks().then(setInstalledPacks)
    const onOnline = () => setIsOnline(true)
    const onOffline = () => setIsOnline(false)
    setIsOnline(navigator.onLine)
    window.addEventListener('online', onOnline)
    window.addEventListener('offline', onOffline)
    return () => { window.removeEventListener('online', onOnline); window.removeEventListener('offline', onOffline) }
  }, [])

  const translate = async (overrideText?: string) => {
    const text = (overrideText ?? inputText).trim()
    if (!text) return
    const srcCode = LANG_META[sourceLang]?.code || 'en'
    setIsTranslating(true)
    setTranslations({})
    setOfflineHits(new Set())

    const targets = allLanguages
      .filter(l => l !== sourceLang && LANG_META[l])
      .map(l => ({ lang: l, code: LANG_META[l].code }))

    // Step 1: Try offline cache first for all targets
    const results: Record<string, string> = {}
    const offlineFound = new Set<string>()
    const needsOnline: typeof targets = []

    for (const t of targets) {
      const cached = await getCachedTranslation(srcCode, t.code, text)
      if (cached) {
        results[t.lang] = cached
        offlineFound.add(t.lang)
      } else {
        needsOnline.push(t)
      }
    }

    // Always include source
    results[sourceLang] = text

    // Show offline results immediately
    if (offlineFound.size > 0) {
      setTranslations({ ...results })
      setOfflineHits(offlineFound)
    }

    // Step 2: Fetch remaining from API (if online)
    if (needsOnline.length > 0 && isOnline) {
      try {
        const onlineResults = await translateBatch(text, srcCode, needsOnline)
        // Cache all new results
        for (const [lang, translation] of Object.entries(onlineResults)) {
          results[lang] = translation
          const code = LANG_META[lang]?.code
          if (code) setCachedTranslation(srcCode, code, text, translation)
        }
      } catch {
        // Mark unfetched as unavailable
        needsOnline.forEach(t => {
          if (!results[t.lang]) results[t.lang] = `[Offline — download ${t.lang} pack for offline use]`
        })
      }
    } else if (needsOnline.length > 0) {
      // Offline and no cache
      needsOnline.forEach(t => {
        if (!results[t.lang]) results[t.lang] = `[Offline — download ${t.lang} pack for offline use]`
      })
    }

    setTranslations(results)
    setOfflineHits(offlineFound)
    setIsTranslating(false)
  }

  const handleDownloadPack = async (langName: string) => {
    const meta = LANG_META[langName]
    if (!meta || downloadingLang) return
    setDownloadingLang(langName)
    setDownloadPct(0)
    try {
      const srcCode = LANG_META[sourceLang]?.code || 'en'
      const pack = await downloadLanguagePack(langName, meta.code, srcCode, setDownloadPct)
      setInstalledPacks(prev => ({ ...prev, [meta.code]: pack }))
    } catch { /* silent */ }
    setDownloadingLang(null)
    setDownloadPct(0)
  }

  const handleDeletePack = async (langCode: string) => {
    await deleteLanguagePack(langCode)
    setInstalledPacks(prev => {
      const next = { ...prev }
      delete next[langCode]
      return next
    })
  }

  const startVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Voice input not supported in this browser. Try Chrome.')
      return
    }
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = LANG_META[sourceLang]?.code || 'en'
    recognition.interimResults = true
    recognition.continuous = false

    recognition.onresult = (event: any) => {
      let transcript = ''
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript
      }
      setInputText(transcript)
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  const stopVoiceInput = () => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }

  // Pre-load voices on mount so they're ready for first click
  const voicesRef = useRef<SpeechSynthesisVoice[]>([])
  useEffect(() => {
    if (!window.speechSynthesis) return
    const loadVoices = () => { voicesRef.current = window.speechSynthesis.getVoices() }
    loadVoices()
    window.speechSynthesis.onvoiceschanged = loadVoices
  }, [])

  const speak = (text: string, langCode: string) => {
    if (!text.trim()) return
    const encoded = encodeURIComponent(text.slice(0, 200))

    // Always use our server TTS proxy — guaranteed to work for all 98 languages,
    // no voice installation needed, works on every device from first click
    const audio = new Audio(`/api/tts?lang=${langCode}&text=${encoded}`)
    audio.play().catch(() => {
      // Fallback to Web Speech API if server TTS fails (e.g. offline)
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
        const utter = new SpeechSynthesisUtterance(text)
        utter.lang = langCode
        utter.rate = 0.9
        // Try to find a matching voice
        const voice = voicesRef.current.find(v => v.lang.startsWith(langCode))
        if (voice) utter.voice = voice
        window.speechSynthesis.speak(utter)
      }
    })
  }

  const zoneLanguages = (LANGUAGE_ZONES[activeZone]?.languages ?? []) as unknown as string[]
  const zoneTranslations = zoneLanguages.filter(l => translations[l])
  const hasTranslations = Object.keys(translations).length > 0

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <Languages className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">Learn Languages</h1>
            <p className="text-gray-500 text-sm">Learn &amp; translate across 98 languages — works offline with language packs</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Online/Offline indicator */}
          <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${
            isOnline ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-red-50 text-red-600 border border-red-200'
          }`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isOnline ? 'Online' : 'Offline'}
          </span>
          <button onClick={() => setShowPackManager(v => !v)}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl border transition-colors ${
              showPackManager ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-700 border-gray-200 hover:border-violet-300'
            }`}>
            <HardDrive className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Language Packs</span>
            {Object.keys(installedPacks).length > 0 && (
              <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                showPackManager ? 'bg-white text-violet-600' : 'bg-violet-100 text-violet-600'
              }`}>{Object.keys(installedPacks).length}</span>
            )}
          </button>
        </div>
      </div>

      {/* ── Language Pack Manager ── */}
      {showPackManager && (
        <div className="mb-6 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gradient-to-r from-violet-50 to-indigo-50">
            <div className="flex items-center gap-2">
              <Download className="w-4 h-4 text-violet-600" />
              <h2 className="font-black text-gray-900 text-sm">Offline Language Packs</h2>
              <span className="text-[10px] text-gray-400 ml-auto">
                {Object.keys(installedPacks).length} installed · {Object.values(installedPacks).reduce((s, p) => s + p.sizeKB, 0)}KB used
                {Object.keys(installedPacks).length === 0 && <> · ~{allLanguages.reduce((s, l) => s + estSize(LANG_META[l]?.code || ''), 0)}KB for all</>}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Download packs to translate offline without internet. Each pack includes {PACK_PHRASES.length} common phrases, greetings, numbers, colours, and classroom vocabulary.</p>
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {Object.entries(LANGUAGE_ZONES).map(([zone, data]) => (
              <div key={zone}>
                <div className="px-5 py-2 bg-gray-50 sticky top-0 z-10">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{data.emoji} {zone}</span>
                </div>
                {(data.languages as unknown as string[]).map(lang => {
                  const meta = LANG_META[lang]
                  if (!meta) return null
                  const installed = installedPacks[meta.code]
                  const isDownloading = downloadingLang === lang
                  return (
                    <div key={lang} className="flex items-center gap-3 px-5 py-2.5 hover:bg-gray-50 transition-colors">
                      <span className="text-sm">{meta.flag}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-gray-900">{lang} <span className="text-gray-400 font-normal">({meta.native})</span></p>
                        <p className="text-[10px] text-gray-400">
                          {installed
                            ? <>{installed.phraseCount} phrases · {installed.sizeKB}KB · {new Date(installed.downloadedAt).toLocaleDateString()}</>
                            : <>{PACK_PHRASES.length} phrases · ~{estSize(meta.code)}KB</>
                          }
                        </p>
                      </div>
                      {isDownloading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-violet-600 rounded-full transition-all" style={{ width: `${downloadPct}%` }} />
                          </div>
                          <span className="text-[10px] text-violet-600 font-mono w-8">{downloadPct}%</span>
                        </div>
                      ) : installed ? (
                        <div className="flex items-center gap-1">
                          <span className="flex items-center gap-1 text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                            <CheckCircle2 className="w-3 h-3" /> Installed
                          </span>
                          <button onClick={() => handleDeletePack(meta.code)}
                            className="p-1 text-gray-300 hover:text-red-500 transition-colors" title="Remove pack">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <button onClick={() => handleDownloadPack(lang)} disabled={!isOnline}
                          className="flex items-center gap-1 text-[10px] font-semibold text-violet-600 bg-violet-50 hover:bg-violet-100 px-2.5 py-1 rounded-lg transition-colors disabled:opacity-40 disabled:pointer-events-none">
                          <Download className="w-3 h-3" /> Download
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
          {/* Quick actions */}
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
            <button onClick={async () => {
              const indianLangs = (LANGUAGE_ZONES['Indian Languages'].languages as unknown as string[])
              for (const lang of indianLangs) {
                if (!installedPacks[LANG_META[lang]?.code]) {
                  await handleDownloadPack(lang)
                }
              }
            }} disabled={!isOnline || !!downloadingLang}
              className="text-[10px] font-semibold text-violet-600 hover:underline disabled:opacity-40 disabled:no-underline">
              Download all Indian languages
            </button>
            <span className="text-gray-300">·</span>
            <button onClick={async () => {
              for (const lang of allLanguages) {
                if (!installedPacks[LANG_META[lang]?.code]) {
                  await handleDownloadPack(lang)
                }
              }
            }} disabled={!isOnline || !!downloadingLang}
              className="text-[10px] font-semibold text-violet-600 hover:underline disabled:opacity-40 disabled:no-underline">
              Download all 98 languages
            </button>
          </div>
        </div>
      )}

      {/* ── Offline pack prompt (shown when no packs installed) ── */}
      {Object.keys(installedPacks).length === 0 && !showPackManager && (
        <div className="mb-4 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <Download className="w-4 h-4 text-amber-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-amber-900">Download language packs for offline translation</p>
            <p className="text-[10px] text-amber-700 mt-0.5">Translate without internet — download packs with {PACK_PHRASES.length} common phrases per language. Works on mobile, tablet &amp; desktop.</p>
          </div>
          <button onClick={() => setShowPackManager(true)}
            className="flex items-center gap-1.5 text-xs font-bold bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex-shrink-0">
            <HardDrive className="w-3.5 h-3.5" /> Get Packs
          </button>
        </div>
      )}

      {/* ── Input Section ── */}
      <div className="bg-gradient-to-br from-violet-50 via-white to-indigo-50 border border-violet-200 rounded-2xl p-5 mb-6 shadow-sm">
        {/* Source language selector */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">From:</span>
          <div className="relative">
            <button onClick={() => setShowSourcePicker(v => !v)}
              className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-gray-700 hover:border-violet-300 transition-colors">
              <span>{LANG_META[sourceLang]?.flag}</span>
              <span>{sourceLang}</span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            {showSourcePicker && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 max-h-64 overflow-y-auto w-56">
                {allLanguages.map(l => (
                  <button key={l} onClick={() => { setSourceLang(l); setShowSourcePicker(false); setTranslations({}) }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-violet-50 transition-colors ${l === sourceLang ? 'bg-violet-50 text-violet-700 font-semibold' : 'text-gray-700'}`}>
                    <span>{LANG_META[l]?.flag}</span>
                    <span>{l}</span>
                    <span className="text-[10px] text-gray-400 ml-auto">{LANG_META[l]?.native}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <ArrowLeftRight className="w-4 h-4 text-gray-300" />
          <span className="text-xs font-bold text-violet-600 uppercase tracking-wide bg-violet-100 px-2 py-0.5 rounded-full">All 98 languages</span>
        </div>

        {/* Text input */}
        <textarea
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); translate() } }}
          placeholder="Enter text to translate..."
          rows={4}
          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-base text-gray-800 resize-none focus:ring-2 focus:ring-violet-500 focus:border-violet-300 outline-none placeholder:text-gray-400"
        />

        {/* Action row: Voice → Speak → Translate */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <button onClick={isListening ? stopVoiceInput : startVoiceInput}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isListening
                ? 'bg-red-50 border-red-300 text-red-600 animate-pulse'
                : 'bg-white border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-600'
            }`}>
            {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
            {isListening ? 'Stop' : 'Voice'}
          </button>

          <button onClick={() => { if (inputText.trim()) speak(inputText, LANG_META[sourceLang]?.code || 'en') }}
            disabled={!inputText.trim()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-600 transition-all disabled:opacity-40 disabled:pointer-events-none bg-white">
            <Volume2 className="w-3.5 h-3.5" />
            Speak
          </button>

          <button onClick={() => translate()} disabled={!inputText.trim() || isTranslating}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md hover:shadow-lg disabled:opacity-40 disabled:pointer-events-none transition-all">
            <Sparkles className="w-3.5 h-3.5" />
            {isTranslating ? 'Translating…' : 'Translate'}
          </button>

          {/* Separator */}
          <div className="w-px h-6 bg-gray-200 mx-1 hidden sm:block" />

          {/* Load Level tabs */}
          {([
            [0, '✏️', 'Manual'],
            [1, '📖', `Level 1 (${TOTAL_WORDS} words)`],
            [2, '📚', 'Level 2 (Books)'],
            [3, '🔗', 'Level 3 (Subjects)'],
          ] as [number, string, string][]).map(([lvl, emoji, label]) => (
            <button key={lvl} onClick={() => { setActiveLevel(lvl as 0|1|2|3); setSelectedChapter(null); setSelectedWord(null) }}
              className={`flex items-center gap-1 px-2.5 py-2 rounded-xl text-[11px] font-semibold border transition-all ${
                activeLevel === lvl
                  ? 'bg-violet-100 border-violet-300 text-violet-700'
                  : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}>
              <span className="text-sm">{emoji}</span>
              <span className="hidden sm:inline">{label}</span>
              <span className="sm:hidden">{label.split(' ')[0]}</span>
            </button>
          ))}

          {/* Char count + clear — far right */}
          <div className="flex items-center gap-2 ml-auto">
            <p className="text-[10px] text-gray-400">{inputText.length}/5000</p>
            {inputText.length > 0 && (
              <button onClick={() => { setInputText(''); setTranslations({}); setSelectedWord(null) }}
                className="text-[10px] text-gray-400 hover:text-red-500 transition-colors">Clear</button>
            )}
          </div>
        </div>
      </div>

      {/* ── Level Content Panel ── */}
      {activeLevel === 1 && (
        <div className="mb-4 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50">
            <div className="flex items-center gap-2">
              <span className="text-lg">📖</span>
              <div>
                <h3 className="font-black text-gray-900 text-sm">Level 1 — Beginner ({TOTAL_WORDS} Words)</h3>
                <p className="text-[10px] text-gray-500">Tap any chapter, then tap a word to translate it to all 98 languages</p>
              </div>
            </div>
          </div>
          {selectedChapter === null ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 p-4">
              {BEGINNER_CHAPTERS.map((ch, i) => (
                <button key={i} onClick={() => setSelectedChapter(i)}
                  className="flex items-center gap-2 px-3 py-3 rounded-xl border border-gray-200 hover:border-violet-300 hover:bg-violet-50 transition-all text-left group">
                  <span className="text-lg">{ch.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate group-hover:text-violet-700">{ch.title}</p>
                    <p className="text-[10px] text-gray-400">{ch.words.length} words</p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <button onClick={() => { setSelectedChapter(null); setSelectedWord(null) }}
                className="flex items-center gap-1 text-xs text-violet-600 font-semibold mb-3 hover:underline">
                <ChevronDown className="w-3 h-3 rotate-90" /> Back to chapters
              </button>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">{BEGINNER_CHAPTERS[selectedChapter].emoji}</span>
                <h4 className="font-bold text-gray-900 text-sm">{BEGINNER_CHAPTERS[selectedChapter].title}</h4>
                <span className="text-[10px] text-gray-400">({BEGINNER_CHAPTERS[selectedChapter].words.length} words)</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {BEGINNER_CHAPTERS[selectedChapter].words.map(word => (
                  <button key={word} onClick={() => { setInputText(word); setSelectedWord(word); translate(word) }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedWord === word
                        ? 'bg-violet-600 text-white border-violet-600'
                        : 'bg-white border-gray-200 text-gray-700 hover:border-violet-300 hover:text-violet-600'
                    }`}>
                    {word}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeLevel === 2 && (
        <div className="mb-4 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-2">
              <span className="text-lg">📚</span>
              <div>
                <h3 className="font-black text-gray-900 text-sm">Level 2 — Language Book Sentences</h3>
                <p className="text-[10px] text-gray-500">Tap a language → load sentences from its course book → translate to all 98 languages</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            {Object.entries(LANGUAGE_ZONES).map(([zone, data]) => (
              <div key={zone} className="mb-4 last:mb-0">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">{data.emoji} {zone}</p>
                <div className="flex flex-wrap gap-2">
                  {(data.languages as unknown as string[]).map(lang => {
                    const meta = LANG_META[lang]
                    if (!meta) return null
                    const sentences = LANG_BOOK_SENTENCES[lang]
                    return (
                      <button key={lang} onClick={() => {
                        if (sentences) { setSelectedWord(lang); }
                      }}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all text-left ${
                          selectedWord === lang && activeLevel === 2
                            ? 'border-blue-400 bg-blue-50 ring-1 ring-blue-200'
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}>
                        <span>{meta.flag}</span>
                        <div>
                          <p className="text-xs font-semibold text-gray-900">{lang}</p>
                          <p className="text-[10px] text-gray-400">{meta.native} · {sentences ? sentences.length + ' sentences' : 'Coming soon'}</p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
            {/* Sentence list for selected language */}
            {selectedWord && LANG_BOOK_SENTENCES[selectedWord] && activeLevel === 2 && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                  <span>{LANG_META[selectedWord]?.flag}</span> {selectedWord} — Book Sentences
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {LANG_BOOK_SENTENCES[selectedWord].map((sentence, i) => (
                    <button key={i} onClick={() => { setInputText(sentence); translate(sentence) }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:text-blue-600 transition-all text-left">
                      {sentence}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeLevel === 3 && (
        <div className="mb-4 bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="flex items-center gap-2">
              <span className="text-lg">🔗</span>
              <div>
                <h3 className="font-black text-gray-900 text-sm">Level 3 — Subject Vocabulary</h3>
                <p className="text-[10px] text-gray-500">Tap a subject → load key terms → translate to all 98 languages</p>
              </div>
            </div>
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mb-4">
              {SUBJECT_TERMS.map(s => (
                <button key={s.subject} onClick={() => setSelectedWord(s.subject)}
                  className={`flex items-center gap-2.5 px-3 py-3 rounded-xl border transition-all text-left group ${
                    selectedWord === s.subject && activeLevel === 3
                      ? 'border-amber-400 bg-amber-50 ring-1 ring-amber-200'
                      : 'border-gray-200 hover:border-amber-300 hover:bg-amber-50'
                  }`}>
                  <span className="text-lg">{s.emoji}</span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900 group-hover:text-amber-700 truncate">{s.subject}</p>
                    <p className="text-[10px] text-gray-400">{s.terms.length} terms</p>
                  </div>
                </button>
              ))}
            </div>
            {/* Terms for selected subject */}
            {selectedWord && SUBJECT_TERMS.find(s => s.subject === selectedWord) && activeLevel === 3 && (() => {
              const subj = SUBJECT_TERMS.find(s => s.subject === selectedWord)!
              return (
                <div className="border-t border-gray-100 pt-4">
                  <p className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                    <span>{subj.emoji}</span> {subj.subject} — Key Terms
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {subj.terms.map(term => (
                      <button key={term} onClick={() => { setInputText(term); translate(term) }}
                        className="px-2.5 py-1.5 rounded-lg text-xs font-medium border border-gray-200 bg-white text-gray-700 hover:border-amber-300 hover:text-amber-600 transition-all">
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* ── Translations Section ── */}
      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {/* Zone tabs */}
        <div className="border-b border-gray-100 px-4 pt-4 pb-0">
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-4 h-4 text-violet-600" />
            <h2 className="font-black text-gray-900">Translations</h2>
            {hasTranslations && (
              <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium ml-auto">
                {Object.keys(translations).length} languages
              </span>
            )}
          </div>
          <div className="flex overflow-x-auto gap-1 pb-0 -mb-px">
            {ZONE_TABS.map(zone => {
              const zoneData = LANGUAGE_ZONES[zone as ZoneKey]
              const count = (zoneData.languages as unknown as string[]).filter(l => translations[l]).length
              return (
                <button key={zone} onClick={() => setActiveZone(zone as ZoneKey)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    activeZone === zone
                      ? 'border-violet-600 text-violet-700 bg-violet-50/50'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}>
                  <span className="text-sm">{zoneData.emoji}</span>
                  <span className="hidden sm:inline">{zone}</span>
                  <span className="sm:hidden">{zone.split(' ')[0]}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                      activeZone === zone ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>{count}</span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Translation cards */}
        <div className="p-4">
          {!hasTranslations ? (
            <div className="text-center py-16 text-gray-400">
              <Languages className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium text-gray-500">No translations yet</p>
              <p className="text-xs text-gray-400 mt-1">Enter text above and click <span className="text-violet-600 font-semibold">Translate</span> to see results in all 98 languages</p>
            </div>
          ) : isTranslating ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-3 border-violet-200 border-t-violet-600 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-sm text-gray-500">Translating to {allLanguages.length - 1} languages…</p>
            </div>
          ) : zoneTranslations.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-sm">No translations in this zone (source language: {sourceLang})</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">{LANGUAGE_ZONES[activeZone]?.emoji}</span>
                <h3 className="font-bold text-gray-900">{activeZone}</h3>
                <span className="text-xs text-gray-400">({zoneTranslations.length} languages)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {zoneTranslations.map(lang => (
                  <TranslationCard key={lang} lang={lang} text={translations[lang]} isSource={lang === sourceLang} sourceText={inputText.trim()} onSpeak={speak} isOffline={offlineHits.has(lang)} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick phrase suggestions */}
      {!hasTranslations && (
        <div className="mt-4 bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Try these phrases:</p>
          <div className="flex flex-wrap gap-2">
            {['Hello, how are you?', 'I love learning new languages', 'Good morning, teacher', 'What is your name?', 'Thank you very much', 'Where is the library?'].map(phrase => (
              <button key={phrase} onClick={() => setInputText(phrase)}
                className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded-lg text-gray-600 hover:border-violet-300 hover:text-violet-600 transition-colors">
                &ldquo;{phrase}&rdquo;
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
