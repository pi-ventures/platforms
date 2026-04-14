'use client'
import { useState } from 'react'
import { Shield, CheckCircle2, Clock, AlertCircle, FileText, Upload, Calendar, Award, TrendingUp } from 'lucide-react'

const criteria = [
  { id: 1, name: 'Curricular Aspects', weight: '150 marks', progress: 92, status: 'complete' as const, remarks: 'CBCS implemented across all programmes, LoCs updated' },
  { id: 2, name: 'Teaching-Learning & Evaluation', weight: '200 marks', progress: 87, status: 'complete' as const, remarks: 'Student-centric methods adopted, mentor-mentee ratio 1:20' },
  { id: 3, name: 'Research, Innovations & Extension', weight: '250 marks', progress: 74, status: 'in-progress' as const, remarks: '2,840 papers published; patent filings need improvement' },
  { id: 4, name: 'Infrastructure & Learning Resources', weight: '100 marks', progress: 96, status: 'complete' as const, remarks: 'Smart classrooms in 94% of colleges, library digitized' },
  { id: 5, name: 'Student Support & Progression', weight: '100 marks', progress: 68, status: 'in-progress' as const, remarks: 'Placement cell active; alumni tracking needs strengthening' },
  { id: 6, name: 'Governance, Leadership & Management', weight: '100 marks', progress: 88, status: 'complete' as const, remarks: 'E-governance fully implemented, IQAC functional' },
  { id: 7, name: 'Institutional Values & Best Practices', weight: '100 marks', progress: 45, status: 'pending' as const, remarks: 'Green audit pending, gender audit scheduled for Q2 2026' },
]

const documents = [
  { name: 'AQAR 2024-25 Final Report', type: 'AQAR', uploaded: '2026-02-14', size: '4.2 MB', uploadedBy: 'Dr. Suresh Babu' },
  { name: 'SSR Volume I — Profile & Criteria', type: 'SSR', uploaded: '2026-01-28', size: '18.6 MB', uploadedBy: 'IQAC Coordinator' },
  { name: 'IIQA Application Form', type: 'IIQA', uploaded: '2025-12-10', size: '1.8 MB', uploadedBy: 'Dr. P. Sujatha Devi' },
  { name: 'DVV Clarifications — Criteria 3', type: 'DVV', uploaded: '2026-03-05', size: '6.4 MB', uploadedBy: 'Research Dean' },
  { name: 'Student Satisfaction Survey Report', type: 'Survey', uploaded: '2026-02-22', size: '2.1 MB', uploadedBy: 'Student Welfare' },
  { name: 'Green Audit Report 2025', type: 'Audit', uploaded: '2025-11-18', size: '3.7 MB', uploadedBy: 'Environmental Cell' },
]

const statusIcon = (s: string) => {
  if (s === 'complete') return <CheckCircle2 className="w-4 h-4 text-emerald-500" />
  if (s === 'in-progress') return <Clock className="w-4 h-4 text-amber-500" />
  return <AlertCircle className="w-4 h-4 text-red-400" />
}

const statusBadge = (s: string) => {
  if (s === 'complete') return 'bg-emerald-50 text-emerald-700'
  if (s === 'in-progress') return 'bg-amber-50 text-amber-700'
  return 'bg-red-50 text-red-600'
}

