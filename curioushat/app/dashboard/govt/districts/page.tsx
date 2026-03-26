'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Search, TrendingUp, TrendingDown, Minus, AlertTriangle, School, GraduationCap, ChevronDown, Filter } from 'lucide-react'

// ── District data ─────────────────────────────────────────────────────────────
const allDistricts = [
  { name: 'Pune', region: 'Western', schools: 1840, students: 312400, avgScore: 78.4, attendance: 91.2, passRate: 96.1, mathScore: 74.1, sciScore: 79.2, engScore: 81.3, rank: 1, trend: 'up', dropout: 3.2, teacherRatio: 28, flagged: 0 },
  { name: 'Nashik', region: 'Northern', schools: 1620, students: 284100, avgScore: 75.8, attendance: 89.4, passRate: 94.8, mathScore: 71.3, sciScore: 77.4, engScore: 78.6, rank: 2, trend: 'up', dropout: 4.1, teacherRatio: 31, flagged: 12 },
  { name: 'Mumbai', region: 'Konkan', schools: 2100, students: 418200, avgScore: 74.2, attendance: 87.6, passRate: 93.2, mathScore: 70.8, sciScore: 75.6, engScore: 76.4, rank: 3, trend: 'stable', dropout: 4.8, teacherRatio: 34, flagged: 18 },
  { name: 'Thane', region: 'Konkan', schools: 1480, students: 267100, avgScore: 73.1, attendance: 86.9, passRate: 92.4, mathScore: 69.4, sciScore: 74.2, engScore: 75.8, rank: 4, trend: 'up', dropout: 4.5, teacherRatio: 32, flagged: 8 },
  { name: 'Kolhapur', region: 'Western', schools: 1120, students: 198400, avgScore: 72.4, attendance: 88.1, passRate: 91.8, mathScore: 68.9, sciScore: 73.1, engScore: 74.2, rank: 5, trend: 'stable', dropout: 5.1, teacherRatio: 30, flagged: 6 },
  { name: 'Aurangabad', region: 'Marathwada', schools: 1340, students: 218700, avgScore: 69.1, attendance: 83.1, passRate: 88.4, mathScore: 64.2, sciScore: 70.3, engScore: 72.8, rank: 6, trend: 'up', dropout: 6.2, teacherRatio: 36, flagged: 24 },
  { name: 'Nagpur', region: 'Vidarbha', schools: 1560, students: 267300, avgScore: 68.7, attendance: 82.8, passRate: 87.9, mathScore: 63.8, sciScore: 69.8, engScore: 71.4, rank: 7, trend: 'down', dropout: 6.8, teacherRatio: 35, flagged: 31 },
  { name: 'Amravati', region: 'Vidarbha', schools: 1080, students: 184200, avgScore: 67.3, attendance: 81.4, passRate: 86.2, mathScore: 62.1, sciScore: 68.4, engScore: 70.1, rank: 8, trend: 'down', dropout: 7.1, teacherRatio: 37, flagged: 28 },
  { name: 'Solapur', region: 'Western', schools: 980, students: 164200, avgScore: 65.4, attendance: 79.4, passRate: 84.2, mathScore: 60.3, sciScore: 66.8, engScore: 67.9, rank: 9, trend: 'down', dropout: 7.8, teacherRatio: 38, flagged: 42 },
  { name: 'Osmanabad', region: 'Marathwada', schools: 640, students: 98400, avgScore: 62.8, attendance: 77.2, passRate: 81.4, mathScore: 57.4, sciScore: 63.2, engScore: 65.8, rank: 10, trend: 'down', dropout: 8.4, teacherRatio: 40, flagged: 38 },
  { name: 'Nandurbar', region: 'Northern', schools: 620, students: 98400, avgScore: 58.2, attendance: 74.1, passRate: 76.3, mathScore: 52.1, sciScore: 59.4, engScore: 61.2, rank: 11, trend: 'down', dropout: 10.2, teacherRatio: 44, flagged: 67 },
  { name: 'Gadchiroli', region: 'Vidarbha', schools: 540, students: 84100, avgScore: 54.6, attendance: 70.8, passRate: 71.8, mathScore: 48.3, sciScore: 55.1, engScore: 57.8, rank: 12, trend: 'down', dropout: 12.8, teacherRatio: 48, flagged: 89 },
]

