'use client'

import { useState, useMemo } from 'react'
import { Search, BookOpen, Users, Share2 } from 'lucide-react'
import { DOMAINS, ALL_BOOKS, SUBJECT_ICONS, subjectColor, type LibraryBook } from '@/lib/library-data'

export default function CollegeLibraryPage() {
  const [search, setSearch] = useState('')
  const [activeDomain, setActiveDomain] = useState('All')

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
      if (activeDomain === 'Languages') { books = books.filter(b => langSubjects.includes(b.subject)); return books }
      if (activeDomain === 'Music & Performing Arts') { books = books.filter(b => ['Music','Performing Arts'].includes(b.subject)); return books }
      if (activeDomain === 'Fashion & Design') { books = books.filter(b => b.subject === 'Fashion Design'); return books }
      const levels = domainMap[activeDomain]
      if (levels) books = books.filter(b => levels.some(l => b.class.includes(l)))
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      books = books.filter(b => b.title.toLowerCase().includes(q) || b.subject.toLowerCase().includes(q) || b.author.toLowerCase().includes(q))
    }
    return books
  }, [search, activeDomain])

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BookOpen className="w-6 h-6 text-violet-600" />
          <h1 className="text-2xl font-bold text-gray-900">Institute Library</h1>
        </div>
        <p className="text-sm text-gray-500">Shared library across your institute — assign books to batches, track student reading</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search books by title, subject, or author..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
        />
      </div>

      {/* Domain Tabs */}
      <div className="flex gap-2 flex-wrap">
        {['All', ...DOMAINS].map(d => (
          <button
            key={d}
            onClick={() => setActiveDomain(d)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              activeDomain === d ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Learn Languages banner for Languages domain */}
      {activeDomain === 'Languages' && (
        <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 bg-violet-600 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🌐</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-black text-gray-900">Learn Languages — 35 Languages</h3>
            <p className="text-[10px] text-gray-500">AI-powered translation, offline packs, 868 words &amp; sentences. Powered by AI4Bharat (IIT Madras) + CuriousHat AI.</p>
          </div>
        </div>
      )}

      {/* Count */}
      <p className="text-xs text-gray-400">{filtered.length} books found</p>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(book => (
          <div key={book.id} className="bg-white border border-gray-200 rounded-xl p-3 hover:border-violet-200 transition-all">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: subjectColor(book.subject) + '15' }}>
                <span className="text-lg">{SUBJECT_ICONS[book.subject] || '📖'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{book.title}</p>
                <p className="text-[10px] text-gray-400">{book.class} · {book.board} · {book.author}</p>
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: subjectColor(book.subject) + '15', color: subjectColor(book.subject) }}>
                  {book.subject}
                </span>
                <span className="text-[10px] text-gray-300">{book.pages}p</span>
              </div>
            </div>
            <p className="text-[9px] text-gray-300 mt-1">Interpreted by CuriousHat AI</p>
            <div className="mt-2 flex gap-2">
              <button className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-violet-600 bg-violet-50 rounded-lg hover:bg-violet-100 transition-colors">
                <Users className="w-3 h-3" /> Assign to Batch
              </button>
              <button className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Share2 className="w-3 h-3" /> Share with Students
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
