'use client'
import { useState } from 'react'
import { Bell, BookOpen, Trophy, Calendar, Megaphone, Pin, Search } from 'lucide-react'

const announcements = [
  { id: 1, title: 'Pre-Board Exam Schedule — Class 10', category: 'Academic', date: 'Mar 3, 2026', pinned: true, read: false, body: 'Pre-Board examinations for Class 10 will be held March 18–28, 2026. Students must report by 8:45 AM with their admit cards. Admit cards will be distributed by class teachers on March 15. Study leave begins March 16.' },
  { id: 2, title: 'Annual Sports Day — March 15', category: 'Events', date: 'Mar 2, 2026', pinned: true, read: false, body: 'Annual Sports Day will be held on March 15 at the school ground. All parents are cordially invited. Programme begins at 8:30 AM. Students must report in their house colours by 7:30 AM. Prize distribution at 12 noon.' },
  { id: 3, title: 'Parent-Teacher Meeting — March 20', category: 'Events', date: 'Feb 28, 2026', pinned: false, read: false, body: 'PTM for Classes 9–12 is scheduled for Saturday, March 20 from 9 AM to 1 PM. Online slot booking opens March 10 via the Parent Portal. Each session is 15 minutes per subject teacher. Please carry the Term 2 report card.' },
  { id: 4, title: 'Fee Reminder: March Installment Due March 15', category: 'Finance', date: 'Feb 25, 2026', pinned: false, read: true, body: 'The March miscellaneous fee installment of ₹2,000 is due by March 15, 2026. Payments can be made online via the Parent Portal (Fees section) or at the school accounts office on weekdays between 9 AM and 1 PM.' },
  { id: 5, title: 'Holi Holiday — March 14', category: 'General', date: 'Feb 20, 2026', pinned: false, read: true, body: 'School will remain closed on Friday, March 14 on account of Holi. Pre-Board examinations will begin as scheduled on March 18. Students are advised to utilise the long weekend for revision.' },
  { id: 6, title: 'Term 2 Report Cards Available', category: 'Academic', date: 'Feb 15, 2026', pinned: false, read: true, body: 'Term 2 report cards for all students have been published on the Parent Portal. Parents are requested to review the report card, sign the acknowledgement slip, and return it to the class teacher by February 22.' },
]

const categoryConfig: Record<string, { color: string; icon: React.ElementType }> = {
  Academic: { color: 'bg-indigo-100 text-indigo-700', icon: BookOpen },
  Sports: { color: 'bg-emerald-100 text-emerald-700', icon: Trophy },
  Events: { color: 'bg-purple-100 text-purple-700', icon: Calendar },
  Finance: { color: 'bg-orange-100 text-orange-700', icon: Bell },
  General: { color: 'bg-gray-100 text-gray-600', icon: Megaphone },
}

export default function ParentAnnouncementsPage() {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [readState, setReadState] = useState<Record<number, boolean>>(
    Object.fromEntries(announcements.map(a => [a.id, a.read]))
  )
  const [expanded, setExpanded] = useState<number | null>(null)

  const categories = ['All', ...Array.from(new Set(announcements.map(a => a.category)))]

  const filtered = announcements.filter(a => {
    const matchSearch = a.title.toLowerCase().includes(search.toLowerCase())
    const matchFilter = filter === 'All' || a.category === filter
    return matchSearch && matchFilter
  })

  const unread = Object.values(readState).filter(v => !v).length

  const toggle = (id: number) => {
    setExpanded(expanded === id ? null : id)
    setReadState(prev => ({ ...prev, [id]: true }))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Bell className="w-7 h-7 text-orange-500" /> School Announcements
          </h1>
          <p className="text-gray-500 mt-1">
            {unread > 0 ? <span className="text-orange-600 font-semibold">{unread} unread</span> : 'All caught up!'} · Bright Future International School
          </p>
        </div>
        {unread > 0 && (
          <button onClick={() => setReadState(Object.fromEntries(announcements.map(a => [a.id, true])))} className="text-xs text-orange-600 hover:underline mt-1">
            Mark all read
          </button>
        )}
      </div>

      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-orange-400 outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${filter === c ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-orange-50'}`}>{c}</button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map(a => {
          const cat = categoryConfig[a.category] || categoryConfig['General']
          const CatIcon = cat.icon
          const isRead = readState[a.id]
          return (
            <div key={a.id} className={`bg-white rounded-2xl border transition-all cursor-pointer ${isRead ? 'border-gray-100' : 'border-orange-200 shadow-sm'}`} onClick={() => toggle(a.id)}>
              <div className="p-4 flex items-start gap-3">
                {a.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 mt-1 flex-shrink-0" />}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm font-semibold ${isRead ? 'text-gray-700' : 'text-gray-900'} leading-snug`}>{a.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!isRead && <span className="w-2 h-2 bg-orange-500 rounded-full" />}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.color}`}>{a.category}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{a.date}</p>
                  {expanded === a.id && (
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed border-t border-gray-100 pt-3">{a.body}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
