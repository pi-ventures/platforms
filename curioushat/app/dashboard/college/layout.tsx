'use client'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { LayoutDashboard, Users, BookOpen, BarChart3, Bell, GraduationCap, FileText, Target, Brain, TrendingUp, ClipboardList, Library, Languages } from 'lucide-react'

const navItems = [
  { label: 'Overview', href: '/dashboard/college', icon: LayoutDashboard },
  { label: 'Library', href: '/dashboard/college/library', icon: Library },
  { label: 'Learn Languages', href: '/dashboard/college/learn-languages', icon: Languages },
  { label: 'Admission Leads', href: '/dashboard/college/leads', icon: Target },
  { label: 'Applications', href: '/dashboard/college/applications', icon: FileText },
  { label: 'Batches & Classes', href: '/dashboard/college/batches', icon: Users },
  { label: 'Test Series', href: '/dashboard/college/tests', icon: Brain },
  { label: 'Student Performance', href: '/dashboard/college/performance', icon: BarChart3 },
  { label: 'Courses & Syllabus', href: '/dashboard/college/courses', icon: BookOpen },
  { label: 'Results & Rankings', href: '/dashboard/college/results', icon: TrendingUp },
  { label: 'Faculty', href: '/dashboard/college/faculty', icon: GraduationCap },
  { label: 'Placements', href: '/dashboard/college/placements', icon: BarChart3 },
  { label: 'Attendance', href: '/dashboard/college/attendance', icon: ClipboardList },
  { label: 'Announcements', href: '/dashboard/college/announcements', icon: Bell },
]

export default function CollegeLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="College / Coaching / Academy" userName="Dr. Rajiv Mehta" navItems={navItems} accentColor="indigo">
      {children}
    </DashboardShell>
  )
}
