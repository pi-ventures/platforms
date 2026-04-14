'use client'
import { useState } from 'react'
import { BookOpen, Award, FileText, Lightbulb, Search, ChevronDown, Users, TrendingUp } from 'lucide-react'

const publications = [
  { title: 'Deep Learning Framework for Diabetic Retinopathy Detection in Rural Indian Populations', authors: 'Dr. K. Ramesh Reddy, Dr. S. Priya', journal: 'IEEE Trans. Medical Imaging', year: 2026, citations: 42, department: 'Computer Science' },
  { title: 'Sustainable Concrete Using Fly Ash from Telangana Thermal Power Plants', authors: 'Dr. M. Venkata Rao, Prof. B. Harish', journal: 'Construction and Building Materials', year: 2025, citations: 38, department: 'Civil Engineering' },
  { title: 'Nanoparticle-mediated Drug Delivery for Targeted Cancer Therapy: A Review', authors: 'Dr. P. Sujatha Devi, Dr. N. Kavitha', journal: 'Journal of Nanobiotechnology', year: 2025, citations: 67, department: 'Pharmaceutical Sciences' },
  { title: 'Impact of GST Implementation on MSME Growth in Telangana: An Empirical Study', authors: 'Prof. A. Ravi Shankar, Dr. L. Meena', journal: 'Indian Journal of Commerce', year: 2025, citations: 23, department: 'Commerce' },
  { title: 'IoT-enabled Smart Irrigation System for Deccan Plateau Agriculture', authors: 'Dr. B. Pradeep Kumar, Dr. T. Sunil', journal: 'Computers and Electronics in Agriculture', year: 2026, citations: 31, department: 'Electronics & Comm.' },
  { title: 'Linguistic Analysis of Telangana Dialect: Phonological and Morphological Variations', authors: 'Dr. Sr. Roopa Grace, Prof. V. Padma', journal: 'Indian Linguistics', year: 2025, citations: 14, department: 'Humanities' },
  { title: 'Machine Learning-based Prediction of Groundwater Quality in Krishna River Basin', authors: 'Dr. S. Lakshmi Narayana, Dr. K. Anitha', journal: 'Journal of Hydrology', year: 2026, citations: 29, department: 'Environmental Science' },
  { title: 'Optimization of Solar PV Microgrids for Rural Electrification in Telangana', authors: 'Dr. N. Srinivas, Prof. G. Rajesh', journal: 'Renewable Energy', year: 2025, citations: 55, department: 'Electrical Engineering' },
]

const departments = [
  { name: 'Computer Science', papers: 184, citations: 2840, faculty: 42, hIndex: 28, funding: '2.4 Cr' },
  { name: 'Civil Engineering', papers: 126, citations: 1680, faculty: 38, hIndex: 22, funding: '1.8 Cr' },
  { name: 'Pharmaceutical Sciences', papers: 148, citations: 3120, faculty: 28, hIndex: 31, funding: '3.1 Cr' },
  { name: 'Electronics & Comm.', papers: 132, citations: 1940, faculty: 36, hIndex: 24, funding: '2.0 Cr' },
  { name: 'Commerce', papers: 68, citations: 420, faculty: 24, hIndex: 12, funding: '0.4 Cr' },
  { name: 'Electrical Engineering', papers: 142, citations: 2280, faculty: 34, hIndex: 26, funding: '2.6 Cr' },
  { name: 'Environmental Science', papers: 94, citations: 1240, faculty: 18, hIndex: 19, funding: '1.2 Cr' },
  { name: 'Humanities', papers: 56, citations: 310, faculty: 22, hIndex: 9, funding: '0.2 Cr' },
]

const deptOptions = ['All Departments', ...publications.map(p => p.department).filter((v, i, a) => a.indexOf(v) === i)]

export default function ResearchPage() {
  const [deptFilter, setDeptFilter] = useState('All Departments')
  const [search, setSearch] = useState('')

  const filtered = publications.filter(p => {
    if (deptFilter !== 'All Departments' && p.department !== deptFilter) return false
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.authors.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalPapers = departments.reduce((s, d) => s + d.papers, 0)
  const totalCitations = departments.reduce((s, d) => s + d.citations, 0)
  const maxHIndex = Math.max(...departments.map(d => d.hIndex))

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs bg-violet-100 text-violet-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Research</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900">Research & Publications</h1>
        <p className="text-gray-500 text-sm mt-1">Track research output, papers published, and grants across colleges</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-violet-50 border border-gray-100 rounded-xl p-4">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">
            <BookOpen className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">{totalPapers.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Papers Published</p>
          <p className="text-[10px] text-gray-400">2025-26 academic year</p>
        </div>
        <div className="bg-emerald-50 border border-gray-100 rounded-xl p-4">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">{totalCitations.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total Citations</p>
          <p className="text-[10px] text-gray-400">+18% vs last year</p>
        </div>
        <div className="bg-blue-50 border border-gray-100 rounded-xl p-4">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">{maxHIndex}</p>
          <p className="text-xs text-gray-500">Highest h-index</p>
          <p className="text-[10px] text-gray-400">Pharmaceutical Sciences</p>
        </div>
        <div className="bg-amber-50 border border-gray-100 rounded-xl p-4">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">
            <Lightbulb className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">24</p>
          <p className="text-xs text-gray-500">Patents Filed</p>
          <p className="text-[10px] text-gray-400">8 granted, 16 pending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by title or author..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
          />
        </div>
        <div className="relative">
          <select
            value={deptFilter}
            onChange={e => setDeptFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 cursor-pointer"
          >
            {deptOptions.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Publications Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-violet-600" /> Recent Publications
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                {['Title', 'Authors', 'Journal / Conference', 'Year', 'Citations', 'Department'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p, i) => (
                <tr key={i} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="text-xs font-bold text-gray-900 max-w-[280px] leading-relaxed">{p.title}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 max-w-[160px]">{p.authors}</td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-violet-700 font-medium italic max-w-[180px]">{p.journal}</p>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600 font-semibold">{p.year}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold ${p.citations >= 50 ? 'text-emerald-600' : p.citations >= 25 ? 'text-blue-600' : 'text-gray-600'}`}>{p.citations}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-gray-100 text-gray-700">{p.department}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-400">No publications match your search</p>
          </div>
        )}
      </div>

      {/* Department-wise Research Output */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-4 h-4 text-violet-600" /> Department-wise Research Output
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                {['Department', 'Faculty', 'Papers', 'Citations', 'h-index', 'Funding'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {departments.sort((a, b) => b.citations - a.citations).map(d => (
                <tr key={d.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-xs font-bold text-gray-900">{d.name}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{d.faculty}</td>
                  <td className="px-4 py-3 text-xs text-gray-900 font-semibold">{d.papers}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold ${d.citations >= 2000 ? 'text-emerald-600' : d.citations >= 1000 ? 'text-blue-600' : 'text-gray-600'}`}>{d.citations.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold ${d.hIndex >= 25 ? 'text-emerald-600' : d.hIndex >= 15 ? 'text-blue-600' : 'text-amber-600'}`}>{d.hIndex}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-gray-700">{d.funding}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
