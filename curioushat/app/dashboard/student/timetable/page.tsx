const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const periods = ['8:00–8:45', '8:45–9:30', '9:30–10:15', 'Break', '10:30–11:15', '11:15–12:00', '12:00–12:45', 'Lunch', '1:30–2:15', '2:15–3:00']

const timetable: Record<string, (string|null)[]> = {
  Monday: ['Mathematics', 'Physics', 'Chemistry', null, 'English', 'Biology', 'History', null, 'PT', 'Library'],
  Tuesday: ['English', 'Mathematics', 'Biology', null, 'Physics', 'Chemistry', 'Computer', null, 'Art', 'Mathematics'],
  Wednesday: ['Chemistry', 'Biology', 'Mathematics', null, 'History', 'Physics', 'English', null, 'Mathematics', 'Chemistry'],
  Thursday: ['Physics', 'Chemistry', 'English', null, 'Mathematics', 'History', 'Biology', null, 'Computer', 'Physics'],
  Friday: ['Biology', 'English', 'Physics', null, 'Chemistry', 'Mathematics', 'History', null, 'Art', 'PT'],
  Saturday: ['Mathematics', 'Chemistry', 'Biology', null, 'Physics', 'English', null, null, null, null],
}

const subjectColors: Record<string, string> = {
  Mathematics: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  Physics: 'bg-blue-100 text-blue-700 border-blue-200',
  Chemistry: 'bg-purple-100 text-purple-700 border-purple-200',
  Biology: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  English: 'bg-orange-100 text-orange-700 border-orange-200',
  History: 'bg-amber-100 text-amber-700 border-amber-200',
  Computer: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  PT: 'bg-rose-100 text-rose-700 border-rose-200',
  Art: 'bg-pink-100 text-pink-700 border-pink-200',
  Library: 'bg-gray-100 text-gray-700 border-gray-200',
}

export default function TimetablePage() {
  const today = new Date().toLocaleDateString('en', { weekday: 'long' })
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">My Timetable</h1>
        <p className="text-gray-500 mt-1">Class 10-A | Academic Year 2025–26</p>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-xs min-w-[400px] sm:min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left px-4 py-3 text-gray-500 font-semibold w-28">Period</th>
              {days.map(d => (
                <th key={d} className={`px-3 py-3 text-center font-bold text-sm ${d === today ? 'text-indigo-700 bg-indigo-50' : 'text-gray-700'}`}>
                  {d}
                  {d === today && <span className="block text-xs text-indigo-500 font-normal">Today</span>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {periods.map((period, pi) => (
              <tr key={period} className={`border-b border-gray-50 ${!period ? 'bg-gray-25' : ''}`}>
                <td className="px-4 py-3 text-gray-500 font-medium whitespace-nowrap">
                  {period === null ? '' : period}
                </td>
                {days.map(d => {
                  const subject = timetable[d]?.[pi]
                  if (period === 'Break' || period === 'Lunch') {
                    return <td key={d} className="px-3 py-2 text-center text-gray-400 bg-gray-50 italic text-xs" colSpan={1}>{period}</td>
                  }
                  return (
                    <td key={d} className={`px-3 py-2 text-center ${d === today ? 'bg-indigo-50/30' : ''}`}>
                      {subject && (
                        <span className={`inline-block px-2 py-1 rounded-lg border text-xs font-medium ${subjectColors[subject] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                          {subject}
                        </span>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
