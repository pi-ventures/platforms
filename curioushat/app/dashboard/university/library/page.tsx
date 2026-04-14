'use client'

import { useState, useMemo } from 'react'
import { Search, BookOpen, Building2 } from 'lucide-react'
import { DOMAINS, ALL_BOOKS, SUBJECT_ICONS, subjectColor, type LibraryBook } from '@/lib/library-data'

const COLLEGES = ['All Colleges', 'Engineering College', 'Arts & Science College', 'Medical College', 'Law College', 'Commerce College', 'Education College']

export default function UniversityLibraryPage() {
  const [search, setSearch] = useState('')
  const [activeDomain, setActiveDomain] = useState('All')
  const [college, setCollege] = useState('All Colleges')

  const filtered = useMemo(() => {
    let books: LibraryBook[] = ALL_BOOKS
    if (activeDomain !== 'All') {
      const domainMap: Record<string, string[]> = {
        'School Education': ['Class I','Class II','Class III','Class IV','Class V','Class VI','Class VII','Class VIII','Class IX','Class X','Class XI','Class XII'],
        'Higher Education': ['Undergraduate','Postgraduate','Diploma'],
        'Govt Job Prep': ['UPSC CSE Prep','SSC CGL Prep','Banking (IBPS/SBI) Prep','Railways (RRB) Prep','State PSC Prep','CTET / Teaching Prep','Defence (NDA/CDS) Prep'],
        'Aviation': ['CPL (Pilot) Training','AME Training','Cabin Crew Training'],
      }
      const langSubjects = ['Hindi','Bengali','Marathi','Telugu','Tamil','Gujarati','Kannada','Malayalam','Punjabi','Odia','English','French','Spanish','German','Portuguese','Russian','Italian','Polish','Ukrainian','Romanian','Dutch','Greek','Swedish','Mandarin Chinese','Japanese','Korean','Vietnamese','Thai','Indonesian','Malay','Arabic','Turkish','Persian (Farsi)','Hebrew','Swahili']
      if (activeDomain === 'Languages') { books = books.filter(b => langSubjects.includes(b.subject)) }
      else if (activeDomain === 'Music & Performing Arts') { books = books.filter(b => ['Music','Performing Arts'].includes(b.subject)) }
      else if (activeDomain === 'Fashion & Design') { books = books.filter(b => b.subject === 'Fashion Design') }
      else {
      const levels = domainMap[activeDomain]
      if (levels) books = books.filter(b => levels.some(l => b.class.includes(l)))
      }
    }
    if (college !== 'All Colleges') {
      const collegeSubjects: Record<string, string[]> = {
        'Engineering College': ['Physics','Chemistry','Mathematics','Computer Science','Engineering','AI & ML','Data Science'],
        'Arts & Science College': ['English','Hindi','History','Geography','Economics','Political Science','Psychology','Sociology','Fine Arts'],
        'Medical College': ['Biology','Medicine','Pharmacy','Nursing','Biotechnology'],
        'Law College': ['Law','Political Science','Indian Polity','Ethics & Integrity'],
        'Commerce College': ['Commerce','Economics','Management','Banking Awareness'],
        'Education College': ['General Studies','Psychology','Physical Education','Home Science'],
      }
      const subjects = collegeSubjects[college]
      if (subjects) books = books.filter(b => subjects.includes(b.subject))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      books = books.filter(b => b.title.toLowerCase().includes(q) || b.subject.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
    }
    return books
  }, [search, activeDomain, college])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-6 h-6 text-violet-600" />
          <h1 className="text-2xl font-black text-gray-900">University Library</h1>
        </div>
        <p className="text-sm text-gray-500">Central library shared across all affiliated colleges — {ALL_BOOKS.length} books, {DOMAINS.length} domains</p>
      </div>

      {/* Search + College Filter */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search books by title, subject, or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
          />
        </div>
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <select
            value={college}
            onChange={e => setCollege(e.target.value)}
            className="pl-10 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none cursor-pointer"
          >
            {COLLEGES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Domain Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['All', ...DOMAINS].map(d => (
          <button
            key={d}
            onClick={() => setActiveDomain(d)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              activeDomain === d ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Count */}
      {activeDomain === 'Languages' && (
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🌐</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black text-gray-900">Learn Languages — 35 Languages</h3>
            <p className="text-[10px] text-gray-500">AI-powered translation, offline packs, 868 words &amp; sentences. Powered by AI4Bharat (IIT Madras) + CuriousHat AI.</p>
          </div>
        </div>
      )}
      <p className="text-xs text-gray-400">{filtered.length} books found{college !== 'All Colleges' ? ` for ${college}` : ''}</p>

      {/* Book Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {filtered.map(book => (
          <div key={book.id} className="bg-white border border-gray-200 rounded-xl p-3 hover:border-violet-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: subjectColor(book.subject) + '15' }}>
                <span className="text-lg">{SUBJECT_ICONS[book.subject] || '📖'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{book.title}</p>
                <p className="text-xs text-gray-400">{book.class} · {book.board} · {book.author}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: subjectColor(book.subject) + '15', color: subjectColor(book.subject) }}>
                  {book.subject}
                </span>
                <span className="text-[10px] text-gray-400">{book.pages}p</span>
              </div>
            </div>
            <p className="text-[9px] text-violet-500 mt-1">Interpreted by CuriousHat AI</p>
          </div>
        ))}
      </div>
    </div>
  )
}
