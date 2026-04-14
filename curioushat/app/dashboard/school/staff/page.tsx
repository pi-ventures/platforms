'use client'
import { useEffect, useState } from 'react'
import { Users, Search, Plus, Loader2, Database } from 'lucide-react'

interface StaffMember {
  id: string
  name: string
  role: string
  dept: string
  exp: string
  classes: string
  phone: string
  status: 'active' | 'on_leave'
  joined: string
}

const mockStaff: StaffMember[] = [
  { id: 'ST001', name: 'Ms. Priya Gupta', role: 'Physics Teacher', dept: 'Science', exp: '8 yrs', classes: '9A, 10A, 10B', phone: '98765 43210', status: 'active', joined: 'Jun 2018' },
  { id: 'ST002', name: 'Mr. Ramesh Sharma', role: 'Mathematics Teacher', dept: 'Mathematics', exp: '15 yrs', classes: '8A, 9A, 10A', phone: '87654 32109', status: 'active', joined: 'Jul 2011' },
  { id: 'ST003', name: 'Ms. Ananya Iyer', role: 'Chemistry Teacher', dept: 'Science', exp: '5 yrs', classes: '9B, 10A, 10B', phone: '76543 21098', status: 'active', joined: 'Aug 2021' },
  { id: 'ST004', name: 'Mr. Kunal Verma', role: 'English Teacher', dept: 'Languages', exp: '12 yrs', classes: '10A, 11A, 12A', phone: '65432 10987', status: 'on_leave', joined: 'May 2014' },
  { id: 'ST005', name: 'Ms. Deepika Nair', role: 'Biology Teacher', dept: 'Science', exp: '7 yrs', classes: '9A, 10B, 11B', phone: '54321 09876', status: 'active', joined: 'Jun 2019' },
  { id: 'ST006', name: 'Mr. Suresh Kumar', role: 'Computer Science', dept: 'Technology', exp: '3 yrs', classes: '8A, 9A, 10A', phone: '43210 98765', status: 'active', joined: 'Jan 2026' },
]

export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [loading, setLoading] = useState(true)
  const [source, setSource] = useState<'db' | 'mock'>('mock')

  useEffect(() => {
    async function load() {
      try {
        const schoolRes = await fetch('/api/schools/first')
        if (!schoolRes.ok) throw new Error('No school')
        const school = await schoolRes.json()

        const res = await fetch(`/api/teachers/school/${school.id}`)
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()

        if (data.teachers && data.teachers.length > 0) {
          const mapped: StaffMember[] = data.teachers.map((t: any) => {
            const classAssignments = t.classAssignments?.map((ca: any) => `${ca.grade}${ca.section}`).join(', ') || ''
            const subjects = Array.isArray(t.subjects) ? t.subjects.join(', ') : (t.specialization || 'Teacher')

            return {
              id: t.employeeId || t.id,
              name: t.name,
              role: subjects,
              dept: t.specialization || t.qualification || 'General',
              exp: t.experience ? `${t.experience} yrs` : 'N/A',
              classes: classAssignments || 'N/A',
              phone: t.phone || 'N/A',
              status: 'active' as const,
              joined: t.joinDate ? new Date(t.joinDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : 'N/A',
            }
          })
          setStaff(mapped)
          setSource('db')
        } else {
          throw new Error('No teachers')
        }
      } catch {
        setStaff(mockStaff)
        setSource('mock')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-500">Loading staff directory...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><Users className="w-7 h-7 text-indigo-600" /> Staff & HR</h1>
          <p className="text-gray-500 mt-1">{staff.length} teaching staff members</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${source === 'db' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            <Database className="w-3 h-3" />
            {source === 'db' ? 'Live' : 'Mock'}
          </span>
          <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Staff
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {staff.map(s => (
          <div key={s.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-sm">
                  {s.name.split(' ').slice(-1)[0][0]}{s.name.split(' ')[s.name.split(' ').length > 2 ? 1 : 0][0]}
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-sm">{s.name}</p>
                  <p className="text-xs text-indigo-600 font-medium">{s.role}</p>
                </div>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${s.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {s.status === 'active' ? 'Active' : 'On Leave'}
              </span>
            </div>
            <div className="space-y-1.5 text-xs text-gray-500">
              <div className="flex justify-between"><span>Department</span><span className="font-medium text-gray-700">{s.dept}</span></div>
              <div className="flex justify-between"><span>Experience</span><span className="font-medium text-gray-700">{s.exp}</span></div>
              <div className="flex justify-between"><span>Classes</span><span className="font-medium text-gray-700">{s.classes}</span></div>
              <div className="flex justify-between"><span>Joined</span><span className="font-medium text-gray-700">{s.joined}</span></div>
            </div>
            <div className="mt-4 flex gap-2">
              <button className="flex-1 text-xs border border-gray-200 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">View Profile</button>
              <button className="flex-1 text-xs bg-indigo-50 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors">Leave</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
