'use client'
import { useEffect, useState } from 'react'
import { TrendingUp, Download, Award, Loader2, Database } from 'lucide-react'

interface StudentRow {
  name: string
  roll: number
  ut1: number
  ut2: number
  mid: number
  ut3: number
  pre: number
}

interface ClassOption {
  id: string
  grade: string
  section: string
  studentCount: number
}

const mockStudents: StudentRow[] = [
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
  const [students, setStudents] = useState<StudentRow[]>([])
  const [classes, setClasses] = useState<ClassOption[]>([])
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<'db' | 'mock'>('mock')
  const [classLabel, setClassLabel] = useState('Physics | Class 10-A | Term 2')

  // Load available classes then scores
  useEffect(() => {
    async function load() {
      try {
        // Get schoolId
        const schoolRes = await fetch('/api/schools/first')
        if (!schoolRes.ok) throw new Error('No school')
        const school = await schoolRes.json()

        // Get classes
        const classRes = await fetch(`/api/classes/school/${school.id}`)
        if (!classRes.ok) throw new Error('No classes')
        const classData = await classRes.json()
        const classList: ClassOption[] = classData.classes
        setClasses(classList)

        if (classList.length > 0) {
          setSelectedClassId(classList[0].id)
        } else {
          throw new Error('No classes available')
        }
      } catch {
        // Fallback to mock
        setStudents(mockStudents)
        setSource('mock')
        setLoading(false)
      }
    }
    load()
  }, [])

  // Fetch scores when selectedClassId changes
  useEffect(() => {
    if (!selectedClassId) return

    async function fetchScores() {
      setLoading(true)
      try {
        const res = await fetch(`/api/scores/class/${selectedClassId}`)
        if (!res.ok) throw new Error('Failed to fetch scores')
        const data = await res.json()

        const cls = classes.find(c => c.id === selectedClassId)
        setClassLabel(`Class ${data.grade || cls?.grade}-${data.section || cls?.section} | Term 2`)

        // Map API response to StudentRow format
        const rows: StudentRow[] = data.students.map((s: any) => ({
          name: s.name,
          roll: s.roll,
          ut1: s.examTotals?.UT1 || 0,
          ut2: s.examTotals?.UT2 || 0,
          mid: s.examTotals?.MID || 0,
          ut3: s.examTotals?.UT3 || 0,
          pre: s.examTotals?.PRE_BOARD || 0,
        }))

        if (rows.length > 0) {
          setStudents(rows)
          setSource('db')
        } else {
          throw new Error('No scores')
        }
      } catch {
        setStudents(mockStudents)
        setSource('mock')
      } finally {
        setLoading(false)
      }
    }
    fetchScores()
  }, [selectedClassId, classes])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-500">Loading gradebook...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Gradebook</h1>
          <p className="text-gray-500 mt-1">{classLabel}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${source === 'db' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            <Database className="w-3 h-3" />
            {source === 'db' ? 'Live' : 'Mock'}
          </span>
          <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
            <Download className="w-4 h-4" /> Export Report Cards
          </button>
        </div>
      </div>

      {/* Class selector */}
      {classes.length > 0 && (
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          {classes.map(c => (
            <button
              key={c.id}
              onClick={() => setSelectedClassId(c.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedClassId === c.id ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-indigo-50'}`}
            >
              {c.grade}-{c.section} ({c.studentCount})
            </button>
          ))}
        </div>
      )}

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
