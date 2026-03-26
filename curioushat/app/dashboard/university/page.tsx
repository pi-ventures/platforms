'use client'
import Link from 'next/link'
import { Building2, Users, GraduationCap, TrendingUp, BookOpen, FileText, Shield, Award, AlertTriangle, ArrowRight, BarChart3, CheckCircle2, Sparkles, Globe, Star } from 'lucide-react'

const stats = [
  { label: 'Affiliated Colleges', value: '148', change: '+6 this year', icon: Building2, color: '#7C3AED', bg: 'bg-violet-50' },
  { label: 'Total Students', value: '1,84,200', change: 'across all colleges', icon: GraduationCap, color: '#059669', bg: 'bg-emerald-50' },
  { label: 'Faculty Members', value: '8,420', change: '148 colleges', icon: Users, color: '#1D4ED8', bg: 'bg-blue-50' },
  { label: 'Avg Pass Rate', value: '87.4%', change: '+2.1% vs last yr', icon: TrendingUp, color: '#D97706', bg: 'bg-amber-50' },
  { label: 'NAAC Grade', value: 'A++', change: 'Valid till 2028', icon: Shield, color: '#059669', bg: 'bg-emerald-50' },
  { label: 'Research Papers', value: '2,840', change: 'this academic year', icon: BookOpen, color: '#BE185D', bg: 'bg-pink-50' },
]

const affiliatedColleges = [
  { name: 'Fergusson College, Pune', type: 'Arts & Science', students: 4200, passRate: 94.2, avgScore: 78.4, naac: 'A+', rank: 1, issues: 0 },
  { name: 'Symbiosis College of Arts & Commerce', type: 'Commerce', students: 3800, passRate: 92.8, avgScore: 76.1, naac: 'A', rank: 2, issues: 0 },
  { name: 'COEP Technological University', type: 'Engineering', students: 5200, passRate: 96.1, avgScore: 82.4, naac: 'A++', rank: 3, issues: 0 },
  { name: 'B.J. Medical College', type: 'Medical', students: 1200, passRate: 98.4, avgScore: 84.1, naac: 'A+', rank: 4, issues: 0 },
  { name: 'Modern College, Pune', type: 'Arts & Science', students: 3400, passRate: 86.4, avgScore: 68.2, naac: 'B+', rank: 5, issues: 2 },
  { name: 'Sinhgad College of Engineering', type: 'Engineering', students: 4800, passRate: 82.1, avgScore: 64.8, naac: 'B', rank: 6, issues: 3 },
  { name: 'Marathwada Mitra Mandal COE', type: 'Engineering', students: 2400, passRate: 78.4, avgScore: 61.2, naac: 'B', rank: 7, issues: 4 },
  { name: 'Smt. Kashibai Navale College', type: 'Pharmacy', students: 1800, passRate: 74.2, avgScore: 58.4, naac: 'B', rank: 8, issues: 5 },
]

const examStats = [
  { exam: 'Semester 1 (Oct 2025)', appeared: 42800, passed: 38200, passRate: 89.3, avgScore: 68.4, revaluation: 1240 },
  { exam: 'Semester 2 (Mar 2026)', appeared: 41200, passed: 36800, passRate: 89.3, avgScore: 70.1, revaluation: 980 },
  { exam: 'Annual (Apr 2026)', appeared: 38400, passed: 33600, passRate: 87.5, avgScore: 66.8, revaluation: 1420 },
]

const alerts = [
  { msg: 'Smt. Kashibai Navale College: pass rate dropped to 74.2% — below 75% threshold', severity: 'high', type: 'performance' },
  { msg: '5 colleges pending NAAC re-accreditation — due by June 2026', severity: 'high', type: 'accreditation' },
  { msg: 'Marathwada Mitra Mandal: 4 faculty vacancies in CS department unfilled for 6+ months', severity: 'medium', type: 'faculty' },
  { msg: 'Semester 2 revaluation requests: 980 pending — 340 from engineering colleges alone', severity: 'medium', type: 'exam' },
  { msg: '3 colleges have not submitted AQAR (Annual Quality Assurance Report) for 2024-25', severity: 'medium', type: 'compliance' },
]

const departmentPerformance = [
  { dept: 'Engineering', colleges: 42, students: 48200, avgScore: 68.4, passRate: 84.2, placements: '72%' },
  { dept: 'Arts & Science', colleges: 38, students: 42800, avgScore: 72.1, passRate: 88.6, placements: '48%' },
  { dept: 'Commerce & Management', colleges: 28, students: 34200, avgScore: 74.8, passRate: 91.2, placements: '62%' },
  { dept: 'Medical & Pharmacy', colleges: 18, students: 12400, avgScore: 78.4, passRate: 94.8, placements: '88%' },
  { dept: 'Law', colleges: 8, students: 8200, avgScore: 70.2, passRate: 86.4, placements: '58%' },
  { dept: 'Education', colleges: 14, students: 6400, avgScore: 76.8, passRate: 92.1, placements: '82%' },
]

const scoreColor = (s: number) => s >= 80 ? 'text-emerald-600' : s >= 70 ? 'text-blue-600' : s >= 60 ? 'text-amber-600' : 'text-red-600'

