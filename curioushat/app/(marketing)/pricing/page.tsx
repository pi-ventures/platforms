import Link from 'next/link'
import { CheckCircle2, X } from 'lucide-react'

const plans = [
  {
    name: 'Starter',
    price: '₹2,999',
    period: '/month',
    annual: '₹2,399/mo billed annually',
    desc: 'Perfect for small schools and coaching centres just getting started with AI.',
    students: 'Up to 200 students',
    highlighted: false,
    features: {
      'AI Features': ['AI Tutoring (Image Q&A)', 'AI Exam Generator (10/day)', false, false],
      'School Management': ['Attendance Management', 'Basic Timetable', false, 'Basic Fee Collection', false, false, false],
      'Support': ['Email Support', false, false],
    },
    featureList: ['200 students', 'AI Tutoring', 'Exam Generator (10/day)', 'Attendance', 'Basic Timetable', 'Basic Fee Collection', 'Email support'],
    cta: 'Start Free Trial',
    ctaHref: '/signup',
  },
  {
    name: 'Growth',
    price: '₹7,999',
    period: '/month',
    annual: '₹6,399/mo billed annually',
    desc: 'The full AI stack for growing schools that want to automate everything.',
    students: 'Up to 1,000 students',
    highlighted: true,
    badge: 'Most Popular',
    featureList: ['1,000 students', 'Everything in Starter', 'OCR Answer Grading', 'Parent Portal', 'Full Gradebook & Reports', 'Admissions Module', 'Staff & HR', 'WhatsApp Notifications', 'Priority Support'],
    cta: 'Start Free Trial',
    ctaHref: '/signup',
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    annual: 'Volume discounts available',
    desc: 'For large school chains, trusts, and education boards with complex requirements.',
    students: 'Unlimited students',
    highlighted: false,
    featureList: ['Unlimited students & schools', 'Everything in Growth', 'Multi-school management', 'Custom AI model fine-tuning', 'SSO & Active Directory', 'Dedicated Customer Success', 'SLA guarantee', 'On-premise deployment option', 'Custom integrations & API'],
    cta: 'Contact Sales',
    ctaHref: '/contact',
  },
]

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
  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-50 py-20 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h1 className="text-5xl font-black text-gray-900 mb-4">Simple, transparent pricing</h1>
          <p className="text-xl text-gray-600 mb-2">Start free. Scale as you grow. No hidden fees.</p>
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 text-sm font-semibold px-4 py-2 rounded-full mt-4">
            ✅ 14-day free trial • No credit card required
          </div>
        </div>
      </section>

      {/* Plans */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map(plan => (
              <div key={plan.name} className={`relative rounded-2xl p-8 border-2 ${plan.highlighted ? 'border-indigo-600 bg-gradient-to-br from-indigo-600 to-purple-700 text-white shadow-2xl shadow-indigo-200 md:-translate-y-4' : 'border-gray-100 bg-white'} transition-all`}>
                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-4 py-1 rounded-full whitespace-nowrap">
                    {plan.badge}
                  </span>
                )}
                <h3 className={`text-xl font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <p className={`text-sm mb-4 ${plan.highlighted ? 'text-indigo-200' : 'text-gray-500'}`}>{plan.desc}</p>
                <div className={`text-4xl font-black mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {plan.price}
                  <span className={`text-base font-normal ${plan.highlighted ? 'text-indigo-300' : 'text-gray-400'}`}>{plan.period}</span>
                </div>
                <p className={`text-xs mb-6 ${plan.highlighted ? 'text-indigo-300' : 'text-gray-400'}`}>{plan.annual}</p>
                <div className={`text-sm font-semibold mb-4 ${plan.highlighted ? 'text-indigo-200' : 'text-indigo-600'}`}>{plan.students}</div>
                <ul className="space-y-2.5 mb-8">
                  {plan.featureList.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-indigo-200' : 'text-emerald-500'}`} />
                      <span className={plan.highlighted ? 'text-indigo-100' : 'text-gray-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href={plan.ctaHref} className={`block text-center font-bold py-3.5 rounded-xl transition-all ${plan.highlighted ? 'bg-white text-indigo-700 hover:bg-indigo-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
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
      <section className="py-16 text-center bg-white">
        <h2 className="text-3xl font-black text-gray-900 mb-4">Still have questions?</h2>
        <p className="text-gray-600 mb-8">Our team is happy to help you find the right plan for your school.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/contact" className="inline-block border-2 border-indigo-600 text-indigo-600 font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors">Talk to Sales</Link>
          <Link href="/signup" className="inline-block bg-indigo-600 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-700 transition-colors">Start Free Trial</Link>
        </div>
      </section>
    </div>
  )
}
