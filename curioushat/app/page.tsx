import dynamic from 'next/dynamic'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

/* ── Below-fold sections ── */
/* SSR: keep key content sections crawlable for SEO */
const IndividualsSection = dynamic(() => import('@/components/marketing/sections/IndividualsSection'))
const InstitutionsSection = dynamic(() => import('@/components/marketing/sections/InstitutionsSection'))
/* Client-only: deeper sections don't need SSR */
const DashboardsSection = dynamic(() => import('@/components/marketing/sections/DashboardsSection'), { ssr: false })
const GroupStudySection = dynamic(() => import('@/components/marketing/sections/GroupStudySection'), { ssr: false })
const MultilingualSection = dynamic(() => import('@/components/marketing/sections/MultilingualSection'), { ssr: false })
const TestimonialsSection = dynamic(() => import('@/components/marketing/sections/TestimonialsSection'), { ssr: false })
const PricingSection = dynamic(() => import('@/components/marketing/PricingSection'), { ssr: false })
const CtaSection = dynamic(() => import('@/components/marketing/sections/CtaSection'), { ssr: false })

const stats = [
  { value: '10,000+', label: 'Books in Library' },
  { value: '50K+', label: 'Students Enrolled' },
  { value: '2,000+', label: 'Teachers Using AI' },
  { value: '500+', label: 'Schools Onboarded' },
  { value: '98', label: 'Languages (24 Indian + 74 International)' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO (always SSR — critical for FCP/LCP) ── */}
      <section className="relative pt-24 sm:pt-28 pb-14 sm:pb-20 overflow-x-hidden border-b border-gray-100">
        {/* Lightweight decorative shapes — pure CSS, no SVGs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
          <div className="absolute top-16 left-[6%] w-14 h-14 rounded-full bg-violet-100/50" />
          <div className="absolute top-24 right-[8%] w-16 h-16 rounded-full bg-violet-50/60" />
          <div className="absolute bottom-12 left-[12%] w-16 h-16 rounded-lg bg-gray-100/40" />
          <div className="absolute top-36 left-[40%] w-24 h-2 rounded-full bg-violet-100/40" />
          <div className="absolute bottom-16 right-[10%] w-14 h-14 rounded-full bg-violet-50/50" />
          <div className="absolute top-12 left-[55%] w-3 h-3 rounded-full bg-violet-200/60" />
          <div className="absolute bottom-24 left-[30%] w-2 h-2 rounded-full bg-amber-200/60" />
          <div className="absolute top-20 right-[25%] w-2 h-2 rounded-full bg-amber-200/50" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-100 text-violet-600 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full mb-6 sm:mb-8">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            Powered by Claude &amp; GPT-4o Vision AI
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-4 sm:mb-6 lg:whitespace-nowrap">
            Learn from the best &amp; latest <span className="text-violet-600">in the world.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
            AI driven Learning Content for Students &amp; Schools, Digital courses library,
            Complete school management and Automated unbiased grading.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10 sm:mb-16">
            <Link href="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm sm:text-base px-6 sm:px-7 py-3 rounded-xl shadow-sm transition-colors">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/features" className="w-full sm:w-auto flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base px-5 sm:px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all bg-white">
              View Features
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 max-w-3xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-2 sm:p-3 text-center">
                <div className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 leading-tight">{s.value}</div>
                <div className="text-[9px] sm:text-[10px] lg:text-xs text-gray-500 mt-0.5 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Below-fold: lazy-loaded client-side to keep initial HTML ~30KB ── */}
      <IndividualsSection />
      <InstitutionsSection />
      <DashboardsSection />
      <GroupStudySection />
      <MultilingualSection />
      <TestimonialsSection />
      <PricingSection />
      <CtaSection />

      <Footer />
    </div>
  )
}
