'use client'
import { useState } from 'react'
import {
  Search, Filter, UserPlus, Phone, Globe, Users, Eye,
  Calendar, TrendingUp, ArrowRight
} from 'lucide-react'

type LeadStatus = 'new' | 'contacted' | 'campus visit' | 'enrolled' | 'lost'
type LeadSource = 'website' | 'walk-in' | 'referral'

interface Lead {
  name: string
  phone: string
  courseInterested: string
  source: LeadSource
  status: LeadStatus
  followUpDate: string
}

const leads: Lead[] = [
  { name: 'Aarav Mehta', phone: '98765 43210', courseInterested: 'B.Tech CSE', source: 'website', status: 'new', followUpDate: '2026-04-04' },
  { name: 'Ishita Sharma', phone: '87654 32109', courseInterested: 'BBA', source: 'walk-in', status: 'contacted', followUpDate: '2026-04-03' },
  { name: 'Rohan Gupta', phone: '76543 21098', courseInterested: 'B.Sc Physics', source: 'referral', status: 'campus visit', followUpDate: '2026-04-05' },
  { name: 'Sneha Patil', phone: '96543 21087', courseInterested: 'B.Tech ECE', source: 'website', status: 'enrolled', followUpDate: '2026-03-28' },
  { name: 'Aditya Reddy', phone: '85432 10976', courseInterested: 'B.Sc Mathematics', source: 'walk-in', status: 'new', followUpDate: '2026-04-06' },
  { name: 'Pooja Kulkarni', phone: '74321 09865', courseInterested: 'B.Tech CSE', source: 'referral', status: 'contacted', followUpDate: '2026-04-04' },
  { name: 'Karthik Nair', phone: '93210 98754', courseInterested: 'BBA', source: 'website', status: 'lost', followUpDate: '2026-03-25' },
  { name: 'Divya Joshi', phone: '82109 87643', courseInterested: 'B.Sc Chemistry', source: 'walk-in', status: 'campus visit', followUpDate: '2026-04-07' },
  { name: 'Manish Tiwari', phone: '71098 76532', courseInterested: 'B.Tech ECE', source: 'referral', status: 'new', followUpDate: '2026-04-05' },
  { name: 'Riya Desai', phone: '90987 65421', courseInterested: 'B.Tech CSE', source: 'website', status: 'contacted', followUpDate: '2026-04-08' },
]

const statusConfig: Record<LeadStatus, { bg: string; text: string }> = {
  'new':          { bg: 'bg-blue-50', text: 'text-blue-700' },
  'contacted':    { bg: 'bg-amber-50', text: 'text-amber-700' },
  'campus visit': { bg: 'bg-violet-50', text: 'text-violet-700' },
  'enrolled':     { bg: 'bg-emerald-50', text: 'text-emerald-700' },
  'lost':         { bg: 'bg-red-50', text: 'text-red-700' },
}

const sourceConfig: Record<LeadSource, { icon: typeof Globe; color: string; label: string }> = {
  'website':  { icon: Globe, color: '#4F46E5', label: 'Website' },
  'walk-in':  { icon: Users, color: '#059669', label: 'Walk-in' },
  'referral': { icon: UserPlus, color: '#B45309', label: 'Referral' },
}

export default function CollegeLeadsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.courseInterested.toLowerCase().includes(search.toLowerCase()) ||
      l.phone.includes(search)
    const matchStatus = statusFilter === 'all' || l.status === statusFilter
    return matchSearch && matchStatus
  })

  const newCount = leads.filter(l => l.status === 'new').length
  const contactedCount = leads.filter(l => l.status === 'contacted').length
  const visitCount = leads.filter(l => l.status === 'campus visit').length
  const enrolledCount = leads.filter(l => l.status === 'enrolled').length

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 mb-2">Admission Leads</h1>
      <p className="text-gray-500 text-sm mb-6">AI-matched leads from CuriousHat student exam results</p>

      {/* Funnel Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-50">
              <UserPlus className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{newCount}</p>
              <p className="text-xs text-gray-500">New Leads</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-amber-50">
              <Phone className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{contactedCount}</p>
              <p className="text-xs text-gray-500">Contacted</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-violet-50">
              <Eye className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{visitCount}</p>
              <p className="text-xs text-gray-500">Campus Visits</p>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-50">
              <TrendingUp className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900">{enrolledCount}</p>
              <p className="text-xs text-gray-500">Enrolled</p>
            </div>
          </div>
        </div>
      </div>

      {/* Funnel Visual */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-6">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
          <span className="font-semibold text-gray-700">Lead Funnel</span>
          <ArrowRight className="w-3 h-3" />
        </div>
        <div className="flex items-center gap-1">
          {[
            { label: 'New', count: newCount, color: '#3B82F6' },
            { label: 'Contacted', count: contactedCount, color: '#F59E0B' },
            { label: 'Campus Visit', count: visitCount, color: '#8B5CF6' },
            { label: 'Enrolled', count: enrolledCount, color: '#10B981' },
          ].map((stage, i) => (
            <div key={stage.label} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-lg flex items-center justify-center py-2 text-white font-bold text-sm"
                style={{ backgroundColor: stage.color }}
              >
                {stage.count}
              </div>
              <span className="text-[10px] text-gray-500">{stage.label}</span>
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
            placeholder="Search by name, phone, or course..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          {(['all', 'new', 'contacted', 'campus visit', 'enrolled', 'lost'] as const).map((s) => (
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

      {/* Leads Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Name</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Phone</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Course</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Source</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Follow-up</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((lead, i) => {
                const sc = statusConfig[lead.status]
                const src = sourceConfig[lead.source]
                const SrcIcon = src.icon
                const isOverdue = new Date(lead.followUpDate) < new Date('2026-04-02')
                return (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">{lead.name}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{lead.phone}</td>
                    <td className="px-4 py-3 text-sm text-gray-700 font-medium">{lead.courseInterested}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <SrcIcon className="w-3.5 h-3.5" style={{ color: src.color }} />
                        <span className="text-xs text-gray-600">{src.label}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sc.bg} ${sc.text}`}>
                        {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span className={`text-xs ${isOverdue ? 'text-red-600 font-semibold' : 'text-gray-600'}`}>
                          {new Date(lead.followUpDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-400 text-sm">No leads match your filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