// Schools within a district (used for drill-down table)
const districtSchools: Record<string, { name: string; type: string; medium: string; students: number; avgScore: number; passRate: number; attendance: number; flag: boolean }[]> = {
  'Pune': [
    { name: 'Deccan Education Society High School', type: 'Private Aided', medium: 'English', students: 1842, avgScore: 84.2, passRate: 98.1, attendance: 94.2, flag: false },
    { name: 'ZP High School, Haveli', type: 'Government', medium: 'Marathi', students: 624, avgScore: 67.4, passRate: 88.2, attendance: 85.1, flag: false },
    { name: 'Modern High School, Kothrud', type: 'Private Unaided', medium: 'English', students: 1120, avgScore: 79.8, passRate: 95.4, attendance: 92.1, flag: false },
    { name: 'ZP High School, Mulshi', type: 'Government', medium: 'Marathi', students: 312, avgScore: 58.4, passRate: 74.2, attendance: 76.8, flag: true },
    { name: 'Kendriya Vidyalaya, Pune', type: 'Central Govt', medium: 'English', students: 2240, avgScore: 82.1, passRate: 97.2, attendance: 93.4, flag: false },
  ],
  'Gadchiroli': [
    { name: 'ZP High School, Gadchiroli', type: 'Government', medium: 'Marathi', students: 284, avgScore: 52.1, passRate: 68.4, attendance: 68.2, flag: true },
    { name: 'ZP High School, Chamorshi', type: 'Government', medium: 'Marathi', students: 198, avgScore: 48.3, passRate: 62.1, attendance: 64.8, flag: true },
    { name: 'Ashram School, Ettapalli', type: 'Government', medium: 'Marathi', students: 142, avgScore: 44.6, passRate: 58.3, attendance: 59.4, flag: true },
    { name: 'Tribal Residential School', type: 'Government', medium: 'Marathi', students: 320, avgScore: 56.8, passRate: 71.2, attendance: 72.1, flag: true },
  ],
}

const regions = ['All Regions', 'Western', 'Northern', 'Konkan', 'Marathwada', 'Vidarbha']
const sortOptions = ['Rank (Best First)', 'Rank (Worst First)', 'Average Score', 'Attendance', 'Pass Rate', 'Dropout Rate']

const scoreColor = (s: number) => s >= 75 ? 'text-emerald-600' : s >= 65 ? 'text-blue-600' : s >= 55 ? 'text-amber-600' : 'text-red-600'
const scoreBg = (s: number) => s >= 75 ? 'bg-emerald-50' : s >= 65 ? 'bg-blue-50' : s >= 55 ? 'bg-amber-50' : 'bg-red-50'

