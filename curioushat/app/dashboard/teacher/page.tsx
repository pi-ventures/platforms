import Link from 'next/link'
import { FileText, ScanLine, ClipboardList, BarChart3, Users, TrendingUp, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react'

const stats = [
  { label: 'My Students', value: '124', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Exams This Month', value: '8', icon: FileText, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Papers Graded (AI)', value: '312', icon: ScanLine, color: 'text-teal-600', bg: 'bg-teal-50' },
  { label: 'Avg Class Score', value: '74%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
]

const quickActions = [
  { label: 'Generate Exam Paper', desc: 'AI creates a complete paper in 60s', href: '/dashboard/teacher/exam-generator', icon: FileText, color: 'from-indigo-600 to-purple-600' },
  { label: 'Grade Answer Sheets', desc: 'Upload scans — AI grades instantly', href: '/dashboard/teacher/grader', icon: ScanLine, color: 'from-teal-600 to-emerald-600' },
  { label: 'Take Attendance', desc: "Today's roll call — one click", href: '/dashboard/teacher/attendance', icon: ClipboardList, color: 'from-orange-500 to-amber-500' },
  { label: 'Update Gradebook', desc: 'Enter marks and generate reports', href: '/dashboard/teacher/gradebook', icon: BarChart3, color: 'from-pink-600 to-rose-600' },
]

const recentActivity = [
  { action: 'Generated Physics Unit Test — Class 10A', time: '2h ago', type: 'exam' },
  { action: 'Graded 28 answer sheets via OCR', time: '4h ago', type: 'grade' },
  { action: 'Marked attendance for Class 10A (Mon)', time: '5h ago', type: 'attend' },
  { action: 'Added 12 questions to Question Bank', time: 'Yesterday', type: 'qbank' },
  { action: 'Posted announcement: Lab schedule changed', time: 'Yesterday', type: 'announce' },
]

const pendingItems = [
  { task: 'Grade Chemistry Unit Test papers (Class 9B)', priority: 'high', due: 'Today' },
  { task: 'Submit Term 2 marks to admin', priority: 'high', due: 'Mar 7' },
  { task: 'Generate Pre-Board Biology paper', priority: 'medium', due: 'Mar 10' },
  { task: 'Update gradebook for Class 8A', priority: 'low', due: 'Mar 12' },
]

export default function TeacherDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">Welcome, Ms. Gupta! 👋</h1>
        <p className="text-gray-500 mt-1">Physics | Classes 9A, 10A, 10B | Session 2025–26</p>
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
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">AI Tools</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(qa => (
            <Link key={qa.label} href={qa.href} className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className={`w-10 h-10 bg-gradient-to-br ${qa.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <qa.icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-gray-900 text-sm mb-1">{qa.label}</div>
              <div className="text-xs text-gray-500">{qa.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Pending Tasks</h2>
          <div className="space-y-3">
            {pendingItems.map(item => (
              <div key={item.task} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <AlertCircle className={`w-4 h-4 mt-0.5 flex-shrink-0 ${item.priority === 'high' ? 'text-red-500' : item.priority === 'medium' ? 'text-amber-500' : 'text-gray-400'}`} />
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{item.task}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Due: {item.due}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.priority === 'high' ? 'bg-red-100 text-red-600' : item.priority === 'medium' ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-500'}`}>
                  {item.priority}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivity.map(a => (
              <div key={a.action} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{a.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
