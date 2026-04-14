import Link from 'next/link'

export default function CtaSection() {
  return (
    <section className="py-12 sm:py-16 bg-violet-50 border-t border-violet-100">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
          Ready to transform your school?
        </h2>
        <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8">
          Join 500+ schools already using CuriousHat.ai. Start your free 14-day trial today.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup" className="w-full sm:w-auto text-center bg-violet-600 text-white font-semibold px-7 py-3 rounded-xl hover:bg-violet-700 transition-colors text-sm">
            Start Free Trial
          </Link>
          <Link href="/contact" className="w-full sm:w-auto text-center border border-gray-300 text-gray-700 font-medium px-7 py-3 rounded-xl hover:border-gray-400 transition-colors text-sm bg-white">
            Talk to Sales
          </Link>
        </div>
      </div>
    </section>
  )
}
