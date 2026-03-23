'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  TrendingUp, Shield, Zap, BarChart2,
  CheckCircle, ArrowRight, Star, ChevronRight,
  Activity, Lock, Bell, Globe
} from 'lucide-react'

const FEATURES = [
  { icon: Zap,       title: 'AI Auto-Trading',      desc: 'Set SIP, Stop-Loss, Profit-Booking rules once. Our engine executes trades 24/7 while you sleep.',     stat: '99.9% uptime' },
  { icon: BarChart2, title: 'Portfolio Analytics',   desc: 'Real-time P&L, sector allocation, risk metrics, and performance benchmarking vs NIFTY 50.',            stat: 'Live NSE/BSE data' },
  { icon: Shield,    title: 'Risk Management',       desc: 'Automatic stop-loss triggers, sector exposure caps, and AI-driven diversification scoring.',             stat: 'Capital protected' },
  { icon: Globe,     title: 'MyVault Sync',          desc: 'Portfolio syncs with MyVault for complete net worth view alongside real estate and estate assets.',      stat: 'Real-time sync' },
]

const STATS = [
  { value: '18.4%',    label: 'Avg Annual Returns',  sub: 'vs 12.3% NIFTY50' },
  { value: '₹840 Cr',  label: 'AUM Managed',         sub: 'Growing 40% MoM' },
  { value: '2.1L+',    label: 'Active Investors',     sub: 'Across India' },
  { value: '42ms',     label: 'Avg Execution Speed',  sub: 'Lightning fast' },
]

const PLANS = [
  { name: 'Starter',   price: 0,    period: '',       color: 'from-slate-800 to-slate-900',   border: 'border-white/10',  features: ['1 auto-trading rule','Basic portfolio tracker','Manual trades','Monthly reports','Community support'] },
  { name: 'Wealth',    price: 1999, period: '/month', color: 'from-amber-600 to-yellow-500',  border: 'border-yellow-500',features: ['10 auto-trading rules','Live analytics dashboard','WhatsApp alerts','MyVault sync','Priority support','Tax reports'], hot: true },
  { name: 'Elite',     price: 4999, period: '/month', color: 'from-violet-800 to-purple-900', border: 'border-violet-500',features: ['Unlimited rules','AI stock picks','Options trading','Dedicated advisor','KnowledgeHub.ai','API access'] },
]

const TESTIMONIALS = [
  { name: 'Ankit Sharma',   city: 'Mumbai',    avatar: 'AS', rating: 5, returns: '+22.4%', text: 'My SIP auto-rule has been running 8 months. Up 22% with zero manual effort. Best decision I ever made.' },
  { name: 'Deepa Nair',     city: 'Bangalore', avatar: 'DN', rating: 5, returns: '+31.2%', text: 'The stop-loss rules saved my portfolio during the correction. Nothing else comes close for Indian markets.' },
  { name: 'Vikram Mehta',   city: 'Delhi',     avatar: 'VM', rating: 5, returns: '+18.7%', text: 'MyVault sync is genius — stocks + real estate + will assets in one net worth dashboard. Incredible product.' },
]

const TICKERS = [
  { sym: 'RELIANCE', price: '₹2,847', chg: '+1.2%', up: true },
  { sym: 'TCS',      price: '₹3,921', chg: '+0.8%', up: true },
  { sym: 'INFY',     price: '₹1,456', chg: '-0.3%', up: false },
  { sym: 'HDFC',     price: '₹1,672', chg: '+2.1%', up: true },
  { sym: 'ICICI',    price: '₹1,089', chg: '+1.5%', up: true },
  { sym: 'WIPRO',    price: '₹456',   chg: '-0.5%', up: false },
  { sym: 'BAJFIN',   price: '₹6,834', chg: '+3.2%', up: true },
  { sym: 'MARUTI',   price: '₹11,243',chg: '+0.9%', up: true },
]

