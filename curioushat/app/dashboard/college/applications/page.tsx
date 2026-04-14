'use client'
import { useState } from 'react'
import { UserPlus, Search, Eye, CheckCircle2, X, Clock, FileText } from 'lucide-react'

const applications = [
  { id: 'APP2026-001', name: 'Arjun Venkatesh', course: 'B.Tech CS', phone: '98765 43210', applied: 'Mar 18, 2026', docs: 'complete', status: 'shortlisted' },
  { id: 'APP2026-002', name: 'Priya Sharma', course: 'BBA', phone: '87654 32109', applied: 'Mar 16, 2026', docs: 'complete', status: 'admitted' },
  { id: 'APP2026-003', name: 'Mohammed Irfan', course: 'B.Tech CS', phone: '76543 21098', applied: 'Mar 15, 2026', docs: 'incomplete', status: 'pending' },
  { id: 'APP2026-004', name: 'Sneha Kulkarni', course: 'B.Sc Physics', phone: '65432 10987', applied: 'Mar 14, 2026', docs: 'complete', status: 'admitted' },
  { id: 'APP2026-005', name: 'Rahul Gupta', course: 'B.Tech CS', phone: '91234 56789', applied: 'Mar 12, 2026', docs: 'complete', status: 'pending' },
  { id: 'APP2026-006', name: 'Kavitha Nair', course: 'BBA', phone: '82345 67890', applied: 'Mar 10, 2026', docs: 'incomplete', status: 'rejected' },
  { id: 'APP2026-007', name: 'Deepak Yadav', course: 'B.Sc Chemistry', phone: '73456 78901', applied: 'Mar 8, 2026', docs: 'complete', status: 'shortlisted' },
  { id: 'APP2026-008', name: 'Ananya Reddy', course: 'B.Sc Physics', phone: '64567 89012', applied: 'Mar 5, 2026', docs: 'complete', status: 'pending' },
]

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  pending: { color: 'bg-amber-100 text-amber-700', icon: Clock },
  shortlisted: { color: 'bg-blue-100 text-blue-700', icon: Eye },
  admitted: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  rejected: { color: 'bg-red-100 text-red-600', icon: X },
}

export default function ApplicationsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = applications.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase()) || a.course.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = {
    all: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length,
    admitted: applications.filter(a => a.status === 'admitted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><FileText className="w-7 h-7 text-indigo-600" /> Applications</h1>
          <p className="text-gray-500 mt-1">Session 2026-27 Admission Applications</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
          <UserPlus className="w-4 h-4" /> New Application
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Applications', value: applications.length, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Pending Review', value: counts.pending, color: 'text-amber-600 bg-amber-50' },
          { label: 'Shortlisted', value: counts.shortlisted, color: 'text-blue-600 bg-blue-50' },
          { label: 'Admitted', value: counts.admitted, color: 'text-emerald-600 bg-emerald-50' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-xs font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {Object.entries(counts).map(([status, count]) => (
          <button key={status} onClick={() => setStatusFilter(status)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all capitalize ${statusFilter === status ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-indigo-50'}`}>
            {status} ({count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search by name, application ID, or course..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[400px] sm:min-w-[900px]">
          <thead className="bg-gray-50">
            <tr>
              {['App ID', 'Student Name', 'Course', 'Phone', 'Applied', 'Docs', 'Status', 'Actions'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map(a => {
              const cfg = statusConfig[a.status]
              return (
                <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-indigo-600 font-medium">{a.id}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{a.name}</td>
                  <td className="px-4 py-3 text-gray-600">{a.course}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{a.phone}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{a.applied}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.docs === 'complete' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-600'}`}>{a.docs}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${cfg.color}`}>{a.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs text-indigo-600 hover:underline">View</button>
                      {a.status === 'pending' && <button className="text-xs text-blue-600 hover:underline">Shortlist</button>}
                      {a.status === 'shortlisted' && <button className="text-xs text-emerald-600 hover:underline">Admit</button>}
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-400 text-sm">No applications match your filters</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
