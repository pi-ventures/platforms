'use client'
import { useEffect, useState } from 'react'
import { TrendingUp, TrendingDown, Award, Loader2, Database } from 'lucide-react'

interface SubjectData {
  subject: string
  teacher: string
  exams: { type: string; marks: number; maxMarks: number; pct: number; grade: string }[]
  avg: number
  overallGrade: string
}

const EXAM_ORDER = ['UT1', 'UT2', 'MID', 'UT3', 'PRE_BOARD']

const gradeColor = (g: string) => {
  if (g.startsWith('A')) return 'bg-emerald-100 text-emerald-700'
  if (g.startsWith('B')) return 'bg-blue-100 text-blue-700'
  if (g.startsWith('C')) return 'bg-amber-100 text-amber-700'
  return 'bg-gray-100 text-gray-700'
}

// TODO: Replace with auth context — for now use first student
const STUDENT_ID = 'roll-1'

export default function GradesPage() {
  const [subjects, setSubjects] = useState<SubjectData[]>([])
  const [overall, setOverall] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [source, setSource] = useState<'db' | 'mock'>('mock')

  useEffect(() => {
    async function load() {
      try {
        // First get student ID by querying all students (in prod this comes from auth)
        const profileRes = await fetch('/api/students/roll-1/scores')
        if (!profileRes.ok) {
          // Try to find the student by querying the DB for roll=1
          const lookupRes = await fetch('/api/students/lookup?roll=1')
          if (lookupRes.ok) {
            const { id } = await lookupRes.json()
            const scoresRes = await fetch(`/api/students/${id}/scores`)
            if (scoresRes.ok) {
              const data = await scoresRes.json()
              setSubjects(data.subjects)
              setOverall(data.overall)
              setSource('db')
              setLoading(false)
              return
            }
          }
          throw new Error('API unavailable')
        }
        const data = await profileRes.json()
        setSubjects(data.subjects)
        setOverall(data.overall)
        setSource('db')
      } catch {
        // Fallback to hardcoded mock if API fails
        setSubjects([
          { subject: 'Mathematics', teacher: 'Mr. Sharma', exams: [{type:'UT1',marks:38,maxMarks:40,pct:95,grade:'A+'},{type:'UT2',marks:35,maxMarks:40,pct:87.5,grade:'A'},{type:'MID',marks:72,maxMarks:80,pct:90,grade:'A+'},{type:'UT3',marks:36,maxMarks:40,pct:90,grade:'A+'},{type:'PRE_BOARD',marks:78,maxMarks:80,pct:97.5,grade:'A+'}], avg: 92, overallGrade: 'A+' },
          { subject: 'Physics', teacher: 'Ms. Gupta', exams: [{type:'UT1',marks:34,maxMarks:40,pct:85,grade:'A'},{type:'UT2',marks:37,maxMarks:40,pct:92.5,grade:'A+'},{type:'MID',marks:68,maxMarks:80,pct:85,grade:'A'},{type:'UT3',marks:35,maxMarks:40,pct:87.5,grade:'A'},{type:'PRE_BOARD',marks:74,maxMarks:80,pct:92.5,grade:'A+'}], avg: 88.5, overallGrade: 'A' },
          { subject: 'Chemistry', teacher: 'Ms. Iyer', exams: [{type:'UT1',marks:40,maxMarks:40,pct:100,grade:'A+'},{type:'UT2',marks:38,maxMarks:40,pct:95,grade:'A+'},{type:'MID',marks:76,maxMarks:80,pct:95,grade:'A+'},{type:'UT3',marks:39,maxMarks:40,pct:97.5,grade:'A+'},{type:'PRE_BOARD',marks:82,maxMarks:80,pct:102.5,grade:'A+'}], avg: 98, overallGrade: 'A+' },
          { subject: 'English', teacher: 'Ms. Khan', exams: [{type:'UT1',marks:37,maxMarks:40,pct:92.5,grade:'A+'},{type:'UT2',marks:39,maxMarks:40,pct:97.5,grade:'A+'},{type:'MID',marks:78,maxMarks:80,pct:97.5,grade:'A+'},{type:'UT3',marks:38,maxMarks:40,pct:95,grade:'A+'},{type:'PRE_BOARD',marks:80,maxMarks:80,pct:100,grade:'A+'}], avg: 96.5, overallGrade: 'A+' },
        ])
        setOverall(82)
        setSource('mock')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  function getExamMark(s: SubjectData, examType: string) {
    const exam = s.exams.find(e => e.type === examType)
    return exam ? exam.marks : '-'
  }

  function getTrend(s: SubjectData) {
    const first = s.exams.find(e => e.type === 'UT1')
    const last = s.exams.find(e => e.type === 'PRE_BOARD') || s.exams[s.exams.length - 1]
    if (!first || !last) return 0
    return Math.round(last.pct - first.pct)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
        <span className="ml-2 text-gray-500">Loading grades from database...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Grades</h1>
          <p className="text-gray-500 mt-1">Academic year 2025–26 | Term 2</p>
        </div>
        <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${source === 'db' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          <Database className="w-3 h-3" />
          {source === 'db' ? 'Live — PostgreSQL' : 'Mock Data'}
        </span>
      </div>

      {error && <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-700">{error}</div>}

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl p-5 text-white">
          <div className="text-4xl font-black mb-1">{overall}%</div>
          <div className="text-teal-200 text-sm">Overall Average</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-3xl font-black text-gray-900 mb-1">#5</div>
          <div className="text-gray-500 text-sm">Class Rank</div>
          <div className="text-emerald-600 text-xs mt-1 flex items-center gap-1"><TrendingUp className="w-3 h-3" />Improved by 2</div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
          <div className="text-3xl font-black text-gray-900 mb-1">{overall >= 90 ? 'A+' : overall >= 80 ? 'A' : overall >= 70 ? 'B+' : 'B'}</div>
          <div className="text-gray-500 text-sm">Overall Grade</div>
          <div className="flex items-center gap-1 mt-1"><Award className="w-3 h-3 text-amber-500" /><span className="text-xs text-amber-600">Merit List</span></div>
        </div>
      </div>

      {/* Subject Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Subject-wise Performance</h2>
          <p className="text-xs text-gray-400 mt-0.5">{subjects.length} subjects · {subjects.reduce((a, s) => a + s.exams.length, 0)} exam results</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[400px] sm:min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Subject</th>
                <th className="text-left px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider hidden sm:table-cell">Teacher</th>
                {['UT1', 'UT2', 'MID', 'UT3', 'PRE'].map(h => (
                  <th key={h} className="text-center px-3 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                ))}
                <th className="text-center px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Avg</th>
                <th className="text-center px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">Grade</th>
                <th className="text-center px-4 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider hidden sm:table-cell">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subjects.map(s => {
                const trend = getTrend(s)
                return (
                  <tr key={s.subject} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-gray-900">{s.subject}</td>
                    <td className="px-4 py-4 text-gray-500 text-xs hidden sm:table-cell">{s.teacher}</td>
                    {EXAM_ORDER.map(et => (
                      <td key={et} className="px-3 py-4 text-center text-gray-700">{getExamMark(s, et)}</td>
                    ))}
                    <td className="px-4 py-4 text-center font-bold text-gray-900">{s.avg}%</td>
                    <td className="px-4 py-4 text-center">
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${gradeColor(s.overallGrade)}`}>{s.overallGrade}</span>
                    </td>
                    <td className="px-4 py-4 text-center hidden sm:table-cell">
                      {trend >= 0
                        ? <span className="flex items-center justify-center gap-0.5 text-emerald-600 text-xs"><TrendingUp className="w-3 h-3" />+{trend}%</span>
                        : <span className="flex items-center justify-center gap-0.5 text-red-500 text-xs"><TrendingDown className="w-3 h-3" />{trend}%</span>
                      }
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
