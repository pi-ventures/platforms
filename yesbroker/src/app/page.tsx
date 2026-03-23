'use client'

import { useState } from 'react'
import Link from 'next/link'
import YesBrokerLogo from '@/components/ui/YesBrokerLogo'
import {
  Building2, Home, MapPin, Briefcase, Trees, Store,
  Search, User, Plus, ChevronLeft, ChevronRight,
  Mail, Phone, Send, Twitter, Facebook, Instagram,
  Zap, Heart, Key, CheckCircle, ArrowRight
} from 'lucide-react'

/* ─────────────────── DATA ─────────────────── */

const NAV_LINKS = [
  { label: 'BUY',          href: '/properties', active: true  },
  { label: 'RENT',         href: '/properties', active: false },
  { label: 'SELL',         href: '/properties', active: false },
  { label: 'NEW PROJECTS', href: '/properties', active: false },
  { label: 'COMMERCIAL',   href: '/properties', active: false },
]

const PROP_TYPES = [
  { label: 'Flat',        Icon: Building2 },
  { label: 'Villa',       Icon: Home      },
  { label: 'Plot',        Icon: Trees     },
  { label: 'Commercial',  Icon: Briefcase },
  { label: 'PG / Hostel', Icon: Store     },
  { label: 'New Project', Icon: MapPin    },
]

const CITIES = [
  'Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad',
  'Pune', 'Chennai', 'Ahmedabad', 'Kolkata',
]

const LISTINGS = [
  {
    id: '1', wide: true,
    img:   'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=80',
    badge: 'For Sale', price: '₹1.85 Cr',
    name:  '14, Bandra West Heights', loc: 'Mumbai – Maharashtra',
  },
  {
    id: '2', wide: false,
    img:   'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=80',
    badge: 'For Rent', price: '₹65,000/mo',
    name:  '302, Whitefield Palms', loc: 'Bengaluru – Karnataka',
  },
  {
    id: '3', wide: false,
    img:   'https://images.unsplash.com/photo-1582407947304-fd86f28f4895?w=600&q=80',
    badge: 'Just Sold', price: '₹3.20 Cr',
    name:  'Hiranandani Estate 4BHK', loc: 'Thane – Maharashtra',
  },
  {
    id: '4', wide: false,
    img:   'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80',
    badge: 'For Sale', price: '₹72 Lakh',
    name:  'Hinjewadi Pride 2BHK', loc: 'Pune – Maharashtra',
  },
  {
    id: '5', wide: false,
    img:   'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80',
    badge: 'For Rent', price: '₹3,000/mo',
    name:  'Koramangala Studio', loc: 'Bengaluru – Karnataka',
  },
]

const HOW_STEPS = [
  {
    n: '1', title: 'Choose a Category',
    desc: 'Browse flats, villas, plots, commercial spaces and more — all verified and RERA-compliant.',
    emoji: '🏘️',
  },
  {
    n: '2', title: 'Schedule a Visit',
    desc: 'Book a property visit in-app — no broker calls, real-time tracking, OTP-key access.',
    emoji: '🗝️',
  },
  {
    n: '3', title: 'Get the Keys',
    desc: 'Complete paperwork digitally via MyVault. Sign, register, and move in — all from one app.',
    emoji: '🎉',
  },
]

const TESTIMONIALS = [
  {
    logo: '🏡',
    name: 'Priya Sharma',
    role: 'Home Buyer · Mumbai',
    quote: '"Found my dream 3BHK in Bandra within a week. The Schedule Visit feature is a game-changer — no broker calls at odd hours, just clean in-app booking. YesBroker made buying a home actually enjoyable."',
  },
  {
    logo: '🏢',
    name: 'Rajan Menon',
    role: 'Property Seller · Bengaluru',
    quote: '"Listed my flat and had 14 genuine inquiries in 3 days. Sold at 8% above asking price. The analytics dashboard shows exactly which platforms are sending buyers. Highly recommend."',
  },
]

