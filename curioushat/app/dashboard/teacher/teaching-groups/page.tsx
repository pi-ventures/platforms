'use client'
import { useState, useRef, useEffect } from 'react'
import { Search, Plus, Send, Paperclip, BookOpen, Users, X, Hash, ChevronLeft, Download, Headphones, Brain, Check, CheckCheck, Pin, Bell } from 'lucide-react'

/* ── Types ── */
type MessageType = 'text' | 'book' | 'material' | 'announcement'
interface SharedBook { id: number; title: string; subject: string; class: string; author: string; pages: number; color: string }
interface Message {
  id: number; senderId: string; senderName: string; senderInitials: string
  type: MessageType; text?: string; book?: SharedBook; fileName?: string; fileType?: string
  time: string; read: boolean; pinned?: boolean
}
interface Group {
  id: number; name: string; subject: string; emoji: string; classLabel: string
  members: string[]; studentCount: number; lastMessage: string; lastTime: string; unread: number
  messages: Message[]
}

/* ── Colours ── */
const SUBJECT_COLOR: Record<string, string> = {
  Mathematics: '#4F46E5', Physics: '#0891B2', Chemistry: '#059669',
  Biology: '#7C3AED', English: '#D97706', History: '#B45309',
  'General Science': '#DC2626', 'Computer Science': '#BE185D', Mixed: '#6B7280',
}
const sc = (s: string) => SUBJECT_COLOR[s] || '#6B7280'

const ME = 'priya'

