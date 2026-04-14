import { Star } from 'lucide-react'

const testimonials = [
  { name: 'Priya Sharma', role: 'Principal, DPS Noida', avatar: 'PS', quote: 'CuriousHat.ai completely transformed how we manage exams. Paper generation that used to take days now takes minutes.' },
  { name: 'Rajesh Kumar', role: 'Science Teacher, KV Delhi', avatar: 'RK', quote: 'The OCR grading is magic. I grade 120 answer sheets in the time it used to take me to grade 20.' },
  { name: 'Meera Nair', role: 'Parent of Class 9 Student', avatar: 'MN', quote: "My daughter uses the AI tutor every evening. Her grades have improved and she's more confident." },
]

export default function TestimonialsSection() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Loved by educators &amp; parents</h2>
          <div className="flex items-center justify-center gap-0.5 mb-1">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
          </div>
          <p className="text-gray-400 text-sm">Trusted by 500+ schools across India</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
          {testimonials.map(t => (
            <div key={t.name} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-violet-200 transition-colors">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-xs">
                  {t.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                  <div className="text-gray-400 text-xs">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
