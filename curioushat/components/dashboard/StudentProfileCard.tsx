'use client'
import { useState } from 'react'
import {
  User, MapPin, GraduationCap, BookOpen, Award, TrendingUp, Brain,
  Share2, Download, Send, X, ChevronRight, Star, Shield, Globe,
  BarChart3, Target, Sparkles, Clock, CheckCircle2, ExternalLink
} from 'lucide-react'

/* ── Types ── */
export interface StudentProfile {
  id: string
  name: string
  photo?: string
  dob: string
  gender: 'Male' | 'Female' | 'Other'
  category: 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority'
  aadhar?: string
  aparId?: string // Academic Bank of Credits

  // School
  school: string
  schoolType: 'Private' | 'Government' | 'Aided' | 'Central (KV/NV)'
  board: string
  class: string
  section: string
  rollNo: string
  city: string
  state: string
  pin: string

  // Academic
  subjects: { name: string; marks: number; total: number; grade: string; percentile?: number }[]
  overallPct: number
  rank?: number
  attendance: number // percentage
  boardResults?: { exam: string; year: number; pct: number; subjects: { name: string; marks: number; total: number }[] }[]

  // Strengths
  topSubjects: string[]
  weakSubjects: string[]
  aiStrengthIndex: Record<string, number> // 0-100 per subject

  // Entrance exams
  entranceExams?: { exam: string; score: string; rank?: number; percentile?: number; year: number }[]

  // AI career recommendations
  aiRecommendations?: { course: string; degree: string; confidence: number; reason: string }[]

  // Scholarships eligible
  scholarships?: { name: string; amount: string; eligibility: string; status: 'eligible' | 'applied' | 'awarded' }[]

  // Extracurricular
  activities?: string[]
  achievements?: string[]
}

