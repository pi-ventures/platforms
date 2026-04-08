import { Brain, Library, BarChart3, Users } from 'lucide-react'

const individualFeatures = [
  { icon: Brain, title: 'AI Tutoring', desc: 'Snap a photo of any question — Claude Vision or GPT-4o explains it step-by-step with real-world context.' },
  { icon: Library, title: 'Digital Library', desc: 'Browse NCERT textbooks, reference books, music, fashion design courses — across all classes, 98 languages, with accredited certifications.' },
  { icon: BarChart3, title: 'Progress Tracking', desc: 'Students and parents get real-time visibility into grades, attendance, assignments, and improvement trends.' },
  { icon: Users, title: 'Parent Portal', desc: "Track your child's performance, attendance, fees, and directly communicate with subject teachers." },
]

export default function IndividualsSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-10">
          <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">For Individuals</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1.5 mb-2">Students &amp; Parents</h2>
          <p className="text-gray-500 text-sm max-w-lg">Learning tools and progress visibility for every student and family</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {individualFeatures.map((f) => (
            <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-violet-300 hover:shadow-sm transition-all">
              <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-violet-600" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{f.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
