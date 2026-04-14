'use client'
import { useState, useRef } from 'react'
import { ScanLine, Loader2, CheckCircle2, AlertCircle, ImageIcon, X } from 'lucide-react'

interface GradingResult {
  studentName: string
  totalMarks: number
  maxMarks: number
  percentage: number
  grade: string
  questions: { no: number; question: string; studentAnswer: string; modelAnswer: string; marksAwarded: number; maxMarks: number; feedback: string }[]
}

const STEPS = ['Scanning answer sheets...', 'Reading handwriting (OCR)...', 'Comparing with model answers...', 'Calculating marks...']

export default function AnswerGraderPage() {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [results, setResults] = useState<GradingResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<{ gradingTime?: string; tokensUsed?: number } | null>(null)
  const [modelAnswer, setModelAnswer] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        setError(`File "${file.name}" is too large (max 10MB). Please compress or resize.`)
        return
      }
      const reader = new FileReader()
      reader.onload = ev => setImages(prev => [...prev, ev.target?.result as string])
      reader.readAsDataURL(file)
    })
  }

  const grade = async () => {
    setLoading(true)
    setError(null)
    setResults(null)
    setMeta(null)
    setStep(0)

    const interval = setInterval(() => {
      setStep(s => Math.min(s + 1, STEPS.length - 1))
    }, 5000)

    try {
      const res = await fetch('/api/exam/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ images, modelAnswer }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to grade answer sheets')
      }

      setResults({
        studentName: data.studentName,
        totalMarks: data.totalMarks,
        maxMarks: data.maxMarks,
        percentage: data.percentage,
        grade: data.grade,
        questions: data.questions,
      })
      setMeta({ gradingTime: data.gradingTime, tokensUsed: data.tokensUsed })
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      clearInterval(interval)
      setLoading(false)
    }
  }

  const gradeColor = (g: string) => {
    if (g === 'A+' || g === 'A') return 'text-emerald-600 bg-emerald-100'
    if (g === 'B+' || g === 'B') return 'text-blue-600 bg-blue-100'
    return 'text-amber-600 bg-amber-100'
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <ScanLine className="w-7 h-7 text-teal-600" /> AI Answer Sheet Grader
        </h1>
        <p className="text-gray-500 mt-1">Upload scanned answer sheets — Claude Vision reads handwriting and grades each answer semantically</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-red-800 text-sm">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4 text-red-400" /></button>
        </div>
      )}

      {!results ? (
        <div className="space-y-5">
          {/* Upload Zone */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-4">Upload Answer Sheets</h2>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-teal-400 hover:bg-teal-50 transition-all"
            >
              <input ref={fileRef} type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
              <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <ImageIcon className="w-7 h-7 text-teal-600" />
              </div>
              <p className="text-gray-700 font-medium mb-1">Click to upload answer sheet photos</p>
              <p className="text-xs text-gray-400">Supports JPG, PNG. Handwritten or printed. Max 10MB per image.</p>
            </div>

            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <img src={img} alt={`Sheet ${i+1}`} className="w-full h-24 object-cover rounded-lg border border-gray-200" />
                    <button onClick={() => setImages(prev => prev.filter((_, j) => j !== i))} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Model Answer */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-gray-900 mb-3">Model Answer / Marking Scheme (optional)</h2>
            <textarea
              value={modelAnswer} onChange={e => setModelAnswer(e.target.value)}
              placeholder="Paste the model answers or marking scheme here. If left blank, Claude will grade based on subject knowledge..."
              rows={5}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none resize-none"
            />
          </div>

          {/* Loading progress */}
          {loading && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="space-y-3">
                {STEPS.map((s, i) => (
                  <div key={s} className={`flex items-center gap-3 text-sm transition-all ${i <= step ? 'text-teal-700 font-medium' : 'text-gray-300'}`}>
                    {i < step ? (
                      <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center"><svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg></div>
                    ) : i === step ? (
                      <Loader2 className="w-5 h-5 animate-spin text-teal-600" />
                    ) : (
                      <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                    )}
                    {s}
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={grade} disabled={loading || images.length === 0} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-50 hover:shadow-lg transition-all">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" />Grading with Claude Vision...</> : <><ScanLine className="w-5 h-5" />Grade Answer Sheets</>}
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Score Header */}
          <div className="bg-gradient-to-br from-teal-600 to-emerald-600 rounded-2xl p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black">{results.studentName}</h2>
                <p className="text-teal-200 text-sm mt-1">
                  Graded via Claude Vision OCR
                  {meta?.gradingTime && ` in ${meta.gradingTime}s`}
                </p>
              </div>
              <div className="text-right">
                <div className="text-5xl font-black">{results.totalMarks}<span className="text-2xl text-teal-300">/{results.maxMarks}</span></div>
                <div className="flex items-center gap-2 mt-1 justify-end">
                  <span className="text-2xl font-bold">{results.percentage}%</span>
                  <span className={`text-sm font-bold px-3 py-1 rounded-full ${gradeColor(results.grade)} `}>{results.grade}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Per-question breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Question-by-Question Breakdown</h2>
              <button onClick={() => { setResults(null); setMeta(null); setImages([]) }} className="text-sm text-indigo-600 hover:underline">Grade another</button>
            </div>
            <div className="divide-y divide-gray-50">
              {results.questions.map(q => (
                <div key={q.no} className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Q{q.no}</span>
                      <p className="text-sm font-medium text-gray-800 mt-0.5">{q.question}</p>
                    </div>
                    <div className="ml-4 text-right flex-shrink-0">
                      <span className={`text-lg font-black ${q.marksAwarded === q.maxMarks ? 'text-emerald-600' : q.marksAwarded >= q.maxMarks * 0.6 ? 'text-blue-600' : 'text-amber-600'}`}>
                        {q.marksAwarded}/{q.maxMarks}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3 text-xs">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="font-semibold text-gray-500 mb-1">Student&apos;s Answer (OCR)</p>
                      <p className="text-gray-700 italic">{q.studentAnswer}</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="font-semibold text-emerald-700 mb-1">Model Answer</p>
                      <p className="text-gray-700">{q.modelAnswer}</p>
                    </div>
                  </div>
                  <div className={`flex items-start gap-2 text-xs rounded-lg p-3 ${q.marksAwarded === q.maxMarks ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-800'}`}>
                    {q.marksAwarded === q.maxMarks ? <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />}
                    <p><span className="font-semibold">AI Feedback:</span> {q.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
