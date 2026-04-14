'use client'
import { useState } from 'react'
import { ClipboardList, Plus, Clock, Users, BarChart3, Calendar } from 'lucide-react'

const tests = [
  { id: 1, name: 'JEE Mock Test 5', subject: 'Physics + Chemistry + Maths', date: '2026-04-08', duration: '3 hrs', registered: 156, avgScore: null, maxScore: 300, status: 'upcoming' },
  { id: 2, name: 'NEET Mock Test 3', subject: 'Biology + Chemistry + Physics', date: '2026-04-05', duration: '3 hrs 20 min', registered: 203, avgScore: null, maxScore: 720, status: 'live' },
  { id: 3, name: 'JEE Mock Test 4', subject: 'Physics + Chemistry + Maths', date: '2026-03-28', duration: '3 hrs', registered: 148, avgScore: 178, maxScore: 300, status: 'completed' },
  { id: 4, name: 'NEET Mock Test 2', subject: 'Biology + Chemistry + Physics', date: '2026-03-22', duration: '3 hrs 20 min', registered: 195, avgScore: 428, maxScore: 720, status: 'completed' },
  { id: 5, name: 'JEE Advanced Mock 1', subject: 'Paper 1 + Paper 2', date: '2026-04-12', duration: '6 hrs', registered: 89, avgScore: null, maxScore: 396, status: 'upcoming' },
  { id: 6, name: 'JEE Mock Test 3', subject: 'Physics + Chemistry + Maths', date: '2026-03-15', duration: '3 hrs', registered: 142, avgScore: 165, maxScore: 300, status: 'completed' },
  { id: 7, name: 'GATE CS Mock 2', subject: 'Computer Science & IT', date: '2026-04-15', duration: '3 hrs', registered: 72, avgScore: null, maxScore: 100, status: 'upcoming' },
  { id: 8, name: 'NEET Mock Test 1', subject: 'Biology + Chemistry + Physics', date: '2026-03-08', duration: '3 hrs 20 min', registered: 188, avgScore: 412, maxScore: 720, status: 'completed' },
]

const tabs = ['All', 'Upcoming', 'Live', 'Completed']

export default function TestsPage() {
  const [activeTab, setActiveTab] = useState('All')

  const filtered = activeTab === 'All' ? tests : tests.filter(t => t.status === activeTab.toLowerCase())
  const upcoming = tests.filter(t => t.status === 'upcoming').length
  const live = tests.filter(t => t.status === 'live').length
  const completed = tests.filter(t => t.status === 'completed').length

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <ClipboardList className="w-7 h-7 text-indigo-600" /> Test Series
          </h1>
          <p className="text-gray-500 mt-1 text-sm">Manage competitive exam mock tests and coaching assessments</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
          <Plus className="w-4 h-4" /> Create Test
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <p className="text-xs font-medium text-blue-600 mb-1">Upcoming</p>
          <p className="text-2xl font-black text-gray-900">{upcoming}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
          <p className="text-xs font-medium text-emerald-600 mb-1">Live Now</p>
          <p className="text-2xl font-black text-gray-900">{live}</p>
        </div>
        <div className="bg-gray-100 rounded-2xl p-4 border border-gray-200">
          <p className="text-xs font-medium text-gray-600 mb-1">Completed</p>
          <p className="text-2xl font-black text-gray-900">{completed}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit mb-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${activeTab === tab ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Test Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(test => (
          <div key={test.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{test.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{test.subject}</p>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                test.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                test.status === 'live' ? 'bg-emerald-100 text-emerald-700 animate-pulse' :
                'bg-gray-100 text-gray-600'
              }`}>
                {test.status === 'upcoming' ? 'Upcoming' : test.status === 'live' ? 'Live' : 'Completed'}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs text-gray-500">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(test.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{test.duration}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                <span>{test.registered} registered</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{test.avgScore !== null ? `Avg: ${test.avgScore}/${test.maxScore}` : `Max: ${test.maxScore}`}</span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {test.status === 'upcoming' && (
                <>
                  <button className="flex-1 text-xs bg-indigo-50 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors">Edit Test</button>
                  <button className="flex-1 text-xs border border-gray-200 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">View Details</button>
                </>
              )}
              {test.status === 'live' && (
                <>
                  <button className="flex-1 text-xs bg-emerald-50 text-emerald-600 py-2 rounded-lg font-medium hover:bg-emerald-100 transition-colors">Monitor Live</button>
                  <button className="flex-1 text-xs border border-red-200 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors">End Test</button>
                </>
              )}
              {test.status === 'completed' && (
                <>
                  <button className="flex-1 text-xs bg-indigo-50 text-indigo-600 py-2 rounded-lg font-medium hover:bg-indigo-100 transition-colors">View Results</button>
                  <button className="flex-1 text-xs border border-gray-200 py-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors">Analytics</button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
