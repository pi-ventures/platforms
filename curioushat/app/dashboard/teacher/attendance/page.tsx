'use client'
import { useState } from 'react'
import { CheckCircle2, X, Clock, Send } from 'lucide-react'

const students = [
  { id: 1, name: 'Om Aditya Raghuvanshi', roll: 1 }, { id: 2, name: 'Bhavna Sharma', roll: 2 },
  { id: 3, name: 'Chirag Patel', roll: 3 }, { id: 4, name: 'Deepa Nair', roll: 4 },
  { id: 5, name: 'Ekta Joshi', roll: 5 }, { id: 6, name: 'Farhan Khan', roll: 6 },
  { id: 7, name: 'Gauri Iyer', roll: 7 }, { id: 8, name: 'Harsh Gupta', roll: 8 },
  { id: 9, name: 'Isha Mehta', roll: 9 }, { id: 10, name: 'Jatin Sinha', roll: 10 },
  { id: 11, name: 'Kavya Reddy', roll: 11 }, { id: 12, name: 'Lokesh Kumar', roll: 12 },
  { id: 13, name: 'Meera Bose', roll: 13 }, { id: 14, name: 'Nilesh Rao', roll: 14 },
  { id: 15, name: 'Ojas Tiwari', roll: 15 },
]

type Status = 'present' | 'absent' | 'late'

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Record<number, Status>>({})
  const [submitted, setSubmitted] = useState(false)
  const [selectedClass, setSelectedClass] = useState('10-A')

  const mark = (id: number, status: Status) => {
    setAttendance(prev => ({ ...prev, [id]: status }))
  }

  const markAll = (status: Status) => {
    const all: Record<number, Status> = {}
    students.forEach(s => all[s.id] = status)
    setAttendance(all)
  }

  const present = Object.values(attendance).filter(s => s === 'present').length
  const absent = Object.values(attendance).filter(s => s === 'absent').length
  const late = Object.values(attendance).filter(s => s === 'late').length
  const unmarked = students.length - Object.keys(attendance).length

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">Attendance</h1>
        <p className="text-gray-500 mt-1">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
      </div>

      {/* Class selector */}
      <div className="flex items-center gap-3 mb-6">
        {['10-A', '10-B', '9-A'].map(c => (
          <button key={c} onClick={() => { setSelectedClass(c); setAttendance({}) }} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectedClass === c ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-indigo-50'}`}>
            Class {c}
          </button>
        ))}
      </div>

      {!submitted ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Present', count: present, color: 'text-emerald-600 bg-emerald-50' },
              { label: 'Absent', count: absent, color: 'text-red-600 bg-red-50' },
              { label: 'Late', count: late, color: 'text-amber-600 bg-amber-50' },
              { label: 'Unmarked', count: unmarked, color: 'text-gray-500 bg-gray-50' },
            ].map(s => (
              <div key={s.label} className={`rounded-xl p-3 text-center ${s.color}`}>
                <div className="text-2xl font-black">{s.count}</div>
                <div className="text-xs font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Quick mark all */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500">Mark all as:</span>
            <button onClick={() => markAll('present')} className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-3 py-1.5 rounded-lg hover:bg-emerald-200 transition-colors">Present</button>
            <button onClick={() => markAll('absent')} className="text-xs bg-red-100 text-red-600 font-semibold px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors">Absent</button>
          </div>

          {/* Student list */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-50">
              {students.map(s => {
                const status = attendance[s.id]
                return (
                  <div key={s.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-xs text-gray-500 font-bold">{s.roll}</span>
                      <span className="font-medium text-gray-900 text-sm">{s.name}</span>
                    </div>
                    <div className="flex gap-2">
                      {(['present', 'late', 'absent'] as Status[]).map(st => (
                        <button key={st} onClick={() => mark(s.id, st)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${status === st
                          ? st === 'present' ? 'bg-emerald-500 text-white' : st === 'absent' ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
                          : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
                          {st.charAt(0).toUpperCase() + st.slice(1)}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <button
            onClick={() => setSubmitted(true)}
            disabled={unmarked > 0}
            className="mt-5 w-full flex items-center justify-center gap-2 bg-indigo-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 hover:bg-indigo-700 transition-colors"
          >
            <Send className="w-4 h-4" />
            {unmarked > 0 ? `Mark ${unmarked} more students first` : 'Submit Attendance & Notify Parents'}
          </button>
        </>
      ) : (
        <div className="bg-white rounded-2xl p-8 border border-emerald-200 text-center shadow-sm">
          <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-xl font-black text-gray-900 mb-2">Attendance Submitted!</h2>
          <p className="text-gray-600 text-sm mb-2">Class {selectedClass} • {new Date().toLocaleDateString('en-IN')}</p>
          <div className="flex justify-center gap-6 my-5">
            <div><div className="text-2xl font-black text-emerald-600">{present}</div><div className="text-xs text-gray-500">Present</div></div>
            <div><div className="text-2xl font-black text-red-500">{absent}</div><div className="text-xs text-gray-500">Absent</div></div>
            <div><div className="text-2xl font-black text-amber-500">{late}</div><div className="text-xs text-gray-500">Late</div></div>
          </div>
          <p className="text-xs text-gray-400">Parents of {absent} absent students have been notified via SMS and email.</p>
          <button onClick={() => { setSubmitted(false); setAttendance({}) }} className="mt-5 text-sm text-indigo-600 hover:underline">Take attendance for another class</button>
        </div>
      )}
    </div>
  )
}
