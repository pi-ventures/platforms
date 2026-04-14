import { FileText, ScanLine, ClipboardList, BookOpen, School, GraduationCap } from 'lucide-react'

const institutionFeatures = [
  { icon: FileText, title: 'AI Exam Generator', desc: 'Generate CBSE/ICSE-aligned papers in seconds — MCQs, short and long answers with full marking schemes.' },
  { icon: ScanLine, title: 'Automated Unbiased Grading', desc: 'Upload scanned answer sheets — AI reads handwriting, scores semantically, gives per-question feedback.' },
  { icon: ClipboardList, title: 'Attendance System', desc: 'Digital attendance with real-time parent notifications, automated reports, and absence pattern detection.' },
  { icon: BookOpen, title: 'Course Management', desc: 'Manage chapters, upload teaching materials, build question banks, and track student progress per course.' },
  { icon: School, title: 'School Administration', desc: 'Admissions, staff & HR, fee collection, timetable builder — one command centre for the entire institution.' },
  { icon: GraduationCap, title: 'Content Management', desc: 'Curate and share learning resources with students. Upload materials, link NCERT books, manage by class.' },
]

export default function InstitutionsSection() {
  return (
    <section className="py-12 md:py-20 bg-violet-50 border-y border-violet-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 md:mb-10">
          <span className="text-xs font-bold text-violet-600 uppercase tracking-widest">For Institutions</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1.5 mb-2">Teachers &amp; Schools</h2>
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
  )
}
