'use client'
import { useState, useMemo } from 'react'
import { Search, BookOpen, Upload, Download, Share2, Trash2, FileText, FileEdit, Film, Link, Plus, X, Eye, SlidersHorizontal, LayoutGrid, List, ChevronRight, Brain, Headphones, Sparkles, Languages } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { Book as TutorBook } from '@/components/dashboard/AITutorPanel'
const AITutorPanel = dynamic(() => import('@/components/dashboard/AITutorPanel'), { ssr: false })
const AudioBookPlayer = dynamic(() => import('@/components/dashboard/AudioBookPlayer'), { ssr: false })
import { DOMAINS, BROWSE_DATA, ALL_BOOKS, RESOURCE_TYPES, CONTENT_PROVIDERS, SUBJECT_COLORS, SUBJECT_ICONS, subjectColor, LANGUAGE_ZONES } from '@/lib/library-data'

const PLAN = { aiTutor: true }

/* ─── Facet Section ─── */
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
                {selected === opt && <span className="text-white text-[8px]">&#10003;</span>}
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

/* ─── Browse Panel (inline) ─── */
function BrowsePanel({ icon, label, items, itemCount, onSelect, expandedItem, onExpandItem, langMap, onLangSelect, aiTutor = false, onAiTutor, paid = false, iconMap, ...rest }: {
  icon: string; label: string; items: string[]; itemCount: number; onSelect: (v: string) => void
  expandedItem: string | null; onExpandItem: (v: string | null) => void
  langMap?: Record<string, string[]>; onLangSelect?: (s: string, l: string) => void
  aiTutor?: boolean; onAiTutor?: (s: string) => void; paid?: boolean; iconMap?: Record<string, string>
  [key: string]: unknown
}) {
  const [showMore, setShowMore] = useState(false)
  const preview = showMore ? items : items.slice(0, 15)
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{icon}</span>
          <h3 className="text-sm font-black text-gray-900">{label}</h3>
          {paid && <span className="text-[9px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-bold">★ Pro</span>}
        </div>
        <span className="text-[10px] text-gray-400">{itemCount}</span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {preview.map(item => (
          <button key={item} onClick={() => aiTutor && onAiTutor ? onAiTutor(item) : onSelect(item)}
            className="flex items-center gap-1.5 px-2 py-1.5 text-xs text-gray-700 bg-gray-50 rounded-lg hover:bg-violet-50 hover:text-violet-700 transition-all text-left truncate">
            {iconMap?.[item] && <span className="text-sm flex-shrink-0">{iconMap[item]}</span>}
            <span className="truncate">{item}</span>
          </button>
        ))}
      </div>
      {items.length > 15 && (
        <button onClick={() => setShowMore(v => !v)} className="mt-2 text-[10px] text-violet-600 font-semibold hover:underline">
          {showMore ? 'Show less' : `More (${items.length - 15} more)`}
        </button>
      )}
    </div>
  )
}