export default function DistrictPerformancePage() {
  const [search, setSearch] = useState('')
  const [region, setRegion] = useState('All Regions')
  const [sort, setSort] = useState('Rank (Best First)')
  const [drillDown, setDrillDown] = useState<string | null>(null)
  const [showOnlyFlagged, setShowOnlyFlagged] = useState(false)

  let filtered = allDistricts.filter(d => {
    const matchSearch = d.name.toLowerCase().includes(search.toLowerCase())
    const matchRegion = region === 'All Regions' || d.region === region
    const matchFlagged = !showOnlyFlagged || d.flagged > 0
    return matchSearch && matchRegion && matchFlagged
  })

  // Sort
  if (sort === 'Rank (Worst First)') filtered = [...filtered].sort((a, b) => b.rank - a.rank)
  else if (sort === 'Average Score') filtered = [...filtered].sort((a, b) => b.avgScore - a.avgScore)
  else if (sort === 'Attendance') filtered = [...filtered].sort((a, b) => b.attendance - a.attendance)
  else if (sort === 'Pass Rate') filtered = [...filtered].sort((a, b) => b.passRate - a.passRate)
  else if (sort === 'Dropout Rate') filtered = [...filtered].sort((a, b) => b.dropout - a.dropout)
  else filtered = [...filtered].sort((a, b) => a.rank - b.rank)

  const drillDownDistrict = allDistricts.find(d => d.name === drillDown)
  const drillDownSchools = drillDown ? (districtSchools[drillDown] || districtSchools['Gadchiroli']) : []

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/govt" className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">District Performance</h1>
          <p className="text-gray-500 text-sm mt-0.5">Maharashtra · {allDistricts.length} districts · Drill down to individual schools</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search district..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none" />
        </div>
        <select value={region} onChange={e => setRegion(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-red-500 outline-none bg-white">
          {regions.map(r => <option key={r}>{r}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-red-500 outline-none bg-white">
          {sortOptions.map(s => <option key={s}>{s}</option>)}
        </select>
        <button
          onClick={() => setShowOnlyFlagged(!showOnlyFlagged)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${showOnlyFlagged ? 'bg-red-600 text-white border-red-600' : 'border-gray-200 text-gray-600 hover:bg-red-50'}`}
        >
          <AlertTriangle className="w-4 h-4" /> Flagged Only
        </button>
      </div>

      {/* District Table */}
      {!drillDown ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[400px] sm:min-w-[900px]">
            <thead className="bg-gray-50">
              <tr>
                {['Rank', 'District', 'Region', 'Schools', 'Students', 'Avg Score', 'Math', 'Science', 'English', 'Attendance', 'Pass Rate', 'Dropout', 'Flags', ''].map(h => (
                  <th key={h} className="text-left px-3 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(d => (
                <tr key={d.name} className={`hover:bg-gray-50 transition-colors ${d.avgScore < 60 ? 'bg-red-50/30' : ''}`}>
                  <td className="px-3 py-3">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${d.rank <= 3 ? 'bg-amber-100 text-amber-700' : d.rank >= 10 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                      {d.rank}
                    </span>
                  </td>
                  <td className="px-3 py-3 font-bold text-gray-900 whitespace-nowrap">{d.name}</td>
                  <td className="px-3 py-3 text-gray-500 text-xs">{d.region}</td>
                  <td className="px-3 py-3 text-gray-600">{d.schools.toLocaleString()}</td>
                  <td className="px-3 py-3 text-gray-600">{(d.students / 1000).toFixed(0)}K</td>
                  <td className="px-3 py-3">
                    <span className={`text-sm font-black ${scoreColor(d.avgScore)}`}>{d.avgScore}%</span>
                  </td>
                  <td className="px-3 py-3"><span className={`text-xs font-semibold ${scoreColor(d.mathScore)}`}>{d.mathScore}%</span></td>
                  <td className="px-3 py-3"><span className={`text-xs font-semibold ${scoreColor(d.sciScore)}`}>{d.sciScore}%</span></td>
                  <td className="px-3 py-3"><span className={`text-xs font-semibold ${scoreColor(d.engScore)}`}>{d.engScore}%</span></td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-semibold ${d.attendance >= 88 ? 'text-emerald-600' : d.attendance >= 78 ? 'text-blue-600' : 'text-red-500'}`}>{d.attendance}%</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scoreBg(d.passRate)} ${scoreColor(d.passRate)}`}>{d.passRate}%</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className={`text-xs font-semibold ${d.dropout >= 8 ? 'text-red-600' : d.dropout >= 6 ? 'text-amber-600' : 'text-emerald-600'}`}>{d.dropout}%</span>
                  </td>
                  <td className="px-3 py-3">
                    {d.flagged > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">{d.flagged}</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <button onClick={() => setDrillDown(d.name)} className="text-xs bg-red-600 text-white font-semibold px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap">
                      Drill Down
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* ── District Drill-Down ─────────────────────────────────────────── */
        <div>
          <button onClick={() => setDrillDown(null)} className="flex items-center gap-2 text-sm text-red-600 font-semibold mb-5 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to all districts
          </button>

          {drillDownDistrict && (
            <>
              {/* District header card */}
              <div className="bg-gradient-to-br from-red-600 to-rose-700 rounded-2xl p-6 text-white mb-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-black mb-1">{drillDownDistrict.name} District</h2>
                    <p className="text-red-200 text-sm">{drillDownDistrict.region} Maharashtra · Rank #{drillDownDistrict.rank} of {allDistricts.length}</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-white/20 px-3 py-1.5 rounded-full">
                    {drillDownDistrict.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : drillDownDistrict.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                    <span className="text-sm font-medium capitalize">{drillDownDistrict.trend}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-5">
                  {[
                    { label: 'Schools', value: drillDownDistrict.schools.toLocaleString() },
                    { label: 'Students', value: (drillDownDistrict.students / 1000).toFixed(0) + 'K' },
                    { label: 'Avg Score', value: drillDownDistrict.avgScore + '%' },
                    { label: 'Pass Rate', value: drillDownDistrict.passRate + '%' },
                    { label: 'Attendance', value: drillDownDistrict.attendance + '%' },
                    { label: 'Dropout', value: drillDownDistrict.dropout + '%' },
                  ].map(m => (
                    <div key={m.label} className="bg-white/10 rounded-xl p-3 text-center">
                      <div className="text-xl font-black">{m.value}</div>
                      <div className="text-red-200 text-xs mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Subject breakdown */}
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
                <h3 className="font-bold text-gray-900 mb-4">Subject Performance — {drillDownDistrict.name}</h3>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                  {[
                    { label: 'Mathematics', score: drillDownDistrict.mathScore },
                    { label: 'Science', score: drillDownDistrict.sciScore },
                    { label: 'English', score: drillDownDistrict.engScore },
                    { label: 'Social Sci.', score: Math.round(drillDownDistrict.avgScore + 3.2) },
                    { label: 'Language', score: Math.round(drillDownDistrict.avgScore + 6.1) },
                  ].map(s => (
                    <div key={s.label} className={`rounded-xl p-4 text-center ${scoreBg(s.score)}`}>
                      <div className={`text-2xl font-black ${scoreColor(s.score)}`}>{s.score}%</div>
                      <div className="text-xs text-gray-600 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Schools table */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-900">Schools in {drillDownDistrict.name}</h3>
                  <Link href="/dashboard/govt/schools" className="text-sm text-red-600 font-semibold hover:underline flex items-center gap-1">
                    Full School View <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      {['School Name', 'Type', 'Medium', 'Students', 'Avg Score', 'Pass Rate', 'Attendance', 'Status', ''].map(h => (
                        <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {drillDownSchools.map(s => (
                      <tr key={s.name} className={`hover:bg-gray-50 transition-colors ${s.flag ? 'bg-red-50/30' : ''}`}>
                        <td className="px-4 py-3 font-semibold text-gray-900 text-xs max-w-[200px]">{s.name}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{s.type}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">{s.medium}</td>
                        <td className="px-4 py-3 text-gray-700">{s.students.toLocaleString()}</td>
                        <td className="px-4 py-3"><span className={`font-bold ${scoreColor(s.avgScore)}`}>{s.avgScore}%</span></td>
                        <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scoreBg(s.passRate)} ${scoreColor(s.passRate)}`}>{s.passRate}%</span></td>
                        <td className="px-4 py-3"><span className={`text-xs font-semibold ${s.attendance >= 88 ? 'text-emerald-600' : s.attendance >= 78 ? 'text-blue-600' : 'text-red-500'}`}>{s.attendance}%</span></td>
                        <td className="px-4 py-3">
                          {s.flag
                            ? <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-1 w-fit"><AlertTriangle className="w-3 h-3" />Flagged</span>
                            : <span className="text-xs bg-emerald-100 text-emerald-700 font-medium px-2 py-0.5 rounded-full">OK</span>}
                        </td>
                        <td className="px-4 py-3">
                          <Link href="/dashboard/govt/schools" className="text-xs text-red-600 font-semibold hover:underline whitespace-nowrap">View School →</Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
