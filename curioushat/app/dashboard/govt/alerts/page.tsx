import { AlertTriangle, CheckCircle2, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const alerts = [
  { id: 1, type: 'critical', category: 'Performance', title: '1,847 schools with average score below 60%', detail: 'Immediate remedial intervention required. Predominantly Government/ZP schools in Gadchiroli, Nandurbar, Solapur, and Osmanabad. Recommended action: Deploy district education officers for on-site assessment within 14 days.', district: 'State-wide', affected: 1847, unit: 'schools', status: 'open', date: 'Mar 1, 2026', assigned: 'District DEOs' },
  { id: 2, type: 'critical', category: 'Attendance', title: 'Chronic attendance crisis in tribal districts', detail: 'Nandurbar (74.1%) and Gadchiroli (70.8%) have district-wide attendance below 75%, the minimum threshold. Root causes: distance to school, seasonal labour migration, lack of mid-day meal in 42 schools.', district: 'Nandurbar, Gadchiroli', affected: 2, unit: 'districts', status: 'in_progress', date: 'Feb 25, 2026', assigned: 'Tribal Welfare Dept.' },
  { id: 3, type: 'critical', category: 'Dropout', title: 'Class 9→10 dropout rate spike: 8.4%', detail: 'The dropout rate between Class 9 and 10 has jumped from 6.1% last year to 8.4% this year — highest in 5 years. Nagpur urban slum areas account for 42% of cases. Immediate counselling intervention and scholarship review needed.', district: 'Nagpur, Solapur', affected: 8400, unit: 'students at risk', status: 'open', date: 'Feb 20, 2026', assigned: 'Not assigned' },
  { id: 4, type: 'high', category: 'Staffing', title: '3,240 teacher posts vacant across 12 districts', detail: 'Vacancy is highest in Gadchiroli (18.4% of posts vacant), Nandurbar (14.2%), and Osmanabad (11.8%). Teacher-student ratio in 847 schools exceeds 1:50, severely impacting learning outcomes.', district: 'Multiple', affected: 3240, unit: 'vacancies', status: 'in_progress', date: 'Feb 15, 2026', assigned: 'MPSC / HR Dept.' },
  { id: 5, type: 'high', category: 'Subject', title: 'Mathematics pass rate below 70% in 4 districts', detail: 'Gadchiroli (58%), Nandurbar (61%), Solapur (67%), and Latur (69%) have Mathematics pass rates significantly below the state average of 82.1%. Recommend district-level Mathematics camps and AI tutoring deployment.', district: 'Gadchiroli, Nandurbar, Solapur, Latur', affected: 4, unit: 'districts', status: 'open', date: 'Feb 10, 2026', assigned: 'Not assigned' },
  { id: 6, type: 'medium', category: 'Infrastructure', title: '312 schools without functional toilet facilities', detail: 'Particularly affects girl students\' attendance. Most schools are in Marathwada and Vidarbha regions. Civil works sanctioned but not started in 180 schools.', district: 'Marathwada, Vidarbha', affected: 312, unit: 'schools', status: 'in_progress', date: 'Jan 30, 2026', assigned: 'PWD / DISE' },
  { id: 7, type: 'medium', category: 'Performance', title: 'Mid-term result: 14 schools with 0% pass rate', detail: 'Fourteen schools in remote tribal blocks recorded zero pass rate in the Class 10 midterm. Investigation ongoing — preliminary findings suggest examination irregularities in 6 schools and genuine learning crisis in 8.', district: 'Gadchiroli, Nandurbar', affected: 14, unit: 'schools', status: 'investigating', date: 'Jan 25, 2026', assigned: 'Vigilance Team' },
  { id: 8, type: 'resolved', category: 'Attendance', title: 'Aurangabad attendance crisis — resolved', detail: 'Attendance in Aurangabad dropped to 71% in September 2025 due to a local festival season. After district-level campaign, attendance recovered to 83.1% by February 2026.', district: 'Aurangabad', affected: 0, unit: '', status: 'resolved', date: 'Sep 2025', assigned: 'District DEO' },
]

const typeConfig: Record<string, { border: string; bg: string; badge: string; badgeText: string }> = {
  critical: { border: 'border-red-200', bg: 'bg-red-50/50', badge: 'bg-red-100 text-red-700', badgeText: 'Critical' },
  high: { border: 'border-amber-200', bg: 'bg-amber-50/30', badge: 'bg-amber-100 text-amber-700', badgeText: 'High' },
  medium: { border: 'border-blue-200', bg: 'bg-blue-50/20', badge: 'bg-blue-100 text-blue-700', badgeText: 'Medium' },
  resolved: { border: 'border-emerald-200', bg: 'bg-emerald-50/20', badge: 'bg-emerald-100 text-emerald-700', badgeText: 'Resolved' },
}

const statusConfig: Record<string, { color: string; label: string; icon: React.ElementType }> = {
  open: { color: 'text-red-600 bg-red-50', label: 'Open', icon: AlertTriangle },
  in_progress: { color: 'text-amber-600 bg-amber-50', label: 'In Progress', icon: Clock },
  investigating: { color: 'text-blue-600 bg-blue-50', label: 'Investigating', icon: Clock },
  resolved: { color: 'text-emerald-600 bg-emerald-50', label: 'Resolved', icon: CheckCircle2 },
}

export default function AlertsPage() {
  const open = alerts.filter(a => a.status !== 'resolved')
  const resolved = alerts.filter(a => a.status === 'resolved')

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <AlertTriangle className="w-7 h-7 text-red-500" /> Alerts & Flags
        </h1>
        <p className="text-gray-500 mt-1">Issues requiring government attention and intervention</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Critical', count: alerts.filter(a => a.type === 'critical').length, color: 'bg-red-600 text-white' },
          { label: 'High Priority', count: alerts.filter(a => a.type === 'high').length, color: 'bg-amber-500 text-white' },
          { label: 'Medium', count: alerts.filter(a => a.type === 'medium').length, color: 'bg-blue-500 text-white' },
          { label: 'Resolved', count: alerts.filter(a => a.type === 'resolved').length, color: 'bg-emerald-500 text-white' },
        ].map(s => (
          <div key={s.label} className={`${s.color} rounded-2xl p-4 text-center`}>
            <div className="text-3xl font-black">{s.count}</div>
            <div className="text-sm opacity-80">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Open alerts */}
      <h2 className="font-bold text-gray-900 mb-4">Active Alerts ({open.length})</h2>
      <div className="space-y-4 mb-8">
        {open.map(a => {
          const tc = typeConfig[a.type]
          const sc = statusConfig[a.status]
          return (
            <div key={a.id} className={`rounded-2xl p-5 border ${tc.border} ${tc.bg}`}>
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${a.type === 'critical' ? 'text-red-500' : a.type === 'high' ? 'text-amber-500' : 'text-blue-500'}`} />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${tc.badge}`}>{tc.badgeText}</span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a.category}</span>
                    </div>
                    <h3 className="font-bold text-gray-900">{a.title}</h3>
                  </div>
                </div>
                <span className={`flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${sc.color}`}>
                  <sc.icon className="w-3 h-3" />{sc.label}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3 ml-8">{a.detail}</p>
              <div className="flex items-center justify-between ml-8 text-xs text-gray-400 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <span>📍 {a.district}</span>
                  {a.affected > 0 && <span>Affected: <strong>{a.affected.toLocaleString()} {a.unit}</strong></span>}
                  <span>Reported: {a.date}</span>
                  <span>Assigned: <strong className={a.assigned === 'Not assigned' ? 'text-red-500' : 'text-gray-700'}>{a.assigned}</strong></span>
                </div>
                <button className="text-red-600 font-semibold hover:underline flex items-center gap-1">
                  Take Action <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Resolved */}
      {resolved.length > 0 && (
        <>
          <h2 className="font-bold text-gray-900 mb-4">Resolved ({resolved.length})</h2>
          <div className="space-y-3">
            {resolved.map(a => (
              <div key={a.id} className="bg-white rounded-2xl p-4 border border-emerald-100 opacity-70">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.district} · {a.date} · {a.assigned}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
