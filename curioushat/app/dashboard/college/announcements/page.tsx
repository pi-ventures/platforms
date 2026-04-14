'use client'
import { useState } from 'react'
import { Bell, Plus, Send, Users, GraduationCap, BookOpen, ShieldCheck, Mail, MessageCircle, Smartphone } from 'lucide-react'

const announcements = [
  { id: 1, title: 'End Semester Examination Schedule — April 2026', body: 'End semester examinations for all programmes will commence from April 21, 2026. Seating arrangements will be published on the notice board by April 15. Students must carry their ID cards and hall tickets. No electronic devices permitted inside examination halls.', audience: 'All', posted: 'Mar 28, 2026', reach: 2840, by: 'Controller of Examinations', channels: ['In-app', 'Email', 'WhatsApp'] },
  { id: 2, title: 'Campus Placement Drive — Infosys & Wipro', body: 'Infosys and Wipro will conduct on-campus recruitment on April 8-9. Eligible: B.Tech final year students with 60%+ aggregate. Register on the placement portal by April 3. Carry 3 copies of your resume, marksheets, and passport-size photos.', audience: 'Students', posted: 'Mar 25, 2026', reach: 620, by: 'Training & Placement Cell', channels: ['In-app', 'Email'] },
  { id: 3, title: 'Spandan 2026 — Annual Cultural Fest', body: 'Annual cultural festival "Spandan 2026" will be held from April 12-14. Online registrations open for dance, music, theatre, literary events, and hackathon. Spot registrations available for select events. Volunteer sign-up form shared in WhatsApp groups.', audience: 'All', posted: 'Mar 22, 2026', reach: 3150, by: 'Student Council', channels: ['In-app', 'WhatsApp'] },
  { id: 4, title: 'Faculty Meeting — Academic Review & NBA Preparation', body: 'All faculty members are requested to attend the academic review meeting on April 2 at 10:00 AM in the Board Room. Agenda includes NBA accreditation documentation review, CO-PO mapping status, and lab utilisation report. Department HODs to bring attainment data.', audience: 'Faculty', posted: 'Mar 20, 2026', reach: 86, by: 'Dean Academics', channels: ['In-app', 'Email'] },
]

const audienceConfig: Record<string, { color: string; icon: React.ElementType }> = {
  All: { color: 'bg-indigo-100 text-indigo-700', icon: Users },
  Students: { color: 'bg-teal-100 text-teal-700', icon: GraduationCap },
  Faculty: { color: 'bg-purple-100 text-purple-700', icon: BookOpen },
  Admin: { color: 'bg-orange-100 text-orange-700', icon: ShieldCheck },
}

const channelIcons: Record<string, React.ElementType> = {
  'In-app': Smartphone,
  'Email': Mail,
  'WhatsApp': MessageCircle,
}

export default function CollegeAnnouncementsPage() {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', audience: 'All', channels: ['In-app'] as string[] })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><Bell className="w-7 h-7 text-indigo-600" /> Announcements</h1>
          <p className="text-gray-500 mt-1">Campus-wide announcements and notifications</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Announcements', value: 24, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'This Month', value: 4, color: 'text-teal-600 bg-teal-50' },
          { label: 'Total Reach', value: '6,696', color: 'text-purple-600 bg-purple-50' },
          { label: 'Pending Drafts', value: 2, color: 'text-amber-600 bg-amber-50' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <div className="text-2xl font-black">{s.value}</div>
            <div className="text-xs font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Compose form */}
      {showForm && (
        <div className="bg-white rounded-2xl p-6 border border-indigo-100 shadow-sm mb-6">
          <h2 className="font-bold text-gray-900 mb-4">Compose Announcement</h2>
          <div className="space-y-4">
            <input type="text" placeholder="Announcement title" value={form.title} onChange={e => setForm({...form, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            <textarea rows={4} placeholder="Write your announcement message..." value={form.body} onChange={e => setForm({...form, body: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none" />
            <div className="flex flex-wrap gap-4">
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Audience</label>
                <select value={form.audience} onChange={e => setForm({...form, audience: e.target.value})} className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                  {['All', 'Students', 'Faculty', 'Admin'].map(a => <option key={a}>{a}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1 block">Channels</label>
                <div className="flex gap-3">
                  {['In-app', 'Email', 'WhatsApp'].map(ch => (
                    <label key={ch} className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
                      <input type="checkbox" checked={form.channels.includes(ch)} onChange={e => setForm({...form, channels: e.target.checked ? [...form.channels, ch] : form.channels.filter(c => c !== ch)})} className="rounded" />
                      {ch}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowForm(false)} className="flex items-center gap-2 bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors text-sm">
                <Send className="w-4 h-4" /> Publish Now
              </button>
              <button className="text-sm border border-gray-200 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50">Save Draft</button>
              <button onClick={() => setShowForm(false)} className="text-sm text-gray-400 px-4 py-2.5 hover:text-gray-600">Cancel</button>
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>Posted: {a.posted}</span>
                  <span>By: {a.by}</span>
                  <span>Reached: {a.reach.toLocaleString()} recipients</span>
                </div>
                <div className="flex items-center gap-2">
                  {a.channels.map(ch => {
                    const Icon = channelIcons[ch]
                    return Icon ? <Icon key={ch} className="w-3.5 h-3.5 text-gray-300" title={ch} /> : null
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
