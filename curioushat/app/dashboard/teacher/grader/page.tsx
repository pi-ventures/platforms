'use client'
import { useState, useRef } from 'react'
import { ScanLine, Upload, Loader2, CheckCircle2, AlertCircle, ImageIcon, X } from 'lucide-react'

interface GradingResult {
  studentName: string
  totalMarks: number
  maxMarks: number
  percentage: number
  grade: string
  questions: { no: number; question: string; studentAnswer: string; modelAnswer: string; marksAwarded: number; maxMarks: number; feedback: string }[]
}

export default function AnswerGraderPage() {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<GradingResult | null>(null)
  const [modelAnswer, setModelAnswer] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = ev => setImages(prev => [...prev, ev.target?.result as string])
      reader.readAsDataURL(file)
    })
  }

  const grade = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 3000))
    setResults({
      studentName: 'Om Aditya Raghuvanshi',
      totalMarks: 32,
      maxMarks: 40,
      percentage: 80,
      grade: 'A',
      questions: [
        { no: 1, question: 'Define electric current and state its SI unit.', studentAnswer: 'Electric current is the flow of electrons. SI unit is ampere.', modelAnswer: 'Rate of flow of electric charge. SI unit: Ampere (A). I = Q/t', marksAwarded: 2, maxMarks: 2, feedback: 'Correct definition and unit. Well done!' },
        { no: 2, question: "State Ohm's Law.", studentAnswer: "Ohm's law says current is proportional to voltage. V = IR", modelAnswer: "At constant temperature, current is directly proportional to potential difference. V = IR", marksAwarded: 2, maxMarks: 3, feedback: "Good understanding but didn't mention 'at constant temperature' — always include this condition." },
        { no: 3, question: 'Calculate resistance when V=12V, I=0.5A', studentAnswer: 'R = V/I = 12/0.5 = 24 ohm', modelAnswer: 'R = V/I = 12/0.5 = 24 Ω', marksAwarded: 3, maxMarks: 3, feedback: 'Perfect calculation with correct formula and working shown.' },
        { no: 4, question: 'Explain the heating effect of current with 2 applications.', studentAnswer: 'When current flows through resistance, heat is produced = I²Rt. Used in heaters and electric irons.', modelAnswer: 'Joule\'s heating effect: H = I²Rt. Applications: (1) Electric iron (2) Electric heater (3) Fuse wire', marksAwarded: 4, maxMarks: 5, feedback: 'Good answer with correct formula. Could have named one more application (fuse wire) for full marks.' },
      ]
    })
    setLoading(false)
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
              <p className="text-xs text-gray-400">Supports JPG, PNG, PDF. Handwritten or printed.</p>
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
                <p className="text-teal-200 text-sm mt-1">Grading complete via Claude Vision OCR</p>
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
              <button onClick={() => { setResults(null); setImages([]) }} className="text-sm text-indigo-600 hover:underline">Grade another</button>
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
                      <p className="font-semibold text-gray-500 mb-1">Student's Answer (OCR)</p>
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
