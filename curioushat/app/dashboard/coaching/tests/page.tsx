'use client'
import { useState } from 'react'
import { FileText, Users, TrendingUp, Plus, Calendar, Timer, Target, CheckCircle2, PlayCircle, CircleDot } from 'lucide-react'

const stats = [
  { label: 'Total Tests', value: '10', sub: '4 exams covered', icon: FileText, color: '#7C3AED', bg: 'bg-violet-50' },
  { label: 'Upcoming', value: '3', sub: 'next 7 days', icon: Calendar, color: '#D97706', bg: 'bg-amber-50' },
  { label: 'Avg Completion', value: '92%', sub: 'students per test', icon: Target, color: '#059669', bg: 'bg-emerald-50' },
  { label: 'Avg Score (Completed)', value: '61.4%', sub: 'across all exams', icon: TrendingUp, color: '#1D4ED8', bg: 'bg-blue-50' },
]

type TestStatus = 'upcoming' | 'live' | 'completed'

const statusConfig: Record<TestStatus, { label: string; cls: string; icon: typeof CircleDot }> = {
  upcoming: { label: 'Upcoming', cls: 'bg-amber-50 text-amber-700', icon: CircleDot },
  live: { label: 'Live Now', cls: 'bg-red-50 text-red-600', icon: PlayCircle },
  completed: { label: 'Completed', cls: 'bg-emerald-50 text-emerald-700', icon: CheckCircle2 },
}

const examBadge: Record<string, string> = {
  JEE: 'bg-indigo-50 text-indigo-700',
  NEET: 'bg-emerald-50 text-emerald-700',
  CLAT: 'bg-amber-50 text-amber-700',
  CA: 'bg-rose-50 text-rose-700',
}

interface Test {
  id: number
  name: string
  exam: string
  date: string
  time: string
  duration: string
  totalMarks: number
  registered: number
  status: TestStatus
  highestScore?: number
  avgScore?: number
  passPercent?: number
  topScorer?: string
}

const tests: Test[] = [
  { id: 1, name: 'JEE Advanced Full Mock #1', exam: 'JEE', date: '2026-03-10', time: '9:00 AM', duration: '3 hrs', totalMarks: 300, registered: 118, status: 'completed', highestScore: 248, avgScore: 172, passPercent: 78, topScorer: 'Om Aditya Raghuvanshi' },
  { id: 2, name: 'JEE Advanced Full Mock #2', exam: 'JEE', date: '2026-03-17', time: '9:00 AM', duration: '3 hrs', totalMarks: 300, registered: 120, status: 'completed', highestScore: 261, avgScore: 178, passPercent: 81, topScorer: 'Om Aditya Raghuvanshi' },
  { id: 3, name: 'JEE Main Mock #3', exam: 'JEE', date: '2026-03-24', time: '2:00 PM', duration: '3 hrs', totalMarks: 300, registered: 84, status: 'completed', highestScore: 224, avgScore: 156, passPercent: 72, topScorer: 'Aditya Joshi' },
  { id: 4, name: 'JEE Advanced Full Mock #4', exam: 'JEE', date: '2026-04-02', time: '4:00 PM', duration: '3 hrs', totalMarks: 300, registered: 115, status: 'live' },
  { id: 5, name: 'NEET Full Syllabus Mock #1', exam: 'NEET', date: '2026-03-08', time: '10:00 AM', duration: '3 hrs 20 min', totalMarks: 720, registered: 176, status: 'completed', highestScore: 668, avgScore: 498, passPercent: 74, topScorer: 'Riya Sharma' },
  { id: 6, name: 'NEET Full Syllabus Mock #2', exam: 'NEET', date: '2026-03-22', time: '10:00 AM', duration: '3 hrs 20 min', totalMarks: 720, registered: 178, status: 'completed', highestScore: 652, avgScore: 512, passPercent: 76, topScorer: 'Riya Sharma' },
  { id: 7, name: 'NEET Biology Sectional #3', exam: 'NEET', date: '2026-04-05', time: '10:00 AM', duration: '2 hrs', totalMarks: 360, registered: 168, status: 'upcoming' },
  { id: 8, name: 'CLAT Full Mock #1', exam: 'CLAT', date: '2026-03-15', time: '11:00 AM', duration: '2 hrs', totalMarks: 150, registered: 44, status: 'completed', highestScore: 132, avgScore: 104, passPercent: 82, topScorer: 'Sneha Patel' },
  { id: 9, name: 'CLAT Full Mock #2', exam: 'CLAT', date: '2026-04-06', time: '11:00 AM', duration: '2 hrs', totalMarks: 150, registered: 43, status: 'upcoming' },
  { id: 10, name: 'CA Foundation Mock #1', exam: 'CA', date: '2026-03-20', time: '3:00 PM', duration: '3 hrs', totalMarks: 400, registered: 58, status: 'completed', highestScore: 312, avgScore: 256, passPercent: 68, topScorer: 'Priya Nair' },
]

