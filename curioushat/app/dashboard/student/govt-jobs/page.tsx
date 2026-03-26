'use client'
import { useState } from 'react'
import { Search, BookOpen, ChevronRight, ChevronDown, X, Clock, Users, Award, FileText, Brain, Target, BarChart3, Shield, Sparkles, TrendingUp } from 'lucide-react'
import {
  ENTRANCE_EXAMS, DEGREE_PROGRAMS, PREP_PATHWAYS, CATEGORY_LABELS,
  getExamsForDegree, getDegreesForExam,
  type EntranceExam, type DegreeProgram, type PrepPathway,
} from '@/lib/higher-education'

const govtExams = ENTRANCE_EXAMS.filter(e =>
  ['upsc-cse','upsc-cds','upsc-capf','upsc-epfo',
   'ssc-cgl','ssc-chsl','ssc-mts','ssc-gd','ssc-je',
   'ibps-po','ibps-clerk','sbi-po','sbi-clerk','rbi-grade-b','rbi-assistant',
   'rrb-ntpc','rrb-group-d','rrb-je','rrb-alp',
   'state-psc','ctet','ugc-net','kvs-pgt-tgt',
   'lic-aao','niacl-ao','judicial-services','nabard-grade-a','sebi-grade-a',
  ].includes(e.id)
)

const govtCareers = DEGREE_PROGRAMS.filter(d => d.category === 'govt_job')

const EXAM_CATEGORIES = [
  { key: 'upsc', label: 'UPSC', icon: '🏛️', ids: ['upsc-cse','upsc-cds','upsc-capf','upsc-epfo'] },
  { key: 'ssc', label: 'SSC', icon: '📝', ids: ['ssc-cgl','ssc-chsl','ssc-mts','ssc-gd','ssc-je'] },
  { key: 'banking', label: 'Banking', icon: '🏦', ids: ['ibps-po','ibps-clerk','sbi-po','sbi-clerk','rbi-grade-b','rbi-assistant','nabard-grade-a','sebi-grade-a'] },
  { key: 'railways', label: 'Railways', icon: '🚆', ids: ['rrb-ntpc','rrb-group-d','rrb-je','rrb-alp'] },
  { key: 'state', label: 'State PSC', icon: '🗺️', ids: ['state-psc'] },
  { key: 'teaching', label: 'Teaching', icon: '📚', ids: ['ctet','ugc-net','kvs-pgt-tgt'] },
  { key: 'insurance', label: 'Insurance', icon: '🏢', ids: ['lic-aao','niacl-ao'] },
  { key: 'judicial', label: 'Judicial', icon: '⚖️', ids: ['judicial-services'] },
]

