'use client'
import { useState } from 'react'
import { Brain, BookOpen, Sparkles, PenTool, Search, Database } from 'lucide-react'

const stats = [
  { label: 'Total Questions', value: '12,480', sub: 'across 4 exams', icon: Database, color: '#7C3AED', bg: 'bg-violet-50' },
  { label: 'AI-Generated', value: '8,320', sub: '66.7% of total', icon: Sparkles, color: '#D97706', bg: 'bg-amber-50' },
  { label: 'Manually Added', value: '4,160', sub: 'by 14 faculty', icon: PenTool, color: '#059669', bg: 'bg-emerald-50' },
  { label: 'Subjects Covered', value: '24', sub: 'across JEE, NEET, CLAT, CA', icon: BookOpen, color: '#1D4ED8', bg: 'bg-blue-50' },
]

const examOptions = ['All Exams', 'JEE', 'NEET', 'CLAT', 'CA']
const difficultyOptions = ['All Levels', 'Easy', 'Medium', 'Hard']

const examBadge: Record<string, string> = {
  JEE: 'bg-indigo-50 text-indigo-700',
  NEET: 'bg-emerald-50 text-emerald-700',
  CLAT: 'bg-amber-50 text-amber-700',
  CA: 'bg-rose-50 text-rose-700',
}

const diffBadge: Record<string, string> = {
  Easy: 'bg-green-50 text-green-700',
  Medium: 'bg-amber-50 text-amber-700',
  Hard: 'bg-red-50 text-red-700',
}

const typeBadge: Record<string, string> = {
  MCQ: 'bg-blue-50 text-blue-700',
  Numerical: 'bg-violet-50 text-violet-700',
  Subjective: 'bg-gray-100 text-gray-700',
}

const questions = [
  { id: 1, exam: 'JEE', subject: 'Physics', topic: 'Electrostatics — Gauss Law', difficulty: 'Hard', type: 'Numerical', source: 'AI', usedIn: 4, preview: 'A solid sphere of radius R has a uniform charge density. Find the electric field at distance r (r < R) from center...' },
  { id: 2, exam: 'NEET', subject: 'Biology', topic: 'Genetics — Dihybrid Cross', difficulty: 'Medium', type: 'MCQ', source: 'Manual', usedIn: 6, preview: 'In a cross between AaBb x AaBb, the phenotypic ratio of offspring showing both dominant traits is...' },
  { id: 3, exam: 'JEE', subject: 'Chemistry', topic: 'Organic — Reaction Mechanisms', difficulty: 'Hard', type: 'MCQ', source: 'AI', usedIn: 3, preview: 'Which intermediate is formed in the reaction of 2-bromo-2-methylpropane with aqueous NaOH...' },
  { id: 4, exam: 'CLAT', subject: 'Legal Reasoning', topic: 'Constitutional Law — Article 21', difficulty: 'Medium', type: 'Subjective', source: 'Manual', usedIn: 2, preview: 'Passage: The Supreme Court in Maneka Gandhi v. Union of India expanded the scope of Article 21. Analyze whether...' },
  { id: 5, exam: 'NEET', subject: 'Chemistry', topic: 'Chemical Bonding — Hybridization', difficulty: 'Easy', type: 'MCQ', source: 'AI', usedIn: 8, preview: 'The hybridization of the central atom in SF6 is...' },
  { id: 6, exam: 'CA', subject: 'Accounts', topic: 'Depreciation — WDV Method', difficulty: 'Medium', type: 'Numerical', source: 'AI', usedIn: 5, preview: 'A machine was purchased for Rs 5,00,000. Calculate the depreciation for year 3 using WDV method at 15%...' },
  { id: 7, exam: 'JEE', subject: 'Mathematics', topic: 'Calculus — Definite Integration', difficulty: 'Hard', type: 'Numerical', source: 'Manual', usedIn: 7, preview: 'Evaluate the integral from 0 to pi/2 of (sin^6(x) + cos^6(x)) dx...' },
  { id: 8, exam: 'CLAT', subject: 'English', topic: 'Reading Comprehension — Inference', difficulty: 'Easy', type: 'MCQ', source: 'AI', usedIn: 3, preview: "Read the passage on judicial activism in India. The author's primary argument can be best described as..." },
]

export default function QuestionBankPage() {
  const [examFilter, setExamFilter] = useState('All Exams')
  const [diffFilter, setDiffFilter] = useState('All Levels')
  const [search, setSearch] = useState('')

  const filtered = questions.filter(q => {
    const matchExam = examFilter === 'All Exams' || q.exam === examFilter
    const matchDiff = diffFilter === 'All Levels' || q.difficulty === diffFilter
    const matchSearch = q.subject.toLowerCase().includes(search.toLowerCase()) ||
      q.topic.toLowerCase().includes(search.toLowerCase()) ||
      q.preview.toLowerCase().includes(search.toLowerCase())
    return matchExam && matchDiff && matchSearch
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">AI Question Bank</h1>
          <p className="text-sm text-gray-500 mt-1">Browse, filter, and generate exam questions with AI assistance</p>
        </div>
        <button className="bg-violet-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-violet-700 transition-colors">
          <Sparkles className="w-4 h-4" />
          Generate with AI
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className={`${s.bg} rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-600">{s.label}</span>
              <s.icon className="w-5 h-5" style={{ color: s.color }} />
            </div>
            <div className="text-2xl font-black text-gray-900">{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm">AI-Powered Question Generation</h3>
            <p className="text-xs text-white/70">Select exam, subject, topic, and difficulty — AI generates unique, pattern-matched questions in seconds</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {['Physics MCQs', 'Biology Assertion-Reason', 'Legal Passages', 'Maths Numericals'].map(tag => (
            <span key={tag} className="text-xs bg-white/15 px-3 py-1.5 rounded-lg font-medium">{tag}</span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
          <div className="relative max-w-xs flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by subject, topic, or content..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
            />
          </div>
          <select
            value={examFilter}
            onChange={e => setExamFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white"
          >
            {examOptions.map(o => <option key={o}>{o}</option>)}
          </select>
          <select
            value={diffFilter}
            onChange={e => setDiffFilter(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 bg-white"
          >
            {difficultyOptions.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Subject / Topic</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Exam</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Difficulty</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Type</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Source</th>
                <th className="text-left px-4 py-3 font-semibold text-gray-500 text-xs uppercase tracking-wider">Used In</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(q => (
                <tr key={q.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3.5">
                    <div className="font-medium text-gray-900 text-sm">{q.subject}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{q.topic}</div>
                    <div className="text-xs text-gray-400 mt-1 max-w-[320px] truncate">{q.preview}</div>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${examBadge[q.exam]}`}>{q.exam}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${diffBadge[q.difficulty]}`}>{q.difficulty}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeBadge[q.type]}`}>{q.type}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      {q.source === 'AI' ? <Sparkles className="w-3.5 h-3.5 text-amber-500" /> : <PenTool className="w-3.5 h-3.5 text-gray-400" />}
                      {q.source}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-gray-600 text-xs">{q.usedIn} tests</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-400">No questions match your filters</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
