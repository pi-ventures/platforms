'use client'
import { useState } from 'react'
import Navbar from '@/components/marketing/Navbar'
import Footer from '@/components/marketing/Footer'
import Link from 'next/link'
import {
  Brain, FileText, ScanLine, BarChart3, Users, School,
  Star, ArrowRight, CheckCircle2, BookOpen, ClipboardList,
  ChevronRight, Sparkles, Award, Library, GraduationCap
} from 'lucide-react'

/* ── Educational SVG doodles ── */
function DoodlePencil({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M36 4l8 8-26 26H10v-8L36 4z" /><path d="M30 10l8 8" /><path d="M10 36v2" />
    </svg>
  )
}
function DoodleRuler({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 60 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="1" y="1" width="58" height="18" rx="2" />
      {[8,14,20,26,32,38,44,50].map((x,i) => (
        <line key={i} x1={x} y1="1" x2={x} y2={i%2===0?10:7} />
      ))}
    </svg>
  )
}
function DoodleAtom({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <ellipse cx="24" cy="24" rx="20" ry="8" />
      <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(60 24 24)" />
      <ellipse cx="24" cy="24" rx="20" ry="8" transform="rotate(120 24 24)" />
      <circle cx="24" cy="24" r="3" fill="currentColor" />
    </svg>
  )
}
function DoodleStar({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
    </svg>
  )
}
function DoodleBook({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="4" y="4" width="14" height="32" rx="2" />
      <rect x="22" y="4" width="14" height="32" rx="2" />
      <path d="M18 4v32M4 8h14M4 14h14M4 20h14M22 8h14M22 14h14M22 20h14" strokeWidth="1" strokeDasharray="3 2" />
    </svg>
  )
}
function DoodlePi({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 8h24M12 8v16M20 8c0 8 2 16 6 16" />
    </svg>
  )
}
function DoodleGlobe({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="20" cy="20" r="16" />
      <path d="M4 20h32M20 4c-4 4-6 9-6 16s2 12 6 16M20 4c4 4 6 9 6 16s-2 12-6 16" />
    </svg>
  )
}

/* ── Split features ── */
const individualFeatures = [
  { icon: Brain, title: 'AI Tutoring', desc: 'Snap a photo of any question — Claude Vision or GPT-4o explains it step-by-step with real-world context.' },
  { icon: Library, title: 'Digital Library', desc: 'Browse NCERT textbooks, reference books, music, fashion design courses — across all classes, 43+ languages, with accredited certifications.' },
  { icon: BarChart3, title: 'Progress Tracking', desc: 'Students and parents get real-time visibility into grades, attendance, assignments, and improvement trends.' },
  { icon: Users, title: 'Parent Portal', desc: 'Track your child\'s performance, attendance, fees, and directly communicate with subject teachers.' },
]

const institutionFeatures = [
  { icon: FileText, title: 'AI Exam Generator', desc: 'Generate CBSE/ICSE-aligned papers in seconds — MCQs, short and long answers with full marking schemes.' },
  { icon: ScanLine, title: 'Automated Unbiased Grading', desc: 'Upload scanned answer sheets — AI reads handwriting, scores semantically, gives per-question feedback.' },
  { icon: ClipboardList, title: 'Attendance System', desc: 'Digital attendance with real-time parent notifications, automated reports, and absence pattern detection.' },
  { icon: BookOpen, title: 'Course Management', desc: 'Manage chapters, upload teaching materials, build question banks, and track student progress per course.' },
  { icon: School, title: 'School Administration', desc: 'Admissions, staff & HR, fee collection, timetable builder — one command centre for the entire institution.' },
  { icon: GraduationCap, title: 'Content Management', desc: 'Curate and share learning resources with students. Upload materials, link NCERT books, manage by class.' },
]

const stats = [
  { value: '10,000+', label: 'Books in Library' },
  { value: '50K+', label: 'Students Enrolled' },
  { value: '2,000+', label: 'Teachers Using AI' },
  { value: '500+', label: 'Schools Onboarded' },
  { value: '43+', label: 'Languages (23 Indian + 20 International)' },
]

