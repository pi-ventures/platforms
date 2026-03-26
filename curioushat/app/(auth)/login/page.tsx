'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { GraduationCap, Eye, EyeOff, Loader2 } from 'lucide-react'

const roles = [
  { id: 'student', label: '🎓 Student', href: '/dashboard/student' },
  { id: 'teacher', label: '👩‍🏫 Teacher', href: '/dashboard/teacher' },
  { id: 'parent', label: '👨‍👩‍👧 Parent', href: '/dashboard/parent' },
  { id: 'school', label: '🏫 School Admin', href: '/dashboard/school' },
  { id: 'govt', label: '🏛 Govt. Officer', href: '/dashboard/govt' },
]

export default function LoginPage() {
  const router = useRouter()
  const [role, setRole] = useState('student')
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const selectedRole = roles.find(r => r.id === role)!

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-purple-950 to-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-2xl text-white">
            Curious<span className="text-violet-400">Hat</span><span className="text-purple-400">.ai</span>
          </span>
        </Link>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h1 className="text-2xl font-black text-gray-900 mb-1">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-6">Sign in to your account</p>

          {/* Role Tabs */}
          <div className="grid grid-cols-2 gap-2 mb-6" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
            {roles.map(r => (
              <button
                key={r.id}
                onClick={() => setRole(r.id)}
                className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-all ${role === r.id ? 'bg-violet-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={async (e) => { e.preventDefault(); setLoading(true); await new Promise(r => setTimeout(r, 700)); router.push(selectedRole.href) }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email" required value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@school.edu"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs text-violet-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none pr-10"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-violet-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Signing in...</> : `Sign in as ${roles.find(r => r.id === role)?.label.split(' ').slice(1).join(' ')}`}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            {"Don't have an account? "}
            <Link href="/signup" className="text-violet-600 font-semibold hover:underline">Sign up free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
