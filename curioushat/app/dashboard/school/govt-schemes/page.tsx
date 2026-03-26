'use client'
import { useState } from 'react'
import { Search, CheckCircle2, AlertTriangle, Clock, ExternalLink, BarChart3, Shield, Globe, Users, FileText, TrendingUp, Sparkles, ChevronDown, ChevronRight } from 'lucide-react'

/* ── Scheme data ── */
interface GovtScheme {
  id: string; name: string; ministry: string; description: string
  category: 'meal' | 'quality' | 'enrollment' | 'scholarship' | 'infrastructure' | 'digital' | 'girls' | 'tribal' | 'assessment'
  status: 'compliant' | 'action_needed' | 'pending' | 'not_applicable'
  compliance: number // 0-100
  metrics: { label: string; value: string; target: string; met: boolean }[]
  dueDate?: string
  portal?: string
}

const SCHEMES: GovtScheme[] = [
  {
    id: 'pm-poshan', name: 'PM POSHAN (Mid-Day Meal)', ministry: 'Ministry of Education',
    description: 'Daily free meal for students in government and aided schools — track attendance vs meals served',
    category: 'meal', status: 'compliant', compliance: 94,
    metrics: [
      { label: 'Students enrolled', value: '1,248', target: '1,248', met: true },
      { label: 'Avg daily meals', value: '1,142', target: '1,100+', met: true },
      { label: 'Menu compliance', value: '100%', target: '100%', met: true },
      { label: 'Supplier inspections', value: '3/4', target: '4/quarter', met: false },
    ],
    dueDate: '2026-03-31', portal: 'https://pmposhan.education.gov.in',
  },
  {
    id: 'samagra-shiksha', name: 'Samagra Shiksha Abhiyan', ministry: 'Ministry of Education',
    description: 'Integrated scheme for school education — enrollment, retention, learning outcomes, teacher training',
    category: 'quality', status: 'action_needed', compliance: 78,
    metrics: [
      { label: 'Enrollment rate', value: '98.2%', target: '100%', met: false },
      { label: 'Dropout rate', value: '2.1%', target: '<2%', met: false },
      { label: 'Learning outcomes', value: '72%', target: '80%', met: false },
      { label: 'Teacher training hrs', value: '42/50', target: '50 hrs/yr', met: false },
    ],
    dueDate: '2026-06-30', portal: 'https://samagra.education.gov.in',
  },
  {
    id: 'pm-shri', name: 'PM SHRI Schools', ministry: 'Ministry of Education',
    description: 'Showcase schools with quality benchmarks — NEP 2020 aligned, modern pedagogy, green campus',
    category: 'quality', status: 'compliant', compliance: 88,
    metrics: [
      { label: 'NEP alignment', value: '85%', target: '80%', met: true },
      { label: 'Smart classrooms', value: '12/15', target: '15', met: false },
      { label: 'Green audit', value: 'Passed', target: 'Pass', met: true },
      { label: 'Innovation lab', value: 'Active', target: 'Active', met: true },
    ],
    portal: 'https://pmshrischools.education.gov.in',
  },
  {
    id: 'rte', name: 'RTE Act Compliance', ministry: 'Ministry of Education',
    description: 'Right to Education — 25% EWS reservation tracking, admission records, infrastructure norms',
    category: 'enrollment', status: 'compliant', compliance: 96,
    metrics: [
      { label: 'EWS seats (25%)', value: '312/312', target: '312', met: true },
      { label: 'PTR (pupil-teacher)', value: '28:1', target: '<30:1', met: true },
      { label: 'Infrastructure norms', value: '14/15', target: '15 criteria', met: false },
      { label: 'No detention compliance', value: '100%', target: '100%', met: true },
    ],
  },
  {
    id: 'udise', name: 'UDISE+ Reporting', ministry: 'Ministry of Education',
    description: 'Unified District Information System for Education — annual school data report auto-generated',
    category: 'digital', status: 'pending', compliance: 65,
    metrics: [
      { label: 'Data fields complete', value: '142/218', target: '218', met: false },
      { label: 'Teacher data', value: '100%', target: '100%', met: true },
      { label: 'Infrastructure data', value: '80%', target: '100%', met: false },
      { label: 'Enrollment data', value: '100%', target: '100%', met: true },
    ],
    dueDate: '2026-04-15', portal: 'https://udiseplus.gov.in',
  },
  {
    id: 'kgbv', name: 'Kasturba Gandhi Balika Vidyalaya', ministry: 'Ministry of Education',
    description: 'Girls education — enrollment, hostel facilities, dropout prevention in educationally backward blocks',
    category: 'girls', status: 'compliant', compliance: 91,
    metrics: [
      { label: 'Girls enrollment', value: '624', target: '600+', met: true },
      { label: 'Girls dropout rate', value: '1.2%', target: '<2%', met: true },
      { label: 'Girls:Boys ratio', value: '0.96', target: '>0.9', met: true },
      { label: 'Hostel occupancy', value: '88%', target: '85%+', met: true },
    ],
  },
  {
    id: 'nipun', name: 'NIPUN Bharat', ministry: 'Ministry of Education',
    description: 'National Initiative for Proficiency in Reading with Understanding and Numeracy — foundational literacy by Class 3',
    category: 'assessment', status: 'action_needed', compliance: 72,
    metrics: [
      { label: 'Reading proficiency (Class 3)', value: '68%', target: '80%', met: false },
      { label: 'Numeracy proficiency', value: '74%', target: '80%', met: false },
      { label: 'Teacher training (FLN)', value: '85%', target: '100%', met: false },
      { label: 'Learning materials', value: 'Available', target: 'Available', met: true },
    ],
    dueDate: '2026-12-31',
  },
  {
    id: 'vidyanjali', name: 'Vidyanjali', ministry: 'Ministry of Education',
    description: 'School volunteer & donor program — track contributions, volunteer hours, material donations',
    category: 'quality', status: 'compliant', compliance: 85,
    metrics: [
      { label: 'Volunteers registered', value: '18', target: '10+', met: true },
      { label: 'Hours contributed', value: '240', target: '200+', met: true },
      { label: 'Materials donated', value: '₹1.2L', target: 'Any', met: true },
    ],
    portal: 'https://vidyanjali.education.gov.in',
  },
  {
    id: 'nas', name: 'NAS / SAS Readiness', ministry: 'NCERT / State SCERT',
    description: 'National/State Achievement Survey — assessment readiness, sample testing, outcome benchmarks',
    category: 'assessment', status: 'pending', compliance: 60,
    metrics: [
      { label: 'Assessment readiness', value: '60%', target: '100%', met: false },
      { label: 'Sample test conducted', value: 'No', target: 'Yes', met: false },
      { label: 'Teacher awareness', value: '75%', target: '100%', met: false },
    ],
  },
  {
    id: 'nsp', name: 'National Scholarship Portal', ministry: 'Ministry of Education',
    description: 'Track student scholarship applications — Pre-matric, Post-matric, Merit-cum-Means',
    category: 'scholarship', status: 'compliant', compliance: 90,
    metrics: [
      { label: 'Eligible students identified', value: '342', target: '342', met: true },
      { label: 'Applications submitted', value: '310', target: '342', met: false },
      { label: 'Scholarships disbursed', value: '₹18.6L', target: '₹20L', met: false },
      { label: 'Renewal rate', value: '94%', target: '90%+', met: true },
    ],
    portal: 'https://scholarships.gov.in',
  },
]

