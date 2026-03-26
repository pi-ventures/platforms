/**
 * Sample Processed Book — NCERT Mathematics Class V, Chapter 1: We the Travellers
 * ═══════════════════════════════════════════════════════════════════════════════
 * This is a real book extracted from the uploaded PDF via OCR pipeline.
 * Used as the reference test book for all reader features.
 */

import { type ProcessedBook, type EpubChapter, type EpubParagraph, EPUB_CSS } from './book-pipeline'

function buildParagraph(id: string, index: number, text: string, chapterWordOffset: number): EpubParagraph {
  const wordList = text.split(/\s+/).filter(Boolean)
  let globalIdx = chapterWordOffset
  return {
    id,
    index,
    text,
    words: wordList.map((w, wi) => ({
      text: w,
      index: wi,
      globalIndex: globalIdx + wi,
      startTime: (globalIdx + wi) * 0.35,
      endTime: (globalIdx + wi + 1) * 0.35,
    })),
    startTime: globalIdx * 0.35,
    endTime: (globalIdx + wordList.length) * 0.35,
  }
}

function buildChapter(id: string, index: number, title: string, texts: string[]): EpubChapter {
  let wordOffset = 0
  const paragraphs = texts.map((t, i) => {
    const para = buildParagraph(`${id}-p${i}`, i, t, wordOffset)
    wordOffset += para.words.length
    return para
  })
  return {
    id,
    index,
    title,
    htmlFile: `text/chapter${index + 1}.html`,
    paragraphs,
    wordCount: wordOffset,
    audioFile: `audio/chapter${index + 1}.mp3`,
    audioDuration: Math.round(wordOffset * 0.35),
  }
}

