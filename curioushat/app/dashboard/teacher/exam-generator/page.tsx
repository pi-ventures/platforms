'use client'
import { useState } from 'react'
import { FileText, Loader2, Download, RefreshCw, Sparkles } from 'lucide-react'

interface ExamPaper {
  title: string
  sections: { title: string; questions: { no: number; text: string; marks: number; answer?: string }[] }[]
}

const subjectsByClass: Record<string, string[]> = {
  '8': ['Mathematics', 'Science', 'English', 'History', 'Geography', 'Hindi'],
  '9': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Economics'],
  '10': ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'History', 'Economics', 'Computer Science'],
}

export default function ExamGeneratorPage() {
  const [form, setForm] = useState({
    subject: 'Physics', class: '10', board: 'CBSE', topic: 'Electricity and Magnetism',
    totalMarks: '40', duration: '90', difficulty: 'Medium',
    mcq: '10', short: '3', long: '2'
  })
  const [loading, setLoading] = useState(false)
  const [paper, setPaper] = useState<ExamPaper | null>(null)

  const generate = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 2500))
    setPaper({
      title: `${form.board} Class ${form.class} ${form.subject} — Unit Test\n${form.topic}`,
      sections: [
        {
          title: 'Section A — Multiple Choice Questions (1 × 10 = 10 marks)',
          questions: [
            { no: 1, text: 'The SI unit of electric charge is:', marks: 1, answer: '(c) Coulomb' },
            { no: 2, text: 'Ohm\'s Law states that V = IR, where R is constant for a given conductor at:', marks: 1, answer: '(b) Constant temperature' },
            { no: 3, text: 'The resistance of a conductor is inversely proportional to its:', marks: 1, answer: '(a) Cross-sectional area' },
            { no: 4, text: 'Electric power is given by:', marks: 1, answer: '(d) P = V²/R' },
            { no: 5, text: 'Magnetic field lines exit from which pole of a magnet?', marks: 1, answer: '(b) North pole' },
          ]
        },
        {
          title: 'Section B — Short Answer Questions (3 × 3 = 9 marks)',
          questions: [
            { no: 6, text: 'State and explain Faraday\'s laws of electromagnetic induction.', marks: 3, answer: 'Faraday\'s 1st law: Whenever magnetic flux linked with a circuit changes, an EMF is induced. 2nd law: The magnitude of induced EMF equals the rate of change of magnetic flux.' },
            { no: 7, text: 'A resistor of 20Ω is connected to a 9V battery. Calculate the current flowing through the circuit and power dissipated.', marks: 3, answer: 'I = V/R = 9/20 = 0.45A. P = V²/R = 81/20 = 4.05W' },
            { no: 8, text: 'Differentiate between AC and DC with two examples each.', marks: 3, answer: 'AC: alternating current, direction reverses periodically. Examples: household supply (220V, 50Hz), generators. DC: flows in one direction. Examples: batteries, solar cells.' },
          ]
        },
        {
          title: 'Section C — Long Answer Questions (5 × 2 = 10 marks)',
          questions: [
            { no: 9, text: 'Describe the construction and working of an AC generator. Draw a neat labelled diagram and explain the role of slip rings.', marks: 5, answer: 'An AC generator converts mechanical energy to electrical energy using electromagnetic induction. Key parts: rectangular coil, strong horseshoe magnet, slip rings, brushes, external circuit. Working: As coil rotates in magnetic field, flux changes inducing EMF according to Faraday\'s law. Slip rings allow current to flow without tangling. One complete rotation = one complete AC cycle.' },
            { no: 10, text: 'What is the heating effect of electric current? Derive an expression for heat produced and state three practical applications of the heating effect.', marks: 5, answer: 'Heating effect (Joule heating): When current flows through a conductor, electrical energy is converted to heat energy. Derivation: Work done W = VIt = I²Rt (using V=IR). H = I²Rt joules. Applications: Electric iron, electric heater, electric fuse (safety device).' },
          ]
        }
      ]
    })
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <FileText className="w-7 h-7 text-indigo-600" /> AI Exam Generator
        </h1>
        <p className="text-gray-500 mt-1">Generate a complete, board-aligned exam paper with marking scheme in 60 seconds</p>
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

              <button onClick={generate} disabled={loading} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 hover:shadow-lg transition-all mt-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Generating...</> : <><Sparkles className="w-4 h-4" />Generate Paper</>}
              </button>
            </div>
          </div>
        </div>

        {/* Generated Paper */}
        <div className="lg:col-span-2">
          {paper ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">Generated Paper</h2>
                <div className="flex gap-2">
                  <button onClick={() => setPaper(null)} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50">
                    <RefreshCw className="w-3.5 h-3.5" /> Regenerate
                  </button>
                  <button className="flex items-center gap-1.5 text-sm bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700">
                    <Download className="w-3.5 h-3.5" /> Export PDF
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
          ) : (
            <div className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-12 flex flex-col items-center justify-center text-center h-full min-h-80">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Configure and Generate</h3>
              <p className="text-gray-400 text-sm max-w-xs">Set your exam parameters on the left and click "Generate Paper" — Claude will create a complete exam with marking scheme.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
