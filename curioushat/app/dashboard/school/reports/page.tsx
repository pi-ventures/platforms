'use client'
import { useState } from 'react'
import { TrendingUp, Download, FileText, Users, DollarSign, CheckCircle2, BarChart3, Loader2, Sparkles } from 'lucide-react'

const reportTypes = [
  { id: 'academic', icon: BarChart3, title: 'Academic Performance Report', desc: 'Subject-wise performance, class averages, topper lists, at-risk students', color: 'from-indigo-600 to-blue-600', bg: 'bg-indigo-50', iconColor: 'text-indigo-600' },
  { id: 'attendance', icon: CheckCircle2, title: 'Attendance Report', desc: 'Class-wise attendance rates, chronic absentees, monthly trends', color: 'from-teal-600 to-emerald-600', bg: 'bg-teal-50', iconColor: 'text-teal-600' },
  { id: 'fees', icon: DollarSign, title: 'Fee Collection Report', desc: 'Collected vs outstanding fees, defaulter list, term-wise breakdown', color: 'from-orange-500 to-amber-500', bg: 'bg-orange-50', iconColor: 'text-orange-600' },
  { id: 'staff', icon: Users, title: 'Staff Report', desc: 'Staff attendance, leave records, subject coverage, new joiners', color: 'from-purple-600 to-pink-600', bg: 'bg-purple-50', iconColor: 'text-purple-600' },
  { id: 'admissions', icon: FileText, title: 'Admissions Report', desc: 'Applications received, conversion rates, class-wise vacancies', color: 'from-blue-600 to-cyan-600', bg: 'bg-blue-50', iconColor: 'text-blue-600' },
  { id: 'ai-usage', icon: Sparkles, title: 'AI Usage Report', desc: 'AI Tutor queries, exams generated, papers graded by class and teacher', color: 'from-violet-600 to-purple-600', bg: 'bg-violet-50', iconColor: 'text-violet-600' },
]

const prebuiltReports = [
  { name: 'Term 2 Academic Summary', type: 'Academic', date: 'Mar 1, 2026', size: '2.4 MB' },
  { name: 'February Attendance Report', type: 'Attendance', date: 'Feb 28, 2026', size: '0.9 MB' },
  { name: 'Fee Collection — February', type: 'Fees', date: 'Feb 28, 2026', size: '1.1 MB' },
  { name: 'Term 1 Academic Summary', type: 'Academic', date: 'Nov 15, 2025', size: '2.1 MB' },
  { name: 'Staff Attendance — Q3', type: 'Staff', date: 'Dec 31, 2025', size: '0.5 MB' },
]

const typeColor: Record<string, string> = {
  Academic: 'bg-indigo-100 text-indigo-700',
  Attendance: 'bg-teal-100 text-teal-700',
  Fees: 'bg-orange-100 text-orange-700',
  Staff: 'bg-purple-100 text-purple-700',
  Admissions: 'bg-blue-100 text-blue-700',
}

export default function SchoolReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null)
  const [generated, setGenerated] = useState<string | null>(null)
  const [config, setConfig] = useState({ period: 'Term 2', classRange: 'All Classes', format: 'PDF' })

  const handleGenerate = async (id: string) => {
    setGenerating(id)
    await new Promise(r => setTimeout(r, 2000))
    setGenerating(null)
    setGenerated(id)
    setTimeout(() => setGenerated(null), 4000)
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <TrendingUp className="w-7 h-7 text-indigo-600" /> Reports
        </h1>
        <p className="text-gray-500 mt-1">Generate and download school-wide reports</p>
      </div>

      {/* Config bar */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-6 flex gap-4 flex-wrap items-end">
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Period</label>
          <select value={config.period} onChange={e => setConfig({ ...config, period: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
            {['Term 1', 'Term 2', 'Full Year', 'January 2026', 'February 2026', 'March 2026'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Class Range</label>
          <select value={config.classRange} onChange={e => setConfig({ ...config, classRange: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
            {['All Classes', 'Classes 6–8', 'Classes 9–10', 'Classes 11–12'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Format</label>
          <select value={config.format} onChange={e => setConfig({ ...config, format: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
            {['PDF', 'Excel', 'CSV'].map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Report type cards */}
      <h2 className="font-bold text-gray-900 mb-3">Generate New Report</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {reportTypes.map(r => (
          <div key={r.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all">
            <div className={`w-10 h-10 ${r.bg} rounded-xl flex items-center justify-center mb-3`}>
              <r.icon className={`w-5 h-5 ${r.iconColor}`} />
            </div>
            <h3 className="font-bold text-gray-900 text-sm mb-1">{r.title}</h3>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">{r.desc}</p>
            {generated === r.id ? (
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Ready to download!
              </div>
            ) : (
              <button
                onClick={() => handleGenerate(r.id)}
                disabled={!!generating}
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all bg-gradient-to-r ${r.color} text-white hover:shadow-md disabled:opacity-60`}
              >
                {generating === r.id ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating...</> : <><Download className="w-3.5 h-3.5" />Generate & Download</>}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Previous reports */}
      <h2 className="font-bold text-gray-900 mb-3">Previous Reports</h2>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="divide-y divide-gray-50">
          {prebuiltReports.map(r => (
            <div key={r.name} className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{r.name}</p>
                  <p className="text-xs text-gray-400">{r.date} · {r.size}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColor[r.type] || 'bg-gray-100 text-gray-600'}`}>{r.type}</span>
                <button className="flex items-center gap-1.5 text-xs text-indigo-600 hover:underline font-medium">
                  <Download className="w-3.5 h-3.5" /> Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
