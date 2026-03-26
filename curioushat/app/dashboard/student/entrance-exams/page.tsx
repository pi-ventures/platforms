'use client'
import { useState, useMemo } from 'react'
import { Search, BookOpen, ChevronRight, ChevronDown, X, Clock, Users, Award, FileText, Brain, Target, BarChart3, Shield, Globe, Sparkles } from 'lucide-react'
import {
  ENTRANCE_EXAMS, DEGREE_PROGRAMS, CATEGORY_LABELS, CATALOG_STATS,
  getExamsForDegree, getDegreesForExam,
  type EntranceExam, type DegreeProgram,
} from '@/lib/higher-education'

/* ── Helpers ── */
function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: typeof BookOpen; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '15' }}>
          <Icon className="w-4 h-4" style={{ color }} />
        </div>
        <div>
          <p className="text-xl font-black text-gray-900">{value}</p>
          <p className="text-[10px] text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  )
}

/* ── Exam Card ── */
function ExamCard({ exam, onSelect }: { exam: EntranceExam; onSelect: () => void }) {
  const degrees = getDegreesForExam(exam.id)
  return (
    <button onClick={onSelect} className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-violet-300 hover:shadow-sm transition-all w-full group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: exam.color + '15' }}>
          {exam.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-gray-900 text-sm">{exam.name}</p>
            <span className="text-[9px] px-1.5 py-0.5 rounded-full font-medium" style={{ backgroundColor: exam.color + '15', color: exam.color }}>
              {exam.candidatesPerYear}
            </span>
          </div>
          <p className="text-[11px] text-gray-400 mt-0.5">{exam.fullName}</p>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
              <Clock className="w-2.5 h-2.5" />{exam.durationMin} min
            </span>
            <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">
              {exam.totalMarks} marks
            </span>
            <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">
              {exam.mode}
            </span>
            <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">
              {exam.months.join(', ')}
            </span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1.5 truncate">
            For: {degrees.slice(0, 3).map(d => d.degree).join(', ')}{degrees.length > 3 ? ` +${degrees.length - 3} more` : ''}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-500 mt-1 flex-shrink-0" />
      </div>
    </button>
  )
}

