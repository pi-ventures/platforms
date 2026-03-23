'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { MOCK_VISITS } from '@/lib/mockData'
import { Visit, VisitStatus } from '@/lib/types'
import {
  CalendarCheck, MapPin, Clock, User, Key, Shield,
  CheckCircle, XCircle, Play, Star, ChevronRight,
  Navigation, Eye, AlertCircle, RotateCcw
} from 'lucide-react'

// ── Status config ─────────────────────────────────────────────
const STATUS_CFG: Record<VisitStatus, { label: string; icon: React.ElementType; badge: string }> = {
  REQUESTED:      { label: 'Requested',      icon: Clock,         badge: 'bg-blue-50 text-blue-600' },
  AGENT_ASSIGNED: { label: 'Agent Assigned', icon: User,          badge: 'bg-purple-50 text-purple-700' },
  OWNER_NOTIFIED: { label: 'Owner Notified', icon: AlertCircle,   badge: 'bg-orange-50 text-orange-700' },
  ACCESS_GRANTED: { label: 'Access Granted', icon: Key,           badge: 'bg-green-50 text-green-600' },
  IN_PROGRESS:    { label: 'In Progress',    icon: Navigation,    badge: 'bg-brand-light text-brand-primary' },
  COMPLETED:      { label: 'Completed',      icon: CheckCircle,   badge: 'bg-gray-100 text-gray-600' },
  RATED:          { label: 'Rated',          icon: Star,          badge: 'bg-yellow-50 text-yellow-600' },
  CANCELLED:      { label: 'Cancelled',      icon: XCircle,       badge: 'bg-red-50 text-red-500' },
}

const PIPELINE_STEPS: VisitStatus[] = [
  'REQUESTED', 'AGENT_ASSIGNED', 'OWNER_NOTIFIED', 'ACCESS_GRANTED', 'IN_PROGRESS', 'COMPLETED',
]

const STEP_LABELS: Record<string, string> = {
  REQUESTED:      'Requested',
  AGENT_ASSIGNED: 'Assigned',
  OWNER_NOTIFIED: 'Notified',
  ACCESS_GRANTED: 'Access',
  IN_PROGRESS:    'Ongoing',
  COMPLETED:      'Done',
}

// ── Helpers ───────────────────────────────────────────────────
const genOTP = () => Math.floor(100000 + Math.random() * 900000).toString()

