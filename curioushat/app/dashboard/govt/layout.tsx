'use client'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { LayoutDashboard, Map, Building2, School, BookOpen, GraduationCap, BarChart3, FileDown, AlertTriangle } from 'lucide-react'

const navItems = [
  { label: 'State Overview', href: '/dashboard/govt', icon: LayoutDashboard },
  { label: 'District Performance', href: '/dashboard/govt/districts', icon: Map },
  { label: 'School Performance', href: '/dashboard/govt/schools', icon: School },
  { label: 'Subject Analysis', href: '/dashboard/govt/subjects', icon: BookOpen },
  { label: 'Student Insights', href: '/dashboard/govt/students', icon: GraduationCap },
  { label: 'Reports & Export', href: '/dashboard/govt/reports', icon: FileDown },
  { label: 'Alerts & Flags', href: '/dashboard/govt/alerts', icon: AlertTriangle },
]

export default function GovtLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell
      role="Education Dept."
      userName="Shri Arvind Sharma IAS"
      navItems={navItems}
      accentColor="from-rose-600 to-red-700"
    >
      {children}
    </DashboardShell>
  )
}
