'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Building2, Users, GraduationCap, Shield, Search, MapPin, Calendar, ChevronDown, ChevronRight } from 'lucide-react'

const colleges = [
  { name: 'University College of Engineering, Osmania', slug: 'university-college-of-engineering-osmania', city: 'Hyderabad', principal: 'Dr. K. Ramesh Reddy', departments: 12, students: 4800, naac: 'A++', status: 'active' as const, lastInspection: '2025-11-14' },
  { name: 'Nizam College (Autonomous)', slug: 'nizam-college-autonomous', city: 'Hyderabad', principal: 'Dr. P. Sujatha Devi', departments: 18, students: 6200, naac: 'A+', status: 'active' as const, lastInspection: '2025-09-22' },
  { name: 'JNTU College of Engineering', slug: 'jntu-college-of-engineering', city: 'Kukatpally', principal: 'Dr. M. Venkata Rao', departments: 10, students: 5400, naac: 'A+', status: 'active' as const, lastInspection: '2025-08-05' },
  { name: 'Kakatiya Govt. College', slug: 'kakatiya-govt-college', city: 'Warangal', principal: 'Dr. S. Lakshmi Narayana', departments: 14, students: 3800, naac: 'A', status: 'active' as const, lastInspection: '2025-07-18' },
  { name: 'Chaitanya Bharathi Institute of Technology', slug: 'chaitanya-bharathi-institute-of-technology', city: 'Gandipet', principal: 'Dr. B. Pradeep Kumar', departments: 8, students: 4200, naac: 'A', status: 'probation' as const, lastInspection: '2025-12-02' },
  { name: 'Mahatma Gandhi Institute of Technology', slug: 'mahatma-gandhi-institute-of-technology', city: 'Gandipet', principal: 'Dr. N. Srinivas', departments: 9, students: 3600, naac: 'B++', status: 'active' as const, lastInspection: '2025-06-10' },
  { name: 'St. Ann\'s College for Women', slug: 'st-anns-college-for-women', city: 'Mehdipatnam', principal: 'Dr. Sr. Roopa Grace', departments: 11, students: 2800, naac: 'B++', status: 'active' as const, lastInspection: '2025-10-30' },
  { name: 'Aurora\'s Degree & PG College', slug: 'auroras-degree-and-pg-college', city: 'Chikkadpally', principal: 'Dr. A. Ravi Shankar', departments: 7, students: 1900, naac: 'B', status: 'expired' as const, lastInspection: '2024-03-15' },
]

const naacGrades = ['All', 'A++', 'A+', 'A', 'B++', 'B'] as const

const naacBadge = (grade: string) => {
  if (grade === 'A++') return 'bg-emerald-50 text-emerald-700 border border-emerald-200'
  if (grade === 'A+') return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
  if (grade === 'A') return 'bg-blue-50 text-blue-600 border border-blue-100'
  if (grade === 'B++') return 'bg-amber-50 text-amber-600 border border-amber-100'
  return 'bg-orange-50 text-orange-600 border border-orange-100'
}

const statusBadge = (s: string) => {
  if (s === 'active') return 'bg-emerald-50 text-emerald-700'
  if (s === 'probation') return 'bg-amber-50 text-amber-700'
  return 'bg-red-50 text-red-700'
}

const naacToScore = (grade: string) => {
  const map: Record<string, number> = { 'A++': 3.76, 'A+': 3.51, 'A': 3.26, 'B++': 3.01, 'B': 2.76 }
  return map[grade] || 0
}

export default function AffiliatedCollegesPage() {
  const [gradeFilter, setGradeFilter] = useState<string>('All')
  const [search, setSearch] = useState('')

  const filtered = colleges.filter(c => {
    if (gradeFilter !== 'All' && c.naac !== gradeFilter) return false
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.city.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const totalStudents = colleges.reduce((sum, c) => sum + c.students, 0)
  const avgNaac = (colleges.reduce((sum, c) => sum + naacToScore(c.naac), 0) / colleges.length).toFixed(2)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs bg-violet-100 text-violet-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">Affiliations</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900">Affiliated Colleges</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor performance, compliance, and outcomes across all affiliated colleges</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-violet-50 border border-gray-100 rounded-xl p-4">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">
            <Building2 className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">{colleges.length}</p>
          <p className="text-xs text-gray-500">Total Colleges</p>
        </div>
        <div className="bg-emerald-50 border border-gray-100 rounded-xl p-4">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">{totalStudents.toLocaleString()}</p>
          <p className="text-xs text-gray-500">Total Students</p>
        </div>
        <div className="bg-blue-50 border border-gray-100 rounded-xl p-4">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">{avgNaac}</p>
          <p className="text-xs text-gray-500">Avg NAAC Score</p>
        </div>
        <div className="bg-amber-50 border border-gray-100 rounded-xl p-4">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">{colleges.filter(c => c.status === 'active').length}</p>
          <p className="text-xs text-gray-500">Active Affiliations</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by college name or city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
          />
        </div>
        <div className="relative">
          <select
            value={gradeFilter}
            onChange={e => setGradeFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 cursor-pointer"
          >
            {naacGrades.map(g => (
              <option key={g} value={g}>{g === 'All' ? 'All NAAC Grades' : `NAAC ${g}`}</option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                {['College', 'City', 'Principal', 'Depts', 'Students', 'NAAC', 'Status', 'Last Inspection'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link href={`/dashboard/university/affiliated-colleges/${c.slug}`} className="text-xs font-bold text-violet-600 hover:text-violet-700 hover:underline max-w-[240px] block">{c.name}</Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-600 flex items-center gap-1"><MapPin className="w-3 h-3 text-gray-400" />{c.city}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{c.principal}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 font-semibold">{c.departments}</td>
                  <td className="px-4 py-3 text-xs text-gray-900 font-bold">{c.students.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${naacBadge(c.naac)}`}>{c.naac}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusBadge(c.status)}`}>{c.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500 flex items-center gap-1"><Calendar className="w-3 h-3 text-gray-400" />{new Date(c.lastInspection).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-sm text-gray-400">No colleges match your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
