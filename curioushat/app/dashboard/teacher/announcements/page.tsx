'use client'
import { useState } from 'react'
import { Bell, Plus, Send, Users, X, CheckCircle2, Eye } from 'lucide-react'

const existingAnnouncements = [
  { id: 1, title: 'Pre-Board Exam: Important Instructions', audience: 'Class 10A, 10B', date: 'Mar 3, 2026', views: 47, status: 'sent', body: 'Students appearing in Physics Pre-Board exam on March 22 must bring their admit cards and a blue/black pen. Calculators are not permitted. Report by 8:45 AM.' },
  { id: 2, title: 'Lab Schedule Changed — March 7', audience: 'Class 9A', date: 'Feb 28, 2026', views: 31, status: 'sent', body: 'The Physics lab session for Class 9A scheduled on March 7 (Friday) has been moved to March 8 (Saturday) at 10 AM. Please bring your lab manuals.' },
  { id: 3, title: 'Question Bank: Chapter 12 Added', audience: 'Class 10A, 10B, 10C', date: 'Feb 25, 2026', views: 89, status: 'sent', body: 'I have added 40 new questions for Chapter 12 (Electricity) to the Question Bank on CuriousHat.ai. Students should attempt these for Pre-Board preparation.' },
  { id: 4, title: 'Term 2 Marks Submission Reminder', audience: 'Admin', date: 'Feb 20, 2026', views: 3, status: 'draft', body: 'Draft: Reminder to self — submit Term 2 marks to admin by March 7.' },
]

const classes = ['Class 9A', 'Class 10A', 'Class 10B', 'Class 10C', 'All Classes', 'Admin']

export default function TeacherAnnouncementsPage() {
  const [showCompose, setShowCompose] = useState(false)
  const [expanded, setExpanded] = useState<number | null>(null)
  const [form, setForm] = useState({ title: '', body: '', audience: 'Class 10A' })
  const [announcements, setAnnouncements] = useState(existingAnnouncements)
  const [sent, setSent] = useState(false)

  const handlePost = () => {
    if (!form.title.trim() || !form.body.trim()) return
    const newAnn = {
      id: announcements.length + 1,
      title: form.title,
      audience: form.audience,
      date: 'Just now',
      views: 0,
      status: 'sent',
      body: form.body,
    }
    setAnnouncements(prev => [newAnn, ...prev])
    setForm({ title: '', body: '', audience: 'Class 10A' })
    setSent(true)
    setTimeout(() => { setSent(false); setShowCompose(false) }, 1500)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Bell className="w-7 h-7 text-purple-600" /> Announcements
          </h1>
          <p className="text-gray-500 mt-1">Post updates to your classes and parents</p>
        </div>
        <button onClick={() => { setShowCompose(true); setSent(false) }} className="flex items-center gap-2 bg-purple-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-purple-700 transition-colors">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Compose panel */}
      {showCompose && (
        <div className="bg-white rounded-2xl border-2 border-purple-200 shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Compose Announcement</h2>
            <button onClick={() => setShowCompose(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
          </div>
          {sent ? (
            <div className="flex flex-col items-center py-6 text-center">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mb-3" />
              <p className="font-bold text-gray-900">Announcement Posted!</p>
              <p className="text-sm text-gray-500 mt-1">Students and parents will receive a notification.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Title</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Exam schedule changed for March 15" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Send to</label>
                <div className="flex gap-2 flex-wrap">
                  {classes.map(c => (
                    <button key={c} onClick={() => setForm({ ...form, audience: c })} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${form.audience === c ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-purple-50'}`}>{c}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
                <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Type your announcement here..." rows={4} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none resize-none" />
              </div>
              <div className="flex gap-3">
                <button onClick={handlePost} disabled={!form.title.trim() || !form.body.trim()} className="flex items-center gap-2 bg-purple-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors text-sm">
                  <Send className="w-4 h-4" /> Post Announcement
                </button>
                <button onClick={() => setShowCompose(false)} className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List */}
      <div className="space-y-3">
        {announcements.map(a => (
          <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setExpanded(expanded === a.id ? null : a.id)}>
            <div className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${a.status === 'sent' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>{a.status}</span>
                    <span className="text-xs text-gray-400">{a.date}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 text-sm">{a.title}</h3>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{a.audience}</span>
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{a.views} views</span>
                  </div>
                </div>
              </div>
              {expanded === a.id && (
                <p className="text-sm text-gray-600 mt-4 pt-4 border-t border-gray-100 leading-relaxed">{a.body}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
