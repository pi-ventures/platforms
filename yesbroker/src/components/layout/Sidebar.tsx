'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Building2, Users, Megaphone, Map,
  MessageSquare, Settings, Box, BarChart3, Layers,
  Shield, Bell, User, CalendarCheck, PanelLeftClose, PanelLeftOpen, X,
} from 'lucide-react'
import YesBrokerLogo from '@/components/ui/YesBrokerLogo'
import { useSidebar } from './SidebarContext'

const NAV_ITEMS = [
  { href: '/dashboard',   label: 'Dashboard',   icon: LayoutDashboard },
  { href: '/properties',  label: 'Properties',  icon: Building2 },
  { href: '/leads',       label: 'Leads',       icon: Users,         badge: 23 },
  { href: '/visits',      label: 'Visits',      icon: CalendarCheck, badge: 3  },
  { href: '/crm',         label: 'CRM',         icon: MessageSquare },
  { href: '/advertising', label: 'Advertising', icon: Megaphone },
  { href: '/inbox',       label: 'Inbox',       icon: Box,           badge: 8  },
  { href: '/map',         label: 'Map View',    icon: Map },
  { href: '/planner',     label: '3D Planner',  icon: Layers },
  { href: '/analytics',   label: 'Analytics',   icon: BarChart3 },
  { href: '/settings',    label: 'Settings',    icon: Settings },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { collapsed, mobileOpen, toggle, setMobileOpen } = useSidebar()

  // On mobile: sidebar is a slide-in drawer (full width, overlaid)
  // On tablet: icon-only rail (64px, always visible)
  // On desktop: full sidebar (256px) or collapsed icon rail

  const isMobileVisible = mobileOpen  // controlled by hamburger
  const sidebarW = collapsed ? 64 : 256

  const NavContent = ({ forceExpanded = false }: { forceExpanded?: boolean }) => {
    const show = forceExpanded || !collapsed
    return (
      <>
        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-3"
          style={{ padding: show ? '12px' : '12px 8px' }}>
          <div className="space-y-0.5">
            {NAV_ITEMS.map(({ href, label, icon: Icon, badge }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/')
              return (
                <Link
                  key={href}
                  href={href}
                  title={!show ? label : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center rounded-xl text-sm font-medium transition-all duration-150 group relative
                    ${isActive
                      ? 'bg-brand-primary text-white shadow-mustard'
                      : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  style={{
                    padding: show ? '10px 14px' : '10px',
                    justifyContent: show ? 'flex-start' : 'center',
                    gap: show ? 12 : 0,
                    minHeight: 44,
                  }}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span
                    className="flex-1 whitespace-nowrap overflow-hidden"
                    style={{
                      opacity: show ? 1 : 0,
                      maxWidth: show ? 160 : 0,
                      transition: 'opacity 180ms, max-width 220ms',
                    }}
                  >
                    {label}
                  </span>
                  {badge && (
                    show ? (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold flex-shrink-0
                        ${isActive ? 'bg-white/20 text-white' : 'bg-brand-primary text-white'}`}>
                        {badge}
                      </span>
                    ) : (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-primary" />
                    )
                  )}
                </Link>
              )
            })}
          </div>
        </nav>

        {/* Vault sync — only when expanded */}
        {show && (
          <div className="mx-3 mb-3 px-3 py-2.5 bg-white/5 rounded-xl border border-white/10 flex-shrink-0">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-mustard-400" />
              <span className="text-xs font-semibold text-mustard-400">MyVault Synced</span>
              <span className="w-2 h-2 bg-green-400 rounded-full ml-auto animate-pulse-dot" />
            </div>
            <p className="text-gray-500 text-[11px]">Last sync: Just now</p>
          </div>
        )}

        {/* User profile */}
        <div className="border-t border-white/10 flex-shrink-0"
          style={{ padding: show ? '12px 16px' : '12px 8px' }}>
          <div className="flex items-center"
            style={{ gap: show ? 10 : 0, justifyContent: show ? 'flex-start' : 'center' }}>
            <div className="w-8 h-8 bg-mustard-gradient rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            {show && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-semibold truncate">Rajesh Sharma</p>
                  <p className="text-mustard-400 text-[11px]">Pro Broker</p>
                </div>
                <Bell className="w-4 h-4 text-gray-400 hover:text-white cursor-pointer transition-colors flex-shrink-0" />
              </>
            )}
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      {/* ══ MOBILE DRAWER ══ (< md, hidden on md+) */}
      {/* Backdrop */}
      {isMobileVisible && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      {/* Drawer panel */}
      <aside
        className="fixed left-0 top-0 h-screen bg-brand-dark flex flex-col z-50 shadow-2xl md:hidden"
        style={{
          width: 260,
          transform: isMobileVisible ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 280ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Mobile header row */}
        <div className="flex items-center justify-between px-4 border-b border-white/10" style={{ height: 64 }}>
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <YesBrokerLogo size={30} theme="dark" />
          </Link>
          <button onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <NavContent forceExpanded />
      </aside>

      {/* ══ DESKTOP / TABLET SIDEBAR ══ (hidden on mobile, visible md+) */}
      <aside
        className="fixed left-0 top-0 h-screen bg-brand-dark flex flex-col z-50 shadow-2xl hidden md:flex overflow-hidden"
        style={{
          width: sidebarW,
          transition: 'width 250ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Logo + toggle row */}
        <div
          className="flex items-center border-b border-white/10 flex-shrink-0"
          style={{
            height: 64,
            padding: collapsed ? '0 12px' : '0 16px',
            justifyContent: collapsed ? 'center' : 'space-between',
            transition: 'padding 250ms',
          }}
        >
          <Link href="/" className="flex-shrink-0 overflow-hidden"
            style={{ maxWidth: collapsed ? 36 : 160, transition: 'max-width 250ms' }}>
            {collapsed
              ? <YesBrokerLogo variant="icon" size={36} />
              : <YesBrokerLogo size={30} theme="dark" />
            }
          </Link>
          {!collapsed && (
            <button onClick={toggle}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all flex-shrink-0 ml-2"
              title="Collapse sidebar">
              <PanelLeftClose className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button onClick={toggle}
            className="flex items-center justify-center py-3 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex-shrink-0 border-b border-white/10"
            title="Expand sidebar">
            <PanelLeftOpen className="w-4 h-4" />
          </button>
        )}

        <NavContent />
      </aside>
    </>
  )
}