function fmt(dt?: string) {
  if (!dt) return '—'
  return new Date(dt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

// ── Status Tracker ────────────────────────────────────────────
function StatusTracker({ status }: { status: VisitStatus }) {
  const current = PIPELINE_STEPS.indexOf(status)
  if (current === -1) return null
  return (
    <div className="flex items-center mt-3">
      {PIPELINE_STEPS.map((step, i) => {
        const done    = i < current
        const active  = i === current
        const pending = i > current
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all
                ${done    ? 'bg-brand-primary text-white'
                  : active  ? 'bg-brand-primary text-white ring-4 ring-brand-primary/20'
                  : 'bg-gray-100 text-gray-400'}`}
              >
                {done ? '✓' : i + 1}
              </div>
              <span className={`text-[9px] mt-1 font-semibold whitespace-nowrap
                ${done || active ? 'text-brand-primary' : 'text-gray-400'}`}>
                {STEP_LABELS[step]}
              </span>
            </div>
            {i < PIPELINE_STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-1 mb-3 rounded transition-all
                ${i < current ? 'bg-brand-primary' : 'bg-gray-100'}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}

// ── Visit Card ────────────────────────────────────────────────
function VisitCard({ visit, onAction }: { visit: Visit; onAction: (id: string, action: string) => void }) {
  const router   = useRouter()
  const cfg      = STATUS_CFG[visit.status]
  const StatusIcon = cfg.icon
  const isActive = !['COMPLETED', 'RATED', 'CANCELLED'].includes(visit.status)

  return (
    <div className={`bg-white rounded-2xl shadow-card overflow-hidden transition-all hover:shadow-card-hover
      ${visit.status === 'ACCESS_GRANTED' || visit.status === 'IN_PROGRESS' ? 'ring-2 ring-brand-primary/30' : ''}`}>

      {/* Property image strip */}
      <div className="relative h-32 bg-gray-100">
        <img src={visit.propertyImg} alt={visit.propertyTitle} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.badge}`}>
            <StatusIcon className="w-3 h-3" />
            {cfg.label}
          </span>
        </div>
        {/* Live tracker button for active visits with location */}
        {(visit.status === 'ACCESS_GRANTED' || visit.status === 'IN_PROGRESS') && (
          <button
            onClick={() => router.push(`/visits/tracker/${visit.id}`)}
            className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full text-xs font-bold text-brand-primary shadow hover:shadow-md transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Map
          </button>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-bold text-sm leading-snug line-clamp-1 font-display">{visit.propertyTitle}</p>
          <div className="flex items-center gap-1 text-white/70 text-xs mt-0.5">
            <MapPin className="w-3 h-3" />{visit.propertyLoc}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Date / time / ID */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <CalendarCheck className="w-3.5 h-3.5 text-brand-primary" />
            <span>{visit.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-brand-primary" />
            <span>{visit.time}</span>
          </div>
          <span className="ml-auto font-mono text-gray-400">#{visit.id.replace('visit_', 'V')}</span>
        </div>

        {/* Customer */}
        <div className="flex items-center gap-2 text-sm mb-2">
          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
            {visit.customerName[0]}
          </div>
          <div>
            <span className="font-semibold text-brand-dark">{visit.customerName}</span>
            <span className="text-gray-400 text-xs ml-2">Buyer</span>
          </div>
        </div>

        {/* Agent — masked until ACCESS_GRANTED */}
        <div className="flex items-center gap-2 text-sm mb-3">
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
            ${visit.agentName ? 'bg-brand-light text-brand-primary' : 'bg-gray-100 text-gray-400'}`}>
            {visit.agentName ? visit.agentName[0] : '?'}
          </div>
          <div>
            {visit.agentName ? (
              <span className="font-semibold text-brand-dark">{visit.agentName}</span>
            ) : (
              <span className="text-gray-400 text-xs italic flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Agent hidden until access granted
              </span>
            )}
          </div>
        </div>

        {/* OTP display */}
        {visit.otp && (
          <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl mb-3 border border-green-100">
            <Key className="w-4 h-4 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-green-600 font-semibold">Property Access OTP</p>
              <p className="text-2xl font-bold tracking-widest font-mono text-green-700">{visit.otp}</p>
            </div>
            <div className="ml-auto text-xs text-green-500">Valid 2 hrs</div>
          </div>
        )}

        {/* Progress tracker */}
        {isActive && <StatusTracker status={visit.status} />}

        {/* Rating display */}
        {visit.rating && (
          <div className="mt-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1,2,3,4,5].map(n => (
                  <Star key={n} className={`w-3.5 h-3.5 ${n <= visit.rating!.agentRating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} />
                ))}
              </div>
              <span className="text-xs text-yellow-700 font-semibold">Agent: {visit.rating.agentRating}/5</span>
              <span className="text-xs text-yellow-600 ml-auto">Property: {visit.rating.propertyRating}/5</span>
            </div>
            {visit.rating.comment && (
              <p className="text-xs text-gray-500 mt-1.5 italic">"{visit.rating.comment}"</p>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          {visit.status === 'REQUESTED' && (
            <button onClick={() => onAction(visit.id, 'assign')}
              className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1.5">
              <User className="w-3 h-3" /> Assign Agent
            </button>
          )}
          {visit.status === 'AGENT_ASSIGNED' && (
            <button onClick={() => onAction(visit.id, 'notify_owner')}
              className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1.5">
              <AlertCircle className="w-3 h-3" /> Notify Owner
            </button>
          )}
          {visit.status === 'OWNER_NOTIFIED' && (
            <button onClick={() => onAction(visit.id, 'grant')}
              className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1.5">
              <Key className="w-3 h-3" /> Grant Access
            </button>
          )}
          {visit.status === 'ACCESS_GRANTED' && (
            <button onClick={() => router.push(`/visits/tracker/${visit.id}`)}
              className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1.5">
              <Navigation className="w-3 h-3" /> Open Tracker
            </button>
          )}
          {visit.status === 'IN_PROGRESS' && (
            <button onClick={() => onAction(visit.id, 'complete')}
              className="flex-1 btn-primary text-xs py-2 flex items-center justify-center gap-1.5">
              <CheckCircle className="w-3 h-3" /> Mark Complete
            </button>
          )}
          {visit.status === 'COMPLETED' && (
            <button onClick={() => onAction(visit.id, 'rate')}
              className="flex-1 py-2 bg-yellow-50 text-yellow-700 rounded-xl text-xs font-semibold hover:bg-yellow-100 transition-colors flex items-center justify-center gap-1.5">
              <Star className="w-3 h-3" /> Rate Visit
            </button>
          )}
          {isActive && visit.status !== 'COMPLETED' && (
            <button onClick={() => onAction(visit.id, 'cancel')}
              className="px-3 py-2 bg-gray-50 text-gray-400 rounded-xl text-xs font-semibold hover:bg-red-50 hover:text-red-500 transition-colors">
              <XCircle className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Stats strip ───────────────────────────────────────────────
function VisitStats({ visits }: { visits: Visit[] }) {
  const counts = {
    total:     visits.length,
    pending:   visits.filter(v => ['REQUESTED','AGENT_ASSIGNED','OWNER_NOTIFIED'].includes(v.status)).length,
    active:    visits.filter(v => ['ACCESS_GRANTED','IN_PROGRESS'].includes(v.status)).length,
    completed: visits.filter(v => ['COMPLETED','RATED'].includes(v.status)).length,
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {[
        { label: 'Total Visits',   value: counts.total,     color: 'text-brand-dark',    bg: 'bg-brand-light',   border: 'border-brand-primary/20' },
        { label: 'Pending Action', value: counts.pending,   color: 'text-orange-600',    bg: 'bg-orange-50',     border: 'border-orange-200' },
        { label: 'Active Now',     value: counts.active,    color: 'text-green-600',     bg: 'bg-green-50',      border: 'border-green-200' },
        { label: 'Completed',      value: counts.completed, color: 'text-gray-600',      bg: 'bg-gray-50',       border: 'border-gray-200' },
      ].map(s => (
        <div key={s.label} className={`bg-white rounded-2xl p-4 shadow-sm border ${s.border}`}>
          <p className={`text-3xl font-extrabold font-display ${s.color}`}>{s.value}</p>
          <p className="text-xs text-gray-500 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function VisitsPage() {
  const [visits, setVisits] = useState<Visit[]>(MOCK_VISITS)
  const [filter, setFilter] = useState<'all' | 'active' | 'pending' | 'completed'>('all')
  const [toast, setToast]   = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleAction = (id: string, action: string) => {
    setVisits(prev => prev.map(v => {
      if (v.id !== id) return v
      switch (action) {
        case 'assign':        return { ...v, status: 'AGENT_ASSIGNED' as VisitStatus, agentId: 'broker_001', agentName: 'Rajesh Sharma', assignedAt: new Date().toISOString() }
        case 'notify_owner':  return { ...v, status: 'OWNER_NOTIFIED' as VisitStatus }
        case 'grant':         return { ...v, status: 'ACCESS_GRANTED' as VisitStatus, otp: genOTP(), otpExpiry: new Date(Date.now() + 2*60*60*1000).toISOString(), accessAt: new Date().toISOString() }
        case 'complete':      return { ...v, status: 'COMPLETED' as VisitStatus, otp: undefined, completedAt: new Date().toISOString() }
        case 'cancel':        return { ...v, status: 'CANCELLED' as VisitStatus }
        case 'rate':          return { ...v, status: 'RATED' as VisitStatus, rating: { agentRating: 5, propertyRating: 4, comment: 'Great visit!', ratedAt: new Date().toISOString() } }
        default:              return v
      }
    }))
    const msgs: Record<string, string> = {
      assign: '✅ Agent assigned successfully',
      notify_owner: '🔔 Owner has been notified',
      grant: '🔑 Access granted — OTP generated',
      complete: '🏁 Visit marked complete',
      cancel: '❌ Visit cancelled',
      rate: '⭐ Rating submitted — thank you!',
    }
    showToast(msgs[action] ?? 'Updated')
  }

  const filtered = visits.filter(v => {
    if (filter === 'active')    return ['ACCESS_GRANTED', 'IN_PROGRESS'].includes(v.status)
    if (filter === 'pending')   return ['REQUESTED', 'AGENT_ASSIGNED', 'OWNER_NOTIFIED'].includes(v.status)
    if (filter === 'completed') return ['COMPLETED', 'RATED', 'CANCELLED'].includes(v.status)
    return true
  })

  const pendingCount = visits.filter(v => ['REQUESTED', 'AGENT_ASSIGNED', 'OWNER_NOTIFIED'].includes(v.status)).length

  return (
    <AppLayout
      title="Visits"
      subtitle={`${visits.length} total · ${pendingCount > 0 ? `${pendingCount} need action` : 'all up to date'}`}
    >
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-brand-dark text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-semibold animate-fade-in">
          {toast}
        </div>
      )}

      {/* Stats */}
      <VisitStats visits={visits} />

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6">
        {(['all', 'pending', 'active', 'completed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all
              ${filter === f ? 'bg-brand-primary text-white shadow-sm' : 'bg-white text-gray-500 border border-gray-200 hover:border-brand-primary hover:text-brand-primary'}`}>
            {f}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-400">{filtered.length} visits</span>
      </div>

      {/* Visit grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <CalendarCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-lg font-medium">No visits found</p>
          <p className="text-sm">Try changing the filter above</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filtered.map(v => (
            <VisitCard key={v.id} visit={v} onAction={handleAction} />
          ))}
        </div>
      )}
    </AppLayout>
  )
}
