'use client'
import { useEffect, useState } from 'react'
import { Bell, Plus, Send, Users, GraduationCap, BookOpen, Loader2, Database } from 'lucide-react'

interface AnnouncementItem {
  id: string | number
  title: string
  body: string
  audience: string
  posted: string
  reach: number
  by: string
}

const mockAnnouncements: AnnouncementItem[] = [
  { id: 1, title: 'Annual Sports Day \u2014 March 15', body: 'All students must report by 7:30 AM in their house colours. Parents are welcome to attend.', audience: 'All', posted: 'Mar 3, 2026', reach: 1326, by: 'Principal' },
  { id: 2, title: 'Parent-Teacher Meeting', body: 'PTM scheduled for March 20. Online booking portal opens March 10. Please log in to book your slot.', audience: 'Parents', posted: 'Mar 2, 2026', reach: 845, by: 'Admin Office' },
  { id: 3, title: 'Board Exam Hall Tickets', body: 'Class 10 and 12 students: collect hall tickets from the office on March 5-6. Bring ID card.', audience: 'Students', posted: 'Mar 1, 2026', reach: 320, by: 'Exam Cell' },
  { id: 4, title: 'Staff Development Workshop', body: 'Mandatory workshop on AI tools in education on March 8, 9 AM \u2013 1 PM in the conference hall.', audience: 'Teachers', posted: 'Feb 28, 2026', reach: 78, by: 'HR Dept' },
]

const audienceConfig: Record<string, { color: string; icon: React.ElementType }> = {
  All: { color: 'bg-indigo-100 text-indigo-700', icon: Users },
  Parents: { color: 'bg-orange-100 text-orange-700', icon: Users },
  Students: { color: 'bg-teal-100 text-teal-700', icon: GraduationCap },
  Teachers: { color: 'bg-purple-100 text-purple-700', icon: BookOpen },
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', audience: 'All', channels: ['In-app'] })
  const [loading, setLoading] = useState(true)
  const [publishing, setPublishing] = useState(false)
  const [source, setSource] = useState<'db' | 'mock'>('mock')
  const [schoolId, setSchoolId] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const schoolRes = await fetch('/api/schools/first')
        if (!schoolRes.ok) throw new Error('No school')
        const school = await schoolRes.json()
        setSchoolId(school.id)

        const res = await fetch(`/api/announcements?schoolId=${school.id}`)
        if (!res.ok) throw new Error('Failed')
        const data = await res.json()

        if (data.announcements && data.announcements.length > 0) {
          const mapped: AnnouncementItem[] = data.announcements.map((a: any) => ({
            id: a.id,
            title: a.title,
            body: a.content || a.body || '',
            audience: Array.isArray(a.audience) ? (a.audience[0] || 'All') : (a.audience || 'All'),
            posted: new Date(a.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
            reach: a.reach || 0,
            by: a.createdBy || 'Admin',
          }))
          setAnnouncements(mapped)
          setSource('db')
        } else {
          throw new Error('No announcements')
        }
      } catch {
        setAnnouncements(mockAnnouncements)
        setSource('mock')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handlePublish = async () => {
    if (!form.title || !form.body) return

    if (source === 'db' && schoolId) {
      setPublishing(true)
      try {
        const res = await fetch('/api/announcements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            schoolId,
            title: form.title,
            content: form.body,
            audience: [form.audience],
            priority: 'normal',
            createdBy: 'Admin',
          }),
        })
        if (res.ok) {
          const data = await res.json()
          const newItem: AnnouncementItem = {
            id: data.announcement.id,
            title: form.title,
            body: form.body,
            audience: form.audience,
            posted: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
            reach: 0,
            by: 'Admin',
          }
          setAnnouncements(prev => [newItem, ...prev])
        }
      } catch (err) {
        console.error('Failed to publish announcement:', err)
      } finally {
        setPublishing(false)
      }
    } else {
      // Mock: just add to local state
      setAnnouncements(prev => [{
        id: Date.now(),
        title: form.title,
        body: form.body,
        audience: form.audience,
        posted: new Date().toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
        reach: 0,
        by: 'Admin',
      }, ...prev])
    }

    setForm({ title: '', body: '', audience: 'All', channels: ['In-app'] })
    setShowForm(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        <span className="ml-2 text-gray-500">Loading announcements...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><Bell className="w-7 h-7 text-indigo-600" /> Announcements</h1>
          <p className="text-gray-500 mt-1">Broadcast to students, parents, teachers, or all</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`flex items-center gap-1 text-[10px] font-medium px-2 py-1 rounded-full ${source === 'db' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            <Database className="w-3 h-3" />
            {source === 'db' ? 'Live' : 'Mock'}
          </span>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> New Announcement
          </button>
        </div>
      </div>

      {/* Compose form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm mb-6">
          <h2 className="font-bold text-gray-900 mb-4">New Announcement</h2>
          <div className="space-y-4">
            <input type="text" placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            <textarea rows={4} placeholder="Message body..." value={form.body} onChange={e => setForm({...form, body: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
            <div className="flex flex-wrap gap-3">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Audience</label>
                <select value={form.audience} onChange={e => setForm({...form, audience: e.target.value})} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  {['All', 'Students', 'Parents', 'Teachers'].map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Channels</label>
                <div className="flex gap-2">
                  {['In-app', 'Email', 'WhatsApp', 'SMS'].map(ch => (
                    <label key={ch} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={form.channels.includes(ch)} onChange={e => setForm({...form, channels: e.target.checked ? [...form.channels, ch] : form.channels.filter(c => c !== ch)})} className="rounded" />
                      {ch}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={handlePublish} disabled={publishing} className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm disabled:opacity-50">
                {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {publishing ? 'Publishing...' : 'Publish Now'}
              </button>
              <button className="text-sm border border-gray-200 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50">Save Draft</button>
            </div>
          </div>
        </div>
      )}

      {/* Announcement list */}
      <div className="space-y-4">
        {announcements.map(a => {
          const cfg = audienceConfig[a.audience] || audienceConfig['All']
          return (
            <div key={a.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900">{a.title}</h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ml-2 ${cfg.color}`}>{a.audience}</span>
              </div>
              <p className="text-sm text-gray-600 mb-3 leading-relaxed">{a.body}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Posted: {a.posted}</span>
                <span>By: {a.by}</span>
                <span>Reached: {a.reach.toLocaleString()} recipients</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
