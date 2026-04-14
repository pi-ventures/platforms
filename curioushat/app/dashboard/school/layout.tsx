'use client'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { LayoutDashboard, UserPlus, Users, Calendar, DollarSign, Bell, BookOpen, TrendingUp, Sparkles, Shield, Award, Target, Landmark, Languages } from 'lucide-react'

const navItems = [
  { label: 'Overview', href: '/dashboard/school', icon: LayoutDashboard },
  { label: 'Govt Schemes', href: '/dashboard/school/govt-schemes', icon: Shield },
  { label: 'Content Pipeline', href: '/dashboard/school/content-pipeline', icon: Sparkles },
  { label: 'Learn Languages', href: '/dashboard/school/learn-languages', icon: Languages },
  { label: 'Student Profiles', href: '/dashboard/school/student-profiles', icon: Target },
  { label: 'Admissions', href: '/dashboard/school/admissions', icon: UserPlus },
  { label: 'Staff & HR', href: '/dashboard/school/staff', icon: Users },
  { label: 'Timetable', href: '/dashboard/school/timetable', icon: Calendar },
  { label: 'Fee Management', href: '/dashboard/school/fees', icon: DollarSign },
  { label: 'Finance Dept', href: '/dashboard/school/finance', icon: Landmark },
  { label: 'Announcements', href: '/dashboard/school/announcements', icon: Bell },
  { label: 'Reports', href: '/dashboard/school/reports', icon: TrendingUp },
]

export default function SchoolLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="School Admin" userName="Principal Dr. Sunita Rao" navItems={navItems} accentColor="from-indigo-700 to-blue-600">
      {children}
    </DashboardShell>
  )
}
