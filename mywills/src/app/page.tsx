'use client'

import Link from 'next/link'
import { Scale, Shield, Users, FileText, CheckCircle, ArrowRight, Star, Building2, Coins } from 'lucide-react'

const FEATURES = [
  {
    icon: FileText,
    title: 'Will Builder',
    desc: 'Create court-admissible wills compliant with the Indian Succession Act. Reviewed by lawyers on legalopinion.co.in.',
  },
  {
    icon: Building2,
    title: 'Asset Registry',
    desc: 'Track all your assets — properties, investments, jewelry, vehicles — with full beneficiary allocation.',
  },
  {
    icon: Users,
    title: 'Family Tree & Heirs',
    desc: 'Define Class I and Class II legal heirs as per Indian law. Assign share percentages to each beneficiary.',
  },
  {
    icon: Shield,
    title: 'MyVault Sync',
    desc: 'Estate data syncs with MyVault for a complete picture of your net worth alongside real estate and investments.',
  },
]

const STATS = [
  { value: '3.2L+', label: 'Wills Created' },
  { value: '₹18,000Cr', label: 'Estate Value Managed' },
  { value: '98%', label: 'Court Admissibility' },
  { value: '500+', label: 'Empanelled Lawyers' },
]

const PLANS = [
  {
    name: 'Basic',
    price: 0,
    features: ['1 Will document', 'Up to 3 assets', 'Basic family tree', 'PDF download'],
    highlighted: false,
  },
  {
    name: 'Premium',
    price: 2999,
    features: ['Unlimited will versions', 'Unlimited assets', 'Full family tree', 'Legal review by legalopinion.co.in', 'MyVault sync', 'Document storage'],
    highlighted: true,
  },
  {
    name: 'Enterprise',
    price: 9999,
    features: ['Everything in Premium', 'Dedicated legal advisor', 'Probate assistance', 'Family office support', 'API access', 'KnowledgeHub.ai'],
    highlighted: false,
  },
]

