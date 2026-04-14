'use client'
import { useState } from 'react'
import { BookOpen, Users, Plus, ChevronDown, ChevronUp, Edit3, Upload, Eye, CheckCircle2, Circle } from 'lucide-react'

const courses = [
  {
    id: 1, name: 'Data Structures & Algorithms', department: 'Computer Science', semester: 'Sem 2', code: 'CS201', color: '#4F46E5',
    faculty: 'Dr. Ramesh Kumar', students: 64, chaptersCreated: 8, totalChapters: 12, lastUpdated: 'Today',
    chapters: [
      { title: 'Introduction to Data Structures', published: true, resources: 4 },
      { title: 'Arrays and Strings', published: true, resources: 6 },
      { title: 'Linked Lists', published: true, resources: 5 },
      { title: 'Stacks and Queues', published: true, resources: 7 },
      { title: 'Trees and Binary Trees', published: true, resources: 8 },
      { title: 'Graph Algorithms', published: true, resources: 5 },
      { title: 'Hashing Techniques', published: true, resources: 3 },
      { title: 'Sorting Algorithms', published: true, resources: 6 },
      { title: 'Dynamic Programming', published: false, resources: 0 },
      { title: 'Greedy Algorithms', published: false, resources: 0 },
      { title: 'Backtracking', published: false, resources: 0 },
      { title: 'Advanced Graph Theory', published: false, resources: 0 },
    ]
  },
  {
    id: 2, name: 'Object Oriented Programming', department: 'Computer Science', semester: 'Sem 4', code: 'CS401', color: '#4F46E5',
    faculty: 'Prof. Sunita Agarwal', students: 58, chaptersCreated: 6, totalChapters: 10, lastUpdated: '2 days ago',
    chapters: [
      { title: 'Introduction to OOP Concepts', published: true, resources: 3 },
      { title: 'Classes and Objects', published: true, resources: 5 },
      { title: 'Inheritance', published: true, resources: 4 },
      { title: 'Polymorphism', published: true, resources: 6 },
      { title: 'Abstraction and Encapsulation', published: true, resources: 4 },
      { title: 'Exception Handling', published: true, resources: 3 },
      { title: 'File I/O and Serialization', published: false, resources: 0 },
      { title: 'Generics and Collections', published: false, resources: 0 },
      { title: 'Multithreading', published: false, resources: 0 },
      { title: 'Design Patterns', published: false, resources: 0 },
    ]
  },
  {
    id: 3, name: 'Principles of Management', department: 'Business Administration', semester: 'Sem 2', code: 'BBA201', color: '#D97706',
    faculty: 'Dr. Priya Menon', students: 48, chaptersCreated: 7, totalChapters: 10, lastUpdated: '3 days ago',
    chapters: [
      { title: 'Nature and Scope of Management', published: true, resources: 3 },
      { title: 'Planning and Decision Making', published: true, resources: 4 },
      { title: 'Organising and Departmentation', published: true, resources: 5 },
      { title: 'Staffing and HRM Basics', published: true, resources: 3 },
      { title: 'Directing and Leadership', published: true, resources: 6 },
      { title: 'Motivation Theories', published: true, resources: 4 },
      { title: 'Controlling and Coordination', published: true, resources: 3 },
      { title: 'Business Ethics and CSR', published: false, resources: 0 },
      { title: 'International Management', published: false, resources: 0 },
      { title: 'Contemporary Management Issues', published: false, resources: 0 },
    ]
  },
  {
    id: 4, name: 'Financial Accounting', department: 'Business Administration', semester: 'Sem 4', code: 'BBA401', color: '#D97706',
    faculty: 'Prof. Vikram Singh', students: 42, chaptersCreated: 5, totalChapters: 8, lastUpdated: '1 week ago',
    chapters: [
      { title: 'Introduction to Accounting', published: true, resources: 4 },
      { title: 'Journal Entries and Ledger', published: true, resources: 5 },
      { title: 'Trial Balance', published: true, resources: 3 },
      { title: 'Final Accounts', published: true, resources: 6 },
      { title: 'Depreciation Methods', published: true, resources: 4 },
      { title: 'Bank Reconciliation Statement', published: false, resources: 0 },
      { title: 'Partnership Accounts', published: false, resources: 0 },
      { title: 'Company Accounts Basics', published: false, resources: 0 },
    ]
  },
  {
    id: 5, name: 'Classical Mechanics', department: 'Physics', semester: 'Sem 2', code: 'PHY201', color: '#0D9488',
    faculty: 'Dr. Anand Joshi', students: 36, chaptersCreated: 9, totalChapters: 11, lastUpdated: 'Yesterday',
    chapters: [
      { title: 'Newtonian Mechanics Review', published: true, resources: 5 },
      { title: 'Lagrangian Mechanics', published: true, resources: 7 },
      { title: 'Hamiltonian Mechanics', published: true, resources: 6 },
      { title: 'Central Force Problem', published: true, resources: 4 },
      { title: 'Rigid Body Dynamics', published: true, resources: 5 },
      { title: 'Oscillations', published: true, resources: 8 },
      { title: 'Special Theory of Relativity', published: true, resources: 6 },
      { title: 'Canonical Transformations', published: true, resources: 3 },
      { title: 'Hamilton-Jacobi Theory', published: true, resources: 4 },
      { title: 'Small Oscillations', published: false, resources: 0 },
      { title: 'Continuous Systems and Waves', published: false, resources: 0 },
    ]
  },
  {
    id: 6, name: 'Organic Chemistry', department: 'Chemistry', semester: 'Sem 2', code: 'CHE201', color: '#E11D48',
    faculty: 'Dr. Kavita Sharma', students: 32, chaptersCreated: 6, totalChapters: 10, lastUpdated: '4 days ago',
    chapters: [
      { title: 'Structure and Bonding', published: true, resources: 4 },
      { title: 'Stereochemistry', published: true, resources: 5 },
      { title: 'Reaction Mechanisms', published: true, resources: 6 },
      { title: 'Alkanes and Cycloalkanes', published: true, resources: 3 },
      { title: 'Alkenes and Alkynes', published: true, resources: 5 },
      { title: 'Aromatic Compounds', published: true, resources: 4 },
      { title: 'Alcohols and Ethers', published: false, resources: 0 },
      { title: 'Aldehydes and Ketones', published: false, resources: 0 },
      { title: 'Carboxylic Acids', published: false, resources: 0 },
      { title: 'Amines and Amino Acids', published: false, resources: 0 },
    ]
  },
]

