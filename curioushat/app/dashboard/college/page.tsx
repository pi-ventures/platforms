'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Users, GraduationCap, TrendingUp, Target, FileText, Bell, ArrowRight, BarChart3, Brain, BookOpen, Clock, Sparkles, Award, Building2, Plane } from 'lucide-react'

type InstituteType = 'college' | 'coaching' | 'academy'

const INSTITUTE_TYPES: { key: InstituteType; label: string; icon: string; example: string }[] = [
  { key: 'college', label: 'College', icon: '🎓', example: 'VIT, SRM, Manipal, Christ University' },
  { key: 'coaching', label: 'Coaching Institute', icon: '📚', example: 'Allen, Aakash, FIITJEE, Unacademy Centres' },
  { key: 'academy', label: 'Academy', icon: '✈️', example: 'IGRUA, Frankfinn, NIFT, NID, Film Schools' },
]

const statsData: Record<InstituteType, { label: string; value: string; change: string; icon: typeof Users; color: string; bg: string }[]> = {
  college: [
    { label: 'Total Students', value: '4,820', change: '+340 this sem', icon: GraduationCap, color: '#7C3AED', bg: 'bg-violet-50' },
    { label: 'Admission Leads', value: '1,247', change: '+89 this week', icon: Target, color: '#059669', bg: 'bg-emerald-50' },
    { label: 'Applications', value: '682', change: '412 pending', icon: FileText, color: '#D97706', bg: 'bg-amber-50' },
    { label: 'Placement Rate', value: '87%', change: '+4% vs last yr', icon: TrendingUp, color: '#1D4ED8', bg: 'bg-blue-50' },
  ],
  coaching: [
    { label: 'Active Students', value: '2,340', change: '32 batches', icon: Users, color: '#7C3AED', bg: 'bg-violet-50' },
    { label: 'Avg Improvement', value: '+34%', change: 'across batches', icon: TrendingUp, color: '#059669', bg: 'bg-emerald-50' },
    { label: 'Tests Conducted', value: '1,820', change: '142 this month', icon: FileText, color: '#D97706', bg: 'bg-amber-50' },
    { label: 'College Leads Sent', value: '486', change: '12 partners', icon: Target, color: '#1D4ED8', bg: 'bg-blue-50' },
  ],
  academy: [
    { label: 'Enrolled Cadets', value: '680', change: '8 batches', icon: Users, color: '#7C3AED', bg: 'bg-violet-50' },
    { label: 'DGCA Pass Rate', value: '92%', change: '+3% vs last yr', icon: Award, color: '#059669', bg: 'bg-emerald-50' },
    { label: 'Flying Hours (Avg)', value: '210 hrs', change: 'per student', icon: Plane, color: '#D97706', bg: 'bg-amber-50' },
    { label: 'Airline Placements', value: '78%', change: 'within 6 months', icon: TrendingUp, color: '#1D4ED8', bg: 'bg-blue-50' },
  ],
}

const topLeads = [
  { name: 'Om Aditya Raghuvanshi', exam: 'JEE Main', score: '98.2 %ile', rank: 1842, interested: 'B.Tech CS', source: 'CuriousHat AI Prep', status: 'hot' },
  { name: 'Riya Sharma', exam: 'NEET UG', score: '645/720', rank: 2310, interested: 'MBBS', source: 'CuriousHat Mock Tests', status: 'hot' },
  { name: 'Karan Mehta', exam: 'JEE Advanced', score: '210/360', rank: 4580, interested: 'B.Tech ECE', source: 'CuriousHat AI Prep', status: 'warm' },
  { name: 'Sneha Patel', exam: 'CLAT', score: '128/150', rank: 340, interested: 'BA LLB', source: 'CuriousHat PYQs', status: 'hot' },
  { name: 'Dev Joshi', exam: 'CUET UG', score: '780/800', rank: 210, interested: 'B.A. Economics', source: 'CuriousHat AI Tutor', status: 'warm' },
  { name: 'Aisha Khan', exam: 'NIFT', score: '168/200', rank: 420, interested: 'B.Des Fashion', source: 'CuriousHat Mock Tests', status: 'warm' },
]

const batches = [
  { name: 'JEE 2027 — Dropper Batch', exam: 'JEE Main + Advanced', students: 120, avgScore: 78, topRank: 'AIR 842', nextTest: 'Tomorrow, 9 AM', color: '#4F46E5' },
  { name: 'NEET 2027 — Regular', exam: 'NEET UG', students: 180, avgScore: 72, topRank: 'AIR 1,240', nextTest: 'Sat, 10 AM', color: '#059669' },
  { name: 'JEE 2026 — Crash Course', exam: 'JEE Main', students: 85, avgScore: 65, topRank: 'AIR 3,420', nextTest: 'Today, 4 PM', color: '#0891B2' },
  { name: 'CLAT 2027 — Weekend', exam: 'CLAT', students: 45, avgScore: 81, topRank: 'AIR 128', nextTest: 'Sun, 11 AM', color: '#B45309' },
]

