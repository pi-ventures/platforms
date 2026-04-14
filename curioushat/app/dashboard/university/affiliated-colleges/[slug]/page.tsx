'use client'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Building2, Users, GraduationCap, Shield, MapPin, Phone, Mail,
  BookOpen, TrendingUp, BarChart3, Award, AlertTriangle, CheckCircle2, Clock, Calendar
} from 'lucide-react'

/* ── Mock data for each college ── */
const collegeDB: Record<string, {
  name: string; city: string; principal: string; phone: string; email: string
  naac: string; naacExpiry: string; status: string; established: number
  departments: { name: string; hod: string; faculty: number; students: number; avgCGPA: number; passRate: number }[]
  students: { name: string; roll: string; dept: string; year: number; cgpa: number; attendance: number; status: string }[]
  placements: { name: string; dept: string; company: string; pkg: number; role: string }[]
  results: { exam: string; appeared: number; passed: number; distinction: number; avg: number }[]
  alerts: { msg: string; severity: string }[]
}> = {
  'university-college-of-engineering-osmania': {
    name: 'University College of Engineering, Osmania', city: 'Hyderabad', principal: 'Dr. K. Ramesh Reddy',
    phone: '040-2768 2368', email: 'principal@uceou.edu', naac: 'A++', naacExpiry: '2028-06', status: 'active', established: 1929,
    departments: [
      { name: 'Computer Science', hod: 'Dr. S. Madhavi', faculty: 18, students: 480, avgCGPA: 8.2, passRate: 94 },
      { name: 'Electrical Engineering', hod: 'Dr. R. Venkat', faculty: 15, students: 420, avgCGPA: 7.8, passRate: 91 },
      { name: 'Mechanical Engineering', hod: 'Dr. P. Srinivas', faculty: 20, students: 520, avgCGPA: 7.5, passRate: 88 },
      { name: 'Civil Engineering', hod: 'Dr. M. Lakshmi', faculty: 14, students: 380, avgCGPA: 7.6, passRate: 90 },
      { name: 'Electronics & Comm.', hod: 'Dr. A. Kumar', faculty: 16, students: 440, avgCGPA: 7.9, passRate: 92 },
      { name: 'Chemical Engineering', hod: 'Dr. V. Reddy', faculty: 10, students: 260, avgCGPA: 7.4, passRate: 87 },
    ],
    students: [
      { name: 'Aarav Sharma', roll: 'UCE2023001', dept: 'Computer Science', year: 3, cgpa: 9.1, attendance: 92, status: 'active' },
      { name: 'Priya Reddy', roll: 'UCE2023002', dept: 'Electrical Engineering', year: 3, cgpa: 8.7, attendance: 88, status: 'active' },
      { name: 'Karthik Nair', roll: 'UCE2022015', dept: 'Mechanical Engineering', year: 4, cgpa: 8.4, attendance: 85, status: 'active' },
      { name: 'Sneha Patel', roll: 'UCE2024010', dept: 'Computer Science', year: 2, cgpa: 9.3, attendance: 96, status: 'active' },
      { name: 'Rohit Kumar', roll: 'UCE2023025', dept: 'Civil Engineering', year: 3, cgpa: 7.8, attendance: 78, status: 'active' },
      { name: 'Ananya Iyer', roll: 'UCE2024030', dept: 'Electronics & Comm.', year: 2, cgpa: 8.9, attendance: 91, status: 'active' },
      { name: 'Vikram Singh', roll: 'UCE2022040', dept: 'Chemical Engineering', year: 4, cgpa: 7.2, attendance: 72, status: 'detained' },
      { name: 'Meera Joshi', roll: 'UCE2021005', dept: 'Computer Science', year: 4, cgpa: 9.5, attendance: 94, status: 'graduated' },
    ],
    placements: [
      { name: 'Meera Joshi', dept: 'Computer Science', company: 'Microsoft', pkg: 42.0, role: 'SDE-1' },
      { name: 'Aditya Rao', dept: 'Computer Science', company: 'Google', pkg: 38.0, role: 'Software Engineer' },
      { name: 'Ravi Teja', dept: 'Electronics & Comm.', company: 'Texas Instruments', pkg: 18.5, role: 'Design Engineer' },
      { name: 'Kavitha S.', dept: 'Mechanical Engineering', company: 'Tata Motors', pkg: 12.0, role: 'Graduate Trainee' },
      { name: 'Suresh B.', dept: 'Electrical Engineering', company: 'ABB India', pkg: 14.0, role: 'Project Engineer' },
      { name: 'Divya K.', dept: 'Civil Engineering', company: 'L&T Construction', pkg: 10.5, role: 'Site Engineer' },
    ],
    results: [
      { exam: 'Sem 1 (Oct 2025)', appeared: 1200, passed: 1104, distinction: 186, avg: 72.4 },
      { exam: 'Sem 2 (Mar 2026)', appeared: 1180, passed: 1096, distinction: 201, avg: 74.1 },
      { exam: 'Sem 3 (Oct 2025)', appeared: 1050, passed: 945, distinction: 142, avg: 70.8 },
    ],
    alerts: [
      { msg: 'Chemical Engineering pass rate (87%) approaching 85% threshold', severity: 'medium' },
      { msg: '2 faculty positions unfilled in Mechanical Engineering for 4+ months', severity: 'medium' },
    ],
  },
  'nizam-college-autonomous': {
    name: 'Nizam College (Autonomous)', city: 'Hyderabad', principal: 'Dr. P. Sujatha Devi',
    phone: '040-2461 2345', email: 'principal@nizamcollege.edu', naac: 'A+', naacExpiry: '2027-09', status: 'active', established: 1887,
    departments: [
      { name: 'English', hod: 'Dr. F. Begum', faculty: 12, students: 380, avgCGPA: 7.8, passRate: 93 },
      { name: 'Commerce', hod: 'Dr. S. Rao', faculty: 14, students: 520, avgCGPA: 8.0, passRate: 95 },
      { name: 'Physics', hod: 'Dr. M. Prasad', faculty: 10, students: 280, avgCGPA: 7.6, passRate: 89 },
      { name: 'Chemistry', hod: 'Dr. R. Devi', faculty: 9, students: 260, avgCGPA: 7.4, passRate: 88 },
      { name: 'Mathematics', hod: 'Dr. K. Naidu', faculty: 11, students: 300, avgCGPA: 7.9, passRate: 91 },
      { name: 'Computer Science', hod: 'Dr. V. Yadav', faculty: 8, students: 340, avgCGPA: 8.3, passRate: 94 },
    ],
    students: [
      { name: 'Fatima Khan', roll: 'NC2023001', dept: 'Commerce', year: 3, cgpa: 8.8, attendance: 90, status: 'active' },
      { name: 'Rahul Verma', roll: 'NC2024010', dept: 'Physics', year: 2, cgpa: 8.1, attendance: 85, status: 'active' },
      { name: 'Lakshmi Devi', roll: 'NC2023020', dept: 'English', year: 3, cgpa: 9.0, attendance: 93, status: 'active' },
      { name: 'Arun Kumar', roll: 'NC2022005', dept: 'Computer Science', year: 4, cgpa: 8.5, attendance: 88, status: 'active' },
      { name: 'Sameera B.', roll: 'NC2024015', dept: 'Mathematics', year: 2, cgpa: 7.9, attendance: 82, status: 'active' },
      { name: 'Venkat R.', roll: 'NC2023030', dept: 'Chemistry', year: 3, cgpa: 7.3, attendance: 74, status: 'detained' },
    ],
    placements: [
      { name: 'Arun Kumar', dept: 'Computer Science', company: 'Infosys', pkg: 8.5, role: 'Systems Engineer' },
      { name: 'Priya M.', dept: 'Commerce', company: 'Deloitte', pkg: 12.0, role: 'Analyst' },
      { name: 'Kiran S.', dept: 'Mathematics', company: 'TCS', pkg: 7.0, role: 'Data Analyst' },
    ],
    results: [
      { exam: 'Sem 1 (Oct 2025)', appeared: 1040, passed: 967, distinction: 148, avg: 71.2 },
      { exam: 'Sem 2 (Mar 2026)', appeared: 1020, passed: 959, distinction: 155, avg: 72.8 },
    ],
    alerts: [
      { msg: 'Chemistry dept attendance below 80% average this semester', severity: 'medium' },
    ],
  },
}

