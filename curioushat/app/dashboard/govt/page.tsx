'use client'
import { useState } from 'react'
import Link from 'next/link'
import {
  GraduationCap, School, Users, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, ArrowRight, ChevronDown,
  BarChart3, Map, BookOpen, FileDown, Minus, Building2, Shield
} from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────

/* Govt vs Private comparison */
const schoolTypeComparison = {
  govt: { label: 'Government Schools', count: '18,420', students: '28.4L', avgScore: 62.8, passRate: 81.6, attendance: 78.4, ptrRatio: '38:1', dropout: 4.2, teacherVacancy: '14%' },
  aided: { label: 'Govt-Aided Schools', count: '2,140', students: '4.8L', avgScore: 68.1, passRate: 86.4, attendance: 83.2, ptrRatio: '32:1', dropout: 2.8, teacherVacancy: '8%' },
  private: { label: 'Private Schools', count: '3,420', students: '8.6L', avgScore: 78.4, passRate: 94.2, attendance: 92.1, ptrRatio: '24:1', dropout: 0.8, teacherVacancy: '2%' },
  central: { label: 'Central (KV/NV/Sainik)', count: '338', students: '0.8L', avgScore: 82.6, passRate: 96.8, attendance: 94.6, ptrRatio: '28:1', dropout: 0.4, teacherVacancy: '3%' },
}
type SchoolType = keyof typeof schoolTypeComparison

