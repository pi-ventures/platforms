'use client'

import { useState } from 'react'
import { ClipboardCheck, UserCheck, UserX, Clock, MessageSquare, CheckCircle2, Send } from 'lucide-react'

type Status = 'present' | 'absent' | 'late' | null

interface Student {
  id: string
  name: string
  rollNo: string
  parentPhone: string
}

const batches = ['JEE 2027 Dropper', 'JEE 2027 Kota', 'NEET 2027', 'NEET 2027 Dropper', 'CLAT 2027', 'CA Foundation']

const batchStudents: Record<string, Student[]> = {
  'JEE 2027 Dropper': [
    { id: '1', name: 'Rohan Sharma', rollNo: 'JD-001', parentPhone: '98765 43210' },
    { id: '2', name: 'Karthik Iyer', rollNo: 'JD-002', parentPhone: '87654 32109' },
    { id: '3', name: 'Vikram Joshi', rollNo: 'JD-003', parentPhone: '76543 21098' },
    { id: '4', name: 'Aditya Kulkarni', rollNo: 'JD-004', parentPhone: '65432 10987' },
    { id: '5', name: 'Rahul Yadav', rollNo: 'JD-005', parentPhone: '54321 09876' },
    { id: '6', name: 'Saurabh Tiwari', rollNo: 'JD-006', parentPhone: '98712 34567' },
    { id: '7', name: 'Manish Dubey', rollNo: 'JD-007', parentPhone: '87612 34567' },
    { id: '8', name: 'Nitin Agarwal', rollNo: 'JD-008', parentPhone: '76512 34567' },
    { id: '9', name: 'Pankaj Mishra', rollNo: 'JD-009', parentPhone: '65412 34567' },
    { id: '10', name: 'Ankit Saxena', rollNo: 'JD-010', parentPhone: '54312 34567' },
    { id: '11', name: 'Deepak Pandey', rollNo: 'JD-011', parentPhone: '98234 56789' },
    { id: '12', name: 'Gaurav Sinha', rollNo: 'JD-012', parentPhone: '87234 56789' },
  ],
  'NEET 2027': [
    { id: '1', name: 'Kavya Krishnan', rollNo: 'NR-001', parentPhone: '91234 56780' },
    { id: '2', name: 'Siddharth Rao', rollNo: 'NR-002', parentPhone: '91234 56781' },
    { id: '3', name: 'Harsh Pandey', rollNo: 'NR-003', parentPhone: '91234 56782' },
    { id: '4', name: 'Shruti Mishra', rollNo: 'NR-004', parentPhone: '91234 56783' },
    { id: '5', name: 'Tanvi Kapoor', rollNo: 'NR-005', parentPhone: '91234 56784' },
    { id: '6', name: 'Ishita Jain', rollNo: 'NR-006', parentPhone: '91234 56785' },
    { id: '7', name: 'Prachi Bhatt', rollNo: 'NR-007', parentPhone: '91234 56786' },
    { id: '8', name: 'Ankur Mehra', rollNo: 'NR-008', parentPhone: '91234 56787' },
    { id: '9', name: 'Swati Pillai', rollNo: 'NR-009', parentPhone: '91234 56788' },
    { id: '10', name: 'Rohini Das', rollNo: 'NR-010', parentPhone: '91234 56789' },
    { id: '11', name: 'Varun Sethi', rollNo: 'NR-011', parentPhone: '91234 56790' },
    { id: '12', name: 'Megha Thakur', rollNo: 'NR-012', parentPhone: '91234 56791' },
  ],
}

// Generate placeholder students for batches not explicitly defined
function getStudents(batch: string): Student[] {
  if (batchStudents[batch]) return batchStudents[batch]
  return Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1),
    name: `Student ${i + 1}`,
    rollNo: `${batch.slice(0, 2).toUpperCase()}-${String(i + 1).padStart(3, '0')}`,
    parentPhone: `9${Math.floor(1000000000 + Math.random() * 8999999999).toString().slice(0, 4)} ${Math.floor(10000 + Math.random() * 89999)}`,
  }))
}

const todayStr = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

