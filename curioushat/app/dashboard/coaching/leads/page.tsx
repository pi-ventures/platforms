'use client'
import { useState } from 'react'
import { Users, TrendingUp, Calendar, UserCheck, Search, Phone, Plus } from 'lucide-react'

const stats = [
  { label: 'Total Leads', value: '247', sub: 'this month: 68', icon: Users, color: '#7C3AED', bg: 'bg-violet-50' },
  { label: 'Conversion Rate', value: '23.4%', sub: '+3.2% vs last month', icon: TrendingUp, color: '#059669', bg: 'bg-emerald-50' },
  { label: 'Demos Scheduled', value: '18', sub: 'next 7 days', icon: Calendar, color: '#D97706', bg: 'bg-amber-50' },
  { label: 'Enrolled This Month', value: '34', sub: '₹12.4L revenue', icon: UserCheck, color: '#1D4ED8', bg: 'bg-blue-50' },
]

const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700',
  contacted: 'bg-amber-50 text-amber-700',
  'demo attended': 'bg-violet-50 text-violet-700',
  enrolled: 'bg-emerald-50 text-emerald-700',
  lost: 'bg-gray-100 text-gray-500',
}

const examColors: Record<string, string> = {
  JEE: 'bg-indigo-50 text-indigo-700',
  NEET: 'bg-emerald-50 text-emerald-700',
  CLAT: 'bg-amber-50 text-amber-700',
  CA: 'bg-rose-50 text-rose-700',
  NDA: 'bg-blue-50 text-blue-700',
}

const leads = [
  { id: 1, name: 'Aarav Sharma', phone: '98765 43210', exam: 'JEE', source: 'Google Ads', status: 'new', followUp: '2026-04-03', notes: 'Interested in dropper batch, scored 82%ile in first attempt' },
  { id: 2, name: 'Diya Reddy', phone: '87654 32109', exam: 'NEET', source: 'YouTube', status: 'demo attended', followUp: '2026-04-04', notes: 'Wants biology-focused batch, parent called separately' },
  { id: 3, name: 'Karthik Iyer', phone: '76543 21098', exam: 'JEE', source: 'Referral', status: 'contacted', followUp: '2026-04-05', notes: 'Referred by Om Aditya (current student), strong in maths' },
  { id: 4, name: 'Priya Gupta', phone: '96543 21087', exam: 'CLAT', source: 'Website', status: 'enrolled', followUp: '-', notes: 'Joined weekend batch, paid full fee' },
  { id: 5, name: 'Rohit Verma', phone: '85432 10976', exam: 'NDA', source: 'Walk-in', status: 'demo attended', followUp: '2026-04-06', notes: 'Ex-NCC cadet, needs SSB guidance too' },
  { id: 6, name: 'Sneha Patil', phone: '74321 09865', exam: 'NEET', source: 'Google Ads', status: 'new', followUp: '2026-04-03', notes: 'From Warangal, looking for hostel facility' },
  { id: 7, name: 'Arjun Mehra', phone: '93210 98754', exam: 'CA', source: 'Referral', status: 'contacted', followUp: '2026-04-07', notes: 'Wants to know about Nov 2026 Foundation batch' },
  { id: 8, name: 'Kavya Nair', phone: '82109 87643', exam: 'JEE', source: 'YouTube', status: 'lost', followUp: '-', notes: 'Chose competitor — price sensitive, offered discount but declined' },
  { id: 9, name: 'Vikram Singh', phone: '91098 76532', exam: 'NEET', source: 'Walk-in', status: 'enrolled', followUp: '-', notes: 'Dropper, joined with scholarship (80% waiver)' },
  { id: 10, name: 'Ananya Das', phone: '80987 65421', exam: 'CLAT', source: 'Website', status: 'new', followUp: '2026-04-04', notes: 'Preparing alongside 12th boards, wants weekend slot' },
]

const tabs = ['All', 'New', 'Contacted', 'Demo Attended', 'Enrolled', 'Lost']

export default function CoachingLeadsPage() {
  const [activeTab, setActiveTab] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = leads.filter(l => {
    const matchTab = activeTab === 'All' || l.status.toLowerCase() === activeTab.toLowerCase()
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.exam.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Admission Leads</h1>
          <p className="text-sm text-gray-500 mt-1">Track and convert prospective students across all exam categories</p>
        </div>
        <button className="bg-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-violet-700 transition-colors">
          <Plus className="w-4 h-4" />
          Add Lead
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">{s.label}</span>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100 space-y-4">
          <div className="flex items-center gap-2 overflow-x-auto">
            {tabs.map(tab => {
              const count = tab === 'All' ? leads.length : leads.filter(l => l.status.toLowerCase() === tab.toLowerCase()).length
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab} <span className="text-xs ml-1 opacity-70">({count})</span>
                </button>
              )
            })}
          </div>
          <div className="relative max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or exam..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Name</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Phone</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Exam</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Source</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Follow-up</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(lead => (
                <tr key={lead.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5 font-medium text-gray-900">{lead.name}</td>
                  <td className="px-4 py-3.5 text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      {lead.phone}
                    </div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${examColors[lead.exam]}`}>
                      {lead.exam}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">{lead.source}</td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600">
                    {lead.followUp === '-' ? (
                      <span className="text-gray-300">—</span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(lead.followUp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 text-gray-500 text-xs max-w-[200px] truncate">{lead.notes}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400">No leads match your filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
