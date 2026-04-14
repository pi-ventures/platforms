'use client'
import { useState } from 'react'
import { Users, Search } from 'lucide-react'

const students = [
  { roll: 'CS2024001', name: 'Aarav Sharma', department: 'Computer Science', year: '3rd Year', cgpa: 8.7, attendance: 92, status: 'active' },
  { roll: 'ME2024012', name: 'Diya Patel', department: 'Mechanical Engg.', year: '2nd Year', cgpa: 8.1, attendance: 88, status: 'active' },
  { roll: 'EC2024005', name: 'Rohan Reddy', department: 'Electronics & Comm.', year: '4th Year', cgpa: 9.3, attendance: 95, status: 'active' },
  { roll: 'CS2024018', name: 'Sneha Iyer', department: 'Computer Science', year: '1st Year', cgpa: 5.4, attendance: 62, status: 'detained' },
  { roll: 'CE2024009', name: 'Vikram Singh', department: 'Civil Engg.', year: '3rd Year', cgpa: 7.2, attendance: 81, status: 'active' },
  { roll: 'CS2024003', name: 'Priya Nair', department: 'Computer Science', year: '4th Year', cgpa: 9.0, attendance: 94, status: 'graduated' },
  { roll: 'ME2024021', name: 'Arjun Mehta', department: 'Mechanical Engg.', year: '2nd Year', cgpa: 7.6, attendance: 85, status: 'active' },
  { roll: 'EC2024015', name: 'Kavya Gupta', department: 'Electronics & Comm.', year: '1st Year', cgpa: 6.8, attendance: 78, status: 'active' },
  { roll: 'CE2024004', name: 'Aditya Joshi', department: 'Civil Engg.', year: '4th Year', cgpa: 8.4, attendance: 90, status: 'graduated' },
  { roll: 'CS2024025', name: 'Meera Krishnan', department: 'Computer Science', year: '2nd Year', cgpa: 8.9, attendance: 96, status: 'active' },
]

const departments = ['All Departments', 'Computer Science', 'Mechanical Engg.', 'Electronics & Comm.', 'Civil Engg.']

export default function StudentsPage() {
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('All Departments')

  const filtered = students.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.toLowerCase().includes(search.toLowerCase())
    const matchDept = deptFilter === 'All Departments' || s.department === deptFilter
    return matchSearch && matchDept
  })

  const active = students.filter(s => s.status === 'active').length
  const detained = students.filter(s => s.status === 'detained').length
  const graduated = students.filter(s => s.status === 'graduated').length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Users className="w-7 h-7 text-indigo-600" /> Student Directory
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Enrolled student records and academic tracking</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100">
          <p className="text-xs font-medium text-indigo-600 mb-1">Active</p>
          <p className="text-2xl font-black text-gray-900">{active}</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <p className="text-xs font-medium text-amber-600 mb-1">Detained</p>
          <p className="text-2xl font-black text-gray-900">{detained}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <p className="text-xs font-medium text-emerald-600 mb-1">Graduated</p>
          <p className="text-2xl font-black text-gray-900">{graduated}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or roll number..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs">Roll No</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs">Name</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs">Department</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs">Year</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">CGPA</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Attendance</th>
              <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.roll} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                <td className="py-3 px-4 font-mono text-xs text-gray-500">{s.roll}</td>
                <td className="py-3 px-4 font-semibold text-gray-900">{s.name}</td>
                <td className="py-3 px-4 text-gray-600">{s.department}</td>
                <td className="py-3 px-4 text-gray-600">{s.year}</td>
                <td className="py-3 px-4 text-center font-bold text-indigo-600">{s.cgpa}</td>
                <td className="py-3 px-4 text-center">
                  <span className={`font-semibold ${s.attendance >= 85 ? 'text-emerald-600' : s.attendance >= 75 ? 'text-amber-600' : 'text-red-600'}`}>
                    {s.attendance}%
                  </span>
                </td>
                <td className="py-3 px-4 text-center">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    s.status === 'active' ? 'bg-emerald-100 text-emerald-700' :
                    s.status === 'detained' ? 'bg-red-100 text-red-700' :
                    'bg-indigo-100 text-indigo-700'
                  }`}>
                    {s.status === 'active' ? 'Active' : s.status === 'detained' ? 'Detained' : 'Graduated'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="py-12 text-center text-gray-400 text-sm">No students found matching your filters.</div>
        )}
      </div>
    </div>
  )
}