/* ── Degree Card ── */
function DegreeCard({ program, onSelect }: { program: DegreeProgram; onSelect: () => void }) {
  const exams = getExamsForDegree(program.id)
  return (
    <button onClick={onSelect} className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-violet-300 hover:shadow-sm transition-all w-full group">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: program.color + '15' }}>
          {program.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-sm">{program.degree}</p>
          <p className="text-[11px] text-gray-400">{program.fullName} · {program.duration}</p>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {program.specializations.slice(0, 5).map(s => (
              <span key={s} className="text-[8px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{s}</span>
            ))}
            {program.specializations.length > 5 && (
              <span className="text-[8px] bg-violet-50 text-violet-600 px-1.5 py-0.5 rounded-md font-medium">+{program.specializations.length - 5} more</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-400">
            <span className="flex items-center gap-0.5"><FileText className="w-2.5 h-2.5" /> {exams.map(e => e.name).join(', ') || 'Direct'}</span>
            <span className="flex items-center gap-0.5 ml-auto"><BarChart3 className="w-2.5 h-2.5" /> {program.salaryRange}</span>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-violet-500 mt-1 flex-shrink-0" />
      </div>
    </button>
  )
}

/* ── Detail Panel ── */
function ExamDetail({ exam, onClose }: { exam: EntranceExam; onClose: () => void }) {
  const degrees = getDegreesForExam(exam.id)
  return (
    <div className="bg-white border border-violet-200 rounded-2xl p-5 mb-6 shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl" style={{ backgroundColor: exam.color + '15' }}>{exam.icon}</div>
          <div>
            <h2 className="font-black text-gray-900 text-lg">{exam.name}</h2>
            <p className="text-sm text-gray-500">{exam.fullName}</p>
            <p className="text-xs text-gray-400 mt-0.5">Conducted by {exam.conductedBy}</p>
          </div>
        </div>
        <button onClick={onClose}><X className="w-5 h-5 text-gray-400" /></button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-[10px] text-gray-400">Duration</p>
          <p className="text-sm font-bold text-gray-900">{exam.durationMin} min</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-[10px] text-gray-400">Total Marks</p>
          <p className="text-sm font-bold text-gray-900">{exam.totalMarks}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-[10px] text-gray-400">Candidates/Year</p>
          <p className="text-sm font-bold text-gray-900">{exam.candidatesPerYear}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-2.5">
          <p className="text-[10px] text-gray-400">Negative Marking</p>
          <p className="text-sm font-bold text-gray-900">{exam.negativeMarking ? 'Yes' : 'No'}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-bold text-gray-600 mb-2">Subjects Tested</p>
        <div className="flex flex-wrap gap-1.5">
          {exam.subjects.map(s => (
            <span key={s} className="text-xs px-2.5 py-1 rounded-lg font-medium" style={{ backgroundColor: exam.color + '10', color: exam.color }}>{s}</span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-bold text-gray-600 mb-2">Accepted By</p>
        <div className="flex flex-wrap gap-1">
          {exam.acceptedBy.map(a => (
            <span key={a} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md">{a}</span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-bold text-gray-600 mb-2">CuriousHat Prep Features</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {exam.prepFeatures.map(f => (
            <div key={f} className="flex items-center gap-2 text-xs text-gray-600 bg-violet-50 px-2.5 py-1.5 rounded-lg">
              <Sparkles className="w-3 h-3 text-violet-500 flex-shrink-0" /> {f}
            </div>
          ))}
        </div>
      </div>

      {degrees.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-600 mb-2">Degrees that accept {exam.name}</p>
          <div className="flex flex-wrap gap-1.5">
            {degrees.map(d => (
              <span key={d.id} className="text-[10px] font-medium px-2 py-0.5 rounded-md border" style={{ borderColor: d.color + '40', color: d.color, backgroundColor: d.color + '08' }}>
                {d.icon} {d.degree}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap gap-2">
        <button className="flex items-center gap-1.5 text-sm bg-violet-600 text-white px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors">
          <Brain className="w-4 h-4" /> Start AI Prep <span className="text-[9px] bg-amber-400 text-white px-1 rounded font-bold">★ Pro</span>
        </button>
        <button className="flex items-center gap-1.5 text-sm border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
          <FileText className="w-4 h-4" /> Mock Tests
        </button>
        <button className="flex items-center gap-1.5 text-sm border border-gray-200 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-50 transition-colors">
          <Target className="w-4 h-4" /> Previous Year Papers
        </button>
      </div>
    </div>
  )
}

/* ═══════ MAIN PAGE ═══════ */
export default function EntranceExamsPage() {
  const [tab, setTab] = useState<'exams' | 'degrees'>('degrees')
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [selectedExam, setSelectedExam] = useState<EntranceExam | null>(null)
  const [selectedDegree, setSelectedDegree] = useState<DegreeProgram | null>(null)
  const [expandedCat, setExpandedCat] = useState<string | null>('bachelors_3yr')

  const filteredExams = useMemo(() =>
    ENTRANCE_EXAMS.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.fullName.toLowerCase().includes(search.toLowerCase()) ||
      e.subjects.some(s => s.toLowerCase().includes(search.toLowerCase()))
    ),
  [search])

  const filteredDegrees = useMemo(() =>
    DEGREE_PROGRAMS.filter(d => {
      if (categoryFilter !== 'all' && d.category !== categoryFilter) return false
      if (!search) return true
      return d.degree.toLowerCase().includes(search.toLowerCase()) ||
        d.fullName.toLowerCase().includes(search.toLowerCase()) ||
        d.specializations.some(s => s.toLowerCase().includes(search.toLowerCase()))
    }),
  [search, categoryFilter])

  const categories = Object.entries(CATEGORY_LABELS) as [DegreeProgram['category'], typeof CATEGORY_LABELS[DegreeProgram['category']]][]

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 className="text-2xl font-black text-gray-900">Higher Education & Entrance Exams</h1>
        <p className="text-gray-500 text-sm mt-1">
          {CATALOG_STATS.totalPrograms} degree programs · {CATALOG_STATS.totalSpecializations} specializations · {CATALOG_STATS.totalEntranceExams} entrance exams — AI prep, mock tests, PYQs
        </p>
        <p className="text-[11px] text-violet-500 mt-1 flex items-center gap-1">
          <Award className="w-3 h-3" /> All certifications issued through Gurukul Global Vidyaniketan (gurukul.foundation)
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <StatCard label="Degree Programs" value={CATALOG_STATS.totalPrograms.toString()} icon={BookOpen} color="#7C3AED" />
        <StatCard label="Specializations" value={CATALOG_STATS.totalSpecializations.toString()} icon={Globe} color="#0891B2" />
        <StatCard label="Entrance Exams" value={CATALOG_STATS.totalEntranceExams.toString()} icon={FileText} color="#D97706" />
        <StatCard label="AI Prep Available" value={CATALOG_STATS.totalEntranceExams.toString()} icon={Brain} color="#059669" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-4">
        <button onClick={() => { setTab('degrees'); setSelectedExam(null) }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'degrees' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          📚 By Degree
        </button>
        <button onClick={() => { setTab('exams'); setSelectedDegree(null) }}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'exams' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
          📝 By Entrance Exam
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder={tab === 'exams' ? 'Search exams — JEE, NEET, CLAT, CUET…' : 'Search degrees, specializations — B.Tech, MBBS, Psychology, AI & ML…'}
          className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
        {search && <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
      </div>

      {/* Selected exam detail */}
      {selectedExam && <ExamDetail exam={selectedExam} onClose={() => setSelectedExam(null)} />}

      {/* ── Exams Tab ── */}
      {tab === 'exams' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredExams.map(e => (
            <ExamCard key={e.id} exam={e} onSelect={() => setSelectedExam(e)} />
          ))}
          {filteredExams.length === 0 && (
            <div className="col-span-2 text-center py-12 text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="font-medium">No exams match your search</p>
            </div>
          )}
        </div>
      )}

      {/* ── Degrees Tab ── */}
      {tab === 'degrees' && (
        <>
          {/* Category filter chips */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            <button onClick={() => setCategoryFilter('all')}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${categoryFilter === 'all' ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              All ({DEGREE_PROGRAMS.length})
            </button>
            {categories.map(([key, val]) => {
              const count = DEGREE_PROGRAMS.filter(d => d.category === key).length
              return (
                <button key={key} onClick={() => setCategoryFilter(key)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${categoryFilter === key ? 'text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                  style={categoryFilter === key ? { backgroundColor: val.color } : undefined}>
                  {val.icon} {val.label} ({count})
                </button>
              )
            })}
          </div>

          {/* Grouped by category */}
          {(categoryFilter === 'all' ? categories : categories.filter(([k]) => k === categoryFilter)).map(([catKey, catVal]) => {
            const programs = filteredDegrees.filter(d => d.category === catKey)
            if (programs.length === 0) return null
            const isExpanded = expandedCat === catKey || categoryFilter !== 'all' || !!search
            return (
              <div key={catKey} className="mb-4">
                <button onClick={() => setExpandedCat(expandedCat === catKey ? null : catKey)}
                  className="flex items-center gap-2 w-full text-left mb-3 group">
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  <span className="text-lg">{catVal.icon}</span>
                  <span className="text-sm font-bold" style={{ color: catVal.color }}>{catVal.label}</span>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{programs.length}</span>
                  <span className="flex-1 h-px bg-gray-100" />
                </button>
                {isExpanded && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 ml-6">
                    {programs.map(p => (
                      <DegreeCard key={p.id} program={p} onSelect={() => {
                        const exams = getExamsForDegree(p.id)
                        if (exams.length > 0) {
                          setSelectedExam(exams[0])
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }
                      }} />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
