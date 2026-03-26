import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CuriousHat.ai — AI-Powered School Management Platform',
  description: 'Transform education with AI. Smart tutoring, exam generation, OCR grading, and complete school management for teachers, students, parents, and administrators.',
  keywords: 'AI education, school management, AI tutoring, exam generator, OCR grading, student dashboard',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
  openGraph: {
    title: 'CuriousHat.ai',
    description: 'AI-Powered School Management Platform',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'CuriousHat.ai',
    description: 'AI-Powered School Management Platform',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
