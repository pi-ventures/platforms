'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import AppLayout from '@/components/layout/AppLayout'
import { MOCK_PROPERTIES } from '@/lib/mockData'
import {
  MapPin, Bed, Bath, Maximize, CalendarCheck, Shield,
  Home, Building2, ArrowLeft, Eye, Users, CheckCircle,
  ChevronLeft, ChevronRight, Share2, Heart, Layers,
  Compass, Zap, Car, Wifi, Waves, Dumbbell, Trees,
  Camera, Grid2X2, Box, Map, Expand,
  LayoutGrid, Ruler, Award, Star, LandPlot, Timer,
  HardHat, Sparkles, ChevronDown, ChevronUp,
} from 'lucide-react'

/* ─── helpers ─────────────────────────────────────────── */
const fmtPrice = (n: number, unit: string) => {
  if (unit === 'per_month') return `₹${n.toLocaleString('en-IN')}/mo`
  if (unit === 'per_sqft')  return `₹${n.toLocaleString('en-IN')}/sqft`
  return n >= 10_000_000 ? `₹${(n / 10_000_000).toFixed(2)} Cr`
       : n >= 100_000    ? `₹${(n / 100_000).toFixed(1)} L`
       : `₹${n.toLocaleString('en-IN')}`
}

const amenityIcon = (a: string) => {
  const l = a.toLowerCase()
  if (l.includes('pool') || l.includes('swim')) return Waves
  if (l.includes('gym') || l.includes('fitness')) return Dumbbell
  if (l.includes('park') || l.includes('garden')) return Trees
  if (l.includes('wifi') || l.includes('internet')) return Wifi
  if (l.includes('car') || l.includes('parking')) return Car
  if (l.includes('power') || l.includes('backup')) return Zap
  if (l.includes('lift') || l.includes('elevator')) return Layers
  if (l.includes('security') || l.includes('cctv')) return Shield
  return CheckCircle
}

