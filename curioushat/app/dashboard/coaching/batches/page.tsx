'use client'
import { useState } from 'react'
import { Users, Award, Calendar, TrendingUp, GraduationCap, ChevronRight, Plus } from 'lucide-react'

const examColorMap: Record<string, { border: string; bg: string; badge: string; accent: string }> = {
  JEE: { border: 'border-indigo-200', bg: 'bg-indigo-50', badge: 'bg-indigo-100 text-indigo-700', accent: '#4F46E5' },
  NEET: { border: 'border-emerald-200', bg: 'bg-emerald-50', badge: 'bg-emerald-100 text-emerald-700', accent: '#059669' },
  CLAT: { border: 'border-amber-200', bg: 'bg-amber-50', badge: 'bg-amber-100 text-amber-700', accent: '#D97706' },
  CA: { border: 'border-rose-200', bg: 'bg-rose-50', badge: 'bg-rose-100 text-rose-700', accent: '#E11D48' },
  NDA: { border: 'border-blue-200', bg: 'bg-blue-50', badge: 'bg-blue-100 text-blue-700', accent: '#1D4ED8' },
}

const batches = [
  {
    id: 1, name: 'JEE 2027 — Dropper Batch', exam: 'JEE', students: 120, capacity: 150,
    faculty: ['Rajesh Mishra (Physics)', 'Anita Deshmukh (Chem)', 'S.K. Goyal (Maths)'],
    avgMockScore: '182/300', avgPercent: 60.7,
    nextTest: 'Tomorrow, 9:00 AM', testName: 'Full Mock #15 — JEE Advanced Pattern',
    topAIR: 842, topStudent: 'Om Aditya Raghuvanshi',
    schedule: 'Mon–Sat, 8 AM – 2 PM', started: '1 Jul 2026',
  },
  {
    id: 2, name: 'NEET 2027 — Regular', exam: 'NEET', students: 180, capacity: 200,
    faculty: ['Dr. Meena Kumari (Bio)', 'Suresh Rao (Physics)', 'Pooja Jain (Chem)'],
    avgMockScore: '512/720', avgPercent: 71.1,
    nextTest: 'Sat, 10:00 AM', testName: 'NEET Mock #12 — Full Syllabus',
    topAIR: 1240, topStudent: 'Riya Sharma',
    schedule: 'Mon–Sat, 9 AM – 3 PM', started: '15 Jun 2026',
  },
  {
    id: 3, name: 'JEE 2026 — Crash Course', exam: 'JEE', students: 85, capacity: 100,
    faculty: ['Vikas Tiwari (Phy+Maths)', 'Neha Agarwal (Chem)'],
    avgMockScore: '148/300', avgPercent: 49.3,
    nextTest: 'Today, 4:00 PM', testName: 'JEE Main Mock #8 — Paper 1',
    topAIR: 3420, topStudent: 'Aditya Joshi',
    schedule: 'Mon–Sun, 4 PM – 9 PM', started: '1 Jan 2026',
  },
  {
    id: 4, name: 'CLAT 2027 — Weekend', exam: 'CLAT', students: 45, capacity: 60,
    faculty: ['Adv. Shalini Roy (Legal)', 'Manoj Kumar (English+GK)'],
    avgMockScore: '108/150', avgPercent: 72.0,
    nextTest: 'Sun, 11:00 AM', testName: 'CLAT Mock #6 — UG Full Pattern',
    topAIR: 128, topStudent: 'Sneha Patel',
    schedule: 'Sat–Sun, 10 AM – 4 PM', started: '1 Aug 2026',
  },
  {
    id: 5, name: 'CA Foundation — Nov 2026', exam: 'CA', students: 60, capacity: 75,
    faculty: ['CA Rakesh Aggarwal (Accounts)', 'CA Priyanka Seth (Law+BCR)'],
    avgMockScore: '256/400', avgPercent: 64.0,
    nextTest: 'Wed, 3:00 PM', testName: 'Foundation Mock #4 — Paper 1+2',
    topAIR: 52, topStudent: 'Priya Nair',
    schedule: 'Mon–Fri, 3 PM – 7 PM', started: '1 May 2026',
  },
  {
    id: 6, name: 'NDA 2027 — Morning', exam: 'NDA', students: 40, capacity: 50,
    faculty: ['Col. (Retd.) Ashok Tandon (GAT)', 'Ravi Shankar (Maths)'],
    avgMockScore: '548/900', avgPercent: 60.9,
    nextTest: 'Thu, 6:00 AM', testName: 'NDA Mock #7 — Paper I + II',
    topAIR: 310, topStudent: 'Siddharth Chauhan',
    schedule: 'Mon–Sat, 6 AM – 10 AM', started: '15 Jul 2026',
  },
]