const testimonials = [
  {
    name: 'Priya Sharma', role: 'Principal, DPS Noida', avatar: 'PS',
    quote: 'CuriousHat.ai completely transformed how we manage exams. Paper generation that used to take days now takes minutes.',
  },
  {
    name: 'Rajesh Kumar', role: 'Science Teacher, KV Delhi', avatar: 'RK',
    quote: 'The OCR grading is magic. I grade 120 answer sheets in the time it used to take me to grade 20.',
  },
  {
    name: 'Meera Nair', role: 'Parent of Class 9 Student', avatar: 'MN',
    quote: "My daughter uses the AI tutor every evening. Her grades have improved and she's more confident.",
  },
]

const individuals = [
  {
    icon: Award, title: 'Students', href: '/dashboard/student',
    desc: 'AI tutoring, digital library across all grades, results, timetable and more.',
    features: ['My Courses', 'Digital Library (All Grades)', 'AI Tutor', 'Results & Grades', 'Group Study Rooms'],
  },
  {
    icon: Users, title: 'Parents', href: '/dashboard/parent',
    desc: 'Track your child\'s progress, attendance, fees and talk to teachers.',
    features: ['Academic Progress', 'Attendance Alerts', 'Fee Payments', 'Report Cards', 'Teacher Chat'],
  },
]

const institutions = [
  {
    icon: BookOpen, title: 'Teachers', href: '/dashboard/teacher',
    desc: 'Generate exams, grade automatically, manage courses and share resources with students.',
    features: ['Courses & Library (All Grades)', 'Exam Generator', 'OCR Grader', 'Teaching Groups', 'Question Bank'],
  },
  {
    icon: School, title: 'School Admin', href: '/dashboard/school',
    desc: 'Manage admissions, staff, fees, timetables and announcements from one place.',
    features: ['Admissions', 'Staff & HR', 'Fee Collection', 'Content Pipeline', 'Timetable'],
  },
]

const higherEd = [
  {
    icon: GraduationCap, title: 'College / Coaching / Academy', href: '/dashboard/college',
    desc: 'One dashboard for colleges, coaching institutes, and academies (aviation, design, film). AI admission leads, test series, batch management.',
    features: ['AI Admission Leads', 'Test Series & Mock Tests', 'Student Performance AI', 'Batch Management', 'Placement Tracking'],
  },
  {
    icon: School, title: 'University', href: '/dashboard/university',
    desc: 'Monitor all affiliated colleges, university-wide examinations, NAAC accreditation, research output, and admission pipelines.',
    features: ['Affiliated College Monitoring', 'Examination Intelligence', 'NAAC Compliance', 'Research & Publications', 'Admission Pipeline'],
  },
]

const pricingPlans = [
  {
    name: 'Individual', monthlyPrice: 2000,
    desc: 'For students and parents learning at their own pace',
    features: ['FREE upto grade 5', 'AI Tutoring', 'Exam Generator'],
    cta: 'Start Free Trial', highlighted: false,
  },
  {
    name: 'Institutional', monthlyPrice: 1800,
    desc: 'Perfect for small schools getting started with AI',
    features: ['FREE upto grade 5', 'Up to 200 students', 'AI Tutoring', 'Exam Generator', 'Basic Attendance', 'Email Support'],
    cta: 'Start Free Trial', highlighted: false,
  },
  {
    name: 'Institutional +', monthlyPrice: 1500,
    desc: 'For growing institutions that want the full AI stack',
    features: ['FREE upto grade 5', 'Up to 1,000 students', 'Everything in Institutional', 'OCR Grading', 'Parent Portal', 'Gradebook & Reports', 'Priority Support'],
    cta: 'Start Free Trial', highlighted: true,
  },
]

function formatPrice(monthly: number, billing: 'monthly' | 'annual') {
  const price = billing === 'annual' ? Math.round(monthly * 0.9) : monthly
  return '₹' + price.toLocaleString('en-IN')
}

