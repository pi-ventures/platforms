import Link from 'next/link'
import { Brain, FileText, BarChart3, Calendar, TrendingUp, Award, Clock, CheckCircle2, ArrowRight } from 'lucide-react'

const stats = [
  { label: 'Average Score', value: '82%', change: '+4%', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Attendance', value: '94%', change: '+1%', icon: CheckCircle2, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'AI Queries Today', value: '12', change: '', icon: Brain, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Rank in Class', value: '#5', change: '↑2', icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
]

const recentGrades = [
  { subject: 'Mathematics', exam: 'Unit Test 3', marks: 38, total: 40, grade: 'A+' },
  { subject: 'Physics', exam: 'Chapter Quiz', marks: 22, total: 25, grade: 'A' },
  { subject: 'Chemistry', exam: 'Lab Assessment', marks: 17, total: 20, grade: 'A' },
  { subject: 'English', exam: 'Essay Writing', marks: 28, total: 30, grade: 'A-' },
]

const upcomingExams = [
  { subject: 'Biology', date: 'Mar 8', topic: 'Cell Division', days: 5 },
  { subject: 'History', date: 'Mar 12', topic: 'Modern India', days: 9 },
  { subject: 'Mathematics', date: 'Mar 15', topic: 'Calculus', days: 12 },
]

const quickActions = [
  { label: 'Ask AI Tutor', desc: 'Get instant help on any question', href: '/dashboard/student/ai-tutor', icon: Brain, color: 'from-purple-600 to-indigo-600' },
  { label: 'View Exams', desc: 'Check upcoming tests and results', href: '/dashboard/student/exams', icon: FileText, color: 'from-blue-600 to-teal-600' },
  { label: 'My Grades', desc: 'Track your academic performance', href: '/dashboard/student/grades', icon: BarChart3, color: 'from-orange-500 to-amber-500' },
  { label: 'Timetable', desc: 'View your class schedule', href: '/dashboard/student/timetable', icon: Calendar, color: 'from-teal-600 to-emerald-600' },
]

export default function StudentDashboard() {
  return (
    <div>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Good morning, Om! 👋</h1>
        <p className="text-gray-500 mt-1">Class 10-A | Roll No. 15 | Session 2025–26</p>
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
            {s.change && <div className="text-xs text-emerald-600 font-medium mt-1">{s.change} this month</div>}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(qa => (
            <Link key={qa.label} href={qa.href} className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className={`w-10 h-10 bg-gradient-to-br ${qa.color} rounded-xl flex items-center justify-center mb-3`}>
                <qa.icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-gray-900 text-sm mb-1">{qa.label}</div>
              <div className="text-xs text-gray-500">{qa.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Grades */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Grades</h2>
            <Link href="/dashboard/student/grades" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {recentGrades.map(g => (
              <div key={g.exam} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{g.subject}</p>
                  <p className="text-xs text-gray-500">{g.exam}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">{g.marks}/{g.total}</p>
                  <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">{g.grade}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Exams */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Upcoming Exams</h2>
            <Link href="/dashboard/student/exams" className="text-xs text-indigo-600 hover:underline flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="space-y-3">
            {upcomingExams.map(e => (
              <div key={e.subject} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                    <span className="text-xs font-bold text-indigo-600">{e.date}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{e.subject}</p>
                    <p className="text-xs text-gray-500">{e.topic}</p>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${e.days <= 5 ? 'bg-red-100 text-red-600' : e.days <= 10 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                  {e.days}d left
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
