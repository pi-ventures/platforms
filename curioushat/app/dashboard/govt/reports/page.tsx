'use client'
import { useState } from 'react'
import { FileDown, BarChart3, Map, School, BookOpen, GraduationCap, CheckCircle2, Loader2, Clock } from 'lucide-react'

const reportTypes = [
  { id: 'state_summary', label: 'State Performance Summary', desc: 'Overall state metrics, year-on-year trends, top and bottom performers', icon: BarChart3, color: 'from-indigo-600 to-purple-600', estimatedSize: '2.4 MB', format: 'PDF + Excel' },
  { id: 'district_wise', label: 'District-wise Performance Report', desc: 'All districts ranked by score, attendance, pass rate, and dropout metrics', icon: Map, color: 'from-blue-600 to-teal-600', estimatedSize: '4.8 MB', format: 'PDF + Excel' },
  { id: 'school_wise', label: 'School-wise Data Export', desc: 'Every school with full metrics, flagged schools highlighted', icon: School, color: 'from-teal-600 to-emerald-600', estimatedSize: '18.2 MB', format: 'Excel + CSV' },
  { id: 'subject_analysis', label: 'Subject Performance Analysis', desc: 'Subject-wise breakdown across state and districts with trend graphs', icon: BookOpen, color: 'from-purple-600 to-pink-600', estimatedSize: '3.1 MB', format: 'PDF + Excel' },
  { id: 'student_outcomes', label: 'Student Outcomes Report', desc: 'Pass/fail/at-risk student distribution, dropout rates, remediation impact', icon: GraduationCap, color: 'from-orange-500 to-amber-500', estimatedSize: '7.4 MB', format: 'Excel + PDF' },
  { id: 'intervention_status', label: 'Intervention & Flagged Schools', desc: 'All flagged schools with intervention plans, status, and follow-up timelines', icon: CheckCircle2, color: 'from-red-600 to-rose-600', estimatedSize: '1.8 MB', format: 'PDF' },
]

const recentReports = [
  { name: 'Q3 State Summary 2025', generated: 'Feb 28, 2026', by: 'Shri Arvind Sharma', size: '2.4 MB', type: 'State Summary' },
  { name: 'District Rankings Jan 2026', generated: 'Jan 31, 2026', by: 'System Auto', size: '4.8 MB', type: 'District Report' },
  { name: 'Gadchiroli Intervention Report', generated: 'Jan 15, 2026', by: 'Dr. Priya Menon', size: '1.2 MB', type: 'Intervention' },
  { name: 'Mid-year Subject Analysis 2025', generated: 'Nov 30, 2025', by: 'System Auto', size: '3.1 MB', type: 'Subject Analysis' },
]

export default function ReportsPage() {
  const [generating, setGenerating] = useState<string | null>(null)
  const [generated, setGenerated] = useState<string[]>([])
  const [form, setForm] = useState({ year: '2024–25', period: 'Full Year', district: 'All Districts', format: 'PDF + Excel' })

  const handleGenerate = async (id: string) => {
    setGenerating(id)
    await new Promise(r => setTimeout(r, 2000))
    setGenerating(null)
    setGenerated(prev => [...prev, id])
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <FileDown className="w-7 h-7 text-red-600" /> Reports & Export
        </h1>
        <p className="text-gray-500 mt-1">Generate and download official education reports for government records</p>
      </div>

      {/* Report filters */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm mb-6">
        <h2 className="font-bold text-gray-900 mb-4">Report Parameters</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Academic Year', key: 'year', options: ['2024–25', '2023–24', '2022–23', '2021–22'] },
            { label: 'Period', key: 'period', options: ['Full Year', 'Term 1', 'Term 2', 'Term 3', 'Q1', 'Q2', 'Q3', 'Q4'] },
            { label: 'Scope', key: 'district', options: ['All Districts', 'Pune', 'Nashik', 'Mumbai', 'Gadchiroli', 'Nandurbar'] },
            { label: 'Format', key: 'format', options: ['PDF + Excel', 'PDF Only', 'Excel Only', 'CSV'] },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
              <select value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none bg-white">
                {f.options.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>
      </div>

      {/* Report types grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {reportTypes.map(r => {
          const isGenerating = generating === r.id
          const isDone = generated.includes(r.id)
          return (
            <div key={r.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className={`w-11 h-11 bg-gradient-to-br ${r.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <r.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-sm mb-1">{r.label}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-3">{r.desc}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span>~{r.estimatedSize}</span>
                    <span>·</span>
                    <span>{r.format}</span>
                  </div>
                  <button
                    onClick={() => handleGenerate(r.id)}
                    disabled={isGenerating}
                    className={`flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-xl transition-all ${isDone ? 'bg-emerald-100 text-emerald-700' : isGenerating ? 'bg-gray-100 text-gray-500' : 'bg-red-600 text-white hover:bg-red-700'}`}
                  >
                    {isGenerating ? <><Loader2 className="w-3.5 h-3.5 animate-spin" />Generating...</>
                      : isDone ? <><CheckCircle2 className="w-3.5 h-3.5" />Download Ready</>
                      : <><FileDown className="w-3.5 h-3.5" />Generate Report</>}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent reports */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-bold text-gray-900">Recently Generated Reports</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {recentReports.map(r => (
            <div key={r.name} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-gray-100 rounded-lg flex items-center justify-center">
                  <FileDown className="w-4 h-4 text-gray-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-900 text-sm">{r.name}</p>
                  <p className="text-xs text-gray-400 flex items-center gap-2">
                    <Clock className="w-3 h-3" />{r.generated} · {r.by} · {r.size}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs bg-indigo-100 text-indigo-700 font-medium px-2.5 py-1 rounded-full hidden sm:block">{r.type}</span>
                <button className="text-xs text-red-600 font-semibold hover:underline">Download</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
