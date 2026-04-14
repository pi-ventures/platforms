'use client'

import { useState } from 'react'
import { Megaphone, Send, MessageSquare, Smartphone, Bell, Users, Calendar, Eye, ChevronDown, Plus, CheckCircle2 } from 'lucide-react'

const audiences = ['All Batches', 'JEE Batches', 'NEET Batches', 'CLAT Batch', 'CA Foundation', 'NDA Batch', 'Parents Only', 'Faculty Only']
const channels = [
  { key: 'inapp', label: 'In-App', icon: <Bell className="w-3.5 h-3.5" /> },
  { key: 'whatsapp', label: 'WhatsApp', icon: <MessageSquare className="w-3.5 h-3.5" /> },
  { key: 'sms', label: 'SMS', icon: <Smartphone className="w-3.5 h-3.5" /> },
]

interface Announcement {
  id: string
  title: string
  body: string
  audience: string
  channels: string[]
  postedBy: string
  date: string
  reach: number
  priority: 'normal' | 'urgent' | 'info'
}

const mockAnnouncements: Announcement[] = [
  {
    id: 'A01',
    title: 'Schedule Change: JEE Physics Batch',
    body: 'Due to Holi celebrations, the Physics lecture on 14th March has been rescheduled to 16th March, 10:00 AM. Same classroom — Hall B. Please update your timetables accordingly.',
    audience: 'JEE Batches',
    channels: ['In-App', 'WhatsApp'],
    postedBy: 'Rajesh Verma Sir',
    date: '12 Mar 2026',
    reach: 187,
    priority: 'urgent',
  },
  {
    id: 'A02',
    title: 'Doubt Session: Organic Chemistry',
    body: 'Special doubt clearing session for GOC and Isomerism on Saturday, 15th March from 4:00 PM to 6:00 PM. Open to all JEE and NEET batches. Bring your specific doubts noted down. Neha Ma\'am will be taking the session.',
    audience: 'All Batches',
    channels: ['In-App', 'WhatsApp', 'SMS'],
    postedBy: 'Neha Kapoor Ma\'am',
    date: '10 Mar 2026',
    reach: 342,
    priority: 'info',
  },
  {
    id: 'A03',
    title: 'Mock Test Reminder: NEET Full Syllabus #3',
    body: 'NEET Full Syllabus Mock Test #3 is scheduled for Sunday, 22nd March at 9:00 AM sharp. Duration: 3 hours 20 minutes. Carry your admit card and black ballpoint pen. No electronic devices allowed inside the hall.',
    audience: 'NEET Batches',
    channels: ['In-App', 'WhatsApp', 'SMS'],
    postedBy: 'Admin',
    date: '8 Mar 2026',
    reach: 156,
    priority: 'normal',
  },
  {
    id: 'A04',
    title: 'Result Declaration: JEE Mock Test 2',
    body: 'Results for JEE Mock Test 2 have been declared. Check the Results section for detailed analysis. Top 3: Arjun Reddy (254/300), Sneha Patel (248/300), Priya Menon (231/300). Individual scorecards with topic-wise analysis sent to student accounts.',
    audience: 'JEE Batches',
    channels: ['In-App'],
    postedBy: 'Admin',
    date: '5 Mar 2026',
    reach: 198,
    priority: 'normal',
  },
  {
    id: 'A05',
    title: 'Fee Reminder: Q2 Installment Due',
    body: 'This is a reminder that the Q2 fee installment (April-June 2026) of Rs. 45,000 is due by 31st March 2026. Please ensure timely payment to avoid late fee charges. Pay online via the fee portal or at the accounts office. For EMI options, contact the admin desk.',
    audience: 'Parents Only',
    channels: ['WhatsApp', 'SMS'],
    postedBy: 'Accounts Dept',
    date: '1 Mar 2026',
    reach: 423,
    priority: 'urgent',
  },
]

const priorityStyles: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  normal: 'bg-violet-100 text-violet-700',
  info: 'bg-blue-100 text-blue-700',
}