/* ─── Book card ─── */
function BookCard({ book, view, onAskAI, onListen }: {
  book: typeof ALL_BOOKS[0]; view: 'grid' | 'list'
  onAskAI: (b: typeof ALL_BOOKS[0]) => void
  onListen: (b: typeof ALL_BOOKS[0]) => void
}) {
  const color = subjectColor(book.subject)
  if (view === 'list') {
    return (
      <div className="bg-white border border-gray-200 rounded-xl flex items-center gap-4 px-4 py-3 hover:border-violet-300 hover:shadow-sm transition-all">
        <div className="w-10 h-12 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '18', border: `2px solid ${color}30` }}>
          <BookOpen className="w-5 h-5" style={{ color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 text-sm truncate">{book.title}</p>
          <p className="text-xs text-gray-400">{book.author} · {book.class} · {book.board}</p>
          <p className="text-[9px] text-violet-500 flex items-center gap-1 mt-0.5"><Sparkles className="w-2.5 h-2.5" />Interpreted by CuriousHat AI</p>
        </div>
        <span className="text-xs border border-gray-200 text-gray-500 px-2 py-0.5 rounded-full hidden sm:block">{book.type}</span>
        <div className="flex gap-1.5 flex-shrink-0">
          <button onClick={() => onAskAI(book)} title="Ask AI · Pro" className="relative p-1.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
            <Brain className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 text-[8px] font-bold leading-none px-0.5 py-px rounded bg-amber-400 text-white">★</span>
          </button>
          <button className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="Preview"><Eye className="w-4 h-4" /></button>
          <button onClick={() => onListen(book)} title="Listen — Audiobook" className="p-1.5 text-gray-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-colors"><Headphones className="w-4 h-4" /></button>
          <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Share"><Share2 className="w-4 h-4" /></button>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-violet-300 hover:shadow-sm transition-all group">
      <div className="h-28 flex items-center justify-center relative" style={{ backgroundColor: color + '10', borderBottom: `3px solid ${color}` }}>
        <BookOpen className="w-9 h-9" style={{ color }} />
        <span className="absolute top-2 right-2 text-xs bg-white border border-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{book.type}</span>
      </div>
      <div className="p-3">
        <p className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{book.title}</p>
        <p className="text-xs text-gray-400 mb-0.5">{book.class} · {book.board}</p>
        <p className="text-xs text-gray-400 mb-1">{book.author} · {book.pages}pp</p>
        <p className="text-[9px] text-violet-500 mb-2 flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" />Interpreted by CuriousHat AI · Source: {book.author}</p>
        <div className="flex gap-1">
          <button onClick={() => onAskAI(book)} title="Ask AI" className="relative flex items-center justify-center gap-1 px-1.5 sm:px-2 border border-purple-200 text-purple-600 text-xs font-medium py-1.5 rounded-lg hover:bg-purple-50 transition-colors flex-1">
            <Brain className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Ask AI</span>
            <span className="text-[7px] font-bold px-0.5 rounded bg-amber-400 text-white leading-tight absolute -top-1 -right-1">★</span>
          </button>
          <button onClick={() => onListen(book)} title="Listen" className="flex items-center justify-center gap-1 px-1.5 sm:px-2 border border-teal-200 text-teal-600 text-xs font-medium py-1.5 rounded-lg hover:bg-teal-50 transition-colors flex-1">
            <Headphones className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Listen</span>
          </button>
          <button title="Save" className="flex items-center justify-center gap-1 px-1.5 sm:px-2 border border-gray-200 text-gray-600 text-xs font-medium py-1.5 rounded-lg hover:bg-gray-50 transition-colors flex-1">
            <Download className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="hidden sm:inline">Save</span>
          </button>
          <button title="Share" className="flex items-center justify-center px-2 text-xs font-medium py-1.5 rounded-lg transition-colors text-white flex-shrink-0" style={{ backgroundColor: color }}>
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Main ─── */
export default function TeacherLibraryPage() {
  const [activeTab, setActiveTab] = useState<'ncert' | 'my-materials'>('ncert')
  const [tutorBook, setTutorBook] = useState<TutorBook | null>(null)
  const [audioBook, setAudioBook] = useState<TutorBook | null>(null)
  const [domain, setDomain] = useState('School Education')
  const [browseMode, setBrowseMode] = useState(false)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ subject: '', level: '', language: '', board: '', type: '', provider: '' })
  const [view, setView] = useState<'grid' | 'list'>('grid')

  // Teacher's uploaded materials (placeholder until backend)
  const myMaterials: { id: string; title: string; subject: string; class: string; type: string; shared: boolean; date: string; size: string }[] = []

  const fileTypeConfig: Record<string, { icon: any; color: string; bg: string }> = {
    PDF: { icon: FileText, color: '#dc2626', bg: '#fef2f2' },
    DOC: { icon: FileText, color: '#2563eb', bg: '#eff6ff' },
    PPT: { icon: FileText, color: '#ea580c', bg: '#fff7ed' },
    Video: { icon: FileText, color: '#9333ea', bg: '#faf5ff' },
    Link: { icon: FileText, color: '#0d9488', bg: '#f0fdfa' },
  }
  const [showFilters, setShowFilters] = useState(true)
  const [showUpload, setShowUpload] = useState(false)
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

  const filteredBooks = ALL_BOOKS.filter(b => {
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
      {tutorBook && <AITutorPanel book={tutorBook} onClose={() => setTutorBook(null)} enabled={PLAN.aiTutor} role="teacher" />}
      {audioBook && <AudioBookPlayer book={audioBook} onClose={() => setAudioBook(null)} />}

      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Welcome, Ms. Priya Gupta</h1>
          <p className="text-gray-500 mt-1 text-sm">NCERT books for all grades, your uploaded materials, and shared resources</p>
        </div>
        <button onClick={() => setShowUpload(true)} className="flex items-center gap-1.5 text-sm bg-violet-600 text-white px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors flex-shrink-0">
          <Upload className="w-4 h-4" /> <span className="hidden sm:inline">Upload Material</span><span className="sm:hidden">Upload</span>
        </button>
      </div>

      {/* Upload modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Upload Material</h3>
              <button onClick={() => setShowUpload(false)}><X className="w-5 h-5 text-gray-400 hover:text-gray-600" /></button>
            </div>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center mb-4 hover:border-violet-400 hover:bg-violet-50 transition-all cursor-pointer">
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm font-medium text-gray-700">Drag files here or click to browse</p>
              <p className="text-xs text-gray-400 mt-1">PDF, DOC, PPT, images — up to 50 MB</p>
            </div>
            <div className="space-y-3">
              <input placeholder="Title" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-violet-500 outline-none">
                  <option>Select Subject</option>
                  {BROWSE_DATA.subjects.map(s => <option key={s}>{s}</option>)}
                </select>
                <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-violet-500 outline-none">
                  <option>Select Class</option>
                  {BROWSE_DATA.levels.slice(0, 12).map(l => <option key={l}>{l}</option>)}
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input type="checkbox" className="rounded" defaultChecked /> Share with students immediately
              </label>
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowUpload(false)} className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 text-sm">Cancel</button>
              <button className="flex-1 bg-violet-600 text-white font-semibold py-2.5 rounded-xl hover:bg-violet-700 text-sm">Upload</button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-full sm:w-fit mb-5 overflow-x-auto scrollbar-none">
        {[['ncert','NCERT & Reference Library'],['my-materials','My Uploaded Materials']].map(([key, lbl]) => (
          <button key={key} onClick={() => setActiveTab(key as typeof activeTab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {lbl}
          </button>
        ))}
      </div>

      {/* ── NCERT Library ── */}
      {activeTab === 'ncert' && (
        <>
          {/* Domain tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6 overflow-x-auto w-full sm:w-fit scrollbar-none">
            {DOMAINS.map(d => (
              <button key={d} onClick={() => { setDomain(d); clearFilters() }}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${domain === d ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                {d}
              </button>
            ))}
          </div>

          {/* Search */}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

                <BrowsePanel
                  icon="≡" label="Subjects" items={BROWSE_DATA.subjects} itemCount={BROWSE_DATA.subjects.length}
                  onSelect={v => setFilter('subject', v)}
                  expandedItem={expandedSubject} onExpandItem={setExpandedSubject}
                  langMap={langsBySubject}
                  onLangSelect={(subject, lang) => { setFilter('subject', subject); setFilter('language', lang) }}
                  iconMap={SUBJECT_ICONS}
                />

                <BrowsePanel
                  icon="🎓" label="Educational Levels" items={BROWSE_DATA.levels} itemCount={BROWSE_DATA.levels.length}
                  onSelect={v => setFilter('level', v)}
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
                  onSelect={v => setFilter('language', v)}
                  expandedItem={null} onExpandItem={() => {}}
                  iconMap={SUBJECT_ICONS}
                />

              </div>

              <div className="mb-2">
                <h2 className="text-base font-bold text-gray-900 mb-3">Recently Added</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {ALL_BOOKS.slice(-10).reverse().map(b => <BookCard key={b.id} book={b} view="grid" onAskAI={setTutorBook} onListen={setAudioBook} />)}
                </div>
              </div>
            </>
          )}

          {browseMode && (
            <div className="flex flex-col md:flex-row gap-4">
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
                  <span className="text-sm text-gray-500 font-medium">{filteredBooks.length} resource{filteredBooks.length !== 1 ? 's' : ''}</span>
                  {Object.entries(filters).filter(([, v]) => v).map(([k, v]) => (
                    <span key={k} className="flex items-center gap-1 bg-violet-100 text-violet-700 text-xs px-2.5 py-1 rounded-full">
                      {v} <button onClick={() => setFilter(k as keyof typeof filters, v)}><X className="w-3 h-3" /></button>
                    </span>
                  ))}
                  <div className="ml-auto flex gap-1">
                    <button onClick={() => setView('grid')} className={`p-1.5 rounded-lg ${view === 'grid' ? 'bg-violet-100 text-violet-600' : 'text-gray-400 hover:bg-gray-100'}`}><LayoutGrid className="w-4 h-4" /></button>
                    <button onClick={() => setView('list')} className={`p-1.5 rounded-lg ${view === 'list' ? 'bg-violet-100 text-violet-600' : 'text-gray-400 hover:bg-gray-100'}`}><List className="w-4 h-4" /></button>
                  </div>
                </div>
                {filteredBooks.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 bg-white border border-gray-200 rounded-xl">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-medium text-gray-600">No books match your filters</p>
                    <button onClick={clearFilters} className="text-violet-600 text-sm mt-2 hover:underline">Clear filters</button>
                  </div>
                ) : view === 'grid' ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredBooks.map(b => <BookCard key={b.id} book={b} view="grid" onAskAI={setTutorBook} onListen={setAudioBook} />)}
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredBooks.map(b => <BookCard key={b.id} book={b} view="list" onAskAI={setTutorBook} onListen={setAudioBook} />)}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* ── My Materials ── */}
      {activeTab === 'my-materials' && (
        <>
          <div className="flex gap-3 mb-4 flex-wrap">
            {[['Total', myMaterials.length],['Shared', myMaterials.filter(m => m.shared).length],['PDFs', myMaterials.filter(m => m.type === 'PDF').length]].map(([l, v]) => (
              <div key={l} className="bg-white border border-gray-200 rounded-xl px-4 py-2 flex items-center gap-2">
                <span className="text-lg font-black text-gray-900">{v}</span>
                <span className="text-xs text-gray-500">{l}</span>
              </div>
            ))}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500">TITLE</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden sm:table-cell">CLASS</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">ADDED</th>
                  <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 hidden md:table-cell">SHARED</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {myMaterials.map((m, i) => {
                  const FT = fileTypeConfig[m.type] || fileTypeConfig.PDF
                  return (
                    <tr key={m.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${i === myMaterials.length - 1 ? 'border-b-0' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: FT.bg }}>
                            <FT.icon className="w-4 h-4" style={{ color: FT.color }} />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 text-sm leading-tight">{m.title}</p>
                            <p className="text-xs text-gray-400">{m.type} · {m.size}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs hidden sm:table-cell">{m.class}</td>
                      <td className="px-4 py-3 text-gray-400 text-xs hidden md:table-cell">{m.date}</td>
                      <td className="px-4 py-3 text-center hidden md:table-cell">
                        <span className={`inline-block w-2 h-2 rounded-full ${m.shared ? 'bg-emerald-400' : 'bg-gray-200'}`} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1 justify-end">
                          <button className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"><Download className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Share2 className="w-3.5 h-3.5" /></button>
                          <button className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
