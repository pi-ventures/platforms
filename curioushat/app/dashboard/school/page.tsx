import Link from 'next/link'
import { Users, GraduationCap, BookOpen, DollarSign, TrendingUp, CheckCircle2, AlertCircle, ArrowRight, UserPlus, Bell, Calendar } from 'lucide-react'

const stats = [
  { label: 'Total Students', value: '1,248', change: '+42', icon: GraduationCap, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Teaching Staff', value: '78', change: '+2', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Fee Collection (Mar)', value: '₹18.4L', change: '92%', icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Avg Attendance', value: '91%', change: '+1%', icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50' },
]

const quickActions = [
  { label: 'New Admission', href: '/dashboard/school/admissions', icon: UserPlus, color: 'from-indigo-600 to-blue-600' },
  { label: 'Post Announcement', href: '/dashboard/school/announcements', icon: Bell, color: 'from-purple-600 to-pink-600' },
  { label: 'Edit Timetable', href: '/dashboard/school/timetable', icon: Calendar, color: 'from-teal-600 to-emerald-600' },
  { label: 'Fee Reports', href: '/dashboard/school/fees', icon: DollarSign, color: 'from-orange-500 to-amber-500' },
]

const recentActivities = [
  { action: '3 new admission applications received (Class 6)', time: '1h ago', type: 'admission' },
  { action: 'Fee collection: ₹1.2L collected today (47 students)', time: '2h ago', type: 'fee' },
  { action: 'Ms. Priya Gupta submitted Term 2 grades (10-A Physics)', time: '3h ago', type: 'grade' },
  { action: 'New staff joined: Mr. Suresh Kumar (Computer Science)', time: '1d ago', type: 'staff' },
  { action: 'Timetable for Term 3 published to all classes', time: '2d ago', type: 'timetable' },
]

const pendingAlerts = [
  { alert: '12 students with attendance below 75% — action required', priority: 'high' },
  { alert: '8 fee defaulters from February installment', priority: 'high' },
  { alert: '5 staff leave applications pending approval', priority: 'medium' },
  { alert: 'Mid-term report cards due for 4 classes', priority: 'medium' },
  { alert: 'Annual day programme schedule not yet finalised', priority: 'low' },
]

const classStats = [
  { class: '6', sections: 3, students: 125, teacher: 'Mr. Sharma', attendance: 93 },
  { class: '7', sections: 3, students: 132, teacher: 'Ms. Verma', attendance: 91 },
  { class: '8', sections: 4, students: 168, teacher: 'Mr. Iyer', attendance: 89 },
  { class: '9', sections: 4, students: 175, teacher: 'Ms. Khan', attendance: 92 },
  { class: '10', sections: 4, students: 180, teacher: 'Ms. Gupta', attendance: 90 },
  { class: '11', sections: 3, students: 145, teacher: 'Mr. Patel', attendance: 94 },
  { class: '12', sections: 3, students: 140, teacher: 'Dr. Singh', attendance: 93 },
]

export default function SchoolDashboard() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900">School Overview 🏫</h1>
        <p className="text-gray-500 mt-1">Bright Future International School · Session 2025–26 · March 3, 2026</p>
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
            <div className="text-xs text-emerald-600 font-medium mt-1">{s.change} this month</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map(qa => (
            <Link key={qa.label} href={qa.href} className="group bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <div className={`w-10 h-10 bg-gradient-to-br ${qa.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <qa.icon className="w-5 h-5 text-white" />
              </div>
              <div className="font-semibold text-gray-900 text-sm">{qa.label}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Pending Alerts */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-500" /> Alerts
          </h2>
          <div className="space-y-3">
            {pendingAlerts.map(a => (
              <div key={a.alert} className="flex gap-2 text-sm">
                <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${a.priority === 'high' ? 'bg-red-500' : a.priority === 'medium' ? 'bg-amber-500' : 'bg-gray-300'}`} />
                <p className="text-gray-700 text-xs leading-relaxed">{a.alert}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h2 className="font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {recentActivities.map(a => (
              <div key={a.action} className="flex gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-2 h-2 rounded-full bg-indigo-400 mt-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-700">{a.action}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Class Summary */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Class-wise Summary</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {['Class', 'Sections', 'Students', 'Class Teacher', 'Attendance', 'Status'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-xs text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {classStats.map(c => (
                <tr key={c.class} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 font-bold text-gray-900">Class {c.class}</td>
                  <td className="px-5 py-3 text-gray-600">{c.sections}</td>
                  <td className="px-5 py-3 text-gray-700 font-medium">{c.students}</td>
                  <td className="px-5 py-3 text-gray-600">{c.teacher}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${c.attendance >= 92 ? 'bg-emerald-500' : c.attendance >= 88 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${c.attendance}%` }} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">{c.attendance}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs bg-emerald-100 text-emerald-700 font-medium px-2 py-0.5 rounded-full">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