const aviationBatches = [
  { name: 'CPL Batch 2026-A', program: 'Commercial Pilot License', cadets: 24, flyingHrs: 180, dgcaExams: '4/5 cleared', status: 'In Flight Training', color: '#0891B2' },
  { name: 'AME Batch 2025', program: 'Aircraft Maintenance Engineering', cadets: 60, flyingHrs: 0, dgcaExams: '3/4 modules', status: 'Workshop Phase', color: '#D97706' },
  { name: 'Cabin Crew — Jan 2026', program: 'Cabin Crew Training', cadets: 45, flyingHrs: 0, dgcaExams: 'N/A', status: 'Grooming Phase', color: '#EC4899' },
  { name: 'ATC Foundation', program: 'Air Traffic Control', cadets: 18, flyingHrs: 0, dgcaExams: '2/3 papers', status: 'Simulation Training', color: '#7C3AED' },
]

const admissionFunnel = [
  { stage: 'CuriousHat Students (Exam Results)', count: 52400 },
  { stage: 'AI-Matched Leads (Score + Interest)', count: 1247 },
  { stage: 'Application Started', count: 682 },
  { stage: 'Under Review', count: 412 },
  { stage: 'Offer Sent', count: 186 },
  { stage: 'Enrolled', count: 142 },
]

const collegePartners = [
  { name: 'VIT Vellore', leads: 42, conversion: '18%' },
  { name: 'BITS Pilani', leads: 28, conversion: '12%' },
  { name: 'Symbiosis Pune', leads: 35, conversion: '22%' },
  { name: 'NMIMS Mumbai', leads: 24, conversion: '15%' },
]

