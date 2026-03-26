'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, AlertTriangle, School, GraduationCap, TrendingUp, TrendingDown, Users, BookOpen, ArrowRight, ChevronDown } from 'lucide-react'

// ── Data ──────────────────────────────────────────────────────────────────────
const schools = [
  { id: 'SCH001', name: 'Deccan Education Society High School', district: 'Pune', block: 'Haveli', type: 'Private Aided', medium: 'English', classes: '5–12', students: 1842, teachers: 68, avgScore: 84.2, passRate: 98.1, attendance: 94.2, math: 82.1, sci: 86.4, eng: 87.3, rank: 1, flag: false },
  { id: 'SCH002', name: 'Kendriya Vidyalaya No.1, Pune', district: 'Pune', block: 'Pune City', type: 'Central Govt', medium: 'English', classes: '1–12', students: 2240, teachers: 78, avgScore: 82.1, passRate: 97.2, attendance: 93.4, math: 80.4, sci: 83.8, eng: 84.1, rank: 2, flag: false },
  { id: 'SCH003', name: 'Modern High School, Kothrud', district: 'Pune', block: 'Kothrud', type: 'Private Unaided', medium: 'English', classes: '1–10', students: 1120, teachers: 42, avgScore: 79.8, passRate: 95.4, attendance: 92.1, math: 77.2, sci: 81.6, eng: 82.4, rank: 3, flag: false },
  { id: 'SCH004', name: 'ZP High School, Haveli', district: 'Pune', block: 'Haveli', type: 'Government', medium: 'Marathi', classes: '5–10', students: 624, teachers: 18, avgScore: 67.4, passRate: 88.2, attendance: 85.1, math: 62.1, sci: 68.4, eng: 71.8, rank: 18, flag: false },
  { id: 'SCH005', name: 'ZP High School, Mulshi', district: 'Pune', block: 'Mulshi', type: 'Government', medium: 'Marathi', classes: '5–10', students: 312, teachers: 9, avgScore: 58.4, passRate: 74.2, attendance: 76.8, math: 52.3, sci: 59.8, eng: 63.1, rank: 42, flag: true },
  { id: 'SCH006', name: 'ZP High School, Gadchiroli', district: 'Gadchiroli', block: 'Gadchiroli', type: 'Government', medium: 'Marathi', classes: '5–10', students: 284, teachers: 7, avgScore: 52.1, passRate: 68.4, attendance: 68.2, math: 46.2, sci: 53.8, eng: 56.3, rank: 87, flag: true },
  { id: 'SCH007', name: 'Ashram School, Ettapalli', district: 'Gadchiroli', block: 'Ettapalli', type: 'Government', medium: 'Marathi', classes: '1–10', students: 142, teachers: 4, avgScore: 44.6, passRate: 58.3, attendance: 59.4, math: 38.4, sci: 45.2, eng: 50.2, rank: 124, flag: true },
  { id: 'SCH008', name: 'ZP High School, Chamorshi', district: 'Gadchiroli', block: 'Chamorshi', type: 'Government', medium: 'Marathi', classes: '5–10', students: 198, teachers: 5, avgScore: 48.3, passRate: 62.1, attendance: 64.8, math: 42.1, sci: 49.4, eng: 53.4, rank: 112, flag: true },
]

const schoolStudents: Record<string, { name: string; class: string; section: string; math: number; sci: number; eng: number; soc: number; lang: number; avg: number; attendance: number; passStatus: string }[]> = {
  'SCH005': [
    { name: 'Aakash Pawar', class: '10', section: 'A', math: 45, sci: 52, eng: 58, soc: 64, lang: 72, avg: 58.2, attendance: 71, passStatus: 'Passed' },
    { name: 'Sunita Bhosale', class: '10', section: 'A', math: 38, sci: 44, eng: 51, soc: 57, lang: 65, avg: 51.0, attendance: 68, passStatus: 'At Risk' },
    { name: 'Raju Shinde', class: '10', section: 'A', math: 28, sci: 35, eng: 41, soc: 48, lang: 55, avg: 41.4, attendance: 58, passStatus: 'Failed' },
    { name: 'Kaveri More', class: '10', section: 'B', math: 62, sci: 68, eng: 71, soc: 74, lang: 78, avg: 70.6, attendance: 82, passStatus: 'Passed' },
    { name: 'Dilip Kamble', class: '9', section: 'A', math: 41, sci: 48, eng: 54, soc: 60, lang: 67, avg: 54.0, attendance: 73, passStatus: 'Passed' },
  ],
  'SCH007': [
    { name: 'Balu Atram', class: '10', section: 'A', math: 32, sci: 38, eng: 44, soc: 50, lang: 58, avg: 44.4, attendance: 52, passStatus: 'At Risk' },
    { name: 'Sushma Madavi', class: '10', section: 'A', math: 26, sci: 32, eng: 38, soc: 44, lang: 52, avg: 38.4, attendance: 48, passStatus: 'Failed' },
    { name: 'Ramesh Tekam', class: '9', section: 'A', math: 48, sci: 54, eng: 57, soc: 61, lang: 64, avg: 56.8, attendance: 65, passStatus: 'Passed' },
  ],
}

