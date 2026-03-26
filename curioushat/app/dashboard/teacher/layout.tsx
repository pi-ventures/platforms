'use client'
import DashboardShell from '@/components/dashboard/DashboardShell'
import { LayoutDashboard, FileText, ScanLine, ClipboardList, BarChart3, BookOpen, Bell, Library, GraduationCap, Users } from 'lucide-react'

const navItems = [
  { label: 'Teaching Library', href: '/dashboard/teacher/library', icon: Library },
  { label: 'Teaching Groups', href: '/dashboard/teacher/teaching-groups', icon: Users },
  { label: 'Exam Generator', href: '/dashboard/teacher/exam-generator', icon: FileText },
  { label: 'Answer Grader', href: '/dashboard/teacher/grader', icon: ScanLine },
  { label: 'My Courses', href: '/dashboard/teacher/courses', icon: GraduationCap },
  { label: 'Attendance', href: '/dashboard/teacher/attendance', icon: ClipboardList },
  { label: 'Gradebook', href: '/dashboard/teacher/gradebook', icon: BarChart3 },
  { label: 'Question Bank', href: '/dashboard/teacher/question-bank', icon: BookOpen },
  { label: 'Announcements', href: '/dashboard/teacher/announcements', icon: Bell },
  { label: 'My Summary', href: '/dashboard/teacher', icon: LayoutDashboard },
]

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <DashboardShell role="Teacher" userName="Ms. Priya Gupta" navItems={navItems} accentColor="indigo">
      {children}
    </DashboardShell>
  )
}