/* ── Mock groups ── */
const GROUPS: Group[] = [
  {
    id: 1, name: 'Class XI Physics A', subject: 'Physics', emoji: '⚡', classLabel: 'Class XI · Section A',
    members: ['Om Aditya Raghuvanshi', 'Riya Sharma', 'Karan Mehta', 'Sneha Patel', 'Dev Joshi', '+28 more'],
    studentCount: 33, lastMessage: 'You: Chapter 3 notes uploaded', lastTime: '10m ago', unread: 0,
    messages: [
      { id:1, senderId:'priya', senderName:'Ms. Priya', senderInitials:'PG', type:'announcement', text:'📌 Unit Test on Electrostatics this Friday. Covers chapters 1–3. Bring your NCERT textbook.', time:'9:00 AM', read:true, pinned:true },
      { id:2, senderId:'om', senderName:'Om', senderInitials:'OA', type:'text', text:'Ma\'am, will numericals from HC Verma also come?', time:'9:15 AM', read:true },
      { id:3, senderId:'priya', senderName:'Ms. Priya', senderInitials:'PG', type:'text', text:'Yes, 2–3 numericals will be included. Focus on Coulomb\'s Law and field problems.', time:'9:18 AM', read:true },
      { id:4, senderId:'priya', senderName:'Ms. Priya', senderInitials:'PG', type:'book', book:{ id:13, title:'Physics Part I', subject:'Physics', class:'Class XI', author:'NCERT', pages:296, color:'#0891B2' }, time:'9:20 AM', read:true },
      { id:5, senderId:'riya', senderName:'Riya', senderInitials:'RS', type:'text', text:'Thank you ma\'am! Could you also share Chapter 3 notes?', time:'9:35 AM', read:true },
      { id:6, senderId:'priya', senderName:'Ms. Priya', senderInitials:'PG', type:'material', fileName:'Chapter 3 – Electrostatics Notes.pdf', fileType:'PDF', time:'9:40 AM', read:true },
      { id:7, senderId:'karan', senderName:'Karan', senderInitials:'KM', type:'text', text:'This is very helpful! Thank you 🙏', time:'9:42 AM', read:true },
      { id:8, senderId:'sneha', senderName:'Sneha', senderInitials:'SP', type:'text', text:'Ma\'am can we use HC Verma for practice?', time:'10:05 AM', read:false },
    ],
  },
  {
    id: 2, name: 'Class XII Physics B', subject: 'Physics', emoji: '🔋', classLabel: 'Class XII · Section B',
    members: ['Priya Nair', 'Sameer Khan', 'Aisha Khan', '+28 more'],
    studentCount: 31, lastMessage: 'Sameer: Doubt on Q5 from assignment', lastTime: '45m ago', unread: 2,
    messages: [
      { id:1, senderId:'priya', senderName:'Ms. Priya', senderInitials:'PG', type:'announcement', text:'📌 Assignment 7 due Monday. Questions from Current Electricity chapter.', time:'8:30 AM', read:true, pinned:true },
      { id:2, senderId:'priya', senderName:'Ms. Priya', senderInitials:'PG', type:'book', book:{ id:31, title:'Physics Part I', subject:'Physics', class:'Class XII', author:'NCERT', pages:334, color:'#0891B2' }, time:'8:32 AM', read:true },
      { id:3, senderId:'sameer', senderName:'Sameer', senderInitials:'SK', type:'text', text:'Ma\'am I have a doubt on Q5 of the assignment — the internal resistance problem', time:'11:00 AM', read:false },
      { id:4, senderId:'aisha', senderName:'Aisha', senderInitials:'AK', type:'text', text:'Same doubt here! The Kirchhoff part is confusing', time:'11:05 AM', read:false },
    ],
  },
  {
    id: 3, name: 'JEE Advanced Batch', subject: 'Physics', emoji: '🎯', classLabel: 'JEE Advanced · All Sections',
    members: ['Om Aditya Raghuvanshi', 'Dev Joshi', 'Karan Mehta', '+12 more'],
    studentCount: 15, lastMessage: 'You shared HC Verma Vol 1', lastTime: '2h ago', unread: 0,
    messages: [
      { id:1, senderId:'priya', senderName:'Ms. Priya', senderInitials:'PG', type:'text', text:'Welcome to the JEE Advanced group! This is for serious aspirants. We will go beyond NCERT here.', time:'8:00 AM', read:true },
      { id:2, senderId:'priya', senderName:'Ms. Priya', senderInitials:'PG', type:'book', book:{ id:39, title:'Concepts of Physics Vol 1', subject:'Physics', class:'JEE Main Preparatory', author:'H.C. Verma', pages:468, color:'#0891B2' }, time:'8:02 AM', read:true },
      { id:3, senderId:'om', senderName:'Om', senderInitials:'OA', type:'text', text:'Thank you ma\'am! HC Verma is the bible 🙏', time:'8:10 AM', read:true },
      { id:4, senderId:'dev', senderName:'Dev', senderInitials:'DJ', type:'text', text:'Ma\'am could you also share Irodov problems list?', time:'8:15 AM', read:true },
      { id:5, senderId:'priya', senderName:'Ms. Priya', senderInitials:'PG', type:'material', fileName:'Irodov Selected Problems.pdf', fileType:'PDF', time:'8:20 AM', read:true },
    ],
  },
  {
    id: 4, name: 'NEET Biology Batch', subject: 'Biology', emoji: '🌿', classLabel: 'Class XII · NEET Prep',
    members: ['Priya Nair', 'Sameer Khan', '+8 more'],
    studentCount: 10, lastMessage: 'You: Diagrams for Chapter 4 posted', lastTime: 'Yesterday', unread: 0,
    messages: [
      { id:1, senderId:'priya', senderName:'Ms. Priya', senderInitials:'PG', type:'text', text:'Today we focus on the Digestive System. Make sure you can draw all diagrams from memory.', time:'3:00 PM', read:true },
      { id:2, senderId:'priya', senderName:'Ms. Priya', senderInitials:'PG', type:'book', book:{ id:42, title:'Objective Biology (NEET)', subject:'Biology', class:'NEET (UG) Preparatory', author:'Dinesh', pages:620, color:'#7C3AED' }, time:'3:02 PM', read:true },
      { id:3, senderId:'priya', senderName:'Ms. Priya', senderInitials:'PG', type:'material', fileName:'Digestive System Diagrams.pdf', fileType:'PDF', time:'3:10 PM', read:true },
    ],
  },
]

const LIBRARY_BOOKS = [
  { id:13, title:'Physics Part I', subject:'Physics', class:'Class XI', author:'NCERT', pages:296, color:'#0891B2' },
  { id:31, title:'Physics Part I', subject:'Physics', class:'Class XII', author:'NCERT', pages:334, color:'#0891B2' },
  { id:39, title:'Concepts of Physics Vol 1', subject:'Physics', class:'JEE Main Preparatory', author:'H.C. Verma', pages:468, color:'#0891B2' },
  { id:16, title:'Mathematics Part I', subject:'Mathematics', class:'Class XI', author:'NCERT', pages:382, color:'#4F46E5' },
  { id:15, title:'Chemistry Part I', subject:'Chemistry', class:'Class XI', author:'NCERT', pages:264, color:'#059669' },
  { id:17, title:'Biology', subject:'Biology', class:'Class XI', author:'NCERT', pages:408, color:'#7C3AED' },
  { id:42, title:'Objective Biology (NEET)', subject:'Biology', class:'NEET (UG) Preparatory', author:'Dinesh', pages:620, color:'#7C3AED' },
  { id:18, title:'Computer Science with Python', subject:'Computer Science', class:'Class XI', author:'NCERT', pages:320, color:'#BE185D' },
]

