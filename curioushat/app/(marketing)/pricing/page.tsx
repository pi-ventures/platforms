'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

const pricingPlans = [
  {
    name: 'Individual', monthlyPrice: 2000,
    desc: 'For students and parents learning at their own pace',
    features: ['FREE upto grade 5', 'AI Tutoring', 'Exam Generator'],
    cta: 'Start Free Trial', ctaHref: '/signup', highlighted: false,
  },
  {
    name: 'Institutional', monthlyPrice: 1800,
    desc: 'Perfect for small schools getting started with AI',
    features: ['FREE upto grade 5', 'Up to 200 students', 'AI Tutoring', 'Exam Generator', 'Basic Attendance', 'Email Support'],
    cta: 'Start Free Trial', ctaHref: '/signup', highlighted: false,
  },
  {
    name: 'Institutional +', monthlyPrice: 1500,
    desc: 'For growing institutions that want the full AI stack',
    features: ['FREE upto grade 5', 'Up to 1,000 students', 'Everything in Institutional', 'OCR Grading', 'Parent Portal', 'Gradebook & Reports', 'Priority Support'],
    cta: 'Start Free Trial', ctaHref: '/signup', highlighted: true,
  },
]

function formatPrice(monthly: number, billing: 'monthly' | 'annual') {
  const price = billing === 'annual' ? Math.round(monthly * 0.9) : monthly
  return '\u20B9' + price.toLocaleString('en-IN')
}

const faqItems = [
  {
    q: 'Is there a free trial?',
    a: 'Yes! All plans come with a 14-day free trial — no credit card required. You get full access to all features in your chosen plan.'
  },
  {
    q: 'Can I change plans later?',
    a: 'Absolutely. You can upgrade or downgrade at any time. When you upgrade, the difference is prorated. When you downgrade, the credit rolls over.'
  },
  {
    q: 'What counts as a "student"?',
    a: 'Any enrolled student with an active account. Archived or graduated students don\'t count against your limit.'
  },
  {
    q: 'Do you support Indian payment methods?',
    a: 'Yes — we support UPI, Net Banking, Credit/Debit Cards, and NEFT via Razorpay for Indian schools.'
  },
  {
    q: 'Is our data safe?',
    a: 'All data is encrypted at rest and in transit. We\'re hosted on AWS Mumbai (ap-south-1) for Indian data residency compliance.'
  },
]

export default function PricingPage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-50 py-16 sm:py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 mb-3">
            @ less than your monthly house-helper cost
          </h1>
          <p className="text-base sm:text-lg text-gray-500 mb-2">Start free. Scale as you grow. No hidden fees.</p>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full mt-4">
            14-day free trial &middot; No credit card required
          </div>

          <div className="flex justify-center mt-6">
            <div className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${billing === 'monthly' ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('annual')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${billing === 'annual' ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Annual
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${billing === 'annual' ? 'bg-white text-violet-600' : 'bg-green-100 text-green-700'}`}>
                  &minus;10%
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {pricingPlans.map(plan => (
              <div key={plan.name} className={`relative rounded-xl p-5 sm:p-7 border-2 transition-all flex flex-col ${plan.highlighted ? 'border-violet-600 bg-violet-600 text-white shadow-lg' : 'border-gray-200 bg-white hover:border-violet-200'}`}>
                <h3 className={`text-base sm:text-lg font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${plan.highlighted ? 'text-violet-200' : 'text-gray-500'}`}>{plan.desc}</p>
                <div className={`mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  <span className="text-3xl sm:text-4xl font-black">{formatPrice(plan.monthlyPrice, billing)}</span>
                  <span className={`text-xs sm:text-sm font-normal ml-1 ${plan.highlighted ? 'text-violet-300' : 'text-gray-400'}`}>/student/mo</span>
                </div>
                {billing === 'annual' && (
                  <p className={`text-xs mb-4 ${plan.highlighted ? 'text-violet-200' : 'text-green-600'}`}>
                    Billed annually &middot; save {Math.round(plan.monthlyPrice * 0.1 * 12).toLocaleString('en-IN')} &#8377;/student/yr
                  </p>
                )}
                {billing === 'monthly' && <div className="mb-4" />}
                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-violet-200' : 'text-violet-400'}`} />
                      <span className={plan.highlighted ? 'text-violet-100' : 'text-gray-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={plan.ctaHref}
                  className={`mt-auto block text-center font-semibold py-3 rounded-xl transition-all text-sm ${plan.highlighted ? 'bg-white text-violet-600 hover:bg-violet-50' : 'bg-violet-600 text-white hover:bg-violet-700'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 sm:py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-black text-gray-900 text-center mb-10 sm:mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqItems.map(faq => (
              <div key={faq.q} className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2">{faq.q}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 sm:py-16 text-center bg-white">
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-4">Still have questions?</h2>
        <p className="text-gray-500 mb-8">Our team is happy to help you find the right plan for your school.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/contact" className="inline-block border-2 border-violet-600 text-violet-600 font-semibold px-8 py-3 rounded-xl hover:bg-violet-50 transition-colors">Talk to Sales</Link>
          <Link href="/signup" className="inline-block bg-violet-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-violet-700 transition-colors">Start Free Trial</Link>
        </div>
      </section>
    </div>
  )
}