/* ── Mock student data ── */
export const MOCK_STUDENT: StudentProfile = {
  id: 'STU-2026-001',
  name: 'Om Aditya Raghuvanshi',
  dob: '2008-07-15',
  gender: 'Male',
  category: 'General',
  aparId: 'APAR-2026-4821',

  school: 'Delhi Public School, Noida',
  schoolType: 'Private',
  board: 'CBSE',
  class: 'Class XII',
  section: 'A',
  rollNo: '12A-042',
  city: 'Noida',
  state: 'Uttar Pradesh',
  pin: '201301',

  subjects: [
    { name: 'Mathematics', marks: 94, total: 100, grade: 'A1', percentile: 97.2 },
    { name: 'Physics', marks: 87, total: 100, grade: 'A1', percentile: 92.1 },
    { name: 'Chemistry', marks: 82, total: 100, grade: 'A2', percentile: 88.5 },
    { name: 'English', marks: 89, total: 100, grade: 'A1', percentile: 94.3 },
    { name: 'Computer Science', marks: 96, total: 100, grade: 'A1', percentile: 98.8 },
  ],
  overallPct: 89.6,
  rank: 12,
  attendance: 94,

  boardResults: [
    { exam: 'CBSE Class X', year: 2024, pct: 91.4, subjects: [
      { name: 'Mathematics', marks: 95, total: 100 },
      { name: 'Science', marks: 90, total: 100 },
      { name: 'Social Science', marks: 88, total: 100 },
      { name: 'English', marks: 92, total: 100 },
      { name: 'Hindi', marks: 82, total: 100 },
    ]},
  ],

  topSubjects: ['Computer Science', 'Mathematics', 'English'],
  weakSubjects: ['Chemistry'],
  aiStrengthIndex: {
    Mathematics: 94, Physics: 82, Chemistry: 68, English: 89,
    'Computer Science': 96, 'Logical Reasoning': 91, 'Problem Solving': 93,
  },

  entranceExams: [
    { exam: 'JEE Main', score: '98.2 %ile', rank: 1842, percentile: 98.2, year: 2026 },
    { exam: 'JEE Advanced', score: '210/360', rank: 4580, year: 2026 },
    { exam: 'BITSAT', score: '342/450', year: 2026 },
    { exam: 'CUET (UG)', score: '780/800', rank: 420, percentile: 99.5, year: 2026 },
    { exam: 'CLAT', score: '108/150', rank: 3200, year: 2026 },
    { exam: 'NDA (UPSC)', score: '580/900', rank: 890, year: 2026 },
  ],

  aiRecommendations: [
    // Engineering
    { course: 'B.Tech Computer Science', degree: 'B.Tech', confidence: 95, reason: 'CS 96%, Maths 94%, strong logical reasoning. JEE Main 98.2%ile qualifies for top NITs.' },
    { course: 'B.Tech AI & Machine Learning', degree: 'B.Tech', confidence: 92, reason: 'Exceptional CS + Maths combo. Highest demand field. IIT/NIT AI programmes opening.' },
    { course: 'Integrated M.Tech (CS) — IIT', degree: 'Integrated (5yr)', confidence: 85, reason: 'IIT dual degree — direct PG. Suits research interest. JEE Advanced rank qualifies.' },
    // Science / Research
    { course: 'B.Sc (Hons) Mathematics', degree: 'B.Sc', confidence: 82, reason: 'Maths 94%. If preferring pure sciences — DU/St. Stephen\'s/CMI/ISI. Strong for research path.' },
    { course: 'B.Sc Data Science & AI', degree: 'B.Sc', confidence: 80, reason: 'IIT Madras online degree or IIIT Hyderabad. 3-year, flexible, top placements.' },
    { course: 'B.Sc (Hons) Computer Science', degree: 'B.Sc', confidence: 78, reason: 'DU/JNU/BHU. Strong CS foundation without engineering rigour. Good for startup path.' },
    // Management
    { course: 'BBA (Business Analytics)', degree: 'BBA', confidence: 70, reason: 'Maths + CS = perfect for analytics. Christ/NMIMS/IIM Indore IPM after 12th.' },
    { course: 'Integrated BBA-MBA (IIM)', degree: 'Integrated (5yr)', confidence: 72, reason: 'IIM Indore/Rohtak IPM — 5yr direct MBA. Strong maths helps in CAT later.' },
    // Commerce & Finance
    { course: 'B.Com (Hons) + CA Foundation', degree: 'B.Com + CA', confidence: 65, reason: 'Strong maths (94%) is the #1 predictor of CA success. Dual path: degree + professional cert.' },
    { course: 'BCA + MCA (Integrated)', degree: 'Integrated (5yr)', confidence: 75, reason: 'Pure IT without physics/chemistry. CS 96% makes this ideal. Good placement record.' },
    // Law
    { course: 'BA LLB (Integrated)', degree: 'Integrated (5yr)', confidence: 55, reason: 'English 89% + logical reasoning 91%. CLAT/AILET for NLUs. Tech + Law = IP/Cyber Law career.' },
    // Design & Creative
    { course: 'B.Des (UX/Interaction Design)', degree: 'B.Des', confidence: 60, reason: 'CS + problem solving = UX design. UCEED for IIT Design, NID DAT, NIFT. Growing field.' },
    // Defence
    { course: 'NDA (National Defence Academy)', degree: 'Defence', confidence: 58, reason: 'Maths 94%, good fitness. NDA exam has strong maths component. If interested in armed forces.' },
    // Govt Jobs
    { course: 'UPSC Preparation (after graduation)', degree: 'Civil Services', confidence: 50, reason: 'English 89%, strong reasoning. Can start foundation during B.Tech/B.Sc. Maths optional is scoring.' },
    // Vocational / Skill-based
    { course: 'B.Sc Aviation (Pilot Training)', degree: 'B.Sc + CPL', confidence: 45, reason: 'Physics 87%, maths 94%. Pilot career needs strong STEM. IGRUA/Rajiv Gandhi Academy.' },
    // Entrepreneurship
    { course: 'B.Tech + Startup Incubation', degree: 'B.Tech', confidence: 88, reason: 'CS + coding skills (CodeChef 4-star) = startup-ready. IITs/NITs have incubation centres.' },
  ],

  scholarships: [
    { name: 'Central Sector Scholarship (MHRD)', amount: '₹20,000/yr', eligibility: 'Top 20 %ile in board exams', status: 'eligible' },
    { name: 'INSPIRE Scholarship (DST)', amount: '₹80,000/yr', eligibility: 'Top 1% in board / JEE/NEET qualified', status: 'eligible' },
    { name: 'AICTE Pragati Scholarship', amount: '₹50,000/yr', eligibility: 'B.Tech admission, family income <8L', status: 'eligible' },
    { name: 'NIT Merit Scholarship', amount: 'Full tuition waiver', eligibility: 'Top 100 in NIT by JEE rank', status: 'eligible' },
  ],

  activities: ['School Coding Club President', 'Inter-school Math Olympiad — Gold', 'Robotics Team Lead'],
  achievements: ['National Science Olympiad — State Rank 3', 'CodeChef 4-Star Rated', 'Published research paper in school journal'],
}