/* ── Sub-components ── */
function BookCard({ book, isMine }: { book: SharedBook; isMine: boolean }) {
  return (
    <div className={`rounded-xl overflow-hidden border max-w-xs w-full ${isMine ? 'border-violet-200 bg-violet-50' : 'border-gray-200 bg-white'}`}>
      <div className="h-12 flex items-center px-3 gap-2" style={{ backgroundColor: book.color + '18', borderBottom: `2px solid ${book.color}30` }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: book.color + '25' }}>
          <BookOpen className="w-3.5 h-3.5" style={{ color: book.color }} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-900 truncate leading-tight">{book.title}</p>
          <p className="text-[10px] text-gray-500">{book.class} · {book.author}</p>
        </div>
      </div>
      <div className="px-3 py-2 flex items-center gap-2">
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: book.color + '15', color: book.color }}>
          {book.subject}
        </span>
        <span className="text-[10px] text-gray-400 ml-auto">{book.pages}pp</span>
        <button className="p-1 text-gray-400 hover:text-teal-600 transition-colors" title="Listen"><Headphones className="w-3.5 h-3.5" /></button>
        <button className="p-1 text-gray-400 hover:text-violet-600 transition-colors" title="Ask AI"><Brain className="w-3.5 h-3.5" /></button>
        <button className="p-1 text-gray-400 hover:text-emerald-600 transition-colors" title="Download"><Download className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  )
}

