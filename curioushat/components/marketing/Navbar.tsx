'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, GraduationCap, ChevronDown } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
]

const roles = [
  { label: '🎓 Student', href: '/dashboard/student' },
  { label: '👩‍🏫 Teacher', href: '/dashboard/teacher' },
  { label: '👨‍👩‍👧 Parent', href: '/dashboard/parent' },
  { label: '🏫 School Admin', href: '/dashboard/school' },
  { label: '🏛 State · CBSE · IB · IGCSE', href: '/dashboard/govt' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [roleOpen, setRoleOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 min-w-0">
            <div className="w-7 h-7 bg-violet-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 text-sm sm:text-base tracking-tight truncate">
              CuriousHat<span className="text-violet-600">.ai</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <Link key={l.href} href={l.href} className="text-gray-600 hover:text-gray-900 font-medium transition-colors text-sm">
                {l.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setRoleOpen(!roleOpen)}
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors px-3 py-2 rounded-lg hover:bg-gray-100"
              >
                Login <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {roleOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setRoleOpen(false)} />
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-1.5 z-50">
                    {roles.map(r => (
                      <Link key={r.href} href={r.href} onClick={() => setRoleOpen(false)}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                        {r.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
            <Link href="/signup" className="bg-violet-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors">
              Get Started Free
            </Link>
          </div>

          {/* Mobile */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-3 sm:px-4 py-4 space-y-0.5 max-h-[80vh] overflow-y-auto">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
              className="block py-2.5 px-2 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:text-gray-900 text-sm">
              {l.label}
            </Link>
          ))}
          <div className="pt-3 mt-2 border-t border-gray-100 space-y-0.5">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider px-2 mb-2">Login as</p>
            {roles.map(r => (
              <Link key={r.href} href={r.href} onClick={() => setOpen(false)}
                className="block py-2.5 px-2 rounded-lg text-gray-600 hover:bg-gray-50 text-sm leading-snug">
                {r.label}
              </Link>
            ))}
            <Link href="/signup" onClick={() => setOpen(false)}
              className="block w-full text-center bg-violet-600 text-white font-semibold px-4 py-2.5 rounded-xl mt-3 hover:bg-violet-700 transition-colors text-sm">
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