/* ─── Schedule Visit Modal ────────────────────────────── */
function ScheduleVisitModal({ title, address, onClose }: { title: string; address: string; onClose: () => void }) {
  const [step, setStep] = useState<'form' | 'done'>('form')
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
          <button onClick={onClose} className="flex-1 py-2.5 bg-gray-100 text-gray-700 text-sm font-semibold hover:bg-gray-200 transition-colors rounded-lg">Close</button>
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
        <div className="px-6 py-5 flex items-start justify-between" style={{ background: '#1A1A2E' }}>
          <div>
            <h2 className="text-white font-black text-lg" style={{ fontFamily: "'Poppins',sans-serif" }}>Schedule a Visit</h2>
            <p className="text-white/60 text-xs mt-0.5 line-clamp-1">{title}</p>
            <p className="text-white/40 text-xs flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" />{address}</p>
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

/* ─── Main Page ───────────────────────────────────────── */
export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params?.id as string

  const prop = MOCK_PROPERTIES.find(p => p.id === id)
  const [imgIndex, setImgIndex]         = useState(0)
  const [showModal, setShowModal]       = useState(false)
  const [saved, setSaved]               = useState(false)
  const [lightboxMode, setLightboxMode] = useState<null|'photos'|'floorplan'|'3d'|'map'>(null)
  const [projectTab, setProjectTab]     = useState<'highlights'|'unitplans'|'specs'|'builder'>('highlights')
  const [expandedConfig, setExpandedConfig] = useState<number|null>(null)

  if (!prop) {
    return (
      <AppLayout title="Property Not Found">
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <Building2 className="w-16 h-16 text-gray-200 mb-4" />
          <h2 className="text-xl font-bold text-gray-400 mb-2">Property not found</h2>
          <button onClick={() => router.back()} className="mt-4 text-sm font-bold px-5 py-2.5 rounded-xl text-black" style={{ background: '#F5A623' }}>
            ← Back to Listings
          </button>
        </div>
      </AppLayout>
    )
  }

  const badge = prop.status === 'sold' ? 'Just Sold'
    : prop.listingType === 'rent' ? 'For Rent'
    : prop.listingType === 'sale' ? 'For Sale'
    : prop.listingType.charAt(0).toUpperCase() + prop.listingType.slice(1)

  const badgeBg = badge === 'Just Sold' ? '#3c3c3c'
    : badge === 'For Rent' ? '#2563eb'
    : '#1A1A2E'

  const images = prop.images.length > 0 ? prop.images : ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800']

  return (
    <AppLayout
      title={prop.title}
      subtitle={`${prop.address.locality}, ${prop.address.city}`}
      actions={
        <button onClick={() => router.push('/properties')}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl transition-all hover:border-gray-400">
          <ArrowLeft className="w-4 h-4" /> Back to Listings
        </button>
      }
    >
      <div className="max-w-6xl mx-auto space-y-4 md:space-y-6 pb-10 px-1" style={{ fontFamily: "'Poppins', sans-serif" }}>

        {/* ── TOP: Image gallery + Key info ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">

          {/* ── ZILLOW-STYLE GALLERY (3/5 desktop, full mobile) ── */}
          <div className="lg:col-span-3 space-y-2">

            {/* ── MAIN HERO PHOTO ── */}
            <div className="relative overflow-hidden rounded-2xl group" style={{ height: 'clamp(260px, 40vw, 420px)' }}>
              {/* Photo */}
              <img key={imgIndex} src={images[imgIndex]} alt={prop.title}
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.02]" />

              {/* Bottom gradient */}
              <div className="absolute inset-x-0 bottom-0 h-28 pointer-events-none"
                style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65), transparent)' }} />

              {/* Top-left: badge */}
              <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white rounded-lg" style={{ background: badgeBg }}>
                {badge}
              </div>

              {/* Top-right: fav + share + expand */}
              <div className="absolute top-3 right-3 flex gap-1.5">
                {[
                  { onClick: () => setSaved(s => !s), icon: <Heart className={`w-4 h-4 ${saved ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} /> },
                  { onClick: () => {},                 icon: <Share2 className="w-4 h-4 text-gray-600" /> },
                  { onClick: () => setLightboxMode('photos'), icon: <Expand className="w-4 h-4 text-gray-600" /> },
                ].map((btn, i) => (
                  <button key={i} onClick={btn.onClick}
                    className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all hover:bg-white hover:scale-110">
                    {btn.icon}
                  </button>
                ))}
              </div>

              {/* Left / Right arrows */}
              <button onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                <ChevronLeft className="w-5 h-5 text-gray-800" />
              </button>
              <button onClick={() => setImgIndex(i => (i + 1) % images.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white transition-all opacity-0 group-hover:opacity-100">
                <ChevronRight className="w-5 h-5 text-gray-800" />
              </button>

              {/* Bottom-left: photo counter */}
              <div className="absolute bottom-3 left-3 flex items-center gap-2">
                <span className="bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                  <Camera className="w-3 h-3 inline mr-1" />{imgIndex + 1} / {images.length}
                </span>
              </div>

              {/* ── Bottom-right: Zillow-style media type tiles ── */}
              <div className="absolute bottom-3 right-3 flex gap-1.5">
                <button onClick={() => setLightboxMode('photos')}
                  className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm hover:bg-black/90 transition-all px-2.5 py-1.5 rounded-lg">
                  <Camera className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-bold">{images.length} Photos</span>
                </button>
                <button onClick={() => setLightboxMode('floorplan')}
                  className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm hover:bg-black/90 transition-all px-2.5 py-1.5 rounded-lg">
                  <Grid2X2 className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-bold hidden sm:inline">Floor Plan</span>
                </button>
                <button onClick={() => setLightboxMode('3d')}
                  className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm hover:bg-black/90 transition-all px-2.5 py-1.5 rounded-lg">
                  <Box className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-bold hidden sm:inline">3D Tour</span>
                </button>
                <button onClick={() => setLightboxMode('map')}
                  className="flex items-center gap-1.5 bg-black/70 backdrop-blur-sm hover:bg-black/90 transition-all px-2.5 py-1.5 rounded-lg">
                  <Map className="w-3.5 h-3.5 text-white" />
                  <span className="text-white text-xs font-bold hidden sm:inline">Map</span>
                </button>
              </div>
            </div>

            {/* ── Thumbnail strip ── */}
            <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${images.length}, 1fr)` }}>
              {images.map((src, i) => (
                <button key={i} onClick={() => setImgIndex(i)}
                  className="relative overflow-hidden rounded-xl transition-all"
                  style={{ height: 68, outline: i === imgIndex ? '3px solid #F5A623' : '3px solid transparent', outlineOffset: 1 }}>
                  <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover hover:opacity-90 transition-opacity" />
                  {i !== imgIndex && <div className="absolute inset-0 bg-black/20" />}
                </button>
              ))}
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-2 md:gap-3 pt-1">
              {[
                { icon: Eye,          label: 'Total Views', value: prop.views?.toLocaleString() ?? '—' },
                { icon: Users,        label: 'Enquiries',   value: (prop.leads ?? 0).toString() },
                { icon: CalendarCheck,label: 'Listed On',   value: new Date(prop.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-white rounded-xl p-3 md:p-4 border border-gray-100 flex items-center gap-2 md:gap-3">
                  <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FFF8EC' }}>
                    <Icon className="w-4 h-4" style={{ color: '#F5A623' }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] md:text-xs text-gray-400 truncate">{label}</p>
                    <p className="font-bold text-gray-900 text-xs md:text-sm">{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Unified Lightbox (Photos / Floor Plan / 3D / Map) ── */}
          {lightboxMode && (
            <div className="fixed inset-0 bg-black/95 z-[60] flex flex-col" onClick={() => setLightboxMode(null)}>
              {/* Header with tab switcher */}
              <div className="flex items-center justify-between px-4 md:px-6 py-3 flex-shrink-0 border-b border-white/10"
                onClick={e => e.stopPropagation()}>
                {/* Tabs */}
                <div className="flex gap-1">
                  {([
                    { id: 'photos',    label: 'Photos',     Icon: Camera  },
                    { id: 'floorplan', label: 'Floor Plan',  Icon: Grid2X2 },
                    { id: '3d',        label: '3D Tour',     Icon: Box     },
                    { id: 'map',       label: 'Map',         Icon: Map     },
                  ] as const).map(({ id, label, Icon }) => (
                    <button key={id} onClick={() => setLightboxMode(id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background: lightboxMode === id ? '#F5A623' : 'rgba(255,255,255,0.08)',
                        color: lightboxMode === id ? '#1A1A2E' : 'rgba(255,255,255,0.6)',
                      }}>
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
                {/* Counter + close */}
                <div className="flex items-center gap-3">
                  {lightboxMode === 'photos' && (
                    <span className="text-white/50 text-sm">{imgIndex + 1} / {images.length}</span>
                  )}
                  <button onClick={() => setLightboxMode(null)} className="text-white/50 hover:text-white text-xl transition-colors">✕</button>
                </div>
              </div>

              {/* ── PHOTOS mode ── */}
              {lightboxMode === 'photos' && (
                <>
                  {/* Fixed frame — fills the flex-1 area; image uses object-contain inside it
                      so the container never resizes and the arrows stay locked in place */}
                  <div className="flex-1 relative overflow-hidden" onClick={e => e.stopPropagation()}>
                    <img
                      key={imgIndex}
                      src={images[imgIndex]}
                      alt=""
                      className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
                    />
                    <button onClick={() => setImgIndex(i => (i - 1 + images.length) % images.length)}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-all z-10">
                      <ChevronLeft className="w-6 h-6 text-white" />
                    </button>
                    <button onClick={() => setImgIndex(i => (i + 1) % images.length)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-all z-10">
                      <ChevronRight className="w-6 h-6 text-white" />
                    </button>
                  </div>
                  <div className="flex gap-2 px-6 py-3 overflow-x-auto flex-shrink-0 justify-center" onClick={e => e.stopPropagation()}>
                    {images.map((src, i) => (
                      <button key={i} onClick={() => setImgIndex(i)}
                        className="flex-shrink-0 overflow-hidden rounded-lg transition-all"
                        style={{ width: 72, height: 52, outline: i === imgIndex ? '2px solid #F5A623' : '2px solid transparent' }}>
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </>
              )}

              {/* ── FLOOR PLAN mode ── */}
              {lightboxMode === 'floorplan' && (
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-4" onClick={e => e.stopPropagation()}>
                  <div className="bg-white rounded-2xl overflow-hidden w-full max-w-2xl">
                    <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-700">Floor Plan — {prop.floor ? `Floor ${prop.floor}` : 'Ground Floor'}</p>
                      <span className="text-xs text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">{prop.area.toLocaleString()} sq ft</span>
                    </div>
                    <div className="flex items-center justify-center p-6">
                      <svg viewBox="0 0 420 320" className="w-full max-w-lg">
                        <rect x="20" y="20" width="380" height="280" fill="#f8f6f2" stroke="#1A1A2E" strokeWidth="3" rx="2"/>
                        <rect x="20" y="20" width="180" height="160" fill="#fffdf7" stroke="#1A1A2E" strokeWidth="2"/>
                        <text x="110" y="95" textAnchor="middle" fontSize="11" fill="#666" fontWeight="600">Living Room</text>
                        <text x="110" y="110" textAnchor="middle" fontSize="9" fill="#aaa">{prop.bedrooms ? '24 × 18 ft' : '30 × 22 ft'}</text>
                        <rect x="200" y="20" width="200" height="140" fill="#fef9f0" stroke="#1A1A2E" strokeWidth="2"/>
                        <text x="300" y="84" textAnchor="middle" fontSize="11" fill="#666" fontWeight="600">Master Bedroom</text>
                        <text x="300" y="99" textAnchor="middle" fontSize="9" fill="#aaa">16 × 14 ft</text>
                        <rect x="262" y="32" width="50" height="36" rx="3" fill="#e8e0d0" stroke="#ccc" strokeWidth="1"/>
                        <rect x="262" y="32" width="50" height="12" rx="3" fill="#d4c9b8" stroke="#ccc" strokeWidth="1"/>
                        <rect x="20" y="180" width="130" height="120" fill="#f0f7f0" stroke="#1A1A2E" strokeWidth="2"/>
                        <text x="85" y="236" textAnchor="middle" fontSize="11" fill="#666" fontWeight="600">Kitchen</text>
                        <text x="85" y="251" textAnchor="middle" fontSize="9" fill="#aaa">12 × 10 ft</text>
                        <rect x="28" y="188" width="114" height="16" rx="2" fill="#c8e0c8" stroke="#aaa" strokeWidth="1"/>
                        <rect x="150" y="180" width="90" height="70" fill="#e8f4fd" stroke="#1A1A2E" strokeWidth="2"/>
                        <text x="195" y="212" textAnchor="middle" fontSize="10" fill="#666" fontWeight="600">Bathroom</text>
                        <text x="195" y="225" textAnchor="middle" fontSize="9" fill="#aaa">8 × 6 ft</text>
                        <ellipse cx="195" cy="240" rx="20" ry="10" fill="#b8d8f0" stroke="#aaa" strokeWidth="1"/>
                        {prop.bedrooms && prop.bedrooms >= 2 && (
                          <>
                            <rect x="240" y="160" width="160" height="140" fill="#fef9f0" stroke="#1A1A2E" strokeWidth="2"/>
                            <text x="320" y="226" textAnchor="middle" fontSize="11" fill="#666" fontWeight="600">Bedroom 2</text>
                            <text x="320" y="241" textAnchor="middle" fontSize="9" fill="#aaa">14 × 12 ft</text>
                            <rect x="256" y="170" width="42" height="32" rx="3" fill="#e8e0d0" stroke="#ccc" strokeWidth="1"/>
                            <rect x="256" y="170" width="42" height="10" rx="3" fill="#d4c9b8"/>
                          </>
                        )}
                        <rect x="150" y="250" width="80" height="50" fill="#e8f5e0" stroke="#1A1A2E" strokeWidth="1.5" strokeDasharray="5,3"/>
                        <text x="190" y="272" textAnchor="middle" fontSize="10" fill="#666" fontWeight="500">Balcony</text>
                        <path d="M200 180 L200 160" stroke="#1A1A2E" strokeWidth="1" strokeDasharray="3,2"/>
                        <path d="M150 180 Q170 180 170 160" fill="none" stroke="#888" strokeWidth="1.5"/>
                        <circle cx="390" cy="35" r="12" fill="white" stroke="#ddd" strokeWidth="1"/>
                        <text x="390" y="31" textAnchor="middle" fontSize="8" fill="#F5A623" fontWeight="900">N</text>
                        <path d="M390 33 L390 23" stroke="#F5A623" strokeWidth="1.5"/>
                        <path d="M390 37 L390 47" stroke="#ccc" strokeWidth="1.5"/>
                        <line x1="30" y1="310" x2="90" y2="310" stroke="#999" strokeWidth="1.5"/>
                        <line x1="30" y1="306" x2="30" y2="314" stroke="#999" strokeWidth="1.5"/>
                        <line x1="90" y1="306" x2="90" y2="314" stroke="#999" strokeWidth="1.5"/>
                        <text x="60" y="308" textAnchor="middle" fontSize="8" fill="#888">20 ft</text>
                      </svg>
                    </div>
                  </div>
                </div>
              )}

              {/* ── 3D TOUR mode ── */}
              {lightboxMode === '3d' && (
                <div className="flex-1 flex items-center justify-center" onClick={e => e.stopPropagation()}>
                  <div className="relative rounded-2xl overflow-hidden w-full max-w-2xl mx-6"
                    style={{ height: 'clamp(320px, 50vw, 520px)', background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)' }}>
                    <div className="absolute inset-0" style={{
                      backgroundImage: 'linear-gradient(rgba(245,166,35,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(245,166,35,0.07) 1px, transparent 1px)',
                      backgroundSize: '40px 40px',
                      transform: 'perspective(600px) rotateX(55deg) scale(1.8)',
                      transformOrigin: '50% 100%',
                    }} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <svg viewBox="0 0 200 160" className="w-48 md:w-64 drop-shadow-2xl">
                        <ellipse cx="100" cy="152" rx="70" ry="8" fill="rgba(0,0,0,0.4)"/>
                        <polygon points="30,130 30,70 100,50 100,110" fill="#2a3a5c" stroke="#F5A623" strokeWidth="0.5"/>
                        <polygon points="100,50 100,110 170,70 170,130" fill="#1e2d4a" stroke="#F5A623" strokeWidth="0.5"/>
                        <polygon points="25,70 100,20 100,50 30,70" fill="#F5A623" stroke="#e09018" strokeWidth="0.5"/>
                        <polygon points="100,20 175,70 170,70 100,50" fill="#d4911f" stroke="#e09018" strokeWidth="0.5"/>
                        <line x1="25" y1="70" x2="175" y2="70" stroke="#e09018" strokeWidth="1"/>
                        <rect x="40" y="80" width="20" height="20" rx="2" fill="#7ab3d0" stroke="#5a93b0" strokeWidth="0.5" opacity="0.9"/>
                        <line x1="50" y1="80" x2="50" y2="100" stroke="#5a93b0" strokeWidth="0.5"/>
                        <line x1="40" y1="90" x2="60" y2="90" stroke="#5a93b0" strokeWidth="0.5"/>
                        <rect x="70" y="80" width="20" height="20" rx="2" fill="#7ab3d0" stroke="#5a93b0" strokeWidth="0.5" opacity="0.9"/>
                        <rect x="82" y="95" width="16" height="15" rx="1" fill="#0f1a30" stroke="#F5A623" strokeWidth="0.5"/>
                        <circle cx="96" cy="103" r="1.5" fill="#F5A623"/>
                        <rect x="115" y="75" width="18" height="18" rx="2" fill="#7ab3d0" stroke="#5a93b0" strokeWidth="0.5" opacity="0.7"/>
                        <rect x="142" y="80" width="18" height="18" rx="2" fill="#7ab3d0" stroke="#5a93b0" strokeWidth="0.5" opacity="0.7"/>
                        <polygon points="25,130 100,110 175,130 100,150" fill="#151e33" stroke="#F5A623" strokeWidth="0.5"/>
                      </svg>
                      <div className="mt-4 text-center">
                        <p className="text-white font-black text-lg mb-1" style={{ fontFamily: "'Poppins',sans-serif" }}>3D Virtual Tour</p>
                        <p className="text-white/50 text-xs mb-4">Walk through every room in 360°</p>
                        <button className="flex items-center gap-2 mx-auto px-5 py-2.5 rounded-xl font-bold text-sm text-black transition-all hover:opacity-80" style={{ background: '#F5A623' }}>
                          <Box className="w-4 h-4" /> Launch 3D Tour
                        </button>
                      </div>
                    </div>
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5">
                      <Compass className="w-3.5 h-3.5 text-yellow-400 animate-spin" style={{ animationDuration: '4s' }} />
                      <span className="text-white/70 text-xs">Drag to rotate</span>
                    </div>
                  </div>
                </div>
              )}

              {/* ── MAP mode ── */}
              {lightboxMode === 'map' && (
                <div className="flex-1 flex items-center justify-center p-4 md:p-8" onClick={e => e.stopPropagation()}>
                  <div className="relative rounded-2xl overflow-hidden w-full max-w-2xl" style={{ height: 'clamp(320px, 50vw, 520px)', background: '#ece8e0' }}>
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 500 400" preserveAspectRatio="xMidYMid slice">
                      <rect width="500" height="400" fill="#ece8e0"/>
                      {[80,160,240,320,400].map(x => <line key={x} x1={x} y1="0" x2={x} y2="400" stroke="#d8cfc7" strokeWidth="5"/>)}
                      {[60,130,200,270,340].map(y => <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#d8cfc7" strokeWidth="5"/>)}
                      {[40,120,200,280,360,440].map(x => <line key={`m${x}`} x1={x} y1="0" x2={x} y2="400" stroke="#dbd5ce" strokeWidth="2"/>)}
                      {[95,165,235,305,375].map(y => <line key={`n${y}`} x1="0" y1={y} x2="500" y2={y} stroke="#dbd5ce" strokeWidth="2"/>)}
                      {[[20,20,50,50],[90,20,60,50],[170,20,60,50],[250,20,60,50],[330,20,60,50],[410,20,60,50],
                        [20,80,50,40],[90,80,60,40],[170,80,60,40],[250,80,60,40],[330,80,60,40],[410,80,60,40],
                        [20,150,50,40],[90,150,60,40],[170,150,60,40],[330,150,60,40],[410,150,60,40],
                        [20,220,50,40],[170,220,60,40],[250,220,60,40],[330,220,60,40],[410,220,60,40],
                        [20,290,50,40],[90,290,60,40],[170,290,60,40],[250,290,60,40],[330,290,60,40],[410,290,60,40],
                      ].map(([x,y,w,h],i) => <rect key={i} x={x} y={y} width={w} height={h} fill="#f5efe8" rx="2"/>)}
                      <rect x="90" y="220" width="60" height="40" fill="#c8e0b8" rx="3"/>
                      <ellipse cx="400" cy="200" rx="50" ry="30" fill="#b8d8f0" opacity="0.8"/>
                      <text x="200" y="198" fontSize="9" fill="#bbb" textAnchor="middle" transform="rotate(-90,200,200)">MG Road</text>
                      <text x="250" y="128" fontSize="9" fill="#bbb" textAnchor="middle">Link Road</text>
                      <circle cx="250" cy="200" r="28" fill="rgba(245,166,35,0.2)" stroke="#F5A623" strokeWidth="2"/>
                      <circle cx="250" cy="200" r="14" fill="#F5A623" stroke="white" strokeWidth="2.5"/>
                      <text x="250" y="195" fontSize="9" fill="white" textAnchor="middle" fontWeight="900">YB</text>
                      <text x="250" y="207" fontSize="7" fill="white" textAnchor="middle">HERE</text>
                      <circle cx="250" cy="200" r="36" fill="none" stroke="#F5A623" strokeWidth="1" opacity="0.4"/>
                      <circle cx="250" cy="200" r="44" fill="none" stroke="#F5A623" strokeWidth="0.5" opacity="0.2"/>
                    </svg>
                    <div className="absolute bottom-4 right-4 flex flex-col shadow-lg rounded-lg overflow-hidden">
                      <button className="w-8 h-8 bg-white border-b border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold">+</button>
                      <button className="w-8 h-8 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 text-lg font-bold">−</button>
                    </div>
                    <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-2 shadow text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 flex-shrink-0" style={{ color: '#F5A623' }} />
                      {prop.address.locality}, {prop.address.city}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Key info card (2/5 wide on desktop, full on mobile) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Price card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <p className="text-3xl font-black" style={{ color: '#1A1A2E', fontFamily: "'Poppins',sans-serif" }}>
                {fmtPrice(prop.price, prop.priceUnit)}
              </p>
              {prop.priceUnit === 'total' && prop.area > 0 && (
                <p className="text-sm text-gray-400 mt-1">
                  ₹{Math.round(prop.price / prop.area).toLocaleString('en-IN')}/sqft
                </p>
              )}
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
                {prop.bedrooms && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Bed className="w-4 h-4 flex-shrink-0" style={{ color: '#F5A623' }} />
                    <span><strong>{prop.bedrooms}</strong> Bedrooms</span>
                  </div>
                )}
                {prop.bathrooms && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Bath className="w-4 h-4 flex-shrink-0" style={{ color: '#F5A623' }} />
                    <span><strong>{prop.bathrooms}</strong> Bathrooms</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-gray-600">
                  <Maximize className="w-4 h-4 flex-shrink-0" style={{ color: '#F5A623' }} />
                  <span><strong>{prop.area.toLocaleString()}</strong> sqft</span>
                </div>
                {prop.floor && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Layers className="w-4 h-4 flex-shrink-0" style={{ color: '#F5A623' }} />
                    <span>Floor <strong>{prop.floor}</strong>{prop.totalFloors ? ` / ${prop.totalFloors}` : ''}</span>
                  </div>
                )}
                {prop.facing && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Compass className="w-4 h-4 flex-shrink-0" style={{ color: '#F5A623' }} />
                    <span><strong>{prop.facing}</strong> Facing</span>
                  </div>
                )}
                {prop.furnishing && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Home className="w-4 h-4 flex-shrink-0" style={{ color: '#F5A623' }} />
                    <span className="capitalize"><strong>{prop.furnishing}</strong> Furnished</span>
                  </div>
                )}
              </div>

              {prop.rera && (
                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-lg">RERA ✓</span>
                  <span className="text-xs text-gray-400 font-mono">{prop.rera}</span>
                </div>
              )}
            </div>

            {/* Address card */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F5A623' }} />
                <div>
                  <p className="text-sm font-semibold text-gray-800">{prop.address.line1}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{prop.address.locality}, {prop.address.city}, {prop.address.state} — {prop.address.pincode}</p>
                </div>
              </div>
            </div>

            {/* CTA button */}
            <button
              onClick={() => setShowModal(true)}
              className="w-full py-4 rounded-2xl text-base font-black tracking-wide text-black transition-all hover:opacity-85 flex items-center justify-center gap-2 shadow-lg"
              style={{ background: '#F5A623', boxShadow: '0 8px 24px rgba(245,166,35,0.35)' }}>
              <CalendarCheck className="w-5 h-5" />
              SCHEDULE A VISIT
            </button>

            {/* Trust note */}
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl border-l-4 bg-amber-50" style={{ borderColor: '#F5A623' }}>
              <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F5A623' }} />
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong style={{ color: '#1A1A2E' }}>No broker contact shared upfront.</strong> Agent details are revealed only after the owner approves your visit request.
              </p>
            </div>
          </div>
        </div>

        {/* ── PROJECT DETAILS (only for society / new-project listings) ── */}
        {prop.project && (() => {
          const proj = prop.project!
          const fmtCr = (n: number) => n >= 10_000_000 ? `₹${(n/10_000_000).toFixed(2)} Cr` : `₹${(n/100_000).toFixed(1)} L`
          const statusColor = proj.constructionStatus === 'ready_to_move' ? '#16a34a'
            : proj.constructionStatus === 'new_launch' ? '#2563eb' : '#d97706'
          const statusLabel = proj.constructionStatus === 'ready_to_move' ? 'Ready to Move'
            : proj.constructionStatus === 'new_launch' ? 'New Launch' : 'Under Construction'

          return (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

              {/* ── Section header ── */}
              <div className="px-5 md:px-7 pt-6 pb-0">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className="w-4 h-4" style={{ color: '#F5A623' }} />
                      <h2 className="font-black text-gray-900 text-lg" style={{ fontFamily: "'Poppins',sans-serif" }}>
                        {proj.name}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-400">by <span className="font-semibold text-gray-600">{proj.builderName}</span></p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-3 py-1 rounded-full text-white" style={{ background: statusColor }}>
                      {statusLabel}
                    </span>
                    {proj.projectRera && (
                      <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                        RERA ✓ {proj.projectRera}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick stats strip */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pb-5 border-b border-gray-100">
                  {[
                    { icon: Building2,  label: 'Towers',        value: `${proj.totalTowers} Tower${proj.totalTowers > 1 ? 's' : ''}` },
                    { icon: Home,       label: 'Total Units',    value: proj.totalUnits.toLocaleString() },
                    { icon: LandPlot,   label: 'Land Area',      value: `${proj.landArea} Acres` },
                    { icon: Layers,     label: 'Floors',         value: `G + ${(prop.totalFloors ?? 1) - 1}` },
                    { icon: Timer,      label: 'Possession',     value: proj.possessionDate },
                    { icon: CalendarCheck, label: 'Launched',    value: proj.launchDate ?? '—' },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FFF8EC' }}>
                        <Icon className="w-4 h-4" style={{ color: '#F5A623' }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] text-gray-400 leading-none mb-0.5">{label}</p>
                        <p className="text-xs font-bold text-gray-800 truncate">{value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── Inner tabs ── */}
                <div className="flex gap-0 -mb-px mt-4 overflow-x-auto">
                  {([
                    { id: 'highlights', label: 'Highlights',  Icon: Sparkles   },
                    { id: 'unitplans',  label: 'Unit Plans',  Icon: LayoutGrid },
                    { id: 'specs',      label: 'Specifications', Icon: Ruler   },
                    { id: 'builder',    label: 'Builder',     Icon: HardHat    },
                  ] as const).map(({ id, label, Icon }) => (
                    <button key={id} onClick={() => setProjectTab(id)}
                      className="flex items-center gap-1.5 px-4 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all"
                      style={{
                        borderColor:  projectTab === id ? '#F5A623' : 'transparent',
                        color:        projectTab === id ? '#1A1A2E' : '#999',
                        background:   'transparent',
                      }}>
                      <Icon className="w-3.5 h-3.5" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Tab content ── */}
              <div className="px-5 md:px-7 py-6">

                {/* HIGHLIGHTS */}
                {projectTab === 'highlights' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(proj.projectHighlights ?? []).map((h, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50 border border-amber-100">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#F5A623' }}>
                          <Star className="w-3 h-3 text-white fill-white" />
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">{h}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* UNIT PLANS */}
                {projectTab === 'unitplans' && (
                  <div className="space-y-3">
                    {/* Header row */}
                    <div className="hidden sm:grid grid-cols-7 gap-2 px-4 py-2 bg-gray-50 rounded-xl text-[10px] font-bold text-gray-400 uppercase tracking-wide">
                      <div className="col-span-1">Config</div>
                      <div className="text-right">Carpet</div>
                      <div className="text-right">Built-Up</div>
                      <div className="text-right">Super BU</div>
                      <div className="text-right">Units</div>
                      <div className="col-span-2 text-right">Price Range</div>
                    </div>

                    {proj.configurations.map((cfg, i) => (
                      <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                        {/* Main row */}
                        <div
                          className="grid grid-cols-2 sm:grid-cols-7 gap-2 items-center px-4 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                          onClick={() => setExpandedConfig(expandedConfig === i ? null : i)}>
                          {/* Config name */}
                          <div className="col-span-2 sm:col-span-1 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-black text-white"
                              style={{ background: '#1A1A2E' }}>
                              {cfg.type.split(' ')[0]}
                            </div>
                            <span className="text-sm font-bold text-gray-800">{cfg.type}</span>
                          </div>
                          {/* Areas */}
                          <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-bold text-gray-800">{cfg.carpetArea.toLocaleString()}</span>
                            <span className="text-[10px] text-gray-400">sq ft</span>
                          </div>
                          <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-bold text-gray-800">{cfg.builtUpArea.toLocaleString()}</span>
                            <span className="text-[10px] text-gray-400">sq ft</span>
                          </div>
                          <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-bold text-gray-800">{cfg.superBuiltUpArea.toLocaleString()}</span>
                            <span className="text-[10px] text-gray-400">sq ft</span>
                          </div>
                          {/* Units count */}
                          <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-bold text-gray-800">{cfg.totalUnitsOfType}</span>
                            <span className="text-[10px] text-gray-400">units</span>
                          </div>
                          {/* Price + expand */}
                          <div className="col-span-2 flex items-center justify-between sm:justify-end gap-3">
                            <div className="flex flex-col items-end">
                              <span className="text-sm font-black" style={{ color: '#1A1A2E' }}>
                                {fmtCr(cfg.priceMin)} – {fmtCr(cfg.priceMax)}
                              </span>
                              {cfg.facing && <span className="text-[10px] text-gray-400">{cfg.facing.join(' / ')}</span>}
                            </div>
                            <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                              {expandedConfig === i
                                ? <ChevronUp className="w-3.5 h-3.5 text-gray-500" />
                                : <ChevronDown className="w-3.5 h-3.5 text-gray-500" />}
                            </div>
                          </div>
                        </div>

                        {/* Expanded area details + floor plan button */}
                        {expandedConfig === i && (
                          <div className="px-4 pb-4 pt-0 border-t border-gray-50 bg-gray-50">
                            <div className="grid grid-cols-3 gap-3 mt-3 mb-4">
                              {[
                                { label: 'Carpet Area',        value: `${cfg.carpetArea.toLocaleString()} sq ft` },
                                { label: 'Built-Up Area',       value: `${cfg.builtUpArea.toLocaleString()} sq ft` },
                                { label: 'Super Built-Up Area', value: `${cfg.superBuiltUpArea.toLocaleString()} sq ft` },
                              ].map(({ label, value }) => (
                                <div key={label} className="bg-white rounded-xl p-3 border border-gray-100">
                                  <p className="text-[10px] text-gray-400 mb-1">{label}</p>
                                  <p className="text-sm font-bold text-gray-800">{value}</p>
                                </div>
                              ))}
                            </div>
                            <button
                              onClick={() => setLightboxMode('floorplan')}
                              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-black hover:opacity-80 transition-all"
                              style={{ background: '#F5A623' }}>
                              <Grid2X2 className="w-3.5 h-3.5" /> View Floor Plan
                            </button>
                          </div>
                        )}
                      </div>
                    ))}

                    {/* Area disclaimer */}
                    <p className="text-[10px] text-gray-400 pt-1">
                      * All areas are approximate. Carpet area as per RERA definition. Super built-up area includes proportionate common areas. Prices indicative; subject to market conditions.
                    </p>
                  </div>
                )}

                {/* SPECIFICATIONS */}
                {projectTab === 'specs' && proj.specifications && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {(Object.entries(proj.specifications) as [string, string][]).map(([key, val]) => {
                      const labels: Record<string, string> = {
                        structure: 'Structure / Frame', flooring: 'Flooring', walls: 'Walls & Paint',
                        kitchen: 'Kitchen', bathrooms: 'Bathrooms', doors: 'Doors',
                        windows: 'Windows', electrical: 'Electrical', waterSupply: 'Water Supply',
                        elevators: 'Elevators / Lifts',
                      }
                      const icons: Record<string, React.ElementType> = {
                        structure: Building2, flooring: Home, walls: Shield,
                        kitchen: Zap, bathrooms: Waves, doors: Home,
                        windows: Wifi, electrical: Zap, waterSupply: Waves, elevators: Layers,
                      }
                      const Icon = icons[key] ?? CheckCircle
                      return (
                        <div key={key} className="flex gap-3 p-4 rounded-xl border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition-colors">
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#FFF8EC' }}>
                            <Icon className="w-4 h-4" style={{ color: '#F5A623' }} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-500 mb-1 uppercase tracking-wide">{labels[key] ?? key}</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{val}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* BUILDER */}
                {projectTab === 'builder' && (
                  <div className="space-y-5">
                    {/* Builder header */}
                    <div className="flex items-start gap-5">
                      <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0 border border-gray-100 shadow-sm"
                        style={{ background: '#1A1A2E' }}>
                        <Award className="w-7 h-7 text-yellow-400" />
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 text-base" style={{ fontFamily: "'Poppins',sans-serif" }}>
                          {proj.builderName}
                        </h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Established {proj.builderSince ?? '—'} · Real Estate Developer
                        </p>
                        {proj.aboutBuilder && (
                          <p className="text-sm text-gray-600 leading-relaxed mt-3">{proj.aboutBuilder}</p>
                        )}
                      </div>
                    </div>

                    {/* Builder stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Years Active',       value: proj.builderSince ? `${new Date().getFullYear() - proj.builderSince}+ Yrs` : '—' },
                        { label: 'Units Delivered',    value: proj.builderDeliveredUnits ? proj.builderDeliveredUnits.toLocaleString() + '+' : '—' },
                        { label: 'Projects Completed', value: proj.builderCompletedProjects ? proj.builderCompletedProjects + '+' : '—' },
                        { label: 'Cities',             value: proj.builderCities ? proj.builderCities + ' Cities' : '—' },
                      ].map(({ label, value }) => (
                        <div key={label} className="text-center p-4 rounded-2xl border border-gray-100 bg-gray-50">
                          <p className="text-xl font-black mb-1" style={{ color: '#1A1A2E', fontFamily: "'Poppins',sans-serif" }}>{value}</p>
                          <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{label}</p>
                        </div>
                      ))}
                    </div>

                    {/* RERA + trust note */}
                    {proj.projectRera && (
                      <div className="flex items-start gap-3 p-4 rounded-xl border-l-4 bg-green-50" style={{ borderColor: '#16a34a' }}>
                        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-green-600" />
                        <div>
                          <p className="text-xs font-bold text-green-700 mb-0.5">RERA Registered Project</p>
                          <p className="text-xs text-gray-600">Registration No: <span className="font-mono font-bold text-gray-800">{proj.projectRera}</span></p>
                          <p className="text-[10px] text-gray-400 mt-1">This project is registered under RERA Act 2016. All project details are verified and publicly available on the respective State RERA portal.</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>
            </div>
          )
        })()}

        {/* ── BOTTOM: Description + Amenities ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 md:gap-6">

          {/* Description (3/5 on desktop, full on mobile) */}
          <div className="lg:col-span-3 space-y-4 md:space-y-5">
            {/* About */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-black text-gray-900 text-base mb-3" style={{ fontFamily: "'Poppins',sans-serif" }}>
                About this property
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">{prop.description}</p>
            </div>

            {/* Property details table */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="font-black text-gray-900 text-base mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
                Property Details
              </h3>
              <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                {[
                  ['Property Type', prop.type.charAt(0).toUpperCase() + prop.type.slice(1)],
                  ['Listing Type', prop.listingType.charAt(0).toUpperCase() + prop.listingType.slice(1)],
                  ['Status', prop.status.charAt(0).toUpperCase() + prop.status.slice(1)],
                  ['Area', `${prop.area.toLocaleString()} sqft`],
                  ...(prop.bedrooms ? [['Bedrooms', `${prop.bedrooms} BHK`]] : []),
                  ...(prop.bathrooms ? [['Bathrooms', prop.bathrooms.toString()]] : []),
                  ...(prop.floor ? [['Floor', prop.totalFloors ? `${prop.floor} of ${prop.totalFloors}` : prop.floor.toString()]] : []),
                  ...(prop.facing ? [['Facing', prop.facing]] : []),
                  ...(prop.furnishing ? [['Furnishing', prop.furnishing.charAt(0).toUpperCase() + prop.furnishing.slice(1) + ' Furnished']] : []),
                  ['Listed By', prop.brokerName],
                  ['Property ID', prop.id.replace('prop_', 'YB-').toUpperCase()],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-baseline justify-between py-2 border-b border-gray-50">
                    <span className="text-xs text-gray-400 font-medium">{label}</span>
                    <span className="text-xs font-bold text-gray-700 text-right">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities (2/5) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 h-full">
              <h3 className="font-black text-gray-900 text-base mb-4" style={{ fontFamily: "'Poppins',sans-serif" }}>
                Amenities
              </h3>
              {prop.amenities.length === 0 ? (
                <p className="text-sm text-gray-400">No amenities listed</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  {prop.amenities.map(a => {
                    const Icon = amenityIcon(a)
                    return (
                      <div key={a} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 hover:bg-amber-50 transition-colors">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#FFF8EC' }}>
                          <Icon className="w-3.5 h-3.5" style={{ color: '#F5A623' }} />
                        </div>
                        <span className="text-xs font-medium text-gray-700 leading-tight">{a}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Similar properties CTA */}
              <div className="mt-6 pt-5 border-t border-gray-100">
                <p className="text-xs text-gray-400 mb-3">More properties in {prop.address.locality}</p>
                <button onClick={() => router.push('/properties')}
                  className="w-full py-2.5 text-xs font-black tracking-wider border-2 rounded-xl transition-all hover:bg-gray-900 hover:text-white"
                  style={{ borderColor: '#1A1A2E', color: '#1A1A2E' }}>
                  VIEW ALL LISTINGS
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>

      {showModal && (
        <ScheduleVisitModal
          title={prop.title}
          address={`${prop.address.locality}, ${prop.address.city}`}
          onClose={() => setShowModal(false)}
        />
      )}
    </AppLayout>
  )
}
