'use client'
import { useState } from 'react'
import Link from 'next/link'
import { GraduationCap, CheckCircle2 } from 'lucide-react'

const roles = [
  { id: 'school', label: '🏫 School / Institution', desc: 'Set up your school on CuriousHat', href: '/dashboard/school' },
  { id: 'teacher', label: '👩‍🏫 Teacher', desc: 'Use AI tools and manage your class', href: '/dashboard/teacher' },
  { id: 'student', label: '🎓 Student', desc: 'Get AI tutoring and track your progress', href: '/dashboard/student' },
  { id: 'parent', label: '👨‍👩‍👧 Parent', desc: 'Monitor your child\'s academic journey', href: '/dashboard/parent' },
]

export default function SignupPage() {
  const [step, setStep] = useState(1)
  const [role, setRole] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '', school: '' })

  const selectedRole = roles.find(r => r.id === role)

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          <Link href="/" className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl text-white">CuriousHat<span className="text-purple-400">.ai</span></span>
          </Link>
          <div className="bg-white rounded-3xl shadow-2xl p-8">
            <h1 className="text-2xl font-black text-gray-900 mb-1">Create your account</h1>
            <p className="text-gray-500 text-sm mb-8">First, tell us who you are</p>
            <div className="space-y-3">
              {roles.map(r => (
                <button
                  key={r.id}
                  onClick={() => { setRole(r.id); setStep(2) }}
                  className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-gray-100 hover:border-indigo-400 hover:bg-indigo-50 transition-all text-left group"
                >
                  <div className="text-2xl">{r.label.split(' ')[0]}</div>
                  <div>
                    <div className="font-semibold text-gray-900 group-hover:text-indigo-700">{r.label.split(' ').slice(1).join(' ')}</div>
                    <div className="text-xs text-gray-500">{r.desc}</div>
                  </div>
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-white">CuriousHat<span className="text-purple-400">.ai</span></span>
        </Link>
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <button onClick={() => setStep(1)} className="text-xs text-indigo-600 mb-4 hover:underline">← Back</button>
          <h1 className="text-2xl font-black text-gray-900 mb-1">Create your account</h1>
          <p className="text-gray-500 text-sm mb-6">Signing up as: <span className="font-semibold text-indigo-600">{selectedRole?.label}</span></p>
          <form onSubmit={(e) => { e.preventDefault(); window.location.href = selectedRole?.href || '/' }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input type="text" required placeholder="Priya Sharma" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input type="email" required placeholder="you@school.edu" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
            </div>
            {(role === 'school' || role === 'teacher') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">School Name</label>
                <input type="text" placeholder="DPS Noida" value={form.school} onChange={e => setForm({...form, school: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" required placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
            </div>
            <div className="bg-emerald-50 rounded-xl p-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="text-xs text-emerald-700">14-day free trial • No credit card required</span>
            </div>
            <button type="submit" className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg transition-all">
              Create Account — Start Free Trial
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-4">
            By signing up, you agree to our{' '}
            <a href="#" className="text-indigo-600 hover:underline">Terms</a> and{' '}
            <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  )
}
