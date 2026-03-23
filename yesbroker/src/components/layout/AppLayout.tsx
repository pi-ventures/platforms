'use client'

import Sidebar from './Sidebar'
import Header from './Header'
import { SidebarProvider, useSidebar } from './SidebarContext'

interface AppLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
  noPadding?: boolean
}

function AppLayoutInner({ children, title, subtitle, actions, noPadding }: AppLayoutProps) {
  const { collapsed } = useSidebar()

  // Margin logic:
  // Mobile (< 768px)  → ml-0  (sidebar is an overlay drawer, not in flow)
  // Tablet (768-1024) → ml-16 (64px icon rail, always visible)
  // Desktop (1024px+) → ml-64 or ml-16 depending on collapsed state
  // We use inline style for the dynamic part and Tailwind for the base

  const desktopML = collapsed ? 64 : 256

  return (
    <div className="flex h-screen bg-brand-muted">
      <Sidebar />
      <div
        className="flex flex-col min-h-screen overflow-hidden flex-1"
        style={{
          // Mobile: no margin (drawer is overlay)
          // md+: margin matches sidebar width
          marginLeft: 0,
        }}
      >
        {/* Responsive margin via a wrapper that uses CSS */}
        <style>{`
          @media (min-width: 768px) and (max-width: 1023px) {
            .app-content { margin-left: 64px !important; }
          }
          @media (min-width: 1024px) {
            .app-content { margin-left: ${desktopML}px !important; transition: margin-left 250ms cubic-bezier(0.4,0,0.2,1); }
          }
        `}</style>
        <div className="app-content flex flex-col flex-1 overflow-hidden min-h-screen">
          <Header title={title} subtitle={subtitle} actions={actions} />
          <main className={`flex-1 overflow-y-auto animate-fade-in ${noPadding ? '' : 'p-4 md:p-6'}`}>
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}

export default function AppLayout(props: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppLayoutInner {...props} />
    </SidebarProvider>
  )
}