export default function LandingPage() {
  const [tickerPos, setTickerPos] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setTickerPos(p => p - 1), 30)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: '#0A0A1A', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Live Ticker */}
      <div style={{ background: '#0F0820', borderBottom: '1px solid rgba(201,168,76,0.3)', overflow: 'hidden', padding: '8px 0' }}>
        <div style={{ display: 'flex', gap: '48px', whiteSpace: 'nowrap', transform: `translateX(${tickerPos % 800}px)`, transition: 'none' }}>
          {[...TICKERS, ...TICKERS, ...TICKERS].map((t, i) => (
            <span key={i} style={{ fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#C9A84C', fontWeight: 700 }}>{t.sym}</span>
              <span style={{ color: '#fff' }}>{t.price}</span>
              <span style={{ color: t.up ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{t.chg}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,26,0.95)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '16px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(201,168,76,0.4)' }}>
            <TrendingUp size={22} color="#0A0A1A" />
          </div>
          <div>
            <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontWeight: 800, fontSize: 20, color: '#C9A84C', letterSpacing: '0.05em', lineHeight: 1 }}>THE EQUINOX</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>.AI — AUTO TRADING</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '32px', fontSize: 14, fontWeight: 500 }}>
          {['Features','Pricing','Reviews','Markets'].map(n => (
            <a key={n} href={`#${n.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.6)')}>{n}</a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/dashboard" style={{ padding: '10px 20px', border: '1px solid rgba(201,168,76,0.5)', borderRadius: 12, color: '#C9A84C', fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s' }}>
            Login
          </Link>
          <Link href="/dashboard" style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', borderRadius: 12, color: '#0A0A1A', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(201,168,76,0.4)' }}>
            Start Investing →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', padding: '100px 32px 80px', textAlign: 'center', overflow: 'hidden' }}>
        {/* Glow background */}
        <div style={{ position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)', width: 800, height: 400, background: 'radial-gradient(ellipse, rgba(201,168,76,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '20%', width: 300, height: 300, background: 'radial-gradient(ellipse, rgba(109,40,217,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', right: '20%', width: 300, height: 300, background: 'radial-gradient(ellipse, rgba(109,40,217,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', maxWidth: 800, margin: '0 auto' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 100, padding: '8px 20px', marginBottom: 32, fontSize: 13, color: '#C9A84C', fontWeight: 600 }}>
            <Star size={14} fill="#C9A84C" />
            India&apos;s #1 Royal Luxe Auto-Trading Platform
          </div>

          <h1 style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'clamp(48px, 8vw, 84px)', fontWeight: 900, lineHeight: 1.05, marginBottom: 24 }}>
            Invest Smarter.<br />
            <span style={{ background: 'linear-gradient(135deg, #C9A84C, #E8C96A, #C9A84C)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Grow Faster.
            </span>
          </h1>

          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.55)', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.7 }}>
            Set your rules once. Let TheEquinox.ai handle the rest — auto-trading, smart rebalancing, and real-time portfolio analytics built for Indian investors.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 40px', background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', borderRadius: 16, color: '#0A0A1A', fontSize: 17, fontWeight: 800, textDecoration: 'none', boxShadow: '0 8px 40px rgba(201,168,76,0.5)', letterSpacing: '-0.01em' }}>
              Start Free — No Card Needed <ArrowRight size={20} />
            </Link>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '18px 36px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 16, color: '#fff', fontSize: 17, fontWeight: 600, textDecoration: 'none' }}>
              Watch Demo ▶
            </Link>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>✅ 14-day free trial &nbsp;·&nbsp; ✅ No setup fees &nbsp;·&nbsp; ✅ Cancel anytime</p>
        </div>

        {/* Stats row */}
        <div style={{ position: 'relative', maxWidth: 900, margin: '72px auto 0', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: 'linear-gradient(135deg, rgba(30,16,64,0.8), rgba(45,27,105,0.6))', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 20, padding: '28px 20px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
              <div style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 36, fontWeight: 800, color: '#C9A84C', marginBottom: 4, textShadow: '0 0 30px rgba(201,168,76,0.4)' }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Dashboard Preview */}
      <section style={{ padding: '60px 32px', background: 'linear-gradient(180deg, #0A0A1A 0%, #0F0820 100%)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: 42, fontWeight: 800, marginBottom: 12 }}>
              Your <span style={{ color: '#C9A84C' }}>Wealth Command Center</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 17 }}>Everything you need to grow and protect your wealth</p>
          </div>

          {/* Fake dashboard mockup */}
          <div style={{ background: '#0F0820', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 24, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.6)' }}>
            {/* Window bar */}
            <div style={{ background: '#0A0A14', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ff5f57' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#febc2e' }} />
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#28c840' }} />
              <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: 8, height: 28, marginLeft: 12, display: 'flex', alignItems: 'center', paddingLeft: 12 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>theequinox.ai/dashboard</span>
              </div>
            </div>

            {/* Dashboard content */}
            <div style={{ padding: '28px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
              {[
                { label: 'Portfolio Value', val: '₹35.4L', chg: '+₹42K today', up: true },
                { label: 'Total Returns', val: '+16.7%',  chg: 'vs 12.3% NIFTY', up: true },
                { label: 'Active Rules',   val: '5',      chg: 'All running', up: true },
                { label: "Today's P&L",   val: '+₹8,240', chg: '+2.3% today',  up: true },
              ].map(card => (
                <div key={card.label} style={{ background: 'linear-gradient(135deg,#1E1040,#2D1B69)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: 16, padding: '20px' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{card.label}</div>
                  <div style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: 28, fontWeight: 800, color: '#C9A84C', marginBottom: 4 }}>{card.val}</div>
                  <div style={{ fontSize: 12, color: card.up ? '#22c55e' : '#ef4444', fontWeight: 600 }}>{card.chg}</div>
                </div>
              ))}
            </div>

            {/* Chart placeholder */}
            <div style={{ margin: '0 28px 28px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 16, padding: '24px', height: 160, display: 'flex', alignItems: 'flex-end', gap: 6 }}>
              {[40,65,50,80,70,90,75,95,85,100,88,110].map((h,i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 11 ? 'linear-gradient(180deg,#C9A84C,#E8C96A)' : 'rgba(201,168,76,0.25)', borderRadius: '4px 4px 0 0', transition: 'all 0.3s' }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" style={{ padding: '80px 32px', background: '#0A0A1A' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: 42, fontWeight: 800, marginBottom: 12 }}>
              Built for <span style={{ color: '#C9A84C' }}>Serious Investors</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 17, maxWidth: 500, margin: '0 auto' }}>
              Institutional-grade tools, now available to every Indian investor
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 24 }}>
            {FEATURES.map(({ icon: Icon, title, desc, stat }) => (
              <div key={title} style={{ background: 'linear-gradient(135deg,#1E1040,#2D1B69)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 24, padding: 32, transition: 'all 0.3s', cursor: 'default' }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.45)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.12)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}>
                <div style={{ width: 52, height: 52, background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
                  <Icon size={24} color="#C9A84C" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <h3 style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: 22, fontWeight: 700 }}>{title}</h3>
                  <span style={{ fontSize: 11, background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 100, padding: '4px 10px', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 12 }}>{stat}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '80px 32px', background: 'linear-gradient(180deg,#0F0820,#0A0A1A)' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: 42, fontWeight: 800, marginBottom: 12 }}>Simple <span style={{ color: '#C9A84C' }}>Pricing</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 17 }}>Start free. Upgrade when you&apos;re ready to grow.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, alignItems: 'center' }}>
            {PLANS.map((plan, i) => (
              <div key={plan.name} style={{
                background: plan.hot ? 'linear-gradient(135deg,#C9A84C,#E8C96A)' : 'linear-gradient(135deg,#1E1040,#2D1B69)',
                border: `2px solid ${plan.hot ? '#C9A84C' : 'rgba(201,168,76,0.15)'}`,
                borderRadius: 28, padding: plan.hot ? '44px 32px' : '36px 28px',
                transform: plan.hot ? 'scale(1.05)' : 'scale(1)',
                boxShadow: plan.hot ? '0 24px 60px rgba(201,168,76,0.4)' : 'none',
              }}>
                {plan.hot && <div style={{ background: 'rgba(0,0,0,0.15)', color: '#0A0A1A', fontWeight: 800, fontSize: 12, padding: '6px 14px', borderRadius: 100, display: 'inline-block', marginBottom: 16, letterSpacing: '0.05em' }}>⭐ MOST POPULAR</div>}
                <div style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: 26, fontWeight: 800, color: plan.hot ? '#0A0A1A' : '#fff', marginBottom: 8 }}>{plan.name}</div>
                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: 48, fontWeight: 900, color: plan.hot ? '#0A0A1A' : '#C9A84C' }}>
                    {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString()}`}
                  </span>
                  {plan.period && <span style={{ color: plan.hot ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.4)', fontSize: 15 }}>{plan.period}</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                      <CheckCircle size={16} color={plan.hot ? '#0A0A1A' : '#C9A84C'} />
                      <span style={{ color: plan.hot ? 'rgba(0,0,0,0.8)' : 'rgba(255,255,255,0.7)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard" style={{
                  display: 'block', textAlign: 'center', padding: '14px',
                  background: plan.hot ? '#0A0A1A' : 'linear-gradient(135deg,#C9A84C,#E8C96A)',
                  color: plan.hot ? '#C9A84C' : '#0A0A1A',
                  borderRadius: 14, fontWeight: 800, fontSize: 15, textDecoration: 'none',
                }}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" style={{ padding: '80px 32px', background: '#0A0A1A' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          <h2 style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: 42, fontWeight: 800, textAlign: 'center', marginBottom: 56 }}>
            Investors <span style={{ color: '#C9A84C' }}>Love Us</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name} style={{ background: 'linear-gradient(135deg,#1E1040,#2D1B69)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 24, padding: 28 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                  {[...Array(t.rating)].map((_,i) => <Star key={i} size={16} fill="#C9A84C" color="#C9A84C" />)}
                </div>
                <div style={{ display: 'inline-block', background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 100, padding: '4px 12px', fontSize: 13, fontWeight: 700, marginBottom: 16 }}>
                  {t.returns} returns
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, lineHeight: 1.7, marginBottom: 24 }}>
                  &ldquo;{t.text}&rdquo;
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#0A0A1A', fontSize: 14 }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12 }}>{t.city}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 32px', background: 'linear-gradient(135deg,#0F0820,#1A0533)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', background: 'linear-gradient(135deg,rgba(30,16,64,0.8),rgba(45,27,105,0.6))', border: '1px solid rgba(201,168,76,0.25)', borderRadius: 32, padding: '64px 48px', backdropFilter: 'blur(20px)' }}>
          <h2 style={{ fontFamily: '"Playfair Display",Georgia,serif', fontSize: 42, fontWeight: 800, marginBottom: 16 }}>
            Ready to <span style={{ color: '#C9A84C' }}>Grow Your Wealth?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 17, marginBottom: 36 }}>
            Join 2.1 lakh+ Indian investors automating their portfolios on TheEquinox.ai
          </p>
          <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '20px 48px', background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', borderRadius: 16, color: '#0A0A1A', fontSize: 18, fontWeight: 800, textDecoration: 'none', boxShadow: '0 8px 40px rgba(201,168,76,0.5)' }}>
            Start Investing Free <ArrowRight size={22} />
          </Link>
          <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>No credit card · 14-day trial · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#050510' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <TrendingUp size={18} color="#C9A84C" />
          <span style={{ fontFamily: '"Playfair Display",Georgia,serif', color: '#C9A84C', fontWeight: 700, letterSpacing: '0.05em' }}>THE EQUINOX.AI</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>© 2024 TheEquinox.ai · Auto Trading · Made in India 🇮🇳</p>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          {['Privacy','Terms','Support'].map(l => <a key={l} href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{l}</a>)}
        </div>
      </footer>

    </div>
  )
}
