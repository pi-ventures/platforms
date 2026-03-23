'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { MOCK_PROPERTIES } from '@/lib/mockData'
import { Property } from '@/lib/types'
import AppLayout from '@/components/layout/AppLayout'
import {
  Building2, Home, MapPin, Briefcase, Trees, Store,
  Bed, Bath, Maximize, CalendarCheck,
  Shield, ChevronDown, ChevronRight, RotateCcw, Minus, Plus,
  List, Grid3X3, ChevronLeft,
} from 'lucide-react'

/* ─── helpers ─────────────────────────────────────────── */

const fmtPrice = (n: number, unit: string) => {
  if (unit === 'per_month') return `₹${n.toLocaleString('en-IN')}/mo`
  if (unit === 'per_sqft')  return `₹${n.toLocaleString('en-IN')}/sqft`
  return n >= 10_000_000 ? `₹${(n / 10_000_000).toFixed(2)} Cr`
       : n >= 100_000    ? `₹${(n / 100_000).toFixed(1)} L`
       : `₹${n.toLocaleString('en-IN')}`
}

const badgeLabel = (p: Property) => {
  if (p.status === 'sold')   return 'Just Sold'
  if (p.listingType === 'rent') return 'For Rent'
  if (p.listingType === 'sale') return 'For Sale'
  return p.listingType.charAt(0).toUpperCase() + p.listingType.slice(1)
}

const PROP_TYPES = [
  { label: 'Flat / Apt', Icon: Building2, val: 'apartment' },
  { label: 'Villa',       Icon: Home,      val: 'villa'     },
  { label: 'Plot',        Icon: Trees,     val: 'plot'      },
  { label: 'Commercial',  Icon: Briefcase, val: 'commercial'},
  { label: 'PG / Hostel', Icon: Store,     val: 'pg'        },
  { label: 'Office',      Icon: Briefcase, val: 'office'    },
]

const CITIES = ['Mumbai','Delhi NCR','Bengaluru','Hyderabad','Pune','Chennai','Ahmedabad','Kolkata','Noida','Gurgaon']

const AMENITIES = [
  'Swimming Pool','Gym','Club House','Power Backup',
  'Lift','Parking','Security/CCTV','Garden / Park',
  'Balcony','AC Fitted','Internet / Wi-Fi','Children Play Area',
  'Tennis Court','Pet Friendly','Home Theatre','Concierge',
  'EV Charging','Intercom',
]

