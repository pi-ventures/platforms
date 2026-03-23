'use client'

import { Search, Bell, Plus, RefreshCw, Menu } from 'lucide-react'
import { useState } from 'react'
import { useSidebar } from './SidebarContext'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export default function Header({ title, subtitle, actions }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const { toggleMobile } = useSidebar()

  return (
    <header className="bg-white border-b border-gray-100 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between sticky top-0 z-40 shadow-sm gap-3">

      {/* Left: hamburger (mobile only) + title */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger — only on mobile (hidden md+) */}
        <button
          onClick={toggleMobile}
          className="md:hidden w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:text-brand-primary hover:border-brand-primary transition-all flex-shrink-0"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-base md:text-xl font-bold text-brand-dark font-display truncate">{title}</h2>
          {subtitle && <p className="text-xs md:text-sm text-gray-500 truncate">{subtitle}</p>}
        </div>
      </div>

      {/* Right: search, notifications, actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Search — hidden on very small screens */}
        <div className={`hidden sm:flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 transition-all duration-300
          ${searchOpen ? 'w-56 md:w-72' : 'w-10'} overflow-hidden`}>
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className="w-10 h-10 flex items-center justify-center flex-shrink-0 text-gray-400 hover:text-brand-primary transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
          {searchOpen && (
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm outline-none text-gray-700 pr-4 placeholder-gray-400"
              onBlur={() => setSearchOpen(false)}
            />
          )}
        </div>

        {/* Notifications */}
        <button className="relative w-9 h-9 md:w-10 md:h-10 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-primary hover:border-brand-primary transition-all">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-primary rounded-full"></span>
        </button>

        {/* Sync — hidden on small screens */}
        <button className="hidden md:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-200 text-sm text-gray-600 hover:text-brand-primary hover:border-brand-primary transition-all">
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="font-medium">Sync</span>
        </button>

        {/* Custom actions */}
        {actions}

        {/* Add New */}
        <button className="btn-primary flex items-center gap-1.5 !py-2 !px-3 md:!py-2.5 md:!px-4 text-xs md:text-sm">
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add New</span>
        </button>
      </div>
    </header>
  )
}
