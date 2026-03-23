'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { MOCK_VISITS } from '@/lib/mockData'
import { ArrowLeft, Shield } from 'lucide-react'

// ── Party config ──────────────────────────────────────────────
const PARTY = {
  owner:    { label: 'Owner',  icon: '🔑', color: '#C9A84C', startX: 650, startY: 400, speed: 2.6 },
  agent:    { label: 'Agent',  icon: '👤', color: '#006D77', startX: 100, startY: 80,  speed: 3.2 },
  customer: { label: 'You',    icon: '🏠', color: '#0A2342', startX: 75,  startY: 285, speed: 2.0 },
} as const

type PartyKey = keyof typeof PARTY

const MAP_W = 800, MAP_H = 500
const PROP  = { x: 400, y: 250 }
const MAJOR_H = [80, 175, 250, 330, 430]
const MAJOR_V = [100, 195, 310, 430, 580, 700]
const INIT_ETA: Record<PartyKey, number> = { owner: 720, agent: 480, customer: 900 }

const fmtEta = (s: number) => s <= 0 ? 'Arrived' : s < 60 ? `${Math.round(s)}s` : `${Math.ceil(s / 60)} min`
const fmtKm  = (px: number) => `${(px * 0.012).toFixed(1)} km`
const dist   = (a: {x:number;y:number}, b: {x:number;y:number}) => Math.hypot(a.x - b.x, a.y - b.y)

type Pos = { x: number; y: number }