/* ─── Schedule Visit Modal ─────────────────────────────── */
function ScheduleVisitModal({ prop, onClose }: { prop: Property; onClose: () => void }) {
  const [step, setStep] = useState<'form'|'done'>('form')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const router = useRouter()

  // Logged-in user details (pulled from session/profile in production)
  const user = { name: 'Rajesh Sharma', phone: '+91 98765 43210' }

  if (step === 'done') return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white p-10 max-w-sm w-full text-center shadow-2xl rounded-2xl">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: '#F5A623' }}>
          <CalendarCheck className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-black mb-2" style={{ fontFamily: "'Poppins',sans-serif" }}>Visit Requested!</h2>
        <p className="text-gray-500 text-sm mb-2">An agent will be auto-assigned by YesBroker.</p>
        <p className="text-xs text-gray-400 mb-6">Agent details are shared only after the owner grants property access.</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors rounded-lg">
            Close
          </button>
          <button onClick={() => router.push('/visits')}
            className="flex-1 py-2.5 text-black text-sm font-bold transition-all hover:opacity-80 rounded-lg"
            style={{ background: '#F5A623' }}>
            Track Visit →
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white max-w-sm w-full overflow-hidden shadow-2xl rounded-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-5 flex items-start justify-between" style={{ background: '#1A1A2E' }}>
          <div>
            <h2 className="text-white font-black text-lg" style={{ fontFamily: "'Poppins',sans-serif" }}>Schedule a Visit</h2>
            <p className="text-white/60 text-xs mt-0.5 line-clamp-1">{prop.title}</p>
            <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5">
              <MapPin className="w-3 h-3" />{prop.address.locality}, {prop.address.city}
            </p>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white text-xl mt-0.5">✕</button>
        </div>

        <div className="p-5 space-y-4">
          {/* Logged-in user info (read-only) */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 border border-gray-100">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-black flex-shrink-0"
              style={{ background: '#1A1A2E' }}>
              {user.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-400">{user.phone}</p>
            </div>
            <span className="ml-auto text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Verified</span>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5 uppercase tracking-wide">Date *</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 rounded-lg" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-600 block mb-1.5 uppercase tracking-wide">Time *</label>
              <select value={time} onChange={e => setTime(e.target.value)}
                className="w-full border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-yellow-400 bg-white rounded-lg appearance-none">
                <option value="">Select time</option>
                {['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM'].map(t => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Trust note */}
          <div className="flex items-start gap-2 p-3 border-l-4 bg-yellow-50 rounded-r-lg" style={{ borderColor: '#F5A623' }}>
            <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F5A623' }} />
            <p className="text-xs text-gray-600 leading-relaxed">
              <strong style={{ color: '#1A1A2E' }}>YesBroker Protected Visit</strong> — Agent details revealed only after owner grants property access.
            </p>
          </div>

          <button
            disabled={!date || !time}
            onClick={() => setStep('done')}
            className="w-full py-3.5 text-sm font-black tracking-wide text-black disabled:opacity-40 disabled:cursor-not-allowed transition-all hover:opacity-80 rounded-xl"
            style={{ background: '#F5A623' }}>
            <CalendarCheck className="w-4 h-4 inline mr-2" />
            CONFIRM VISIT REQUEST
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Property Card (Zuhaus style) ────────────────────── */
function PropertyCard({ prop, onSchedule }: { prop: Property; onSchedule: (p: Property) => void }) {
  const [imgIdx, setImgIdx] = useState(0)
  const images = prop.images.length > 0 ? prop.images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800']
  const badge = badgeLabel(prop)
  const badgeBg = badge === 'Just Sold' ? 'rgba(60,60,60,0.85)' : badge === 'For Rent' ? 'rgba(37,99,235,0.85)' : 'rgba(26,26,46,0.85)'

  const prevImg = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    setImgIdx(i => (i - 1 + images.length) % images.length)
  }
  const nextImg = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    setImgIdx(i => (i + 1) % images.length)
  }

  return (
    <Link href={`/properties/${prop.id}`} className="block group">
    <div className="bg-white" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.10)', borderRadius: 16, overflow: 'hidden' }}>
      {/* Photo carousel */}
      <div className="relative overflow-hidden" style={{ height: 200 }}>
        <img
          key={imgIdx}
          src={images[imgIdx]}
          alt={prop.title}
          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
        />
        {/* Status badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white" style={{ background: badgeBg }}>
          {badge}
        </div>
        {/* Fav button */}
        <button
          onClick={e => e.stopPropagation()}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
          style={{ background: '#F5A623' }}>
          <span className="text-xs font-black text-black">⚡</span>
        </button>

        {/* Prev / Next arrows — visible on hover when multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow transition-all opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110 z-10">
              <ChevronLeft className="w-4 h-4 text-gray-800" />
            </button>
            <button
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow transition-all opacity-0 group-hover:opacity-100 hover:bg-white hover:scale-110 z-10">
              <ChevronRight className="w-4 h-4 text-gray-800" />
            </button>
            {/* Dot indicators */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setImgIdx(i) }}
                  className="rounded-full transition-all"
                  style={{
                    width: i === imgIdx ? 16 : 6, height: 6,
                    background: i === imgIdx ? '#F5A623' : 'rgba(255,255,255,0.7)',
                  }}
                />
              ))}
            </div>
          </>
        )}

        {/* ID + Price strip */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2" style={{ background: 'rgba(26,26,46,0.88)' }}>
          <span className="text-white/60 text-[11px]">ID {prop.id.replace('prop_','').padStart(4,'0')} ···</span>
          <span className="text-white font-black text-sm">{fmtPrice(prop.price, prop.priceUnit)}</span>
        </div>
      </div>

      {/* Details */}
      <div className="px-4 pt-3 pb-4">
        <h3 className="font-bold text-gray-900 text-sm leading-snug mb-1 line-clamp-1" style={{ fontFamily: "'Poppins',sans-serif" }}>
          {prop.title}
        </h3>
        <p className="text-gray-400 text-xs mb-3">{prop.address.locality} – {prop.address.city}, {prop.address.state}</p>

        {/* Specs strip */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <Home className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#F5A623' }} />
          <span>
            {prop.area.toLocaleString()} sqft
            {prop.bedrooms ? ` – ${prop.bedrooms} BHK` : ''}
            {prop.furnishing ? ` – ${prop.furnishing.charAt(0).toUpperCase() + prop.furnishing.slice(1)} Furnished` : ''}
          </span>
        </div>

        {/* RERA + Schedule */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          {prop.rera
            ? <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5">RERA ✓</span>
            : <span />
          }
          <button
            onClick={e => { e.preventDefault(); onSchedule(prop) }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-black tracking-wide text-black transition-all hover:opacity-80"
            style={{ background: '#F5A623' }}>
            <CalendarCheck className="w-3 h-3" />
            SCHEDULE VISIT
          </button>
        </div>
      </div>
    </div>
    </Link>
  )
}

/* ─── Stepper ──────────────────────────────────────────── */
function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center gap-3 mt-1">
      <button onClick={() => onChange(Math.max(0, value - 1))}
        className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:border-yellow-400 transition-colors">
        <Minus className="w-3 h-3 text-gray-600" />
      </button>
      <span className="text-sm font-bold text-gray-800 w-4 text-center">{value}</span>
      <button onClick={() => onChange(value + 1)}
        className="w-7 h-7 border border-gray-300 flex items-center justify-center hover:border-yellow-400 transition-colors">
        <Plus className="w-3 h-3 text-gray-600" />
      </button>
    </div>
  )
}

