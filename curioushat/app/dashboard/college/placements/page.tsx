'use client'
import { useState } from 'react'
import {
  Briefcase, TrendingUp, Building2, IndianRupee, Award,
  Search, Filter, Users, ArrowUpRight
} from 'lucide-react'

type PlacementStatus = 'placed' | 'offer letter' | 'joined'

interface Placement {
  studentName: string
  department: string
  company: string
  packageLPA: number
  role: string
  status: PlacementStatus
}

const placements: Placement[] = [
  { studentName: 'Arjun Krishnamurthy', department: 'Computer Science', company: 'Infosys', packageLPA: 8.5, role: 'Systems Engineer', status: 'joined' },
  { studentName: 'Priya Venkatesh', department: 'Computer Science', company: 'TCS', packageLPA: 7.0, role: 'Software Developer', status: 'joined' },
  { studentName: 'Rahul Saxena', department: 'Electronics', company: 'Wipro', packageLPA: 6.5, role: 'VLSI Design Engineer', status: 'offer letter' },
  { studentName: 'Megha Srinivasan', department: 'Computer Science', company: 'Zoho Corporation', packageLPA: 12.0, role: 'Full Stack Developer', status: 'placed' },
  { studentName: 'Amit Patel', department: 'Business Administration', company: 'Deloitte', packageLPA: 9.2, role: 'Business Analyst', status: 'joined' },
  { studentName: 'Kavya Nambiar', department: 'Mathematics', company: 'Goldman Sachs', packageLPA: 18.5, role: 'Quantitative Analyst', status: 'offer letter' },
  { studentName: 'Siddharth Jain', department: 'Electronics', company: 'Texas Instruments', packageLPA: 14.0, role: 'Analog Design Engineer', status: 'placed' },
  { studentName: 'Neha Bhat', department: 'Computer Science', company: 'Microsoft', packageLPA: 22.0, role: 'Software Engineer', status: 'placed' },
]

const statusConfig: Record<PlacementStatus, { bg: string; text: string }> = {
  'placed':       { bg: 'bg-blue-50', text: 'text-blue-700' },
  'offer letter': { bg: 'bg-amber-50', text: 'text-amber-700' },
  'joined':       { bg: 'bg-emerald-50', text: 'text-emerald-700' },
}

const totalPlaced = placements.length
const avgPackage = (placements.reduce((s, p) => s + p.packageLPA, 0) / placements.length).toFixed(1)
const highestPackage = Math.max(...placements.map(p => p.packageLPA))
const uniqueCompanies = new Set(placements.map(p => p.company)).size

export default function PlacementsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<PlacementStatus | 'all'>('all')

  const filtered = placements.filter((p) => {
    const matchSearch = p.studentName.toLowerCase().includes(search.toLowerCase()) ||
      p.company.toLowerCase().includes(search.toLowerCase()) ||
      p.department.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 mb-2">Placements</h1>
      <p className="text-gray-500 text-sm mb-6">Campus placement drives, recruiter management, and statistics</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{totalPlaced}</p>
              <p className="text-xs text-gray-500">Total Placed</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50">
              <IndianRupee className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{avgPackage} LPA</p>
              <p className="text-xs text-gray-500">Avg Package</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50">
              <Award className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{highestPackage} LPA</p>
              <p className="text-xs text-gray-500">Highest Package</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-50">
              <Building2 className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{uniqueCompanies}</p>
              <p className="text-xs text-gray-500">Companies Visited</p>
            </div>
          </div>
        </div>
      </div>

      {/* Package Distribution Visual */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <h2 className="text-sm font-bold text-gray-900 mb-3">Package Distribution</h2>
        <div className="space-y-2.5">
          {[
            { range: 'Above 15 LPA', count: placements.filter(p => p.packageLPA > 15).length, color: '#4F46E5' },
            { range: '10 - 15 LPA', count: placements.filter(p => p.packageLPA >= 10 && p.packageLPA <= 15).length, color: '#7C3AED' },
            { range: '7 - 10 LPA', count: placements.filter(p => p.packageLPA >= 7 && p.packageLPA < 10).length, color: '#0891B2' },
            { range: 'Below 7 LPA', count: placements.filter(p => p.packageLPA < 7).length, color: '#F59E0B' },
          ].map((band) => (
            <div key={band.range} className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-28 flex-shrink-0">{band.range}</span>
              <div className="flex-1 h-6 bg-gray-50 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                  style={{
                    width: `${Math.max((band.count / totalPlaced) * 100, 8)}%`,
                    backgroundColor: band.color,
                  }}
                >
                  <span className="text-[10px] text-white font-bold">{band.count}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student, company, or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {(['all', 'placed', 'offer letter', 'joined'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Placements Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Student</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Department</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Company</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Package</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Role</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => {
                const sc = statusConfig[p.status]
                return (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-semibold text-gray-900">{p.studentName}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{p.department}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm font-medium text-gray-800">{p.company}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm font-bold text-gray-900">{p.packageLPA} LPA</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-gray-600">{p.role}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sc.bg} ${sc.text}`}>
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-sm">No placements match your search.</p>
          </div>
        )}
      </div>

      {/* Top Recruiters Note */}
      <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-indigo-900">Placement Highlight</p>
            <p className="text-xs text-indigo-700 mt-1">
              Microsoft offered the highest package at 22.0 LPA to Neha Bhat (CSE). Average package up 12% from last year.
              Goldman Sachs and Texas Instruments are new recruiters this season.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
