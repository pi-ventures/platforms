'use client'
import { Users, GraduationCap, UserCheck } from 'lucide-react'

const colleges = [
  { name: 'Srinivasa Institute of Technology', code: 'SIT', total: 2840, male: 1720, female: 1120, avgAttendance: 87, avgCgpa: 7.6 },
  { name: 'Kakatiya College of Engineering', code: 'KCE', total: 3150, male: 1890, female: 1260, avgAttendance: 91, avgCgpa: 8.1 },
  { name: 'Malla Reddy Engineering College', code: 'MREC', total: 4200, male: 2520, female: 1680, avgAttendance: 82, avgCgpa: 7.2 },
  { name: 'Vasavi College of Engineering', code: 'VCE', total: 2100, male: 1050, female: 1050, avgAttendance: 93, avgCgpa: 8.5 },
  { name: 'Chaitanya Bharathi Institute of Technology', code: 'CBIT', total: 3600, male: 2160, female: 1440, avgAttendance: 89, avgCgpa: 8.0 },
  { name: 'Sri Vidya College of Engineering', code: 'SVCE', total: 1450, male: 870, female: 580, avgAttendance: 78, avgCgpa: 6.9 },
]

const totalStudents = colleges.reduce((sum, c) => sum + c.total, 0)
const totalMale = colleges.reduce((sum, c) => sum + c.male, 0)
const totalFemale = colleges.reduce((sum, c) => sum + c.female, 0)
const avgCgpa = (colleges.reduce((sum, c) => sum + c.avgCgpa, 0) / colleges.length).toFixed(1)

export default function StudentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Users className="w-7 h-7 text-violet-600" /> University Student Overview
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Student records across all affiliated colleges</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
          <div className="flex items-center gap-2 text-violet-600 mb-1">
            <GraduationCap className="w-4 h-4" />
            <span className="text-xs font-medium">Total Students</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{totalStudents.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Male</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{totalMale.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-pink-50 rounded-2xl p-4 border border-pink-100">
          <div className="flex items-center gap-2 text-pink-600 mb-1">
            <Users className="w-4 h-4" />
            <span className="text-xs font-medium">Female</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{totalFemale.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <UserCheck className="w-4 h-4" />
            <span className="text-xs font-medium">Avg CGPA</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{avgCgpa}</p>
        </div>
      </div>

      {/* College-wise Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs">College</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Total Students</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Male</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Female</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Avg Attendance</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Avg CGPA</th>
              </tr>
            </thead>
            <tbody>
              {colleges.map((c, i) => (
                <tr key={c.code} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-400">{c.code}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-gray-900">{c.total.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{c.male.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-center text-gray-600">{c.female.toLocaleString('en-IN')}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`font-semibold ${c.avgAttendance >= 85 ? 'text-emerald-600' : c.avgAttendance >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                      {c.avgAttendance}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-violet-600">{c.avgCgpa}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-violet-50/50 border-t border-violet-100">
                <td className="py-3 px-4 font-bold text-gray-900">Total (6 Colleges)</td>
                <td className="py-3 px-4 text-center font-black text-gray-900">{totalStudents.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 text-center font-semibold text-gray-700">{totalMale.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 text-center font-semibold text-gray-700">{totalFemale.toLocaleString('en-IN')}</td>
                <td className="py-3 px-4 text-center font-semibold text-gray-700">{(colleges.reduce((s, c) => s + c.avgAttendance, 0) / colleges.length).toFixed(0)}%</td>
                <td className="py-3 px-4 text-center font-bold text-violet-600">{avgCgpa}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