/* ─── Map placeholder ──────────────────────────────────── */
function MapPanel({ properties }: { properties: Property[] }) {
  // Cluster properties into a few pin groups for display
  const pins = [
    { x: '35%', y: '42%', count: 8, label: 'Mumbai' },
    { x: '62%', y: '38%', count: 4, label: 'Pune'   },
    { x: '20%', y: '25%', count: 4, label: 'Delhi'  },
    { x: '70%', y: '65%', count: 3, label: 'Bengaluru' },
  ]

  return (
    <div className="relative w-full h-full overflow-hidden" style={{ background: '#e8e0d8', minHeight: 'calc(100vh - 73px)' }}>
      {/* Map/Satellite toggle */}
      <div className="absolute top-3 left-3 z-10 flex overflow-hidden" style={{ border: '1px solid #ccc', boxShadow: '0 2px 6px rgba(0,0,0,0.12)' }}>
        <button className="px-4 py-2 text-xs font-bold bg-white text-gray-800">Map</button>
        <button className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-gray-50 transition-colors bg-white border-l border-gray-200">Satellite</button>
      </div>

      {/* Expand button */}
      <button className="absolute top-3 right-3 z-10 w-8 h-8 bg-white flex items-center justify-center shadow text-gray-600 hover:bg-gray-50">
        <Maximize className="w-4 h-4" />
      </button>

      {/* Styled SVG map background (road grid) */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 600" preserveAspectRatio="xMidYMid slice">
        {/* Background */}
        <rect width="400" height="600" fill="#ece8e0" />
        {/* Major roads */}
        <line x1="0" y1="200" x2="400" y2="200" stroke="#d8cfc7" strokeWidth="6" />
        <line x1="0" y1="400" x2="400" y2="400" stroke="#d8cfc7" strokeWidth="6" />
        <line x1="150" y1="0" x2="150" y2="600" stroke="#d8cfc7" strokeWidth="6" />
        <line x1="300" y1="0" x2="300" y2="600" stroke="#d8cfc7" strokeWidth="6" />
        {/* Minor roads */}
        {[50,100,200,250,350].map(x => <line key={x} x1={x} y1="0" x2={x} y2="600" stroke="#dbd5ce" strokeWidth="2" />)}
        {[80,150,270,340,470,520].map(y => <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#dbd5ce" strokeWidth="2" />)}
        {/* City blocks */}
        {[
          [20,30,80,60],[100,30,40,60],[160,30,60,60],[240,30,40,60],[290,30,80,60],[
          20,110,100,70],[140,110,80,70],[240,110,60,70],[320,110,60,70],
          [20,290,120,80],[160,290,100,80],[280,290,80,80],
          [20,490,80,80],[120,490,100,80],[240,490,60,80],[320,490,60,80],
        ].map(([x,y,w,h], i) => (
          <rect key={i} x={x} y={y} width={w} height={h} fill="#f5efe8" rx="1" />
        ))}
        {/* Water feature */}
        <ellipse cx="320" cy="300" rx="45" ry="30" fill="#c8e0f0" opacity="0.7" />
        {/* Park */}
        <rect x="50" y="310" width="70" height="60" fill="#cce8cc" rx="2" />
        {/* Road labels */}
        <text x="75" y="197" fontSize="8" fill="#aaa" textAnchor="middle">MG Road</text>
        <text x="75" y="397" fontSize="8" fill="#aaa" textAnchor="middle">SV Road</text>
      </svg>

      {/* Property pins */}
      {pins.map((pin, i) => (
        <div
          key={i}
          className="absolute flex flex-col items-center cursor-pointer group"
          style={{ left: pin.x, top: pin.y, transform: 'translate(-50%,-100%)' }}
        >
          {/* Tooltip */}
          <div className="mb-1 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 text-xs font-bold text-white whitespace-nowrap"
            style={{ background: '#1A1A2E' }}>
            {pin.label}
          </div>
          {/* Pin */}
          <div className="flex items-center justify-center w-10 h-10 rounded-full font-black text-sm text-black shadow-lg"
            style={{ background: '#F5A623', clipPath: 'path("M20 0 C31 0 40 9 40 20 C40 31 20 42 20 42 C20 42 0 31 0 20 C0 9 9 0 20 0Z")' }}>
            {pin.count}
          </div>
        </div>
      ))}

      {/* Zoom controls */}
      <div className="absolute bottom-6 right-3 z-10 flex flex-col" style={{ boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}>
        <button className="w-8 h-8 bg-white border-b border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold">+</button>
        <button className="w-8 h-8 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold">−</button>
      </div>

      {/* Google-style attribution */}
      <div className="absolute bottom-2 left-2 text-[9px] text-gray-500">Map data ©2025 YesBroker</div>
    </div>
  )
}

/* ─── Main page ────────────────────────────────────────── */
export default function PropertiesPage() {
  // Filter state
  const [activeType,   setActiveType]   = useState<string>('')
  const [city,         setCity]         = useState('')
  const [status,       setStatus]       = useState('')
  const [minSqft,      setMinSqft]      = useState('')
  const [maxSqft,      setMaxSqft]      = useState('')
  const [priceMax,     setPriceMax]     = useState(200000000)
  const [checkedAmen,  setCheckedAmen]  = useState<Set<string>>(new Set())
  const [bedrooms,     setBedrooms]     = useState(0)
  const [bathrooms,    setBathrooms]    = useState(0)
  const [viewMode,     setViewMode]     = useState<'grid'|'list'>('grid')
  const [scheduleTarget, setScheduleTarget] = useState<Property | null>(null)

  const toggleAmen = (a: string) =>
    setCheckedAmen(prev => { const n = new Set(prev); n.has(a) ? n.delete(a) : n.add(a); return n })

  const resetFilters = () => {
    setActiveType(''); setCity(''); setStatus('')
    setMinSqft(''); setMaxSqft(''); setPriceMax(200000000)
    setCheckedAmen(new Set()); setBedrooms(0); setBathrooms(0)
  }

  const filtered = useMemo(() => MOCK_PROPERTIES.filter(p => {
    if (activeType && p.type !== activeType) return false
    if (city && !p.address.city.toLowerCase().includes(city.toLowerCase())) return false
    if (status === 'sale' && p.listingType !== 'sale') return false
    if (status === 'rent' && p.listingType !== 'rent') return false
    if (status === 'sold' && p.status !== 'sold') return false
    if (minSqft && p.area < Number(minSqft)) return false
    if (maxSqft && p.area > Number(maxSqft)) return false
    if (p.price > priceMax) return false
    if (bedrooms > 0 && (p.bedrooms ?? 0) < bedrooms) return false
    if (bathrooms > 0 && (p.bathrooms ?? 0) < bathrooms) return false
    if (checkedAmen.size > 0) {
      const amenArr = Array.from(checkedAmen)
      const has = amenArr.every(a => p.amenities?.some(pa => pa.toLowerCase().includes(a.toLowerCase().split('/')[0].trim())))
      if (!has) return false
    }
    return true
  }), [activeType, city, status, minSqft, maxSqft, priceMax, bedrooms, bathrooms, checkedAmen])

  return (
    <AppLayout title="Properties" subtitle={`${filtered.length} listings found`} noPadding>
      {/* ── PAGE BODY: filter panel left + map right ── */}
      <div className="flex w-full" style={{ minHeight: '100%' }}>

        {/* ── LEFT: filter + results ── */}
        <div className="flex-1 min-w-0 overflow-y-auto" style={{ fontFamily: "'Poppins', sans-serif" }}>

          {/* ── FILTER PANEL ── */}
          <div className="px-4 md:px-6 pt-5 md:pt-7 pb-5 border-b border-gray-100 bg-white">

            {/* Top row: status dropdown + type icons */}
            <div className="flex flex-wrap items-start gap-3 mb-5">
              {/* Status select */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="border border-gray-300 px-3 pr-8 py-2 text-sm bg-white appearance-none outline-none cursor-pointer"
                    style={{ minWidth: 150 }}>
                    <option value="">All Properties</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                    <option value="sold">Just Sold</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Property type icon pills */}
              <div className="flex items-center gap-0 border border-gray-200 divide-x divide-gray-200 overflow-hidden">
                {PROP_TYPES.map(pt => (
                  <button
                    key={pt.val}
                    onClick={() => setActiveType(prev => prev === pt.val ? '' : pt.val)}
                    className="flex flex-col items-center gap-1 px-5 py-3 transition-all text-center"
                    style={{
                      background: activeType === pt.val ? '#F5A623' : '#fff',
                      color: activeType === pt.val ? '#1A1A2E' : '#555',
                    }}>
                    <pt.Icon className="w-5 h-5" strokeWidth={1.5} />
                    <span className="text-[10px] font-semibold leading-tight whitespace-nowrap">{pt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Location + Size + Price row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5 pb-5 border-b border-gray-100">
              {/* Location */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Choose a location</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <select
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    className="w-full border border-gray-300 pl-8 pr-8 py-2 text-sm bg-white appearance-none outline-none cursor-pointer">
                    <option value="">All Locations</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Size */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">Size</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={minSqft}
                    onChange={e => setMinSqft(e.target.value)}
                    placeholder="Min"
                    className="w-full border border-gray-300 px-2 py-2 text-sm outline-none focus:border-yellow-400"
                  />
                  <span className="text-xs text-gray-400 flex-shrink-0">sq ft</span>
                  <input
                    type="number"
                    value={maxSqft}
                    onChange={e => setMaxSqft(e.target.value)}
                    placeholder="Max"
                    className="w-full border border-gray-300 px-2 py-2 text-sm outline-none focus:border-yellow-400"
                  />
                  <span className="text-xs text-gray-400 flex-shrink-0">sq ft</span>
                </div>
              </div>

              {/* Price range */}
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Price range: up to {priceMax >= 10_000_000 ? `₹${(priceMax/10_000_000).toFixed(0)} Cr` : `₹${(priceMax/100_000).toFixed(0)} L`}
                </label>
                <input
                  type="range"
                  min={1000000}
                  max={500000000}
                  step={1000000}
                  value={priceMax}
                  onChange={e => setPriceMax(Number(e.target.value))}
                  className="w-full accent-yellow-400"
                  style={{ accentColor: '#F5A623' }}
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-0.5">
                  <span>₹10 L</span><span>₹50 Cr</span>
                </div>
              </div>
            </div>

            {/* Amenities checkboxes */}
            <div className="mb-5 pb-5 border-b border-gray-100">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-2.5">
                {AMENITIES.map(a => (
                  <label key={a} className="flex items-center gap-2 cursor-pointer group">
                    <div
                      onClick={() => toggleAmen(a)}
                      className="w-4 h-4 border flex-shrink-0 flex items-center justify-center transition-all cursor-pointer"
                      style={{ borderColor: checkedAmen.has(a) ? '#F5A623' : '#ccc', background: checkedAmen.has(a) ? '#F5A623' : '#fff' }}>
                      {checkedAmen.has(a) && <span className="text-white text-[10px] font-black leading-none">✓</span>}
                    </div>
                    <span className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors">{a}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Bedrooms + Bathrooms */}
            <div className="flex items-start gap-12 mb-5 pb-5 border-b border-gray-100">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Bedrooms (BHK)</label>
                <Stepper value={bedrooms} onChange={setBedrooms} />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">Bathrooms</label>
                <Stepper value={bathrooms} onChange={setBathrooms} />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => {}}
                className="px-8 py-2.5 text-xs font-black tracking-widest text-black hover:opacity-80 transition-all"
                style={{ background: '#F5A623' }}>
                FILTER RESULTS
              </button>
              <button
                className="px-6 py-2.5 text-xs font-black tracking-widest border hover:bg-gray-50 transition-all"
                style={{ borderColor: '#1A1A2E', color: '#1A1A2E' }}>
                SAVE SEARCH
              </button>
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors ml-auto">
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ── RESULTS HEADER ── */}
          <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-white border-b border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-bold text-gray-900">{filtered.length}</span> properties
              {activeType && <> in <span className="font-bold text-gray-900 capitalize">{activeType}</span></>}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className="w-8 h-8 flex items-center justify-center transition-all"
                style={{ background: viewMode === 'grid' ? '#F5A623' : '#f5f5f5', color: viewMode === 'grid' ? '#1A1A2E' : '#888' }}>
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="w-8 h-8 flex items-center justify-center transition-all"
                style={{ background: viewMode === 'list' ? '#F5A623' : '#f5f5f5', color: viewMode === 'list' ? '#1A1A2E' : '#888' }}>
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── PROPERTY GRID ── */}
          <div className="px-4 md:px-6 py-4 md:py-6 bg-white">
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p className="font-bold text-gray-400">No properties match your filters.</p>
                <button onClick={resetFilters} className="mt-4 text-sm text-yellow-600 hover:underline">Reset filters</button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(p => (
                  <PropertyCard key={p.id} prop={p} onSchedule={setScheduleTarget} />
                ))}
              </div>
            ) : (
              /* List view */
              <div className="space-y-3">
                {filtered.map(p => (
                  <Link key={p.id} href={`/properties/${p.id}`} className="block group">
                  <div className="flex gap-4 bg-white p-3" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.10)', borderRadius: 16, overflow: 'hidden' }}>
                    <div className="relative flex-shrink-0 overflow-hidden" style={{ width: 160, height: 110, borderRadius: 10 }}>
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold text-white" style={{ background: 'rgba(26,26,46,0.85)' }}>
                        {badgeLabel(p)}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-900 text-sm mb-0.5 line-clamp-1">{p.title}</h3>
                      <p className="text-gray-400 text-xs mb-2">{p.address.locality} – {p.address.city}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-500 mb-2">
                        {p.bedrooms && <span className="flex items-center gap-1"><Bed className="w-3 h-3" />{p.bedrooms} BHK</span>}
                        {p.bathrooms && <span className="flex items-center gap-1"><Bath className="w-3 h-3" />{p.bathrooms} Bath</span>}
                        <span className="flex items-center gap-1"><Maximize className="w-3 h-3" />{p.area.toLocaleString()} sqft</span>
                      </div>
                      <p className="font-black text-gray-900" style={{ fontFamily: "'Poppins',sans-serif" }}>{fmtPrice(p.price, p.priceUnit)}</p>
                    </div>
                    <div className="flex items-center flex-shrink-0">
                      <button onClick={e => { e.preventDefault(); setScheduleTarget(p) }}
                        className="px-4 py-2 text-xs font-black tracking-wide text-black hover:opacity-80 transition-all rounded-lg"
                        style={{ background: '#F5A623' }}>
                        <CalendarCheck className="w-3.5 h-3.5 inline mr-1" />
                        VISIT
                      </button>
                    </div>
                  </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── RIGHT: Sticky map ── */}
        <div
          className="hidden lg:block flex-shrink-0"
          style={{ width: '35%', minWidth: 340, maxWidth: 520, position: 'sticky', top: 0, height: 'calc(100vh - 73px)', alignSelf: 'flex-start' }}>
          <MapPanel properties={filtered} />
        </div>
      </div>

      {/* Schedule Visit Modal */}
      {scheduleTarget && (
        <ScheduleVisitModal prop={scheduleTarget} onClose={() => setScheduleTarget(null)} />
      )}
    </AppLayout>
  )
}
