import Link from 'next/link'
import { GraduationCap, Twitter, Linkedin, Youtube, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-8 md:gap-10">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900 text-base tracking-tight">
                CuriousHat<span className="text-violet-600">.ai</span>
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed mb-5 max-w-xs">
              Transforming education with AI — smarter tutoring, automated grading, and complete school management for modern institutions.
            </p>
            <div className="flex items-center gap-2">
              {[Twitter, Linkedin, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-violet-50 hover:text-violet-600 text-gray-400 transition-colors">
                  <Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { heading: 'Product', links: [['Features', '/features'], ['Pricing', '/pricing'], ['Changelog', '#'], ['Roadmap', '#']] },
            { heading: 'Solutions', links: [['For Schools', '/features'], ['For Teachers', '/features'], ['For Students', '/features'], ['For Parents', '/features']] },
            { heading: 'Company', links: [['About', '/about'], ['Blog', '#'], ['Careers', '#'], ['Contact', '/contact']] },
          ].map(col => (
            <div key={col.heading}>
              <h4 className="text-gray-900 font-semibold text-sm mb-3">{col.heading}</h4>
              <ul className="space-y-2.5">
                {col.links.map(([label, href]) => (
                  <li key={label}>
                    <Link href={href} className="text-sm text-gray-500 hover:text-gray-900 transition-colors">{label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-10 pt-5 sm:pt-6 border-t border-gray-100 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs sm:text-sm text-gray-400 text-center sm:text-left">© 2026 CuriousHat.ai. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-3 sm:gap-5 text-xs sm:text-sm text-gray-400">
            <Link href="#" className="hover:text-gray-700 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-700 transition-colors">Terms of Service</Link>
            <a href="mailto:progressiveinitiatives.ventures@gmail.com" className="flex items-center gap-1 hover:text-gray-700 transition-colors">
              <Mail className="w-3 h-3 sm:w-3.5 sm:h-3.5" />{' '}progressiveinitiatives.ventures@gmail.com
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
