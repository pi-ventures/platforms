'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import {
  X, BookOpen, Headphones, Play, Pause, SkipBack, SkipForward,
  Bookmark, BookMarked, ChevronLeft, ChevronRight, List, Settings,
  Volume2, Sun, Moon, Type, Minus, Plus, Trash2, Clock, Eye, Languages, Loader2
} from 'lucide-react'
import {
  type ProcessedBook, type BookmarkV2, type ReadingState,
  loadBookmarksV2, saveBookmarkV2, deleteBookmarkV2,
  loadReadingProgress, saveReadingProgress, EPUB_CSS
} from '@/lib/book-pipeline'

/* ── Flow mode for audio sync ── */
type FlowMode = 'word' | 'line' | 'paragraph'
type Theme = 'light' | 'dark' | 'sepia'

const THEMES: Record<Theme, { bg: string; text: string; label: string }> = {
  light: { bg: 'bg-white', text: 'text-gray-900', label: 'Light' },
  dark: { bg: 'bg-gray-950', text: 'text-gray-100', label: 'Dark' },
  sepia: { bg: 'bg-amber-50', text: 'text-amber-950', label: 'Sepia' },
}

interface Props {
  book: ProcessedBook
  onClose: () => void
}

export default function EpubReader({ book, onClose }: Props) {
  const [chapterIdx, setChapterIdx] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [flowMode, setFlowMode] = useState<FlowMode>('word')
  const [theme, setTheme] = useState<Theme>('light')
  const [fontSize, setFontSize] = useState(16)
  const [showToc, setShowToc] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showBookmarks, setShowBookmarks] = useState(false)
  const [bookmarks, setBookmarks] = useState<BookmarkV2[]>(() => loadBookmarksV2(book.id))
  const [activeParaIdx, setActiveParaIdx] = useState(-1)
  const [activeWordIdx, setActiveWordIdx] = useState(-1)
  const [speed, setSpeed] = useState(1.0)
  const [bookmarkFlash, setBookmarkFlash] = useState(false)
  const [mode, setMode] = useState<'read' | 'listen'>('read')
  const [viewMode, setViewMode] = useState<'pages' | 'text' | 'split'>(book.pageImages ? 'pages' : 'text')
  const [currentPage, setCurrentPage] = useState(0)
  const [translateLang, setTranslateLang] = useState('')
  const [translatedParas, setTranslatedParas] = useState<Record<string, string>>({})
  const [translatingPara, setTranslatingPara] = useState<string | null>(null)
  const [showLangPicker, setShowLangPicker] = useState(false)

  const QUICK_LANGS = [
    { code: 'hi', label: 'Hindi', flag: '🇮🇳' },
    { code: 'ta', label: 'Tamil', flag: '🇮🇳' },
    { code: 'te', label: 'Telugu', flag: '🇮🇳' },
    { code: 'bn', label: 'Bengali', flag: '🇮🇳' },
    { code: 'mr', label: 'Marathi', flag: '🇮🇳' },
    { code: 'gu', label: 'Gujarati', flag: '🇮🇳' },
    { code: 'kn', label: 'Kannada', flag: '🇮🇳' },
    { code: 'ml', label: 'Malayalam', flag: '🇮🇳' },
    { code: 'fr', label: 'French', flag: '🇫🇷' },
    { code: 'es', label: 'Spanish', flag: '🇪🇸' },
    { code: 'de', label: 'German', flag: '🇩🇪' },
    { code: 'ja', label: 'Japanese', flag: '🇯🇵' },
    { code: 'ko', label: 'Korean', flag: '🇰🇷' },
    { code: 'ar', label: 'Arabic', flag: '🇸🇦' },
    { code: 'zh-CN', label: 'Chinese', flag: '🇨🇳' },
  ]

  const translateParagraph = async (paraId: string, text: string) => {
    if (!translateLang || translatedParas[paraId]) return
    setTranslatingPara(paraId)
    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, source: 'en', targets: [{ lang: translateLang, code: translateLang }] }),
      })
      if (res.ok) {
        const data = await res.json()
        const translated = data.translations?.[translateLang] || ''
        if (translated) setTranslatedParas(prev => ({ ...prev, [paraId]: translated }))
      }
    } catch { /* silent */ }
    setTranslatingPara(null)
  }

  const speakTranslation = (text: string) => {
    const audio = new Audio(`/api/tts?lang=${translateLang}&text=${encodeURIComponent(text.slice(0, 200))}`)
    audio.play().catch(() => {})
  }

  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)
  const charOffsetRef = useRef(0)
  const contentRef = useRef<HTMLDivElement>(null)

  const chapter = book.chapters[chapterIdx] || book.chapters[0]
  const themeConfig = THEMES[theme]
  // Track last known position so pause doesn't lose it
  const lastParaRef = useRef(0)
  const lastWordRef = useRef(0)

  // Restore reading progress on mount
  useEffect(() => {
    const progress = loadReadingProgress(book.id)
    if (progress) {
      setChapterIdx(progress.chapterIndex)
    }
  }, [book.id])

  // Save reading progress on chapter change
  useEffect(() => {
    saveReadingProgress({
      bookId: book.id,
      chapterIndex: chapterIdx,
      paragraphIndex: activeParaIdx,
      wordIndex: activeWordIdx,
      scrollPosition: 0,
      lastReadAt: Date.now(),
    })
  }, [chapterIdx, activeParaIdx, activeWordIdx, book.id])

  // Stop speech when unmounting or chapter changes
  useEffect(() => {
    return () => { window.speechSynthesis?.cancel() }
  }, [chapterIdx])

  /* ── TTS Engine ── */
  const speakChapter = useCallback((fromPara = 0, fromWord = 0) => {
    if (!window.speechSynthesis || !chapter) return
    window.speechSynthesis.cancel()

    // Build text from the starting point
    let text = ''
    let wordMap: { paraIdx: number; wordIdx: number; charStart: number; charEnd: number }[] = []
    let charPos = 0

    for (let pi = fromPara; pi < chapter.paragraphs.length; pi++) {
      const para = chapter.paragraphs[pi]
      const startWord = pi === fromPara ? fromWord : 0
      for (let wi = startWord; wi < para.words.length; wi++) {
        const w = para.words[wi].text
        const start = charPos
        text += w + ' '
        charPos = text.length
        wordMap.push({ paraIdx: pi, wordIdx: wi, charStart: start, charEnd: charPos - 1 })
      }
    }

    if (!text.trim()) return

    const utter = new SpeechSynthesisUtterance(text)
    utter.rate = speed
    utter.lang = book.language === 'Hindi' ? 'hi' : book.language === 'Tamil' ? 'ta' : 'en'

    let wasCancelled = false

    utter.onboundary = (e) => {
      if (e.name !== 'word') return
      charOffsetRef.current = e.charIndex
      const match = wordMap.find(m => e.charIndex >= m.charStart && e.charIndex <= m.charEnd)
      if (match) {
        setActiveParaIdx(match.paraIdx)
        setActiveWordIdx(match.wordIdx)
        lastParaRef.current = match.paraIdx
        lastWordRef.current = match.wordIdx
        // Auto-scroll to active word in text view
        if (viewMode === 'text' || viewMode === 'split') {
          const el = document.getElementById(`word-${chapterIdx}-${match.paraIdx}-${match.wordIdx}`)
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }

    utter.onend = () => {
      setIsPlaying(false)
      if (!wasCancelled) {
        // Natural end — reset and advance
        setActiveParaIdx(-1)
        setActiveWordIdx(-1)
        if (chapterIdx < book.chapters.length - 1) {
          setChapterIdx(i => i + 1)
        }
      }
      // If cancelled (pause), keep position via lastParaRef/lastWordRef
    }

    // Track cancellation
    const origCancel = window.speechSynthesis.cancel.bind(window.speechSynthesis)
    window.speechSynthesis.cancel = () => { wasCancelled = true; origCancel() }

    utterRef.current = utter
    window.speechSynthesis.speak(utter)
    setIsPlaying(true)
    setMode('listen')
  }, [chapter, speed, book.language, book.chapters.length, chapterIdx])

  const pauseSpeech = () => {
    // Save current position before cancelling
    lastParaRef.current = activeParaIdx >= 0 ? activeParaIdx : lastParaRef.current
    lastWordRef.current = activeWordIdx >= 0 ? activeWordIdx : lastWordRef.current
    window.speechSynthesis?.cancel()
    setIsPlaying(false)
  }

  const togglePlay = () => {
    if (isPlaying) {
      pauseSpeech()
    } else {
      // Resume from last known position
      const fromPara = activeParaIdx >= 0 ? activeParaIdx : lastParaRef.current
      const fromWord = activeWordIdx >= 0 ? activeWordIdx : lastWordRef.current
      speakChapter(fromPara, fromWord)
    }
  }

  /* ── Bookmarks ── */
  const addBookmark = () => {
    if (!chapter) return
    const paraIdx = activeParaIdx >= 0 ? activeParaIdx : 0
    const para = chapter.paragraphs[paraIdx]
    const pageLabel = viewMode === 'pages' ? `Page ${currentPage + 1}` : ''
    const preview = para?.text?.slice(0, 50) || chapter.title || 'Bookmark'
    const bm: BookmarkV2 = {
      id: `bm-${Date.now()}`,
      bookId: book.id,
      bookTitle: book.title,
      label: `${pageLabel ? pageLabel + ' · ' : ''}${chapter.title} — ${mode === 'listen' ? 'Listening' : 'Reading'}`,
      type: mode,
      chapterIndex: chapterIdx,
      chapterTitle: chapter.title,
      paragraphIndex: paraIdx,
      wordIndex: activeWordIdx >= 0 ? activeWordIdx : 0,
      scrollPct: contentRef.current ? Math.round((contentRef.current.scrollTop / Math.max(contentRef.current.scrollHeight, 1)) * 100) : currentPage,
      createdAt: Date.now(),
      preview: preview + '…',
    }
    saveBookmarkV2(bm)
    setBookmarks(loadBookmarksV2(book.id))
    setBookmarkFlash(true)
    setTimeout(() => setBookmarkFlash(false), 1000)
  }

  const resumeBookmark = (bm: BookmarkV2) => {
    setChapterIdx(bm.chapterIndex)
    setShowBookmarks(false)
    // For PDF view, jump to the page
    if (viewMode === 'pages' && book.pageChapterMap) {
      const pageIdx = book.pageChapterMap.indexOf(bm.chapterIndex)
      if (pageIdx >= 0) setCurrentPage(pageIdx)
    }
    setTimeout(() => {
      if (bm.type === 'listen') {
        speakChapter(bm.paragraphIndex, bm.wordIndex)
      } else {
        setActiveParaIdx(bm.paragraphIndex)
        if (viewMode === 'text' || viewMode === 'split') {
          const el = document.getElementById(`para-${bm.chapterIndex}-${bm.paragraphIndex}`)
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }, 200)
  }

  const removeBm = (id: string) => {
    deleteBookmarkV2(id)
    setBookmarks(loadBookmarksV2(book.id))
  }

  /* ── Navigation ── */
  const goChapter = (idx: number) => {
    if (idx < 0 || idx >= book.chapters.length) return
    pauseSpeech()
    setChapterIdx(idx)
    setActiveParaIdx(-1)
    setActiveWordIdx(-1)
    setShowToc(false)
    contentRef.current?.scrollTo(0, 0)
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col">
      {/* ── Top bar ── */}
      <div className={`flex items-center gap-2 px-3 py-2 border-b border-gray-200 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : theme === 'sepia' ? 'bg-amber-100 border-amber-200' : 'bg-white'}`}>
        <button onClick={onClose} className="p-1.5 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100">
          <X className="w-4 h-4" />
        </button>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-bold truncate ${themeConfig.text}`}>{book.title}</p>
          <p className="text-[10px] text-gray-400">Ch {chapterIdx + 1}/{book.totalChapters} · {chapter?.title}</p>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowBookmarks(v => !v)}
            className={`p-1.5 rounded-lg transition-colors ${bookmarkFlash ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:text-violet-600 hover:bg-violet-50'}`}>
            {bookmarks.length > 0 ? <BookMarked className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
          <button onClick={() => setShowToc(v => !v)} className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg">
            <List className="w-4 h-4" />
          </button>
          <button onClick={() => setShowSettings(v => !v)} className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg">
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Settings panel ── */}
      {showSettings && (
        <div className={`px-4 py-3 border-b ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Type className="w-3.5 h-3.5 text-gray-400" />
              <button onClick={() => setFontSize(s => Math.max(12, s - 2))} className="p-1 bg-white border rounded"><Minus className="w-3 h-3" /></button>
              <span className="text-xs text-gray-600 w-6 text-center">{fontSize}</span>
              <button onClick={() => setFontSize(s => Math.min(28, s + 2))} className="p-1 bg-white border rounded"><Plus className="w-3 h-3" /></button>
            </div>
            <div className="flex items-center gap-1">
              {(['light', 'dark', 'sepia'] as Theme[]).map(t => (
                <button key={t} onClick={() => setTheme(t)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-all ${theme === t ? 'ring-2 ring-violet-500' : ''} ${
                    t === 'light' ? 'bg-white text-gray-900 border' : t === 'dark' ? 'bg-gray-900 text-white' : 'bg-amber-100 text-amber-900'
                  }`}>
                  {t === 'light' ? <Sun className="w-3 h-3" /> : t === 'dark' ? <Moon className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400">Flow:</span>
              {(['word', 'line', 'paragraph'] as FlowMode[]).map(m => (
                <button key={m} onClick={() => setFlowMode(m)}
                  className={`px-2 py-1 rounded text-[10px] font-medium ${flowMode === m ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 border'}`}>
                  {m}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400">Speed:</span>
              {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => (
                <button key={s} onClick={() => setSpeed(s)}
                  className={`px-1.5 py-1 rounded text-[10px] font-medium ${speed === s ? 'bg-violet-600 text-white' : 'bg-white text-gray-600 border'}`}>
                  {s}x
                </button>
              ))}
            </div>
            {/* Translate language */}
            <div className="flex items-center gap-1.5">
              <Languages className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-[10px] text-gray-400">Translate:</span>
              {translateLang ? (
                <div className="flex items-center gap-1">
                  <span className="text-[10px] font-semibold text-violet-600">{QUICK_LANGS.find(l => l.code === translateLang)?.label || translateLang}</span>
                  <button onClick={() => { setTranslateLang(''); setTranslatedParas({}) }} className="text-[9px] text-red-400 hover:text-red-600">✕</button>
                </div>
              ) : (
                <div className="flex flex-wrap gap-1">
                  {QUICK_LANGS.slice(0, 8).map(l => (
                    <button key={l.code} onClick={() => setTranslateLang(l.code)}
                      className="text-[10px] bg-white border border-gray-200 px-1.5 py-0.5 rounded text-gray-600 hover:border-violet-300 hover:text-violet-600">
                      {l.flag} {l.label}
                    </button>
                  ))}
                  <button onClick={() => setShowLangPicker(v => !v)} className="text-[10px] text-violet-600 font-semibold">+more</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full language picker */}
      {showLangPicker && (
        <div className={`px-4 py-2 border-b flex flex-wrap gap-1 ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
          {QUICK_LANGS.map(l => (
            <button key={l.code} onClick={() => { setTranslateLang(l.code); setShowLangPicker(false); setTranslatedParas({}) }}
              className={`text-[10px] px-2 py-1 rounded-lg border transition-colors ${translateLang === l.code ? 'bg-violet-600 text-white border-violet-600' : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'}`}>
              {l.flag} {l.label}
            </button>
          ))}
        </div>
      )}

      {/* ── TOC slide-out ── */}
      {showToc && (
        <div className={`absolute top-12 left-0 bottom-16 w-64 z-40 border-r shadow-lg overflow-y-auto ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="p-3">
            <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Chapters</p>
            {book.chapters.map((ch, i) => (
              <button key={i} onClick={() => goChapter(i)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs mb-0.5 transition-colors ${
                  chapterIdx === i
                    ? 'bg-violet-100 text-violet-700 font-bold'
                    : theme === 'dark' ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
                }`}>
                <span className="text-gray-400 mr-1.5">{i + 1}.</span>{ch.title}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Bookmarks panel ── */}
      {showBookmarks && (
        <div className={`absolute top-12 right-0 bottom-16 w-72 z-40 border-l shadow-lg overflow-y-auto ${
          theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="p-3">
            <div className="flex items-center justify-between mb-3">
              <p className={`text-xs font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Bookmarks ({bookmarks.length}/10)
              </p>
              <button onClick={addBookmark} className="text-[10px] font-semibold text-violet-600 hover:underline">+ Add here</button>
            </div>
            {bookmarks.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-8">No bookmarks yet. Click &ldquo;+ Add here&rdquo; to save your place.</p>
            )}
            {bookmarks.map(bm => (
              <div key={bm.id} className={`mb-2 p-2.5 rounded-lg border ${
                bm.type === 'listen' ? 'bg-teal-50 border-teal-200' : 'bg-violet-50 border-violet-200'
              }`}>
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                    bm.type === 'listen' ? 'bg-teal-600 text-white' : 'bg-violet-600 text-white'
                  }`}>{bm.type === 'listen' ? '🎧 Listen' : '📖 Read'}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => resumeBookmark(bm)} className="text-[10px] text-violet-600 font-semibold hover:underline">Resume</button>
                    <button onClick={() => removeBm(bm.id)} className="p-0.5 text-gray-300 hover:text-red-500"><Trash2 className="w-3 h-3" /></button>
                  </div>
                </div>
                <p className="text-[10px] font-semibold text-gray-700">{bm.chapterTitle}</p>
                <p className="text-[10px] text-gray-400 truncate">{bm.preview}</p>
                <p className="text-[9px] text-gray-300 mt-1 flex items-center gap-1">
                  <Clock className="w-2.5 h-2.5" /> {new Date(bm.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Content area — Dual mode: PDF pages (primary) + Text (for audio/translate) ── */}
      <div ref={contentRef}
        className={`flex-1 overflow-y-auto overflow-x-hidden ${themeConfig.bg} ${themeConfig.text}`}
        style={{ fontSize: `${fontSize}px`, minHeight: 0 }}
        onClick={() => { setShowToc(false); setShowBookmarks(false); setShowSettings(false) }}>

        {/* ── View toggle: Original Pages vs Text View ── */}
        <div className="sticky top-0 z-10 px-4 py-1.5 border-b border-gray-100 bg-white/90 backdrop-blur-sm flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            <button onClick={() => setViewMode('pages')}
              className={`px-3 py-1 rounded text-[10px] font-semibold transition-colors ${viewMode === 'pages' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500'}`}>
              Original Pages
            </button>
            <button onClick={() => setViewMode('text')}
              className={`px-3 py-1 rounded text-[10px] font-semibold transition-colors ${viewMode === 'text' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500'}`}>
              Text View
            </button>
            <button onClick={() => setViewMode('split')}
              className={`px-3 py-1 rounded text-[10px] font-semibold transition-colors hidden md:block ${viewMode === 'split' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500'}`}>
              Split View
            </button>
          </div>
          {viewMode === 'pages' && book.pageImages && (
            <span className="text-[10px] text-gray-400 ml-auto">Page {currentPage + 1} / {book.pageImages.length}</span>
          )}
        </div>

        <div className={`${viewMode === 'split' ? 'flex gap-0' : ''}`}>
          {/* ── Original PDF Pages View ── */}
          {(viewMode === 'pages' || viewMode === 'split') && book.pageImages && (
            <div className={`${viewMode === 'split' ? 'w-1/2 border-r border-gray-200' : 'w-full'}`}>
              {/* PDF embedded viewer — shows the original book with all images, colors, layout */}
              <div className="relative" style={{ height: 'calc(100vh - 160px)' }}>
                <iframe
                  key={currentPage}
                  src={`${book.pageImages[0]}#page=${currentPage + 1}&view=FitH`}
                  className="w-full h-full border-0"
                  title={`${book.title} — Page ${currentPage + 1}`}
                  allow="fullscreen"
                />
                {/* Floating page controls */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/70 text-white rounded-full px-4 py-2 shadow-lg backdrop-blur-sm">
                  <button onClick={() => setCurrentPage(p => Math.max(0, p - 1))} disabled={currentPage === 0}
                    className="p-1 disabled:opacity-30 hover:bg-white/20 rounded-full"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs font-mono min-w-[60px] text-center">{currentPage + 1} / {book.pageImages.length}</span>
                  <button onClick={() => setCurrentPage(p => Math.min((book.pageImages?.length || 1) - 1, p + 1))} disabled={currentPage >= (book.pageImages?.length || 1) - 1}
                    className="p-1 disabled:opacity-30 hover:bg-white/20 rounded-full"><ChevronRight className="w-4 h-4" /></button>
                  <div className="w-px h-4 bg-white/30" />
                  <button onClick={() => addBookmark()} className="p-1 hover:bg-white/20 rounded-full" title="Bookmark">
                    <Bookmark className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { if (book.pageChapterMap) setChapterIdx(book.pageChapterMap[currentPage]); speakChapter() }}
                    className="p-1 hover:bg-white/20 rounded-full" title="Listen to this page">
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setViewMode('text')} className="p-1 hover:bg-white/20 rounded-full" title="Switch to text view">
                    <Type className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Text View (for audio sync, translation, accessibility) ── */}
          {(viewMode === 'text' || viewMode === 'split') && (
            <div className={`${viewMode === 'split' ? 'w-1/2 overflow-y-auto' : ''} px-4 sm:px-8 py-6`}>
              <div className="max-w-2xl mx-auto">
                {book.chapters.map((ch, ci) => (
                  <div key={ch.id} id={`chapter-section-${ci}`} className={`mb-10 ${ci !== chapterIdx ? 'opacity-50' : ''}`}>
                    <h2 className={`text-lg sm:text-xl font-black mb-4 pb-2 border-b-2 cursor-pointer hover:text-violet-600 ${
                      ci === chapterIdx ? 'border-violet-300 text-gray-900' : 'border-gray-200 text-gray-400'
                    }`} onClick={() => { setChapterIdx(ci); setActiveParaIdx(-1); setActiveWordIdx(-1) }}>
                      <span className="text-[10px] font-mono text-violet-500 mr-1.5">Ch {ci + 1}</span>
                      {ch.title}
                    </h2>

                    {ch.paragraphs.map((para, pi) => (
                      <div key={para.id} className="mb-3">
                        <p id={`para-${ci}-${pi}`}
                          className={`leading-relaxed transition-all duration-200 rounded-lg text-sm ${
                            flowMode === 'paragraph' && ci === chapterIdx && activeParaIdx === pi ? 'bg-violet-50 px-3 py-2' : ''
                          }`}>
                          {para.words.map((word, wi) => (
                            <span key={`${ci}-${pi}-${wi}`} id={`word-${ci}-${pi}-${wi}`}
                              className={`inline transition-colors duration-150 ${
                                flowMode === 'word' && ci === chapterIdx && activeParaIdx === pi && activeWordIdx === wi
                                  ? 'bg-violet-300 text-violet-900 rounded px-0.5' : ''
                              } ${ci === chapterIdx && (activeParaIdx > pi || (activeParaIdx === pi && activeWordIdx > wi))
                                  ? 'text-gray-400' : ''
                              }`}>
                              {word.text}{' '}
                            </span>
                          ))}
                        </p>
                        {/* Inline translation */}
                        {translateLang && (
                          <div className="mt-1 flex items-start gap-2 text-teal-700">
                            {translatedParas[para.id] ? (
                              <div className="flex-1 text-xs italic px-3 py-1.5 rounded-lg bg-teal-50">
                                <div className="flex items-center gap-1.5 mb-0.5">
                                  <Languages className="w-3 h-3 flex-shrink-0" />
                                  <span className="text-[9px] font-bold uppercase tracking-wider opacity-60">
                                    {QUICK_LANGS.find(l => l.code === translateLang)?.label}
                                  </span>
                                  <button onClick={() => speakTranslation(translatedParas[para.id])}
                                    className="ml-auto p-0.5 opacity-60 hover:opacity-100"><Volume2 className="w-3 h-3" /></button>
                                </div>
                                <span dir={['ar', 'fa', 'he'].includes(translateLang) ? 'rtl' : 'ltr'}>{translatedParas[para.id]}</span>
                              </div>
                            ) : (
                              <button onClick={() => translateParagraph(para.id, para.text)}
                                disabled={translatingPara === para.id}
                                className="flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-lg text-teal-600 hover:bg-teal-50">
                                {translatingPara === para.id
                                  ? <><Loader2 className="w-3 h-3 animate-spin" /> Translating…</>
                                  : <><Languages className="w-3 h-3" /> Translate</>}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-400">
                  <p>{book.metadata.attribution}</p>
                  <p className="mt-1">Interpreted by <span className="text-violet-500 font-semibold">CuriousHat AI</span></p>
                </div>
              </div>
            </div>
          )}

          {/* No page images — show text only with note */}
          {viewMode === 'pages' && !book.pageImages && (
            <div className="px-4 sm:px-8 py-6">
              <div className="max-w-2xl mx-auto text-center py-20 text-gray-400">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p className="font-medium text-gray-500">Original pages not available yet</p>
                <p className="text-sm mt-1">Switch to Text View to read the extracted content</p>
                <button onClick={() => setViewMode('text')} className="mt-3 text-sm text-violet-600 font-semibold hover:underline">Switch to Text View</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom player bar ── */}
      <div className={`flex items-center gap-2 px-3 py-2 border-t ${
        theme === 'dark' ? 'bg-gray-900 border-gray-800' : theme === 'sepia' ? 'bg-amber-100 border-amber-200' : 'bg-white border-gray-200'
      }`}>
        {/* Chapter nav */}
        <button onClick={() => goChapter(chapterIdx - 1)} disabled={chapterIdx === 0}
          className="p-1.5 text-gray-400 hover:text-violet-600 disabled:opacity-30 rounded-lg">
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Play/pause */}
        <button onClick={togglePlay}
          className="w-10 h-10 flex items-center justify-center bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors shadow-md flex-shrink-0">
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        {/* Chapter nav */}
        <button onClick={() => goChapter(chapterIdx + 1)} disabled={chapterIdx === book.chapters.length - 1}
          className="p-1.5 text-gray-400 hover:text-violet-600 disabled:opacity-30 rounded-lg">
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Progress */}
        <div className="flex-1 min-w-0 mx-2">
          <div className="flex items-center justify-between mb-0.5">
            <span className="text-[10px] text-gray-400 truncate">{chapter?.title}</span>
            <span className="text-[10px] text-gray-400 flex-shrink-0">{chapterIdx + 1}/{book.totalChapters}</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-violet-600 rounded-full transition-all"
              style={{ width: `${chapter ? ((activeParaIdx >= 0 ? activeParaIdx : 0) / Math.max(chapter.paragraphs.length, 1)) * 100 : 0}%` }} />
          </div>
        </div>

        {/* Bookmark */}
        <button onClick={addBookmark}
          className={`p-1.5 rounded-lg transition-colors flex-shrink-0 ${
            bookmarkFlash ? 'text-amber-500 bg-amber-50' : 'text-gray-400 hover:text-amber-500 hover:bg-amber-50'
          }`} title="Add bookmark">
          <Bookmark className="w-4 h-4" />
        </button>

        {/* Mode toggle */}
        <div className="flex items-center bg-gray-100 rounded-lg p-0.5 flex-shrink-0">
          <button onClick={() => { setMode('read'); pauseSpeech() }}
            className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${mode === 'read' ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500'}`}>
            <BookOpen className="w-3 h-3" />
          </button>
          <button onClick={() => { setMode('listen'); if (!isPlaying) speakChapter() }}
            className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${mode === 'listen' ? 'bg-white text-teal-700 shadow-sm' : 'text-gray-500'}`}>
            <Headphones className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}
