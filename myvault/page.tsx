'use client'

import Link from 'next/link'
import { ArrowRight, Shield, TrendingUp, Building2, Scale, Star, CheckCircle, Zap, Lock, Eye, RefreshCw } from 'lucide-react'

const PLATFORMS = [
  {
    id: 'yesbroker',
    name: 'YesBroker',
    tag: 'Real Estate',
    icon: Building2,
    color: '#F5A623',
    bg: 'rgba(245,166,35,0.08)',
    border: 'rgba(245,166,35,0.25)',
    desc: 'All your properties, listings, leads & broker revenue — synced in real-time.',
    value: '₹6.8 Cr',
    label: 'Real Estate Value',
    features: ['Property portfolio tracking', 'Rental income analytics', 'Lead & deal insights', 'Market valuations'],
  },
  {
    id: 'theequinox',
    name: 'TheEquinox.ai',
    tag: 'Investments',
    icon: TrendingUp,
    color: '#C9A84C',
    bg: 'rgba(201,168,76,0.08)',
    border: 'rgba(201,168,76,0.25)',
    desc: 'Auto-trading portfolio, P&L, holdings and returns — unified in your vault.',
    value: '₹35.4 L',
    label: 'Portfolio Value',
    features: ['Live portfolio P&L', 'Sector allocation', 'Auto-trade rule status', 'Performance vs NIFTY'],
  },
  {
    id: 'mywills',
    name: 'MyWills',
    tag: 'Estate & Legal',
    icon: Scale,
    color: '#4A6FA5',
    bg: 'rgba(74,111,165,0.08)',
    border: 'rgba(74,111,165,0.25)',
    desc: 'Will, estate assets, beneficiaries & legalopinion.co.in status — all protected.',
    value: '₹4.35 Cr',
    label: 'Estate Value',
    features: ['Will coverage status', 'Asset-to-heir mapping', 'Legal opinion status', 'Beneficiary management'],
  },
]

const STATS = [
  { value: '₹12.02 Cr', label: 'Avg Net Worth Tracked', sub: 'Per premium user' },
  { value: '3',          label: 'Platforms Connected',   sub: 'YesBroker · Equinox · MyWills' },
  { value: '99.8%',      label: 'Sync Reliability',       sub: 'Real-time data accuracy' },
  { value: '1.4L+',      label: 'Wealth Profiles',        sub: 'Trusted across India' },
]

