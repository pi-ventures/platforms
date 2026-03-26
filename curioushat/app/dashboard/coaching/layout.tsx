'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** Coaching is now merged into /dashboard/college (Institute dashboard with type selector) */
export default function CoachingLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  useEffect(() => { router.replace('/dashboard/college') }, [router])
  return <div className="flex items-center justify-center min-h-screen text-gray-400 text-sm">Redirecting to Institute Dashboard…</div>
}
