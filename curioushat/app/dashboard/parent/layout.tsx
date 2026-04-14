'use client'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { LayoutDashboard, TrendingUp, DollarSign, Bell, MessageSquare, ClipboardList, Languages } from 'lucide-react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard/parent', icon: LayoutDashboard },
  { label: 'Academic Progress', href: '/dashboard/parent/progress', icon: TrendingUp },
  { label: 'Fees & Payments', href: '/dashboard/parent/fees', icon: DollarSign },
  { label: 'Attendance', href: '/dashboard/parent/attendance', icon: ClipboardList },
  { label: 'Learn Languages', href: '/dashboard/parent/learn-languages', icon: Languages },
  { label: 'Announcements', href: '/dashboard/parent/announcements', icon: Bell },
  { label: 'Message Teacher', href: '/dashboard/parent/messages', icon: MessageSquare },
]

export default function ParentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="Parent" userName="Mr. Rajesh Verma" navItems={navItems} accentColor="from-orange-500 to-amber-500">
      {children}
    </DashboardShell>
  )
}
