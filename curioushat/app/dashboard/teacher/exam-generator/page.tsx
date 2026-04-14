'use client'
import { useState, useRef } from 'react'
import { FileText, Loader2, Download, RefreshCw, Sparkles, AlertCircle } from 'lucide-react'

interface ExamPaper {
  title: string
  sections: { title: string; questions: { no: number; text: string; marks: number; answer?: string }[] }[]
}

const subjectsByClass: Record<string, string[]> = {
  '8': ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Hindi'],
  '9': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Economics'],
  '10': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Economics', 'Computer Science'],
  '11': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Accountancy', 'Economics', 'Computer Science'],
  '12': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Accountancy', 'Economics', 'Computer Science'],
}

const STEPS = ['Analyzing syllabus...', 'Generating questions...', 'Building marking scheme...', 'Finalising paper...']

export default function ExamGeneratorPage() {
  const [form, setForm] = useState({
    subject: 'Physics', class: '10', board: 'CBSE', topic: 'Electricity and Magnetism',
    totalMarks: '40', duration: '90', difficulty: 'Medium',
    mcq: '10', short: '3', long: '2'
  })
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [paper, setPaper] = useState<ExamPaper | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<{ generationTime?: string; fromCache?: boolean; tokensUsed?: number } | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const generate = async () => {
    setLoading(true)
    setError(null)
    setPaper(null)
    setMeta(null)
    setStep(0)

    // Progress stepper
    const interval = setInterval(() => {
      setStep(s => Math.min(s + 1, STEPS.length - 1))
    }, 4000)

    abortRef.current = new AbortController()

    try {
      const res = await fetch('/api/exam/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
        signal: abortRef.current.signal,
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate paper')
      }

      setPaper(data.paper)
      setMeta({ generationTime: data.generationTime, fromCache: data.fromCache, tokensUsed: data.tokensUsed })
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setError(err.message || 'Something went wrong. Please try again.')
      }
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <FileText className="w-7 h-7 text-indigo-600" /> AI Exam Generator
        </h1>
        <p className="text-gray-500 mt-1">Generate a complete, board-aligned exam paper with marking scheme using Claude AI</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Config Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Paper Configuration</h2>
            <div className="space-y-3">
              {[
                { label: 'Board', key: 'board', type: 'select', options: ['CBSE', 'ICSE', 'Maharashtra', 'Karnataka', 'Tamil Nadu'] },
                { label: 'Class', key: 'class', type: 'select', options: ['8', '9', '10', '11', '12'] },
                { label: 'Subject', key: 'subject', type: 'select', options: subjectsByClass[form.class] || [] },
                { label: 'Topic / Chapter', key: 'topic', type: 'text' },
                { label: 'Total Marks', key: 'totalMarks', type: 'select', options: ['20', '25', '40', '50', '80', '100'] },
                { label: 'Duration (mins)', key: 'duration', type: 'select', options: ['30', '60', '90', '120', '180'] },
                { label: 'Difficulty', key: 'difficulty', type: 'select', options: ['Easy', 'Medium', 'Hard', 'Mixed'] },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                  {f.type === 'select' ? (
                    <select value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white">
                      {f.options?.map(o => <option key={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
                  )}
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">Question Distribution</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'MCQ', key: 'mcq' },
                    { label: 'Short', key: 'short' },
                    { label: 'Long', key: 'long' },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-xs text-gray-400 mb-1">{f.label}</label>
                      <input type="number" min="0" max="20" value={(form as any)[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} className="w-full border border-gray-200 rounded-lg px-2 py-2 text-sm text-center focus:ring-2 focus:ring-indigo-500 outline-none" />
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={generate} disabled={loading || !form.topic.trim()} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 hover:shadow-lg transition-all mt-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />{STEPS[step]}</> : <><Sparkles className="w-4 h-4" />Generate Paper</>}
              </button>
            </div>
          </div>
        </div>

        {/* Generated Paper */}
        <div className="lg:col-span-2">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-red-800 font-medium text-sm">{error}</p>
                <button onClick={generate} className="text-red-600 text-xs mt-2 underline hover:no-underline">Try again</button>
              </div>
            </div>
          )}

          {loading && !paper && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="space-y-3">
                {STEPS.map((s, i) => (
                  <div key={s} className={`flex items-center gap-3 text-sm transition-all ${i <= step ? 'text-indigo-700 font-medium' : 'text-gray-300'}`}>
                    {i < step ? (
                      <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                    ) : i === step ? (
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                    )}
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          {paper ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div>
                  <h2 className="font-bold text-gray-900">Generated Paper</h2>
                  {meta && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      {meta.fromCache ? 'Served from cache' : `Generated in ${meta.generationTime}s`}
                      {meta.tokensUsed ? ` · ${meta.tokensUsed} tokens` : ''}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setPaper(null); setMeta(null); generate() }} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                  </button>
                  <button onClick={() => window.print()} className="flex items-center gap-1.5 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">
                    <Download className="w-3.5 h-3.5" /> Print / PDF
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="text-center mb-6 pb-4 border-b border-gray-200">
                  <h3 className="font-black text-gray-900 text-lg whitespace-pre-line">{paper.title}</h3>
                  <p className="text-sm text-gray-500 mt-2">Total Marks: {form.totalMarks} | Duration: {form.duration} minutes | Board: {form.board}</p>
                </div>
                {paper.sections.map(section => (
                  <div key={section.title} className="mb-6">
                    <h4 className="font-bold text-gray-800 text-sm mb-3 bg-indigo-50 px-4 py-2 rounded-lg">{section.title}</h4>
                    <div className="space-y-4">
                      {section.questions.map(q => (
                        <div key={q.no} className="border border-gray-100 rounded-xl p-4">
                          <div className="flex justify-between items-start mb-1">
                            <p className="text-sm text-gray-800 flex-1"><span className="font-bold">{q.no}.</span> {q.text}</p>
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full ml-2 flex-shrink-0">[{q.marks}m]</span>
                          </div>
                          {q.answer && (
                            <details className="mt-2">
                              <summary className="text-xs text-indigo-600 cursor-pointer font-medium hover:underline">Show model answer</summary>
                              <p className="text-xs text-gray-600 mt-2 bg-emerald-50 border border-emerald-100 rounded-lg p-3 leading-relaxed">{q.answer}</p>
                            </details>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : !loading && (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center h-full min-h-80">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Configure and Generate</h3>
              <p className="text-gray-400 text-sm max-w-xs">Set your exam parameters on the left and click &quot;Generate Paper&quot; — Claude will create a complete exam with marking scheme.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
