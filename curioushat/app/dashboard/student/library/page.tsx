'use client'
import { useState, useMemo } from 'react'
import { Search, BookOpen, Download, Eye, X, ChevronRight, SlidersHorizontal, LayoutGrid, List, Brain, Headphones, Sparkles, Award, Languages } from 'lucide-react'
import AITutorPanel, { type Book as TutorBook } from '@/components/dashboard/AITutorPanel'
import AudioBookPlayer from '@/components/dashboard/AudioBookPlayer'
import EpubReader from '@/components/dashboard/EpubReader'
import { DOMAINS, BROWSE_DATA, ALL_BOOKS, RESOURCE_TYPES, CONTENT_PROVIDERS, SUBJECT_COLORS, SUBJECT_ICONS, subjectColor, LANGUAGE_ZONES } from '@/lib/library-data'
import { generateMockProcessedBook } from '@/lib/book-pipeline'
import { SAMPLE_BOOK } from '@/lib/sample-book'

const PLAN = { aiTutor: true }

/* ─── Book card ─── */
function BookCard({ book, view, onAskAI, onListen, onRead }: {
  book: typeof ALL_BOOKS[number]; view: 'grid' | 'list'
  onAskAI: (b: typeof ALL_BOOKS[number]) => void
  onListen: (b: typeof ALL_BOOKS[number]) => void
  onRead: (b: typeof ALL_BOOKS[number]) => void
}) {
  const color = subjectColor(book.subject)
  const cert = 'cert' in book ? (book as any).cert as string | undefined : undefined
  const isSample = book.id === 9999
  if (view === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-xl flex items-center gap-4 px-4 py-3 hover:border-violet-300 hover:shadow-sm transition-all">
        <div className="w-10 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '18', border: `2px solid ${color}30` }}>
          <BookOpen className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{book.title}</p>
          <p className="text-xs text-gray-400">{book.author} · {book.class} · {book.board} · {book.lang}</p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <p className="text-[9px] text-violet-500 flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" />Interpreted by CuriousHat AI</p>
            {cert && <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full flex items-center gap-0.5 font-medium"><Award className="w-2.5 h-2.5" />{cert}</span>}
            {isSample && <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.5 rounded-full font-bold animate-pulse">★ SAMPLE</span>}
          </div>
        </div>
        <span className="text-xs border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full hidden sm:block">{book.type}</span>
        <div className="flex gap-1.5 flex-shrink-0">
          <button onClick={() => onAskAI(book)} title="Ask AI · Pro" className="relative p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Brain className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 text-[8px] font-bold leading-none px-0.5 py-px rounded bg-amber-400 text-white">★</span>
          </button>
          <button onClick={() => onRead(book)} className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Read"><Eye className="w-4 h-4" /></button>
          <button onClick={() => onListen(book)} title="Listen — Audiobook" className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"><Headphones className="w-4 h-4" /></button>
          <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Download"><Download className="w-4 h-4" /></button>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-violet-300 hover:shadow-sm transition-all group">
      <div className={`h-32 flex items-center justify-center relative ${isSample ? 'ring-2 ring-emerald-400' : ''}`} style={{ backgroundColor: color + '10', borderBottom: `3px solid ${isSample ? '#10b981' : color}` }}>
        <BookOpen className="w-10 h-10" style={{ color }} />
        <span className="absolute top-2 right-2 text-xs bg-white border border-gray-200 text-gray-500 px-1.5 py-0.5 rounded-full">{book.type}</span>
        {isSample && (
          <span className="absolute top-2 left-2 text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">
            ★ SAMPLE — Test All Features
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{book.title}</p>
        <p className="text-xs text-gray-400 mb-0.5">{book.class} · {book.board}</p>
        <p className="text-xs text-gray-400 mb-1">{book.author} · {book.pages}pp</p>
        <p className="text-[9px] text-violet-500 mb-1 flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" />Interpreted by CuriousHat AI · Source: {book.author}</p>
        {cert && <p className="text-[8px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded-full mb-1 inline-flex items-center gap-0.5 font-medium w-fit"><Award className="w-2.5 h-2.5" />{cert}</p>}
        <div className="flex gap-1">
          <button onClick={() => onAskAI(book)} title="Ask AI" className="relative flex items-center justify-center gap-1 px-1.5 sm:px-2 border border-purple-200 text-purple-600 text-xs font-medium py-1.5 rounded-lg hover:bg-purple-50 transition-colors flex-1">
            <Brain className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Ask AI</span>
            <span className="text-[7px] font-bold px-0.5 rounded bg-amber-400 text-white leading-tight absolute -top-1 -right-1">★</span>
          </button>
          <button onClick={() => onRead(book)} title="Read" className="flex items-center justify-center gap-1 px-1.5 sm:px-2 border border-gray-200 text-gray-600 text-xs font-medium py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex-1">
            <Eye className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Read</span>
          </button>
          <button onClick={() => onListen(book)} title="Listen" className="flex items-center justify-center gap-1 px-1.5 sm:px-2 border border-teal-200 text-teal-600 text-xs font-medium py-1.5 rounded-lg hover:bg-teal-50 transition-colors flex-1">
            <Headphones className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Listen</span>
          </button>
          <button title="Download" className="flex items-center justify-center px-2 text-xs font-medium py-1.5 rounded-lg transition-colors text-white flex-shrink-0" style={{ backgroundColor: color }}>
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Expandable browse panel — original minimal 3-col grid ─── */
function BrowsePanel({
  icon, label, items, itemCount, onSelect,
  expandedItem, onExpandItem, langMap, onLangSelect,
  aiTutor = false, onAiTutor, paid = false, iconMap,
}: {
  icon: string; label: string; items: string[]; itemCount: number
  onSelect: (v: string) => void
  expandedItem: string | null; onExpandItem: (v: string | null) => void
  langMap?: Record<string, string[]>; onLangSelect?: (subject: string, lang: string) => void
  aiTutor?: boolean; onAiTutor?: (subject: string) => void
  paid?: boolean; iconMap?: Record<string, string>
  [key: string]: unknown
}) {
  const [showMore, setShowMore] = useState(false)
  const preview = showMore ? items : items.slice(0, 15)
  const expandedLangs = expandedItem ? (langMap?.[expandedItem] || []) : []

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <h3 className="font-bold text-gray-900 text-sm">{label}</h3>
        {paid && (
          <span className="flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
            ★ Pro
          </span>
        )}
        <span className="ml-auto text-xs text-gray-400">{itemCount} items</span>
      </div>
      <div className="p-4">
        {/* Responsive grid — 2 cols on mobile, 3 on sm+ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-2 gap-y-1.5">
          {preview.map(item => {
            const langs = langMap?.[item] || []
            const isExpanded = expandedItem === item
            return (
              <button key={item}
                onClick={() => {
                  if (aiTutor) { onAiTutor?.(item); return }
                  if (langs.length > 1) {
                    onExpandItem(isExpanded ? null : item)
                  } else {
                    onSelect(item)
                  }
                }}
                className={`flex items-center gap-1.5 text-xs text-left transition-colors group ${isExpanded ? 'text-violet-600' : 'text-gray-700 hover:text-violet-600'}`}
              >
                {iconMap?.[item]
                  ? <span className="text-sm leading-none flex-shrink-0">{iconMap[item]}</span>
                  : <ChevronRight className={`w-2.5 h-2.5 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-90 text-violet-500' : 'text-gray-300 group-hover:text-violet-500'}`} />
                }
                <span className="truncate">{item}</span>
              </button>
            )
          })}
        </div>

        {/* Language expansion — shown below grid when an item is clicked */}
        {expandedItem && expandedLangs.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-[10px] text-gray-400 mb-2 font-medium uppercase tracking-wide">{expandedItem} — available in</p>
            <div className="flex flex-wrap gap-1">
              <button
                onClick={() => { onSelect(expandedItem); onExpandItem(null) }}
                className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 hover:bg-violet-100 hover:text-violet-700 transition-colors"
              >All languages</button>
              {expandedLangs.map(l => (
                <button key={l}
                  onClick={() => { onLangSelect?.(expandedItem, l); onExpandItem(null) }}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-violet-50 text-violet-600 hover:bg-violet-100 border border-violet-100 transition-colors"
                >{l}</button>
              ))}
            </div>
          </div>
        )}

        {/* More — inline expandable */}
        {itemCount > 15 && (
          <button
            onClick={() => setShowMore(v => !v)}
            className="mt-3 flex items-center gap-1 text-xs text-violet-600 hover:underline font-medium"
          >
            <ChevronRight className={`w-3 h-3 transition-transform ${showMore ? 'rotate-90' : ''}`} />
            {showMore ? 'Show less' : `More`}
          </button>
        )}
      </div>
    </div>
  )
}

/* ─── Main component ─── */
export default function StudentLibraryPage() {
  const [domain, setDomain] = useState('School Education')
  const [browseMode, setBrowseMode] = useState(false)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ subject: '', level: '', language: '', board: '', type: '', provider: '' })
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(true)
  const [tutorBook, setTutorBook] = useState<TutorBook | null>(null)
  const [audioBook, setAudioBook] = useState<TutorBook | null>(null)
  const [readerBook, setReaderBook] = useState<ReturnType<typeof generateMockProcessedBook> | null>(null)
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null)
  const [expandedLevel, setExpandedLevel] = useState<string | null>(null)

  const langsBySubject = useMemo(() => {
    const map: Record<string, string[]> = {}
    ALL_BOOKS.forEach(b => {
      if (!map[b.subject]) map[b.subject] = []
      if (!map[b.subject].includes(b.lang)) map[b.subject].push(b.lang)
    })
    return map
  }, [])

  const langsByClass = useMemo(() => {
    const map: Record<string, string[]> = {}
    ALL_BOOKS.forEach(b => {
      if (!map[b.class]) map[b.class] = []
      if (!map[b.class].includes(b.lang)) map[b.class].push(b.lang)
    })
    return map
  }, [])

  const setFilter = (k: keyof typeof filters, v: string) => {
    setFilters(f => ({ ...f, [k]: f[k] === v ? '' : v }))
    setBrowseMode(true)
  }

  const clearFilters = () => {
    setFilters({ subject: '', level: '', language: '', board: '', type: '', provider: '' })
    setSearch('')
    setBrowseMode(false)
  }

  const openTutorForSubject = (subject: string) => {
    setTutorBook({ id: 0, title: subject, subject, class: 'General', board: 'CBSE', author: 'CuriousHat AI', lang: 'English', type: 'Study Guide', pages: 0 })
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length + (search ? 1 : 0)

  const filtered = ALL_BOOKS.filter(b => {
    if (search && !b.title.toLowerCase().includes(search.toLowerCase()) && !b.subject.toLowerCase().includes(search.toLowerCase())) return false
    if (filters.subject && b.subject !== filters.subject) return false
    if (filters.level && b.class !== filters.level) return false
    if (filters.board && b.board !== filters.board && !b.board.toLowerCase().includes(filters.board.toLowerCase())) return false
    if (filters.type && b.type !== filters.type) return false
    if (filters.language && b.lang !== filters.language) return false
    return true
  })

  return (
    <div className="max-w-6xl mx-auto">
      {tutorBook && <AITutorPanel book={tutorBook} onClose={() => setTutorBook(null)} enabled={PLAN.aiTutor} role="student" />}
      {audioBook && <AudioBookPlayer book={audioBook} onClose={() => setAudioBook(null)} />}
      {readerBook && <EpubReader book={readerBook} onClose={() => setReaderBook(null)} />}

      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">Welcome, Om Aditya Raghuvanshi</h1>
        <p className="text-gray-500 mt-1 text-sm">NCERT &amp; board textbooks, reference books and learning resources — all classes, all subjects</p>
      </div>

      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 overflow-x-auto w-full sm:w-fit scrollbar-none">
        {DOMAINS.map(d => (
          <button key={d} onClick={() => { setDomain(d); clearFilters() }}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${domain === d ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {d}
          </button>
        ))}
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => { setSearch(e.target.value); setBrowseMode(!!e.target.value) }}
          placeholder="Search books, subjects, authors…"
          className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none bg-white shadow-sm"
        />
        {search && <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
      </div>

      {!browseMode && (
        <>
          {/* ── School Education / Higher Education / default domain ── */}
          {(domain === 'School Education' || domain === 'Vocational') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <BrowsePanel
                icon="≡" label="Subjects" items={BROWSE_DATA.subjects} itemCount={BROWSE_DATA.subjects.length}
                filterKey="subject" onSelect={v => setFilter('subject', v)}
                expandedItem={expandedSubject} onExpandItem={setExpandedSubject}
                langMap={langsBySubject}
                onLangSelect={(subject, lang) => { setFilter('subject', subject); setFilter('language', lang) }}
                iconMap={SUBJECT_ICONS}
              />
              <BrowsePanel
                icon="🎓" label="Educational Levels" items={BROWSE_DATA.levels} itemCount={BROWSE_DATA.levels.length}
                filterKey="level" onSelect={v => setFilter('level', v)}
                expandedItem={expandedLevel} onExpandItem={setExpandedLevel}
                langMap={langsByClass}
                onLangSelect={(level, lang) => { setFilter('level', level); setFilter('language', lang) }}
              />
              <BrowsePanel
                icon="🧠" label="AI Tutor" items={BROWSE_DATA.subjects} itemCount={BROWSE_DATA.subjects.length}
                onSelect={() => {}}
                expandedItem={null} onExpandItem={() => {}}
                aiTutor onAiTutor={openTutorForSubject}
                paid iconMap={SUBJECT_ICONS}
              />
              <BrowsePanel
                icon="🌐" label="Learn Languages" items={Object.values(LANGUAGE_ZONES).flatMap(z => z.languages as unknown as string[])}
                itemCount={Object.values(LANGUAGE_ZONES).reduce((s, z) => s + z.languages.length, 0)}
                onSelect={() => { window.location.href = '/dashboard/student/learn-languages' }}
                expandedItem={null} onExpandItem={() => {}}
                iconMap={SUBJECT_ICONS}
              />
            </div>
          )}

          {/* ── Languages domain — Translator + Books ── */}
          {domain === 'Languages' && (
            <>
              {/* Embedded Translator */}
              <div className="mb-6">
                <iframe src="/dashboard/student/learn-languages" className="w-full border border-gray-200 rounded-2xl shadow-sm" style={{ height: 'calc(100vh - 260px)', minHeight: 600 }} />
              </div>

              {/* Language Books below translator */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {Object.entries(LANGUAGE_ZONES).map(([zone, data]) => (
                  <BrowsePanel
                    key={zone}
                    icon={data.emoji} label={`${zone} (${data.languages.length})`}
                    items={data.languages as unknown as string[]}
                    itemCount={data.languages.length}
                    filterKey="language" onSelect={v => setFilter('language', v)}
                    expandedItem={null} onExpandItem={() => {}}
                    iconMap={SUBJECT_ICONS}
                  />
                ))}
                <BrowsePanel
                  icon="🏅" label="Accredited Certifications" items={BROWSE_DATA.certifications} itemCount={BROWSE_DATA.certifications.length}
                  onSelect={() => {}} expandedItem={null} onExpandItem={() => {}}
                />
                <BrowsePanel
                  icon="🧠" label="AI Language Tutor ★ Pro" items={Object.values(LANGUAGE_ZONES).flatMap(z => z.languages as unknown as string[])}
                  itemCount={Object.values(LANGUAGE_ZONES).reduce((s, z) => s + z.languages.length, 0)}
                  onSelect={() => {}}
                  expandedItem={null} onExpandItem={() => {}}
                  aiTutor onAiTutor={openTutorForSubject}
                  paid
                  iconMap={SUBJECT_ICONS}
                />
              </div>
            </>
          )}

          {/* ── Music & Performing Arts domain ── */}
          {domain === 'Music & Performing Arts' && (
            <>
              <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🎵</div>
                  <div>
                    <h2 className="font-black text-gray-900 text-lg">Music & Performing Arts</h2>
                    <p className="text-sm text-gray-500 mt-1">From Hindustani classical to music production — starting at school level. Certifications through <span className="text-violet-600 font-semibold">Gurukul Global Vidyaniketan</span> from Trinity College London, ABRSM, and London College of Music.</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {['Trinity College London','ABRSM','London College of Music','UGC Recognised','CuriousHat'].map(c => (
                        <span key={c} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <Award className="w-2.5 h-2.5" />{c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <BrowsePanel
                  icon="🎵" label="Music Courses" items={['Hindustani Classical','Carnatic Classical','Western Theory','Music Production','Film Scoring','Rhythm & Percussion','Vocal Training','Instrumental']}
                  itemCount={8}
                  filterKey="subject" onSelect={() => setFilter('subject', 'Music')}
                  expandedItem={null} onExpandItem={() => {}}
                />
                <BrowsePanel
                  icon="🎭" label="Performing Arts" items={['Bharatanatyam','Kathak','Odissi','Kuchipudi','Theatre','Drama','Stagecraft','Folk Dance']}
                  itemCount={8}
                  filterKey="subject" onSelect={() => setFilter('subject', 'Performing Arts')}
                  expandedItem={null} onExpandItem={() => {}}
                />
                <BrowsePanel
                  icon="🎓" label="Levels" items={['Class III–V (Foundation)','Class VI–VIII (Intermediate)','Class IX–X (Advanced)','Class XI–XII (Specialist)','Undergraduate','Postgraduate']}
                  itemCount={6}
                  onSelect={() => {}} expandedItem={null} onExpandItem={() => {}}
                />
                <BrowsePanel
                  icon="🧠" label="AI Music Tutor" items={['Music','Performing Arts','Hindustani Raag','Carnatic','Western Theory','Rhythm']}
                  itemCount={6}
                  onSelect={() => {}} expandedItem={null} onExpandItem={() => {}}
                  aiTutor onAiTutor={openTutorForSubject} paid
                />
              </div>
            </>
          )}

          {/* ── Fashion & Design domain ── */}
          {domain === 'Fashion & Design' && (
            <>
              <div className="mb-6 bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-pink-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0">👗</div>
                  <div>
                    <h2 className="font-black text-gray-900 text-lg">Fashion & Design</h2>
                    <p className="text-sm text-gray-500 mt-1">Higher education fashion courses with industry tie-ups. Certifications through <span className="text-violet-600 font-semibold">Gurukul Global Vidyaniketan</span> from NIFT, Pearl Academy, and Parsons affiliate programmes.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <BrowsePanel icon="👗" label="Fashion Courses" items={['Fashion Design Fundamentals','Textile Science','Fashion Illustration','Draping & Pattern Making','Sustainable Fashion','Fashion Business','Merchandising','Fashion Technology']} itemCount={8} filterKey="subject" onSelect={() => setFilter('subject', 'Fashion Design')} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="🏅" label="Certifications" items={BROWSE_DATA.certifications.filter(c => c.includes('NIFT') || c.includes('Pearl') || c.includes('Parsons') || c.includes('UGC') || c.includes('AICTE'))} itemCount={5} onSelect={() => {}} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="🎓" label="Levels" items={['Diploma','Undergraduate (B.Des)','Postgraduate (M.Des)','Certificate Course']} itemCount={4} onSelect={() => {}} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="🧠" label="AI Fashion Tutor" items={['Fashion Design','Textile Science','Fashion History','Sustainable Fashion','Design Thinking','Portfolio Building']} itemCount={6} onSelect={() => {}} expandedItem={null} onExpandItem={() => {}} aiTutor onAiTutor={openTutorForSubject} paid />
              </div>
            </>
          )}

          {/* ── Govt Job Prep domain ── */}
          {domain === 'Govt Job Prep' && (
            <>
              <div className="mb-6 bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🏛️</div>
                  <div>
                    <h2 className="font-black text-gray-900 text-lg">Government Job Exam Preparation</h2>
                    <p className="text-sm text-gray-500 mt-1">UPSC · SSC · Banking · Railways · State PSC · Teaching · Defence · Insurance — study material, PYQs, and AI mock tests. Foundation prep starts from Class 6.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <BrowsePanel icon="🏛️" label="UPSC (IAS/IPS/IFS)" items={['General Studies Manual','Indian Polity','Indian Economy','Modern India','Geography','Ethics & Integrity','CSAT Aptitude','Previous Year Papers']} itemCount={8} filterKey="level" onSelect={() => setFilter('level', 'UPSC CSE Prep')} expandedItem={null} onExpandItem={() => {}} iconMap={SUBJECT_ICONS} />
                <BrowsePanel icon="📝" label="SSC (CGL/CHSL/MTS/GD)" items={['Quantitative Aptitude','Reasoning','English Language','General Awareness','SSC CGL Guide','SSC CHSL Guide','Previous Year Papers']} itemCount={7} filterKey="level" onSelect={() => setFilter('level', 'SSC CGL Prep')} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="🏦" label="Banking (IBPS/SBI/RBI)" items={['Banking Awareness','Quant for Bank PO','Reasoning for Banks','English for Banks','RBI Grade B Guide','IBPS PO PYQs']} itemCount={6} filterKey="level" onSelect={() => setFilter('level', 'Banking (IBPS/SBI) Prep')} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="🚆" label="Railways (RRB NTPC/Group D)" items={['NTPC Complete Guide','Railway Mathematics','Railway GK','General Science','RRB Group D Guide','Previous Year Papers']} itemCount={6} filterKey="level" onSelect={() => setFilter('level', 'Railways (RRB) Prep')} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="🗺️" label="State PSC" items={['State GS Manual','State-wise GK','Answer Writing Practice','State History & Geography','Previous Year Papers']} itemCount={5} filterKey="level" onSelect={() => setFilter('level', 'State PSC Prep')} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="🎖️" label="Defence (NDA/CDS)" items={['NDA Mathematics','CDS General Ability','SSB Interview Guide','Physical Fitness Guide','Previous Year Papers']} itemCount={5} filterKey="level" onSelect={() => setFilter('level', 'Defence (NDA/CDS) Prep')} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="📚" label="Teaching (CTET/NET)" items={['Child Development & Pedagogy','UGC NET Paper I','Subject Knowledge Banks','Previous Year Papers']} itemCount={4} filterKey="level" onSelect={() => setFilter('level', 'CTET / Teaching Prep')} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="🧠" label="AI Exam Tutor" items={['UPSC GS','SSC Aptitude','Banking Quant','Railway Science','Current Affairs','Ethics','Indian Polity','Indian Economy']} itemCount={8} onSelect={() => {}} expandedItem={null} onExpandItem={() => {}} aiTutor onAiTutor={openTutorForSubject} paid iconMap={SUBJECT_ICONS} />
              </div>
            </>
          )}

          {/* ── Aviation domain ── */}
          {domain === 'Aviation' && (
            <>
              <div className="mb-6 bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0">✈️</div>
                  <div>
                    <h2 className="font-black text-gray-900 text-lg">Aviation Training Material</h2>
                    <p className="text-sm text-gray-500 mt-1">DGCA exam prep for CPL, ATPL, and AME. Cabin crew training, air traffic control, and airport management. Certifications through <span className="text-violet-600 font-semibold">Gurukul Global Vidyaniketan</span>.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <BrowsePanel icon="✈️" label="Pilot Training (CPL)" items={['Air Navigation','Aviation Meteorology','Air Regulations','Technical General','Technical Specific','DGCA PYQs']} itemCount={6} filterKey="level" onSelect={() => setFilter('level', 'CPL (Pilot) Training')} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="🔧" label="AME (Maintenance)" items={['Mathematics & Physics','Aircraft Maintenance','Avionics Systems','DGCA AME Modules','Workshop Practice']} itemCount={5} filterKey="level" onSelect={() => setFilter('level', 'AME Training')} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="💺" label="Cabin Crew" items={['Cabin Crew Manual','Safety Procedures','Grooming & Etiquette','In-flight Service','Emergency Handling']} itemCount={5} filterKey="level" onSelect={() => setFilter('level', 'Cabin Crew Training')} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="🧠" label="AI Aviation Tutor" items={['Air Navigation','Meteorology','Aircraft Systems','Air Law','Aviation English']} itemCount={5} onSelect={() => {}} expandedItem={null} onExpandItem={() => {}} aiTutor onAiTutor={openTutorForSubject} paid />
              </div>
            </>
          )}

          {/* ── Higher Education domain ── */}
          {domain === 'Higher Education' && (
            <>
              <div className="mb-6 bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-200 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🎓</div>
                  <div>
                    <h2 className="font-black text-gray-900 text-lg">Higher Education Library</h2>
                    <p className="text-sm text-gray-500 mt-1">UG & PG textbooks, reference books, and study material across Engineering, Medicine, Law, Management, Architecture, Agriculture, Data Science, and more.</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <BrowsePanel icon="⚙️" label="Engineering & CS" items={['Engineering Maths','Data Structures','DBMS','Operating Systems','Computer Networks','AI & ML','Data Science']} itemCount={7} filterKey="subject" onSelect={v => setFilter('subject', v === 'Engineering Maths' ? 'Engineering' : v)} expandedItem={null} onExpandItem={() => {}} iconMap={SUBJECT_ICONS} />
                <BrowsePanel icon="🏥" label="Medicine & Health" items={['Anatomy','Physiology','Pathology','Biochemistry','Pharmacology','Nursing']} itemCount={6} filterKey="subject" onSelect={() => setFilter('subject', 'Medicine')} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="⚖️" label="Law" items={['Indian Constitution','Criminal Law (IPC)','Law of Contracts','Legal Studies','Jurisprudence']} itemCount={5} filterKey="subject" onSelect={() => setFilter('subject', 'Law')} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="💼" label="Management & Commerce" items={['Financial Management','Marketing','Accountancy','Business Studies','Macro Economics']} itemCount={5} filterKey="subject" onSelect={() => setFilter('subject', 'Management')} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="🌾" label="Agriculture & Biotech" items={['Agronomy','Biotechnology','Molecular Biology','Food Technology','Horticulture']} itemCount={5} filterKey="subject" onSelect={v => setFilter('subject', v === 'Agronomy' ? 'Agriculture' : 'Biotechnology')} expandedItem={null} onExpandItem={() => {}} />
                <BrowsePanel icon="🧠" label="AI Tutor — Higher Ed" items={['Engineering','Medicine','Law','Management','Architecture','Pharmacy','Nursing','Agriculture','Biotechnology','Data Science','AI & ML']} itemCount={11} onSelect={() => {}} expandedItem={null} onExpandItem={() => {}} aiTutor onAiTutor={openTutorForSubject} paid iconMap={SUBJECT_ICONS} />
              </div>
            </>
          )}

          <div className="mb-2">
            <h2 className="text-base font-bold text-gray-900 mb-3">Recently Added</h2>
            {/* Sample book always shown first */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...ALL_BOOKS].filter(b => b.id === 9999).concat([...ALL_BOOKS].slice(-9).reverse()).map(b => <BookCard key={b.id} book={b} view="grid" onAskAI={setTutorBook} onListen={(b) => { if (b.id === 9999) { setReaderBook(SAMPLE_BOOK) } else { setAudioBook(b) } }} onRead={(b) => setReaderBook(b.id === 9999 ? SAMPLE_BOOK : generateMockProcessedBook({ id: b.id, title: b.title, subject: b.subject, class: b.class, author: b.author, lang: b.lang, pages: b.pages }))} />)}
            </div>
          </div>
        </>
      )}

      {browseMode && (
        <div className="flex flex-col md:flex-row gap-4">
          {/* Filter sidebar — full-width on mobile, fixed-width column on tablet+ */}
          {showFilters && (
            <aside className="w-full md:w-52 flex-shrink-0">
              <div className="md:sticky md:top-20 bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                  <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Filter</span>
                  {activeFilterCount > 0 && <button onClick={clearFilters} className="text-xs text-violet-600 hover:underline">Clear all</button>}
                </div>
                <FacetSection label="Subject" options={BROWSE_DATA.subjects} selected={filters.subject} onSelect={v => setFilter('subject', v)} iconMap={SUBJECT_ICONS} />
                <FacetSection label="Class / Level" options={BROWSE_DATA.levels} selected={filters.level} onSelect={v => setFilter('level', v)} />
                <FacetSection label="Language" options={BROWSE_DATA.languages} selected={filters.language} onSelect={v => setFilter('language', v)} />
                <FacetSection label="Resource Type" options={RESOURCE_TYPES} selected={filters.type} onSelect={v => setFilter('type', v)} />
                <FacetSection label="Board" options={BROWSE_DATA.boards} selected={filters.board} onSelect={v => setFilter('board', v)} />
                <FacetSection label="Content Provider" options={CONTENT_PROVIDERS} selected={filters.provider} onSelect={v => setFilter('provider', v)} />
              </div>
            </aside>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <button onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1.5 text-xs border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 text-gray-600">
                <SlidersHorizontal className="w-3.5 h-3.5" /> {showFilters ? 'Hide' : 'Show'} Filters
              </button>
              <span className="text-sm text-gray-500 font-medium">{filtered.length} resource{filtered.length !== 1 ? 's' : ''}</span>
              {Object.entries(filters).filter(([,v]) => v).map(([k, v]) => (
                <span key={k} className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs px-2.5 py-1 rounded-full">
                  {v} <button onClick={() => setFilter(k as keyof typeof filters, v)}><X className="w-3 h-3" /></button>
                </span>
              ))}
              <div className="ml-auto flex gap-1">
                <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg ${view === 'grid' ? 'bg-violet-100 text-violet-600' : 'text-gray-400 hover:bg-gray-100'}`}><LayoutGrid className="w-4 h-4" /></button>
                <button onClick={() => setView('list')} className={`p-1.5 rounded-lg ${view === 'list' ? 'bg-violet-100 text-violet-600' : 'text-gray-400 hover:bg-gray-100'}`}><List className="w-4 h-4" /></button>
              </div>
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-gray-400 bg-white border border-gray-200 rounded-xl">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium text-gray-600">No books match your filters</p>
                <button onClick={clearFilters} className="text-violet-600 text-sm mt-2 hover:underline">Clear filters</button>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map(b => <BookCard key={b.id} book={b} view="grid" onAskAI={setTutorBook} onListen={(b) => { if (b.id === 9999) { setReaderBook(SAMPLE_BOOK) } else { setAudioBook(b) } }} onRead={(b) => setReaderBook(b.id === 9999 ? SAMPLE_BOOK : generateMockProcessedBook({ id: b.id, title: b.title, subject: b.subject, class: b.class, author: b.author, lang: b.lang, pages: b.pages }))} />)}
              </div>
            ) : (
              <div className="space-y-2">
                {filtered.map(b => <BookCard key={b.id} book={b} view="list" onAskAI={setTutorBook} onListen={(b) => { if (b.id === 9999) { setReaderBook(SAMPLE_BOOK) } else { setAudioBook(b) } }} onRead={(b) => setReaderBook(b.id === 9999 ? SAMPLE_BOOK : generateMockProcessedBook({ id: b.id, title: b.title, subject: b.subject, class: b.class, author: b.author, lang: b.lang, pages: b.pages }))} />)}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function FacetSection({ label, options, selected, onSelect, iconMap }: {
  label: string; options: string[]; selected: string; onSelect: (v: string) => void
  iconMap?: Record<string, string>
}) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? options : options.slice(0, 6)
  return (
    <div className="border-b border-gray-100 px-4 py-3">
      <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">{label}</p>
      <ul className="space-y-1">
        {visible.map(opt => (
          <li key={opt}>
            <button onClick={() => onSelect(opt)}
              className={`w-full flex items-center gap-2 text-xs py-0.5 text-left transition-colors rounded ${selected === opt ? 'text-violet-600 font-semibold' : 'text-gray-600 hover:text-violet-600'}`}>
              <span className={`w-3 h-3 rounded border flex-shrink-0 flex items-center justify-center ${selected === opt ? 'bg-violet-600 border-violet-600' : 'border-gray-300'}`}>
                {selected === opt && <span className="text-white text-[8px]">✓</span>}
              </span>
              {iconMap?.[opt] && <span className="text-xs leading-none flex-shrink-0">{iconMap[opt]}</span>}
              <span className="truncate">{opt}</span>
            </button>
          </li>
        ))}
      </ul>
      {options.length > 6 && (
        <button onClick={() => setExpanded(!expanded)} className="mt-1.5 text-xs text-violet-600 hover:underline">
          {expanded ? 'Show less' : `+${options.length - 6} more`}
        </button>
      )}
    </div>
  )
}
