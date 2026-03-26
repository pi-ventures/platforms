'use client'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { LayoutDashboard, FileText, BarChart3, Calendar, Bell, BookOpen, Library, Users, GraduationCap, User, Award, Building2, Languages } from 'lucide-react'

const navItems = [
  { label: 'My Profile', href: '/dashboard/student/profile', icon: User },
  { label: 'Library', href: '/dashboard/student/library', icon: Library },
  { label: 'Learn Languages', href: '/dashboard/student/learn-languages', icon: Languages },
  { label: 'Entrance Exams', href: '/dashboard/student/entrance-exams', icon: GraduationCap },
  { label: 'Govt Job Prep', href: '/dashboard/student/govt-jobs', icon: Building2 },
  { label: 'Group Study', href: '/dashboard/student/group-study', icon: Users },
  { label: 'My Courses', href: '/dashboard/student/courses', icon: BookOpen },
  { label: 'My Exams', href: '/dashboard/student/exams', icon: FileText },
  { label: 'Grades', href: '/dashboard/student/grades', icon: BarChart3 },
  { label: 'Timetable', href: '/dashboard/student/timetable', icon: Calendar },
  { label: 'Announcements', href: '/dashboard/student/announcements', icon: Bell },
  { label: 'My Summary', href: '/dashboard/student', icon: LayoutDashboard },
]

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="Student" userName="Om Aditya Raghuvanshi" navItems={navItems} accentColor="indigo">
      {children}
    </DashboardShell>
  )
}
