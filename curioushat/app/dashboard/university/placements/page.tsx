'use client'
import { Briefcase, TrendingUp, IndianRupee, Building2 } from 'lucide-react'

const placements = [
  { college: 'Kakatiya College of Engineering', code: 'KCE', placed: 485, total: 620, avgPackage: 6.8, highest: 28.5, topRecruiter: 'TCS', placementPct: 78.2 },
  { college: 'Vasavi College of Engineering', code: 'VCE', placed: 380, total: 440, avgPackage: 8.2, highest: 42.0, topRecruiter: 'Infosys', placementPct: 86.4 },
  { college: 'Chaitanya Bharathi Institute of Technology', code: 'CBIT', placed: 520, total: 680, avgPackage: 7.5, highest: 36.0, topRecruiter: 'Wipro', placementPct: 76.5 },
  { college: 'Srinivasa Institute of Technology', code: 'SIT', placed: 310, total: 520, avgPackage: 5.4, highest: 18.0, topRecruiter: 'HCLTech', placementPct: 59.6 },
  { college: 'Malla Reddy Engineering College', code: 'MREC', placed: 580, total: 840, avgPackage: 5.8, highest: 22.0, topRecruiter: 'Cognizant', placementPct: 69.0 },
  { college: 'Sri Vidya College of Engineering', code: 'SVCE', placed: 145, total: 280, avgPackage: 4.2, highest: 12.0, topRecruiter: 'Tech Mahindra', placementPct: 51.8 },
]

const totalPlaced = placements.reduce((s, p) => s + p.placed, 0)
const totalStudents = placements.reduce((s, p) => s + p.total, 0)
const overallAvgPackage = (placements.reduce((s, p) => s + p.avgPackage, 0) / placements.length).toFixed(1)
const highestPackage = Math.max(...placements.map(p => p.highest))

export default function PlacementsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Briefcase className="w-7 h-7 text-violet-600" /> University Placement Tracker
        </h1>
        <p className="text-gray-500 mt-1 text-sm">Placement statistics across all affiliated colleges - AY 2025-26</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
          <div className="flex items-center gap-2 text-violet-600 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-xs font-medium">Total Placed</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{totalPlaced.toLocaleString('en-IN')}</p>
          <p className="text-xs text-gray-400 mt-0.5">of {totalStudents.toLocaleString('en-IN')} eligible</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <IndianRupee className="w-4 h-4" />
            <span className="text-xs font-medium">Avg Package</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{overallAvgPackage} LPA</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <IndianRupee className="w-4 h-4" />
            <span className="text-xs font-medium">Highest Package</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{highestPackage} LPA</p>
        </div>
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Building2 className="w-4 h-4" />
            <span className="text-xs font-medium">Top Recruiter</span>
          </div>
          <p className="text-2xl font-black text-gray-900">TCS</p>
          <p className="text-xs text-gray-400 mt-0.5">186 offers across colleges</p>
        </div>
      </div>

      {/* Placement Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="text-left py-3 px-4 font-semibold text-gray-500 text-xs">College</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Students Placed</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Placement %</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Avg Package</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Highest Package</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-500 text-xs">Top Recruiter</th>
              </tr>
            </thead>
            <tbody>
              {placements.map((p, i) => (
                <tr key={p.code} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-semibold text-gray-900">{p.college}</p>
                      <p className="text-xs text-gray-400">{p.code}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-bold text-gray-900">{p.placed}</span>
                    <span className="text-gray-400">/{p.total}</span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      p.placementPct >= 80 ? 'bg-emerald-100 text-emerald-700' :
                      p.placementPct >= 65 ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {p.placementPct}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-violet-600">{p.avgPackage} LPA</td>
                  <td className="py-3 px-4 text-center font-bold text-emerald-600">{p.highest} LPA</td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-violet-100 text-violet-700">{p.topRecruiter}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-violet-50/50 border-t border-violet-100">
                <td className="py-3 px-4 font-bold text-gray-900">University Total</td>
                <td className="py-3 px-4 text-center font-black text-gray-900">{totalPlaced}/{totalStudents}</td>
                <td className="py-3 px-4 text-center font-bold text-violet-600">{((totalPlaced / totalStudents) * 100).toFixed(1)}%</td>
                <td className="py-3 px-4 text-center font-bold text-violet-600">{overallAvgPackage} LPA</td>
                <td className="py-3 px-4 text-center font-bold text-emerald-600">{highestPackage} LPA</td>
                <td className="py-3 px-4 text-center text-xs text-gray-500">-</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}