const schoolTypeColors: Record<SchoolType, { bg: string; text: string; bar: string; border: string }> = {
  govt: { bg: 'bg-red-50', text: 'text-red-700', bar: 'bg-red-500', border: 'border-red-200' },
  aided: { bg: 'bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500', border: 'border-amber-200' },
  private: { bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500', border: 'border-blue-200' },
  central: { bg: 'bg-emerald-50', text: 'text-emerald-700', bar: 'bg-emerald-500', border: 'border-emerald-200' },
}

/* Board-wise comparison */
const boardComparison = [
  { board: 'Maharashtra State Board', students: '24.2L', schools: 16840, avgScore: 64.8, passRate: 83.4, topSubject: 'Marathi (81.2%)', weakSubject: 'Mathematics (58.4%)', color: '#D97706' },
  { board: 'CBSE', students: '12.4L', schools: 4820, avgScore: 76.2, passRate: 92.8, topSubject: 'English (82.1%)', weakSubject: 'Physics (68.4%)', color: '#4F46E5' },
  { board: 'ICSE', students: '3.2L', schools: 1640, avgScore: 80.4, passRate: 95.1, topSubject: 'English (86.3%)', weakSubject: 'Mathematics (72.8%)', color: '#059669' },
  { board: 'IB', students: '0.4L', schools: 84, avgScore: 84.2, passRate: 97.6, topSubject: 'TOK (88.4%)', weakSubject: 'Mathematics HL (74.2%)', color: '#7C3AED' },
  { board: 'NIOS', students: '2.4L', schools: 934, avgScore: 58.6, passRate: 72.4, topSubject: 'Hindi (68.2%)', weakSubject: 'Science (52.1%)', color: '#DC2626' },
]

/* Board-wise subject deep-dive */
const boardSubjectMatrix = [
  { subject: 'Mathematics', stateBoard: 58.4, cbse: 72.1, icse: 78.6, nios: 48.2 },
  { subject: 'Science', stateBoard: 62.8, cbse: 74.8, icse: 80.2, nios: 52.1 },
  { subject: 'English', stateBoard: 66.4, cbse: 82.1, icse: 86.3, nios: 56.8 },
  { subject: 'Social Science', stateBoard: 71.2, cbse: 76.4, icse: 78.1, nios: 62.4 },
  { subject: 'Language (Regional)', stateBoard: 81.2, cbse: 72.8, icse: 68.4, nios: 68.2 },
]

const stateStats = [
  { label: 'Total Schools', value: '24,318', change: '+312', trend: 'up', icon: School, bg: 'bg-indigo-50', color: 'text-indigo-600' },
  { label: 'Enrolled Students', value: '42.6L', change: '+1.2L', trend: 'up', icon: GraduationCap, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { label: 'Teaching Staff', value: '1,84,500', change: '+2,100', trend: 'up', icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
  { label: 'State Avg Score', value: '71.4%', change: '+2.1%', trend: 'up', icon: TrendingUp, bg: 'bg-purple-50', color: 'text-purple-600' },
  { label: 'Avg Attendance', value: '84.2%', change: '-0.3%', trend: 'down', icon: Users, bg: 'bg-orange-50', color: 'text-orange-600' },
  { label: 'Schools Below 60%', value: '1,847', change: '-214', trend: 'up', icon: AlertTriangle, bg: 'bg-red-50', color: 'text-red-600' },
]

const districts = [
  { name: 'Pune', schools: 1840, students: 312400, avgScore: 78.4, attendance: 91.2, passRate: 96.1, rank: 1, trend: 'up', govtScore: 68.2, pvtScore: 84.1 },
  { name: 'Nashik', schools: 1620, students: 284100, avgScore: 75.8, attendance: 89.4, passRate: 94.8, rank: 2, trend: 'up', govtScore: 64.8, pvtScore: 82.4 },
  { name: 'Mumbai', schools: 2100, students: 418200, avgScore: 74.2, attendance: 87.6, passRate: 93.2, rank: 3, trend: 'stable', govtScore: 62.4, pvtScore: 81.2 },
  { name: 'Aurangabad', schools: 1340, students: 218700, avgScore: 69.1, attendance: 83.1, passRate: 88.4, rank: 4, trend: 'up', govtScore: 58.6, pvtScore: 76.8 },
  { name: 'Nagpur', schools: 1560, students: 267300, avgScore: 68.7, attendance: 82.8, passRate: 87.9, rank: 5, trend: 'down', govtScore: 57.2, pvtScore: 75.4 },
  { name: 'Solapur', schools: 980, students: 164200, avgScore: 65.4, attendance: 79.4, passRate: 84.2, rank: 6, trend: 'down', govtScore: 54.1, pvtScore: 73.6 },
  { name: 'Nandurbar', schools: 620, students: 98400, avgScore: 58.2, attendance: 74.1, passRate: 76.3, rank: 7, trend: 'down', govtScore: 48.4, pvtScore: 68.2 },
  { name: 'Gadchiroli', schools: 540, students: 84100, avgScore: 54.6, attendance: 70.8, passRate: 71.8, rank: 8, trend: 'down', govtScore: 44.8, pvtScore: 64.1 },
]

const criticalAlerts = [
  { type: 'gap', msg: 'Govt–Private score gap widened to 15.6% (from 13.8% last year) — worst in Gadchiroli (19.3%)', severity: 'high', district: 'State-wide' },
  { type: 'low_performance', msg: '1,847 schools with average score below 60% — 92% are government schools', severity: 'high', district: 'State-wide' },
  { type: 'attendance', msg: 'Nandurbar & Gadchiroli: govt school attendance below 70% — 12% below private schools in same PIN', severity: 'high', district: 'Nandurbar, Gadchiroli' },
  { type: 'board', msg: 'NIOS pass rate 72.4% — lowest among all boards. Science subject at 52.1% needs intervention', severity: 'high', district: 'State-wide' },
  { type: 'dropout', msg: 'Class 9→10 dropout rate in govt schools: 6.8% (vs 0.8% in private) — 8x gap', severity: 'high', district: 'Nagpur, Solapur' },
  { type: 'teacher', msg: '14% teacher vacancy in govt schools vs 2% in private — 3,240 posts unfilled', severity: 'medium', district: 'Multiple' },
  { type: 'math', msg: 'State Board Mathematics avg 58.4% vs CBSE 72.1% — 13.7% gap needs curriculum review', severity: 'medium', district: 'State-wide' },
]

const yearTrend = [
  { year: '2021', govtScore: 56.4, pvtScore: 72.1, govtPass: 74.2, pvtPass: 90.4 },
  { year: '2022', govtScore: 58.2, pvtScore: 73.8, govtPass: 76.8, pvtPass: 91.2 },
  { year: '2023', govtScore: 59.8, pvtScore: 75.2, govtPass: 78.4, pvtPass: 92.8 },
  { year: '2024', govtScore: 61.4, pvtScore: 76.8, govtPass: 80.1, pvtPass: 93.4 },
  { year: '2025', govtScore: 62.8, pvtScore: 78.4, govtPass: 81.6, pvtPass: 94.2 },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
const scoreColor = (s: number) => s >= 75 ? 'text-emerald-600' : s >= 65 ? 'text-blue-600' : s >= 55 ? 'text-amber-600' : 'text-red-600'
const scoreBg = (s: number) => s >= 75 ? 'bg-emerald-100' : s >= 65 ? 'bg-blue-100' : s >= 55 ? 'bg-amber-100' : 'bg-red-100'

export default function GovtOverviewPage() {
  const [selectedYear, setSelectedYear] = useState('2025')
  const [activeSection, setActiveSection] = useState<'overview' | 'school_type' | 'board' | 'districts'>('overview')

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-red-100 text-red-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">🏛 Government Portal</span>
            <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">Maharashtra</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900">State Education Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Academic Year 2024–25 · Govt vs Private · Board-wise Analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white focus:ring-2 focus:ring-red-500 outline-none">
            {['2025', '2024', '2023', '2022'].map(y => <option key={y}>{y}</option>)}
          </select>
          <Link href="/dashboard/govt/reports" className="flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-red-700 transition-colors">
            <FileDown className="w-4 h-4" /> Export Report
          </Link>
        </div>
      </div>

      {/* Section tabs */}
      <div className="flex gap-1.5 mb-6 overflow-x-auto pb-1">
        {([
          { key: 'overview', label: '📊 Overview', },
          { key: 'school_type', label: '🏫 Govt vs Private' },
          { key: 'board', label: '📋 Board-wise' },
          { key: 'districts', label: '🗺️ Districts' },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setActiveSection(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              activeSection === t.key ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{t.label}</button>
        ))}
      </div>

      {/* ═══════ OVERVIEW ═══════ */}
      {activeSection === 'overview' && (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
            {stateStats.map(s => (
              <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
                <div className={`w-9 h-9 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <s.icon className={`w-4 h-4 ${s.color}`} />
                </div>
                <div className="text-xl font-black text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500 mt-0.5 leading-tight">{s.label}</div>
                <div className={`flex items-center gap-0.5 mt-1.5 text-xs font-medium ${s.trend === 'up' && !s.label.includes('Below') ? 'text-emerald-600' : s.trend === 'down' && s.label.includes('Below') ? 'text-emerald-600' : s.trend === 'down' ? 'text-red-500' : 'text-gray-400'}`}>
                  {s.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : s.trend === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                  {s.change} vs last year
                </div>
              </div>
            ))}
          </div>

          {/* Critical Alerts */}
          <div className="bg-white rounded-2xl p-5 border border-red-100 shadow-sm mb-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h2 className="font-bold text-gray-900">Critical Alerts</h2>
              <span className="ml-auto text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">{criticalAlerts.filter(a => a.severity === 'high').length} High</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {criticalAlerts.map((a, i) => (
                <div key={i} className={`flex gap-2.5 p-3 rounded-xl ${a.severity === 'high' ? 'bg-red-50 border border-red-100' : 'bg-amber-50 border border-amber-100'}`}>
                  <AlertTriangle className={`w-3.5 h-3.5 mt-0.5 flex-shrink-0 ${a.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
                  <div>
                    <p className={`text-xs leading-relaxed font-medium ${a.severity === 'high' ? 'text-red-800' : 'text-amber-800'}`}>{a.msg}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{a.district}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick gap summary */}
          <div className="bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-5 border border-red-200 mb-6">
            <h3 className="font-black text-gray-900 mb-3 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-red-600" /> Key Gaps at a Glance
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-3 border border-red-100 text-center">
                <p className="text-[10px] text-gray-400">Govt–Private Score Gap</p>
                <p className="text-2xl font-black text-red-600">15.6%</p>
                <p className="text-[9px] text-gray-400">62.8% vs 78.4%</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-red-100 text-center">
                <p className="text-[10px] text-gray-400">Dropout Rate Gap</p>
                <p className="text-2xl font-black text-red-600">8x</p>
                <p className="text-[9px] text-gray-400">Govt 4.2% vs Pvt 0.8%</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-amber-100 text-center">
                <p className="text-[10px] text-gray-400">State Board–CBSE Gap</p>
                <p className="text-2xl font-black text-amber-600">11.4%</p>
                <p className="text-[9px] text-gray-400">64.8% vs 76.2%</p>
              </div>
              <div className="bg-white rounded-xl p-3 border border-amber-100 text-center">
                <p className="text-[10px] text-gray-400">Teacher Vacancy Gap</p>
                <p className="text-2xl font-black text-amber-600">7x</p>
                <p className="text-[9px] text-gray-400">Govt 14% vs Pvt 2%</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ═══════ GOVT vs PRIVATE ═══════ */}
      {activeSection === 'school_type' && (
        <>
          {/* School type cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            {(Object.entries(schoolTypeComparison) as [SchoolType, typeof schoolTypeComparison.govt][]).map(([key, st]) => {
              const c = schoolTypeColors[key]
              return (
                <div key={key} className={`${c.bg} rounded-2xl p-5 border ${c.border}`}>
                  <p className={`text-xs font-bold ${c.text} uppercase tracking-wider mb-3`}>{st.label}</p>
                  <div className="grid grid-cols-2 gap-y-2.5 gap-x-4">
                    <div><p className="text-[10px] text-gray-400">Schools</p><p className="text-sm font-black text-gray-900">{st.count}</p></div>
                    <div><p className="text-[10px] text-gray-400">Students</p><p className="text-sm font-black text-gray-900">{st.students}</p></div>
                    <div><p className="text-[10px] text-gray-400">Avg Score</p><p className={`text-sm font-black ${scoreColor(st.avgScore)}`}>{st.avgScore}%</p></div>
                    <div><p className="text-[10px] text-gray-400">Pass Rate</p><p className={`text-sm font-black ${scoreColor(st.passRate)}`}>{st.passRate}%</p></div>
                    <div><p className="text-[10px] text-gray-400">Attendance</p><p className="text-sm font-black text-gray-900">{st.attendance}%</p></div>
                    <div><p className="text-[10px] text-gray-400">PTR</p><p className="text-sm font-black text-gray-900">{st.ptrRatio}</p></div>
                    <div><p className="text-[10px] text-gray-400">Dropout</p><p className={`text-sm font-black ${st.dropout >= 3 ? 'text-red-600' : st.dropout >= 1 ? 'text-amber-600' : 'text-emerald-600'}`}>{st.dropout}%</p></div>
                    <div><p className="text-[10px] text-gray-400">Teacher Vacancy</p><p className={`text-sm font-black ${st.teacherVacancy === '14%' || st.teacherVacancy === '8%' ? 'text-red-600' : 'text-emerald-600'}`}>{st.teacherVacancy}</p></div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* 5-year trend — Govt vs Private */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
            <h2 className="font-bold text-gray-900 mb-1">5-Year Trend — Government vs Private Schools</h2>
            <p className="text-xs text-gray-400 mb-5">The gap has widened from 15.7% (2021) to 15.6% (2025) — virtually unchanged despite increased spending</p>
            <div className="space-y-3">
              {yearTrend.map(y => (
                <div key={y.year} className="flex items-center gap-4">
                  <span className="w-10 text-sm font-bold text-gray-500">{y.year}</span>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-red-500 w-8 text-right">Govt</span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-red-500 rounded-full" style={{ width: `${y.govtScore}%` }} />
                      </div>
                      <span className="text-xs font-bold text-red-600 w-12 text-right">{y.govtScore}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-blue-500 w-8 text-right">Pvt</span>
                      <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${y.pvtScore}%` }} />
                      </div>
                      <span className="text-xs font-bold text-blue-600 w-12 text-right">{y.pvtScore}%</span>
                    </div>
                  </div>
                  <div className="w-16 text-right">
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-red-50 text-red-600 font-bold">
                      Δ {(y.pvtScore - y.govtScore).toFixed(1)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* District-wise Govt vs Pvt */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Map className="w-5 h-5 text-indigo-600" /> District-wise Govt vs Private Score
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[350px] sm:min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    {['Rank', 'District', 'Govt Avg', 'Private Avg', 'Gap', 'Combined'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {districts.map(d => {
                    const gap = d.pvtScore - d.govtScore
                    return (
                      <tr key={d.name} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${d.rank <= 3 ? 'bg-amber-100 text-amber-700' : d.rank >= 7 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{d.rank}</span>
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-900">{d.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-red-500" style={{ width: `${d.govtScore}%` }} /></div>
                            <span className={`text-xs font-bold ${scoreColor(d.govtScore)}`}>{d.govtScore}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-blue-500" style={{ width: `${d.pvtScore}%` }} /></div>
                            <span className={`text-xs font-bold ${scoreColor(d.pvtScore)}`}>{d.pvtScore}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${gap >= 18 ? 'bg-red-100 text-red-600' : gap >= 14 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {gap.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-gray-900">{d.avgScore}%</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ═══════ BOARD-WISE ═══════ */}
      {activeSection === 'board' && (
        <>
          {/* Board cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {boardComparison.map(b => (
              <div key={b.board} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-violet-200 transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: b.color + '15' }}>
                    <BookOpen className="w-5 h-5" style={{ color: b.color }} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{b.board}</p>
                    <p className="text-[10px] text-gray-400">{b.schools.toLocaleString()} schools · {b.students} students</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-gray-400">Avg Score</p>
                    <p className={`text-lg font-black ${scoreColor(b.avgScore)}`}>{b.avgScore}%</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-[10px] text-gray-400">Pass Rate</p>
                    <p className={`text-lg font-black ${scoreColor(b.passRate)}`}>{b.passRate}%</p>
                  </div>
                </div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between"><span className="text-gray-500">Top Subject</span><span className="font-semibold text-emerald-600">{b.topSubject}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Weak Subject</span><span className="font-semibold text-red-600">{b.weakSubject}</span></div>
                </div>
              </div>
            ))}
          </div>

          {/* Subject matrix across boards */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="p-5 border-b border-gray-100">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-purple-600" /> Subject Performance — Board Comparison
              </h2>
              <p className="text-xs text-gray-400 mt-1">Average score by subject across boards — identifies where curriculum gaps exist</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[350px] sm:min-w-[600px]">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Subject</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#D97706' }}>State Board</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#4F46E5' }}>CBSE</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#059669' }}>ICSE</th>
                    <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: '#DC2626' }}>NIOS</th>
                    <th className="text-center px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Gap (Max–Min)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {boardSubjectMatrix.map(s => {
                    const values = [s.stateBoard, s.cbse, s.icse, s.nios]
                    const gap = Math.max(...values) - Math.min(...values)
                    return (
                      <tr key={s.subject} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-bold text-gray-900">{s.subject}</td>
                        {values.map((v, i) => (
                          <td key={i} className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-12 h-2 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full rounded-full" style={{
                                  width: `${v}%`,
                                  backgroundColor: [s.stateBoard, s.cbse, s.icse, s.nios].indexOf(Math.max(...values)) === i ? '#059669' :
                                    [s.stateBoard, s.cbse, s.icse, s.nios].indexOf(Math.min(...values)) === i ? '#DC2626' : '#6B7280'
                                }} />
                              </div>
                              <span className={`text-xs font-bold ${scoreColor(v)}`}>{v}%</span>
                            </div>
                          </td>
                        ))}
                        <td className="px-4 py-3 text-center">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${gap >= 25 ? 'bg-red-100 text-red-600' : gap >= 15 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                            {gap.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Board equity insight */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-5 border border-amber-200">
            <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Shield className="w-4 h-4 text-amber-600" /> Policy Insight</h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              The State Board–CBSE gap of <strong>11.4%</strong> in average scores suggests curriculum and assessment parity issues, not student ability differences.
              State Board Mathematics (58.4%) is <strong>13.7 points</strong> behind CBSE (72.1%) — this is the single highest-impact subject for intervention.
              NIOS needs urgent attention with a 72.4% pass rate — significantly below every other board. A curriculum revision + teacher training push could close the gap by 5–8% in one academic year.
            </p>
          </div>
        </>
      )}

      {/* ═══════ DISTRICTS ═══════ */}
      {activeSection === 'districts' && (
        <>
          {/* District Rankings with Govt/Pvt split */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Map className="w-5 h-5 text-indigo-600" /> District Performance Rankings
              </h2>
              <Link href="/dashboard/govt/districts" className="text-sm text-red-600 font-semibold hover:underline flex items-center gap-1">
                Full Analysis <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[400px] sm:min-w-[800px]">
                <thead className="bg-gray-50">
                  <tr>
                    {['Rank', 'District', 'Schools', 'Students', 'Avg Score', 'Govt Score', 'Pvt Score', 'Gap', 'Attendance', 'Pass Rate', 'Trend'].map(h => (
                      <th key={h} className="text-left px-3 py-3 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {districts.map(d => {
                    const gap = d.pvtScore - d.govtScore
                    return (
                      <tr key={d.name} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${d.rank <= 3 ? 'bg-amber-100 text-amber-700' : d.rank >= 7 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{d.rank}</span>
                        </td>
                        <td className="px-3 py-3 font-bold text-gray-900 text-xs">{d.name}</td>
                        <td className="px-3 py-3 text-xs text-gray-600">{d.schools.toLocaleString()}</td>
                        <td className="px-3 py-3 text-xs text-gray-600">{d.students.toLocaleString()}</td>
                        <td className="px-3 py-3"><span className={`text-xs font-bold ${scoreColor(d.avgScore)}`}>{d.avgScore}%</span></td>
                        <td className="px-3 py-3"><span className={`text-xs font-bold ${scoreColor(d.govtScore)}`}>{d.govtScore}%</span></td>
                        <td className="px-3 py-3"><span className={`text-xs font-bold ${scoreColor(d.pvtScore)}`}>{d.pvtScore}%</span></td>
                        <td className="px-3 py-3">
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${gap >= 18 ? 'bg-red-100 text-red-600' : gap >= 14 ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>{gap.toFixed(1)}%</span>
                        </td>
                        <td className="px-3 py-3"><span className={`text-xs font-semibold ${d.attendance >= 88 ? 'text-emerald-600' : d.attendance >= 78 ? 'text-blue-600' : 'text-red-500'}`}>{d.attendance}%</span></td>
                        <td className="px-3 py-3"><span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${scoreBg(d.passRate)} ${scoreColor(d.passRate)}`}>{d.passRate}%</span></td>
                        <td className="px-3 py-3">
                          {d.trend === 'up' ? <span className="flex items-center gap-0.5 text-emerald-600 text-[10px]"><TrendingUp className="w-3 h-3" />↑</span>
                            : d.trend === 'down' ? <span className="flex items-center gap-0.5 text-red-500 text-[10px]"><TrendingDown className="w-3 h-3" />↓</span>
                            : <span className="text-gray-400 text-[10px]">—</span>}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top / Bottom performers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100">
              <h3 className="font-bold text-emerald-800 mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5" /> Smallest Govt–Pvt Gap</h3>
              {districts.sort((a, b) => (a.pvtScore - a.govtScore) - (b.pvtScore - b.govtScore)).slice(0, 3).map((d, i) => (
                <div key={d.name} className="flex items-center justify-between py-2 border-b border-emerald-100 last:border-0">
                  <span className="text-sm font-semibold text-gray-800">{d.name}</span>
                  <span className="text-sm font-black text-emerald-700">Gap: {(d.pvtScore - d.govtScore).toFixed(1)}%</span>
                </div>
              ))}
            </div>
            <div className="bg-red-50 rounded-2xl p-5 border border-red-100">
              <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5" /> Largest Govt–Pvt Gap</h3>
              {districts.sort((a, b) => (b.pvtScore - b.govtScore) - (a.pvtScore - a.govtScore)).slice(0, 3).map((d, i) => (
                <div key={d.name} className="flex items-center justify-between py-2 border-b border-red-100 last:border-0">
                  <span className="text-sm font-semibold text-gray-800">{d.name}</span>
                  <span className="text-sm font-black text-red-600">Gap: {(d.pvtScore - d.govtScore).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