// ── SVG City Map ──────────────────────────────────────────────
function CityMap({ positions, arrived }: { positions: Record<PartyKey, Pos>; arrived: Record<PartyKey, boolean> }) {
  const blocks = [
    [110,85,80,80],[220,85,80,80],[320,85,65,80],[400,85,105,80],[550,85,120,155],[690,85,100,155],
    [110,175,80,65],[220,175,80,65],[320,175,65,65],[110,250,80,70],[220,250,80,70],[320,250,60,70],
    [470,250,100,165],[590,250,120,85],[590,345,120,70],[730,250,60,85],
    [110,330,80,90],[220,330,80,90],[320,330,60,90],[110,430,300,60],[440,430,110,60],[570,430,130,60],
  ]
  return (
    <svg viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{ width: '100%', height: '100%', display: 'block' }}>
      <rect width={MAP_W} height={MAP_H} fill="#E8F0E9" />
      {blocks.map(([x,y,w,h], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill="#D4E0D6" rx={3} opacity={0.8} />
      ))}
      {[130,205,295,385,480].map(y => <line key={`mh${y}`} x1={0} y1={y} x2={MAP_W} y2={y} stroke="#EBF2EC" strokeWidth={5} />)}
      {[150,255,375,505,645].map(x => <line key={`mv${x}`} x1={x} y1={0} x2={x} y2={MAP_H} stroke="#EBF2EC" strokeWidth={5} />)}
      {MAJOR_H.map(y => <line key={`mah${y}`} x1={0} y1={y} x2={MAP_W} y2={y} stroke="#FFFFFF" strokeWidth={10} />)}
      {MAJOR_V.map(x => <line key={`mav${x}`} x1={x} y1={0} x2={x} y2={MAP_H} stroke="#FFFFFF" strokeWidth={10} />)}

      {/* Center highlight */}
      <circle cx={PROP.x} cy={PROP.y} r={40} fill="#FFFFFF" />
      <circle cx={PROP.x} cy={PROP.y} r={34} fill="#EDF6F9" stroke="#83C5BE" strokeWidth={1.5} />

      {/* Route lines */}
      {(Object.entries(positions) as [PartyKey, Pos][]).map(([k, pos]) =>
        !arrived[k] && (
          <line key={k} x1={pos.x} y1={pos.y} x2={PROP.x} y2={PROP.y}
            stroke={PARTY[k].color} strokeWidth={2} strokeDasharray="6 5" opacity={0.5} />
        )
      )}

      {/* Property pin */}
      <g transform={`translate(${PROP.x},${PROP.y})`}>
        <circle r={26} fill="#006D77" opacity={0.1}>
          <animate attributeName="r" values="16;30;16" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.18;0;0.18" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle r={17} fill="#006D77" opacity={0.15} />
        <circle r={11} fill="#006D77" />
        <path d="M0,-15 C-7,-15 -12,-10 -12,-4 C-12,4 0,15 0,15 C0,15 12,4 12,-4 C12,-10 7,-15 0,-15 Z"
          fill="#006D77" stroke="white" strokeWidth={1.5} transform="translate(0,-6)" />
        <circle cx={0} cy={-10} r={4} fill="white" opacity={0.9} />
        <text y={25} textAnchor="middle" fontSize={8} fontFamily="sans-serif" fontWeight={800}
          fill="#004E57" letterSpacing={0.5}>PROPERTY</text>
      </g>

      {/* Party markers */}
      {(Object.entries(positions) as [PartyKey, Pos][]).map(([k, pos]) => {
        const cfg  = PARTY[k]
        const done = arrived[k]
        return (
          <g key={k} transform={`translate(${pos.x},${pos.y})`}>
            {!done && (
              <circle r={14} fill={cfg.color} opacity={0}>
                <animate attributeName="r" values="10;20;10" dur="1.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0;0.2" dur="1.8s" repeatCount="indefinite" />
              </circle>
            )}
            <ellipse cx={0} cy={16} rx={8} ry={3} fill="rgba(0,0,0,0.15)" />
            <circle r={14} fill={done ? '#16A34A' : cfg.color} stroke="white" strokeWidth={2.5}
              style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }} />
            <text textAnchor="middle" dominantBaseline="central" fontSize={11}>{done ? '✓' : cfg.icon}</text>
            <rect x={-18} y={17} width={36} height={14} rx={7}
              fill={done ? '#16A34A' : cfg.color} opacity={0.92} />
            <text x={0} y={27} textAnchor="middle" fontSize={7.5} fontFamily="sans-serif" fontWeight={800} fill="white">
              {done ? 'ARRIVED' : cfg.label.toUpperCase()}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// ── Chat ──────────────────────────────────────────────────────
type Msg = { from: PartyKey | 'system'; text: string; time: string }

const INIT_MSGS: Msg[] = [
  { from: 'system',   text: 'Visit confirmed. All parties have been notified.',  time: '10:02 AM' },
  { from: 'agent',    text: 'On my way! Should be there in ~15 minutes.',        time: '10:08 AM' },
  { from: 'owner',    text: 'Picking up keys and heading over.',                 time: '10:09 AM' },
  { from: 'customer', text: 'Perfect, leaving in 10 min.',                       time: '10:11 AM' },
]

function Chat({ messages, onSend }: { messages: Msg[]; onSend: (text: string) => void }) {
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages.length])

  const send = () => {
    if (!input.trim()) return
    onSend(input.trim())
    setInput('')
  }

  const bubbleStyle: Record<string, { bg: string; text: string; align: string }> = {
    system:   { bg: '#EDF6F9',   text: '#006D77', align: 'center' },
    agent:    { bg: '#EDF6F9',   text: '#0A2342', align: 'flex-start' },
    owner:    { bg: '#FFFBEB',   text: '#0A2342', align: 'flex-start' },
    customer: { bg: '#1B3A5C',   text: '#ffffff', align: 'flex-end' },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ padding: '10px 14px', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 14 }}>💬</span>
        <span style={{ fontWeight: 700, fontSize: 13, color: '#0A2342' }}>In-Platform Chat</span>
        <span style={{ fontSize: 10, color: '#94A3B8', marginLeft: 'auto' }}>No phone numbers shared</span>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {messages.map((m, i) => {
          const s = bubbleStyle[m.from] ?? bubbleStyle.system
          if (m.from === 'system') return (
            <div key={i} style={{ textAlign: 'center' }}>
              <span style={{ fontSize: 11, color: '#94A3B8', background: '#F1F5F9', padding: '3px 10px', borderRadius: 20 }}>{m.text}</span>
            </div>
          )
          return (
            <div key={i} style={{ display: 'flex', justifyContent: s.align }}>
              <div style={{ maxWidth: '80%' }}>
                {m.from !== 'customer' && (
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#006D77', marginBottom: 2, paddingLeft: 4 }}>
                    {PARTY[m.from as PartyKey]?.icon} {PARTY[m.from as PartyKey]?.label}
                  </div>
                )}
                <div style={{
                  background: s.bg, color: s.text, padding: '8px 12px', fontSize: 12, lineHeight: 1.5, fontWeight: 500,
                  borderRadius: m.from === 'customer' ? '14px 4px 14px 14px' : '4px 14px 14px 14px',
                }}>{m.text}</div>
                <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2, textAlign: m.from === 'customer' ? 'right' : 'left', paddingLeft: 4 }}>{m.time}</div>
              </div>
            </div>
          )
        })}
        <div ref={endRef} />
      </div>
      <div style={{ padding: '8px 12px', borderTop: '1px solid #E2E8F0', display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
          placeholder="Message all parties…"
          style={{ flex: 1, padding: '8px 12px', borderRadius: 20, border: '1.5px solid #E2E8F0', fontSize: 12, outline: 'none', background: '#F1F5F9' }} />
        <button onClick={send}
          style={{ width: 32, height: 32, borderRadius: '50%', background: '#006D77', color: '#fff', fontSize: 15, display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
          ➤
        </button>
      </div>
    </div>
  )
}

// ── Main tracker ──────────────────────────────────────────────
export default function VisitTrackerPage() {
  const router  = useRouter()
  const params  = useParams()
  const visitId = params?.id as string

  const visit = MOCK_VISITS.find(v => v.id === visitId) ?? MOCK_VISITS[1]

  const [positions, setPositions] = useState<Record<PartyKey, Pos>>(() =>
    Object.fromEntries(
      Object.entries(PARTY).map(([k, cfg]) => [k, { x: cfg.startX, y: cfg.startY }])
    ) as Record<PartyKey, Pos>
  )
  const [arrived, setArrived]     = useState<Record<PartyKey, boolean>>({ owner: false, agent: false, customer: false })
  const [etas, setEtas]           = useState<Record<PartyKey, number>>({ ...INIT_ETA })
  const [messages, setMessages]   = useState<Msg[]>(INIT_MSGS)
  const [allArrived, setAllArrived] = useState(false)
  const [running, setRunning]     = useState(true)

  const arrivedRef = useRef<Record<PartyKey, boolean>>({ owner: false, agent: false, customer: false })

  const ARRIVAL_TEXT: Record<PartyKey, string> = {
    agent:    "I'm at the property entrance! 🏠",
    owner:    "Arrived — opening up now. OTP still active ✅",
    customer: "Just parked, coming in!",
  }

  const addMsg = useCallback((from: PartyKey | 'system', text: string) => {
    const t = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    setMessages(ms => [...ms, { from, text, time: t }])
  }, [])

  useEffect(() => {
    if (!running) return
    const tick = setInterval(() => {
      setPositions(prev => {
        const next = { ...prev }
        const newArr = { ...arrivedRef.current }
        let changed = false
        ;(Object.keys(PARTY) as PartyKey[]).forEach(k => {
          if (newArr[k]) return
          const pos   = prev[k]
          const speed = PARTY[k].speed
          const dx    = PROP.x - pos.x
          const dy    = PROP.y - pos.y
          const d     = Math.hypot(dx, dy)
          if (d < speed + 8) {
            next[k] = { x: PROP.x, y: PROP.y }
            if (!newArr[k]) { newArr[k] = true; changed = true; addMsg(k, ARRIVAL_TEXT[k]) }
          } else {
            const jit = () => (Math.random() - 0.5) * 1.2
            next[k] = { x: pos.x + (dx / d) * speed + jit(), y: pos.y + (dy / d) * speed + jit() }
          }
        })
        if (changed) {
          arrivedRef.current = newArr
          setArrived({ ...newArr })
          if (Object.values(newArr).every(Boolean)) {
            setAllArrived(true)
            setRunning(false)
            addMsg('system', 'All parties arrived — visit is underway! 🎉')
          }
        }
        return next
      })
      setEtas(prev => {
        const next = { ...prev }
        ;(Object.keys(PARTY) as PartyKey[]).forEach(k => {
          if (!arrivedRef.current[k]) next[k] = Math.max(0, prev[k] - PARTY[k].speed * 0.7)
        })
        return next
      })
    }, 180)
    return () => clearInterval(tick)
  }, [running, addMsg])

  const reset = () => {
    setPositions(Object.fromEntries(Object.entries(PARTY).map(([k, cfg]) => [k, { x: cfg.startX, y: cfg.startY }])) as Record<PartyKey, Pos>)
    setArrived({ owner: false, agent: false, customer: false })
    arrivedRef.current = { owner: false, agent: false, customer: false }
    setEtas({ ...INIT_ETA })
    setMessages(INIT_MSGS)
    setAllArrived(false)
    setRunning(true)
  }

  const arrivedCount = Object.values(arrived).filter(Boolean).length

  return (
    <div className="min-h-screen bg-brand-muted">
      {/* Sub-header */}
      <div className="bg-brand-dark px-6 py-3 flex items-center gap-4 border-b border-white/10">
        <button onClick={() => router.push('/visits')}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Visits
        </button>
        <div className="w-px h-5 bg-white/10" />
        <div className="flex-1 min-w-0">
          <span className="text-white font-semibold text-sm truncate">{visit.propertyTitle}</span>
          <span className="text-gray-500 text-xs ml-3">{visit.propertyLoc}</span>
        </div>
        <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
          <span className={`w-2 h-2 rounded-full ${allArrived ? 'bg-green-400' : 'bg-red-400 animate-pulse'}`} />
          <span className={`text-xs font-bold ${allArrived ? 'text-green-400' : 'text-red-400'}`}>
            {allArrived ? 'ALL ARRIVED' : 'LIVE'}
          </span>
        </div>
        <span className="text-gray-500 text-xs">{arrivedCount}/3 arrived</span>
        <button onClick={reset} className="text-gray-500 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1">
          ↺ Restart
        </button>
      </div>

      {/* All arrived banner */}
      {allArrived && (
        <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <p className="font-bold text-green-700 text-sm">All 3 parties have arrived!</p>
            <p className="text-green-600 text-xs">Owner is opening the property. Visit is underway.</p>
          </div>
        </div>
      )}

      {/* Main grid */}
      <div className="p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">

        {/* Map + party cards */}
        <div className="lg:col-span-2 space-y-4">
          {/* Map */}
          <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-brand-border"
            style={{ aspectRatio: `${MAP_W}/${MAP_H}` }}>
            <CityMap positions={positions} arrived={arrived} />
          </div>

          {/* Party cards */}
          <div className="grid grid-cols-3 gap-3">
            {(Object.entries(PARTY) as [PartyKey, typeof PARTY[PartyKey]][]).map(([k, cfg]) => {
              const done = arrived[k]
              const d    = dist(positions[k], PROP)
              return (
                <div key={k} className={`bg-white rounded-2xl p-3 shadow-sm border transition-all
                  ${done ? 'border-green-200 ring-2 ring-green-100' : 'border-brand-border'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 transition-colors
                      ${done ? 'bg-green-100' : 'bg-brand-light'}`}
                      style={{ background: done ? undefined : cfg.color + '22' }}>
                      {done ? '✓' : cfg.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-brand-dark leading-none">{cfg.label}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {k === 'owner' ? 'Has keys' : k === 'agent' ? 'Assigned' : 'Buyer'}
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-center">
                    <div className={`rounded-lg p-1.5 ${done ? 'bg-green-50' : 'bg-brand-muted'}`}>
                      <p className="font-bold font-mono text-sm" style={{ color: done ? '#16A34A' : cfg.color }}>
                        {done ? 'Here' : fmtEta(Math.round(etas[k]))}
                      </p>
                      <p className="text-gray-400 text-[9px]">ETA</p>
                    </div>
                    <div className={`rounded-lg p-1.5 ${done ? 'bg-green-50' : 'bg-brand-muted'}`}>
                      <p className="font-bold font-mono text-sm" style={{ color: done ? '#16A34A' : '#334155' }}>
                        {done ? '—' : fmtKm(d)}
                      </p>
                      <p className="text-gray-400 text-[9px]">Away</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 mt-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: done ? '#16A34A' : cfg.color, animation: done ? 'none' : 'pulse 1.5s infinite' }} />
                    <span className="text-[10px] font-semibold" style={{ color: done ? '#16A34A' : '#64748B' }}>
                      {done ? 'Arrived' : 'En route'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-2.5 p-3 bg-brand-light/50 rounded-xl border border-brand-primary/20">
            <Shield className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-gray-600 leading-relaxed">
              <span className="font-semibold text-brand-primary">YesBroker Protected Visit</span> — Location sharing is active only for the visit window.
              No phone numbers or personal contact details are exchanged between parties.
            </p>
          </div>
        </div>

        {/* Chat panel */}
        <div className="bg-white rounded-2xl shadow-card border border-brand-border overflow-hidden"
          style={{ height: 540 }}>
          <Chat messages={messages} onSend={text => {
            const t = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
            setMessages(ms => [...ms, { from: 'customer', text, time: t }])
          }} />
        </div>
      </div>
    </div>
  )
}
