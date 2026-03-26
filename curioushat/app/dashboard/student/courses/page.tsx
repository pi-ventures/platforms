'use client'
import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, CheckCircle2, Circle, Clock, User } from 'lucide-react'

const courses = [
  {
    id: 1, subject: 'Mathematics', class: 'Class XI', teacher: 'Mr. R. Sharma', code: 'MATH11',
    color: '#4F46E5', emoji: '∑',
    progress: 7, total: 14,
    chapters: [
      { title: 'Sets', done: true },
      { title: 'Relations and Functions', done: true },
      { title: 'Trigonometric Functions', done: true },
      { title: 'Principle of Mathematical Induction', done: true },
      { title: 'Complex Numbers and Quadratic Equations', done: true },
      { title: 'Linear Inequalities', done: true },
      { title: 'Permutations and Combinations', done: true },
      { title: 'Binomial Theorem', done: false },
      { title: 'Sequences and Series', done: false },
      { title: 'Straight Lines', done: false },
      { title: 'Conic Sections', done: false },
      { title: '3D Geometry – Introduction', done: false },
      { title: 'Limits and Derivatives', done: false },
      { title: 'Statistics & Probability', done: false },
    ],
  },
  {
    id: 2, subject: 'Physics', class: 'Class XI', teacher: 'Ms. P. Gupta', code: 'PHY11',
    color: '#0891B2', emoji: '⚛',
    progress: 5, total: 10,
    chapters: [
      { title: 'Physical World', done: true },
      { title: 'Units and Measurements', done: true },
      { title: 'Motion in a Straight Line', done: true },
      { title: 'Motion in a Plane', done: true },
      { title: 'Laws of Motion', done: true },
      { title: 'Work, Energy and Power', done: false },
      { title: 'Systems of Particles and Rotational Motion', done: false },
      { title: 'Gravitation', done: false },
      { title: 'Mechanical Properties of Solids', done: false },
      { title: 'Thermodynamics', done: false },
    ],
  },
  {
    id: 3, subject: 'Chemistry', class: 'Class XI', teacher: 'Mr. A. Mishra', code: 'CHEM11',
    color: '#059669', emoji: '⚗',
    progress: 4, total: 11,
    chapters: [
      { title: 'Some Basic Concepts of Chemistry', done: true },
      { title: 'Structure of Atom', done: true },
      { title: 'Classification of Elements', done: true },
      { title: 'Chemical Bonding', done: true },
      { title: 'States of Matter', done: false },
      { title: 'Thermodynamics', done: false },
      { title: 'Equilibrium', done: false },
      { title: 'Redox Reactions', done: false },
      { title: 'Hydrogen', done: false },
      { title: 's-Block Elements', done: false },
      { title: 'Organic Chemistry – Basic Principles', done: false },
    ],
  },
  {
    id: 4, subject: 'English', class: 'Class XI', teacher: 'Ms. S. Kapoor', code: 'ENG11',
    color: '#D97706', emoji: 'Aa',
    progress: 8, total: 9,
    chapters: [
      { title: 'The Portrait of a Lady', done: true },
      { title: 'We\'re Not Afraid to Die', done: true },
      { title: 'Discovering Tut', done: true },
      { title: 'Landscape of the Soul', done: true },
      { title: 'The Ailing Planet', done: true },
      { title: 'The Browning Version', done: true },
      { title: 'The Adventure', done: true },
      { title: 'Silk Road', done: true },
      { title: 'Writing Skills & Grammar', done: false },
    ],
  },
  {
    id: 5, subject: 'Biology', class: 'Class XI', teacher: 'Dr. N. Reddy', code: 'BIO11',
    color: '#7C3AED', emoji: '🌿',
    progress: 3, total: 10,
    chapters: [
      { title: 'The Living World', done: true },
      { title: 'Biological Classification', done: true },
      { title: 'Plant Kingdom', done: true },
      { title: 'Animal Kingdom', done: false },
      { title: 'Morphology of Flowering Plants', done: false },
      { title: 'Anatomy of Flowering Plants', done: false },
      { title: 'Structural Organisation in Animals', done: false },
      { title: 'Cell: The Unit of Life', done: false },
      { title: 'Cell Cycle and Cell Division', done: false },
      { title: 'Transport in Plants', done: false },
    ],
  },
  {
    id: 6, subject: 'Computer Science', class: 'Class XI', teacher: 'Mr. V. Tiwari', code: 'CS11',
    color: '#BE185D', emoji: '</>',
    progress: 6, total: 8,
    chapters: [
      { title: 'Computer Systems', done: true },
      { title: 'Python Basics', done: true },
      { title: 'Control Flow', done: true },
      { title: 'Functions', done: true },
      { title: 'String Manipulation', done: true },
      { title: 'Lists and Tuples', done: true },
      { title: 'Dictionaries', done: false },
      { title: 'File Handling', done: false },
    ],
  },
]

export default function StudentCoursesPage() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900">My Courses</h1>
        <p className="text-gray-500 mt-1 text-sm">Class XI — 2025-26 Academic Year · CBSE Board</p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Enrolled Courses', value: courses.length },
          { label: 'Chapters Done', value: courses.reduce((a, c) => a + c.progress, 0) },
          { label: 'Total Chapters', value: courses.reduce((a, c) => a + c.total, 0) },
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
          const pct = Math.round((course.progress / course.total) * 100)
          const isOpen = expanded === course.id
          return (
            <div key={course.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Card header */}
              <button
                onClick={() => setExpanded(isOpen ? null : course.id)}
                className="w-full text-left px-5 py-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                {/* Subject icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm"
                  style={{ backgroundColor: course.color }}
                >
                  {course.emoji}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{course.subject}</span>
                    <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{course.code}</span>
                  </div>
                  <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><User className="w-3 h-3" />{course.teacher}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.progress}/{course.total} chapters</span>
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: course.color }} />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 w-8 text-right">{pct}%</span>
                  </div>
                </div>

                {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />}
              </button>

              {/* Expanded chapter list */}
              {isOpen && (
                <div className="border-t border-gray-100 px-5 py-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Chapters</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {course.chapters.map((ch, i) => (
                      <div key={i} className="flex items-center gap-2.5 py-1.5">
                        {ch.done
                          ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: course.color }} />
                          : <Circle className="w-4 h-4 text-gray-300 flex-shrink-0" />
                        }
                        <span className={`text-sm ${ch.done ? 'text-gray-700' : 'text-gray-400'}`}>
                          <span className="text-gray-400 text-xs mr-1.5">{String(i + 1).padStart(2, '0')}</span>
                          {ch.title}
                        </span>
                        {!ch.done && (
                          <span className="ml-auto">
                            <Clock className="w-3.5 h-3.5 text-gray-300" />
                          </span>
                        )}
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
