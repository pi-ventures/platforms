'use client'
import { useState } from 'react'
import { Megaphone, Plus, Calendar, Users, Pin } from 'lucide-react'

const announcements = [
  {
    id: 1,
    title: '27th Annual Convocation Ceremony',
    description: 'The 27th Annual Convocation will be held on 20th April 2026 at the University Auditorium. Chief Guest: Dr. K. Radhakrishnan, Former Chairman ISRO. All affiliated colleges must submit their degree candidate lists by 10th April.',
    date: '2026-04-01',
    audience: 'All Colleges',
    priority: 'high',
    pinned: true,
    author: 'Office of the Vice Chancellor',
  },
  {
    id: 2,
    title: 'NAAC Peer Team Visit - Preparation Guidelines',
    description: 'NAAC Peer Team will visit the university from 5th-7th May 2026 for the 4th Cycle of Accreditation. All departments and affiliated colleges are instructed to prepare Self-Study Reports (SSR) and keep all documentation ready for review.',
    date: '2026-03-28',
    audience: 'Faculty',
    priority: 'high',
    pinned: true,
    author: 'IQAC Cell',
  },
  {
    id: 3,
    title: 'End Semester Examination Date Sheet - April 2026',
    description: 'The date sheet for end semester examinations (Even Semester 2025-26) has been released. Examinations will commence from 22nd April 2026. Admit cards can be downloaded from the university portal from 12th April.',
    date: '2026-03-25',
    audience: 'Students',
    priority: 'medium',
    pinned: false,
    author: 'Controller of Examinations',
  },
  {
    id: 4,
    title: 'New Affiliation Granted - Sri Vidya College of Engineering',
    description: 'The Academic Council has approved the affiliation of Sri Vidya College of Engineering, Warangal for B.Tech programs in CSE, ECE, and Mechanical Engineering from the academic year 2026-27.',
    date: '2026-03-20',
    audience: 'Admin',
    priority: 'medium',
    pinned: false,
    author: 'Affiliation Committee',
  },
  {
    id: 5,
    title: 'Research Grant Applications - UGC SAP Phase II',
    description: 'Faculty members are invited to submit research grant proposals under UGC SAP Phase II. Last date for submission: 30th April 2026. Proposals to be routed through respective HoDs.',
    date: '2026-03-18',
    audience: 'Faculty',
    priority: 'medium',
    pinned: false,
    author: 'Research & Development Cell',
  },
  {
    id: 6,
    title: 'Anti-Ragging Committee Meeting - Minutes Published',
    description: 'Minutes of the Anti-Ragging Committee meeting held on 10th March 2026 have been published. All colleges must ensure compliance with UGC anti-ragging guidelines and submit quarterly reports.',
    date: '2026-03-15',
    audience: 'All Colleges',
    priority: 'low',
    pinned: false,
    author: 'Student Welfare Division',
  },
  {
    id: 7,
    title: 'University Sports Meet 2026 - Registrations Open',
    description: 'Inter-college University Sports Meet will be held from 1st-5th May 2026. Colleges may nominate up to 50 athletes. Registration deadline: 15th April 2026. Events include athletics, swimming, basketball, cricket, and kabaddi.',
    date: '2026-03-12',
    audience: 'Students',
    priority: 'low',
    pinned: false,
    author: 'Director of Physical Education',
  },
]

const audienceFilters = ['All', 'All Colleges', 'Students', 'Faculty', 'Admin']

export default function AnnouncementsPage() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered = activeFilter === 'All' ? announcements : announcements.filter(a => a.audience === activeFilter)

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Megaphone className="w-7 h-7 text-violet-600" /> University Announcements
          </h1>
          <p className="text-gray-500 mt-1 text-sm">University-wide circulars, notices, and announcements</p>
        </div>
        <button className="flex items-center gap-2 bg-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-violet-700 transition-colors">
          <Plus className="w-4 h-4" /> New Announcement
        </button>
      </div>

      {/* Audience Filter */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        {audienceFilters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeFilter === filter ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Announcement Cards */}
      <div className="space-y-4">
        {filtered.map(a => (
          <div key={a.id} className={`bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-shadow ${a.pinned ? 'border-violet-200 bg-violet-50/30' : 'border-gray-100'}`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {a.pinned && <Pin className="w-4 h-4 text-violet-500 rotate-45" />}
                <h3 className="font-bold text-gray-900">{a.title}</h3>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                a.priority === 'high' ? 'bg-red-100 text-red-700' :
                a.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                'bg-gray-100 text-gray-600'
              }`}>
                {a.priority === 'high' ? 'High Priority' : a.priority === 'medium' ? 'Medium' : 'General'}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{a.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{new Date(a.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{a.audience}</span>
              <span>{a.author}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