/* Fallback for colleges not in DB */
function generateFallback(slug: string) {
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  return {
    name, city: 'Hyderabad', principal: 'Dr. Principal', phone: '040-XXXX XXXX', email: 'info@college.edu',
    naac: 'A', naacExpiry: '2027-06', status: 'active', established: 1990,
    departments: [
      { name: 'Computer Science', hod: 'Dr. HOD', faculty: 10, students: 300, avgCGPA: 7.8, passRate: 90 },
      { name: 'Electronics', hod: 'Dr. HOD', faculty: 8, students: 250, avgCGPA: 7.5, passRate: 88 },
      { name: 'Mechanical', hod: 'Dr. HOD', faculty: 12, students: 350, avgCGPA: 7.3, passRate: 86 },
    ],
    students: [
      { name: 'Student 1', roll: 'S001', dept: 'Computer Science', year: 3, cgpa: 8.5, attendance: 90, status: 'active' },
      { name: 'Student 2', roll: 'S002', dept: 'Electronics', year: 2, cgpa: 7.8, attendance: 85, status: 'active' },
    ],
    placements: [
      { name: 'Student 1', dept: 'Computer Science', company: 'TCS', pkg: 7.0, role: 'Developer' },
    ],
    results: [
      { exam: 'Sem 1 (Oct 2025)', appeared: 800, passed: 720, distinction: 96, avg: 68.5 },
    ],
    alerts: [],
  }
}

