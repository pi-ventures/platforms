/**
 * Book Upload → OCR → EPUB → Audiobook Pipeline
 * ═══════════════════════════════════════════════
 *
 * Pipeline: Upload (PDF/Image/DOCX) → OCR → Structured Text → EPUB → TTS Audiobook
 *
 * EPUB Structure:
 *   book-{id}/
 *   ├── META-INF/container.xml
 *   ├── content.opf
 *   ├── toc.ncx
 *   ├── styles.css
 *   ├── text/chapter1.html
 *   ├── text/chapter2.html
 *   ├── images/image1.jpg
 *   └── audio/chapter1.mp3  (TTS audiobook)
 */

/* ── Pipeline Stage Types ── */
export type PipelineStage =
  | 'uploading'
  | 'ocr'           // Scanned PDF → raw text via Tesseract/Google Vision
  | 'structuring'   // Raw text → chapters, headings, paragraphs
  | 'epub_gen'      // Structured text → EPUB (HTML chapters + CSS + TOC)
  | 'tts'           // EPUB text → TTS audio per chapter
  | 'indexing'      // Full-text search index + metadata extraction
  | 'complete'
  | 'error'

export interface PipelineJob {
  id: string
  bookId: number
  title: string
  status: PipelineStage
  progress: number           // 0-100
  startedAt: number
  completedAt?: number
  error?: string
  stages: {
    ocr: { status: 'pending' | 'running' | 'done' | 'skipped'; progress: number }
    structuring: { status: 'pending' | 'running' | 'done'; progress: number; chaptersFound: number }
    epub_gen: { status: 'pending' | 'running' | 'done'; progress: number; filesGenerated: string[] }
    tts: { status: 'pending' | 'running' | 'done'; progress: number; audioChapters: number }
    indexing: { status: 'pending' | 'running' | 'done'; progress: number; wordsIndexed: number }
  }
}

/* ── EPUB Chapter ── */
export interface EpubChapter {
  id: string
  index: number
  title: string
  htmlFile: string           // e.g. "text/chapter1.html"
  paragraphs: EpubParagraph[]
  wordCount: number
  audioFile?: string         // e.g. "audio/chapter1.mp3"
  audioDuration?: number     // seconds
}

export interface EpubParagraph {
  id: string
  index: number
  text: string
  words: EpubWord[]
  startTime?: number         // audio sync: seconds from chapter start
  endTime?: number
}

export interface EpubWord {
  text: string
  index: number              // word index in paragraph
  globalIndex: number        // word index in chapter (for audio sync)
  startTime?: number         // audio sync: seconds from chapter start
  endTime?: number
}

/* ── Processed Book ── */
export interface ProcessedBook {
  id: number
  title: string
  author: string
  subject: string
  class: string
  language: string
  totalChapters: number
  totalWords: number
  totalPages: number
  epubReady: boolean
  audioReady: boolean
  chapters: EpubChapter[]
  /** Original PDF page images — the primary reading view */
  pageImages?: string[]           // URLs to rendered page images (PDF → PNG)
  /** Maps each page image to its chapter index */
  pageChapterMap?: number[]       // pageChapterMap[pageIdx] = chapterIdx
  coverImage?: string
  css: string
  tocHtml: string
  metadata: {
    isbn?: string
    publisher?: string
    publishedYear?: number
    source: string            // 'NCERT' | 'CuriousHat' | 'AI4Bharat' | etc.
    ocrEngine?: string        // 'tesseract' | 'google-vision' | 'ai4bharat-indicocr'
    interpretedBy: 'CuriousHat AI'
    attribution: string
  }
}

/* ── Reading State (for bookmarks & progress) ── */
export interface ReadingState {
  bookId: number
  chapterIndex: number
  paragraphIndex: number
  wordIndex: number
  scrollPosition: number     // percentage 0-100
  lastReadAt: number
}

/* ── Bookmark (enhanced — works for both reading and listening) ── */
export interface BookmarkV2 {
  id: string
  bookId: number
  bookTitle: string
  label: string
  type: 'read' | 'listen'    // which mode created this bookmark
  chapterIndex: number
  chapterTitle: string
  paragraphIndex: number
  wordIndex: number
  audioOffset?: number       // seconds into chapter audio
  scrollPct: number           // page scroll percentage
  createdAt: number
  preview: string            // first 50 chars of text at bookmark point
}