export default function UniversityDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs bg-violet-100 text-violet-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">🏛 University Portal</span>
          <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">Savitribai Phule Pune University</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900">University Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor 148 affiliated colleges, 1.84L students, examinations, accreditation, and research output</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} border border-gray-100 rounded-xl p-4`}>
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">
              <s.icon className="w-4 h-4" style={{ color: s.color }} />
            </div>
            <p className="text-xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className="text-[10px] text-gray-400">{s.change}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="bg-white rounded-xl p-5 border border-red-100">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          <h2 className="font-bold text-gray-900 text-sm">University Alerts</h2>
          <span className="ml-auto text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">{alerts.filter(a => a.severity === 'high').length} Critical</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {alerts.map((a, i) => (
            <div key={i} className={`flex gap-2 p-3 rounded-xl ${a.severity === 'high' ? 'bg-red-50 border border-red-100' : 'bg-amber-50 border border-amber-100'}`}>
              <AlertTriangle className={`w-3 h-3 mt-0.5 flex-shrink-0 ${a.severity === 'high' ? 'text-red-500' : 'text-amber-500'}`} />
              <p className={`text-xs leading-relaxed ${a.severity === 'high' ? 'text-red-800' : 'text-amber-800'}`}>{a.msg}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Department performance */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2"><BarChart3 className="w-4 h-4 text-violet-600" /> Department-wise Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[350px] sm:min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                {['Department', 'Colleges', 'Students', 'Avg Score', 'Pass Rate', 'Placement'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {departmentPerformance.map(d => (
                <tr key={d.dept} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-900 text-xs">{d.dept}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{d.colleges}</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{d.students.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold ${scoreColor(d.avgScore)}`}>{d.avgScore}%</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold ${scoreColor(d.passRate)}`}>{d.passRate}%</span></td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold ${scoreColor(parseFloat(d.placements))}`}>{d.placements}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Affiliated Colleges */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2"><Building2 className="w-4 h-4 text-indigo-600" /> Affiliated Colleges — Performance</h2>
          <Link href="/dashboard/university/affiliated-colleges" className="text-xs text-violet-600 hover:underline flex items-center gap-1">View all 148 <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px] sm:min-w-[800px]">
            <thead className="bg-gray-50">
              <tr>
                {['#', 'College', 'Type', 'Students', 'Avg Score', 'Pass Rate', 'NAAC', 'Issues', 'Action'].map(h => (
                  <th key={h} className="text-left px-3 py-3 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {affiliatedColleges.map(c => (
                <tr key={c.name} className="hover:bg-gray-50">
                  <td className="px-3 py-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black ${c.rank <= 3 ? 'bg-amber-100 text-amber-700' : c.rank >= 7 ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'}`}>{c.rank}</span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="text-xs font-bold text-gray-900 truncate max-w-[200px]">{c.name}</p>
                  </td>
                  <td className="px-3 py-3 text-xs text-gray-500">{c.type}</td>
                  <td className="px-3 py-3 text-xs text-gray-600">{c.students.toLocaleString()}</td>
                  <td className="px-3 py-3"><span className={`text-xs font-bold ${scoreColor(c.avgScore)}`}>{c.avgScore}%</span></td>
                  <td className="px-3 py-3"><span className={`text-xs font-bold ${scoreColor(c.passRate)}`}>{c.passRate}%</span></td>
                  <td className="px-3 py-3">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${
                      c.naac.includes('+') || c.naac === 'A' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>{c.naac}</span>
                  </td>
                  <td className="px-3 py-3">
                    {c.issues > 0
                      ? <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold bg-red-50 text-red-600">⚠ {c.issues}</span>
                      : <span className="text-[9px] text-emerald-500">✓ Clear</span>
                    }
                  </td>
                  <td className="px-3 py-3">
                    <button className="text-[10px] text-violet-600 hover:underline font-semibold">Drill Down →</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Exam stats */}
      <div className="bg-white rounded-xl p-5 border border-gray-200">
        <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-4"><FileText className="w-4 h-4 text-amber-600" /> Examination Results — University Level</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {examStats.map(e => (
            <div key={e.exam} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs font-bold text-gray-900 mb-2">{e.exam}</p>
              <div className="grid grid-cols-2 gap-2">
                <div><p className="text-[10px] text-gray-400">Appeared</p><p className="text-sm font-black text-gray-900">{e.appeared.toLocaleString()}</p></div>
                <div><p className="text-[10px] text-gray-400">Passed</p><p className="text-sm font-black text-emerald-600">{e.passed.toLocaleString()}</p></div>
                <div><p className="text-[10px] text-gray-400">Pass Rate</p><p className={`text-sm font-black ${scoreColor(e.passRate)}`}>{e.passRate}%</p></div>
                <div><p className="text-[10px] text-gray-400">Revaluation</p><p className="text-sm font-black text-amber-600">{e.revaluation.toLocaleString()}</p></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CuriousHat value prop */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h3 className="font-bold text-gray-900 text-sm">CuriousHat for Universities</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🏛️', title: 'Monitor All Affiliated Colleges', desc: 'Real-time performance data from every affiliated college — pass rates, faculty stats, NAAC compliance, student outcomes. No more waiting for annual reports.' },
            { icon: '📊', title: 'Examination Intelligence', desc: 'AI-powered exam analytics — question paper generation, automated grading, revaluation tracking, result analysis across all programmes and colleges.' },
            { icon: '🎯', title: 'Admission Lead Pipeline', desc: 'Students prepping on CuriousHat for your entrance exams are auto-matched to your programmes. Pre-qualified leads flow to affiliated colleges.' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-xl p-4 border border-violet-100">
              <div className="text-2xl mb-2">{f.icon}</div>
              <p className="text-xs font-bold text-gray-900 mb-1">{f.title}</p>
              <p className="text-[10px] text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
