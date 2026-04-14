'use client'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { LayoutDashboard, Building2, Users, BookOpen, BarChart3, Bell, GraduationCap, FileText, Shield, Award, TrendingUp, Library, Languages } from 'lucide-react'

const navItems = [
  { label: 'Overview', href: '/dashboard/university', icon: LayoutDashboard },
  { label: 'Library', href: '/dashboard/university/library', icon: Library },
  { label: 'Learn Languages', href: '/dashboard/university/learn-languages', icon: Languages },
  { label: 'Affiliated Colleges', href: '/dashboard/university/affiliated-colleges', icon: Building2 },
  { label: 'Students', href: '/dashboard/university/students', icon: GraduationCap },
  { label: 'Examinations', href: '/dashboard/university/examinations', icon: FileText },
  { label: 'Research & Publications', href: '/dashboard/university/research', icon: BookOpen },
  { label: 'Accreditation (NAAC)', href: '/dashboard/university/accreditation', icon: Shield },
  { label: 'Placements', href: '/dashboard/university/placements', icon: TrendingUp },
  { label: 'Announcements', href: '/dashboard/university/announcements', icon: Bell },
]

export default function UniversityLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="University" userName="Vice Chancellor Prof. S.K. Rao" navItems={navItems} accentColor="indigo">
      {children}
    </DashboardShell>
  )
}
