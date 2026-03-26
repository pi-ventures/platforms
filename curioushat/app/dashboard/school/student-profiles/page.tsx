'use client'
import { useState } from 'react'
import { Search, Send, Download, Users, Target, Filter, ChevronRight, BarChart3, Sparkles } from 'lucide-react'

const MOCK_STUDENTS = [
  { id: 'STU-001', name: 'Om Aditya Raghuvanshi', class: 'XII-A', pct: 89.6, topSubject: 'CS', exam: 'JEE Main 98.2%ile', interest: 'B.Tech CS', status: 'sent', colleges: 3 },
  { id: 'STU-002', name: 'Riya Sharma', class: 'XII-B', pct: 91.2, topSubject: 'Biology', exam: 'NEET 645/720', interest: 'MBBS', status: 'sent', colleges: 5 },
  { id: 'STU-003', name: 'Karan Mehta', class: 'XII-A', pct: 85.4, topSubject: 'Physics', exam: 'JEE Main 92.1%ile', interest: 'B.Tech ECE', status: 'ready', colleges: 0 },
  { id: 'STU-004', name: 'Sneha Patel', class: 'XII-C', pct: 94.1, topSubject: 'English', exam: 'CLAT 128/150', interest: 'BA LLB', status: 'sent', colleges: 2 },
  { id: 'STU-005', name: 'Dev Joshi', class: 'XII-B', pct: 88.0, topSubject: 'Economics', exam: 'CUET 780/800', interest: 'BA Economics', status: 'ready', colleges: 0 },
  { id: 'STU-006', name: 'Priya Nair', class: 'XII-A', pct: 82.3, topSubject: 'Chemistry', exam: 'NEET 580/720', interest: 'BDS', status: 'draft', colleges: 0 },
  { id: 'STU-007', name: 'Sameer Khan', class: 'XII-C', pct: 78.5, topSubject: 'Maths', exam: 'JEE Main 85.3%ile', interest: 'B.Tech Mech', status: 'ready', colleges: 0 },
  { id: 'STU-008', name: 'Aisha Khan', class: 'XII-B', pct: 90.8, topSubject: 'Art', exam: 'NIFT 168/200', interest: 'B.Des Fashion', status: 'sent', colleges: 4 },
]

export default function StudentProfilesPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'sent' | 'ready' | 'draft'>('all')

  const students = MOCK_STUDENTS
    .filter(s => filter === 'all' || s.status === filter)
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">Student Profile Cards</h1>
        <p className="text-gray-500 text-sm mt-1">Auto-generated academic profiles — shareable with colleges and coaching institutes for admission leads</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-violet-50 rounded-lg flex items-center justify-center"><Users className="w-4 h-4 text-violet-600" /></div>
          <div><p className="text-lg font-black text-gray-900">{MOCK_STUDENTS.length}</p><p className="text-[10px] text-gray-500">Class XII Students</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center"><Send className="w-4 h-4 text-emerald-600" /></div>
          <div><p className="text-lg font-black text-gray-900">{MOCK_STUDENTS.filter(s => s.status === 'sent').length}</p><p className="text-[10px] text-gray-500">Profiles Sent</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center"><Target className="w-4 h-4 text-blue-600" /></div>
          <div><p className="text-lg font-black text-gray-900">{MOCK_STUDENTS.reduce((a, s) => a + s.colleges, 0)}</p><p className="text-[10px] text-gray-500">College Leads</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center"><BarChart3 className="w-4 h-4 text-amber-600" /></div>
          <div><p className="text-lg font-black text-gray-900">{(MOCK_STUDENTS.reduce((a, s) => a + s.pct, 0) / MOCK_STUDENTS.length).toFixed(1)}%</p><p className="text-[10px] text-gray-500">Avg Performance</p></div>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" />
        </div>
        {(['all', 'sent', 'ready', 'draft'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors capitalize ${filter === f ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {f}
          </button>
        ))}
        <button className="flex items-center gap-1.5 text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700 transition-colors ml-auto">
          <Send className="w-3 h-3" /> Bulk Send to Colleges
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100 bg-gray-50">
              <th className="px-4 py-3 text-left font-semibold">Student</th>
              <th className="px-4 py-3 text-left font-semibold">Class</th>
              <th className="px-4 py-3 text-center font-semibold">Overall %</th>
              <th className="px-4 py-3 text-left font-semibold hidden md:table-cell">Entrance Exam</th>
              <th className="px-4 py-3 text-left font-semibold hidden lg:table-cell">Interest</th>
              <th className="px-4 py-3 text-center font-semibold">Status</th>
              <th className="px-4 py-3 text-center font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {students.map(s => (
              <tr key={s.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <p className="font-semibold text-gray-900 text-xs">{s.name}</p>
                  <p className="text-[10px] text-gray-400">{s.id}</p>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600">{s.class}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs font-bold ${s.pct >= 90 ? 'text-emerald-600' : s.pct >= 80 ? 'text-blue-600' : 'text-amber-600'}`}>{s.pct}%</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-600 hidden md:table-cell">{s.exam}</td>
                <td className="px-4 py-3 text-xs text-gray-600 hidden lg:table-cell">{s.interest}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                    s.status === 'sent' ? 'bg-emerald-50 text-emerald-600' :
                    s.status === 'ready' ? 'bg-blue-50 text-blue-600' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {s.status === 'sent' ? `✅ Sent (${s.colleges})` : s.status === 'ready' ? '📋 Ready' : '📝 Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button className="p-1 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors" title="View Profile"><ChevronRight className="w-4 h-4" /></button>
                    <button className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Send to College"><Send className="w-4 h-4" /></button>
                    <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download PDF"><Download className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-4">
        <p className="text-xs text-gray-600 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-violet-500" />
          <strong>One-click send:</strong> Student profiles are auto-generated from CuriousHat school data. Send to any college on the platform — they see the full academic profile, entrance exam results, and AI career recommendations.
        </p>
      </div>
    </div>
  )
}