export default function HomePage() {
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-24 sm:pt-28 pb-14 sm:pb-20 overflow-x-hidden border-b border-gray-100">
        {/* Doodles — hidden on xs, shown sm+ */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden hidden sm:block">
          <DoodlePencil className="absolute top-16 left-[6%] w-14 h-14 text-violet-200 rotate-[-20deg]" />
          <DoodleAtom className="absolute top-24 right-[8%] w-16 h-16 text-violet-100" />
          <DoodleBook className="absolute bottom-12 left-[12%] w-16 h-16 text-gray-200" />
          <DoodleRuler className="absolute top-36 left-[40%] w-24 h-8 text-violet-100 rotate-3" />
          <DoodleGlobe className="absolute bottom-16 right-[10%] w-14 h-14 text-violet-100" />
          <DoodlePi className="absolute top-12 left-[55%] w-10 h-10 text-violet-200" />
          <DoodleStar className="absolute bottom-24 left-[30%] w-8 h-8 text-amber-200" />
          <DoodleStar className="absolute top-20 right-[25%] w-6 h-6 text-amber-200" />
          <DoodleStar className="absolute bottom-16 right-[35%] w-5 h-5 text-amber-100" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 bg-violet-50 border border-violet-100 text-violet-600 text-xs sm:text-sm font-medium px-3 sm:px-4 py-1.5 rounded-full mb-6 sm:mb-8">
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
            Powered by Claude &amp; GPT-4o Vision AI
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 leading-tight tracking-tight mb-4 sm:mb-6 lg:whitespace-nowrap">
            Learn from the best &amp; latest <span className="text-violet-600">in the world.</span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed mb-8 sm:mb-10">
            AI driven Learning Content for Students &amp; Schools, Digital courses library,
            Complete school management and Automated unbiased grading.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-10 sm:mb-16">
            <Link href="/signup" className="w-full sm:w-auto flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-sm sm:text-base px-6 sm:px-7 py-3 rounded-xl shadow-sm transition-colors">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/features" className="w-full sm:w-auto flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 font-medium text-sm sm:text-base px-5 sm:px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-all bg-white">
              View Features
            </Link>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3 max-w-3xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-2 sm:p-3 text-center">
                <div className="text-sm sm:text-base lg:text-lg font-black text-gray-900 leading-tight">{s.value}</div>
                <div className="text-[9px] sm:text-[10px] lg:text-xs text-gray-500 mt-0.5 leading-tight">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INDIVIDUALS FEATURES ── */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-10">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">For Individuals</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1.5 mb-2">Students &amp; Parents</h2>
            <p className="text-gray-500 text-sm max-w-lg">Learning tools and progress visibility for every student and family</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {individualFeatures.map((f) => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-violet-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTITUTIONS FEATURES ── */}
      <section className="py-12 md:py-20 bg-violet-50 border-y border-violet-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 md:mb-10">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">For Institutions</span>
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mt-1.5 mb-2">Teachers &amp; Schools</h2>
            <p className="text-gray-500 text-sm max-w-lg">AI-powered tools for exam generation, grading, and complete school management</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {institutionFeatures.map((f) => (
              <div key={f.title} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-violet-300 hover:shadow-sm transition-all">
                <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mb-4">
                  <f.icon className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 mb-1.5">{f.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DASHBOARDS — INDIVIDUALS ── */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">Dashboards</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mt-2 mb-3">Built for every role</h2>
          </div>

          {/* Individuals row */}
          <div className="mb-4">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-gray-200 inline-block" /> Individuals <span className="flex-1 h-px bg-gray-200 inline-block" />
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {individuals.map((role) => (
                <Link key={role.title} href={role.href} className="group bg-white border border-gray-200 rounded-xl p-6 hover:border-violet-300 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-100 transition-colors">
                    <role.icon className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5">{role.title}</h3>
                  <p className="text-gray-500 mb-4 text-sm leading-relaxed">{role.desc}</p>
                  <ul className="space-y-1.5 mb-5">
                    {role.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <span className="flex items-center gap-1 text-sm font-semibold text-violet-600 group-hover:gap-2 transition-all">
                    Explore Dashboard <ChevronRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-dashed border-gray-200" />

          {/* Institutions row */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-gray-200 inline-block" /> Institutions <span className="flex-1 h-px bg-gray-200 inline-block" />
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {institutions.map((role) => (
                <Link key={role.title} href={role.href} className="group bg-violet-50 border border-violet-100 rounded-xl p-6 hover:border-violet-300 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 bg-white border border-violet-200 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-50 transition-colors">
                    <role.icon className="w-5 h-5 text-violet-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5">{role.title}</h3>
                  <p className="text-gray-500 mb-4 text-sm leading-relaxed">{role.desc}</p>
                  <ul className="space-y-1.5 mb-5">
                    {role.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <span className="flex items-center gap-1 text-sm font-semibold text-violet-600 group-hover:gap-2 transition-all">
                    Explore Dashboard <ChevronRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-dashed border-gray-200" />

          {/* Higher Education row */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-6 h-px bg-gray-200 inline-block" /> Higher Education & Coaching <span className="flex-1 h-px bg-gray-200 inline-block" />
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {higherEd.map((role) => (
                <Link key={role.title} href={role.href} className="group bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 rounded-xl p-6 hover:border-indigo-300 hover:shadow-sm transition-all">
                  <div className="w-10 h-10 bg-white border border-indigo-200 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-50 transition-colors">
                    <role.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1.5">{role.title}</h3>
                  <p className="text-gray-500 mb-4 text-sm leading-relaxed">{role.desc}</p>
                  <ul className="space-y-1.5 mb-5">
                    {role.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <span className="flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:gap-2 transition-all">
                    Explore Dashboard <ChevronRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GROUP STUDY / TEACHING GROUPS HIGHLIGHT ── */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-violet-50 to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 uppercase tracking-widest bg-violet-100 px-3 py-1 rounded-full mb-3">
              <Users className="w-3.5 h-3.5" /> New Feature
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mt-2 mb-3">Study together. Teach together.</h2>
            <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
              Real-time group chat rooms where students can study in small groups and teachers can broadcast resources to their entire class — all within CuriousHat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Group Study */}
            <Link href="/dashboard/student/group-study" className="group bg-white border border-violet-100 rounded-2xl p-6 hover:shadow-lg hover:border-violet-300 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-2xl shadow-md">🧑‍🤝‍🧑</div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Group Study</h3>
                  <p className="text-xs text-violet-600 font-semibold">For Students</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                Create private study rooms with classmates. Share NCERT books, reference materials, and notes directly in the chat. Study smarter together.
              </p>
              <div className="space-y-2.5 mb-5">
                {['Share books & notes in group chat', 'Listen to audiobooks together', 'Ask AI Tutor for any shared book ★', 'Multiple groups — JEE, NEET, subject-wise'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              {/* Mini chat preview */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">RS</div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-1.5 text-xs text-gray-700 max-w-[70%]">Sharing Physics HC Verma 📚</div>
                </div>
                <div className="flex items-end gap-2 flex-row-reverse">
                  <div className="bg-violet-600 rounded-2xl rounded-br-sm px-3 py-1.5 text-xs text-white max-w-[70%]">Perfect! Starting Ch 3 🚀</div>
                </div>
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">KM</div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-1.5 text-xs text-gray-700">Mock test Saturday 9 AM? 🎯</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-violet-600 group-hover:gap-2 transition-all">
                Join Study Groups <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Teaching Groups */}
            <Link href="/dashboard/teacher/teaching-groups" className="group bg-white border border-indigo-100 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-md">👩‍🏫</div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Teaching Groups</h3>
                  <p className="text-xs text-indigo-600 font-semibold">For Teachers</p>
                </div>
              </div>
              <p className="text-gray-500 text-sm mb-5 leading-relaxed">
                Manage dedicated class groups. Share textbooks, assignments, and announcements directly with students. Pin important notices for the whole class.
              </p>
              <div className="space-y-2.5 mb-5">
                {['Broadcast books & materials to class', 'Pin announcements for all students', 'Multiple groups per subject & section', 'Students can ask doubts in the group'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 flex-shrink-0" />
                    {f}
                  </div>
                ))}
              </div>
              {/* Mini chat preview */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
                <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-xs text-amber-800 text-center">
                  📌 Unit Test on Friday — Chapters 1–3
                </div>
                <div className="flex items-end gap-2 flex-row-reverse">
                  <div className="bg-indigo-600 rounded-2xl rounded-br-sm px-3 py-1.5 text-xs text-white max-w-[70%]">Sharing NCERT Physics XII 📖</div>
                </div>
                <div className="flex items-end gap-2">
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">AV</div>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-1.5 text-xs text-gray-700">Thank you ma&apos;am 🙏</div>
                </div>
              </div>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:gap-2 transition-all">
                Manage Teaching Groups <ChevronRight className="w-4 h-4" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── MULTILINGUAL + CREATIVE ARTS ── */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full mb-3">
              🌐 Only Platform
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mt-2 mb-3">43+ Languages. Accredited Certifications.</h2>
            <p className="text-gray-500 text-sm max-w-2xl mx-auto leading-relaxed">
              The only EdTech platform supporting all 23 Indian languages + 20 international languages with accredited certifications — issued through <span className="text-violet-600 font-semibold">Gurukul Global Vidyaniketan</span> (Gurukul.foundation) — from DELF, Goethe, JLPT, HSK, TOPIK, DELE, Trinity College London, NIFT, and more.
            </p>
          </div>

          {/* 3-col feature grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Languages */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6">
              <div className="text-3xl mb-3">🌍</div>
              <h3 className="font-black text-gray-900 mb-2">43+ Languages</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">All 23 Indian scheduled languages + French, Spanish, German, Mandarin, Japanese, Korean, Arabic, and 13 more — with AI tutoring in each.</p>
              <div className="flex flex-wrap gap-1">
                {['🇫🇷','🇪🇸','🇩🇪','🇨🇳','🇯🇵','🇰🇷','🇸🇦','🇧🇷','🇷🇺','🇮🇹'].map((f, i) => (
                  <span key={i} className="text-lg">{f}</span>
                ))}
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium self-center ml-1">+33 more</span>
              </div>
            </div>

            {/* Music */}
            <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-100 rounded-2xl p-6">
              <div className="text-3xl mb-3">🎵</div>
              <h3 className="font-black text-gray-900 mb-2">Music &amp; Performing Arts</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">Hindustani &amp; Carnatic classical, Western theory, music production, Bharatanatyam, theatre — from Class III to Postgraduate.</p>
              <div className="flex flex-wrap gap-1.5">
                {['Trinity College','ABRSM','London College of Music'].map(c => (
                  <span key={c} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">🏅 {c}</span>
                ))}
              </div>
            </div>

            {/* Fashion */}
            <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-6">
              <div className="text-3xl mb-3">👗</div>
              <h3 className="font-black text-gray-900 mb-2">Fashion &amp; Design</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">Higher education fashion courses with industry tie-ups — design fundamentals, textile science, sustainable fashion, fashion business.</p>
              <div className="flex flex-wrap gap-1.5">
                {['NIFT','Pearl Academy','Parsons Affiliate'].map(c => (
                  <span key={c} className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full font-medium">🏅 {c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Certifications marquee */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold text-center mb-2">Accredited Certification Partners</p>
            <p className="text-[11px] text-gray-500 text-center mb-3">All certifications issued through <a href="https://gurukul.foundation" target="_blank" rel="noopener noreferrer" className="text-violet-600 font-semibold hover:underline">Gurukul Global Vidyaniketan</a> (Gurukul.foundation)</p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                'DELF/DALF (French)','Goethe-Zertifikat (German)','JLPT (Japanese)','HSK (Mandarin)',
                'TOPIK (Korean)','DELE (Spanish)','Trinity College London','ABRSM',
                'London College of Music','NIFT','Pearl Academy','Parsons School of Design',
                'Cambridge IGCSE','IB Diploma','UGC Recognised','AICTE Approved',
              ].map(c => (
                <span key={c} className="text-[10px] bg-white border border-gray-200 text-gray-600 px-2.5 py-1 rounded-lg font-medium">🏅 {c}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-12 md:py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900 mb-2">Loved by educators &amp; parents</h2>
            <div className="flex items-center justify-center gap-0.5 mb-1">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
            </div>
            <p className="text-gray-400 text-sm">Trusted by 500+ schools across India</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-violet-200 transition-colors">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-violet-100 rounded-full flex items-center justify-center text-violet-700 font-bold text-xs">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="py-12 md:py-20 bg-gray-50 border-y border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-10">
            <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">Pricing</span>
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-gray-900 mt-2 mb-2 px-2">
              @ less than your monthly house-helper cost
            </h2>
            <p className="text-gray-500 text-sm">14-day free trial · No credit card required</p>

            {/* Monthly / Annual toggle */}
            <div className="inline-flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 mt-5 sm:mt-6">
              <button
                onClick={() => setBilling('monthly')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${billing === 'monthly' ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling('annual')}
                className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${billing === 'annual' ? 'bg-violet-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Annual
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ${billing === 'annual' ? 'bg-white text-violet-600' : 'bg-green-100 text-green-700'}`}>
                  −10%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-4xl mx-auto">
            {pricingPlans.map(plan => (
              <div key={plan.name} className={`relative rounded-xl p-5 sm:p-7 border-2 transition-all flex flex-col ${plan.highlighted ? 'border-violet-600 bg-violet-600 text-white shadow-lg' : 'border-gray-200 bg-white hover:border-violet-200'}`}>
                <h3 className={`text-base sm:text-lg font-bold mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <p className={`text-xs sm:text-sm mb-3 sm:mb-4 ${plan.highlighted ? 'text-violet-200' : 'text-gray-500'}`}>{plan.desc}</p>
                <div className={`mb-1 ${plan.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  <span className="text-3xl sm:text-4xl font-black">{formatPrice(plan.monthlyPrice, billing)}</span>
                  <span className={`text-xs sm:text-sm font-normal ml-1 ${plan.highlighted ? 'text-violet-300' : 'text-gray-400'}`}>/student/mo</span>
                </div>
                {billing === 'annual' && (
                  <p className={`text-xs mb-4 ${plan.highlighted ? 'text-violet-200' : 'text-green-600'}`}>
                    Billed annually · save {Math.round(plan.monthlyPrice * 0.1 * 12).toLocaleString('en-IN')} ₹/student/yr
                  </p>
                )}
                {billing === 'monthly' && <div className="mb-4" />}
                <ul className="space-y-2.5 mb-7 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.highlighted ? 'text-violet-200' : 'text-violet-400'}`} />
                      <span className={plan.highlighted ? 'text-violet-100' : 'text-gray-700'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`mt-auto block text-center font-semibold py-3 rounded-xl transition-all text-sm ${plan.highlighted ? 'bg-white text-violet-600 hover:bg-violet-50' : 'bg-violet-600 text-white hover:bg-violet-700'}`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-12 sm:py-16 bg-violet-50 border-t border-violet-100">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <div className="hidden sm:flex items-center justify-center gap-4 sm:gap-6 mb-6 sm:mb-8 opacity-30">
            <DoodlePencil className="w-8 h-8 sm:w-10 sm:h-10 text-violet-600" />
            <DoodleBook className="w-8 h-8 sm:w-10 sm:h-10 text-violet-600" />
            <DoodleAtom className="w-8 h-8 sm:w-10 sm:h-10 text-violet-600" />
            <DoodleRuler className="w-12 h-5 sm:w-16 sm:h-6 text-violet-600" />
            <DoodleGlobe className="w-8 h-8 sm:w-10 sm:h-10 text-violet-600" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 mb-3 sm:mb-4">
            Ready to transform your school?
          </h2>
          <p className="text-gray-500 text-sm sm:text-base mb-6 sm:mb-8">
            Join 500+ schools already using CuriousHat.ai. Start your free 14-day trial today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/signup" className="w-full sm:w-auto text-center bg-violet-600 text-white font-semibold px-7 py-3 rounded-xl hover:bg-violet-700 transition-colors text-sm">
              Start Free Trial
            </Link>
            <Link href="/contact" className="w-full sm:w-auto text-center border border-gray-300 text-gray-700 font-medium px-7 py-3 rounded-xl hover:border-gray-400 transition-colors text-sm bg-white">
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