/* ─────────────────── COMPONENT ─────────────────── */

export default function HomePage() {
  const [city,        setCity]        = useState('')
  const [propType,    setPropType]    = useState('')
  const [budget,      setBudget]      = useState('')
  const [activeType,  setActiveType]  = useState('Flat')
  const [saved,       setSaved]       = useState<Set<string>>(new Set())
  const [testimonial, setTestimonial] = useState(0)
  const [email,       setEmail]       = useState('')

  const toggleSave = (id: string) =>
    setSaved(prev => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n })

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Poppins', sans-serif", background: '#fff' }}>

      {/* ══════════════════════════════════════════════
          1. NAV
      ══════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 h-[64px]"
        style={{ background: '#1A1A2E' }}
      >
        {/* Logo */}
        <Link href="/" className="flex-shrink-0 mr-10">
          <YesBrokerLogo size={34} theme="dark" />
        </Link>

        {/* Center nav links */}
        <div className="flex items-center gap-7 flex-1">
          {NAV_LINKS.map(l => (
            <Link
              key={l.label}
              href={l.href}
              className="text-xs font-bold tracking-widest transition-colors"
              style={{ color: l.active ? '#F5A623' : '#fff' }}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/properties"
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold tracking-wider border transition-colors"
            style={{ borderColor: '#fff', color: '#fff' }}
          >
            <Plus className="w-3.5 h-3.5" />
            LIST PROPERTY
          </Link>
          <button
            className="w-9 h-9 rounded-full border flex items-center justify-center"
            style={{ borderColor: '#fff' }}
          >
            <User className="w-4 h-4 text-white" />
          </button>
        </div>
      </nav>

      {/* ══════════════════════════════════════════════
          2. HERO
      ══════════════════════════════════════════════ */}
      <section
        className="relative flex flex-col items-center justify-center pt-[64px]"
        style={{ minHeight: '100vh', maxHeight: 900 }}
      >
        {/* Background */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&q=85')" }}
        />
        {/* Overlay */}
        <div className="absolute inset-0" style={{ background: 'rgba(10,14,30,0.62)' }} />

        {/* Annotation sticker (top-left) */}
        <div
          className="absolute top-24 left-6 z-10 rotate-[-4deg]"
          style={{ maxWidth: 160 }}
        >
          <div
            className="px-3 py-2 text-center leading-tight"
            style={{
              background: '#F5A623',
              fontFamily: "'Permanent Marker', 'Kalam', cursive, sans-serif",
              fontSize: 13,
              fontWeight: 700,
              color: '#1A1A2E',
              clipPath: 'polygon(0 3%,97% 0,100% 95%,3% 100%)',
              lineHeight: 1.3,
            }}
          >
            WHAT KIND OF<br />PROPERTY DO<br />YOU WANT?
          </div>
          {/* Arrow */}
          <div className="mt-1 ml-8 text-2xl" style={{ color: '#F5A623', fontFamily: 'serif', lineHeight: 1 }}>↙</div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6" style={{ maxWidth: 900 }}>
          {/* Headline */}
          <h1
            className="text-white font-black leading-tight mb-10"
            style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)', letterSpacing: '-0.01em' }}
          >
            Find Your Perfect<br />Home in India
          </h1>

          {/* Property type icon tabs */}
          <div className="flex items-center justify-center gap-0 mb-8 flex-wrap">
            {PROP_TYPES.map((pt, i) => (
              <button
                key={pt.label}
                onClick={() => setActiveType(pt.label)}
                className="flex flex-col items-center gap-2 px-8 py-4 transition-all"
                style={{
                  borderRight: i < PROP_TYPES.length - 1 ? '1px solid rgba(255,255,255,0.25)' : 'none',
                  color: activeType === pt.label ? '#F5A623' : '#fff',
                }}
              >
                <pt.Icon className="w-7 h-7" strokeWidth={1.5} />
                <span className="text-xs font-semibold tracking-wide">{pt.label}</span>
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="flex flex-col sm:flex-row items-stretch gap-0">
            {/* City */}
            <div
              className="flex items-center gap-2 flex-1 px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.08)', borderBottom: '2px solid rgba(255,255,255,0.3)' }}
            >
              <MapPin className="w-4 h-4 text-white/60 flex-shrink-0" />
              <div className="flex flex-col flex-1">
                <span className="text-white/50 text-[10px] uppercase tracking-widest">Choose a location</span>
                <select
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  className="bg-transparent text-white text-sm font-semibold outline-none appearance-none cursor-pointer"
                  style={{ color: city ? '#fff' : 'rgba(255,255,255,0.6)' }}
                >
                  <option value="" style={{ color: '#1A1A2E' }}>All Locations</option>
                  {CITIES.map(c => <option key={c} value={c} style={{ color: '#1A1A2E' }}>{c}</option>)}
                </select>
              </div>
            </div>

            {/* Type */}
            <div
              className="flex items-center gap-2 flex-1 px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.08)', borderBottom: '2px solid rgba(255,255,255,0.3)', borderLeft: '1px solid rgba(255,255,255,0.15)' }}
            >
              <Building2 className="w-4 h-4 text-white/60 flex-shrink-0" />
              <div className="flex flex-col flex-1">
                <span className="text-white/50 text-[10px] uppercase tracking-widest">Status</span>
                <select
                  value={propType}
                  onChange={e => setPropType(e.target.value)}
                  className="bg-transparent text-white text-sm font-semibold outline-none appearance-none cursor-pointer"
                  style={{ color: propType ? '#fff' : 'rgba(255,255,255,0.6)' }}
                >
                  <option value="" style={{ color: '#1A1A2E' }}>All Properties</option>
                  <option value="buy" style={{ color: '#1A1A2E' }}>For Sale</option>
                  <option value="rent" style={{ color: '#1A1A2E' }}>For Rent</option>
                  <option value="new" style={{ color: '#1A1A2E' }}>New Projects</option>
                </select>
              </div>
            </div>

            {/* Budget */}
            <div
              className="flex items-center gap-2 flex-1 px-4 py-3"
              style={{ background: 'rgba(255,255,255,0.08)', borderBottom: '2px solid rgba(255,255,255,0.3)', borderLeft: '1px solid rgba(255,255,255,0.15)' }}
            >
              <span className="text-white/60 text-sm flex-shrink-0">₹</span>
              <div className="flex flex-col flex-1">
                <span className="text-white/50 text-[10px] uppercase tracking-widest">Budget</span>
                <select
                  value={budget}
                  onChange={e => setBudget(e.target.value)}
                  className="bg-transparent text-white text-sm font-semibold outline-none appearance-none cursor-pointer"
                  style={{ color: budget ? '#fff' : 'rgba(255,255,255,0.6)' }}
                >
                  <option value="" style={{ color: '#1A1A2E' }}>Any Budget</option>
                  <option value="50" style={{ color: '#1A1A2E' }}>Under ₹50 Lakh</option>
                  <option value="100" style={{ color: '#1A1A2E' }}>₹50L – ₹1 Cr</option>
                  <option value="200" style={{ color: '#1A1A2E' }}>₹1 Cr – ₹2 Cr</option>
                  <option value="500" style={{ color: '#1A1A2E' }}>Above ₹2 Cr</option>
                </select>
              </div>
            </div>

            {/* Search btn */}
            <Link
              href="/properties"
              className="flex items-center justify-center gap-2 px-8 text-sm font-black tracking-widest text-black transition-all hover:opacity-90"
              style={{ background: '#F5A623', minHeight: 56, whiteSpace: 'nowrap' }}
            >
              <Search className="w-4 h-4" />
              SEARCH
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          3. BEST LISTINGS THIS WEEK
      ══════════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto">
          {/* Heading */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Best Listings This Week
            </h2>
            <p className="text-gray-400 text-sm max-w-md mx-auto">
              Hand-picked verified properties — from cosy 1BHKs to sprawling villas.
            </p>
          </div>

          {/* Grid: left wide card + right 2×2 grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Wide card (left) */}
            {LISTINGS.filter(l => l.wide).map(l => (
              <div
                key={l.id}
                className="relative overflow-hidden group cursor-pointer"
                style={{ height: 500, borderRadius: 4 }}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ backgroundImage: `url('${l.img}')` }}
                />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
                <BadgeTag label={l.badge} />
                <FavBtn id={l.id} saved={saved} toggle={toggleSave} />
                <div className="absolute bottom-0 left-0 right-0 p-5 flex items-end justify-between">
                  <div>
                    <p className="text-white font-bold text-lg leading-tight">{l.name}</p>
                    <p className="text-white/70 text-sm mt-0.5">{l.loc}</p>
                  </div>
                  <div className="px-3 py-1.5 text-sm font-black text-white" style={{ background: '#1A1A2E' }}>
                    {l.price}
                  </div>
                </div>
              </div>
            ))}

            {/* 2×2 right grid */}
            <div className="grid grid-cols-2 gap-4">
              {LISTINGS.filter(l => !l.wide).map(l => (
                <div
                  key={l.id}
                  className="relative overflow-hidden group cursor-pointer"
                  style={{ height: 240, borderRadius: 4 }}
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url('${l.img}')` }}
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, transparent 55%)' }} />
                  <BadgeTag label={l.badge} />
                  <FavBtn id={l.id} saved={saved} toggle={toggleSave} />
                  <div className="absolute bottom-0 left-0 right-0 p-3 flex items-end justify-between">
                    <div>
                      <p className="text-white font-bold text-sm leading-tight">{l.name}</p>
                      <p className="text-white/60 text-xs mt-0.5">{l.loc}</p>
                    </div>
                    <div className="px-2 py-1 text-xs font-black text-white flex-shrink-0 ml-2" style={{ background: '#1A1A2E' }}>
                      {l.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-10">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-black tracking-widest text-black transition-all hover:opacity-80"
              style={{ background: '#F5A623' }}
            >
              VIEW ALL LISTINGS <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          4. HOW IT WORKS
      ══════════════════════════════════════════════ */}
      <section className="py-20 px-6" style={{ background: '#F5F5F5' }}>
        <div className="max-w-[900px] mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black text-gray-900 mb-3">See How It Works</h2>
            <p className="text-gray-400 text-sm">
              From search to keys — the entire journey, powered by YesBroker.
            </p>
          </div>

          {/* 3 steps with dotted connector */}
          <div className="relative grid grid-cols-3 gap-8">
            {/* dotted line connector */}
            <div
              className="absolute top-10 left-[20%] right-[20%] h-0"
              style={{ borderTop: '2px dashed #ccc', zIndex: 0 }}
            />

            {HOW_STEPS.map(step => (
              <div key={step.n} className="flex flex-col items-center text-center relative z-10">
                {/* Number circle */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-black font-black text-sm mb-5"
                  style={{ background: '#F5A623' }}
                >
                  {step.n}
                </div>
                {/* Illustration */}
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center mb-6"
                  style={{ background: '#fff', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', fontSize: 52 }}
                >
                  {step.emoji}
                </div>
                <h3 className="font-black text-lg text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          5. BLUEPRINT CTA
      ══════════════════════════════════════════════ */}
      <section
        className="py-24 px-6 relative overflow-hidden"
        style={{ background: '#fff' }}
      >
        {/* Blueprint background watermark */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(26,26,46,1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(26,26,46,1) 1px, transparent 1px),
              linear-gradient(rgba(26,26,46,0.4) 1px, transparent 1px),
              linear-gradient(90deg, rgba(26,26,46,0.4) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px, 60px 60px, 12px 12px, 12px 12px',
          }}
        />
        {/* Rotated headline watermark text */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ opacity: 0.04 }}
        >
          <span className="text-[12rem] font-black text-gray-900 whitespace-nowrap rotate-[-8deg]">
            YESBROKER
          </span>
        </div>

        <div className="relative z-10 max-w-[700px] mx-auto text-center">
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Special Deals Every Day
          </h2>
          <p className="text-gray-400 text-sm mb-3 leading-relaxed">
            New listings go live every morning — verified, priced right, and ready to view.
            Sign up for daily deal alerts and never miss a property that fits your budget.
          </p>
          <p className="text-gray-500 text-sm mb-8 leading-relaxed">
            Over <strong>8.4 lakh properties</strong> across India's top 20 cities.
            Filter by locality, budget, amenities, RERA status and more.
          </p>
          <Link
            href="/properties"
            className="inline-flex items-center gap-2 px-10 py-4 text-sm font-black tracking-widest text-black transition-all hover:opacity-80"
            style={{ background: '#F5A623' }}
          >
            EXPLORE LISTINGS <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          6. TESTIMONIALS (AMBER BG)
      ══════════════════════════════════════════════ */}
      <section
        className="py-20 px-6 relative overflow-hidden"
        style={{ background: '#F5A623' }}
      >
        {/* Dot-pattern world map background */}
        <div className="absolute inset-0 opacity-20" aria-hidden>
          {[...Array(18)].map((_, row) => (
            <div key={row} className="flex gap-3 justify-center mb-3">
              {[...Array(40)].map((_, col) => (
                <div
                  key={col}
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: '#1A1A2E', opacity: Math.random() > 0.5 ? 1 : 0 }}
                />
              ))}
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-[900px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-black mb-3">What Our Users Say</h2>
            <p className="text-black/60 text-sm">
              Real stories from home buyers, sellers, and investors across India.
            </p>
          </div>

          {/* Testimonial pair */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/20 backdrop-blur-sm p-7" style={{ borderRadius: 2 }}>
                <div className="text-4xl mb-4">{t.logo}</div>
                <p className="text-black/80 text-sm leading-relaxed italic mb-5">{t.quote}</p>
                <div>
                  <p className="font-black text-black text-sm">{t.name}</p>
                  <p className="text-black/60 text-xs">{t.role}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Nav dots */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setTestimonial(t => Math.max(0, t - 1))}
              className="w-10 h-10 border-2 border-black/40 flex items-center justify-center transition-all hover:border-black"
            >
              <ChevronLeft className="w-5 h-5 text-black" />
            </button>
            <div className="flex gap-2">
              {[0, 1].map(i => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-full transition-all cursor-pointer"
                  style={{ background: i === testimonial ? '#1A1A2E' : 'rgba(26,26,46,0.3)' }}
                  onClick={() => setTestimonial(i)}
                />
              ))}
            </div>
            <button
              onClick={() => setTestimonial(t => Math.min(1, t + 1))}
              className="w-10 h-10 border-2 border-black/40 flex items-center justify-center transition-all hover:border-black"
            >
              <ChevronRight className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          7. SUGGEST CITY CTA BAR
      ══════════════════════════════════════════════ */}
      <section className="py-8 px-6 bg-white relative overflow-hidden border-b border-gray-100">
        {/* Dots left */}
        <div className="absolute left-0 top-0 bottom-0 w-32 opacity-10" style={{
          backgroundImage: 'radial-gradient(circle, #1A1A2E 1px, transparent 1px)',
          backgroundSize: '12px 12px'
        }} />
        <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-6">
          <p className="text-gray-700 font-bold text-lg">
            Don&apos;t see your city? Help us expand to more locations across India!
          </p>
          <button
            className="flex-shrink-0 px-8 py-3 text-xs font-black tracking-widest text-black transition-all hover:opacity-80"
            style={{ background: '#F5A623' }}
          >
            SUGGEST CITY
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          8. STATS BAR
      ══════════════════════════════════════════════ */}
      <section className="py-10 px-6 bg-white">
        <div className="max-w-[1100px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { val: '8.4L+',    lbl: 'Properties Listed'   },
            { val: '40+',      lbl: 'Ad Platforms'         },
            { val: '1.2L+',   lbl: 'Verified Brokers'     },
            { val: '₹2,400 Cr', lbl: 'Deals Closed'       },
          ].map(s => (
            <div key={s.lbl}>
              <p className="text-3xl font-black" style={{ color: '#F5A623' }}>{s.val}</p>
              <p className="text-gray-400 text-sm mt-1">{s.lbl}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          9. FOOTER
      ══════════════════════════════════════════════ */}
      <footer style={{ background: '#1A1A2E' }}>
        <div className="max-w-[1100px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Col 1: Logo + about */}
          <div>
            <div className="mb-5">
              <YesBrokerLogo size={32} theme="dark" />
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              India's most trusted real estate platform for home buyers, sellers, agents, and NRI investors. Built with transparency and technology.
            </p>
            <a href="#" className="text-sm font-semibold flex items-center gap-1" style={{ color: '#F5A623' }}>
              Read More <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Col 2: Contact */}
          <div>
            <h3 className="text-white font-black text-sm tracking-widest uppercase mb-6">Contact Us</h3>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#F5A623' }} />
                Plot 42, Bandra Kurla Complex, Mumbai – 400 051
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 flex-shrink-0" style={{ color: '#F5A623' }} />
                Call us FREE +91 (800) 990 8877
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 flex-shrink-0" style={{ color: '#F5A623' }} />
                hello@yesbroker.in
              </li>
            </ul>
            <a href="#" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold" style={{ color: '#F5A623' }}>
              Contact Us <ChevronRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Col 3: Newsletter */}
          <div>
            <h3 className="text-white font-black text-sm tracking-widest uppercase mb-6">Newsletter Subscribe</h3>
            <div className="flex border border-gray-600 mb-5">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-transparent px-4 py-3 text-sm text-white placeholder-gray-500 outline-none"
              />
              <button
                className="w-12 flex items-center justify-center transition-all hover:opacity-80"
                style={{ background: '#F5A623' }}
              >
                <Send className="w-4 h-4 text-black" />
              </button>
            </div>
            <button
              className="w-full py-3 text-xs font-black tracking-widest text-black transition-all hover:opacity-80 mb-6"
              style={{ background: '#F5A623' }}
            >
              SUBMIT
            </button>
            <p className="text-gray-500 text-xs mb-3">Don't forget to follow us on:</p>
            <div className="flex gap-3">
              {[Twitter, Facebook, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 border border-gray-600 flex items-center justify-center transition-all hover:border-yellow-400"
                >
                  <Icon className="w-3.5 h-3.5 text-gray-400" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Copyright bar */}
        <div
          className="border-t py-4 px-6 text-center text-xs text-gray-600"
          style={{ borderColor: '#2a2a3e' }}
        >
          © {new Date().getFullYear()} YesBroker Technologies Pvt. Ltd. · Made with ❤️ in India
        </div>
      </footer>
    </div>
  )
}

/* ─── Sub-components ─── */

function BadgeTag({ label }: { label: string }) {
  const color = label === 'Just Sold' ? '#555' : label === 'For Rent' ? '#2563EB' : '#1A1A2E'
  return (
    <div
      className="absolute top-3 left-3 z-10 px-2.5 py-1 text-xs font-bold text-white"
      style={{ background: color, borderRadius: 2 }}
    >
      {label}
    </div>
  )
}

function FavBtn({ id, saved, toggle }: { id: string; saved: Set<string>; toggle: (id: string) => void }) {
  const isSaved = saved.has(id)
  return (
    <button
      onClick={() => toggle(id)}
      className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all"
      style={{ background: '#F5A623' }}
    >
      <Zap className="w-4 h-4" style={{ color: isSaved ? '#fff' : '#1A1A2E', fill: isSaved ? '#fff' : 'none' }} />
    </button>
  )
}
