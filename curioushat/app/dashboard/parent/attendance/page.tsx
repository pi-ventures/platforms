import { CheckCircle2, X, Clock, TrendingUp, AlertCircle } from 'lucide-react'

const months = ['January 2026', 'February 2026', 'March 2026']

// 1=present, 0=absent, 2=late, null=no school
const calData: Record<string, (number | null)[]> = {
  'January 2026': [null,null,null,null,1,1,1,1,1,null,null,1,1,1,1,1,null,null,0,1,1,1,1,null,null,1,1,1,1,1,null],
  'February 2026': [null,null,null,1,1,1,1,null,null,1,1,2,1,1,null,null,1,1,1,1,1,null,null,1,1,1,1,1,null,null,null],
  'March 2026':    [null,null,null,1,1,1,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null,null],
}

const dayLabels = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

const summary = [
  { label: 'Total School Days', value: '44', icon: null },
  { label: 'Present', value: '41', icon: CheckCircle2, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Absent', value: '1', icon: X, color: 'text-red-600 bg-red-50' },
  { label: 'Late', value: '2', icon: Clock, color: 'text-amber-600 bg-amber-50' },
]

export default function ParentAttendancePage() {
  const attendancePct = Math.round((41 / 44) * 100)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Attendance Record</h1>
        <p className="text-gray-500 mt-1">Om Aditya Raghuvanshi · Class 10-A · Session 2025–26</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={`col-span-2 lg:col-span-1 rounded-2xl p-5 ${attendancePct >= 90 ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white' : 'bg-gradient-to-br from-amber-500 to-orange-500 text-white'}`}>
          <div className="text-4xl font-black mb-1">{attendancePct}%</div>
          <div className="text-emerald-100 text-sm">Attendance Rate</div>
          {attendancePct >= 75
            ? <div className="flex items-center gap-1 mt-2 text-xs text-white/80"><TrendingUp className="w-3 h-3" />Above 75% requirement</div>
            : <div className="flex items-center gap-1 mt-2 text-xs text-white/80"><AlertCircle className="w-3 h-3" />Below 75% threshold!</div>
          }
        </div>
        {summary.slice(1).map(s => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-2 ${s.color}`}>
              {s.icon && <s.icon className="w-4 h-4" />}
            </div>
            <div className="text-3xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Calendar views */}
      <div className="space-y-6">
        {months.map(month => {
          const days = calData[month]
          const presentCount = days.filter(d => d === 1).length
          const absentCount = days.filter(d => d === 0).length
          const lateCount = days.filter(d => d === 2).length

          return (
            <div key={month} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">{month}</h2>
                <div className="flex gap-3 text-xs">
                  <span className="text-emerald-600 font-semibold">{presentCount}P</span>
                  <span className="text-red-500 font-semibold">{absentCount}A</span>
                  <span className="text-amber-500 font-semibold">{lateCount}L</span>
                </div>
              </div>
              <div className="p-4">
                {/* Day headers */}
                <div className="grid grid-cols-7 gap-0.5 mb-2 text-[10px] sm:text-xs">
                  {dayLabels.map(d => (
                    <div key={d} className="text-center text-xs text-gray-400 font-semibold py-1">{d}</div>
                  ))}
                </div>
                {/* Days grid */}
                <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
                  {days.map((status, i) => {
                    const dayNum = i + 1
                    if (status === null) {
                      return <div key={i} className="aspect-square rounded-lg bg-gray-50 flex items-center justify-center text-xs text-gray-300">{dayNum <= 31 ? dayNum : ''}</div>
                    }
                    return (
                      <div key={i} className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs font-bold transition-all
                        ${status === 1 ? 'bg-emerald-100 text-emerald-700' : status === 0 ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-700'}`}>
                        <span>{dayNum}</span>
                        {status === 0 && <X className="w-2.5 h-2.5 mt-0.5" />}
                        {status === 2 && <Clock className="w-2.5 h-2.5 mt-0.5" />}
                        {status === 1 && <div className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />}
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* Legend */}
              <div className="flex items-center gap-4 px-5 pb-4 text-xs text-gray-500">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-100 inline-block" />Present</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-100 inline-block" />Absent</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-100 inline-block" />Late</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-gray-50 inline-block" />Holiday/Weekend</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