export default function CollegeDashboard() {
  const [instType, setInstType] = useState<InstituteType>('college')
  const stats = statsData[instType]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-gray-900">Institute Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Manage admissions, leads, student performance, and placements — all from one place</p>
      </div>

      {/* Institute type selector */}
      <div className="flex gap-2 flex-wrap">
        {INSTITUTE_TYPES.map(t => (
          <button key={t.key} onClick={() => setInstType(t.key)}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all text-left ${
              instType === t.key
                ? 'border-violet-500 bg-violet-50 shadow-sm'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}>
            <span className="text-2xl">{t.icon}</span>
            <div>
              <p className={`text-sm font-bold ${instType === t.key ? 'text-violet-700' : 'text-gray-900'}`}>{t.label}</p>
              <p className="text-[10px] text-gray-400">{t.example}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} border border-gray-100 rounded-xl p-4`}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                <s.icon className="w-5 h-5" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{s.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══ COLLEGE VIEW ═══ */}
      {instType === 'college' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Funnel */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="w-4 h-4 text-violet-600" />
              <h2 className="font-bold text-gray-900 text-sm">Admission Funnel</h2>
            </div>
            <div className="space-y-2">
              {admissionFunnel.map((s, i) => (
                <div key={s.stage}>
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-[10px] text-gray-500 truncate flex-1">{s.stage}</p>
                    <p className="text-xs font-bold text-gray-900 ml-2">{s.count.toLocaleString()}</p>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500" style={{ width: `${Math.max(s.count / admissionFunnel[0].count * 100, 5)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Leads */}
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2"><Target className="w-4 h-4 text-emerald-600" /> Top Admission Leads</h2>
              <Link href="/dashboard/college/leads" className="text-xs text-violet-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <th className="pb-2 text-left font-semibold">Student</th>
                    <th className="pb-2 text-left font-semibold">Exam</th>
                    <th className="pb-2 text-left font-semibold">Score</th>
                    <th className="pb-2 text-left font-semibold hidden md:table-cell">Interest</th>
                    <th className="pb-2 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topLeads.map(l => (
                    <tr key={l.name} className="hover:bg-gray-50">
                      <td className="py-2.5"><p className="font-semibold text-gray-900 text-xs">{l.name}</p><p className="text-[10px] text-gray-400">Rank #{l.rank}</p></td>
                      <td className="py-2.5 text-xs text-gray-600">{l.exam}</td>
                      <td className="py-2.5 text-xs font-bold text-gray-900">{l.score}</td>
                      <td className="py-2.5 text-xs text-gray-600 hidden md:table-cell">{l.interested}</td>
                      <td className="py-2.5">
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${l.status === 'hot' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                          {l.status === 'hot' ? '🔥 Hot' : '🟡 Warm'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ═══ COACHING VIEW ═══ */}
      {instType === 'coaching' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-4"><Users className="w-4 h-4 text-violet-600" /> Active Batches</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {batches.map(b => (
                <div key={b.name} className="border border-gray-100 rounded-xl p-3.5 hover:border-violet-200 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-8 rounded-full" style={{ backgroundColor: b.color }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{b.name}</p>
                      <p className="text-[10px] text-gray-400">{b.exam}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div><p className="text-sm font-black text-gray-900">{b.students}</p><p className="text-[9px] text-gray-400">Students</p></div>
                    <div><p className="text-sm font-black" style={{ color: b.avgScore >= 75 ? '#059669' : '#D97706' }}>{b.avgScore}%</p><p className="text-[9px] text-gray-400">Avg Score</p></div>
                    <div><p className="text-sm font-black text-gray-900">{b.topRank}</p><p className="text-[9px] text-gray-400">Best Rank</p></div>
                  </div>
                  <div className="mt-2 flex items-center gap-1 text-[10px] text-violet-600 bg-violet-50 px-2 py-1 rounded-md">
                    <Clock className="w-2.5 h-2.5" /> Next test: {b.nextTest}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-emerald-600" /> College Partners</h2>
            <div className="space-y-2">
              {collegePartners.map(c => (
                <div key={c.name} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50">
                  <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-xs font-bold text-indigo-600 flex-shrink-0">
                    {c.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 truncate">{c.name}</p>
                    <p className="text-[10px] text-gray-400">{c.leads} leads · {c.conversion} conversion</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[9px] text-gray-400 mt-3 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-violet-500" /> Leads auto-sent when students hit score thresholds
            </p>
          </div>
        </div>
      )}

      {/* ═══ ACADEMY VIEW (Aviation / Design / Film etc) ═══ */}
      {instType === 'academy' && (
        <>
          <div className="bg-gradient-to-r from-sky-50 to-blue-50 border border-sky-200 rounded-xl p-5 mb-2">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-sky-600 rounded-xl flex items-center justify-center text-xl">✈️</div>
              <div>
                <h2 className="font-black text-gray-900">Aviation & Specialized Academies</h2>
                <p className="text-xs text-gray-500">DGCA-approved flight training, AME, cabin crew, ATC, design schools, film institutes</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['DGCA Approved', 'IGRUA Affiliated', 'EASA Compliant', 'ICAO Standards', 'NIFT Partner', 'NID Partner'].map(t => (
                <span key={t} className="text-[9px] bg-white text-sky-700 border border-sky-200 px-2 py-0.5 rounded-full font-medium">{t}</span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-4"><Plane className="w-4 h-4 text-sky-600" /> Active Programs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {aviationBatches.map(b => (
                  <div key={b.name} className="border border-gray-100 rounded-xl p-3.5 hover:border-sky-200 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-8 rounded-full" style={{ backgroundColor: b.color }} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-900 truncate">{b.name}</p>
                        <p className="text-[10px] text-gray-400">{b.program}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div><p className="text-sm font-black text-gray-900">{b.cadets}</p><p className="text-[9px] text-gray-400">Cadets</p></div>
                      <div><p className="text-sm font-black text-sky-600">{b.flyingHrs > 0 ? `${b.flyingHrs}h` : '—'}</p><p className="text-[9px] text-gray-400">Flying Hrs</p></div>
                      <div><p className="text-sm font-black text-gray-900">{b.dgcaExams}</p><p className="text-[9px] text-gray-400">DGCA Exams</p></div>
                    </div>
                    <div className="mt-2 text-[10px] text-sky-700 bg-sky-50 px-2 py-1 rounded-md font-medium">{b.status}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Admission leads for academy */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2 mb-4"><Target className="w-4 h-4 text-emerald-600" /> Student Leads</h2>
              <div className="space-y-3">
                {[
                  { name: 'Rohan Das', interest: 'CPL (Pilot)', score: 'Class XII: 88%', status: 'hot' },
                  { name: 'Priya Singh', interest: 'Cabin Crew', score: 'Graduation: 74%', status: 'warm' },
                  { name: 'Sameer Ali', interest: 'AME', score: 'Class XII PCM: 82%', status: 'hot' },
                  { name: 'Neha Reddy', interest: 'ATC', score: 'B.Sc Physics: 78%', status: 'warm' },
                ].map(l => (
                  <div key={l.name} className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 bg-sky-50 rounded-lg flex items-center justify-center text-xs font-bold text-sky-600 flex-shrink-0">
                      {l.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-gray-900">{l.name}</p>
                      <p className="text-[10px] text-gray-400">{l.interest} · {l.score}</p>
                    </div>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${l.status === 'hot' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                      {l.status === 'hot' ? '🔥' : '🟡'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* How leads work — shared */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-violet-600" />
          <h3 className="font-bold text-gray-900 text-sm">How CuriousHat Connects Students to Your Institute</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { step: '1', title: 'Students Prep on CuriousHat', desc: 'AI tutoring, mock tests, entrance exam prep across 27+ exams' },
            { step: '2', title: 'Results & Profiles Built', desc: 'Exam scores, board results, and interests auto-populate student profiles' },
            { step: '3', title: 'AI Matches to Your Institute', desc: 'Score, rank, location, interest, and cutoff history used for matching' },
            { step: '4', title: 'You Get Qualified Leads', desc: 'Pre-qualified, intent-verified leads with full academic profiles — no cold calling' },
          ].map(s => (
            <div key={s.step} className="flex gap-3">
              <div className="w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{s.step}</div>
              <div>
                <p className="text-xs font-bold text-gray-900">{s.title}</p>
                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
