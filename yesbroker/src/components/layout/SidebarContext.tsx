'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SidebarContextValue {
  collapsed: boolean          // icon-only mode (tablet / user toggled)
  mobileOpen: boolean         // full drawer open on mobile
  setCollapsed: (v: boolean) => void
  setMobileOpen: (v: boolean) => void
  toggle: () => void          // toggle collapsed on desktop/tablet
  toggleMobile: () => void    // open/close drawer on mobile
}

const SidebarContext = createContext<SidebarContextValue>({
  collapsed: false,
  mobileOpen: false,
  setCollapsed: () => {},
  setMobileOpen: () => {},
  toggle: () => {},
  toggleMobile: () => {},
})

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed]     = useState(false)
  const [mobileOpen, setMobileOpen]   = useState(false)

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth
      if (w < 768) {
        // Mobile — sidebar is a drawer, starts closed
        setCollapsed(false)
        setMobileOpen(false)
      } else if (w < 1024) {
        // Tablet (iPad, foldable open) — icon-only, no drawer
        setCollapsed(true)
        setMobileOpen(false)
      } else {
        // Laptop / TV — full sidebar
        setCollapsed(false)
        setMobileOpen(false)
      }
    }
    onResize()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const toggle       = () => setCollapsed(c => !c)
  const toggleMobile = () => setMobileOpen(o => !o)

  return (
    <SidebarContext.Provider value={{ collapsed, mobileOpen, setCollapsed, setMobileOpen, toggle, toggleMobile }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const useSidebar = () => useContext(SidebarContext)
