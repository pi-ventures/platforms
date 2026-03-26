'use client'
import { useState } from 'react'
import { BookOpen, Users, Plus, ChevronDown, ChevronUp, Edit3, Upload, Eye, CheckCircle2, Circle } from 'lucide-react'

const courses = [
  {
    id: 1, subject: 'Physics', class: 'Class XI – A', code: 'PHY11A', color: '#0891B2', emoji: '⚛',
    students: 42, chaptersCreated: 6, totalChapters: 10, lastUpdated: '2 days ago',
    chapters: [
      { title: 'Physical World', published: true, resources: 3 },
      { title: 'Units and Measurements', published: true, resources: 5 },
      { title: 'Motion in a Straight Line', published: true, resources: 4 },
      { title: 'Motion in a Plane', published: true, resources: 6 },
      { title: 'Laws of Motion', published: true, resources: 7 },
      { title: 'Work, Energy and Power', published: true, resources: 2 },
      { title: 'Gravitation', published: false, resources: 0 },
      { title: 'Thermodynamics', published: false, resources: 0 },
      { title: 'Waves', published: false, resources: 0 },
      { title: 'Oscillations', published: false, resources: 0 },
    ]
  },
  {
    id: 2, subject: 'Physics', class: 'Class XI – B', code: 'PHY11B', color: '#0891B2', emoji: '⚛',
    students: 38, chaptersCreated: 5, totalChapters: 10, lastUpdated: '3 days ago',
    chapters: [
      { title: 'Physical World', published: true, resources: 3 },
      { title: 'Units and Measurements', published: true, resources: 5 },
      { title: 'Motion in a Straight Line', published: true, resources: 4 },
      { title: 'Motion in a Plane', published: true, resources: 6 },
      { title: 'Laws of Motion', published: true, resources: 7 },
      { title: 'Work, Energy and Power', published: false, resources: 0 },
      { title: 'Gravitation', published: false, resources: 0 },
      { title: 'Thermodynamics', published: false, resources: 0 },
      { title: 'Waves', published: false, resources: 0 },
      { title: 'Oscillations', published: false, resources: 0 },
    ]
  },
  {
    id: 3, subject: 'Physics', class: 'Class XII – A', code: 'PHY12A', color: '#0891B2', emoji: '⚛',
    students: 44, chaptersCreated: 8, totalChapters: 13, lastUpdated: 'Today',
    chapters: [
      { title: 'Electric Charges and Fields', published: true, resources: 5 },
      { title: 'Electrostatic Potential and Capacitance', published: true, resources: 4 },
      { title: 'Current Electricity', published: true, resources: 6 },
      { title: 'Moving Charges and Magnetism', published: true, resources: 5 },
      { title: 'Magnetism and Matter', published: true, resources: 3 },
      { title: 'Electromagnetic Induction', published: true, resources: 4 },
      { title: 'Alternating Current', published: true, resources: 5 },
      { title: 'Electromagnetic Waves', published: true, resources: 2 },
      { title: 'Ray Optics', published: false, resources: 0 },
      { title: 'Wave Optics', published: false, resources: 0 },
      { title: 'Dual Nature of Radiation', published: false, resources: 0 },
      { title: 'Atoms', published: false, resources: 0 },
      { title: 'Semiconductors', published: false, resources: 0 },
    ]
  },
]

export default function TeacherCoursesPage() {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [adding, setAdding] = useState<number | null>(null)
  const [newChapter, setNewChapter] = useState('')

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Courses</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage chapters and resources for your classes</p>
        </div>
        <button className="flex items-center gap-1.5 text-sm bg-violet-600 text-white px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors">
          <Plus className="w-4 h-4" /> New Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Classes', value: courses.length },
          { label: 'Total Students', value: courses.reduce((a, c) => a + c.students, 0) },
          { label: 'Chapters Published', value: courses.reduce((a, c) => a + c.chaptersCreated, 0) },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-black text-gray-900">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Course cards */}
      <div className="space-y-3">
        {courses.map(course => {
          const pct = Math.round((course.chaptersCreated / course.totalChapters) * 100)
          const isOpen = expanded === course.id
          return (
            <div key={course.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpanded(isOpen ? null : course.id)}
                className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm" style={{ backgroundColor: course.color }}>
                  {course.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{course.subject}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{course.class}</span>
                    <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">{course.code}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.students} students</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.chaptersCreated}/{course.totalChapters} chapters</span>
                    <span>Updated {course.lastUpdated}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: course.color }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 w-8 text-right">{pct}%</span>
                  </div>
                </div>
                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              </button>

              {/* Chapters */}
              {isOpen && (
                <div className="border-t border-gray-100 px-5 py-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Chapters</p>
                    <button
                      onClick={() => setAdding(adding === course.id ? null : course.id)}
                      className="flex items-center gap-1 text-xs text-violet-600 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Chapter
                    </button>
                  </div>

                  {adding === course.id && (
                    <div className="flex gap-2 mb-3">
                      <input
                        value={newChapter}
                        onChange={e => setNewChapter(e.target.value)}
                        placeholder="Chapter title…"
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
                      />
                      <button className="bg-violet-600 text-white text-xs px-3 rounded-lg hover:bg-violet-700">Add</button>
                      <button onClick={() => setAdding(null)} className="text-gray-400 text-xs px-2">Cancel</button>
                    </div>
                  )}

                  <div className="space-y-1">
                    {course.chapters.map((ch, i) => (
                      <div key={i} className="flex items-center gap-2.5 py-1.5 group">
                        {ch.published
                          ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: course.color }} />
                          : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        }
                        <span className={`text-sm flex-1 ${ch.published ? 'text-gray-700' : 'text-gray-400'}`}>
                          <span className="text-gray-400 text-xs mr-1.5">{String(i + 1).padStart(2, '0')}</span>
                          {ch.title}
                        </span>
                        {ch.published && (
                          <span className="text-xs text-gray-400">{ch.resources} resource{ch.resources !== 1 ? 's' : ''}</span>
                        )}
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-1 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-md transition-colors" title="Edit">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Upload resources">
                            <Upload className="w-3.5 h-3.5" />
                          </button>
                          <button className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Preview">
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
