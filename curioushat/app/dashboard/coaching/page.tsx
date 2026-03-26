'use client'
import Link from 'next/link'
import { Users, GraduationCap, TrendingUp, Target, FileText, Bell, ArrowRight, BarChart3, Brain, BookOpen, Clock, Sparkles, Award } from 'lucide-react'

const stats = [
  { label: 'Active Students', value: '2,340', change: '32 batches', icon: Users, color: '#7C3AED', bg: 'bg-violet-50' },
  { label: 'Avg Score Improvement', value: '+34%', change: 'across all batches', icon: TrendingUp, color: '#059669', bg: 'bg-emerald-50' },
  { label: 'Tests Conducted', value: '1,820', change: 'this month: 142', icon: FileText, color: '#D97706', bg: 'bg-amber-50' },
  { label: 'College Leads Sent', value: '486', change: '12 partner colleges', icon: Target, color: '#1D4ED8', bg: 'bg-blue-50' },
]

const quickActions = [
  { label: 'Create Test', href: '/dashboard/coaching/tests', icon: FileText, color: 'from-violet-600 to-indigo-600' },
  { label: 'View Performance', href: '/dashboard/coaching/performance', icon: BarChart3, color: 'from-emerald-600 to-teal-600' },
  { label: 'AI Question Bank', href: '/dashboard/coaching/question-bank', icon: Brain, color: 'from-amber-500 to-orange-500' },
  { label: 'Student Leads', href: '/dashboard/coaching/leads', icon: Target, color: 'from-blue-600 to-cyan-600' },
]

const batches = [
  { name: 'JEE 2027 — Dropper Batch', exam: 'JEE Main + Advanced', students: 120, avgScore: 78, topRank: 'AIR 842', nextTest: 'Tomorrow, 9 AM', color: '#4F46E5' },
  { name: 'NEET 2027 — Regular', exam: 'NEET UG', students: 180, avgScore: 72, topRank: 'AIR 1,240', nextTest: 'Sat, 10 AM', color: '#059669' },
  { name: 'JEE 2026 — Crash Course', exam: 'JEE Main', students: 85, avgScore: 65, topRank: 'AIR 3,420', nextTest: 'Today, 4 PM', color: '#0891B2' },
  { name: 'CLAT 2027 — Weekend', exam: 'CLAT', students: 45, avgScore: 81, topRank: 'AIR 128', nextTest: 'Sun, 11 AM', color: '#B45309' },
  { name: 'CA Foundation — Nov 2026', exam: 'CA Foundation', students: 60, avgScore: 68, topRank: 'AIR 52', nextTest: 'Wed, 3 PM', color: '#B45309' },
  { name: 'NDA 2027 — Morning', exam: 'NDA', students: 40, avgScore: 74, topRank: 'AIR 310', nextTest: 'Thu, 6 AM', color: '#1D4ED8' },
]

const topPerformers = [
  { name: 'Om Aditya Raghuvanshi', batch: 'JEE 2027 Dropper', mockScore: '285/300', improvement: '+42%', predicted: 'IIT Delhi CS', status: 'on_track' },
  { name: 'Sneha Patel', batch: 'CLAT 2027', mockScore: '138/150', improvement: '+38%', predicted: 'NLSIU Bangalore', status: 'on_track' },
  { name: 'Riya Sharma', batch: 'NEET 2027', mockScore: '668/720', improvement: '+31%', predicted: 'AIIMS Delhi', status: 'on_track' },
  { name: 'Karan Mehta', batch: 'JEE 2027 Dropper', mockScore: '248/300', improvement: '+28%', predicted: 'NIT Trichy ECE', status: 'improving' },
  { name: 'Priya Nair', batch: 'CA Foundation', mockScore: '312/400', improvement: '+24%', predicted: 'Clear in 1st attempt', status: 'improving' },
]

const collegePartners = [
  { name: 'VIT Vellore', leads: 42, conversion: '18%' },
  { name: 'BITS Pilani', leads: 28, conversion: '12%' },
  { name: 'Symbiosis Pune', leads: 35, conversion: '22%' },
  { name: 'NMIMS Mumbai', leads: 24, conversion: '15%' },
  { name: 'Manipal University', leads: 38, conversion: '20%' },
  { name: 'SRM Chennai', leads: 30, conversion: '16%' },
]

const recentActivity = [
  { action: 'JEE 2027 Full Mock #14 completed — avg score 72.4% (batch best)', time: '1h ago', type: 'test' },
  { action: '42 qualified leads sent to VIT Vellore (students with >90 %ile prediction)', time: '3h ago', type: 'lead' },
  { action: 'AI generated 200 new Physics questions — Electrostatics + Optics', time: '5h ago', type: 'ai' },
  { action: 'NEET batch: 12 students crossed 600/720 threshold for first time', time: '1d ago', type: 'milestone' },
  { action: 'New batch created: CUET 2027 — 60 students enrolled', time: '2d ago', type: 'batch' },
]

