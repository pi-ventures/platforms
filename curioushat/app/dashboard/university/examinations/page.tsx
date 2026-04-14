'use client'
import { FileText, ClipboardCheck, Clock, CheckCircle2 } from 'lucide-react'

const exams = [
  {
    name: 'B.Tech End Semester (Even Sem)',
    date: '22 Apr - 15 May 2026',
    colleges: 6,
    students: 8420,
    status: 'scheduled',
  },
  {
    name: 'MBA Term-End Examination',
    date: '18 Apr - 30 Apr 2026',
    colleges: 4,
    students: 1240,
    status: 'scheduled',
  },
  {
    name: 'B.Tech Mid-Semester (Even Sem)',
    date: '10 Mar - 15 Mar 2026',
    colleges: 6,
    students: 8380,
    status: 'results_declared',
  },
  {
    name: 'M.Tech Comprehensive Viva',
    date: '5 Apr - 10 Apr 2026',
    colleges: 3,
    students: 320,
    status: 'ongoing',
  },
  {
    name: 'B.Tech Supplementary Exams (Odd Sem)',
    date: '1 Mar - 12 Mar 2026',
    colleges: 6,
    students: 1850,
    status: 'completed',
  },
  {
    name: 'Ph.D. Coursework Examination',
    date: '25 Mar - 28 Mar 2026',
    colleges: 2,
    students: 85,
    status: 'results_declared',
  },
]

const totalExams = exams.length
const papersEvaluated = 28450
const resultsPending = exams.filter(e => e.status === 'completed').length
const scheduled = exams.filter(e => e.status === 'scheduled').length

const statusConfig: Record<string, { label: string; cls: string }> = {
  scheduled: { label: 'Scheduled', cls: 'bg-blue-100 text-blue-700' },
  ongoing: { label: 'Ongoing', cls: 'bg-emerald-100 text-emerald-700 animate-pulse' },
  completed: { label: 'Completed', cls: 'bg-amber-100 text-amber-700' },
  results_declared: { label: 'Results Declared', cls: 'bg-violet-100 text-violet-700' },
}

export default function ExaminationsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <FileText className="w-7 h-7 text-violet-600" /> Examination Management
        </h1>
        <p className="text-gray-500 mt-1 text-sm">University examination scheduling, evaluation, and results</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
          <div className="flex items-center gap-2 text-violet-600 mb-1">
            <FileText className="w-4 h-4" />
            <span className="text-xs font-medium">Exams This Semester</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{totalExams}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <ClipboardCheck className="w-4 h-4" />
            <span className="text-xs font-medium">Papers Evaluated</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{papersEvaluated.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-medium">Results Pending</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{resultsPending}</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-medium">Upcoming Scheduled</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{scheduled}</p>
        </div>
      </div>

      {/* Exams Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs">Examination</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs">Date Range</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Colleges</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Students Appearing</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {exams.map((e, i) => {
                const sc = statusConfig[e.status]
                return (
                  <tr key={i} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                    <td className="py-3 px-4 font-semibold text-gray-900">{e.name}</td>
                    <td className="py-3 px-4 text-gray-600">{e.date}</td>
                    <td className="py-3 px-4 text-center font-bold text-gray-900">{e.colleges}</td>
                    <td className="py-3 px-4 text-center font-bold text-violet-600">{e.students.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${sc.cls}`}>
                        {sc.label}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