const PLANS = [
  { name: 'Personal',     price: 0,    features: ['Connect 1 platform', 'Basic net worth view', 'Monthly sync', 'Standard security'] },
  { name: 'Wealth',       price: 999,  features: ['Connect all 3 platforms', 'Real-time sync', 'Net worth analytics', 'KnowledgeHub.ai', 'Priority support'], hot: true },
  { name: 'Family Office',price: 4999, features: ['Everything in Wealth', 'Multi-member access', 'White-label reports', 'Dedicated advisor', 'API access', 'Custom integrations'] },
]

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0A', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Navbar */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(10,10,10,0.96)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(201,168,76,0.15)', padding: '0 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(201,168,76,0.4)' }}>
            <Shield size={22} color="#0A0A0A" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 22, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>MyVault</div>
            <div style={{ fontSize: 10, color: 'rgba(201,168,76,0.5)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Golden Black Luxury Wealth Hub</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 36, fontSize: 14, fontWeight: 500 }}>
          {['Platforms','Features','Pricing','Security'].map(n => (
            <a key={n} href={`#${n.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#C9A84C')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>{n}</a>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/dashboard" style={{ padding: '10px 22px', border: '1px solid rgba(201,168,76,0.4)', borderRadius: 12, color: '#C9A84C', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>Sign In</Link>
          <Link href="/dashboard" style={{ padding: '10px 24px', background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', borderRadius: 12, color: '#0A0A0A', fontSize: 14, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 16px rgba(201,168,76,0.4)' }}>Open Vault →</Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', padding: '120px 40px 80px', overflow: 'hidden' }}>
        {/* Background effects */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(201,168,76,0.08) 0%, transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', left: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '30%', right: '10%', width: 400, height: 400, background: 'radial-gradient(circle, rgba(201,168,76,0.05) 0%, transparent 70%)', pointerEvents: 'none' }} />

        {/* Gold horizontal line */}
        <div style={{ position: 'absolute', top: 0, left: '20%', right: '20%', height: 1, background: 'linear-gradient(90deg, transparent, #C9A84C, transparent)' }} />

        <div style={{ position: 'relative', maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 100, padding: '10px 24px', marginBottom: 40, fontSize: 13, color: '#C9A84C', fontWeight: 600, letterSpacing: '0.05em' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
            LIVE · All 3 platforms syncing in real-time
          </div>

          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(52px, 7vw, 88px)', fontWeight: 700, lineHeight: 1.05, marginBottom: 28, letterSpacing: '-0.02em' }}>
            Your Complete<br />
            <span style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #E8C96A 40%, #C9A84C 100%)', backgroundSize: '200%', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Wealth Universe,
            </span><br />
            Unified.
          </h1>

          <p style={{ fontSize: 20, color: 'rgba(255,255,255,0.5)', maxWidth: 560, margin: '0 auto 48px', lineHeight: 1.75 }}>
            Connect YesBroker, TheEquinox.ai, and MyWills into one secure vault. See your complete net worth — real estate, investments, and estate assets — all in one place.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '20px 44px', background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', borderRadius: 16, color: '#0A0A0A', fontSize: 17, fontWeight: 800, textDecoration: 'none', boxShadow: '0 8px 40px rgba(201,168,76,0.45)', letterSpacing: '-0.01em' }}>
              Enter Your Vault <ArrowRight size={20} />
            </Link>
            <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '20px 40px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, color: '#fff', fontSize: 17, fontWeight: 600, textDecoration: 'none' }}>
              Watch How It Works
            </Link>
          </div>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.25)' }}>✅ Bank-grade 256-bit encryption &nbsp;·&nbsp; ✅ Zero data selling &nbsp;·&nbsp; ✅ Cancel anytime</p>
        </div>

        {/* Net Worth Display */}
        <div style={{ maxWidth: 700, margin: '72px auto 0', background: 'linear-gradient(135deg, rgba(20,20,20,0.9), rgba(26,26,26,0.9))', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 28, overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.7)' }}>
          {/* Header bar */}
          <div style={{ background: 'rgba(201,168,76,0.06)', borderBottom: '1px solid rgba(201,168,76,0.1)', padding: '16px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Shield size={16} color="#C9A84C" />
              <span style={{ fontSize: 13, color: '#C9A84C', fontWeight: 600 }}>MyVault · Wealth Overview</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#22c55e' }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 6px #22c55e' }} />
              All systems live
            </div>
          </div>

          {/* Net worth */}
          <div style={{ padding: '36px 28px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>Total Net Worth</div>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 64, fontWeight: 700, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, marginBottom: 8 }}>₹12.02 Cr</div>
            <div style={{ fontSize: 14, color: '#22c55e', fontWeight: 600 }}>↑ ₹1.2 Cr this year (+11.1%)</div>
          </div>

          {/* 3 platform breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 0 }}>
            {[
              { name: 'Real Estate', val: '₹6.8 Cr', pct: '56.6%', color: '#F5A623', icon: Building2, src: 'YesBroker' },
              { name: 'Investments', val: '₹35.4 L',  pct: '29.5%', color: '#C9A84C', icon: TrendingUp, src: 'TheEquinox.ai' },
              { name: 'Estate Assets',val: '₹4.35 Cr',pct: '36.2%', color: '#4A6FA5', icon: Scale, src: 'MyWills' },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={item.name} style={{ padding: '24px 20px', borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.05)' : 'none', textAlign: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 12 }}>
                    <Icon size={14} color={item.color} />
                    <span style={{ fontSize: 11, color: item.color, fontWeight: 600, letterSpacing: '0.05em' }}>{item.src}</span>
                  </div>
                  <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: '#fff', marginBottom: 4 }}>{item.val}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{item.name}</div>
                  <div style={{ marginTop: 12, height: 3, borderRadius: 100, background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: item.pct, background: item.color, borderRadius: 100 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 40px', background: '#0A0A0A' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
          {STATS.map(s => (
            <div key={s.label} style={{ background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: 20, padding: '28px 20px', textAlign: 'center' }}>
              <div style={{ fontFamily: 'Georgia, serif', fontSize: 34, fontWeight: 700, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', marginBottom: 6 }}>{s.value}</div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', marginBottom: 4 }}>{s.label}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3 Platform Sections */}
      <section id="platforms" style={{ padding: '80px 40px', background: 'linear-gradient(180deg,#0A0A0A,#0F0F0F)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 44, fontWeight: 700, marginBottom: 12 }}>
              Three Platforms.<br /><span style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>One Golden Vault.</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 17, maxWidth: 500, margin: '0 auto' }}>MyVault securely syncs with each platform so your wealth is always complete and current.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {PLATFORMS.map((p, i) => {
              const Icon = p.icon
              return (
                <div key={p.id} style={{ background: '#111', border: `1px solid ${p.border}`, borderRadius: 28, overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 360px' }}>
                  <div style={{ padding: '44px 48px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                      <div style={{ width: 48, height: 48, background: p.bg, border: `1px solid ${p.border}`, borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon size={22} color={p.color} />
                      </div>
                      <div>
                        <div style={{ fontFamily: 'Georgia, serif', fontSize: 22, fontWeight: 700, color: '#fff' }}>{p.name}</div>
                        <div style={{ fontSize: 12, color: p.color, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{p.tag}</div>
                      </div>
                      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 100, padding: '6px 14px', fontSize: 12, color: '#22c55e', fontWeight: 600 }}>
                        <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                        Connected
                      </div>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7, marginBottom: 28, maxWidth: 400 }}>{p.desc}</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      {p.features.map(f => (
                        <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
                          <CheckCircle size={14} color={p.color} />
                          <span style={{ color: 'rgba(255,255,255,0.6)' }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Right panel - value display */}
                  <div style={{ background: p.bg, borderLeft: `1px solid ${p.border}`, padding: '44px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>{p.label}</div>
                    <div style={{ fontFamily: 'Georgia, serif', fontSize: 48, fontWeight: 700, color: p.color, marginBottom: 16, textShadow: `0 0 30px ${p.color}40` }}>{p.value}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 100, padding: '6px 14px', fontSize: 12, color: '#22c55e', fontWeight: 600 }}>
                      <RefreshCw size={12} />
                      Synced just now
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* KnowledgeHub.ai Banner */}
      <section style={{ padding: '60px 40px', background: '#0A0A0A' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', background: 'linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.03))', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 28, padding: '48px', display: 'flex', alignItems: 'center', gap: 48 }}>
          <div style={{ width: 80, height: 80, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', borderRadius: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 32px rgba(201,168,76,0.4)', flexShrink: 0 }}>
            <Zap size={36} color="#0A0A0A" strokeWidth={2.5} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: '#C9A84C', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 10 }}>Master Analytics Partner</div>
            <h3 style={{ fontFamily: 'Georgia, serif', fontSize: 28, fontWeight: 700, marginBottom: 12 }}>Powered by KnowledgeHub.ai</h3>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 15, lineHeight: 1.7, maxWidth: 480 }}>
              MyVault anonymously contributes your aggregated wealth data to KnowledgeHub.ai — giving you access to India-wide wealth benchmarks, regional insights, and investment trend intelligence.
            </p>
          </div>
          <div style={{ flexShrink: 0, textAlign: 'center' }}>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 700, color: '#C9A84C', marginBottom: 4 }}>1.4L+</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>Wealth profiles<br />in the network</div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '80px 40px', background: '#0F0F0F' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 44, fontWeight: 700, marginBottom: 12 }}>
              Choose Your <span style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Vault Plan</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 17 }}>Start free. Unlock the full vault as your wealth grows.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, alignItems: 'center' }}>
            {PLANS.map((plan) => (
              <div key={plan.name} style={{
                background: plan.hot ? 'linear-gradient(135deg,#1A1400,#2A2000)' : '#111',
                border: plan.hot ? '2px solid rgba(201,168,76,0.6)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: 28, padding: plan.hot ? '44px 32px' : '36px 28px',
                transform: plan.hot ? 'scale(1.04)' : 'scale(1)',
                boxShadow: plan.hot ? '0 20px 60px rgba(201,168,76,0.2)' : 'none',
              }}>
                {plan.hot && <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', color: '#0A0A0A', fontWeight: 800, fontSize: 11, padding: '6px 14px', borderRadius: 100, marginBottom: 20, letterSpacing: '0.05em' }}>⭐ MOST POPULAR</div>}
                <div style={{ fontFamily: 'Georgia, serif', fontSize: 24, fontWeight: 700, color: plan.hot ? '#C9A84C' : '#fff', marginBottom: 8 }}>{plan.name}</div>
                <div style={{ marginBottom: 28 }}>
                  <span style={{ fontFamily: 'Georgia, serif', fontSize: 44, fontWeight: 700, color: plan.hot ? '#C9A84C' : '#fff' }}>
                    {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString()}`}
                  </span>
                  {plan.price > 0 && <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: 14 }}>/month</span>}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 32 }}>
                  {plan.features.map(f => (
                    <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14 }}>
                      <CheckCircle size={15} color={plan.hot ? '#C9A84C' : 'rgba(255,255,255,0.4)'} />
                      <span style={{ color: plan.hot ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.5)' }}>{f}</span>
                    </div>
                  ))}
                </div>
                <Link href="/dashboard" style={{
                  display: 'block', textAlign: 'center', padding: '14px',
                  background: plan.hot ? 'linear-gradient(135deg,#C9A84C,#E8C96A)' : 'rgba(255,255,255,0.05)',
                  border: plan.hot ? 'none' : '1px solid rgba(255,255,255,0.1)',
                  color: plan.hot ? '#0A0A0A' : '#fff',
                  borderRadius: 14, fontWeight: 700, fontSize: 15, textDecoration: 'none',
                  boxShadow: plan.hot ? '0 8px 24px rgba(201,168,76,0.35)' : 'none',
                }}>
                  {plan.price === 0 ? 'Open Free Vault' : 'Get Started'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security */}
      <section id="security" style={{ padding: '80px 40px', background: '#0A0A0A' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 44, fontWeight: 700, marginBottom: 12 }}>
            Your Wealth. <span style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Fort Knox Secure.</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 17, marginBottom: 52 }}>We treat your financial data with the highest standards of privacy and security.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
            {[
              { icon: Lock,  title: '256-bit AES',     desc: 'Bank-grade encryption for all data at rest and in transit' },
              { icon: Eye,   title: 'Zero Data Selling',desc: 'We never sell or share your personal financial data' },
              { icon: Shield,title: 'SOC 2 Compliant', desc: 'Independently audited security controls and processes' },
              { icon: Zap,   title: 'Real-time Alerts', desc: 'Instant notifications for any sync or access activity' },
            ].map(item => {
              const Icon = item.icon
              return (
                <div key={item.title} style={{ background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: 20, padding: '28px 20px', textAlign: 'center' }}>
                  <div style={{ width: 48, height: 48, background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Icon size={22} color="#C9A84C" />
                  </div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{item.title}</div>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>{item.desc}</div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '80px 40px', background: 'linear-gradient(180deg,#0F0F0F,#0A0A0A)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center', background: 'linear-gradient(135deg,rgba(201,168,76,0.07),rgba(201,168,76,0.02))', border: '1px solid rgba(201,168,76,0.18)', borderRadius: 32, padding: '72px 48px' }}>
          <div style={{ width: 72, height: 72, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px', boxShadow: '0 8px 32px rgba(201,168,76,0.4)' }}>
            <Shield size={32} color="#0A0A0A" strokeWidth={2} />
          </div>
          <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 40, fontWeight: 700, marginBottom: 16 }}>
            Open Your <span style={{ background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Golden Vault</span> Today
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 17, marginBottom: 40, lineHeight: 1.7 }}>
            Join 1.4 lakh+ Indians who know their true net worth across every asset class.
          </p>
          <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: 12, padding: '20px 52px', background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', borderRadius: 16, color: '#0A0A0A', fontSize: 18, fontWeight: 800, textDecoration: 'none', boxShadow: '0 8px 40px rgba(201,168,76,0.5)' }}>
            Enter MyVault Free <ArrowRight size={22} />
          </Link>
          <p style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.2)' }}>No credit card · 256-bit secure · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid rgba(201,168,76,0.1)', padding: '32px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#050505' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Shield size={18} color="#C9A84C" />
          <span style={{ fontFamily: 'Georgia, serif', fontWeight: 700, fontSize: 16, background: 'linear-gradient(135deg,#C9A84C,#E8C96A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>MyVault</span>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 13 }}>© 2024 MyVault · Golden Black Luxury Wealth Hub · Made in India 🇮🇳</p>
        <div style={{ display: 'flex', gap: 24, fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
          {['Privacy','Terms','Security','Support'].map(l => <a key={l} href="#" style={{ color: 'inherit', textDecoration: 'none' }}>{l}</a>)}
        </div>
      </footer>

    </div>
  )
}
