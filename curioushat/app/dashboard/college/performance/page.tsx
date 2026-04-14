'use client'
import { useState } from 'react'
import {
  TrendingUp, TrendingDown, Award, GraduationCap, BarChart3,
  Users, ArrowUpRight, ArrowDownRight, Minus
} from 'lucide-react'

interface DepartmentPerformance {
  department: string
  students: number
  avgCGPA: number
  passPercent: number
  distinctionPercent: number
  trend: 'up' | 'down' | 'stable'
  trendValue: string
}

const deptPerformance: DepartmentPerformance[] = [
  { department: 'Computer Science', students: 480, avgCGPA: 8.2, passPercent: 96.5, distinctionPercent: 28.3, trend: 'up', trendValue: '+0.3' },
  { department: 'Business Administration', students: 320, avgCGPA: 7.8, passPercent: 94.1, distinctionPercent: 19.7, trend: 'up', trendValue: '+0.2' },
  { department: 'Physics', students: 210, avgCGPA: 7.9, passPercent: 93.8, distinctionPercent: 22.4, trend: 'stable', trendValue: '0.0' },
  { department: 'Chemistry', students: 195, avgCGPA: 7.6, passPercent: 91.3, distinctionPercent: 17.9, trend: 'down', trendValue: '-0.1' },
  { department: 'Mathematics', students: 240, avgCGPA: 8.0, passPercent: 92.5, distinctionPercent: 25.0, trend: 'up', trendValue: '+0.4' },
  { department: 'Electronics', students: 360, avgCGPA: 7.7, passPercent: 93.1, distinctionPercent: 20.6, trend: 'up', trendValue: '+0.1' },
]

const totalStudents = deptPerformance.reduce((s, d) => s + d.students, 0)
const overallCGPA = (deptPerformance.reduce((s, d) => s + d.avgCGPA * d.students, 0) / totalStudents).toFixed(1)
const overallPassRate = (deptPerformance.reduce((s, d) => s + d.passPercent * d.students, 0) / totalStudents).toFixed(1)
const toppers = Math.round(deptPerformance.reduce((s, d) => s + (d.distinctionPercent / 100) * d.students, 0))

function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub?: string; icon: typeof Award; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-black text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
          {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  )
}

function ProgressBar({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="h-2 bg-gray-100 rounded-full overflow-hidden w-full">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}

export default function PerformancePage() {
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-2xl font-black text-gray-900 mb-2">Student Performance</h1>
      <p className="text-gray-500 text-sm mb-6">Per-department analytics, pass rates, and improvement trends</p>

      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Avg CGPA" value={overallCGPA} sub="Across all departments" icon={BarChart3} color="#4F46E5" />
        <StatCard label="Pass Rate" value={`${overallPassRate}%`} sub="Overall pass percentage" icon={GraduationCap} color="#059669" />
        <StatCard label="Toppers" value={String(toppers)} sub="Distinction holders" icon={Award} color="#B45309" />
        <StatCard label="Placement Rate" value="78.4%" sub="2025-26 batch" icon={TrendingUp} color="#7C3AED" />
      </div>

      {/* Department Performance Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-bold text-gray-900">Department-wise Performance</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Academic year 2025-26, Semester I results</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Department</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Students</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Avg CGPA</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Pass %</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Distinction %</th>
                <th className="text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {deptPerformance.map((dept) => {
                const trendIcon = dept.trend === 'up' ? ArrowUpRight : dept.trend === 'down' ? ArrowDownRight : Minus
                const TrendIcon = trendIcon
                const trendColor = dept.trend === 'up' ? 'text-emerald-600' : dept.trend === 'down' ? 'text-red-600' : 'text-gray-500'
                const trendBg = dept.trend === 'up' ? 'bg-emerald-50' : dept.trend === 'down' ? 'bg-red-50' : 'bg-gray-50'
                const cgpaColor = dept.avgCGPA >= 8.0 ? '#4F46E5' : dept.avgCGPA >= 7.5 ? '#7C3AED' : '#F59E0B'

                return (
                  <tr key={dept.department} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-gray-900">{dept.department}</p>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-sm text-gray-700 font-medium">{dept.students}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-32">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold" style={{ color: cgpaColor }}>{dept.avgCGPA}</span>
                          <span className="text-[10px] text-gray-400">/10</span>
                        </div>
                        <ProgressBar value={dept.avgCGPA} max={10} color={cgpaColor} />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-28">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-gray-900">{dept.passPercent}%</span>
                        </div>
                        <ProgressBar value={dept.passPercent} max={100} color="#059669" />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-28">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-bold text-gray-900">{dept.distinctionPercent}%</span>
                        </div>
                        <ProgressBar value={dept.distinctionPercent} max={50} color="#B45309" />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${trendBg} ${trendColor}`}>
                        <TrendIcon className="w-3 h-3" />
                        {dept.trendValue}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Note */}
      <div className="mt-6 bg-indigo-50 border border-indigo-100 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-indigo-900">Performance Insight</p>
            <p className="text-xs text-indigo-700 mt-1">
              Computer Science and Mathematics departments show the strongest upward trend this semester.
              Chemistry department CGPA dipped slightly -- remedial workshops recommended for Organic Chemistry and Spectroscopy modules.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
