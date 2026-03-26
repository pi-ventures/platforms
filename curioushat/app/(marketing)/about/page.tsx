import Link from 'next/link'
import { GraduationCap, Heart, Lightbulb, Target, Users, Globe } from 'lucide-react'

const values = [
  { icon: Lightbulb, title: 'Curiosity First', desc: 'We believe every student\'s question deserves a great answer. AI makes that possible at scale.', color: 'bg-amber-50 text-amber-600' },
  { icon: Heart, title: 'Built for India', desc: 'CBSE, ICSE, state boards, regional languages — we understand the Indian education ecosystem deeply.', color: 'bg-pink-50 text-pink-600' },
  { icon: Target, title: 'Outcomes Obsessed', desc: 'We measure success by student outcomes, teacher efficiency, and school growth — not just feature counts.', color: 'bg-indigo-50 text-indigo-600' },
  { icon: Users, title: 'Community Driven', desc: 'Built alongside teachers, principals, and parents. Their feedback drives every feature we ship.', color: 'bg-emerald-50 text-emerald-600' },
]

const team = [
  { name: 'Rahul Mehta', role: 'CEO & Co-founder', bg: 'bg-indigo-500', initials: 'RM', bio: 'Former IIT Delhi, 10 years in EdTech. Led product at Byju\'s before founding CuriousHat.' },
  { name: 'Priya Iyer', role: 'CTO & Co-founder', bg: 'bg-purple-500', initials: 'PI', bio: 'Ex-Google AI, built ML systems at scale. Believes AI is the great equaliser in education.' },
  { name: 'Arjun Singh', role: 'Head of Product', bg: 'bg-teal-500', initials: 'AS', bio: 'Former teacher for 5 years, then product manager at Unacademy. Bridges education and technology.' },
  { name: 'Nisha Patel', role: 'Head of Customer Success', bg: 'bg-rose-500', initials: 'NP', bio: 'Spent 8 years implementing school management systems across 200+ institutions in India.' },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-5xl font-black mb-6">We believe AI can make every student's education world-class</h1>
          <p className="text-xl text-indigo-200 leading-relaxed">
            CuriousHat.ai was born from a simple frustration: great education was still too expensive, too inaccessible, and too manual. We set out to fix that.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-6">Our Story</h2>
          <div className="prose prose-lg text-gray-600 space-y-4">
            <p>In 2024, our co-founders were visiting a government school in Rajasthan when a student asked her teacher a question about a diagram in her textbook. The teacher was excellent — but she had 60 students and one period. The question went unanswered.</p>
            <p>That moment stuck. We asked: what if every student could instantly get a brilliant explanation for any question, any time? Claude Vision makes that possible. You photograph the question, and within seconds, you have a clear, structured answer with real-world context.</p>
            <p>But AI tutoring alone wasn't enough. We saw teachers drowning in administrative work — creating exam papers manually, grading stacks of answer sheets, maintaining attendance registers, generating report cards. Time stolen from actual teaching.</p>
            <p>So we built the whole stack. AI tutoring, AI exam generation, AI OCR grading, and complete school management — in a single platform that any school in India can afford and operate.</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-12">What we stand for</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map(v => (
              <div key={v.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex gap-4">
                <div className={`w-12 h-12 rounded-xl ${v.color} flex items-center justify-center flex-shrink-0`}>
                  <v.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">{v.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-4">Meet the team</h2>
          <p className="text-gray-600 text-center mb-12">Educators, engineers, and operators united by a shared mission.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {team.map(m => (
              <div key={m.name} className="flex gap-4 bg-gray-50 rounded-2xl p-6">
                <div className={`w-14 h-14 ${m.bg} rounded-xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                  {m.initials}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{m.name}</h3>
                  <p className="text-indigo-600 text-sm font-medium mb-2">{m.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{m.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700 text-center text-white">
        <h2 className="text-3xl font-black mb-4">Join us in reimagining school education</h2>
        <p className="text-indigo-200 mb-8">Start free — no credit card, no commitment, just better education.</p>
        <div className="flex gap-4 justify-center">
          <Link href="/signup" className="bg-white text-indigo-700 font-bold px-8 py-3.5 rounded-xl hover:bg-indigo-50 transition-colors">Get Started</Link>
          <Link href="/contact" className="border-2 border-white/30 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-colors">Contact Us</Link>
        </div>
      </section>
    </div>
  )
}
