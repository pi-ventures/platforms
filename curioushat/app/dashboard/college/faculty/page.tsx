'use client'
import { useState } from 'react'
import { Search, Users, BookOpen, Clock, Filter } from 'lucide-react'

type FacultyStatus = 'active' | 'on leave' | 'sabbatical'

interface Faculty {
  name: string
  department: string
  designation: string
  experience: number
  courses: string[]
  status: FacultyStatus
  email: string
}

const facultyData: Faculty[] = [
  {
    name: 'Dr. Ramesh Iyer',
    department: 'Computer Science',
    designation: 'Professor',
    experience: 22,
    courses: ['Data Structures', 'Machine Learning'],
    status: 'active',
    email: 'r.iyer@college.edu',
  },
  {
    name: 'Dr. Sunita Agarwal',
    department: 'Business Administration',
    designation: 'Professor',
    experience: 18,
    courses: ['Financial Management', 'Marketing Strategy'],
    status: 'active',
    email: 's.agarwal@college.edu',
  },
  {
    name: 'Dr. Priya Nair',
    department: 'Physics',
    designation: 'Associate Professor',
    experience: 12,
    courses: ['Quantum Mechanics', 'Optics'],
    status: 'active',
    email: 'p.nair@college.edu',
  },
  {
    name: 'Prof. Vikram Deshmukh',
    department: 'Mathematics',
    designation: 'Associate Professor',
    experience: 14,
    courses: ['Linear Algebra', 'Real Analysis'],
    status: 'on leave',
    email: 'v.deshmukh@college.edu',
  },
  {
    name: 'Dr. Ananya Chatterjee',
    department: 'Chemistry',
    designation: 'Assistant Professor',
    experience: 6,
    courses: ['Organic Chemistry', 'Spectroscopy'],
    status: 'active',
    email: 'a.chatterjee@college.edu',
  },
  {
    name: 'Dr. Manoj Tiwari',
    department: 'Electronics',
    designation: 'Professor',
    experience: 20,
    courses: ['VLSI Design', 'Embedded Systems'],
    status: 'sabbatical',
    email: 'm.tiwari@college.edu',
  },
  {
    name: 'Prof. Deepika Joshi',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    experience: 5,
    courses: ['Web Development', 'Database Systems'],
    status: 'active',
    email: 'd.joshi@college.edu',
  },
  {
    name: 'Dr. Rajiv Menon',
    department: 'Electronics',
    designation: 'Associate Professor',
    experience: 15,
    courses: ['Signal Processing', 'Control Systems'],
    status: 'active',
    email: 'r.menon@college.edu',
  },
]

const statusConfig: Record<FacultyStatus, { bg: string; text: string }> = {
  'active':     { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'on leave':   { bg: 'bg-amber-50', text: 'text-amber-700' },
  'sabbatical': { bg: 'bg-blue-50', text: 'text-blue-700' },
}

const designationColor: Record<string, string> = {
  'Professor': '#4F46E5',
  'Associate Professor': '#7C3AED',
  'Assistant Professor': '#0891B2',
}

function getInitials(name: string) {
  return name.replace(/^(Dr\.|Prof\.) /, '').split(' ').map(n => n[0]).join('').slice(0, 2)
}

export default function FacultyPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<FacultyStatus | 'all'>('all')

  const filtered = facultyData.filter((f) => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.department.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || f.status === statusFilter
    return matchSearch && matchStatus
  })

  const activeFaculty = facultyData.filter(f => f.status === 'active').length
  const totalCourses = facultyData.reduce((s, f) => s + f.courses.length, 0)
  const avgExp = Math.round(facultyData.reduce((s, f) => s + f.experience, 0) / facultyData.length)

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 mb-2">Faculty</h1>
      <p className="text-gray-500 text-sm mb-6">Faculty profiles, workload, and performance</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-indigo-50">
              <Users className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{facultyData.length}</p>
              <p className="text-xs text-gray-500">Total Faculty</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50">
              <Users className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{activeFaculty}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-50">
              <BookOpen className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{totalCourses}</p>
              <p className="text-xs text-gray-500">Courses Taught</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-cyan-50">
              <Clock className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{avgExp} yrs</p>
              <p className="text-xs text-gray-500">Avg Experience</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          {(['all', 'active', 'on leave', 'sabbatical'] as const).map((s) => (
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

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((f) => {
          const sc = statusConfig[f.status]
          const dColor = designationColor[f.designation] || '#6B7280'
          return (
            <div
              key={f.email}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-indigo-200 hover:shadow-md transition-all"
            >
              {/* Avatar + Name */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: dColor }}
                >
                  {getInitials(f.name)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm truncate">{f.name}</p>
                  <p className="text-[11px] text-gray-400 truncate">{f.department}</p>
                </div>
              </div>

              {/* Designation */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: dColor + '15', color: dColor }}>
                  {f.designation}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sc.bg} ${sc.text}`}>
                  {f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                </span>
              </div>

              {/* Experience */}
              <div className="mb-3 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-600">{f.experience} years experience</span>
              </div>

              {/* Courses */}
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1.5">Teaching</p>
                <div className="flex flex-wrap gap-1.5">
                  {f.courses.map((c) => (
                    <span key={c} className="text-[11px] bg-gray-50 text-gray-600 px-2 py-0.5 rounded-md border border-gray-100">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center mt-4">
          <p className="text-gray-400 text-sm">No faculty members match your search.</p>
        </div>
      )}
    </div>
  )
}