export default function AttendancePage() {
  const [activeBatch, setActiveBatch] = useState(batches[0])
  const [attendance, setAttendance] = useState<Record<string, Record<string, Status>>>({})
  const [submitted, setSubmitted] = useState<Record<string, boolean>>({})

  const students = getStudents(activeBatch)
  const batchAttendance = attendance[activeBatch] ?? {}
  const isSubmitted = submitted[activeBatch] ?? false

  const setStatus = (studentId: string, status: Status) => {
    if (isSubmitted) return
    setAttendance(prev => ({
      ...prev,
      [activeBatch]: { ...(prev[activeBatch] ?? {}), [studentId]: status },
    }))
  }

  const markAllPresent = () => {
    if (isSubmitted) return
    const all: Record<string, Status> = {}
    students.forEach(s => { all[s.id] = 'present' })
    setAttendance(prev => ({ ...prev, [activeBatch]: all }))
  }

  const handleSubmit = () => {
    const allMarked = students.every(s => batchAttendance[s.id] != null)
    if (!allMarked) return
    setSubmitted(prev => ({ ...prev, [activeBatch]: true }))
  }

  const presentCount = students.filter(s => batchAttendance[s.id] === 'present').length
  const absentCount = students.filter(s => batchAttendance[s.id] === 'absent').length
  const lateCount = students.filter(s => batchAttendance[s.id] === 'late').length
  const unmarkedCount = students.filter(s => batchAttendance[s.id] == null).length

  const statusBtn = (studentId: string, status: Status, label: string, activeClass: string, inactiveClass: string, icon: React.ReactNode) => {
    const isActive = batchAttendance[studentId] === status
    return (
      <button
        onClick={() => setStatus(studentId, status)}
        disabled={isSubmitted}
        className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
          isActive ? activeClass : inactiveClass
        } ${isSubmitted ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        {icon} {label}
      </button>
    )
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ClipboardCheck className="w-7 h-7 text-violet-600" /> Attendance
          </h1>
          <p className="text-gray-500 text-sm mt-1">{todayStr}</p>
        </div>
      </div>

      {/* Batch Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-5">
        {batches.map(b => (
          <button
            key={b}
            onClick={() => setActiveBatch(b)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              activeBatch === b ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {b}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <UserCheck className="w-4 h-4" />
            <span className="text-xs font-semibold">Present</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{presentCount}<span className="text-sm font-medium text-gray-400">/{students.length}</span></p>
        </div>
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
          <div className="flex items-center gap-2 text-red-500 mb-1">
            <UserX className="w-4 h-4" />
            <span className="text-xs font-semibold">Absent</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{absentCount}</p>
        </div>
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Clock className="w-4 h-4" />
            <span className="text-xs font-semibold">Late</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{lateCount}</p>
        </div>
        <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
          <div className="flex items-center gap-2 text-violet-600 mb-1">
            <ClipboardCheck className="w-4 h-4" />
            <span className="text-xs font-semibold">Unmarked</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{unmarkedCount}</p>
        </div>
      </div>

      {/* Action Buttons */}
      {!isSubmitted && (
        <div className="flex gap-3 mb-5">
          <button onClick={markAllPresent} className="flex items-center gap-2 bg-emerald-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-emerald-700 transition-colors">
            <CheckCircle2 className="w-4 h-4" /> Mark All Present
          </button>
        </div>
      )}

      {/* Submitted Banner */}
      {isSubmitted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-emerald-800">Attendance submitted for {activeBatch}</p>
            <p className="text-xs text-emerald-600 mt-0.5">
              {presentCount} present, {absentCount} absent, {lateCount} late. SMS sent to {absentCount} absent students&apos; parents.
            </p>
          </div>
        </div>
      )}

      {/* Student List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3">Roll No</th>
                <th className="px-5 py-3">Student</th>
                <th className="px-5 py-3">Parent Phone</th>
                <th className="px-5 py-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map(s => (
                <tr key={s.id} className={`transition-colors ${
                  batchAttendance[s.id] === 'absent' ? 'bg-red-50/50' :
                  batchAttendance[s.id] === 'late' ? 'bg-amber-50/50' :
                  batchAttendance[s.id] === 'present' ? 'bg-emerald-50/30' : ''
                }`}>
                  <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">{s.rollNo}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{s.name}</td>
                  <td className="px-5 py-3.5 text-gray-500">{s.parentPhone}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {statusBtn(s.id, 'present', 'Present', 'bg-emerald-600 text-white', 'bg-gray-100 text-gray-500 hover:bg-emerald-50 hover:text-emerald-600', <UserCheck className="w-3.5 h-3.5" />)}
                      {statusBtn(s.id, 'absent', 'Absent', 'bg-red-500 text-white', 'bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500', <UserX className="w-3.5 h-3.5" />)}
                      {statusBtn(s.id, 'late', 'Late', 'bg-amber-500 text-white', 'bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-600', <Clock className="w-3.5 h-3.5" />)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submit Button */}
      {!isSubmitted && (
        <div className="flex justify-end mt-5">
          <button
            onClick={handleSubmit}
            disabled={unmarkedCount > 0}
            className={`flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors ${
              unmarkedCount > 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-violet-600 text-white hover:bg-violet-700'
            }`}
          >
            <Send className="w-4 h-4" /> Submit & Notify Parents
            {unmarkedCount > 0 && <span className="text-xs">({unmarkedCount} unmarked)</span>}
          </button>
        </div>
      )}
    </div>
  )
}
