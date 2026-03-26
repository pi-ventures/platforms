'use client'
import { useState } from 'react'
import { Calendar, Plus } from 'lucide-react'

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const periods = ['8:00–8:45', '8:45–9:30', '9:30–10:15', '10:15–10:30 Break', '10:30–11:15', '11:15–12:00', '12:00–12:45', '12:45–1:30 Lunch', '1:30–2:15', '2:15–3:00']

type TimetableEntry = { subject: string; teacher: string }

const classData: Record<string, (TimetableEntry | null)[][]> = {
  '10-A': [
    [{ subject: 'Mathematics', teacher: 'Mr. Sharma' }, { subject: 'Physics', teacher: 'Ms. Gupta' }, { subject: 'Chemistry', teacher: 'Ms. Iyer' }, null, { subject: 'English', teacher: 'Mr. Kumar' }, { subject: 'Biology', teacher: 'Ms. Nair' }, { subject: 'History', teacher: 'Mr. Verma' }, null, { subject: 'PT', teacher: 'Mr. Das' }, { subject: 'Computer', teacher: 'Mr. S.Kumar' }],
    [{ subject: 'Physics', teacher: 'Ms. Gupta' }, { subject: 'Mathematics', teacher: 'Mr. Sharma' }, { subject: 'Biology', teacher: 'Ms. Nair' }, null, { subject: 'Chemistry', teacher: 'Ms. Iyer' }, { subject: 'English', teacher: 'Mr. Kumar' }, { subject: 'Computer', teacher: 'Mr. S.Kumar' }, null, { subject: 'Art', teacher: 'Ms. Roy' }, { subject: 'Mathematics', teacher: 'Mr. Sharma' }],
    [{ subject: 'Chemistry', teacher: 'Ms. Iyer' }, { subject: 'Biology', teacher: 'Ms. Nair' }, { subject: 'Mathematics', teacher: 'Mr. Sharma' }, null, { subject: 'History', teacher: 'Mr. Verma' }, { subject: 'Physics', teacher: 'Ms. Gupta' }, { subject: 'English', teacher: 'Mr. Kumar' }, null, { subject: 'Mathematics', teacher: 'Mr. Sharma' }, { subject: 'Chemistry', teacher: 'Ms. Iyer' }],
    [{ subject: 'English', teacher: 'Mr. Kumar' }, { subject: 'Chemistry', teacher: 'Ms. Iyer' }, { subject: 'Physics', teacher: 'Ms. Gupta' }, null, { subject: 'Mathematics', teacher: 'Mr. Sharma' }, { subject: 'History', teacher: 'Mr. Verma' }, { subject: 'Biology', teacher: 'Ms. Nair' }, null, { subject: 'Computer', teacher: 'Mr. S.Kumar' }, { subject: 'Physics', teacher: 'Ms. Gupta' }],
    [{ subject: 'Biology', teacher: 'Ms. Nair' }, { subject: 'English', teacher: 'Mr. Kumar' }, { subject: 'History', teacher: 'Mr. Verma' }, null, { subject: 'Chemistry', teacher: 'Ms. Iyer' }, { subject: 'Mathematics', teacher: 'Mr. Sharma' }, { subject: 'Physics', teacher: 'Ms. Gupta' }, null, { subject: 'Art', teacher: 'Ms. Roy' }, { subject: 'PT', teacher: 'Mr. Das' }],
    [{ subject: 'Mathematics', teacher: 'Mr. Sharma' }, { subject: 'Chemistry', teacher: 'Ms. Iyer' }, { subject: 'Biology', teacher: 'Ms. Nair' }, null, { subject: 'Physics', teacher: 'Ms. Gupta' }, { subject: 'English', teacher: 'Mr. Kumar' }, null, null, null, null],
  ]
}

const subjectColors: Record<string, string> = {
  Mathematics: 'bg-indigo-100 text-indigo-700',
  Physics: 'bg-blue-100 text-blue-700',
  Chemistry: 'bg-purple-100 text-purple-700',
  Biology: 'bg-emerald-100 text-emerald-700',
  English: 'bg-orange-100 text-orange-700',
  History: 'bg-amber-100 text-amber-700',
  Computer: 'bg-cyan-100 text-cyan-700',
  PT: 'bg-rose-100 text-rose-700',
  Art: 'bg-pink-100 text-pink-700',
}

export default function TimetablePage() {
  const [selectedClass, setSelectedClass] = useState('10-A')
  const data = classData[selectedClass] || classData['10-A']

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><Calendar className="w-7 h-7 text-indigo-600" /> Timetable Manager</h1>
          <p className="text-gray-500 mt-1">Session 2025–26 · Term 3</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" /> New Timetable
        </button>
      </div>

      {/* Class selector */}
      <div className="flex flex-wrap gap-2 mb-6">
        {['6-A', '7-A', '8-A', '9-A', '10-A', '10-B', '11-A', '12-A'].map(c => (
          <button key={c} onClick={() => setSelectedClass(c)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedClass === c ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-indigo-50'}`}>
            {c}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-xs min-w-[500px] sm:min-w-[900px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-gray-500 font-semibold w-32">Period</th>
              {days.map(d => <th key={d} className="px-3 py-3 text-center font-bold text-sm text-gray-700">{d}</th>)}
            </tr>
          </thead>
          <tbody>
            {periods.map((period, pi) => {
              if (period.includes('Break') || period.includes('Lunch')) {
                return (
                  <tr key={period} className="bg-gray-50">
                    <td className="px-4 py-2 text-gray-400 font-medium italic text-xs" colSpan={7}>{period}</td>
                  </tr>
                )
              }
              return (
                <tr key={period} className="border-b border-gray-50">
                  <td className="px-4 py-3 text-gray-500 font-medium whitespace-nowrap">{period}</td>
                  {days.map((_, di) => {
                    const entry = data[di]?.[pi]
                    return (
                      <td key={di} className="px-2 py-2 text-center">
                        {entry && (
                          <div className={`inline-flex flex-col items-center px-2 py-1.5 rounded-lg ${subjectColors[entry.subject] || 'bg-gray-100 text-gray-700'}`}>
                            <span className="font-semibold text-xs">{entry.subject}</span>
                            <span className="text-xs opacity-60 mt-0.5">{entry.teacher.split(' ').slice(-1)[0]}</span>
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
