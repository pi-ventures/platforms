'use client'
import { useState } from 'react'
import {
  Cpu, Briefcase, Atom, FlaskConical, Calculator, CircuitBoard,
  Users, BookOpen, TrendingUp, GraduationCap
} from 'lucide-react'

const departments = [
  {
    name: 'Computer Science',
    code: 'CSE',
    hod: 'Dr. Ramesh Iyer',
    faculty: 18,
    students: 480,
    avgCGPA: 8.2,
    activeCourses: 24,
    icon: Cpu,
    color: '#4F46E5',
  },
  {
    name: 'Business Administration',
    code: 'BBA',
    hod: 'Dr. Sunita Agarwal',
    faculty: 12,
    students: 320,
    avgCGPA: 7.8,
    activeCourses: 18,
    icon: Briefcase,
    color: '#0891B2',
  },
  {
    name: 'Physics',
    code: 'PHY',
    hod: 'Dr. Arvind Sharma',
    faculty: 10,
    students: 210,
    avgCGPA: 7.9,
    activeCourses: 14,
    icon: Atom,
    color: '#7C3AED',
  },
  {
    name: 'Chemistry',
    code: 'CHE',
    hod: 'Dr. Kavita Reddy',
    faculty: 9,
    students: 195,
    avgCGPA: 7.6,
    activeCourses: 12,
    icon: FlaskConical,
    color: '#059669',
  },
  {
    name: 'Mathematics',
    code: 'MAT',
    hod: 'Dr. Suresh Pillai',
    faculty: 11,
    students: 240,
    avgCGPA: 8.0,
    activeCourses: 16,
    icon: Calculator,
    color: '#B45309',
  },
  {
    name: 'Electronics',
    code: 'ECE',
    hod: 'Dr. Meena Kulkarni',
    faculty: 14,
    students: 360,
    avgCGPA: 7.7,
    activeCourses: 20,
    icon: CircuitBoard,
    color: '#DC2626',
  },
]

const totalFaculty = departments.reduce((s, d) => s + d.faculty, 0)
const totalStudents = departments.reduce((s, d) => s + d.students, 0)
const avgCGPA = (departments.reduce((s, d) => s + d.avgCGPA, 0) / departments.length).toFixed(1)
const totalCourses = departments.reduce((s, d) => s + d.activeCourses, 0)

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: typeof Users; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-black text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  )
}

export default function DepartmentsPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 mb-2">Departments</h1>
      <p className="text-gray-500 text-sm mb-6">Manage departments, courses, and faculty allocation</p>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Departments" value="6" icon={GraduationCap} color="#4F46E5" />
        <StatCard label="Total Faculty" value={String(totalFaculty)} icon={Users} color="#7C3AED" />
        <StatCard label="Total Students" value={totalStudents.toLocaleString()} icon={Users} color="#0891B2" />
        <StatCard label="Active Courses" value={String(totalCourses)} icon={BookOpen} color="#059669" />
      </div>

      {/* Department Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {departments.map((dept) => {
          const Icon = dept.icon
          return (
            <div
              key={dept.code}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:border-indigo-200 hover:shadow-md transition-all"
            >
              {/* Header */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: dept.color + '15' }}
                >
                  <Icon className="w-5 h-5" style={{ color: dept.color }} />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{dept.name}</p>
                  <p className="text-[11px] text-gray-400">{dept.code}</p>
                </div>
              </div>

              {/* HOD */}
              <div className="mb-4 px-3 py-2 bg-gray-50 rounded-lg">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Head of Department</p>
                <p className="text-sm font-semibold text-gray-800">{dept.hod}</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] text-gray-400">Faculty</p>
                  <p className="text-lg font-black text-gray-900">{dept.faculty}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Students</p>
                  <p className="text-lg font-black text-gray-900">{dept.students}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Avg CGPA</p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-lg font-black text-gray-900">{dept.avgCGPA}</p>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400">Active Courses</p>
                  <p className="text-lg font-black text-gray-900">{dept.activeCourses}</p>
                </div>
              </div>

              {/* CGPA Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-gray-400">CGPA Performance</span>
                  <span className="text-[10px] font-semibold" style={{ color: dept.color }}>{dept.avgCGPA}/10</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${(dept.avgCGPA / 10) * 100}%`, backgroundColor: dept.color }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
