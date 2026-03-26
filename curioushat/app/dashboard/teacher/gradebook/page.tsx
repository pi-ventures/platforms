import { TrendingUp, Download, Award } from 'lucide-react'

const students = [
  { name: 'Om Aditya Raghuvanshi', roll: 1, ut1: 38, ut2: 35, mid: 72, ut3: 36, pre: 78 },
  { name: 'Bhavna Sharma', roll: 2, ut1: 42, ut2: 40, mid: 82, ut3: 41, pre: 85 },
  { name: 'Chirag Patel', roll: 3, ut1: 28, ut2: 32, mid: 58, ut3: 30, pre: 62 },
  { name: 'Deepa Nair', roll: 4, ut1: 45, ut2: 43, mid: 88, ut3: 44, pre: 90 },
  { name: 'Ekta Joshi', roll: 5, ut1: 33, ut2: 36, mid: 68, ut3: 35, pre: 70 },
  { name: 'Farhan Khan', roll: 6, ut1: 40, ut2: 38, mid: 76, ut3: 39, pre: 79 },
  { name: 'Gauri Iyer', roll: 7, ut1: 44, ut2: 44, mid: 90, ut3: 45, pre: 92 },
]

const getGrade = (pct: number) => {
  if (pct >= 90) return 'A+'
  if (pct >= 80) return 'A'
  if (pct >= 70) return 'B+'
  if (pct >= 60) return 'B'
  if (pct >= 50) return 'C'
  return 'D'
}

const gradeColor = (g: string) => {
  if (g.startsWith('A')) return 'bg-emerald-100 text-emerald-700'
  if (g.startsWith('B')) return 'bg-blue-100 text-blue-700'
  if (g === 'C') return 'bg-amber-100 text-amber-700'
  return 'bg-red-100 text-red-600'
}

export default function GradebookPage() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Gradebook</h1>
          <p className="text-gray-500 mt-1">Physics | Class 10-A | Term 2</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
          <Download className="w-4 h-4" /> Export Report Cards
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-sm min-w-[400px] sm:min-w-[700px]">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Student</th>
              {[['UT1', '/50'], ['UT2', '/50'], ['Mid-Term', '/100'], ['UT3', '/50'], ['Pre-Board', '/100']].map(([h, s]) => (
                <th key={h} className="text-center px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">{h}<span className="text-gray-300 font-normal">{s}</span></th>
              ))}
              <th className="text-center px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Total</th>
              <th className="text-center px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Grade</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {students.map((s) => {
              const total = s.ut1 + s.ut2 + s.mid + s.ut3 + s.pre
              const max = 350
              const pct = Math.round((total / max) * 100)
              const grade = getGrade(pct)
              return (
                <tr key={s.name} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">#{s.roll}</span>
                      <span className="font-semibold text-gray-900">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center text-gray-700">{s.ut1}</td>
                  <td className="px-4 py-4 text-center text-gray-700">{s.ut2}</td>
                  <td className="px-4 py-4 text-center text-gray-700">{s.mid}</td>
                  <td className="px-4 py-4 text-center text-gray-700">{s.ut3}</td>
                  <td className="px-4 py-4 text-center text-gray-700">{s.pre}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-bold text-gray-900">{total}</span>
                    <span className="text-gray-400 text-xs">/{max}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${gradeColor(grade)}`}>{grade}</span>
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
