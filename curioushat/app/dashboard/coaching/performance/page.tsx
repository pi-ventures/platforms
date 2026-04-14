'use client'
import { useState, Fragment } from 'react'
import { TrendingUp, AlertTriangle, Target, FileText, ChevronRight, Award, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const stats = [
  { label: 'Avg Improvement', value: '+28.6%', sub: 'across all batches', icon: TrendingUp, color: '#059669', bg: 'bg-emerald-50' },
  { label: 'Above Target', value: '312', sub: '58.9% of students', icon: Target, color: '#7C3AED', bg: 'bg-violet-50' },
  { label: 'At-Risk Students', value: '47', sub: 'need intervention', icon: AlertTriangle, color: '#DC2626', bg: 'bg-red-50' },
  { label: 'Mock Tests This Month', value: '142', sub: '10 upcoming', icon: FileText, color: '#1D4ED8', bg: 'bg-blue-50' },
]

const trendBadge = (val: number) =>
  val >= 0
    ? { cls: 'text-emerald-600', icon: ArrowUpRight, label: `+${val}%` }
    : { cls: 'text-red-500', icon: ArrowDownRight, label: `${val}%` }

const examBadge: Record<string, string> = {
  JEE: 'bg-indigo-50 text-indigo-700',
  NEET: 'bg-emerald-50 text-emerald-700',
  CLAT: 'bg-amber-50 text-amber-700',
  CA: 'bg-rose-50 text-rose-700',
  NDA: 'bg-blue-50 text-blue-700',
}

interface TopStudent {
  name: string
  mockScores: string[]
  latestScore: string
  improvement: number
  predicted: string
  status: 'on_track' | 'improving' | 'at_risk'
}

interface Batch {
  id: number
  name: string
  exam: string
  students: number
  avgScore: string
  avgPercent: number
  improvement: number
  topScorer: string
  atRisk: number
  topStudents: TopStudent[]
}

const batches: Batch[] = [
  {
    id: 1, name: 'JEE 2027 — Dropper Batch', exam: 'JEE', students: 120, avgScore: '182/300', avgPercent: 60.7, improvement: 34,
    topScorer: 'Om Aditya Raghuvanshi', atRisk: 8,
    topStudents: [
      { name: 'Om Aditya Raghuvanshi', mockScores: ['198', '221', '248', '261', '272'], latestScore: '272/300', improvement: 42, predicted: 'IIT Delhi — Computer Science (AIR ~500)', status: 'on_track' },
      { name: 'Karan Mehta', mockScores: ['156', '178', '201', '224', '248'], latestScore: '248/300', improvement: 38, predicted: 'IIT BHU — Electrical (AIR ~2,500)', status: 'on_track' },
      { name: 'Simran Kaur', mockScores: ['142', '165', '188', '210', '231'], latestScore: '231/300', improvement: 35, predicted: 'NIT Trichy — ECE (AIR ~5,000)', status: 'improving' },
      { name: 'Rahul Tiwari', mockScores: ['168', '175', '192', '208', '226'], latestScore: '226/300', improvement: 24, predicted: 'NIT Warangal — CSE (AIR ~6,200)', status: 'improving' },
      { name: 'Ankit Saxena', mockScores: ['134', '148', '166', '189', '218'], latestScore: '218/300', improvement: 41, predicted: 'IIIT Hyderabad — CSD (AIR ~7,800)', status: 'on_track' },
    ]
  },
  {
    id: 2, name: 'NEET 2027 — Regular', exam: 'NEET', students: 180, avgScore: '512/720', avgPercent: 71.1, improvement: 31,
    topScorer: 'Riya Sharma', atRisk: 14,
    topStudents: [
      { name: 'Riya Sharma', mockScores: ['548', '592', '628', '652', '668'], latestScore: '668/720', improvement: 31, predicted: 'AIIMS Delhi — MBBS (AIR ~800)', status: 'on_track' },
      { name: 'Deepa Krishnan', mockScores: ['512', '538', '564', '598', '642'], latestScore: '642/720', improvement: 28, predicted: 'JIPMER Puducherry — MBBS (AIR ~2,000)', status: 'on_track' },
      { name: 'Aman Yadav', mockScores: ['478', '502', '528', '556', '612'], latestScore: '612/720', improvement: 32, predicted: 'KGMU Lucknow — MBBS (AIR ~8,500)', status: 'improving' },
      { name: 'Pooja Reddy', mockScores: ['468', '496', '518', '548', '594'], latestScore: '594/720', improvement: 26, predicted: 'GMCH Chandigarh — MBBS (AIR ~14,000)', status: 'improving' },
      { name: 'Vishnu Nambiar', mockScores: ['432', '458', '486', '524', '572'], latestScore: '572/720', improvement: 34, predicted: 'Govt Medical College Kottayam (AIR ~22,000)', status: 'improving' },
    ]
  },
  {
    id: 3, name: 'JEE 2026 — Crash Course', exam: 'JEE', students: 85, avgScore: '148/300', avgPercent: 49.3, improvement: 18,
    topScorer: 'Aditya Joshi', atRisk: 12,
    topStudents: [
      { name: 'Aditya Joshi', mockScores: ['148', '168', '188', '208', '224'], latestScore: '224/300', improvement: 34, predicted: 'NIT Surathkal — IT (AIR ~8,000)', status: 'on_track' },
      { name: 'Megha Soni', mockScores: ['132', '148', '164', '182', '198'], latestScore: '198/300', improvement: 28, predicted: 'NIT Rourkela — CSE (AIR ~12,000)', status: 'improving' },
      { name: 'Rajat Verma', mockScores: ['124', '138', '152', '168', '186'], latestScore: '186/300', improvement: 22, predicted: 'IIIT Allahabad — IT (AIR ~15,000)', status: 'improving' },
      { name: 'Sanya Kapoor', mockScores: ['118', '126', '142', '158', '174'], latestScore: '174/300', improvement: 20, predicted: 'VIT Vellore — CSE (JEE Main ~85%ile)', status: 'improving' },
      { name: 'Harsh Gupta', mockScores: ['96', '104', '112', '118', '124'], latestScore: '124/300', improvement: 10, predicted: 'At risk — below target cutoff', status: 'at_risk' },
    ]
  },
  {
    id: 4, name: 'CLAT 2027 — Weekend', exam: 'CLAT', students: 45, avgScore: '108/150', avgPercent: 72.0, improvement: 28,
    topScorer: 'Sneha Patel', atRisk: 4,
    topStudents: [
      { name: 'Sneha Patel', mockScores: ['112', '118', '126', '132', '138'], latestScore: '138/150', improvement: 38, predicted: 'NLSIU Bangalore (AIR ~50)', status: 'on_track' },
      { name: 'Aryan Bhatia', mockScores: ['104', '112', '118', '124', '132'], latestScore: '132/150', improvement: 32, predicted: 'NALSAR Hyderabad (AIR ~120)', status: 'on_track' },
      { name: 'Nidhi Joshi', mockScores: ['96', '104', '112', '118', '126'], latestScore: '126/150', improvement: 26, predicted: 'NLU Delhi (AIR ~200)', status: 'improving' },
      { name: 'Varun Menon', mockScores: ['88', '96', '104', '112', '122'], latestScore: '122/150', improvement: 30, predicted: 'NUJS Kolkata (AIR ~350)', status: 'improving' },
      { name: 'Ritika Singh', mockScores: ['82', '90', '96', '106', '118'], latestScore: '118/150', improvement: 28, predicted: 'NLU Jodhpur (AIR ~500)', status: 'on_track' },
    ]
  },
  {
    id: 5, name: 'CA Foundation — Nov 2026', exam: 'CA', students: 60, avgScore: '256/400', avgPercent: 64.0, improvement: 24,
    topScorer: 'Priya Nair', atRisk: 6,
    topStudents: [
      { name: 'Priya Nair', mockScores: ['268', '282', '294', '304', '312'], latestScore: '312/400', improvement: 24, predicted: 'Clear in 1st attempt (AIR ~50)', status: 'on_track' },
      { name: 'Siddharth Agarwal', mockScores: ['252', '264', '278', '288', '298'], latestScore: '298/400', improvement: 22, predicted: 'Clear in 1st attempt (AIR ~120)', status: 'on_track' },
      { name: 'Tanisha Goel', mockScores: ['238', '248', '260', '272', '286'], latestScore: '286/400', improvement: 26, predicted: 'Clear in 1st attempt', status: 'improving' },
      { name: 'Mohit Bansal', mockScores: ['224', '236', '248', '258', '272'], latestScore: '272/400', improvement: 20, predicted: 'Likely clear — borderline', status: 'improving' },
      { name: 'Divya Chauhan', mockScores: ['212', '222', '234', '246', '260'], latestScore: '260/400', improvement: 18, predicted: 'Needs improvement in Accounts paper', status: 'at_risk' },
    ]
  },
  {
    id: 6, name: 'NDA 2027 — Morning', exam: 'NDA', students: 40, avgScore: '548/900', avgPercent: 60.9, improvement: 22,
    topScorer: 'Siddharth Chauhan', atRisk: 3,
    topStudents: [
      { name: 'Siddharth Chauhan', mockScores: ['588', '612', '648', '672', '698'], latestScore: '698/900', improvement: 28, predicted: 'IMA Dehradun — Army (AIR ~300)', status: 'on_track' },
      { name: 'Arjun Thapa', mockScores: ['542', '568', '594', '624', '656'], latestScore: '656/900', improvement: 26, predicted: 'INA Ezhimala — Navy (AIR ~600)', status: 'on_track' },
      { name: 'Devendra Rajput', mockScores: ['498', '524', '552', '578', '618'], latestScore: '618/900', improvement: 24, predicted: 'AFA Hyderabad — Air Force (AIR ~1,200)', status: 'improving' },
      { name: 'Rohit Meena', mockScores: ['464', '488', '512', '542', '584'], latestScore: '584/900', improvement: 22, predicted: 'OTA Chennai — Army (AIR ~2,500)', status: 'improving' },
      { name: 'Kunal Bhatt', mockScores: ['432', '456', '478', '502', '548'], latestScore: '548/900', improvement: 18, predicted: 'Borderline — SSB prep critical', status: 'at_risk' },
    ]
  },
]

const statusLabel: Record<string, { text: string; cls: string }> = {
  on_track: { text: 'On Track', cls: 'bg-emerald-50 text-emerald-700' },
  improving: { text: 'Improving', cls: 'bg-amber-50 text-amber-700' },
  at_risk: { text: 'At Risk', cls: 'bg-red-50 text-red-600' },
}

export default function StudentPerformancePage() {
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Student Performance</h1>
        <p className="text-sm text-gray-500 mt-1">Batch-wise analytics, improvement tracking, and predicted outcomes</p>
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
        <div className="px-4 py-3 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Batch-wise Performance Overview</h2>
          <p className="text-xs text-gray-500 mt-0.5">Click a batch to see top 5 students with mock score progression</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider w-8"></th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Batch</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Students</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Avg Score</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Improvement</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Top Scorer</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">At Risk</th>
              </tr>
            </thead>
            <tbody>
              {batches.map(batch => {
                const trend = trendBadge(batch.improvement)
                const TrendIcon = trend.icon
                const isExpanded = expandedId === batch.id

                return (
                  <Fragment key={batch.id}>
                    <tr
                      className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : batch.id)}
                    >
                      <td className="px-4 py-3.5">
                        <ChevronRight className={`w-4 h-4 text-gray-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${examBadge[batch.exam]}`}>{batch.exam}</span>
                          <span className="font-medium text-gray-900">{batch.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-gray-600">
                        <div className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-gray-400" />
                          {batch.students}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="font-medium text-gray-900">{batch.avgScore}</div>
                        <div className="text-xs text-gray-400">{batch.avgPercent}%</div>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`flex items-center gap-0.5 text-sm font-semibold ${trend.cls}`}>
                          <TrendIcon className="w-4 h-4" />
                          {trend.label}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1">
                          <Award className="w-3.5 h-3.5 text-amber-500" />
                          <span className="text-gray-900 font-medium">{batch.topScorer}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        {batch.atRisk > 0 ? (
                          <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-red-50 text-red-600">
                            {batch.atRisk} students
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">None</span>
                        )}
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr>
                        <td colSpan={7} className="px-0 py-0">
                          <div className="bg-gray-50/80 px-8 py-4 border-b border-gray-100">
                            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Top 5 Students — Mock Score Progression</div>
                            <div className="space-y-2.5">
                              {batch.topStudents.map((student, idx) => {
                                const st = statusLabel[student.status]
                                return (
                                  <div key={student.name} className="bg-white rounded-xl border border-gray-100 p-3 flex items-center gap-4">
                                    <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 flex items-center justify-center text-xs font-bold flex-shrink-0">
                                      {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-sm text-gray-900">{student.name}</span>
                                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${st.cls}`}>{st.text}</span>
                                      </div>
                                      <div className="text-xs text-gray-500">{student.predicted}</div>
                                    </div>
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                      <div className="flex items-center gap-1">
                                        {student.mockScores.map((score, i) => (
                                          <div
                                            key={i}
                                            className="w-8 h-8 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center text-[10px] font-medium text-gray-600"
                                            title={`Mock ${i + 1}`}
                                          >
                                            {score}
                                          </div>
                                        ))}
                                      </div>
                                      <div className="text-xs font-bold text-emerald-600 ml-2">+{student.improvement}%</div>
                                    </div>
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
