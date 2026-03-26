'use client'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', role: 'School Admin', school: '', message: '' })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-gray-50 py-20 text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-5xl font-black text-gray-900 mb-4">Get in touch</h1>
          <p className="text-xl text-gray-600">Whether you want a demo, have questions, or want to partner with us — we'd love to hear from you.</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Send us a message</h2>
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Message received!</h3>
                <p className="text-gray-600">We'll get back to you within 24 hours. Check your email for a confirmation.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                    <input type="text" required placeholder="Rajesh Kumar" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input type="email" required placeholder="you@school.edu" value={form.email} onChange={e => setForm({...form, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">I am a</label>
                    <select value={form.role} onChange={e => setForm({...form, role: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none bg-white">
                      {['School Admin', 'Principal', 'Teacher', 'Parent', 'Other'].map(r => <option key={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">School Name</label>
                    <input type="text" placeholder="DPS Noida" value={form.school} onChange={e => setForm({...form, school: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Message</label>
                  <textarea required rows={5} placeholder="Tell us how we can help..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none" />
                </div>
                <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold py-3.5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all">
                  <Send className="w-4 h-4" /> Send Message
                </button>
              </form>
            )}
          </div>

          {/* Info */}
          <div>
            <h2 className="text-2xl font-black text-gray-900 mb-6">Contact information</h2>
            <div className="space-y-4 mb-10">
              {[
                { icon: Mail, label: 'Email', value: 'progressiveinitiatives.ventures@gmail.com' },
                { icon: Phone, label: 'Phone', value: '+91 98765 43210' },
                { icon: MapPin, label: 'Office', value: 'Koramangala, Bengaluru, Karnataka 560034, India' },
              ].map(c => (
                <div key={c.label} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <c.icon className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium mb-0.5">{c.label}</p>
                    <p className="text-gray-900 text-sm font-medium">{c.value}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-indigo-50 rounded-2xl p-6 border border-indigo-100">
              <h3 className="font-bold text-gray-900 mb-2">🚀 Want a live demo?</h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">Book a 30-minute demo with our team and we'll show you the full platform live — AI tutoring, exam generation, OCR grading, and all the dashboards.</p>
              <a href="mailto:demo@curioushat.ai" className="inline-block bg-indigo-600 text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors">
                Book a Demo
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
