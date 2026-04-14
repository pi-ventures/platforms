'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle2 } from 'lucide-react'

const pricingPlans = [
  {
    name: 'Individual', monthlyPrice: 2000,
    desc: 'For students and parents learning at their own pace',
    features: ['FREE upto grade 5', 'AI Tutoring', 'Exam Generator'],
    cta: 'Start Free Trial', highlighted: false,
  },
  {
    name: 'Institutional', monthlyPrice: 1800,
    desc: 'Perfect for small schools getting started with AI',
    features: ['FREE upto grade 5', 'Up to 200 students', 'AI Tutoring', 'Exam Generator', 'Basic Attendance', 'Email Support'],
    cta: 'Start Free Trial', highlighted: false,
  },
  {
    name: 'Institutional +', monthlyPrice: 1500,
    desc: 'For growing institutions that want the full AI stack',
    features: ['FREE upto grade 5', 'Up to 1,000 students', 'Everything in Institutional', 'OCR Grading', 'Parent Portal', 'Gradebook & Reports', 'Priority Support'],
    cta: 'Start Free Trial', highlighted: true,
  },
]

function formatPrice(monthly: number, billing: 'monthly' | 'annual') {
  const price = billing === 'annual' ? Math.round(monthly * 0.9) : monthly
  return '\u20B9' + price.toLocaleString('en-IN')
}

export default function PricingSection() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <section className="py-12 md:py-20 bg-gray-50 border-y border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-10">
          <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">Pricing</span>
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mt-2 mb-2 px-2">
            @ less than your monthly house-helper cost
          </h2>
          <p className="text-gray-500 text-sm">14-day free trial &middot; No credit card required</p>

          <div className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 mt-5 sm:mt-6">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
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
                href="/signup"
                className={`mt-auto block text-center font-semibold py-3 rounded-xl transition-all text-sm ${plan.highlighted ? 'bg-white text-violet-600 hover:bg-violet-50' : 'bg-violet-600 text-white hover:bg-violet-700'}`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
