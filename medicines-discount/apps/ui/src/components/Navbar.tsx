'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Pill, MapPin } from 'lucide-react';

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-brand-700 text-lg">
          <Pill className="w-5 h-5" />
          medicines<span className="text-gray-400 font-normal">.discount</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/search" className="hover:text-brand-600 transition-colors">Search</Link>
          <Link href="/kendras" className="flex items-center gap-1 hover:text-brand-600 transition-colors">
            <MapPin className="w-3.5 h-3.5" />
            Jan Aushadhi Kendra
          </Link>
          <Link href="/about" className="hover:text-brand-600 transition-colors">About</Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 flex flex-col gap-3 text-sm text-gray-700">
          <Link href="/search" onClick={() => setOpen(false)}>Search</Link>
          <Link href="/kendras" onClick={() => setOpen(false)}>Jan Aushadhi Kendra</Link>
          <Link href="/about" onClick={() => setOpen(false)}>About</Link>
        </div>
      )}
    </nav>
  );
}