/* ── Pipeline Config ── */
export const PIPELINE_CONFIG = {
  maxUploadSize: 100 * 1024 * 1024,  // 100MB
  supportedFormats: ['.pdf', '.docx', '.doc', '.txt', '.epub', '.html', '.odt', '.rtf', '.jpg', '.jpeg', '.png', '.tiff'],
  ocrLanguages: ['eng', 'hin', 'ben', 'mar', 'tel', 'tam', 'guj', 'kan', 'mal', 'pan', 'ori'],
  ttsProviders: ['google-tts', 'ai4bharat-vakyansh', 'browser-speech'],
  epubVersion: '3.0',
  audioFormat: 'mp3',
  audioBitrate: 64,           // kbps — optimized for speech
  maxBookmarks: 10,           // per book
  chunkSize: 500,             // words per TTS chunk
}

/* ── Bookmark Storage (localStorage) ── */
const BM_V2_KEY = 'curioushat_bookmarks_v2'

export function loadBookmarksV2(bookId: number): BookmarkV2[] {
  try {
    const all: BookmarkV2[] = JSON.parse(localStorage.getItem(BM_V2_KEY) || '[]')
    return all.filter(b => b.bookId === bookId).sort((a, b) => b.createdAt - a.createdAt)
  } catch { return [] }
}

export function saveBookmarkV2(bm: BookmarkV2): void {
  try {
    const all: BookmarkV2[] = JSON.parse(localStorage.getItem(BM_V2_KEY) || '[]')
    const others = all.filter(b => b.bookId !== bm.bookId)
    const forBook = all.filter(b => b.bookId === bm.bookId).slice(0, PIPELINE_CONFIG.maxBookmarks - 1)
    localStorage.setItem(BM_V2_KEY, JSON.stringify([...others, ...forBook, bm]))
  } catch { /* storage full */ }
}

export function deleteBookmarkV2(id: string): void {
  try {
    const all: BookmarkV2[] = JSON.parse(localStorage.getItem(BM_V2_KEY) || '[]')
    localStorage.setItem(BM_V2_KEY, JSON.stringify(all.filter(b => b.id !== id)))
  } catch { /* silent */ }
}

/* ── Reading Progress Storage ── */
const PROGRESS_KEY = 'curioushat_reading_progress'

export function loadReadingProgress(bookId: number): ReadingState | null {
  try {
    const all: Record<string, ReadingState> = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}')
    return all[String(bookId)] || null
  } catch { return null }
}

export function saveReadingProgress(state: ReadingState): void {
  try {
    const all: Record<string, ReadingState> = JSON.parse(localStorage.getItem(PROGRESS_KEY) || '{}')
    all[String(state.bookId)] = { ...state, lastReadAt: Date.now() }
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(all))
  } catch { /* storage full */ }
}