const TESTIMONIALS = [
  { name: 'Ramesh Agarwal', city: 'Mumbai', rating: 5, text: 'Finally a platform that makes will-making easy. The legal review from legalopinion.co.in gave me full confidence.' },
  { name: 'Sunita Patel', city: 'Pune', rating: 5, text: 'I could define exactly who gets what percentage of each asset. No ambiguity, no family disputes later.' },
  { name: 'Mohan Krishnan', city: 'Chennai', rating: 5, text: 'MyVault sync is amazing — my total estate value now shows alongside my stock portfolio. Complete picture.' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-legal-cream">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-legal-primary rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-legal-gold" />
            </div>
            <div>
              <h1 className="font-bold font-display text-xl text-legal-primary leading-none">My Wills</h1>
              <p className="text-legal-primary/50 text-xs">Powered by legalopinion.co.in</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-legal-primary/60">
            <a href="#features" className="hover:text-legal-primary transition-colors">Features</a>
            <a href="#pricing" className="hover:text-legal-primary transition-colors">Pricing</a>
            <a href="#testimonials" className="hover:text-legal-primary transition-colors">Reviews</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard"
              className="px-5 py-2.5 border-2 border-legal-primary text-legal-primary rounded-xl text-sm font-semibold hover:bg-legal-primary/5 transition-all">
              Login
            </Link>
            <Link href="/dashboard"
              className="px-5 py-2.5 bg-legal-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all">
              Create Your Will
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-b from-legal-primary/5 to-legal-cream">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-legal-primary/10 border border-legal-primary/20 text-legal-primary px-4 py-2 rounded-full text-sm font-semibold mb-6">
            <Scale className="w-4 h-4" />
            Bar Council Approved · Court-Admissible Wills
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold font-display text-legal-primary leading-tight mb-6">
            Secure Your Legacy.<br />
            <span className="text-legal-gold">Protect Your Family.</span>
          </h1>
          <p className="text-xl text-legal-primary/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create a legally valid will in minutes. Define who gets what, protect your family from disputes, and get your will reviewed by empanelled lawyers at legalopinion.co.in.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard"
              className="px-8 py-4 bg-legal-primary text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg">
              Create Free Will <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/dashboard"
              className="px-8 py-4 border-2 border-legal-primary text-legal-primary rounded-2xl font-semibold text-lg hover:bg-legal-primary/5 transition-all flex items-center justify-center gap-3">
              View Demo
            </Link>
          </div>
          <p className="text-legal-primary/40 text-sm mt-4">✅ Free basic will · ✅ Indian Succession Act compliant · ✅ legalopinion.co.in reviewed</p>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <p className="text-3xl font-extrabold font-display text-legal-gold">{stat.value}</p>
              <p className="text-legal-primary/50 text-sm mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-extrabold font-display text-legal-primary text-center mb-4">
            Complete Estate Management
          </h2>
          <p className="text-legal-primary/50 text-center text-lg mb-14">Everything you need to protect your family&apos;s future</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border border-gray-100 rounded-2xl p-6 bg-legal-cream hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-legal-primary rounded-2xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-legal-gold" />
                </div>
                <h3 className="font-bold font-display text-legal-primary text-lg mb-2">{title}</h3>
                <p className="text-legal-primary/60 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Partner Banner */}
      <section className="py-10 px-6 bg-legal-primary">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-legal-gold/20 border border-legal-gold/40 rounded-2xl flex items-center justify-center">
              <Scale className="w-7 h-7 text-legal-gold" />
            </div>
            <div>
              <h3 className="text-white font-bold font-display text-xl">Legal Review by legalopinion.co.in</h3>
              <p className="text-white/60 text-sm mt-0.5">500+ empanelled lawyers review and certify your will for full legal validity</p>
            </div>
          </div>
          <a href="https://legalopinion.co.in" target="_blank" rel="noopener noreferrer"
            className="px-6 py-3 bg-legal-gold text-legal-primary rounded-xl font-bold hover:opacity-90 transition-all whitespace-nowrap">
            Visit legalopinion.co.in
          </a>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6 bg-legal-cream">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold font-display text-legal-primary text-center mb-14">
            Simple, Transparent Pricing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <div key={plan.name}
                className={`rounded-3xl p-8 transition-all ${plan.highlighted
                  ? 'bg-legal-primary text-white shadow-2xl scale-105'
                  : 'bg-white border border-gray-200 shadow-sm'}`}>
                {plan.highlighted && (
                  <div className="inline-block bg-legal-gold/20 text-legal-gold text-xs font-bold px-3 py-1 rounded-full mb-4">
                    ⭐ Most Popular
                  </div>
                )}
                <h3 className={`text-xl font-bold font-display mb-2 ${plan.highlighted ? 'text-white' : 'text-legal-primary'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className={`text-4xl font-extrabold font-display ${plan.highlighted ? 'text-legal-gold' : 'text-legal-primary'}`}>
                    {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString()}`}
                  </span>
                  {plan.price > 0 && (
                    <span className={plan.highlighted ? 'text-white/60' : 'text-legal-primary/40'}>/year</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <CheckCircle className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-legal-gold' : 'text-legal-green'}`} />
                      <span className={plan.highlighted ? 'text-white/80' : 'text-legal-primary/70'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/dashboard">
                  <button className={`w-full py-3.5 rounded-2xl font-bold transition-all ${
                    plan.highlighted
                      ? 'bg-legal-gold text-legal-primary hover:opacity-90'
                      : 'bg-legal-primary text-white hover:opacity-90'
                  }`}>
                    Get Started
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-extrabold font-display text-legal-primary text-center mb-14">
            Trusted by Families Across India
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-legal-cream rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-legal-gold fill-legal-gold" />
                  ))}
                </div>
                <p className="text-legal-primary/60 text-sm leading-relaxed mb-4">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-legal-primary rounded-full flex items-center justify-center text-legal-gold font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="font-semibold text-legal-primary text-sm">{t.name}</p>
                    <p className="text-legal-primary/40 text-xs">{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-legal-primary">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold font-display text-white mb-4">
            Don&apos;t Leave Your Family&apos;s Future to Chance
          </h2>
          <p className="text-white/60 text-lg mb-8">Create your will today. It takes 10 minutes and lasts a lifetime.</p>
          <Link href="/dashboard">
            <button className="px-12 py-5 bg-legal-gold text-legal-primary rounded-2xl font-bold text-xl hover:opacity-90 transition-all flex items-center gap-3 mx-auto shadow-lg">
              Create Your Will Free <ArrowRight className="w-6 h-6" />
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-legal-primary/90 border-t border-white/10 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Scale className="w-5 h-5 text-legal-gold" />
            <span className="font-bold font-display text-white">My Wills</span>
            <span className="text-white/30 text-sm">· Powered by legalopinion.co.in</span>
          </div>
          <p className="text-white/30 text-sm">© 2024 MyWills · Legal Will Management · Made in India 🇮🇳</p>
          <div className="flex gap-4 text-white/30 text-sm">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
