import Link from 'next/link'
import { Brain, FileText, ScanLine, BarChart3, ClipboardList, Users, School, BookOpen, Calendar, DollarSign, UserPlus, Bell, Award, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react'

const moduleGroups = [
  {
    category: 'AI-Powered Features',
    color: 'from-violet-600 to-indigo-600',
    modules: [
      {
        icon: Brain,
        title: 'AI Tutoring (Vision)',
        desc: 'Claude Vision reads any image — textbook pages, handwritten notes, diagrams, equations — and delivers structured explanations with real-world context. Works with CBSE, ICSE, and all state boards.',
        highlights: ['Image-based Q&A', 'Step-by-step explanations', 'Real-world applications', 'Multi-board support', 'Voice output (coming soon)']
      },
      {
        icon: FileText,
        title: 'AI Exam Paper Generator',
        desc: 'Generate complete, board-aligned exam papers in under 60 seconds. Specify subject, class, chapter, marks distribution, and difficulty — Claude produces the full paper with a marking scheme.',
        highlights: ['CBSE / ICSE / State boards', 'MCQ + Short + Long questions', 'Auto marking scheme', 'PDF / Word export', 'Question bank integration']
      },
      {
        icon: ScanLine,
        title: 'AI Answer Sheet OCR Grader',
        desc: 'Upload scanned or photographed answer sheets. Claude Vision reads the handwriting, semantically evaluates each answer against the model answer, and assigns marks with feedback.',
        highlights: ['Handwriting recognition', 'Semantic scoring', 'Per-question feedback', 'Teacher override UI', 'Bulk batch processing']
      },
    ]
  },
  {
    category: 'School Management',
    color: 'from-blue-600 to-teal-600',
    modules: [
      {
        icon: ClipboardList,
        title: 'Attendance Management',
        desc: 'Digital roll call with instant parent SMS/email notifications. Auto-detect chronic absence patterns and generate compliance reports for school boards.',
        highlights: ['One-click attendance', 'Parent notifications', 'Absence pattern AI', 'Monthly reports', 'Leave management']
      },
      {
        icon: Calendar,
        title: 'Timetable Builder',
        desc: 'Drag-and-drop timetable creation with conflict detection. Auto-assign free periods, manage substitutions, and share live schedules with students and parents.',
        highlights: ['Conflict detection', 'Drag-and-drop UI', 'Substitution management', 'Live student view', 'Export to PDF']
      },
      {
        icon: BarChart3,
        title: 'Gradebook & Report Cards',
        desc: 'Track continuous assessment, term marks, and cumulative performance. Auto-generate CBSE/ICSE-format report cards with AI-written teacher remarks.',
        highlights: ['Continuous assessment', 'Term & cumulative marks', 'AI teacher remarks', 'Custom report templates', 'Parent auto-delivery']
      },
      {
        icon: DollarSign,
        title: 'Fee Management',
        desc: 'Online fee collection with Razorpay/Stripe, automated receipts, overdue reminders, and real-time fee defaulter tracking for the accounts department.',
        highlights: ['Online payments', 'Auto receipts', 'Overdue reminders', 'Sibling discounts', 'Scholarship management']
      },
      {
        icon: UserPlus,
        title: 'Admissions Module',
        desc: 'End-to-end digital admissions — online applications, document collection, merit list generation, and automated communication with applicants and parents.',
        highlights: ['Online application form', 'Document uploads', 'Merit list AI', 'Automated emails', 'Seat availability tracker']
      },
      {
        icon: Users,
        title: 'Staff & HR',
        desc: 'Manage teacher and non-teaching staff records, leaves, payroll, and appraisals. Track certifications and send renewal reminders automatically.',
        highlights: ['Employee records', 'Leave management', 'Payroll processing', 'Appraisal module', 'Training tracker']
      },
      {
        icon: Bell,
        title: 'Announcements & Communication',
        desc: 'Push school-wide or targeted announcements to students, parents, or staff via in-app notifications, email, and WhatsApp integration.',
        highlights: ['Targeted announcements', 'WhatsApp integration', 'Email broadcasts', 'Scheduled posts', 'Read receipts']
      },
      {
        icon: BookOpen,
        title: 'Question Bank',
        desc: 'Build and manage a searchable question library organised by subject, topic, chapter, difficulty, and bloom\'s taxonomy level. Reuse in exam generation.',
        highlights: ["Subject/topic taxonomy", "Bloom's levels", 'Difficulty tagging', 'AI question generation', 'Exam integration']
      },
    ]
  }
]

export default function FeaturesPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-950 to-purple-950 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <span className="inline-block bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            All Features
          </span>
          <h1 className="text-5xl font-black mb-6">Everything your school needs</h1>
          <p className="text-xl text-indigo-200 mb-8">AI-powered education tools + complete school management — built together, not bolted on.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-colors">
            Start Free Trial <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Module Groups */}
      {moduleGroups.map(group => (
        <section key={group.category} className="py-20 even:bg-gray-50 odd:bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12">
              <span className={`inline-block bg-gradient-to-r ${group.color} text-white text-sm font-bold px-4 py-1.5 rounded-full`}>
                {group.category}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.modules.map(m => (
                <div key={m.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all">
                  <div className="w-11 h-11 bg-indigo-50 rounded-xl flex items-center justify-center mb-4">
                    <m.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{m.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{m.desc}</p>
                  <ul className="space-y-1.5">
                    {m.highlights.map(h => (
                      <li key={h} className="flex items-center gap-2 text-xs text-gray-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{h}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700 text-center text-white">
        <h2 className="text-4xl font-black mb-4">Ready to see it in action?</h2>
        <p className="text-indigo-200 text-xl mb-8">Start your free 14-day trial — no credit card required</p>
        <Link href="/signup" className="inline-block bg-white text-indigo-700 font-bold px-8 py-4 rounded-2xl hover:bg-indigo-50 transition-colors text-lg">
          Get Started Free
        </Link>
      </section>
    </div>
  )
}
