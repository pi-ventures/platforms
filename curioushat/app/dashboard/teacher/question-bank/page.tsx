'use client'
import { useState } from 'react'
import { BookOpen, Plus, Search, Filter, Sparkles } from 'lucide-react'

const questions = [
  { id: 1, subject: 'Physics', class: '10', topic: 'Electricity', type: 'MCQ', difficulty: 'Easy', bloom: 'Remember', text: "What is the SI unit of electric current?", answer: 'Ampere (A)' },
  { id: 2, subject: 'Physics', class: '10', topic: 'Electricity', type: 'Short', difficulty: 'Medium', bloom: 'Understand', text: "Explain Ohm's Law and state the conditions under which it holds true.", answer: "V = IR at constant temperature. The resistance of the conductor must remain constant." },
  { id: 3, subject: 'Physics', class: '10', topic: 'Magnetism', type: 'Long', difficulty: 'Hard', bloom: 'Apply', text: "Describe the construction and working principle of a DC motor. Draw a labelled diagram.", answer: "A DC motor converts electrical energy to mechanical energy using the interaction of magnetic fields..." },
  { id: 4, subject: 'Chemistry', class: '10', topic: 'Acids & Bases', type: 'MCQ', difficulty: 'Easy', bloom: 'Remember', text: "What is the pH of pure water?", answer: '7' },
  { id: 5, subject: 'Chemistry', class: '10', topic: 'Metals', type: 'Short', difficulty: 'Medium', bloom: 'Analyse', text: "Why do metals generally have high melting and boiling points? Give two exceptions.", answer: "Metals have strong metallic bonding. Exceptions: Mercury (liquid at room temp), Gallium (melts in hand)" },
]

const types = ['All Types', 'MCQ', 'Short', 'Long']
const difficulties = ['All Difficulties', 'Easy', 'Medium', 'Hard']
const typeColor: Record<string, string> = { MCQ: 'bg-blue-100 text-blue-700', Short: 'bg-purple-100 text-purple-700', Long: 'bg-indigo-100 text-indigo-700' }
const diffColor: Record<string, string> = { Easy: 'bg-emerald-100 text-emerald-700', Medium: 'bg-amber-100 text-amber-700', Hard: 'bg-red-100 text-red-600' }

export default function QuestionBankPage() {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [diffFilter, setDiffFilter] = useState('All Difficulties')

  const filtered = questions.filter(q => {
    const matchSearch = q.text.toLowerCase().includes(search.toLowerCase()) || q.topic.toLowerCase().includes(search.toLowerCase())
    const matchType = typeFilter === 'All Types' || q.type === typeFilter
    const matchDiff = diffFilter === 'All Difficulties' || q.difficulty === diffFilter
    return matchSearch && matchType && matchDiff
  })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><BookOpen className="w-7 h-7 text-indigo-600" /> Question Bank</h1>
          <p className="text-gray-500 mt-1">{questions.length} questions • Physics & Chemistry</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 border border-indigo-200 text-indigo-600 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-50 transition-colors">
            <Sparkles className="w-4 h-4" /> Generate with AI
          </button>
          <button className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-indigo-700 transition-colors">
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
        </div>
        {[{ val: typeFilter, set: setTypeFilter, opts: types }, { val: diffFilter, set: setDiffFilter, opts: difficulties }].map((f, i) => (
          <select key={i} value={f.val} onChange={e => f.set(e.target.value)} className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
            {f.opts.map(o => <option key={o}>{o}</option>)}
          </select>
        ))}
      </div>

      {/* Question list */}
      <div className="space-y-3">
        {filtered.map(q => (
          <div key={q.id} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4 mb-3">
              <p className="text-sm text-gray-800 font-medium flex-1">{q.text}</p>
              <div className="flex gap-2 flex-shrink-0">
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${typeColor[q.type]}`}>{q.type}</span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${diffColor[q.difficulty]}`}>{q.difficulty}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>{q.subject}</span>
              <span>•</span>
              <span>Class {q.class}</span>
              <span>•</span>
              <span>{q.topic}</span>
              <span>•</span>
              <span>Bloom's: {q.bloom}</span>
            </div>
            <details className="mt-3">
              <summary className="text-xs text-indigo-600 cursor-pointer font-medium hover:underline">Show answer</summary>
              <p className="text-xs text-gray-600 mt-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3">{q.answer}</p>
            </details>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No questions match your filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
