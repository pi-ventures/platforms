import Link from 'next/link'
import { Award, Users, BookOpen, School, GraduationCap, CheckCircle2, ChevronRight } from 'lucide-react'

const individuals = [
  { icon: Award, title: 'Students', href: '/dashboard/student', desc: 'AI tutoring, digital library across all grades, results, timetable and more.', features: ['My Courses', 'Digital Library (All Grades)', 'AI Tutor', 'Results & Grades', 'Group Study Rooms'] },
  { icon: Users, title: 'Parents', href: '/dashboard/parent', desc: "Track your child's progress, attendance, fees and talk to teachers.", features: ['Academic Progress', 'Attendance Alerts', 'Fee Payments', 'Report Cards', 'Teacher Chat'] },
]

const institutions = [
  { icon: BookOpen, title: 'Teachers', href: '/dashboard/teacher', desc: 'Generate exams, grade automatically, manage courses and share resources with students.', features: ['Courses & Library (All Grades)', 'Exam Generator', 'OCR Grader', 'Teaching Groups', 'Question Bank'] },
  { icon: School, title: 'School Admin', href: '/dashboard/school', desc: 'Manage admissions, staff, fees, timetables and announcements from one place.', features: ['Admissions', 'Staff & HR', 'Fee Collection', 'Content Pipeline', 'Timetable'] },
]

const higherEd = [
  { icon: GraduationCap, title: 'College / Coaching / Academy', href: '/dashboard/college', desc: 'One dashboard for colleges, coaching institutes, and academies (aviation, design, film). AI admission leads, test series, batch management.', features: ['AI Admission Leads', 'Test Series & Mock Tests', 'Student Performance AI', 'Batch Management', 'Placement Tracking'] },
  { icon: School, title: 'University', href: '/dashboard/university', desc: 'Monitor all affiliated colleges, university-wide examinations, NAAC accreditation, research output, and admission pipelines.', features: ['Affiliated College Monitoring', 'Examination Intelligence', 'NAAC Compliance', 'Research & Publications', 'Admission Pipeline'] },
]

function RoleCard({ role, variant = 'default' }: { role: typeof individuals[0], variant?: 'default' | 'violet' | 'indigo' }) {
  const styles = {
    default: { card: 'bg-white border border-gray-200', iconBg: 'bg-violet-50 group-hover:bg-violet-100', iconColor: 'text-violet-600', checkColor: 'text-violet-400', linkColor: 'text-violet-600' },
    violet: { card: 'bg-violet-50 border border-violet-100', iconBg: 'bg-white border border-violet-200 group-hover:bg-violet-50', iconColor: 'text-violet-600', checkColor: 'text-violet-400', linkColor: 'text-violet-600' },
    indigo: { card: 'bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100', iconBg: 'bg-white border border-indigo-200 group-hover:bg-indigo-50', iconColor: 'text-indigo-600', checkColor: 'text-indigo-400', linkColor: 'text-indigo-600' },
  }
  const s = styles[variant]

  return (
    <Link href={role.href} className={`group ${s.card} rounded-xl p-6 hover:border-violet-300 hover:shadow-sm transition-all`}>
      <div className={`w-10 h-10 ${s.iconBg} rounded-xl flex items-center justify-center mb-4 transition-colors`}>
        <role.icon className={`w-5 h-5 ${s.iconColor}`} />
      </div>
      <h3 className="text-base font-bold text-gray-900 mb-1.5">{role.title}</h3>
      <p className="text-gray-500 mb-4 text-sm leading-relaxed">{role.desc}</p>
      <ul className="space-y-1.5 mb-5">
        {role.features.map(f => (
          <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
            <CheckCircle2 className={`w-3.5 h-3.5 ${s.checkColor} flex-shrink-0`} />
            {f}
          </li>
        ))}
      </ul>
      <span className={`flex items-center gap-1 text-sm font-semibold ${s.linkColor} group-hover:gap-2 transition-all`}>
        Explore Dashboard <ChevronRight className="w-4 h-4" />
      </span>
    </Link>
  )
}

export default function DashboardsSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">Dashboards</span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">Built for every role</h2>
        </div>

        <div className="mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-6 h-px bg-gray-200 inline-block" /> Individuals <span className="flex-1 h-px bg-gray-200 inline-block" />
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {individuals.map((role) => <RoleCard key={role.title} role={role} />)}
          </div>
        </div>

        <div className="my-6 border-t border-dashed border-gray-200" />

        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-6 h-px bg-gray-200 inline-block" /> Institutions <span className="flex-1 h-px bg-gray-200 inline-block" />
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {institutions.map((role) => <RoleCard key={role.title} role={role} variant="violet" />)}
          </div>
        </div>

        <div className="my-6 border-t border-dashed border-gray-200" />

        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-6 h-px bg-gray-200 inline-block" /> Higher Education &amp; Coaching <span className="flex-1 h-px bg-gray-200 inline-block" />
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {higherEd.map((role) => <RoleCard key={role.title} role={role} variant="indigo" />)}
          </div>
        </div>
      </div>
    </section>
  )
}
