'use client'
import { useState } from 'react'
import { MessageSquare, Send } from 'lucide-react'

const teachers = [
  { id: 1, name: 'Ms. Priya Gupta', subject: 'Physics', avatar: 'PG', color: 'bg-purple-500' },
  { id: 2, name: 'Mr. Ramesh Sharma', subject: 'Mathematics', avatar: 'RS', color: 'bg-indigo-500' },
  { id: 3, name: 'Mr. Arun Iyer', subject: 'Chemistry', avatar: 'AI', color: 'bg-teal-500' },
  { id: 4, name: 'Ms. Rekha Nair', subject: 'Biology', avatar: 'RN', color: 'bg-emerald-500' },
  { id: 5, name: 'Ms. Sara Khan', subject: 'English', avatar: 'SK', color: 'bg-orange-500' },
]

const initialMessages: Record<number, { from: 'parent' | 'teacher'; text: string; time: string }[]> = {
  1: [
    { from: 'teacher', text: "Good evening Mr. Raghuvanshi. Om performed well in the last Physics unit test — scored 85%. He has been attentive in class.", time: '2d ago' },
    { from: 'parent', text: "Thank you Ms. Gupta. We have been making sure he revises daily. Is there any topic he should focus on before Pre-Boards?", time: '2d ago' },
    { from: 'teacher', text: "Yes, please ask him to revise Optics (Chapter 10) and Electromagnetic Induction. These are high-weightage chapters for Pre-Board.", time: '1d ago' },
  ],
  2: [
    { from: 'teacher', text: "Hi Mr. Raghuvanshi, I wanted to inform you that Om has been consistently scoring above 85% in Mathematics. Please encourage him to attempt the additional problem sets I shared.", time: '5d ago' },
    { from: 'parent', text: "That's great to hear! We will make sure he works on those. Thank you for the extra material.", time: '4d ago' },
  ],
  3: [],
  4: [],
  5: [],
}

export default function ParentMessagesPage() {
  const [selected, setSelected] = useState(teachers[0].id)
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    setMessages(prev => ({
      ...prev,
      [selected]: [...(prev[selected] || []), { from: 'parent', text: input.trim(), time: 'Just now' }]
    }))
    setInput('')
  }

  const selectedTeacher = teachers.find(t => t.id === selected)!
  const conversation = messages[selected] || []

  return (
    <div className="h-[calc(100vh-8rem)] flex gap-4">
      {/* Teacher list */}
      <div className="w-64 flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-bold text-gray-900 text-sm">Teachers</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {teachers.map(t => {
            const msgs = messages[t.id] || []
            const lastMsg = msgs[msgs.length - 1]
            const hasUnread = msgs.length > 0 && lastMsg?.from === 'teacher'
            return (
              <button key={t.id} onClick={() => setSelected(t.id)} className={`w-full p-4 flex items-start gap-3 border-b border-gray-50 hover:bg-gray-50 transition-colors text-left ${selected === t.id ? 'bg-orange-50' : ''}`}>
                <div className={`w-9 h-9 ${t.color} rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}>{t.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{t.name}</p>
                  <p className="text-xs text-gray-400 truncate">{t.subject}</p>
                  {lastMsg && <p className="text-xs text-gray-400 truncate mt-0.5">{lastMsg.text.substring(0, 35)}...</p>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
          <div className={`w-9 h-9 ${selectedTeacher.color} rounded-full flex items-center justify-center text-white text-xs font-bold`}>{selectedTeacher.avatar}</div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">{selectedTeacher.name}</p>
            <p className="text-xs text-gray-400">{selectedTeacher.subject} Teacher</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {conversation.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <MessageSquare className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm">No messages yet. Start a conversation!</p>
            </div>
          ) : (
            conversation.map((msg, i) => (
              <div key={i} className={`flex ${msg.from === 'parent' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${msg.from === 'parent' ? 'bg-orange-500 text-white rounded-br-sm' : 'bg-gray-100 text-gray-800 rounded-bl-sm'}`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.from === 'parent' ? 'text-orange-200' : 'text-gray-400'}`}>{msg.time}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-100 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder={`Message ${selectedTeacher.name}...`}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-400 outline-none"
          />
          <button onClick={send} disabled={!input.trim()} className="bg-orange-500 text-white px-4 py-2.5 rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-colors flex items-center gap-1.5 text-sm font-semibold">
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </div>
    </div>
  )
}