const overallStats = [
  { label: 'Total Students', value: '530', sub: 'across 6 batches', icon: Users, color: '#7C3AED', bg: 'bg-violet-50' },
  { label: 'Avg Batch Score', value: '63.0%', sub: '+4.2% this month', icon: TrendingUp, color: '#059669', bg: 'bg-emerald-50' },
  { label: 'Faculty Members', value: '14', sub: '5 exam categories', icon: GraduationCap, color: '#D97706', bg: 'bg-amber-50' },
  { label: 'Best AIR (Mock)', value: '52', sub: 'CA Foundation — Priya Nair', icon: Award, color: '#1D4ED8', bg: 'bg-blue-50' },
]

export default function BatchesPage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Batch Management</h1>
          <p className="text-sm text-gray-500 mt-1">Monitor all active batches, faculty assignments, and upcoming tests</p>
        </div>
        <button className="bg-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-violet-700 transition-colors">
          <Plus className="w-4 h-4" />
          Create Batch
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {overallStats.map(s => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {batches.map(batch => {
          const colors = examColorMap[batch.exam]
          const fillPercent = Math.round((batch.students / batch.capacity) * 100)
          const isExpanded = expandedId === batch.id

          return (
            <div
              key={batch.id}
              className={`bg-white rounded-2xl border ${colors.border} shadow-sm overflow-hidden transition-all hover:shadow-md cursor-pointer`}
              onClick={() => setExpandedId(isExpanded ? null : batch.id)}
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${colors.badge}`}>{batch.exam}</span>
                      <span className="text-xs text-gray-400">Since {batch.started}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900">{batch.name}</h3>
                  </div>
                  <ChevronRight className={`w-5 h-5 text-gray-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className={`${colors.bg} rounded-xl p-3 text-center`}>
                    <Users className="w-4 h-4 mx-auto mb-1" style={{ color: colors.accent }} />
                    <div className="text-lg font-black text-gray-900">{batch.students}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Students</div>
                  </div>
                  <div className={`${colors.bg} rounded-xl p-3 text-center`}>
                    <TrendingUp className="w-4 h-4 mx-auto mb-1" style={{ color: colors.accent }} />
                    <div className="text-lg font-black text-gray-900">{batch.avgMockScore}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Avg Score</div>
                  </div>
                  <div className={`${colors.bg} rounded-xl p-3 text-center`}>
                    <Award className="w-4 h-4 mx-auto mb-1" style={{ color: colors.accent }} />
                    <div className="text-lg font-black text-gray-900">AIR {batch.topAIR.toLocaleString()}</div>
                    <div className="text-[10px] text-gray-500 uppercase tracking-wider">Top Rank</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-medium">Next Test:</span>
                  <span>{batch.nextTest}</span>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full transition-all"
                    style={{ width: `${fillPercent}%`, backgroundColor: colors.accent }}
                  />
                </div>
                <div className="text-[10px] text-gray-400 mt-1">{batch.students}/{batch.capacity} seats filled ({fillPercent}%)</div>
              </div>

              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-gray-50 space-y-3">
                  <div>
                    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Faculty</div>
                    <div className="flex flex-wrap gap-1.5">
                      {batch.faculty.map(f => (
                        <span key={f} className="text-xs bg-gray-50 text-gray-700 px-2.5 py-1 rounded-lg">{f}</span>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500">Top Student:</span>
                      <span className="ml-1 font-medium text-gray-900">{batch.topStudent}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Schedule:</span>
                      <span className="ml-1 font-medium text-gray-900">{batch.schedule}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Upcoming Test:</span>
                      <span className="ml-1 font-medium text-gray-900">{batch.testName}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Avg Percentage:</span>
                      <span className="ml-1 font-medium text-gray-900">{batch.avgPercent}%</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