/* ── Strength bar ── */
function StrengthBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-gray-500 w-24 truncate text-right">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${value}%`, backgroundColor: color }} />
      </div>
      <span className="text-[10px] font-bold text-gray-700 w-7 text-right">{value}</span>
    </div>
  )
}

/* ── Main component ── */
export default function StudentProfileCard({
  student = MOCK_STUDENT,
  mode = 'full',
  onClose,
  onSendToCollege,
  onSendToCoaching,
}: {
  student?: StudentProfile
  mode?: 'full' | 'compact' | 'shareable'
  onClose?: () => void
  onSendToCollege?: (s: StudentProfile) => void
  onSendToCoaching?: (s: StudentProfile) => void
}) {
  const [tab, setTab] = useState<'overview' | 'academics' | 'career' | 'scholarships'>('overview')

  const strengthColor = (v: number) => v >= 85 ? '#059669' : v >= 70 ? '#D97706' : '#DC2626'

  return (
    <div className={`bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm ${mode === 'full' ? 'max-w-3xl mx-auto' : ''}`}>

      {/* ── Header ── */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 text-white">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-xl font-black backdrop-blur-sm border border-white/30">
              {student.name.split(' ').map(w => w[0]).join('')}
            </div>
            <div>
              <h2 className="text-lg font-black">{student.name}</h2>
              <p className="text-violet-200 text-sm">{student.school}</p>
              <div className="flex items-center gap-3 mt-1 text-xs text-violet-200">
                <span className="flex items-center gap-1"><GraduationCap className="w-3 h-3" />{student.class} · {student.board}</span>
                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{student.city}, {student.state}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {onClose && <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg"><X className="w-5 h-5" /></button>}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Overall %', value: `${student.overallPct}%`, icon: BarChart3 },
            { label: 'Class Rank', value: `#${student.rank}`, icon: Award },
            { label: 'Attendance', value: `${student.attendance}%`, icon: Clock },
            { label: 'AI Score', value: Math.round(Object.values(student.aiStrengthIndex).reduce((a, b) => a + b, 0) / Object.keys(student.aiStrengthIndex).length).toString(), icon: Brain },
          ].map(s => (
            <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-xl px-3 py-2 text-center border border-white/10">
              <s.icon className="w-3.5 h-3.5 mx-auto text-violet-200 mb-0.5" />
              <p className="text-sm font-black">{s.value}</p>
              <p className="text-[9px] text-violet-200">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Action bar ── */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2 flex-wrap bg-gray-50">
        {onSendToCollege && (
          <button onClick={() => onSendToCollege(student)} className="flex items-center gap-1.5 text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700 transition-colors">
            <Send className="w-3 h-3" /> Send to College
          </button>
        )}
        {onSendToCoaching && (
          <button onClick={() => onSendToCoaching(student)} className="flex items-center gap-1.5 text-xs bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
            <Send className="w-3 h-3" /> Send to Coaching
          </button>
        )}
        <button className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <Download className="w-3 h-3" /> Download PDF
        </button>
        <button className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">
          <Share2 className="w-3 h-3" /> Share
        </button>
        <div className="ml-auto flex items-center gap-1.5 text-[10px] text-gray-400">
          <Shield className="w-3 h-3" /> ID: {student.id}
          {student.aparId && <span>· APAR: {student.aparId}</span>}
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex items-center gap-1 px-5 pt-3 border-b border-gray-100">
        {(['overview', 'academics', 'career', 'scholarships'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-colors capitalize ${
              tab === t ? 'border-violet-600 text-violet-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="px-5 py-4">

        {/* Overview */}
        {tab === 'overview' && (
          <div className="space-y-5">
            {/* Subject strength heatmap */}
            <div>
              <h3 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                <Brain className="w-3.5 h-3.5 text-violet-500" /> AI Subject Strength Index
              </h3>
              <div className="space-y-1.5">
                {Object.entries(student.aiStrengthIndex)
                  .sort(([, a], [, b]) => b - a)
                  .map(([subject, score]) => (
                    <StrengthBar key={subject} label={subject} value={score} color={strengthColor(score)} />
                  ))}
              </div>
            </div>

            {/* Entrance exams */}
            {student.entranceExams && student.entranceExams.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-emerald-500" /> Entrance Exam Results
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {student.entranceExams.map(e => (
                    <div key={e.exam} className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5">
                      <p className="text-xs font-bold text-gray-900">{e.exam}</p>
                      <p className="text-lg font-black text-violet-600">{e.score}</p>
                      {e.rank && <p className="text-[10px] text-gray-400">All India Rank: #{e.rank.toLocaleString()}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Activities & achievements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {student.activities && (
                <div>
                  <h3 className="text-xs font-bold text-gray-700 mb-2">Extracurricular</h3>
                  <ul className="space-y-1">
                    {student.activities.map(a => (
                      <li key={a} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <Star className="w-3 h-3 text-amber-400 flex-shrink-0 mt-0.5" />{a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {student.achievements && (
                <div>
                  <h3 className="text-xs font-bold text-gray-700 mb-2">Achievements</h3>
                  <ul className="space-y-1">
                    {student.achievements.map(a => (
                      <li key={a} className="text-xs text-gray-600 flex items-start gap-1.5">
                        <Award className="w-3 h-3 text-violet-500 flex-shrink-0 mt-0.5" />{a}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Category & details */}
            <div className="bg-gray-50 rounded-xl px-4 py-3 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div><span className="text-gray-400 block">Category</span><span className="font-semibold text-gray-700">{student.category}</span></div>
              <div><span className="text-gray-400 block">School Type</span><span className="font-semibold text-gray-700">{student.schoolType}</span></div>
              <div><span className="text-gray-400 block">DOB</span><span className="font-semibold text-gray-700">{new Date(student.dob).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
              <div><span className="text-gray-400 block">PIN Code</span><span className="font-semibold text-gray-700">{student.pin}</span></div>
            </div>
          </div>
        )}

        {/* Academics */}
        {tab === 'academics' && (
          <div className="space-y-5">
            {/* Current marks */}
            <div>
              <h3 className="text-xs font-bold text-gray-700 mb-2">Current Year — {student.class} ({student.board})</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-[10px] text-gray-400 uppercase tracking-wider border-b border-gray-100">
                      <th className="pb-2 text-left font-semibold">Subject</th>
                      <th className="pb-2 text-center font-semibold">Marks</th>
                      <th className="pb-2 text-center font-semibold">Grade</th>
                      <th className="pb-2 text-center font-semibold">%ile</th>
                      <th className="pb-2 text-right font-semibold">Strength</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {student.subjects.map(s => (
                      <tr key={s.name}>
                        <td className="py-2 text-xs font-semibold text-gray-900">{s.name}</td>
                        <td className="py-2 text-xs text-center font-bold">{s.marks}/{s.total}</td>
                        <td className="py-2 text-center">
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold">{s.grade}</span>
                        </td>
                        <td className="py-2 text-xs text-center text-gray-500">{s.percentile ? `${s.percentile}%` : '—'}</td>
                        <td className="py-2">
                          <div className="h-1.5 w-16 bg-gray-100 rounded-full overflow-hidden ml-auto">
                            <div className="h-full rounded-full" style={{ width: `${s.marks}%`, backgroundColor: strengthColor(s.marks) }} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t border-gray-200">
                      <td className="pt-2 text-xs font-bold text-gray-900">Overall</td>
                      <td className="pt-2 text-xs text-center font-black text-violet-600">{student.overallPct}%</td>
                      <td colSpan={3} />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            {/* Board results history */}
            {student.boardResults && student.boardResults.map(br => (
              <div key={br.exam}>
                <h3 className="text-xs font-bold text-gray-700 mb-2">{br.exam} ({br.year}) — {br.pct}%</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {br.subjects.map(s => (
                    <div key={s.name} className="bg-gray-50 rounded-lg px-3 py-2 text-center">
                      <p className="text-[10px] text-gray-400">{s.name}</p>
                      <p className="text-sm font-black text-gray-900">{s.marks}/{s.total}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Career */}
        {tab === 'career' && (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4 text-violet-600" />
                <h3 className="text-xs font-bold text-violet-700">AI Career Counsellor — Personalised Recommendations</h3>
              </div>
              <p className="text-[10px] text-gray-500 mb-4">Based on {student.name}&apos;s academic performance, subject strengths (Maths {student.subjects.find(s => s.name === 'Mathematics')?.marks}%, CS {student.subjects.find(s => s.name === 'Computer Science')?.marks}%), entrance exam scores, extracurriculars, and national career demand data:</p>

              {/* Group recommendations by degree type */}
              {(() => {
                const recs = student.aiRecommendations || []
                const categories: Record<string, typeof recs> = {}
                const catLabels: Record<string, { emoji: string; color: string }> = {
                  'B.Tech': { emoji: '⚙️', color: 'violet' },
                  'Integrated': { emoji: '🎓', color: 'indigo' },
                  'B.Sc': { emoji: '🔬', color: 'blue' },
                  'BBA': { emoji: '💼', color: 'amber' },
                  'B.Com + CA': { emoji: '📊', color: 'emerald' },
                  'B.Des': { emoji: '🎨', color: 'pink' },
                  'Defence': { emoji: '🎖️', color: 'red' },
                  'Civil Services': { emoji: '🏛️', color: 'orange' },
                  'B.Sc + CPL': { emoji: '✈️', color: 'cyan' },
                  'Integrated (5yr)': { emoji: '📚', color: 'purple' },
                }
                recs.forEach(r => {
                  const cat = r.degree
                  if (!categories[cat]) categories[cat] = []
                  categories[cat].push(r)
                })
                let globalIdx = 0
                return Object.entries(categories).map(([cat, items]) => {
                  const meta = catLabels[cat] || { emoji: '📋', color: 'gray' }
                  return (
                    <div key={cat} className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm">{meta.emoji}</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{cat}</span>
                        <span className="text-[9px] text-gray-300">{items.length} option{items.length > 1 ? 's' : ''}</span>
                      </div>
                      <div className="space-y-2">
                        {items.map(r => {
                          globalIdx++
                          const matchColor = r.confidence >= 85 ? 'bg-emerald-100 text-emerald-700' : r.confidence >= 70 ? 'bg-blue-100 text-blue-700' : r.confidence >= 55 ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'
                          return (
                            <div key={r.course} className="bg-white rounded-xl p-3 border border-gray-100 flex items-start gap-3 hover:border-violet-200 transition-colors">
                              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-black ${
                                globalIdx <= 3 ? 'bg-violet-600 text-white' : 'bg-gray-200 text-gray-600'
                              }`}>
                                {globalIdx}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <p className="text-xs font-bold text-gray-900">{r.course}</p>
                                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${matchColor}`}>{r.confidence}% match</span>
                                </div>
                                <p className="text-[10px] text-gray-500 mt-0.5 leading-relaxed">{r.reason}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })
              })()}
            </div>

            {/* Entrance exam readiness */}
            {student.entranceExams && (
              <div>
                <h3 className="text-xs font-bold text-gray-700 mb-2">Entrance Exam Performance</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {student.entranceExams.map(e => (
                    <div key={e.exam} className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center">
                      <p className="text-xs font-bold text-gray-900">{e.exam}</p>
                      <p className="text-xl font-black text-violet-600 mt-1">{e.score}</p>
                      {e.rank && <p className="text-[10px] text-gray-400 mt-0.5">AIR #{e.rank.toLocaleString()}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Scholarships */}
        {tab === 'scholarships' && (
          <div className="space-y-4">
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-amber-700">Scholarships & Opportunities You Qualify For</h3>
              </div>
              <p className="text-[11px] text-gray-500">AI-scanned based on your category, marks, board, and entrance exam results:</p>
            </div>
            <div className="space-y-2">
              {student.scholarships?.map(s => (
                <div key={s.name} className="bg-white border border-gray-200 rounded-xl p-4 flex items-center gap-4 hover:border-amber-200 transition-colors">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Award className="w-5 h-5 text-amber-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{s.name}</p>
                    <p className="text-[11px] text-gray-500">{s.eligibility}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-emerald-600">{s.amount}</p>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                      s.status === 'awarded' ? 'bg-emerald-50 text-emerald-600' :
                      s.status === 'applied' ? 'bg-blue-50 text-blue-600' :
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {s.status === 'awarded' ? '✅ Awarded' : s.status === 'applied' ? '📨 Applied' : '🎯 Eligible'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
        <p className="text-[9px] text-gray-400 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5 text-violet-500" />
          Generated by CuriousHat.ai · Certified through Gurukul Global Vidyaniketan
        </p>
        <p className="text-[9px] text-gray-400">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
      </div>
    </div>
  )
}
