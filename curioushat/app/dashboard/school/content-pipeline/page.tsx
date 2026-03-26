'use client'
import { useState } from 'react'
import {
  Search, Filter, RefreshCw, Play, Pause, Eye, CheckCircle2, AlertTriangle,
  Clock, Globe, BookOpen, FileText, Database, Cpu, Shield, Languages,
  Volume2, Rocket, Brain, ChevronDown, ChevronRight, ExternalLink,
  Sparkles, BarChart3, Layers, X, Plus, Settings
} from 'lucide-react'
import {
  CONTENT_SOURCES, MOCK_PIPELINE_JOBS, PIPELINE_STAGES, PIPELINE_STATS,
  ATTRIBUTION_DISCLAIMER, ORIGINALITY_STATEMENT,
  type PipelineJob, type PipelineStage, type PipelineStatus, type ContentSource,
} from '@/lib/content-engine'

/* ── Helpers ── */
const STAGE_IDX = PIPELINE_STAGES.reduce((acc, s, i) => ({ ...acc, [s.stage]: i }), {} as Record<PipelineStage, number>)

const statusColor: Record<PipelineStatus, { bg: string; text: string; dot: string }> = {
  queued:       { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400' },
  processing:   { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  completed:    { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  failed:       { bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500' },
  needs_review: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
}

const subjectColor: Record<string, string> = {
  Mathematics: '#4F46E5', Physics: '#0891B2', Chemistry: '#059669',
  Biology: '#7C3AED', History: '#B45309', Economics: '#1D4ED8',
  'General Science': '#DC2626', 'Computer Science': '#BE185D',
}

function ProgressBar({ value, max = 100, color = '#7C3AED' }: { value: number; max?: number; color?: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-full">
      <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  )
}

/* ── Stat Card ── */
function StatCard({ label, value, sub, icon: Icon, color }: { label: string; value: string; sub?: string; icon: typeof BookOpen; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '15' }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <div>
          <p className="text-2xl font-black text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{label}</p>
          {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
        </div>
      </div>
    </div>
  )
}

/* ── Pipeline Job Card ── */
function JobCard({ job, onView }: { job: PipelineJob; onView: () => void }) {
  const sc = statusColor[job.status]
  const color = subjectColor[job.subject] || '#6B7280'
  const stageInfo = PIPELINE_STAGES.find(s => s.stage === job.currentStage)
  const stageIdx = STAGE_IDX[job.currentStage] ?? 0
  const totalStages = PIPELINE_STAGES.length
  const overallPct = Math.round(((stageIdx + job.stageProgress / 100) / totalStages) * 100)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-violet-200 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '15' }}>
            <BookOpen className="w-4 h-4" style={{ color }} />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{job.bookTitle}</p>
            <p className="text-[11px] text-gray-400">{job.board} · {job.classLevel}</p>
          </div>
        </div>
        <span className={`inline-flex items-center gap-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-full ${sc.bg} ${sc.text}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
          {job.status.replace('_', ' ')}
        </span>
      </div>

      {/* Stage indicator */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{stageInfo?.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-700">{stageInfo?.label}</p>
          <p className="text-[10px] text-gray-400 truncate">{stageInfo?.description}</p>
        </div>
        <span className="text-xs font-bold text-violet-600">{overallPct}%</span>
      </div>

      <ProgressBar value={overallPct} color={color} />

      {/* Stats row */}
      <div className="flex items-center gap-3 mt-3 text-[10px] text-gray-400 flex-wrap">
        <span className="flex items-center gap-1"><Layers className="w-3 h-3" /> {job.chaptersInterpreted}/{job.totalChapters} ch</span>
        <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {job.languagesGenerated.length}/{job.totalLanguages} lang</span>
        {job.originalityScore > 0 && (
          <span className="flex items-center gap-1">
            <Shield className="w-3 h-3" style={{ color: job.originalityScore >= 85 ? '#059669' : '#D97706' }} />
            <span style={{ color: job.originalityScore >= 85 ? '#059669' : '#D97706' }}>{job.originalityScore}% original</span>
          </span>
        )}
        <span className="flex items-center gap-1"><Database className="w-3 h-3" /> {job.sourceNames.length} sources</span>
      </div>

      {/* Sources */}
      <div className="mt-2 flex flex-wrap gap-1">
        {job.sourceNames.map(s => (
          <span key={s} className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{s}</span>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
        <button onClick={onView} className="flex items-center gap-1 text-xs text-violet-600 hover:bg-violet-50 px-2 py-1 rounded-lg transition-colors">
          <Eye className="w-3 h-3" /> View
        </button>
        {job.status === 'processing' && (
          <button className="flex items-center gap-1 text-xs text-amber-600 hover:bg-amber-50 px-2 py-1 rounded-lg transition-colors">
            <Pause className="w-3 h-3" /> Pause
          </button>
        )}
        {job.status === 'needs_review' && (
          <button className="flex items-center gap-1 text-xs text-emerald-600 hover:bg-emerald-50 px-2 py-1 rounded-lg transition-colors">
            <CheckCircle2 className="w-3 h-3" /> Approve
          </button>
        )}
        {(job.status === 'queued' || job.status === 'failed') && (
          <button className="flex items-center gap-1 text-xs text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors">
            <Play className="w-3 h-3" /> Start
          </button>
        )}
      </div>
    </div>
  )
}

/* ── Source Card ── */
function SourceCard({ source }: { source: ContentSource }) {
  const licenseColor: Record<string, string> = {
    open_access: '#059669', creative_commons: '#2563EB', govt_open_data: '#7C3AED',
    fair_use_educational: '#D97706', publisher_agreement: '#BE185D',
  }
  const lc = licenseColor[source.license] || '#6B7280'
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-violet-200 transition-all">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-bold text-gray-900 text-sm">{source.name}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{source.description}</p>
        </div>
        <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${source.status === 'active' ? 'bg-emerald-500' : source.status === 'pending_agreement' ? 'bg-amber-500' : 'bg-gray-400'}`} />
      </div>
      <div className="flex flex-wrap gap-1.5 mt-2">
        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-md" style={{ backgroundColor: lc + '15', color: lc }}>
          {source.license.replace(/_/g, ' ')}
        </span>
        <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{source.accessMethod}</span>
        <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{source.languages.length} languages</span>
        <span className="text-[9px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md">{source.contentTypes.length} content types</span>
      </div>
      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-gray-100">
        <a href={source.url} target="_blank" rel="noopener noreferrer"
          className="flex items-center gap-1 text-[11px] text-violet-600 hover:underline">
          <ExternalLink className="w-3 h-3" /> Visit source
        </a>
        {source.autoIngest && (
          <span className="text-[11px] text-emerald-600 flex items-center gap-1 ml-auto">
            <RefreshCw className="w-3 h-3" /> Auto-ingest
          </span>
        )}
      </div>
    </div>
  )
}

/* ── Pipeline Stage Visualiser ── */
function StageVisualiser({ currentStage, progress }: { currentStage: PipelineStage; progress: number }) {
  const currentIdx = STAGE_IDX[currentStage] ?? 0
  return (
    <div className="flex items-center gap-0.5 overflow-x-auto py-2 px-1">
      {PIPELINE_STAGES.map((s, i) => {
        const done = i < currentIdx
        const active = i === currentIdx
        const pct = active ? progress : done ? 100 : 0
        return (
          <div key={s.stage} className="flex items-center gap-0.5 flex-shrink-0">
            <div className="flex flex-col items-center w-14" title={s.label}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs border-2 transition-all ${
                done ? 'bg-emerald-500 border-emerald-500 text-white' :
                active ? 'bg-violet-100 border-violet-500 text-violet-700' :
                'bg-gray-100 border-gray-200 text-gray-400'
              }`}>
                {done ? <CheckCircle2 className="w-3.5 h-3.5" /> : <span>{s.icon}</span>}
              </div>
              <p className={`text-[8px] mt-1 text-center leading-tight font-medium ${active ? 'text-violet-700' : done ? 'text-emerald-600' : 'text-gray-400'}`}>
                {s.label}
              </p>
              {active && <p className="text-[8px] text-violet-500 font-bold">{pct}%</p>}
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <div className={`w-4 h-0.5 rounded-full flex-shrink-0 ${done ? 'bg-emerald-400' : 'bg-gray-200'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

/* ═══════ MAIN PAGE ═══════ */
export default function ContentPipelinePage() {
  const [tab, setTab] = useState<'pipeline' | 'sources' | 'legal'>('pipeline')
  const [filterStatus, setFilterStatus] = useState<PipelineStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [selectedJob, setSelectedJob] = useState<PipelineJob | null>(null)

  const jobs = MOCK_PIPELINE_JOBS
    .filter(j => filterStatus === 'all' || j.status === filterStatus)
    .filter(j => j.bookTitle.toLowerCase().includes(search.toLowerCase()) || j.subject.toLowerCase().includes(search.toLowerCase()))

  const stats = PIPELINE_STATS

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-violet-600" />
          <h1 className="text-2xl font-black text-gray-900">Content Interpretation Pipeline</h1>
        </div>
        <p className="text-gray-500 text-sm">
          AI-powered engine that reads public educational sources, interprets concepts originally, and publishes curriculum-aligned content in 23 languages
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <StatCard label="Books Interpreted" value={stats.totalBooksInterpreted.toString()} sub={`${stats.totalBooksInPipeline} in pipeline`} icon={BookOpen} color="#7C3AED" />
        <StatCard label="Chapters Generated" value={stats.totalChaptersGenerated.toLocaleString()} sub={`${stats.ocrPagesProcessed.toLocaleString()} OCR pages`} icon={Layers} color="#0891B2" />
        <StatCard label="Avg Originality" value={`${stats.averageOriginalityScore}%`} sub="plagiarism-free" icon={Shield} color="#059669" />
        <StatCard label="Languages" value={`${stats.languagesCovered}/${stats.targetLanguages}`} sub={`${stats.boardsCovered}/${stats.targetBoards} boards`} icon={Globe} color="#D97706" />
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-200 mb-6">
        {(['pipeline', 'sources', 'legal'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors capitalize ${
              tab === t ? 'border-violet-600 text-violet-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}>
            {t === 'legal' ? 'Attribution & Legal' : t === 'sources' ? 'Content Sources' : 'Pipeline Jobs'}
          </button>
        ))}
      </div>

      {/* ── Pipeline Tab ── */}
      {tab === 'pipeline' && (
        <>
          {/* Toolbar */}
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div className="relative flex-1 min-w-0 sm:min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search books, subjects…"
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'processing', 'completed', 'needs_review', 'queued', 'failed'] as const).map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors capitalize ${
                    filterStatus === s ? 'bg-violet-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}>
                  {s.replace('_', ' ')}
                </button>
              ))}
            </div>
            <button className="flex items-center gap-1.5 text-sm bg-violet-600 text-white px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors flex-shrink-0">
              <Plus className="w-4 h-4" /> New Interpretation
            </button>
          </div>

          {/* Job detail panel */}
          {selectedJob && (
            <div className="mb-6 bg-violet-50 border border-violet-200 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="font-black text-gray-900">{selectedJob.bookTitle}</p>
                  <p className="text-xs text-gray-500">{selectedJob.board} · {selectedJob.classLevel} · {selectedJob.sourceNames.join(', ')}</p>
                </div>
                <button onClick={() => setSelectedJob(null)} className="p-1 text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <StageVisualiser currentStage={selectedJob.currentStage} progress={selectedJob.stageProgress} />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                <div className="bg-white rounded-lg px-3 py-2 border border-violet-100">
                  <p className="text-[10px] text-gray-400">Chapters</p>
                  <p className="text-sm font-bold text-gray-900">{selectedJob.chaptersInterpreted} / {selectedJob.totalChapters}</p>
                </div>
                <div className="bg-white rounded-lg px-3 py-2 border border-violet-100">
                  <p className="text-[10px] text-gray-400">Languages</p>
                  <p className="text-sm font-bold text-gray-900">{selectedJob.languagesGenerated.length} / {selectedJob.totalLanguages}</p>
                </div>
                <div className="bg-white rounded-lg px-3 py-2 border border-violet-100">
                  <p className="text-[10px] text-gray-400">Originality</p>
                  <p className="text-sm font-bold" style={{ color: selectedJob.originalityScore >= 85 ? '#059669' : selectedJob.originalityScore > 0 ? '#D97706' : '#6B7280' }}>
                    {selectedJob.originalityScore > 0 ? `${selectedJob.originalityScore}%` : 'Pending'}
                  </p>
                </div>
                <div className="bg-white rounded-lg px-3 py-2 border border-violet-100">
                  <p className="text-[10px] text-gray-400">Sources</p>
                  <p className="text-sm font-bold text-gray-900">{selectedJob.sourceNames.length} consulted</p>
                </div>
              </div>
              {selectedJob.languagesGenerated.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="text-[10px] text-gray-400 mr-1 self-center">Generated:</span>
                  {selectedJob.languagesGenerated.map(l => (
                    <span key={l} className="text-[9px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-md font-medium">{l}</span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Jobs grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {jobs.map(j => (
              <JobCard key={j.id} job={j} onView={() => setSelectedJob(j)} />
            ))}
          </div>
          {jobs.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <Cpu className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="font-medium">No jobs match your filter</p>
            </div>
          )}
        </>
      )}

      {/* ── Sources Tab ── */}
      {tab === 'sources' && (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">{CONTENT_SOURCES.length} content sources configured · {CONTENT_SOURCES.filter(s => s.status === 'active').length} active</p>
            <button className="flex items-center gap-1.5 text-sm bg-violet-600 text-white px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Source
            </button>
          </div>

          {/* Source type sections */}
          {['Government Open Data', 'National Digital Library', 'State Boards'].map((section, si) => {
            const sources = si === 0
              ? CONTENT_SOURCES.filter(s => ['ncert', 'cbse', 'epathshala', 'diksha', 'nios', 'swayam'].includes(s.type))
              : si === 1
              ? CONTENT_SOURCES.filter(s => s.type === 'ndli')
              : CONTENT_SOURCES.filter(s => s.type === 'state_board')
            if (sources.length === 0) return null
            return (
              <div key={section} className="mb-6">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <span className="w-6 h-px bg-gray-200" /> {section} <span className="flex-1 h-px bg-gray-200" />
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {sources.map(s => <SourceCard key={s.id} source={s} />)}
                </div>
              </div>
            )
          })}
        </>
      )}

      {/* ── Legal Tab ── */}
      {tab === 'legal' && (
        <div className="space-y-6 max-w-3xl">
          {/* Attribution model */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-violet-600" />
              <h3 className="font-black text-gray-900">Attribution & Originality Model</h3>
            </div>
            <div className="space-y-4">
              <div className="bg-violet-50 border border-violet-100 rounded-xl p-4">
                <p className="text-xs font-bold text-violet-700 mb-2 uppercase tracking-wide">How It Works</p>
                <div className="space-y-2.5 text-sm text-gray-700 leading-relaxed">
                  <p><strong>1. Read, not copy.</strong> Our AI reads publicly available educational material from government sources (NCERT, NDLI, DIKSHA, state boards) — similar to a student reading a library book.</p>
                  <p><strong>2. Understand concepts.</strong> The engine extracts educational concepts, formulas, and learning outcomes — these are facts and knowledge, not copyrightable expression.</p>
                  <p><strong>3. Interpret originally.</strong> Using AI, we generate entirely new explanations, analogies, examples, and teaching narratives. This is original authored content, like a teacher writing their own notes after studying textbooks.</p>
                  <p><strong>4. Verify originality.</strong> Every piece of content goes through automated plagiarism detection. We require &gt;85% originality score before publication. Content below threshold is regenerated.</p>
                  <p><strong>5. Attribute sources.</strong> We credit every source consulted — publisher, authors, year, ISBN — for academic citation. Credit, not reproduction.</p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                <p className="text-xs font-bold text-emerald-700 mb-2 uppercase tracking-wide">Legal Basis</p>
                <ul className="space-y-1.5 text-sm text-gray-700">
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>Facts are not copyrightable.</strong> Mathematical formulas, scientific laws, historical dates, and educational concepts are public domain knowledge.</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>Government publications.</strong> NCERT, CBSE, DIKSHA content published by Government of India is open access under Section 52(1)(q) of the Indian Copyright Act.</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>Transformative use.</strong> AI interpretation creates substantially new expression — new wording, new examples, new analogies, different structure.</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>Educational purpose.</strong> Section 52(1)(a) of the Indian Copyright Act permits fair dealing for education and research.</span></li>
                  <li className="flex gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" /> <span><strong>No reproduction.</strong> We never reproduce pages, paragraphs, or substantial portions of source text. Only concepts are carried forward.</span></li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Attribution Disclaimer (shown on all content)</p>
                <p className="text-xs text-gray-600 leading-relaxed italic">{ATTRIBUTION_DISCLAIMER}</p>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Originality Statement</p>
                <p className="text-xs text-gray-600 leading-relaxed italic">{ORIGINALITY_STATEMENT}</p>
              </div>
            </div>
          </div>

          {/* Patent claims */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <h3 className="font-black text-gray-900">Patent-Pending Innovation</h3>
            </div>
            <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
              <p className="text-xs font-bold text-amber-700 mb-3 uppercase tracking-wide">Novel Claims</p>
              <ol className="space-y-2 text-sm text-gray-700 list-decimal list-inside leading-relaxed">
                <li><strong>Smart Educational OCR</strong> — AI-powered OCR that recognises mathematical formulas, chemical equations, labelled diagrams, and structured educational content elements (not just text), with automatic LaTeX conversion and diagram alt-text generation.</li>
                <li><strong>Multi-Source Concept Synthesis</strong> — System that reads the same educational topic from multiple independent sources (NCERT, NDLI, state boards, NIOS) and synthesises a unified, comprehensive understanding before generating content.</li>
                <li><strong>Level-Adaptive Interpretation</strong> — Single-topic content generated at multiple cognitive levels (elementary through competitive exam) using the same concept graph, ensuring curriculum alignment at each level.</li>
                <li><strong>Curriculum-Aligned Content Generation</strong> — AI interpretation engine that maps generated content to specific board curriculum standards (CBSE, ICSE, 28 state boards) ensuring learning outcome coverage.</li>
                <li><strong>Automated Originality Assurance Pipeline</strong> — End-to-end system with integrated plagiarism detection that guarantees generated educational content exceeds originality thresholds before publication.</li>
                <li><strong>23-Language Parallel Generation</strong> — Simultaneous generation of educationally equivalent content across all 23 scheduled Indian languages from a single interpretation, maintaining subject-specific terminology accuracy in each language.</li>
                <li><strong>Educational Audio Synthesis</strong> — Chapter-wise audiobook generation from interpreted content with subject-aware narration (formula reading, diagram description, pacing for different difficulty levels).</li>
              </ol>
            </div>
          </div>

          {/* Sample attribution block */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-violet-600" />
              <h3 className="font-black text-gray-900">Sample Attribution Block</h3>
            </div>
            <p className="text-xs text-gray-500 mb-3">This is how attribution appears on every interpreted book in the library:</p>
            <div className="border border-violet-200 bg-violet-50 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-2">
                <Brain className="w-4 h-4 text-violet-600" />
                <p className="text-xs font-bold text-violet-700">Interpreted by CuriousHat.ai v2.1</p>
              </div>
              <p className="text-[11px] text-gray-600">
                This content is an original educational interpretation. It is not a copy or reproduction of any source material.
              </p>
              <div className="border-t border-violet-200 pt-2 mt-2">
                <p className="text-[10px] font-semibold text-gray-500 mb-1">Sources Consulted (for citation only):</p>
                <ul className="space-y-0.5 text-[10px] text-gray-500">
                  <li>NCERT — Mathematics Textbook for Class IX, 2024 (ncert.nic.in) — Open Access</li>
                  <li>NDLI — Applied Mathematics Collection, IIT Kharagpur (ndl.iitkgp.ac.in) — Open Access</li>
                  <li>DIKSHA — Class IX Mathematics Module, MoE (diksha.gov.in) — Govt Open Data</li>
                </ul>
              </div>
              <p className="text-[9px] text-gray-400 italic mt-1">Originality Score: 94% · Plagiarism Check: Passed · Published: 2026-03-20</p>
              <div className="border-t border-violet-200 pt-2 mt-2">
                <p className="text-[10px] text-amber-700 font-semibold flex items-center gap-1">
                  🏅 Certifications issued through Gurukul Global Vidyaniketan (gurukul.foundation)
                </p>
              </div>
            </div>
          </div>

          {/* Certification issuer notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield className="w-5 h-5 text-amber-600" />
              <h3 className="font-black text-gray-900">Certification Issuer</h3>
            </div>
            <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
              <p>
                <strong>CuriousHat is a learning platform, not a certifying institution.</strong> All accredited certifications
                are issued through <a href="https://gurukul.foundation" target="_blank" rel="noopener noreferrer" className="text-violet-600 font-semibold hover:underline">Gurukul Global Vidyaniketan</a>,
                a deemed school/college run by Gurukul.foundation.
              </p>
              <div className="bg-white border border-amber-100 rounded-xl p-4">
                <p className="text-xs font-bold text-gray-500 mb-2">How it works:</p>
                <ol className="space-y-1.5 text-xs text-gray-600 list-decimal list-inside">
                  <li>Students learn on <strong>CuriousHat.ai</strong> (AI tutoring, courses, exams, library)</li>
                  <li>Assessments and exams are conducted through the platform</li>
                  <li><strong>Gurukul Global Vidyaniketan</strong> issues the accredited certificate</li>
                  <li>International bodies (Trinity, ABRSM, DELF, Goethe, JLPT, HSK, TOPIK, DELE, NIFT, etc.) affiliate with Gurukul Global Vidyaniketan</li>
                </ol>
              </div>
              <p className="text-xs text-gray-500 italic">
                This structure complies with Indian education regulations which require certifications to originate from a recognised educational institution.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