const statusConfig = {
  compliant: { label: 'Compliant', color: '#059669', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
  action_needed: { label: 'Action Needed', color: '#D97706', bg: 'bg-amber-50', dot: 'bg-amber-500' },
  pending: { label: 'Pending', color: '#DC2626', bg: 'bg-red-50', dot: 'bg-red-500' },
  not_applicable: { label: 'N/A', color: '#6B7280', bg: 'bg-gray-50', dot: 'bg-gray-400' },
}

export default function GovtSchemesPage() {
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<string | null>('pm-poshan')
  const [filter, setFilter] = useState<'all' | 'action_needed' | 'pending' | 'compliant'>('all')

  const filtered = SCHEMES
    .filter(s => filter === 'all' || s.status === filter)
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.ministry.toLowerCase().includes(search.toLowerCase()))

  const complianceAvg = Math.round(SCHEMES.reduce((a, s) => a + s.compliance, 0) / SCHEMES.length)
  const actionCount = SCHEMES.filter(s => s.status === 'action_needed').length
  const pendingCount = SCHEMES.filter(s => s.status === 'pending').length

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">Government Scheme Tracker</h1>
        <p className="text-gray-500 text-sm mt-1">Track compliance across 10+ central government education schemes — auto-filled from school data</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-emerald-50 rounded-lg flex items-center justify-center"><Shield className="w-4 h-4 text-emerald-600" /></div>
          <div><p className="text-xl font-black text-gray-900">{complianceAvg}%</p><p className="text-[10px] text-gray-500">Avg Compliance</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center"><FileText className="w-4 h-4 text-violet-600" /></div>
          <div><p className="text-xl font-black text-gray-900">{SCHEMES.length}</p><p className="text-[10px] text-gray-500">Schemes Tracked</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center"><AlertTriangle className="w-4 h-4 text-amber-600" /></div>
          <div><p className="text-xl font-black text-gray-900">{actionCount}</p><p className="text-[10px] text-gray-500">Need Action</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center"><Clock className="w-4 h-4 text-red-600" /></div>
          <div><p className="text-xl font-black text-gray-900">{pendingCount}</p><p className="text-[10px] text-gray-500">Pending</p></div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search schemes…"
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" />
        </div>
        <div className="flex gap-1.5">
          {(['all', 'action_needed', 'pending', 'compliant'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors capitalize ${
                filter === f ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {f === 'all' ? `All (${SCHEMES.length})` : f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme cards */}
      <div className="space-y-3">
        {filtered.map(scheme => {
          const sc = statusConfig[scheme.status]
          const isExpanded = expanded === scheme.id
          return (
            <div key={scheme.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button onClick={() => setExpanded(isExpanded ? null : scheme.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors">
                {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-bold text-gray-900 text-sm">{scheme.name}</p>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${sc.bg}`} style={{ color: sc.color }}>
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${sc.dot} mr-1`} />{sc.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-0.5">{scheme.ministry}</p>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-black" style={{ color: sc.color }}>{scheme.compliance}%</p>
                    <p className="text-[9px] text-gray-400">compliance</p>
                  </div>
                  <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden hidden sm:block">
                    <div className="h-full rounded-full transition-all" style={{ width: `${scheme.compliance}%`, backgroundColor: sc.color }} />
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-4 pt-0 border-t border-gray-100">
                  <p className="text-xs text-gray-500 mb-3 mt-3">{scheme.description}</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
                    {scheme.metrics.map(m => (
                      <div key={m.label} className={`rounded-lg px-3 py-2 border ${m.met ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
                        <div className="flex items-center gap-1 mb-0.5">
                          {m.met ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <AlertTriangle className="w-3 h-3 text-amber-500" />}
                          <p className="text-[10px] text-gray-500">{m.label}</p>
                        </div>
                        <p className="text-sm font-bold text-gray-900">{m.value}</p>
                        <p className="text-[9px] text-gray-400">Target: {m.target}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    {scheme.dueDate && (
                      <span className="text-gray-500 flex items-center gap-1"><Clock className="w-3 h-3" /> Due: {new Date(scheme.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    )}
                    {scheme.portal && (
                      <a href={scheme.portal} target="_blank" rel="noopener noreferrer" className="text-violet-600 hover:underline flex items-center gap-1">
                        <ExternalLink className="w-3 h-3" /> Open Portal
                      </a>
                    )}
                    <button className="ml-auto text-violet-600 hover:bg-violet-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Auto-fill from CuriousHat data
                    </button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Auto-fill banner */}
      <div className="mt-6 bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h3 className="font-bold text-gray-900 text-sm">CuriousHat Auto-Compliance</h3>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">
          CuriousHat automatically fills government portal data from your school records — attendance feeds PM POSHAN, enrollment feeds UDISE+,
          assessment data feeds NAS/SAS, scholarship records feed NSP. One data entry, 10+ portals auto-synced.
          <strong> Right now a government school HM manually fills 15+ registers and 10+ digital portals. CuriousHat does it all from one place.</strong>
        </p>
      </div>
    </div>
  )
}
