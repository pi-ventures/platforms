import Link from 'next/link'
import { Users, CheckCircle2, ChevronRight } from 'lucide-react'

export default function GroupStudySection() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-violet-50 to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-violet-600 uppercase tracking-widest bg-violet-100 px-3 py-1 rounded-full mb-3">
            <Users className="w-3.5 h-3.5" /> New Feature
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-3">Study together. Teach together.</h2>
          <p className="text-gray-500 text-sm max-w-xl mx-auto leading-relaxed">
            Real-time group chat rooms where students can study in small groups and teachers can broadcast resources to their entire class — all within CuriousHat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard/student/group-study" className="group bg-white border border-violet-100 rounded-2xl p-6 hover:shadow-lg hover:border-violet-300 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-2xl shadow-md">&#129489;&#8205;&#129309;&#8205;&#129489;</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Group Study</h3>
                <p className="text-xs text-violet-600 font-semibold">For Students</p>
              </div>
            </div>
            <p className="text-gray-500 text-sm mb-5 leading-relaxed">
              Create private study rooms with classmates. Share NCERT books, reference materials, and notes directly in the chat. Study smarter together.
            </p>
            <div className="space-y-2.5 mb-5">
              {['Share books & notes in group chat', 'Listen to audiobooks together', 'Ask AI Tutor for any shared book', 'Multiple groups — JEE, NEET, subject-wise'].map(f => (
                <div key={f} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">RS</div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-1.5 text-xs text-gray-700 max-w-[70%]">Sharing Physics HC Verma</div>
              </div>
              <div className="flex items-end gap-2 flex-row-reverse">
                <div className="bg-violet-600 rounded-2xl rounded-br-sm px-3 py-1.5 text-xs text-white max-w-[70%]">Perfect! Starting Ch 3</div>
              </div>
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">KM</div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-1.5 text-xs text-gray-700">Mock test Saturday 9 AM?</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-violet-600 group-hover:gap-2 transition-all">
              Join Study Groups <ChevronRight className="w-4 h-4" />
            </div>
          </Link>

          <Link href="/dashboard/teacher/teaching-groups" className="group bg-white border border-indigo-100 rounded-2xl p-6 hover:shadow-lg hover:border-indigo-300 transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-2xl shadow-md">&#128105;&#8205;&#127979;</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Teaching Groups</h3>
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
            <div className="bg-gray-50 rounded-xl p-3 space-y-2 border border-gray-100">
              <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-xs text-amber-800 text-center">
                Unit Test on Friday — Chapters 1-3
              </div>
              <div className="flex items-end gap-2 flex-row-reverse">
                <div className="bg-indigo-600 rounded-2xl rounded-br-sm px-3 py-1.5 text-xs text-white max-w-[70%]">Sharing NCERT Physics XII</div>
              </div>
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0">AV</div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-3 py-1.5 text-xs text-gray-700">Thank you ma&apos;am</div>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-indigo-600 group-hover:gap-2 transition-all">
              Manage Teaching Groups <ChevronRight className="w-4 h-4" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