/* ── EPUB CSS Template ── */
export const EPUB_CSS = `
@charset "UTF-8";

body {
  font-family: 'Noto Sans', 'Noto Sans Devanagari', 'Noto Sans Tamil', 'Noto Sans Bengali', system-ui, sans-serif;
  line-height: 1.8;
  color: #1a1a2e;
  padding: 1rem;
  max-width: 720px;
  margin: 0 auto;
}

h1 { font-size: 1.8rem; font-weight: 900; margin: 2rem 0 1rem; color: #1a1a2e; border-bottom: 2px solid #7c3aed; padding-bottom: 0.5rem; }
h2 { font-size: 1.4rem; font-weight: 700; margin: 1.5rem 0 0.75rem; color: #4f46e5; }
h3 { font-size: 1.1rem; font-weight: 600; margin: 1rem 0 0.5rem; color: #6d28d9; }

p { margin: 0.75rem 0; text-align: justify; }
p.highlight { background: #fef3c7; padding: 0.5rem 0.75rem; border-radius: 0.5rem; border-left: 3px solid #f59e0b; }

/* Word-level highlighting for audio sync */
span.word { transition: background 0.15s; border-radius: 2px; padding: 0 1px; }
span.word.active { background: #c4b5fd; color: #4c1d95; }
span.word.read { color: #6b7280; }

/* Paragraph highlighting */
p.active-para { background: #ede9fe; border-radius: 0.5rem; padding: 0.5rem 0.75rem; }

/* Images */
figure { margin: 1.5rem 0; text-align: center; }
figure img { max-width: 100%; height: auto; border-radius: 0.5rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
figcaption { font-size: 0.85rem; color: #6b7280; margin-top: 0.5rem; font-style: italic; }

/* Tables */
table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.9rem; }
th, td { border: 1px solid #e5e7eb; padding: 0.5rem; text-align: left; }
th { background: #f3f4f6; font-weight: 600; }

/* Lists */
ul, ol { padding-left: 1.5rem; margin: 0.75rem 0; }
li { margin: 0.25rem 0; }

/* Blockquote */
blockquote { border-left: 3px solid #7c3aed; padding: 0.5rem 1rem; margin: 1rem 0; background: #faf5ff; color: #581c87; font-style: italic; }

/* Attribution footer */
.attribution { font-size: 0.75rem; color: #9ca3af; text-align: center; margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #e5e7eb; }

/* Dark mode */
@media (prefers-color-scheme: dark) {
  body { background: #0f0f23; color: #e5e7eb; }
  h1 { color: #e5e7eb; border-color: #7c3aed; }
  h2 { color: #a78bfa; }
  h3 { color: #c4b5fd; }
  th { background: #1e1e3f; }
  th, td { border-color: #374151; }
  span.word.active { background: #5b21b6; color: #ede9fe; }
  p.active-para { background: #1e1b4b; }
  p.highlight { background: #451a03; border-color: #d97706; }
  blockquote { background: #1e1b4b; color: #c4b5fd; }
}
`

/* ── Demo: Generate mock processed book from existing book data ── */
export function generateMockProcessedBook(book: {
  id: number; title: string; subject: string; class: string; author: string; lang: string; pages: number
}): ProcessedBook {
  // Generate mock chapters based on subject
  const chapterCount = Math.max(3, Math.min(15, Math.floor(book.pages / 30)))
  const chapters: EpubChapter[] = Array.from({ length: chapterCount }, (_, i) => {
    const paraCount = 5 + Math.floor(Math.random() * 5)
    const paragraphs: EpubParagraph[] = Array.from({ length: paraCount }, (_, pi) => {
      const text = `This is paragraph ${pi + 1} of chapter ${i + 1} in ${book.title}. The content covers key concepts in ${book.subject} for ${book.class} students.`
      const wordList = text.split(/\s+/)
      return {
        id: `ch${i}-p${pi}`,
        index: pi,
        text,
        words: wordList.map((w, wi) => ({
          text: w,
          index: wi,
          globalIndex: pi * 20 + wi,
          startTime: (pi * 20 + wi) * 0.4,
          endTime: (pi * 20 + wi + 1) * 0.4,
        })),
        startTime: pi * 8,
        endTime: (pi + 1) * 8,
      }
    })
    return {
      id: `chapter-${i + 1}`,
      index: i,
      title: `Chapter ${i + 1}`,
      htmlFile: `text/chapter${i + 1}.html`,
      paragraphs,
      wordCount: paragraphs.reduce((s, p) => s + p.words.length, 0),
      audioFile: `audio/chapter${i + 1}.mp3`,
      audioDuration: paraCount * 8,
    }
  })

  return {
    id: book.id,
    title: book.title,
    author: book.author,
    subject: book.subject,
    class: book.class,
    language: book.lang,
    totalChapters: chapterCount,
    totalWords: chapters.reduce((s, c) => s + c.wordCount, 0),
    totalPages: book.pages,
    epubReady: true,
    audioReady: true,
    chapters,
    css: EPUB_CSS,
    tocHtml: chapters.map(c => `<li><a href="${c.htmlFile}">${c.title}</a></li>`).join('\n'),
    metadata: {
      source: book.author === 'NCERT' ? 'NCERT' : book.author === 'CuriousHat' ? 'CuriousHat' : book.author,
      ocrEngine: 'ai4bharat-indicocr',
      interpretedBy: 'CuriousHat AI',
      attribution: `Original content by ${book.author}. Interpreted and restructured by CuriousHat AI for educational purposes.`,
    },
  }
}