export const SAMPLE_BOOK: ProcessedBook = {
  id: 9999,
  title: 'Mathematics — We the Travellers (Ch 1)',
  author: 'NCERT',
  subject: 'Mathematics',
  class: 'Class V',
  language: 'English',
  totalChapters: 8,
  totalWords: 0, // computed below
  totalPages: 16,
  epubReady: true,
  audioReady: true,
  // Original PDF pages — served via /api/books/page?book=9999&page=N
  pageImages: Array.from({ length: 16 }, (_, i) => `/api/books/page?book=9999&page=${i + 1}`),
  pageChapterMap: [0, 1, 1, 2, 3, 3, 4, 5, 6, 6, 7, 7, 7, 7, 7, 7],
  chapters: [
    buildChapter('ch1-intro', 0, 'We the Travellers — I', [
      'When was the last time you went on a long trip? Where did you go? How did you travel? What was the duration of your trip? How much distance did you cover? Ask the elders who went with you to help you answer these questions.',
      'Human beings have always been interested in travelling. About a hundred years ago, there were far fewer vehicles than today. There were animal-drawn carts, cars, and trains. Long before this, thousands of years ago, people travelled long distances on foot or used animals to travel from one place to another.',
      'They also built boats and ships to travel across lakes, rivers, and seas. Boats were probably the first form of transport invented by humans, much before bullock carts! Do you know how many vehicles are currently there in your state?',
    ]),
    buildChapter('ch1-place-value', 1, 'Reading and Writing Large Numbers', [
      'How do you write numbers to show several thousand objects? Let us start with 1,000. What numbers do we get when we keep adding a thousand?',
      'What number do we get when we add a thousand to 9,000? We get ten thousand. How do we write this number?',
      'Look at the table below and notice the pattern of writing numbers. In the place value chart, we have added another column, TTh. It stands for ten thousand.',
      'In the same way, 10 Thousands equals Ten Thousand equals 10,000. We use a comma to help us read large numbers easily.',
      'Do you remember how we read and write numbers in the Indian place value system? We use the same ten digits 0 to 9 in different places to write larger numbers.',
      'For example, 1,380 equals 1 Thousand plus 3 Hundreds plus 8 Tens plus 0 Ones. And 9,123 equals 9 Thousands plus 1 Hundred plus 2 Tens plus 3 Ones.',
    ]),
    buildChapter('ch1-beyond-10000', 2, 'Numbers Beyond 10,000', [
      'Let us see how we write numbers beyond 10,000 and how we name them. We write them in the same way as numbers below 9,999. You can use the tokens given in the end of the book.',
      '10,001 is written as one zero zero zero one and is called Ten thousand one. 10,002 is Ten thousand two. 10,010 is Ten thousand ten.',
      '10,024 is Ten thousand twenty-four. 10,033 is Ten thousand thirty-three. 10,458 is Ten thousand four hundred fifty-eight.',
      '11,214 has 1 in the Ten Thousands place, 1 in the Thousands place, 2 in the Hundreds place, 1 in the Tens place, and 4 in the Ones place.',
      '13,520 is Thirteen thousand five hundred twenty. 20,000 is Twenty thousand. 45,867 is Forty-five thousand eight hundred sixty-seven.',
    ]),
    buildChapter('ch1-patterns', 3, 'Let Us Do — Number Patterns', [
      'Fill in the blanks by continuing the pattern in each of the following sequences. Discuss the patterns in class.',
      'Pattern a: 456, 567, 678 — each number increases by 111. The next numbers would be 789, 900, 1011.',
      'Pattern b: 1,050, then 3,150, then 4,200 — the difference is 2,100 then 1,050. This is an interesting pattern where the gap changes.',
      'Pattern d: 10,100, 10,200, 10,300 — each number increases by 100. Continue until 10,900.',
      'Pattern g: 10,794, 10,796, 10,798 — each number increases by 2. The next numbers would be 10,800, 10,802, 10,804.',
      'Fill in the blanks appropriately. Use commas as required. 8,045 is Eight thousand forty-five. 7,209 is Seven thousand two hundred nine. 10,599 is Ten thousand five hundred ninety-nine.',
    ]),
    buildChapter('ch1-comparing', 4, 'Comparing Numbers and Digit Swap', [
      'A student said 9,990 is greater than 49,014 because 9 is greater than 4. Is the student correct? Why or why not?',
      'The student is not correct. When comparing numbers, we first look at the number of digits. 49,014 is a 5-digit number while 9,990 is a 4-digit number. A 5-digit number is always greater than a 4-digit number.',
      'Digit swap: In the number 1,478, interchanging the digits 7 and 4 gives 1,748. Now, interchange any two digits in the number 1,478 to make a number that is larger than 5,500.',
      'Interchange two digits of 10,593 to make a number between 11,000 and 15,000, or more than 35,000.',
      'Interchange two digits of 48,247 to make a number as small as possible, or as big as possible.',
    ]),
    buildChapter('ch1-nearest', 5, 'Nearest Tens, Hundreds, and Thousands', [
      'A rabbit is hungry. Its location is given in the pictures below. Its food has been kept at two places. Help the rabbit to reach its food.',
      'The rabbit is at 2,346. Its food has been kept at its neighbouring tens. On which tens should the rabbit go to get its food, with the least number of steps?',
      '2,350 is the nearest ten of 2,346. It will need 4 jumps to reach 2,350. The nearest hundred of 2,346 is 2,300. The nearest thousand of 2,346 is 2,000.',
      'Think and write two numbers that have the same nearest ten. For example, 19 and 21 have the same nearest ten, that is, 20.',
      'Think and write the numbers that have the same nearest ten and nearest hundred. Or the same nearest hundred and nearest thousand.',
      'Vijay rounded off a number to the nearest hundred. Suma rounded off the same number to the nearest thousand. Both got the same result. Circle the numbers they might have used: 7,126 or 7,835 or 7,030 or 6,999.',
    ]),
    buildChapter('ch1-travelling', 6, 'Travelling, Now and Then', [
      'We learnt that people in the past travelled on foot, on animals, and used boats and sailing ships. The animals that have been used for travelling include bullocks, horses, donkeys, mules, and elephants.',
      'In hilly and snow-covered regions, yaks, dogs, and reindeers have been used, while camels have been used in deserts.',
      'Now, people use bicycles, motorbikes, cars, buses, trains, ships, and aeroplanes to travel from one place to another. Submarines are used to go deep under water. Humans are also using spacecraft to travel to outer space.',
      'In an hour a person can generally travel: 3 to 5 km on foot, 10 to 15 km on horseback, 12 to 20 km by cycle, 40 to 60 km by motorbike, 40 to 160 km by train, 25 to 45 km by ship, 750 to 920 km by aircraft, and minimum 28,000 km by spacecraft.',
      'A cyclist can cover 15 km in one hour. How much distance will she cover in 4 hours, if she maintains the same speed? The answer is 60 km.',
      'A school has 461 girls and 439 boys. That is a total of 900 students. How many vehicles are needed for all of them to go on a trip using different modes of travel?',
    ]),
    buildChapter('ch1-puzzles', 7, 'Pastime Mathematics — Puzzles', [
      'Sanju and Mira are traveling on a train. To pass time, they challenge each other with games and puzzles.',
      'Mira poses the river crossing puzzle to Sanju. A boatman wants to cross a river in a boat. He has to take a lion, a sheep, and a bundle of grass with him. He can take one of them at a time.',
      'If the sheep and grass are left on the shore, the sheep will eat the grass. And if the sheep and lion are left on the shore, the lion will eat the sheep. How can the boatman take the lion, sheep, and grass across the river safely?',
      'Sanju introduces a game called pile of pebbles to Mira. There are two piles of pebbles. Each pile contains 7 pebbles. Each player can pick as many pebbles they want from either of the piles. The player who picks the last pebble wins.',
      'Mira gives a fun puzzle: Take any two different digits. Make two 2-digit numbers using them. Subtract the smaller number from the bigger number. For example, with 3 and 7: 73 minus 37 equals 36.',
      'Continue this process until you get a 1-digit number. No matter which two numbers you choose, you will get 9 in the end. The whole process: 73 minus 37 equals 36, then 63 minus 36 equals 27, then 72 minus 27 equals 45, then 54 minus 45 equals 9.',
      'Once upon a time, there was a king who was very fond of horses. He had 20 horses of the best breed. One night, a thief stole one of the horses. The caretaker arranged the remaining 19 horses so that there were still 5 horses on each side of the square stable.',
      'The following night, the thief stole another horse. Now only 18 horses remained. The caretaker once again cleverly arranged the 18 horses so that there were 5 horses on each side. How many more horses can the thief steal before the king notices?',
    ]),
  ],
  coverImage: undefined,
  css: EPUB_CSS,
  tocHtml: '',
  metadata: {
    isbn: '978-93-5292-XXX-X',
    publisher: 'NCERT',
    publishedYear: 2025,
    source: 'NCERT',
    ocrEngine: 'ai4bharat-indicocr',
    interpretedBy: 'CuriousHat AI',
    attribution: 'Original content © NCERT 2025. Chapter 1: We the Travellers — I, from Mathematics textbook for Class V. Interpreted and restructured by CuriousHat AI for digital reading with audio sync.',
  },
}

// Compute total words
SAMPLE_BOOK.totalWords = SAMPLE_BOOK.chapters.reduce((s, c) => s + c.wordCount, 0)
SAMPLE_BOOK.tocHtml = SAMPLE_BOOK.chapters.map(c => `<li><a href="${c.htmlFile}">${c.title}</a></li>`).join('\n')