const types = ['All Types', 'Government', 'Private Aided', 'Private Unaided', 'Central Govt']
const districts = ['All Districts', 'Pune', 'Gadchiroli', 'Nandurbar', 'Solapur']

const scoreColor = (s: number) => s >= 75 ? 'text-emerald-600' : s >= 65 ? 'text-blue-600' : s >= 50 ? 'text-amber-600' : 'text-red-600'
const scoreBg = (s: number) => s >= 75 ? 'bg-emerald-50' : s >= 65 ? 'bg-blue-50' : s >= 50 ? 'bg-amber-50' : 'bg-red-50'

export default function SchoolPerformancePage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [districtFilter, setDistrictFilter] = useState('All Districts')
  const [showFlagged, setShowFlagged] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null)

  const filtered = schools.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.district.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All Types' || s.type === typeFilter
    const matchDist = districtFilter === 'All Districts' || s.district === districtFilter
    const matchFlag = !showFlagged || s.flag
    return matchSearch && matchType && matchDist && matchFlag
  })

  const school = schools.find(s => s.id === selectedSchool)
  const students = selectedSchool ? (schoolStudents[selectedSchool] || schoolStudents['SCH005']) : []
  const student = students.find(s => s.name === selectedStudent)

  // ── Student detail view ───────────────────────────────────────────────────
  if (selectedStudent && student && school) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setSelectedStudent(null)} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <h1 className="text-xl font-black text-gray-900">Student Profile — {student.name}</h1>
            <p className="text-gray-500 text-sm">{school.name} · Class {student.class}-{student.section}</p>
          </div>
        </div>

        {/* Student header */}
        <div className={`rounded-2xl p-6 mb-6 ${student.passStatus === 'Failed' ? 'bg-red-600' : student.passStatus === 'At Risk' ? 'bg-amber-500' : 'bg-emerald-600'} text-white`}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-black">{student.name}</h2>
              <p className="text-white/70 text-sm mt-1">Class {student.class}{student.section} · {school.name}</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black">{student.avg.toFixed(1)}%</div>
              <div className="text-white/80 text-sm">Overall Average</div>
              <span className={`inline-block mt-1 text-xs font-bold px-3 py-1 rounded-full ${student.passStatus === 'Failed' ? 'bg-white text-red-600' : student.passStatus === 'At Risk' ? 'bg-white text-amber-700' : 'bg-white/20 text-white'}`}>
                {student.passStatus}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-5">
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black">{student.attendance}%</div>
              <div className="text-white/70 text-xs mt-0.5">Attendance</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black">Class {student.class}</div>
              <div className="text-white/70 text-xs mt-0.5">Grade</div>
            </div>
            <div className="bg-white/10 rounded-xl p-3 text-center">
              <div className="text-xl font-black">{school.district}</div>
              <div className="text-white/70 text-xs mt-0.5">District</div>
            </div>
          </div>
        </div>

        {/* Subject breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">
          <h3 className="font-bold text-gray-900 mb-5">Subject-wise Marks</h3>
          <div className="space-y-4">
            {[
              { label: 'Mathematics', score: student.math, max: 100 },
              { label: 'Science', score: student.sci, max: 100 },
              { label: 'English', score: student.eng, max: 100 },
              { label: 'Social Science', score: student.soc, max: 100 },
              { label: 'Language', score: student.lang, max: 100 },
            ].map(sub => (
              <div key={sub.label} className="flex items-center gap-4">
                <span className="w-32 text-sm font-semibold text-gray-700 flex-shrink-0">{sub.label}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${sub.score >= 75 ? 'bg-emerald-500' : sub.score >= 60 ? 'bg-blue-500' : sub.score >= 45 ? 'bg-amber-500' : 'bg-red-500'}`}
                    style={{ width: `${sub.score}%` }} />
                </div>
                <span className={`text-sm font-black w-10 text-right ${scoreColor(sub.score)}`}>{sub.score}%</span>
                {sub.score < 40 && <span className="text-xs bg-red-100 text-red-600 font-medium px-2 py-0.5 rounded-full flex-shrink-0">⚠ Needs Help</span>}
              </div>
            ))}
          </div>
        </div>

        {/* AI Insight */}
        <div className={`rounded-2xl p-5 border ${student.passStatus === 'Failed' ? 'bg-red-50 border-red-200' : student.passStatus === 'At Risk' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200'}`}>
          <h3 className="font-bold text-gray-900 mb-2">🤖 AI Insight</h3>
          {student.passStatus === 'Failed' && (
            <p className="text-sm text-red-800 leading-relaxed">
              <strong>{student.name}</strong> is scoring critically low in Mathematics ({student.math}%) and has {student.attendance}% attendance — both indicators require urgent teacher intervention. Recommend personalised AI tutoring sessions for Mathematics and Science, parent counselling for attendance, and district-level scholarship review.
            </p>
          )}
          {student.passStatus === 'At Risk' && (
            <p className="text-sm text-amber-800 leading-relaxed">
              <strong>{student.name}</strong> is at risk of failing with a {student.avg.toFixed(1)}% average. Mathematics ({student.math}%) is the weakest subject. Attendance ({student.attendance}%) is below the 75% minimum. Recommend additional remedial classes and monitoring for the next 4 weeks.
            </p>
          )}
          {student.passStatus === 'Passed' && (
            <p className="text-sm text-emerald-800 leading-relaxed">
              <strong>{student.name}</strong> is performing adequately with {student.avg.toFixed(1)}% average. Attendance ({student.attendance}%) is satisfactory. Mathematics ({student.math}%) has the most room for improvement — targeted AI tutoring could improve overall score by 5–8%.
            </p>
          )}
        </div>
      </div>
    )
  }

  // ── School detail view ────────────────────────────────────────────────────
  if (selectedSchool && school) {
    return (
      <div>
        <div className="flex items-center gap-2 mb-6">
          <button onClick={() => setSelectedSchool(null)} className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50"><ArrowLeft className="w-4 h-4" /></button>
          <div>
            <h1 className="text-xl font-black text-gray-900">{school.name}</h1>
            <p className="text-gray-500 text-sm">{school.district} · {school.block} · {school.type} · Medium: {school.medium}</p>
          </div>
        </div>

        {/* School header */}
        <div className={`rounded-2xl p-6 mb-6 ${school.flag ? 'bg-red-600' : 'bg-indigo-700'} text-white`}>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="text-xs bg-white/20 font-bold px-3 py-1 rounded-full inline-block mb-2">{school.type} · Classes {school.classes}</div>
              <h2 className="text-xl font-black">{school.name}</h2>
              <p className="text-white/70 text-sm mt-1">{school.block}, {school.district} · {school.medium} Medium</p>
            </div>
            {school.flag && (
              <div className="bg-white/20 border border-white/30 rounded-xl px-3 py-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                <span className="text-sm font-bold">Flagged for Review</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {[
              { label: 'Students', value: school.students },
              { label: 'Teachers', value: school.teachers },
              { label: 'Avg Score', value: school.avgScore + '%' },
              { label: 'Pass Rate', value: school.passRate + '%' },
              { label: 'Attendance', value: school.attendance + '%' },
              { label: 'Ratio', value: '1:' + Math.round(school.students / school.teachers) },
            ].map(m => (
              <div key={m.label} className="bg-white/10 rounded-xl p-3 text-center">
                <div className="text-lg font-black">{m.value}</div>
                <div className="text-white/70 text-xs mt-0.5">{m.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject performance */}
        <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-6">
          {[
            { label: 'Mathematics', score: school.math },
            { label: 'Science', score: school.sci },
            { label: 'English', score: school.eng },
            { label: 'Social Sci.', score: Math.round(school.avgScore + 2) },
            { label: 'Language', score: Math.round(school.avgScore + 5) },
          ].map(s => (
            <div key={s.label} className={`rounded-2xl p-4 text-center ${scoreBg(s.score)} border border-gray-100`}>
              <div className={`text-2xl font-black ${scoreColor(s.score)}`}>{s.score}%</div>
              <div className="text-xs text-gray-600 mt-1">{s.label}</div>
              {s.score < 50 && <div className="text-xs text-red-500 font-bold mt-1">⚠ Critical</div>}
            </div>
          ))}
        </div>

        {/* Students table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-indigo-600" /> Student-level Performance — {school.name}
            </h3>
            <p className="text-xs text-gray-400 mt-1">Click any row to view full student profile</p>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Student Name', 'Class', 'Math', 'Science', 'English', 'Social', 'Language', 'Average', 'Attendance', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map(s => (
                <tr key={s.name} className={`cursor-pointer transition-colors ${s.passStatus === 'Failed' ? 'bg-red-50/40 hover:bg-red-50' : s.passStatus === 'At Risk' ? 'bg-amber-50/40 hover:bg-amber-50' : 'hover:bg-gray-50'}`} onClick={() => setSelectedStudent(s.name)}>
                  <td className="px-4 py-3 font-semibold text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600">{s.class}-{s.section}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold ${scoreColor(s.math)}`}>{s.math}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold ${scoreColor(s.sci)}`}>{s.sci}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold ${scoreColor(s.eng)}`}>{s.eng}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold ${scoreColor(s.soc)}`}>{s.soc}</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold ${scoreColor(s.lang)}`}>{s.lang}</span></td>
                  <td className="px-4 py-3"><span className={`font-black text-sm ${scoreColor(s.avg)}`}>{s.avg.toFixed(1)}%</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-semibold ${s.attendance >= 80 ? 'text-emerald-600' : s.attendance >= 70 ? 'text-amber-600' : 'text-red-500'}`}>{s.attendance}%</span></td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${s.passStatus === 'Failed' ? 'bg-red-100 text-red-600' : s.passStatus === 'At Risk' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {s.passStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-red-600 font-semibold hover:underline">Profile →</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
            Showing sample data · Full cohort: {school.students.toLocaleString()} students
          </div>
        </div>
      </div>
    )
  }

  // ── Schools list view ─────────────────────────────────────────────────────
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/dashboard/govt" className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-gray-900">School Performance</h1>
          <p className="text-gray-500 text-sm mt-0.5">All schools · Click to drill down to students</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search school or district..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none" />
        </div>
        <select value={districtFilter} onChange={e => setDistrictFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-red-500 outline-none bg-white">
          {districts.map(d => <option key={d}>{d}</option>)}
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-red-500 outline-none bg-white">
          {types.map(t => <option key={t}>{t}</option>)}
        </select>
        <button onClick={() => setShowFlagged(!showFlagged)} className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border ${showFlagged ? 'bg-red-600 text-white border-red-600' : 'border-gray-200 text-gray-600 hover:bg-red-50'}`}>
          <AlertTriangle className="w-4 h-4" /> Flagged Only
        </button>
      </div>

      {/* Schools */}
      <div className="space-y-3">
        {filtered.map(s => (
          <div key={s.id} onClick={() => setSelectedSchool(s.id)} className={`bg-white rounded-2xl p-5 border cursor-pointer transition-all hover:shadow-lg hover:-translate-y-0.5 ${s.flag ? 'border-red-200 bg-red-50/20' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${s.flag ? 'bg-red-100' : 'bg-indigo-100'}`}>
                  <School className={`w-5 h-5 ${s.flag ? 'text-red-600' : 'text-indigo-600'}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-gray-900">{s.name}</h3>
                    {s.flag && <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><AlertTriangle className="w-3 h-3" />Flagged</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{s.district} · {s.block} · {s.type} · {s.medium} Medium · Classes {s.classes}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{s.students.toLocaleString()} students</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{s.teachers} teachers</span>
                    <span>Ratio 1:{Math.round(s.students / s.teachers)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <div className="text-right hidden sm:block">
                  <div className={`text-2xl font-black ${scoreColor(s.avgScore)}`}>{s.avgScore}%</div>
                  <div className="text-xs text-gray-400">Avg Score</div>
                </div>
                <div className="text-right hidden md:block">
                  <div className={`text-lg font-black ${scoreColor(s.passRate)}`}>{s.passRate}%</div>
                  <div className="text-xs text-gray-400">Pass Rate</div>
                </div>
                <ArrowRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>

            {/* Subject mini-bars */}
            <div className="mt-4 grid grid-cols-3 md:grid-cols-5 gap-2">
              {[
                { label: 'Math', score: s.math },
                { label: 'Science', score: s.sci },
                { label: 'English', score: s.eng },
                { label: 'Attendance', score: s.attendance },
                { label: 'Pass', score: s.passRate },
              ].map(m => (
                <div key={m.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-gray-400">{m.label}</span>
                    <span className={`font-bold ${scoreColor(m.score)}`}>{m.score}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${m.score >= 75 ? 'bg-emerald-500' : m.score >= 60 ? 'bg-blue-500' : m.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                      style={{ width: `${m.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
