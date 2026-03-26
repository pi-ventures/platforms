'use client'
import { useState } from 'react'
import { TrendingUp, TrendingDown, Award, BarChart3, BookOpen } from 'lucide-react'

const subjects = [
  { name: 'Mathematics', teacher: 'Mr. Sharma', marks: [82, 78, 88, 92, 85], avg: 85, grade: 'A', trend: +3 },
  { name: 'Physics', teacher: 'Ms. Gupta', marks: [74, 80, 76, 85, 79], avg: 79, grade: 'B+', trend: +5 },
  { name: 'Chemistry', teacher: 'Mr. Iyer', marks: [88, 85, 90, 92, 89], avg: 89, grade: 'A+', trend: +1 },
  { name: 'Biology', teacher: 'Ms. Nair', marks: [70, 75, 72, 78, 74], avg: 74, grade: 'B', trend: +4 },
  { name: 'English', teacher: 'Ms. Khan', marks: [85, 88, 90, 87, 88], avg: 88, grade: 'A', trend: +3 },
  { name: 'History', teacher: 'Mr. Raghuvanshi', marks: [78, 80, 82, 85, 81], avg: 81, grade: 'A-', trend: +3 },
]

const exams = ['UT1', 'UT2', 'Mid-Term', 'UT3', 'Pre-Board']

const gradeColor = (g: string) => {
  if (g.startsWith('A')) return 'bg-emerald-100 text-emerald-700'
  if (g.startsWith('B')) return 'bg-blue-100 text-blue-700'
  return 'bg-amber-100 text-amber-700'
}

const aiInsights: Record<string, string> = {
  Mathematics: 'Om shows consistent improvement in Mathematics, especially in calculus topics. Pre-Board score of 85 reflects strong preparation. Recommend focusing on trigonometry for finals.',
  Physics: 'Good recovery after UT2 dip. Electricity & Magnetism chapter shows strong understanding. Optics needs more practice before finals.',
  Chemistry: 'Best subject overall. Organic chemistry is a clear strength. Keep up the revision routine.',
  Biology: 'Steady upward trend. Cell biology scores are strong. Plant physiology and genetics need targeted revision.',
  English: 'Excellent writing skills demonstrated in essay topics. Reading comprehension scores are consistently high.',
  History: 'Good conceptual understanding of Modern India. Map work and dates require more attention before finals.',
}

export default function ParentProgressPage() {
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const overall = Math.round(subjects.reduce((acc, s) => acc + s.avg, 0) / subjects.length)
  const bestSubject = subjects.reduce((best, s) => s.avg > best.avg ? s : best)
  const needsAttention = subjects.reduce((worst, s) => s.avg < worst.avg ? s : worst)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-orange-500" /> Academic Progress
        </h1>
        <p className="text-gray-500 mt-1">Om Aditya Raghuvanshi · Class 10-A · Session 2025–26 · Term 2</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-5 text-white">
          <div className="text-4xl font-black mb-1">{overall}%</div>
          <div className="text-orange-100 text-sm">Overall Average</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-3xl font-black text-gray-900 mb-1">#5</div>
          <div className="text-gray-500 text-sm">Class Rank</div>
          <div className="text-emerald-600 text-xs mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />Up 2 positions</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-xs text-gray-400 mb-1">Best Subject</div>
          <div className="text-lg font-black text-gray-900">{bestSubject.name}</div>
          <div className="text-emerald-600 text-sm font-bold">{bestSubject.avg}% · {bestSubject.grade}</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-amber-100 bg-amber-50 shadow-sm">
          <div className="text-xs text-amber-600 mb-1">Needs Attention</div>
          <div className="text-lg font-black text-gray-900">{needsAttention.name}</div>
          <div className="text-amber-600 text-sm font-bold">{needsAttention.avg}% · {needsAttention.grade}</div>
        </div>
      </div>

      {/* Performance Table with expand */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Subject-wise Performance</h2>
          <p className="text-xs text-gray-400 mt-0.5">Click any row to see AI analysis</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[350px] sm:min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Subject</th>
                {exams.map(e => (
                  <th key={e} className="text-center px-3 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">{e}</th>
                ))}
                <th className="text-center px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Avg</th>
                <th className="text-center px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Grade</th>
                <th className="text-center px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map(s => (
                <>
                  <tr key={s.name} onClick={() => setSelectedSubject(selectedSubject === s.name ? null : s.name)} className="border-t border-gray-50 hover:bg-orange-50 cursor-pointer transition-colors">
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-900">{s.name}</div>
                      <div className="text-xs text-gray-400">{s.teacher}</div>
                    </td>
                    {s.marks.map((m, i) => (
                      <td key={i} className="px-3 py-4 text-center text-gray-700">{m}</td>
                    ))}
                    <td className="px-4 py-4 text-center font-bold text-gray-900">{s.avg}</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${gradeColor(s.grade)}`}>{s.grade}</span>
                    </td>
                    <td className="px-4 py-4 text-center">
                      <span className={`flex items-center justify-center gap-0.5 text-xs font-semibold ${s.trend >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                        {s.trend >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {s.trend >= 0 ? '+' : ''}{s.trend}
                      </span>
                    </td>
                  </tr>
                  {selectedSubject === s.name && (
                    <tr key={s.name + '-insight'} className="bg-orange-50 border-t border-orange-100">
                      <td colSpan={9} className="px-5 py-4">
                        <div className="flex gap-3 items-start">
                          <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                            <BookOpen className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-orange-700 mb-1">AI Teacher Insight — {s.name}</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{aiInsights[s.name]}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <h2 className="font-bold text-gray-900 mb-4">Visual Overview</h2>
        <div className="space-y-4">
          {subjects.map(s => (
            <div key={s.name}>
              <div className="flex items-center justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700">{s.name}</span>
                <span className="font-bold text-gray-900">{s.avg}%</span>
              </div>
              <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${s.avg >= 85 ? 'bg-emerald-500' : s.avg >= 75 ? 'bg-blue-500' : 'bg-amber-500'}`}
                  style={{ width: `${s.avg}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