function FileCard({ fileName, fileType, isMine }: { fileName: string; fileType: string; isMine: boolean }) {
  const extColors: Record<string, string> = { PDF: '#DC2626', DOC: '#2563EB', PPT: '#D97706', default: '#6B7280' }
  const c = extColors[fileType] || extColors.default
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border max-w-xs ${isMine ? 'border-violet-200 bg-violet-50' : 'border-gray-200 bg-white'}`}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ backgroundColor: c }}>{fileType}</div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-900 truncate">{fileName}</p>
        <p className="text-[10px] text-gray-400">{fileType} · Tap to open</p>
      </div>
      <button className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"><Download className="w-4 h-4" /></button>
    </div>
  )
}

function Avatar({ initials, size = 'sm' }: { initials: string; size?: 'sm' | 'xs' }) {
  const colors = ['#7C3AED', '#0891B2', '#059669', '#D97706', '#DC2626', '#BE185D']
  const ci = initials.charCodeAt(0) % colors.length
  const cls = size === 'xs' ? 'w-6 h-6 text-[9px]' : 'w-8 h-8 text-xs'
  return (
    <div className={`${cls} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`} style={{ backgroundColor: colors[ci] }}>
      {initials}
    </div>
  )
}

/* ── Main ── */
export default function TeachingGroupsPage() {
  const [groups, setGroups] = useState<Group[]>(GROUPS)
  const [activeId, setActiveId] = useState<number | null>(1)
  const [searchGroup, setSearchGroup] = useState('')
  const [text, setText] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [pickerSearch, setPickerSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list')
  const bottomRef = useRef<HTMLDivElement>(null)

  const active = groups.find(g => g.id === activeId) || null

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [active?.messages.length])

  const sendText = () => {
    if (!text.trim() || !active) return
    const msg: Message = {
      id: Date.now(), senderId: ME, senderName: 'Ms. Priya', senderInitials: 'PG',
      type: 'text', text: text.trim(), time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), read: true,
    }
    setGroups(gs => gs.map(g => g.id === active.id ? { ...g, messages: [...g.messages, msg], lastMessage: `You: ${text.trim()}`, lastTime: 'now' } : g))
    setText('')
  }

  const shareBook = (book: typeof LIBRARY_BOOKS[0]) => {
    if (!active) return
    const msg: Message = {
      id: Date.now(), senderId: ME, senderName: 'Ms. Priya', senderInitials: 'PG',
      type: 'book', book, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), read: true,
    }
    setGroups(gs => gs.map(g => g.id === active.id ? { ...g, messages: [...g.messages, msg], lastMessage: `You shared ${book.title}`, lastTime: 'now' } : g))
    setShowPicker(false)
    setPickerSearch('')
  }

  const openGroup = (id: number) => {
    setActiveId(id)
    setMobileView('chat')
    setGroups(gs => gs.map(g => g.id === id ? { ...g, unread: 0 } : g))
  }

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchGroup.toLowerCase()))
  const filteredBooks = LIBRARY_BOOKS.filter(b =>
    b.title.toLowerCase().includes(pickerSearch.toLowerCase()) ||
    b.subject.toLowerCase().includes(pickerSearch.toLowerCase())
  )
  const pinnedMsg = active?.messages.find(m => m.pinned)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Teaching Groups</h1>
          <p className="text-gray-500 text-sm mt-0.5">Share resources and communicate with your class groups</p>
        </div>
        <button onClick={() => setShowCreate(true)} className="flex items-center gap-1.5 text-sm bg-violet-600 text-white px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors">
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">New Group</span>
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex" style={{ height: 'calc(100vh - 200px)', minHeight: 480 }}>

        {/* ── Group list ── */}
        <div className={`${mobileView === 'chat' ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-72 border-r border-gray-100 flex-shrink-0`}>
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={searchGroup} onChange={e => setSearchGroup(e.target.value)}
                placeholder="Search groups…"
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none bg-gray-50" />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredGroups.map(g => {
              const color = sc(g.subject)
              return (
                <button key={g.id} onClick={() => openGroup(g.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${activeId === g.id ? 'bg-violet-50 border-l-2 border-l-violet-600' : ''}`}>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-gray-100">{g.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-semibold truncate ${activeId === g.id ? 'text-violet-700' : 'text-gray-900'}`}>{g.name}</p>
                      <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">{g.lastTime}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">{g.lastMessage}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                      <Users className="w-2.5 h-2.5" /> {g.studentCount} students · {g.classLabel}
                    </p>
                  </div>
                  {g.unread > 0 && (
                    <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0">
                      {g.unread}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Chat ── */}
        {active ? (
          <div className={`${mobileView === 'list' ? 'hidden' : 'flex'} md:flex flex-col flex-1 min-w-0`}>
            {/* Header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-white">
              <button onClick={() => setMobileView('list')} className="md:hidden p-1 text-gray-400 hover:text-gray-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-gray-100 flex-shrink-0">{active.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{active.name}</p>
                <p className="text-[11px] text-gray-400">{active.classLabel} · {active.studentCount} students</p>
              </div>
              <button onClick={() => setShowMembers(v => !v)} className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                <Users className="w-4 h-4" />
              </button>
            </div>

            {/* Pinned announcement */}
            {pinnedMsg && (
              <div className="px-4 py-2 bg-amber-50 border-b border-amber-100 flex items-start gap-2">
                <Pin className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 flex-1 line-clamp-1">{pinnedMsg.text}</p>
                <span className="text-[10px] text-amber-500">Pinned</span>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
              {active.messages.map(msg => {
                const isMine = msg.senderId === ME
                if (msg.type === 'announcement') {
                  return (
                    <div key={msg.id} className="flex justify-center">
                      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5 max-w-md text-center">
                        <div className="flex items-center gap-1.5 justify-center mb-1">
                          <Bell className="w-3 h-3 text-amber-600" />
                          <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wide">Announcement</span>
                        </div>
                        <p className="text-xs text-amber-900">{msg.text}</p>
                        <p className="text-[10px] text-amber-500 mt-1">{msg.time}</p>
                      </div>
                    </div>
                  )
                }
                return (
                  <div key={msg.id} className={`flex items-end gap-2 ${isMine ? 'flex-row-reverse' : 'flex-row'}`}>
                    {!isMine && <Avatar initials={msg.senderInitials} />}
                    <div className={`flex flex-col gap-1 max-w-[75%] ${isMine ? 'items-end' : 'items-start'}`}>
                      {!isMine && <span className="text-[10px] text-gray-500 font-medium px-1">{msg.senderName}</span>}
                      {msg.type === 'text' && (
                        <div className={`px-3 py-2 rounded-2xl text-sm leading-relaxed ${isMine ? 'bg-violet-600 text-white rounded-br-sm' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm'}`}>
                          {msg.text}
                        </div>
                      )}
                      {msg.type === 'book' && msg.book && <BookCard book={msg.book} isMine={isMine} />}
                      {msg.type === 'material' && msg.fileName && (
                        <FileCard fileName={msg.fileName} fileType={msg.fileType || 'PDF'} isMine={isMine} />
                      )}
                      <div className={`flex items-center gap-1 text-[10px] text-gray-400 px-1 ${isMine ? 'flex-row-reverse' : ''}`}>
                        <span>{msg.time}</span>
                        {isMine && (msg.read ? <CheckCheck className="w-3 h-3 text-violet-500" /> : <Check className="w-3 h-3" />)}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="px-4 py-3 border-t border-gray-100 bg-white">
              {showPicker && (
                <div className="mb-3 border border-gray-200 rounded-xl overflow-hidden bg-white shadow-lg">
                  <div className="px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" />
                    <p className="text-xs font-bold text-gray-700 flex-1">Share a Book</p>
                    <button onClick={() => setShowPicker(false)}><X className="w-3.5 h-3.5 text-gray-400" /></button>
                  </div>
                  <div className="px-3 py-2 border-b border-gray-100">
                    <input value={pickerSearch} onChange={e => setPickerSearch(e.target.value)}
                      placeholder="Search books…" className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                  <div className="max-h-48 overflow-y-auto divide-y divide-gray-50">
                    {filteredBooks.map(b => (
                      <button key={b.id} onClick={() => shareBook(b)}
                        className="w-full flex items-center gap-3 px-3 py-2 hover:bg-violet-50 transition-colors text-left">
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: b.color + '20' }}>
                          <BookOpen className="w-3.5 h-3.5" style={{ color: b.color }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-gray-900 truncate">{b.title}</p>
                          <p className="text-[10px] text-gray-400">{b.class} · {b.author}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button onClick={() => setShowPicker(v => !v)}
                  className={`p-2 rounded-lg transition-colors flex-shrink-0 ${showPicker ? 'bg-violet-100 text-violet-600' : 'text-gray-400 hover:text-violet-600 hover:bg-violet-50'}`}
                  title="Share book">
                  <BookOpen className="w-4 h-4" />
                </button>
                <button className="p-2 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors flex-shrink-0" title="Attach file">
                  <Paperclip className="w-4 h-4" />
                </button>
                <input value={text} onChange={e => setText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendText()}
                  placeholder="Message students…"
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500 bg-gray-50" />
                <button onClick={sendText} disabled={!text.trim()}
                  className="w-9 h-9 flex items-center justify-center bg-violet-600 text-white rounded-xl disabled:opacity-40 hover:bg-violet-700 transition-colors flex-shrink-0">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center flex-col gap-3 text-gray-400 bg-gray-50">
            <Hash className="w-12 h-12 opacity-30" />
            <p className="font-medium text-gray-500">Select a group to start teaching</p>
            <button onClick={() => setShowCreate(true)} className="text-violet-600 text-sm hover:underline">or create a new group</button>
          </div>
        )}

        {/* Members panel */}
        {showMembers && active && (
          <div className="hidden md:flex flex-col w-56 border-l border-gray-100 flex-shrink-0">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Students</p>
              <button onClick={() => setShowMembers(false)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              {active.members.map(m => {
                const ini = m.startsWith('+') ? m : m.split(' ').map(w => w[0]).join('')
                return (
                  <div key={m} className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50">
                    {m.startsWith('+')
                      ? <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500 flex-shrink-0">{m}</div>
                      : <Avatar initials={ini} size="xs" />
                    }
                    <span className="text-xs text-gray-700 font-medium truncate">{m}</span>
                  </div>
                )
              })}
            </div>
            <div className="px-3 py-2 border-t border-gray-100">
              <button className="w-full flex items-center gap-2 text-xs text-violet-600 hover:bg-violet-50 px-2 py-1.5 rounded-lg transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add student
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Create group modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Create Teaching Group</h3>
              <button onClick={() => setShowCreate(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <input placeholder="Group name (e.g. Class XI Physics A)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-violet-500 outline-none">
                  <option>Select Subject</option>
                  <option>Physics</option><option>Chemistry</option><option>Mathematics</option><option>Biology</option>
                </select>
                <select className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-violet-500 outline-none">
                  <option>Select Class</option>
                  <option>Class IX</option><option>Class X</option><option>Class XI</option><option>Class XII</option>
                </select>
              </div>
              <input placeholder="Add students by name or roll number" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
            </div>
            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowCreate(false)} className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 text-sm">Cancel</button>
              <button onClick={() => setShowCreate(false)} className="flex-1 bg-violet-600 text-white font-semibold py-2.5 rounded-xl hover:bg-violet-700 text-sm">Create Group</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
