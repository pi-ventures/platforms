import { FileText, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

const exams = [
  { subject: 'Biology', type: 'Unit Test', date: 'Mar 8, 2026', time: '9:00 AM', duration: '1 hr', topic: 'Cell Division & Mitosis', status: 'upcoming', room: 'Room 201' },
  { subject: 'History', type: 'Unit Test', date: 'Mar 12, 2026', time: '10:00 AM', duration: '1 hr', topic: 'Modern India (1857–1947)', status: 'upcoming', room: 'Room 105' },
  { subject: 'Mathematics', type: 'Pre-Board', date: 'Mar 15, 2026', time: '9:00 AM', duration: '3 hrs', topic: 'Calculus & Algebra', status: 'upcoming', room: 'Hall A' },
  { subject: 'Physics', type: 'Practical', date: 'Feb 22, 2026', time: '11:00 AM', duration: '2 hrs', topic: 'Optics Lab', status: 'completed', marks: '23/25', grade: 'A+' },
  { subject: 'Chemistry', type: 'Unit Test', date: 'Feb 18, 2026', time: '9:00 AM', duration: '1 hr', topic: 'Organic Chemistry', status: 'completed', marks: '35/40', grade: 'A' },
  { subject: 'English', type: 'Unit Test', date: 'Feb 14, 2026', time: '10:00 AM', duration: '1 hr', topic: 'Poetry & Grammar', status: 'completed', marks: '28/30', grade: 'A+' },
]

export default function ExamsPage() {
  const upcoming = exams.filter(e => e.status === 'upcoming')
  const completed = exams.filter(e => e.status === 'completed')
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">My Exams</h1>
        <p className="text-gray-500 mt-1">Upcoming tests and past results</p>
      </div>

      {/* Upcoming */}
      <div className="mb-8">
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" /> Upcoming ({upcoming.length})
        </h2>
        <div className="space-y-3">
          {upcoming.map(e => (
            <div key={e.subject + e.date} className="bg-white rounded-2xl p-5 border border-amber-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-50 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-amber-600">{e.date.split(',')[0].split(' ')[1]}</span>
                  <span className="text-xs text-amber-500">{e.date.split(' ')[0]}</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900">{e.subject}</p>
                    <span className="text-xs bg-blue-100 text-blue-600 font-medium px-2 py-0.5 rounded-full">{e.type}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-0.5">{e.topic}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{e.time} · {e.duration}</span>
                    <span className="text-xs text-gray-400">{e.room}</span>
                  </div>
                </div>
              </div>
              <button className="text-sm bg-indigo-50 text-indigo-600 font-semibold px-4 py-2 rounded-xl hover:bg-indigo-100 transition-colors">
                Prepare with AI
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Completed */}
      <div>
        <h2 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-500" /> Completed ({completed.length})
        </h2>
        <div className="space-y-3">
          {completed.map(e => (
            <div key={e.subject + e.date} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-gray-900">{e.subject}</p>
                    <span className="text-xs bg-gray-100 text-gray-500 font-medium px-2 py-0.5 rounded-full">{e.type}</span>
                  </div>
                  <p className="text-sm text-gray-500">{e.date} · {e.topic}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-gray-900">{e.marks}</div>
                <span className="text-xs bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">{e.grade}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
