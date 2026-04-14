'use client'

import { useState } from 'react'
import { BookOpen, Video, FileText, ClipboardList, ScrollText, Upload, Download, Calendar, User, Search } from 'lucide-react'

type MaterialTab = 'video' | 'notes' | 'dpp' | 'pyq'

const tabs: { key: MaterialTab; label: string; icon: React.ReactNode }[] = [
  { key: 'video', label: 'Video Lectures', icon: <Video className="w-4 h-4" /> },
  { key: 'notes', label: 'Notes / PDFs', icon: <FileText className="w-4 h-4" /> },
  { key: 'dpp', label: 'DPPs', icon: <ClipboardList className="w-4 h-4" /> },
  { key: 'pyq', label: 'Previous Year Papers', icon: <ScrollText className="w-4 h-4" /> },
]

interface Material {
  id: string
  title: string
  subject: string
  chapter: string
  uploadedBy: string
  date: string
  downloads: number
  type: MaterialTab
  badge: string
}

const materials: Material[] = [
  // Video Lectures
  { id: 'V01', title: 'Rotational Mechanics — Complete Lecture', subject: 'Physics', chapter: 'Rotational Motion', uploadedBy: 'Rajesh Verma Sir', date: '28 Mar 2026', downloads: 234, type: 'video', badge: 'HC Verma Based' },
  { id: 'V02', title: 'Organic Chemistry — GOC & Isomerism', subject: 'Chemistry', chapter: 'General Organic Chemistry', uploadedBy: 'Neha Kapoor Ma\'am', date: '25 Mar 2026', downloads: 189, type: 'video', badge: 'JEE Advanced' },
  // Notes/PDFs
  { id: 'N01', title: 'Electrostatics Revision Notes', subject: 'Physics', chapter: 'Electrostatics', uploadedBy: 'Rajesh Verma Sir', date: '22 Mar 2026', downloads: 312, type: 'notes', badge: 'Irodov Level' },
  { id: 'N02', title: 'Human Physiology — NCERT Highlights', subject: 'Biology', chapter: 'Human Physiology', uploadedBy: 'Dr. Sunita Rao', date: '20 Mar 2026', downloads: 276, type: 'notes', badge: 'NEET Focused' },
  // DPPs
  { id: 'D01', title: 'DPP #47 — Matrices & Determinants', subject: 'Maths', chapter: 'Matrices', uploadedBy: 'Amit Saxena Sir', date: '30 Mar 2026', downloads: 198, type: 'dpp', badge: '25 Questions' },
  { id: 'D02', title: 'DPP #12 — Chemical Bonding Advanced', subject: 'Chemistry', chapter: 'Chemical Bonding', uploadedBy: 'Neha Kapoor Ma\'am', date: '29 Mar 2026', downloads: 167, type: 'dpp', badge: '30 Questions' },
  // PYQs
  { id: 'P01', title: 'JEE Advanced 2025 — Paper 1 & 2', subject: 'Physics', chapter: 'All Chapters', uploadedBy: 'Admin', date: '15 Jun 2025', downloads: 543, type: 'pyq', badge: 'With Solutions' },
  { id: 'P02', title: 'NEET 2025 — Complete Paper', subject: 'Biology', chapter: 'All Chapters', uploadedBy: 'Admin', date: '10 Jun 2025', downloads: 612, type: 'pyq', badge: 'With Solutions' },
]

const subjectColors: Record<string, string> = {
  Physics: 'bg-blue-100 text-blue-700',
  Chemistry: 'bg-emerald-100 text-emerald-700',
  Maths: 'bg-amber-100 text-amber-700',
  Biology: 'bg-pink-100 text-pink-700',
}

const typeIcons: Record<MaterialTab, React.ReactNode> = {
  video: <Video className="w-5 h-5 text-violet-500" />,
  notes: <FileText className="w-5 h-5 text-blue-500" />,
  dpp: <ClipboardList className="w-5 h-5 text-emerald-500" />,
  pyq: <ScrollText className="w-5 h-5 text-amber-500" />,
}

export default function StudyMaterialPage() {
  const [activeTab, setActiveTab] = useState<MaterialTab>('video')
  const [search, setSearch] = useState('')

  const filtered = materials
    .filter(m => m.type === activeTab)
    .filter(m =>
      search === '' ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.chapter.toLowerCase().includes(search.toLowerCase())
    )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-violet-600" /> Study Material
          </h1>
          <p className="text-gray-500 text-sm mt-1">Upload and manage study material for batches</p>
        </div>
        <button className="flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-violet-700 transition-colors">
          <Upload className="w-4 h-4" /> Upload Material
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap ${
              activeTab === t.key ? 'bg-white text-violet-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by title, subject, or chapter..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 transition-colors"
        />
      </div>

      {/* Material Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(m => (
            <div key={m.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  {typeIcons[m.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-900 text-sm leading-tight">{m.title}</h3>
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-violet-100 text-violet-700 whitespace-nowrap flex-shrink-0">{m.badge}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${subjectColors[m.subject] ?? 'bg-gray-100 text-gray-600'}`}>{m.subject}</span>
                    <span className="text-xs text-gray-400">{m.chapter}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" />{m.uploadedBy}</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{m.date}</span>
                    <span className="flex items-center gap-1"><Download className="w-3.5 h-3.5" />{m.downloads}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <p className="text-gray-400 text-sm">No materials found{search ? ' matching your search' : ' in this category'}</p>
        </div>
      )}
    </div>
  )
}