const channelBadge: Record<string, string> = {
  'In-App': 'bg-violet-100 text-violet-700',
  'WhatsApp': 'bg-emerald-100 text-emerald-700',
  'SMS': 'bg-amber-100 text-amber-700',
}

export default function CoachingAnnouncementsPage() {
  const [showCompose, setShowCompose] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [selectedAudience, setSelectedAudience] = useState(audiences[0])
  const [selectedChannels, setSelectedChannels] = useState<string[]>(['inapp'])
  const [announcements, setAnnouncements] = useState(mockAnnouncements)
  const [sent, setSent] = useState(false)

  const toggleChannel = (key: string) => {
    setSelectedChannels(prev =>
      prev.includes(key) ? prev.filter(c => c !== key) : [...prev, key]
    )
  }

  const handleSend = () => {
    if (!title.trim() || !body.trim() || selectedChannels.length === 0) return
    const channelLabels = selectedChannels.map(k => channels.find(c => c.key === k)?.label ?? k)
    const newAnnouncement: Announcement = {
      id: `A${String(announcements.length + 1).padStart(2, '0')}`,
      title: title.trim(),
      body: body.trim(),
      audience: selectedAudience,
      channels: channelLabels,
      postedBy: 'You',
      date: 'Just now',
      reach: 0,
      priority: 'normal',
    }
    setAnnouncements([newAnnouncement, ...announcements])
    setTitle('')
    setBody('')
    setSelectedChannels(['inapp'])
    setSelectedAudience(audiences[0])
    setSent(true)
    setTimeout(() => { setSent(false); setShowCompose(false) }, 2000)
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-violet-600" /> Announcements
          </h1>
          <p className="text-gray-500 text-sm mt-1">Batch-wise announcements and notifications</p>
        </div>
        <button
          onClick={() => setShowCompose(!showCompose)}
          className="flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-violet-700 transition-colors"
        >
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Compose Form */}
      {showCompose && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          {sent ? (
            <div className="flex items-center gap-3 py-4 justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              <p className="text-sm font-semibold text-emerald-800">Announcement sent successfully!</p>
            </div>
          ) : (
            <>
              <h2 className="text-sm font-bold text-gray-900 mb-4">Compose Announcement</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Title</label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Schedule change for Physics batch"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Message</label>
                  <textarea
                    value={body}
                    onChange={e => setBody(e.target.value)}
                    rows={4}
                    placeholder="Write the announcement body..."
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 resize-none"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Audience</label>
                    <div className="relative">
                      <select
                        value={selectedAudience}
                        onChange={e => setSelectedAudience(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 focus:border-violet-400 appearance-none bg-white"
                      >
                        {audiences.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">Channels</label>
                    <div className="flex gap-2">
                      {channels.map(ch => (
                        <button
                          key={ch.key}
                          onClick={() => toggleChannel(ch.key)}
                          className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2.5 rounded-xl border transition-colors ${
                            selectedChannels.includes(ch.key)
                              ? 'bg-violet-600 text-white border-violet-600'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300'
                          }`}
                        >
                          {ch.icon} {ch.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    onClick={() => setShowCompose(false)}
                    className="text-sm font-semibold text-gray-500 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSend}
                    disabled={!title.trim() || !body.trim() || selectedChannels.length === 0}
                    className={`flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors ${
                      title.trim() && body.trim() && selectedChannels.length > 0
                        ? 'bg-violet-600 text-white hover:bg-violet-700'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send className="w-4 h-4" /> Send Announcement
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map(a => (
          <div key={a.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-bold text-gray-900">{a.title}</h3>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${priorityStyles[a.priority]}`}>
                    {a.priority === 'urgent' ? 'Urgent' : a.priority === 'info' ? 'Info' : 'General'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mt-2 leading-relaxed">{a.body}</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{a.audience}</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{a.date}</span>
                <span className="text-gray-400">by {a.postedBy}</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" />{a.reach} reached</span>
              </div>
              <div className="flex items-center gap-1.5">
                {a.channels.map(ch => (
                  <span key={ch} className={`text-xs px-2 py-0.5 rounded-full font-medium ${channelBadge[ch] ?? 'bg-gray-100 text-gray-600'}`}>{ch}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
