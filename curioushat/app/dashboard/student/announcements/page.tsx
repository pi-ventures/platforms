'use client'
import { useState } from 'react'
import { Bell, BookOpen, Trophy, Megaphone, Calendar, Pin, Search } from 'lucide-react'

const announcements = [
  { id: 1, title: 'Pre-Board Examination Schedule Released', category: 'Academic', priority: 'high', date: 'Mar 3, 2026', pinned: true, read: false, body: 'Pre-Board exams for Class 10 will be held from March 18–28, 2026. All students must report by 8:45 AM. Admit cards to be collected from the class teacher by March 15.' },
  { id: 2, title: 'Annual Sports Day — March 15, 2026', category: 'Sports', priority: 'high', date: 'Mar 2, 2026', pinned: true, read: false, body: 'All students must report to the school ground by 7:30 AM in their house colours. Events include 100m sprint, relay, shot put, long jump, and inter-house tug of war. Parents are welcome.' },
  { id: 3, title: 'Science Exhibition: Project Submission Deadline', category: 'Academic', priority: 'medium', date: 'Mar 1, 2026', pinned: false, read: false, body: 'Students participating in the Inter-School Science Exhibition must submit their project abstracts by March 7. Final projects to be displayed on March 22. Contact Ms. Gupta (Physics) for registration.' },
  { id: 4, title: 'Parent-Teacher Meeting — Online Booking Open', category: 'Events', priority: 'medium', date: 'Feb 28, 2026', pinned: false, read: true, body: 'PTM is scheduled for March 20, 2026 (Saturday) from 9 AM to 1 PM. Parents can book a 15-minute slot with each subject teacher via the Parent Portal. Booking opens March 10.' },
  { id: 5, title: 'Library — New Books Added', category: 'General', priority: 'low', date: 'Feb 25, 2026', pinned: false, read: true, body: 'The school library has added 120 new titles including NCERT reference books, competitive exam guides, and fiction. Students can borrow up to 3 books at a time. Library timings: 8 AM–4 PM.' },
  { id: 6, title: 'Holiday: Holi — March 14', category: 'General', priority: 'low', date: 'Feb 20, 2026', pinned: false, read: true, body: 'School will remain closed on March 14, 2026 (Friday) on account of Holi. Regular classes resume on March 18 with the commencement of Pre-Board examinations.' },
  { id: 7, title: 'CuriousHat AI Tutor — Now Available on Mobile', category: 'Tech', priority: 'low', date: 'Feb 18, 2026', pinned: false, read: true, body: 'The CuriousHat AI Tutor app is now available on Android and iOS. Students can ask questions, upload textbook images, and get instant explanations. Download using your school email for free access.' },
]

const categoryConfig: Record<string, { color: string; icon: React.ElementType }> = {
  Academic: { color: 'bg-indigo-100 text-indigo-700', icon: BookOpen },
  Sports: { color: 'bg-emerald-100 text-emerald-700', icon: Trophy },
  Events: { color: 'bg-purple-100 text-purple-700', icon: Calendar },
  General: { color: 'bg-gray-100 text-gray-600', icon: Megaphone },
  Tech: { color: 'bg-blue-100 text-blue-700', icon: Bell },
}

export default function StudentAnnouncementsPage() {
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
            <Bell className="w-7 h-7 text-indigo-600" /> Announcements
          </h1>
          <p className="text-gray-500 mt-1">
            {unread > 0 ? <span className="text-indigo-600 font-semibold">{unread} unread</span> : 'All caught up!'} · Bright Future International School
          </p>
        </div>
        {unread > 0 && (
          <button onClick={() => setReadState(Object.fromEntries(announcements.map(a => [a.id, true])))} className="text-xs text-indigo-600 hover:underline mt-1">
            Mark all as read
          </button>
        )}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search announcements..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setFilter(c)} className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${filter === c ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-indigo-50'}`}>{c}</button>
          ))}
        </div>
      </div>

      {/* Announcements */}
      <div className="space-y-3">
        {filtered.map(a => {
          const cat = categoryConfig[a.category] || categoryConfig['General']
          const CatIcon = cat.icon
          const isRead = readState[a.id]
          const isExpanded = expanded === a.id
          return (
            <div key={a.id} className={`bg-white rounded-2xl border transition-all cursor-pointer ${isRead ? 'border-gray-100' : 'border-indigo-200 shadow-sm'}`} onClick={() => toggle(a.id)}>
              <div className="p-4 flex items-start gap-3">
                {a.pinned && <Pin className="w-3.5 h-3.5 text-amber-500 mt-1 flex-shrink-0" />}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${cat.color}`}>
                  <CatIcon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className={`text-sm font-semibold ${isRead ? 'text-gray-700' : 'text-gray-900'} leading-snug`}>{a.title}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {!isRead && <span className="w-2 h-2 bg-indigo-500 rounded-full" />}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.color}`}>{a.category}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{a.date}</p>
                  {isExpanded && (
                    <p className="text-sm text-gray-600 mt-3 leading-relaxed border-t border-gray-100 pt-3">{a.body}</p>
                  )}
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Bell className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No announcements found</p>
          </div>
        )}
      </div>
    </div>
  )
}