const progressBar = (pct: number) => {
  const color = pct >= 85 ? 'bg-emerald-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-400'
  return (
    <div className="w-full bg-gray-100 rounded-full h-2">
      <div className={`${color} h-2 rounded-full transition-all`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export default function AccreditationPage() {
  const [activeTab, setActiveTab] = useState<'criteria' | 'documents'>('criteria')

  const completedCount = criteria.filter(c => c.status === 'complete').length
  const avgProgress = Math.round(criteria.reduce((s, c) => s + c.progress, 0) / criteria.length)

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs bg-violet-100 text-violet-700 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">NAAC / UGC</span>
        </div>
        <h1 className="text-2xl font-black text-gray-900">Accreditation (NAAC)</h1>
        <p className="text-gray-500 text-sm mt-1">NAAC compliance tracking, AQAR submissions, and quality benchmarks</p>
      </div>

      {/* Current Accreditation Status */}
      <div className="bg-gradient-to-r from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-violet-100">
              <Shield className="w-8 h-8 text-violet-600" />
            </div>
            <div>
              <p className="text-xs text-violet-600 font-semibold uppercase tracking-wider">Current NAAC Grade</p>
              <p className="text-4xl font-black text-gray-900">A++</p>
              <p className="text-xs text-gray-500">CGPA: 3.76 / 4.00</p>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/70 rounded-xl p-3 border border-violet-100">
              <p className="text-[10px] text-gray-400 uppercase">Cycle</p>
              <p className="text-sm font-black text-gray-900">4th Cycle</p>
            </div>
            <div className="bg-white/70 rounded-xl p-3 border border-violet-100">
              <p className="text-[10px] text-gray-400 uppercase">Valid Until</p>
              <p className="text-sm font-black text-gray-900">March 2028</p>
            </div>
            <div className="bg-white/70 rounded-xl p-3 border border-violet-100">
              <p className="text-[10px] text-gray-400 uppercase">Next Peer Visit</p>
              <p className="text-sm font-black text-violet-700">Oct 2027</p>
            </div>
            <div className="bg-white/70 rounded-xl p-3 border border-violet-100">
              <p className="text-[10px] text-gray-400 uppercase">UGC Recognition</p>
              <p className="text-sm font-black text-emerald-600">12(B) & 2(f)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-emerald-50 border border-gray-100 rounded-xl p-4">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">{completedCount}/{criteria.length}</p>
          <p className="text-xs text-gray-500">Criteria Complete</p>
        </div>
        <div className="bg-violet-50 border border-gray-100 rounded-xl p-4">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">
            <TrendingUp className="w-4 h-4 text-violet-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">{avgProgress}%</p>
          <p className="text-xs text-gray-500">Overall Readiness</p>
        </div>
        <div className="bg-blue-50 border border-gray-100 rounded-xl p-4">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">{documents.length}</p>
          <p className="text-xs text-gray-500">Documents Uploaded</p>
        </div>
        <div className="bg-amber-50 border border-gray-100 rounded-xl p-4">
          <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2">
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl font-black text-gray-900">18 mo</p>
          <p className="text-xs text-gray-500">Until Next Visit</p>
        </div>
      </div>

      {/* Tab Switch */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 w-fit">
        <button
          onClick={() => setActiveTab('criteria')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'criteria' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Criteria Checklist
        </button>
        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'documents' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Documents & Uploads
        </button>
      </div>

      {/* Criteria Checklist */}
      {activeTab === 'criteria' && (
        <div className="space-y-3">
          {criteria.map(c => (
            <div key={c.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-3">
                {statusIcon(c.status)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-gray-900">Criterion {c.id}: {c.name}</p>
                    <span className="text-[10px] text-gray-400 font-medium">{c.weight}</span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusBadge(c.status)}`}>
                      {c.status === 'in-progress' ? 'In Progress' : c.status === 'complete' ? 'Complete' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{c.remarks}</p>
                  <div className="mt-3 flex items-center gap-3">
                    {progressBar(c.progress)}
                    <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{c.progress}%</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Documents */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          {/* Upload Area */}
          <div className="bg-white rounded-2xl border-2 border-dashed border-violet-200 p-8 text-center">
            <Upload className="w-8 h-8 text-violet-400 mx-auto mb-2" />
            <p className="text-sm font-semibold text-gray-700">Drag & drop documents here</p>
            <p className="text-xs text-gray-400 mt-1">SSR, AQAR, DVV responses, audit reports — PDF, DOCX up to 50 MB</p>
            <button className="mt-3 px-4 py-2 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors">
              Browse Files
            </button>
          </div>

          {/* Recent Uploads */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-600" /> Recent Uploads
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-gray-50">
                  <tr>
                    {['Document', 'Type', 'Uploaded By', 'Date', 'Size'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {documents.map(d => (
                    <tr key={d.name} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-xs font-bold text-gray-900">{d.name}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-violet-50 text-violet-700">{d.type}</span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-600">{d.uploadedBy}</td>
                      <td className="px-4 py-3 text-xs text-gray-500">{new Date(d.uploaded).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="px-4 py-3 text-xs text-gray-400">{d.size}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