const tabs = ['All', 'Upcoming', 'Live', 'Completed'] as const

export default function TestSeriesPage() {
  const [activeTab, setActiveTab] = useState<string>('All')

  const filtered = tests.filter(t => activeTab === 'All' || t.status.toLowerCase() === activeTab.toLowerCase())

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Test Series</h1>
          <p className="text-sm text-gray-500 mt-1">Schedule, monitor, and analyze test performance across all batches</p>
        </div>
        <button className="bg-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-violet-700 transition-colors">
          <Plus className="w-4 h-4" />
          Create Test
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">{s.label}</span>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            {tabs.map(tab => {
              const count = tab === 'All' ? tests.length : tests.filter(t => t.status.toLowerCase() === tab.toLowerCase()).length
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-sm font-medium px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                    activeTab === tab ? 'bg-violet-100 text-violet-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {tab} <span className="text-xs ml-1 opacity-70">({count})</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="divide-y divide-gray-50">
          {filtered.map(test => {
            const sc = statusConfig[test.status]
            const StatusIcon = sc.icon
            return (
              <div key={test.id} className="p-4 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${examBadge[test.exam]}`}>{test.exam}</span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${sc.cls}`}>
                        <StatusIcon className="w-3 h-3" />
                        {sc.label}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-gray-900">{test.name}</h3>
                  </div>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(test.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    {' '}{test.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <Timer className="w-3.5 h-3.5" />
                    {test.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="w-3.5 h-3.5" />
                    {test.totalMarks} marks
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {test.registered} registered
                  </span>
                </div>

                {test.status === 'completed' && (
                  <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-emerald-50 rounded-xl px-3 py-2">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">Highest</div>
                      <div className="text-sm font-bold text-gray-900">{test.highestScore}/{test.totalMarks}</div>
                      <div className="text-[10px] text-emerald-600 font-medium">{test.topScorer}</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl px-3 py-2">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">Average</div>
                      <div className="text-sm font-bold text-gray-900">{test.avgScore}/{test.totalMarks}</div>
                      <div className="text-[10px] text-blue-600 font-medium">{((test.avgScore! / test.totalMarks) * 100).toFixed(1)}%</div>
                    </div>
                    <div className="bg-violet-50 rounded-xl px-3 py-2">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">Pass Rate</div>
                      <div className="text-sm font-bold text-gray-900">{test.passPercent}%</div>
                      <div className="text-[10px] text-violet-600 font-medium">{Math.round(test.registered * test.passPercent! / 100)} students</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl px-3 py-2">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wider">Score Range</div>
                      <div className="text-sm font-bold text-gray-900">{Math.round(test.avgScore! * 0.55)}–{test.highestScore}</div>
                      <div className="text-[10px] text-amber-600 font-medium">out of {test.totalMarks}</div>
                    </div>
                  </div>
                )}

                {test.status === 'live' && (
                  <div className="mt-3 flex items-center gap-2">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                    <span className="text-xs font-medium text-red-600">Test in progress — {test.registered} students attempting</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
