'use client'
import { useState } from 'react'
import { Users, Clock, BookOpen, TrendingUp, Plus, MoreVertical } from 'lucide-react'

const batches = [
  { id: 1, name: 'B.Tech CS Yr-1', department: 'Computer Science', color: 'bg-indigo-500', lightColor: 'bg-indigo-50 border-indigo-100', textColor: 'text-indigo-700', students: 64, faculty: 'Dr. Ramesh Kumar', avgAttendance: 87, nextClass: 'Mon, 9:00 AM', room: 'LH-301', semester: 'Sem 2' },
  { id: 2, name: 'B.Tech CS Yr-2', department: 'Computer Science', color: 'bg-indigo-500', lightColor: 'bg-indigo-50 border-indigo-100', textColor: 'text-indigo-700', students: 58, faculty: 'Prof. Sunita Agarwal', avgAttendance: 82, nextClass: 'Mon, 11:00 AM', room: 'LH-205', semester: 'Sem 4' },
  { id: 3, name: 'BBA Yr-1', department: 'Business Administration', color: 'bg-amber-500', lightColor: 'bg-amber-50 border-amber-100', textColor: 'text-amber-700', students: 48, faculty: 'Dr. Priya Menon', avgAttendance: 79, nextClass: 'Mon, 10:00 AM', room: 'CR-102', semester: 'Sem 2' },
  { id: 4, name: 'BBA Yr-2', department: 'Business Administration', color: 'bg-amber-500', lightColor: 'bg-amber-50 border-amber-100', textColor: 'text-amber-700', students: 42, faculty: 'Prof. Vikram Singh', avgAttendance: 74, nextClass: 'Tue, 9:00 AM', room: 'CR-104', semester: 'Sem 4' },
  { id: 5, name: 'B.Sc Physics Yr-1', department: 'Physics', color: 'bg-teal-500', lightColor: 'bg-teal-50 border-teal-100', textColor: 'text-teal-700', students: 36, faculty: 'Dr. Anand Joshi', avgAttendance: 91, nextClass: 'Mon, 2:00 PM', room: 'PH-Lab 1', semester: 'Sem 2' },
  { id: 6, name: 'B.Sc Chemistry Yr-1', department: 'Chemistry', color: 'bg-rose-500', lightColor: 'bg-rose-50 border-rose-100', textColor: 'text-rose-700', students: 32, faculty: 'Dr. Kavita Sharma', avgAttendance: 85, nextClass: 'Tue, 11:00 AM', room: 'CH-Lab 2', semester: 'Sem 2' },
]

export default function BatchesPage() {
  const [menuOpen, setMenuOpen] = useState<number | null>(null)

  const totalStudents = batches.reduce((a, b) => a + b.students, 0)
  const avgAttendance = Math.round(batches.reduce((a, b) => a + b.avgAttendance, 0) / batches.length)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><BookOpen className="w-7 h-7 text-indigo-600" /> Batches & Classes</h1>
          <p className="text-gray-500 mt-1">Manage student batches by programme and year</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" /> Create Batch
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Batches', value: batches.length, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Total Students', value: totalStudents, color: 'text-teal-600 bg-teal-50' },
          { label: 'Avg Attendance', value: `${avgAttendance}%`, color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Departments', value: 4, color: 'text-purple-600 bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-xs font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Batch cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {batches.map(batch => (
          <div key={batch.id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${batch.lightColor}`}>
            {/* Color bar */}
            <div className={`h-1.5 ${batch.color}`} />

            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{batch.name}</h3>
                  <p className={`text-xs font-medium mt-0.5 ${batch.textColor}`}>{batch.department} &bull; {batch.semester}</p>
                </div>
                <div className="relative">
                  <button onClick={() => setMenuOpen(menuOpen === batch.id ? null : batch.id)} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                  {menuOpen === batch.id && (
                    <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-xl shadow-lg py-1 w-36 z-10">
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Edit Batch</button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">View Students</button>
                      <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Take Attendance</button>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="font-semibold text-gray-900">{batch.students}</span>
                  <span>students enrolled</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <BookOpen className="w-4 h-4 text-gray-400" />
                  <span>{batch.faculty}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span>Avg Attendance:</span>
                  <span className={`font-bold ${batch.avgAttendance >= 85 ? 'text-emerald-600' : batch.avgAttendance >= 75 ? 'text-amber-600' : 'text-red-600'}`}>{batch.avgAttendance}%</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>Next: {batch.nextClass}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{batch.room}</span>
                </div>
              </div>

              {/* Attendance bar */}
              <div className="mt-4 flex items-center gap-2">
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${batch.color}`} style={{ width: `${batch.avgAttendance}%` }} />
                </div>
                <span className="text-xs font-semibold text-gray-500 w-8 text-right">{batch.avgAttendance}%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