const cgpaColor = (c: number) => c >= 8.5 ? 'text-emerald-600' : c >= 7.5 ? 'text-blue-600' : c >= 6.5 ? 'text-amber-600' : 'text-red-600'
const attendanceColor = (a: number) => a >= 85 ? 'text-emerald-600' : a >= 75 ? 'text-amber-600' : 'text-red-600'

export default function CollegeDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const college = collegeDB[slug] || generateFallback(slug)
  const [tab, setTab] = useState<'overview' | 'students' | 'placements' | 'results'>('overview')

  const totalStudents = college.departments.reduce((s, d) => s + d.students, 0)
  const totalFaculty = college.departments.reduce((s, d) => s + d.faculty, 0)
  const avgCGPA = (college.departments.reduce((s, d) => s + d.avgCGPA * d.students, 0) / totalStudents).toFixed(1)
  const avgPassRate = (college.departments.reduce((s, d) => s + d.passRate * d.students, 0) / totalStudents).toFixed(1)
  const totalPlaced = college.placements.length
  const avgPkg = college.placements.length ? (college.placements.reduce((s, p) => s + p.pkg, 0) / college.placements.length).toFixed(1) : '0'
  const highestPkg = college.placements.length ? Math.max(...college.placements.map(p => p.pkg)).toFixed(1) : '0'

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Back + Header */}
      <div>
        <Link href="/dashboard/university/affiliated-colleges" className="inline-flex items-center gap-1.5 text-sm text-violet-600 hover:text-violet-700 mb-3 font-medium">
          <ArrowLeft className="w-4 h-4" /> All Affiliated Colleges
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-black text-gray-900">{college.name}</h1>
            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 flex-wrap">
              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{college.city}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{college.phone}</span>
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{college.email}</span>
              <span className="text-xs text-gray-400">Est. {college.established}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${college.naac === 'A++' ? 'bg-emerald-100 text-emerald-700' : college.naac === 'A+' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
              NAAC {college.naac}
            </span>
            <span className={`text-xs px-3 py-1.5 rounded-full font-medium capitalize ${college.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              {college.status}
            </span>
          </div>
        </div>
      </div>

      {/* Alerts */}
      {college.alerts.length > 0 && (
        <div className="space-y-2">
          {college.alerts.map((a, i) => (
            <div key={i} className={`flex items-start gap-2 rounded-xl px-4 py-3 text-sm ${a.severity === 'high' ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              {a.msg}
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: 'Students', value: totalStudents.toLocaleString(), icon: GraduationCap, bg: 'bg-violet-50', color: 'text-violet-600' },
          { label: 'Faculty', value: totalFaculty, icon: Users, bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Departments', value: college.departments.length, icon: Building2, bg: 'bg-indigo-50', color: 'text-indigo-600' },
          { label: 'Avg CGPA', value: avgCGPA, icon: BarChart3, bg: 'bg-emerald-50', color: 'text-emerald-600' },
          { label: 'Pass Rate', value: avgPassRate + '%', icon: TrendingUp, bg: 'bg-amber-50', color: 'text-amber-600' },
          { label: 'Placed', value: totalPlaced, icon: Award, bg: 'bg-pink-50', color: 'text-pink-600' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} rounded-xl p-3 border border-gray-100`}>
            <s.icon className={`w-4 h-4 ${s.color} mb-1`} />
            <p className="text-xl font-black text-gray-900">{s.value}</p>
            <p className="text-[10px] text-gray-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
        {(['overview', 'students', 'placements', 'results'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-3">Departments</h2>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-gray-50">
                  <tr>
                    {['Department', 'HOD', 'Faculty', 'Students', 'Avg CGPA', 'Pass Rate'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {college.departments.map(d => (
                    <tr key={d.name} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-900">{d.name}</td>
                      <td className="px-4 py-3 text-gray-600 text-xs">{d.hod}</td>
                      <td className="px-4 py-3 text-gray-600">{d.faculty}</td>
                      <td className="px-4 py-3 font-semibold text-gray-900">{d.students}</td>
                      <td className={`px-4 py-3 font-bold ${cgpaColor(d.avgCGPA)}`}>{d.avgCGPA}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full max-w-[80px]">
                            <div className={`h-2 rounded-full ${d.passRate >= 90 ? 'bg-emerald-500' : d.passRate >= 80 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${d.passRate}%` }} />
                          </div>
                          <span className="text-xs font-medium text-gray-700">{d.passRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-xs text-gray-500">
              <span className="font-semibold text-gray-700">Principal:</span> {college.principal} &nbsp;|&nbsp;
              <span className="font-semibold text-gray-700">NAAC Valid Until:</span> {college.naacExpiry} &nbsp;|&nbsp;
              <span className="font-semibold text-gray-700">Student:Faculty Ratio:</span> {Math.round(totalStudents / totalFaculty)}:1
            </p>
          </div>
        </div>
      )}

      {/* Students Tab */}
      {tab === 'students' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead className="bg-gray-50">
              <tr>
                {['Roll No', 'Name', 'Department', 'Year', 'CGPA', 'Attendance', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {college.students.map(s => (
                <tr key={s.roll} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-violet-600 font-medium">{s.roll}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{s.name}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{s.dept}</td>
                  <td className="px-4 py-3 text-gray-600">Year {s.year}</td>
                  <td className={`px-4 py-3 font-bold ${cgpaColor(s.cgpa)}`}>{s.cgpa}</td>
                  <td className={`px-4 py-3 font-medium ${attendanceColor(s.attendance)}`}>{s.attendance}%</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${s.status === 'active' ? 'bg-emerald-50 text-emerald-700' : s.status === 'graduated' ? 'bg-blue-50 text-blue-700' : 'bg-red-50 text-red-700'}`}>{s.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Placements Tab */}
      {tab === 'placements' && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-emerald-50 rounded-xl p-4 border border-gray-100 text-center">
              <p className="text-2xl font-black text-gray-900">{totalPlaced}</p>
              <p className="text-xs text-gray-500">Students Placed</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-gray-100 text-center">
              <p className="text-2xl font-black text-gray-900">₹{avgPkg} LPA</p>
              <p className="text-xs text-gray-500">Avg Package</p>
            </div>
            <div className="bg-violet-50 rounded-xl p-4 border border-gray-100 text-center">
              <p className="text-2xl font-black text-gray-900">₹{highestPkg} LPA</p>
              <p className="text-xs text-gray-500">Highest Package</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  {['Student', 'Department', 'Company', 'Package', 'Role'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {college.placements.map((p, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{p.dept}</td>
                    <td className="px-4 py-3 font-semibold text-indigo-600">{p.company}</td>
                    <td className="px-4 py-3 font-bold text-emerald-600">₹{p.pkg} LPA</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{p.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Results Tab */}
      {tab === 'results' && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead className="bg-gray-50">
              <tr>
                {['Examination', 'Appeared', 'Passed', 'Distinction', 'Pass %', 'Avg Score'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {college.results.map((r, i) => {
                const passRate = ((r.passed / r.appeared) * 100).toFixed(1)
                return (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold text-gray-900">{r.exam}</td>
                    <td className="px-4 py-3 text-gray-600">{r.appeared.toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold text-emerald-600">{r.passed.toLocaleString()}</td>
                    <td className="px-4 py-3 text-indigo-600 font-medium">{r.distinction}</td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${Number(passRate) >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{passRate}%</span>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-700">{r.avg}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
