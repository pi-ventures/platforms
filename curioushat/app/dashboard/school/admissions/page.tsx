'use client'
import { useState } from 'react'
import { UserPlus, Search, Eye, CheckCircle2, X, Clock } from 'lucide-react'

const applications = [
  { id: 'ADM001', name: 'Rohan Kapoor', class: '6', dob: '2014-03-15', parent: 'Mr. Deepak Kapoor', phone: '98765 43210', email: 'deepak@email.com', status: 'pending', applied: 'Mar 1, 2026', docs: 'complete' },
  { id: 'ADM002', name: 'Ananya Singh', class: '9', dob: '2011-07-22', parent: 'Mrs. Rekha Singh', phone: '87654 32109', email: 'rekha@email.com', status: 'shortlisted', applied: 'Feb 28, 2026', docs: 'complete' },
  { id: 'ADM003', name: 'Kiran Mehta', class: '6', dob: '2014-11-04', parent: 'Mr. Vikas Mehta', phone: '76543 21098', email: 'vikas@email.com', status: 'pending', applied: 'Feb 27, 2026', docs: 'incomplete' },
  { id: 'ADM004', name: 'Pooja Nambiar', class: '11', dob: '2009-05-18', parent: 'Dr. Pradeep Nambiar', phone: '65432 10987', email: 'pradeep@email.com', status: 'admitted', applied: 'Feb 20, 2026', docs: 'complete' },
  { id: 'ADM005', name: 'Sahil Chauhan', class: '8', dob: '2012-09-30', parent: 'Ms. Anita Chauhan', phone: '54321 09876', email: 'anita@email.com', status: 'rejected', applied: 'Feb 18, 2026', docs: 'incomplete' },
]

const statusConfig: Record<string, { color: string; icon: React.ElementType }> = {
  pending: { color: 'bg-amber-100 text-amber-700', icon: Clock },
  shortlisted: { color: 'bg-blue-100 text-blue-700', icon: Eye },
  admitted: { color: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  rejected: { color: 'bg-red-100 text-red-600', icon: X },
}

export default function AdmissionsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = applications.filter(a => {
    const matchSearch = a.name.toLowerCase().includes(search.toLowerCase()) || a.id.includes(search)
    const matchStatus = statusFilter === 'all' || a.status === statusFilter
    return matchSearch && matchStatus
  })

  const counts = { all: applications.length, pending: applications.filter(a => a.status === 'pending').length, shortlisted: applications.filter(a => a.status === 'shortlisted').length, admitted: applications.filter(a => a.status === 'admitted').length }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><UserPlus className="w-7 h-7 text-indigo-600" /> Admissions</h1>
          <p className="text-gray-500 mt-1">Session 2026–27 Applications</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
          <UserPlus className="w-4 h-4" /> New Application
        </button>
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
        <input type="text" placeholder="Search by name or application ID..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[400px] sm:min-w-[800px]">
          <thead className="bg-gray-50">
            <tr>
              {['App ID', 'Student Name', 'Class', 'Parent', 'Applied', 'Docs', 'Status', 'Actions'].map(h => (
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
                  <td className="px-4 py-3 text-gray-600">Class {a.class}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{a.parent}<br /><span className="text-gray-400">{a.phone}</span></td>
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
                      {a.status === 'pending' && <button className="text-xs text-emerald-600 hover:underline">Admit</button>}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