function ExamCard({ exam }: { exam: EntranceExam }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-violet-200 transition-all">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
        <span className="text-lg">{exam.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-gray-900 text-sm">{exam.name}</p>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: exam.color + '15', color: exam.color }}>{exam.candidatesPerYear}</span>
          </div>
          <p className="text-[10px] text-gray-400 truncate">{exam.fullName}</p>
        </div>
        <div className="text-right hidden sm:block flex-shrink-0">
          <p className="text-xs text-gray-500">{exam.months.join(', ')}</p>
          <p className="text-[10px] text-gray-400">{exam.mode} · {exam.durationMin}min</p>
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />}
      </button>
      {open && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <div className="bg-gray-50 rounded-lg px-3 py-2"><p className="text-[10px] text-gray-400">Marks</p><p className="text-sm font-bold">{exam.totalMarks}</p></div>
            <div className="bg-gray-50 rounded-lg px-3 py-2"><p className="text-[10px] text-gray-400">Duration</p><p className="text-sm font-bold">{exam.durationMin} min</p></div>
            <div className="bg-gray-50 rounded-lg px-3 py-2"><p className="text-[10px] text-gray-400">Negative</p><p className="text-sm font-bold">{exam.negativeMarking ? 'Yes' : 'No'}</p></div>
            <div className="bg-gray-50 rounded-lg px-3 py-2"><p className="text-[10px] text-gray-400">By</p><p className="text-sm font-bold truncate">{exam.conductedBy}</p></div>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-semibold mb-1">Subjects</p>
            <div className="flex flex-wrap gap-1">{exam.subjects.map(s => <span key={s} className="text-[10px] px-2 py-0.5 rounded-lg bg-violet-50 text-violet-700 font-medium">{s}</span>)}</div>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 font-semibold mb-1">Posts / Accepted By</p>
            <div className="flex flex-wrap gap-1">{exam.acceptedBy.map(a => <span key={a} className="text-[10px] px-2 py-0.5 rounded-lg bg-gray-100 text-gray-600">{a}</span>)}</div>
          </div>
          <div className="flex flex-wrap gap-2 pt-1">
            <button className="flex items-center gap-1.5 text-xs bg-violet-600 text-white px-3 py-1.5 rounded-lg hover:bg-violet-700">
              <Brain className="w-3 h-3" /> Start AI Prep <span className="text-[8px] bg-amber-400 text-white px-1 rounded font-bold">★ Pro</span>
            </button>
            <button className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              <FileText className="w-3 h-3" /> Mock Tests
            </button>
            <button className="flex items-center gap-1.5 text-xs border border-gray-200 text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              <Target className="w-3 h-3" /> PYQs
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function PathwayCard({ pathway }: { pathway: PrepPathway }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50">
        <span className="text-xl">{pathway.icon}</span>
        <div className="flex-1">
          <p className="font-bold text-gray-900 text-sm">{pathway.name}</p>
          <p className="text-[10px] text-gray-400">{pathway.levels.length} stages · Starts from {pathway.levels[0].grade}</p>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-100 pt-3">
          <div className="relative">
            {pathway.levels.map((level, i) => (
              <div key={level.grade} className="flex gap-3 mb-4 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black text-white flex-shrink-0" style={{ backgroundColor: pathway.color }}>
                    {i + 1}
                  </div>
                  {i < pathway.levels.length - 1 && <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: pathway.color + '30' }} />}
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs font-bold text-gray-900">{level.grade}</p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: pathway.color + '15', color: pathway.color }}>{level.focus}</span>
                    <span className="text-[9px] text-gray-400 ml-auto">{level.hoursPerWeek} hrs/week</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {level.topics.map(t => (
                      <span key={t} className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-gray-100">
            <p className="text-[10px] text-gray-500 mb-1.5">Target Exams:</p>
            <div className="flex flex-wrap gap-1">
              {pathway.targetExams.map(id => {
                const exam = ENTRANCE_EXAMS.find(e => e.id === id)
                return exam ? <span key={id} className="text-[9px] px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: exam.color + '15', color: exam.color }}>{exam.name}</span> : null
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function GovtJobsPage() {
  const [tab, setTab] = useState<'exams' | 'pathways' | 'careers'>('exams')
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string>('all')

  const filteredExams = govtExams.filter(e => {
    if (activeCategory !== 'all') {
      const cat = EXAM_CATEGORIES.find(c => c.key === activeCategory)
      if (cat && !cat.ids.includes(e.id)) return false
    }
    if (search) return e.name.toLowerCase().includes(search.toLowerCase()) || e.fullName.toLowerCase().includes(search.toLowerCase())
    return true
  })

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">Government Job Exam Prep</h1>
        <p className="text-gray-500 text-sm mt-1">
          UPSC · SSC · Banking · Railways · State PSC · Teaching · Defence · Insurance · Judicial — AI-powered prep from school level to selection
        </p>
        <p className="text-[11px] text-violet-500 mt-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3" /> Start foundation prep as early as Class 6 — CuriousHat maps your school syllabus to future govt exam topics
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-red-50 rounded-lg flex items-center justify-center"><FileText className="w-4 h-4 text-red-600" /></div>
          <div><p className="text-xl font-black text-gray-900">{govtExams.length}</p><p className="text-[10px] text-gray-500">Govt Exams</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-violet-50 rounded-lg flex items-center justify-center"><Target className="w-4 h-4 text-violet-600" /></div>
          <div><p className="text-xl font-black text-gray-900">{govtCareers.length}</p><p className="text-[10px] text-gray-500">Career Paths</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center"><TrendingUp className="w-4 h-4 text-blue-600" /></div>
          <div><p className="text-xl font-black text-gray-900">{PREP_PATHWAYS.length}</p><p className="text-[10px] text-gray-500">Prep Pathways</p></div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-3 flex items-center gap-2.5">
          <div className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center"><Users className="w-4 h-4 text-amber-600" /></div>
          <div><p className="text-xl font-black text-gray-900">5 Cr+</p><p className="text-[10px] text-gray-500">Candidates/Year</p></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 mb-5">
        {([
          { key: 'exams', label: '📝 Exams (28)' },
          { key: 'pathways', label: '🛤️ Prep Pathways (Class 6→Selection)' },
          { key: 'careers', label: '💼 Career Paths' },
        ] as const).map(t => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-colors ${
              tab === t.key ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>{t.label}</button>
        ))}
      </div>

      {/* ── EXAMS TAB ── */}
      {tab === 'exams' && (
        <>
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search — UPSC, SBI PO, SSC CGL, RRB NTPC…"
              className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            <button onClick={() => setActiveCategory('all')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium ${activeCategory === 'all' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              All ({govtExams.length})
            </button>
            {EXAM_CATEGORIES.map(c => (
              <button key={c.key} onClick={() => setActiveCategory(c.key)}
                className={`text-xs px-3 py-1.5 rounded-lg font-medium ${activeCategory === c.key ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                {c.icon} {c.label} ({c.ids.length})
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {filteredExams.map(e => <ExamCard key={e.id} exam={e} />)}
            {filteredExams.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p className="font-medium">No exams match your search</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── PATHWAYS TAB ── */}
      {tab === 'pathways' && (
        <>
          <div className="bg-gradient-to-r from-red-50 to-amber-50 border border-red-200 rounded-xl p-5 mb-5">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-red-600" />
              <h3 className="font-bold text-gray-900 text-sm">School → Coaching → Government Job</h3>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              CuriousHat maps your school syllabus to future government exam topics. A Class 6 student reading NCERT History is already building foundations for UPSC.
              Each pathway shows exactly what to study at each grade level, how many hours per week, and which exam topics it feeds into.
              <strong> Your school becomes your first coaching institute.</strong>
            </p>
          </div>

          <div className="space-y-3">
            {PREP_PATHWAYS.map(p => <PathwayCard key={p.id} pathway={p} />)}
          </div>
        </>
      )}

      {/* ── CAREERS TAB ── */}
      {tab === 'careers' && (
        <div className="space-y-3">
          {govtCareers.map(c => {
            const exams = getExamsForDegree(c.id)
            return (
              <div key={c.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-red-200 transition-all">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{c.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{c.degree}</p>
                    <p className="text-[11px] text-gray-400">{c.fullName}</p>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.specializations.slice(0, 6).map(s => (
                        <span key={s} className="text-[9px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-md">{s}</span>
                      ))}
                      {c.specializations.length > 6 && <span className="text-[9px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-md font-medium">+{c.specializations.length - 6} more</span>}
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-[10px] text-gray-500 flex-wrap">
                      <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> Exams: {exams.map(e => e.name).join(', ')}</span>
                      <span className="flex items-center gap-1"><BarChart3 className="w-3 h-3" /> {c.salaryRange}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {c.duration}</span>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {c.careers.slice(0, 4).map(cr => (
                        <span key={cr} className="text-[9px] bg-emerald-50 text-emerald-700 px-1.5 py-0.5 rounded-md font-medium">{cr}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