export default function CoursesPage() {
  const [expanded, setExpanded] = useState<number | null>(null)
  const [adding, setAdding] = useState<number | null>(null)
  const [newChapter, setNewChapter] = useState('')

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Courses & Syllabus</h1>
          <p className="text-gray-500 mt-1 text-sm">Manage curriculum, syllabus, and course material</p>
        </div>
        <button className="flex items-center gap-1.5 text-sm bg-indigo-600 text-white px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors font-semibold">
          <Plus className="w-4 h-4" /> Add Course
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Courses', value: courses.length, color: 'text-indigo-600 bg-indigo-50' },
          { label: 'Total Students', value: courses.reduce((a, c) => a + c.students, 0), color: 'text-teal-600 bg-teal-50' },
          { label: 'Chapters Published', value: courses.reduce((a, c) => a + c.chaptersCreated, 0), color: 'text-emerald-600 bg-emerald-50' },
          { label: 'Departments', value: 4, color: 'text-purple-600 bg-purple-50' },
        ].map(s => (
          <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
            <p className="text-2xl font-black">{s.value}</p>
            <p className="text-xs font-medium mt-0.5">{s.label}</p>
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
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-xs" style={{ backgroundColor: course.color }}>
                  {course.code.slice(0, 3)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{course.name}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{course.department}</span>
                    <span className="text-xs bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">{course.code}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{course.students} students</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.chaptersCreated}/{course.totalChapters} chapters</span>
                    <span>{course.faculty}</span>
                    <span>{course.semester}</span>
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
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Chapter
                    </button>
                  </div>

                  {adding === course.id && (
                    <div className="flex gap-2 mb-3">
                      <input
                        value={newChapter}
                        onChange={e => setNewChapter(e.target.value)}
                        placeholder="Chapter title..."
                        className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                      />
                      <button className="bg-indigo-600 text-white text-xs px-3 rounded-lg hover:bg-indigo-700">Add</button>
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
                          <button className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors" title="Edit">
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
