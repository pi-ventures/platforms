import Link from 'next/link'
import { TrendingUp, DollarSign, CheckCircle2, Bell, ArrowRight, AlertCircle, Award } from 'lucide-react'

const stats = [
  { label: "Om's Avg Score", value: '82%', sub: 'Class 10-A', icon: TrendingUp, bg: 'bg-orange-50', color: 'text-orange-600' },
  { label: 'Attendance', value: '94%', sub: 'This term', icon: CheckCircle2, bg: 'bg-emerald-50', color: 'text-emerald-600' },
  { label: 'Fees Due', value: '₹0', sub: 'All paid', icon: DollarSign, bg: 'bg-blue-50', color: 'text-blue-600' },
  { label: 'Class Rank', value: '#5', sub: 'Top 15%', icon: Award, bg: 'bg-purple-50', color: 'text-purple-600' },
]

const recentGrades = [
  { subject: 'Mathematics', exam: 'Unit Test 3', marks: '38/40', grade: 'A+', date: 'Feb 28' },
  { subject: 'Physics', exam: 'Chapter Quiz', marks: '22/25', grade: 'A', date: 'Feb 25' },
  { subject: 'Chemistry', exam: 'Lab Assessment', marks: '17/20', grade: 'A', date: 'Feb 22' },
]

const announcements = [
  { title: 'Annual Sports Day — Mar 15', desc: 'All students must report by 7:30 AM in house colours.', time: '2h ago', priority: 'high' },
  { title: 'Parent-Teacher Meeting', desc: 'Scheduled for March 20. Online booking opens March 10.', time: '1d ago', priority: 'medium' },
  { title: 'Fee reminder: March installment due', desc: 'Last date: March 15. Pay online via portal.', time: '2d ago', priority: 'low' },
]

export default function ParentDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Hello, Mr. Raghuvanshi 👋</h1>
        <p className="text-gray-500 mt-1">Tracking <span className="font-semibold text-orange-600">Om Aditya Raghuvanshi</span> — Class 10-A, Roll No. 15</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon className={`w-5 h-5 ${s.color}`} />
            </div>
            <div className="text-2xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Grades</h2>
            <Link href="/dashboard/parent/progress" className="text-xs text-orange-600 hover:underline flex items-center gap-1">Full Report <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {recentGrades.map(g => (
              <div key={g.exam} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{g.subject}</p>
                  <p className="text-xs text-gray-400">{g.exam} · {g.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{g.marks}</p>
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">{g.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">School Announcements</h2>
            <Link href="/dashboard/parent/announcements" className="text-xs text-orange-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {announcements.map(a => (
              <div key={a.title} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${a.priority === 'high' ? 'text-red-500' : a.priority === 'medium' ? 'text-amber-500' : 'text-gray-300'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{a.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{a.desc}</p>
                  <p className="text-xs text-gray-400 mt-1">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
