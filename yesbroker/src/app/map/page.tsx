'use client'

import dynamic from 'next/dynamic'
import AppLayout from '@/components/layout/AppLayout'
import { Loader2 } from 'lucide-react'

const MapDiscovery = dynamic(() => import('./MapDiscovery'), {
  ssr: false,
  loading: () => (
    <div
      className="flex flex-1 items-center justify-center"
      style={{ height: 'calc(100vh - 64px)', background: '#0A0C18' }}
    >
      <div className="text-center">
        <Loader2 className="w-7 h-7 animate-spin mx-auto mb-3" style={{ color: '#F5A623' }} />
        <p className="text-sm" style={{ color: '#6B7280' }}>Loading map…</p>
      </div>
    </div>
  ),
})

export default function MapPage() {
  return (
    <AppLayout
      title="Map Discovery"
      subtitle="Browse & discover properties across Mumbai"
      noPadding
    >
      <MapDiscovery />
    </AppLayout>
  )
}