export default function CoachingDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Welcome, Prof. Alok Sharma</h1>
        <p className="text-gray-500 text-sm mt-1">Sharma IIT Academy — 2,340 students across 32 batches. 486 leads sent to partner colleges this semester.</p>
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

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map(a => (
          <Link key={a.label} href={a.href} className={`bg-gradient-to-r ${a.color} text-white rounded-xl p-4 hover:opacity-90 transition-opacity flex items-center gap-3`}>
            <a.icon className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-semibold">{a.label}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Batches */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2"><Users className="w-4 h-4 text-violet-600" /> Active Batches</h2>
            <Link href="/dashboard/coaching/batches" className="text-xs text-violet-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
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
                  <div>
                    <p className="text-sm font-black text-gray-900">{b.students}</p>
                    <p className="text-[9px] text-gray-400">Students</p>
                  </div>
                  <div>
                    <p className="text-sm font-black" style={{ color: b.avgScore >= 75 ? '#059669' : b.avgScore >= 60 ? '#D97706' : '#DC2626' }}>{b.avgScore}%</p>
                    <p className="text-[9px] text-gray-400">Avg Score</p>
                  </div>
                  <div>
                    <p className="text-sm font-black text-gray-900">{b.topRank}</p>
                    <p className="text-[9px] text-gray-400">Best Rank</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-1 text-[10px] text-violet-600 bg-violet-50 px-2 py-1 rounded-md">
                  <Clock className="w-2.5 h-2.5" /> Next test: {b.nextTest}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* College Partners */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-4 h-4 text-emerald-600" />
            <h2 className="font-bold text-gray-900 text-sm">College Partners — Leads Sent</h2>
          </div>
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
                <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: c.conversion }} />
                </div>
              </div>
            ))}
          </div>
          <p className="text-[9px] text-gray-400 mt-3 flex items-center gap-1">
            <Sparkles className="w-2.5 h-2.5 text-violet-500" />
            Leads are auto-sent when students hit score thresholds matching college cutoffs
          </p>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2"><Award className="w-4 h-4 text-amber-500" /> Top Performers</h2>
          <Link href="/dashboard/coaching/performance" className="text-xs text-violet-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <th className="pb-2 text-left font-semibold">Student</th>
                <th className="pb-2 text-left font-semibold">Batch</th>
                <th className="pb-2 text-left font-semibold">Mock Score</th>
                <th className="pb-2 text-left font-semibold">Improvement</th>
                <th className="pb-2 text-left font-semibold hidden md:table-cell">AI Prediction</th>
                <th className="pb-2 text-left font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {topPerformers.map(s => (
                <tr key={s.name} className="hover:bg-gray-50">
                  <td className="py-2.5 text-xs font-semibold text-gray-900">{s.name}</td>
                  <td className="py-2.5 text-xs text-gray-600">{s.batch}</td>
                  <td className="py-2.5 text-xs font-bold text-gray-900">{s.mockScore}</td>
                  <td className="py-2.5">
                    <span className="text-xs font-bold text-emerald-600">{s.improvement}</span>
                  </td>
                  <td className="py-2.5 text-xs text-gray-600 hidden md:table-cell">{s.predicted}</td>
                  <td className="py-2.5">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${s.status === 'on_track' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {s.status === 'on_track' ? '✅ On Track' : '📈 Improving'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <h2 className="font-bold text-gray-900 text-sm mb-3">Recent Activity</h2>
        <div className="space-y-2">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-gray-50">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                a.type === 'test' ? 'bg-violet-100' : a.type === 'lead' ? 'bg-emerald-100' : a.type === 'ai' ? 'bg-amber-100' : a.type === 'milestone' ? 'bg-blue-100' : 'bg-gray-100'
              }`}>
                {a.type === 'test' ? <FileText className="w-3 h-3 text-violet-600" /> :
                 a.type === 'lead' ? <Target className="w-3 h-3 text-emerald-600" /> :
                 a.type === 'ai' ? <Brain className="w-3 h-3 text-amber-600" /> :
                 a.type === 'milestone' ? <TrendingUp className="w-3 h-3 text-blue-600" /> :
                 <Users className="w-3 h-3 text-gray-600" />}
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-700">{a.action}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue model */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <h3 className="font-bold text-gray-900 text-sm">How CuriousHat Powers Your Institute</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: '🧠', title: 'AI-Powered Test Series', desc: 'Generate board-aligned tests in seconds. AI creates questions from your syllabus, auto-grades, gives per-student analytics.' },
            { icon: '📊', title: 'Student Performance AI', desc: 'Track every student across every test. AI predicts exam scores, identifies weak topics, recommends targeted practice.' },
            { icon: '🎯', title: 'College Lead Pipeline', desc: 'When students hit score thresholds, their profiles are auto-matched to partner colleges. You earn referral revenue per admitted student.' },
          ].map(f => (
            <div key={f.title} className="bg-white rounded-xl p-4 border border-emerald-100">
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
