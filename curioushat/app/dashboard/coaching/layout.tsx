'use client'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { LayoutDashboard, Target, FileText, Users, Brain, BarChart3, BookOpen, TrendingUp, Bell, ClipboardList, Languages } from 'lucide-react'

const navItems = [
  { label: 'Overview', href: '/dashboard/coaching', icon: LayoutDashboard },
  { label: 'Admission Leads', href: '/dashboard/coaching/leads', icon: Target },
  { label: 'Batches', href: '/dashboard/coaching/batches', icon: Users },
  { label: 'Test Series', href: '/dashboard/coaching/tests', icon: FileText },
  { label: 'Question Bank', href: '/dashboard/coaching/question-bank', icon: Brain },
  { label: 'Student Performance', href: '/dashboard/coaching/performance', icon: BarChart3 },
  { label: 'Results & Rankings', href: '/dashboard/coaching/results', icon: TrendingUp },
  { label: 'Study Material', href: '/dashboard/coaching/material', icon: BookOpen },
  { label: 'Learn Languages', href: '/dashboard/coaching/learn-languages', icon: Languages },
  { label: 'Attendance', href: '/dashboard/coaching/attendance', icon: ClipboardList },
  { label: 'Announcements', href: '/dashboard/coaching/announcements', icon: Bell },
]

export default function CoachingLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="Coaching Institute" userName="Rajesh Khandelwal" navItems={navItems} accentColor="violet">
      {children}
    </DashboardShell>
  )
}
