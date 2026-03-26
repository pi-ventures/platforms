'use client'
import { useState, useRef, useEffect } from 'react'
import { Search, Plus, Send, Paperclip, BookOpen, Users, X, Hash, ChevronLeft, Download, Headphones, Brain, MoreVertical, Check, CheckCheck } from 'lucide-react'

/* ── Types ── */
type MessageType = 'text' | 'book' | 'material'
interface SharedBook { id: number; title: string; subject: string; class: string; author: string; pages: number; color: string }
interface Message {
  id: number; senderId: string; senderName: string; senderInitials: string
  type: MessageType; text?: string; book?: SharedBook; fileName?: string; fileType?: string
  time: string; read: boolean
}
interface Group {
  id: number; name: string; subject: string; emoji: string
  members: string[]; memberCount: number; lastMessage: string; lastTime: string; unread: number
  messages: Message[]
}

/* ── Colours ── */
const SUBJECT_COLOR: Record<string, string> = {
  Mathematics: '#4F46E5', Physics: '#0891B2', Chemistry: '#059669',
  Biology: '#7C3AED', English: '#D97706', History: '#B45309',
  'General Science': '#DC2626', 'Computer Science': '#BE185D', Mixed: '#6B7280',
}
const sc = (s: string) => SUBJECT_COLOR[s] || '#6B7280'

/* ── Mock data ── */
const ME = 'om'

const GROUPS: Group[] = [
  {
    id: 1, name: 'JEE 2026 Prep', subject: 'Mixed', emoji: '🚀',
    members: ['Om Aditya Raghuvanshi', 'Riya Sharma', 'Karan Mehta', 'Sneha Patel', 'Dev Joshi'],
    memberCount: 5, lastMessage: 'Riya shared Physics Part I', lastTime: '2m ago', unread: 3,
    messages: [
      { id:1, senderId:'riya', senderName:'Riya', senderInitials:'RS', type:'text', text:'Hey everyone! Starting with H.C. Verma today?', time:'10:02 AM', read:true },
      { id:2, senderId:'karan', senderName:'Karan', senderInitials:'KM', type:'text', text:'Yes! Chapter 3 onwards — Newton\'s Laws', time:'10:04 AM', read:true },
      { id:3, senderId:'riya', senderName:'Riya', senderInitials:'RS', type:'book', book:{ id:39, title:'Concepts of Physics Vol 1', subject:'Physics', class:'JEE Main Preparatory', author:'H.C. Verma', pages:468, color:'#0891B2' }, time:'10:05 AM', read:true },
      { id:4, senderId:'om', senderName:'Om', senderInitials:'OA', type:'text', text:'Perfect. I\'ll finish Ch 3 tonight and post my notes here 📝', time:'10:08 AM', read:true },
      { id:5, senderId:'sneha', senderName:'Sneha', senderInitials:'SP', type:'text', text:'Can someone share the Maths Part I too? Need vectors chapter', time:'10:15 AM', read:true },
      { id:6, senderId:'om', senderName:'Om', senderInitials:'OA', type:'book', book:{ id:19, title:'Mathematics Part I', subject:'Mathematics', class:'Class XI', author:'NCERT', pages:382, color:'#4F46E5' }, time:'10:16 AM', read:true },
      { id:7, senderId:'dev', senderName:'Dev', senderInitials:'DJ', type:'text', text:'Thanks Om! Also sharing the Organic Chem reference 🧪', time:'10:21 AM', read:false },
      { id:8, senderId:'dev', senderName:'Dev', senderInitials:'DJ', type:'book', book:{ id:41, title:'Organic Chemistry', subject:'Chemistry', class:'JEE Advanced Preparatory', author:'O.P. Tandon', pages:512, color:'#059669' }, time:'10:21 AM', read:false },
      { id:9, senderId:'riya', senderName:'Riya', senderInitials:'RS', type:'text', text:'Mock test on Saturday at 9 AM — everyone in?', time:'10:35 AM', read:false },
    ],
  },
  {
    id: 2, name: 'Physics Study Circle', subject: 'Physics', emoji: '⚡',
    members: ['Om Aditya Raghuvanshi', 'Riya Sharma', 'Karan Mehta'],
    memberCount: 3, lastMessage: 'Karan: Check this numericals PDF', lastTime: '1h ago', unread: 0,
    messages: [
      { id:1, senderId:'karan', senderName:'Karan', senderInitials:'KM', type:'text', text:'Electrostatics was tough today. Anyone solved Q14?', time:'9:10 AM', read:true },
      { id:2, senderId:'om', senderName:'Om', senderInitials:'OA', type:'text', text:'Yes, the trick is to use superposition. Let me explain…', time:'9:12 AM', read:true },
      { id:3, senderId:'om', senderName:'Om', senderInitials:'OA', type:'text', text:'Put charge distribution first then find field at centre. Gets much cleaner 👍', time:'9:13 AM', read:true },
      { id:4, senderId:'riya', senderName:'Riya', senderInitials:'RS', type:'text', text:'Oh that makes sense! Sharing Class XII Physics for reference', time:'9:18 AM', read:true },
      { id:5, senderId:'riya', senderName:'Riya', senderInitials:'RS', type:'book', book:{ id:31, title:'Physics Part I', subject:'Physics', class:'Class XII', author:'NCERT', pages:334, color:'#0891B2' }, time:'9:18 AM', read:true },
      { id:6, senderId:'karan', senderName:'Karan', senderInitials:'KM', type:'material', fileName:'Electrostatics Numericals.pdf', fileType:'PDF', time:'9:45 AM', read:true },
    ],
  },
  {
    id: 3, name: 'Maths Warriors', subject: 'Mathematics', emoji: '📐',
    members: ['Om Aditya Raghuvanshi', 'Sneha Patel', 'Aisha Khan', 'Rohan Das'],
    memberCount: 4, lastMessage: 'Integration practice sheet — Sneha', lastTime: 'Yesterday', unread: 1,
    messages: [
      { id:1, senderId:'sneha', senderName:'Sneha', senderInitials:'SP', type:'text', text:'Integration by parts — let\'s do 20 problems together tonight?', time:'8:00 PM', read:true },
      { id:2, senderId:'rohan', senderName:'Rohan', senderInitials:'RD', type:'text', text:'I\'m in! Sharing Maths XII textbook first', time:'8:02 PM', read:true },
      { id:3, senderId:'rohan', senderName:'Rohan', senderInitials:'RD', type:'book', book:{ id:29, title:'Mathematics Part I', subject:'Mathematics', class:'Class XII', author:'NCERT', pages:352, color:'#4F46E5' }, time:'8:02 PM', read:true },
      { id:4, senderId:'aisha', senderName:'Aisha', senderInitials:'AK', type:'material', fileName:'Integration Practice Sheet.pdf', fileType:'PDF', time:'8:10 PM', read:false },
      { id:5, senderId:'sneha', senderName:'Sneha', senderInitials:'SP', type:'text', text:'Perfect! Let\'s start at 9 PM sharp 🎯', time:'8:15 PM', read:true },
    ],
  },
  {
    id: 4, name: 'Biology NEET', subject: 'Biology', emoji: '🌿',
    members: ['Om Aditya Raghuvanshi', 'Priya Nair', 'Sameer Khan'],
    memberCount: 3, lastMessage: 'Priya: Digestive system diagrams done!', lastTime: '2d ago', unread: 0,
    messages: [
      { id:1, senderId:'priya', senderName:'Priya', senderInitials:'PN', type:'text', text:'Sharing the Objective Biology book — covers all NEET topics', time:'4:00 PM', read:true },
      { id:2, senderId:'priya', senderName:'Priya', senderInitials:'PN', type:'book', book:{ id:42, title:'Objective Biology (NEET)', subject:'Biology', class:'NEET (UG) Preparatory', author:'Dinesh', pages:620, color:'#7C3AED' }, time:'4:00 PM', read:true },
      { id:3, senderId:'sameer', senderName:'Sameer', senderInitials:'SK', type:'text', text:'Thanks! Digestive system and excretion are my weak spots', time:'4:15 PM', read:true },
      { id:4, senderId:'om', senderName:'Om', senderInitials:'OA', type:'text', text:'Let\'s each pick a system and make notes to share here', time:'4:20 PM', read:true },
    ],
  },
]

/* ── Share book picker data ── */
const LIBRARY_BOOKS = [
  { id:13, title:'Physics Part I', subject:'Physics', class:'Class XI', author:'NCERT', pages:296, color:'#0891B2' },
  { id:19, title:'Mathematics Part I', subject:'Mathematics', class:'Class XI', author:'NCERT', pages:382, color:'#4F46E5' },
  { id:17, title:'Biology', subject:'Biology', class:'Class XI', author:'NCERT', pages:408, color:'#7C3AED' },
  { id:39, title:'Concepts of Physics Vol 1', subject:'Physics', class:'JEE Main Preparatory', author:'H.C. Verma', pages:468, color:'#0891B2' },
  { id:41, title:'Organic Chemistry', subject:'Chemistry', class:'JEE Advanced Preparatory', author:'O.P. Tandon', pages:512, color:'#059669' },
  { id:42, title:'Objective Biology (NEET)', subject:'Biology', class:'NEET (UG) Preparatory', author:'Dinesh', pages:620, color:'#7C3AED' },
  { id:29, title:'Mathematics Part I', subject:'Mathematics', class:'Class XII', author:'NCERT', pages:352, color:'#4F46E5' },
  { id:31, title:'Physics Part I', subject:'Physics', class:'Class XII', author:'NCERT', pages:334, color:'#0891B2' },
]

/* ── Shared book message card ── */
function BookCard({ book, isMine }: { book: SharedBook; isMine: boolean }) {
  const color = book.color || sc(book.subject)
  return (
    <div className={`rounded-xl overflow-hidden border max-w-xs w-full ${isMine ? 'border-violet-200 bg-violet-50' : 'border-gray-200 bg-white'}`}>
      <div className="h-12 flex items-center px-3 gap-2" style={{ backgroundColor: color + '18', borderBottom: `2px solid ${color}30` }}>
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: color + '25' }}>
          <BookOpen className="w-3.5 h-3.5" style={{ color }} />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-bold text-gray-900 truncate leading-tight">{book.title}</p>
          <p className="text-[10px] text-gray-500">{book.class} · {book.author}</p>
        </div>
      </div>
      <div className="px-3 py-2 flex items-center gap-2">
        <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ backgroundColor: color + '15', color }}>
          {book.subject}
        </span>
        <span className="text-[10px] text-gray-400 ml-auto">{book.pages}pp</span>
        <button className="p-1 text-gray-400 hover:text-teal-600 transition-colors" title="Listen">
          <Headphones className="w-3.5 h-3.5" />
        </button>
        <button className="p-1 text-gray-400 hover:text-violet-600 transition-colors" title="Ask AI">
          <Brain className="w-3.5 h-3.5" />
        </button>
        <button className="p-1 text-gray-400 hover:text-emerald-600 transition-colors" title="Download">
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}

/* ── File card ── */
function FileCard({ fileName, fileType, isMine }: { fileName: string; fileType: string; isMine: boolean }) {
  const ext = fileType || 'FILE'
  const extColors: Record<string, string> = { PDF: '#DC2626', DOC: '#2563EB', PPT: '#D97706', default: '#6B7280' }
  const c = extColors[ext] || extColors.default
  return (
    <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl border max-w-xs ${isMine ? 'border-violet-200 bg-violet-50' : 'border-gray-200 bg-white'}`}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-white text-xs font-bold" style={{ backgroundColor: c }}>
        {ext}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-gray-900 truncate">{fileName}</p>
        <p className="text-[10px] text-gray-400">{ext} · Tap to open</p>
      </div>
      <button className="p-1 text-gray-400 hover:text-emerald-600 transition-colors"><Download className="w-4 h-4" /></button>
    </div>
  )
}

/* ── Avatar ── */
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

/* ── Main page ── */
export default function GroupStudyPage() {
  const [groups, setGroups] = useState<Group[]>(GROUPS)
  const [activeId, setActiveId] = useState<number | null>(1)
  const [searchGroup, setSearchGroup] = useState('')
  const [text, setText] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [pickerSearch, setPickerSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
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
      id: Date.now(), senderId: ME, senderName: 'Om', senderInitials: 'OA',
      type: 'text', text: text.trim(), time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), read: true,
    }
    setGroups(gs => gs.map(g => g.id === active.id ? { ...g, messages: [...g.messages, msg], lastMessage: text.trim(), lastTime: 'now' } : g))
    setText('')
  }

  const shareBook = (book: typeof LIBRARY_BOOKS[0]) => {
    if (!active) return
    const msg: Message = {
      id: Date.now(), senderId: ME, senderName: 'Om', senderInitials: 'OA',
      type: 'book', book, time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }), read: true,
    }
    setGroups(gs => gs.map(g => g.id === active.id ? { ...g, messages: [...g.messages, msg], lastMessage: `You shared ${book.title}`, lastTime: 'now' } : g))
    setShowPicker(false)
    setPickerSearch('')
  }

  const openGroup = (id: number) => {
    setActiveId(id)
    setMobileView('chat')
    // mark read
    setGroups(gs => gs.map(g => g.id === id ? { ...g, unread: 0 } : g))
  }

  const filteredGroups = groups.filter(g => g.name.toLowerCase().includes(searchGroup.toLowerCase()))
  const filteredBooks = LIBRARY_BOOKS.filter(b =>
    b.title.toLowerCase().includes(pickerSearch.toLowerCase()) ||
    b.subject.toLowerCase().includes(pickerSearch.toLowerCase())
  )

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Group Study</h1>
          <p className="text-gray-500 text-sm mt-0.5">Study with friends — share books, notes, and ideas</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex" style={{ height: 'calc(100vh - 200px)', minHeight: 480 }}>

        {/* ── Group list ── */}
        <div className={`${mobileView === 'chat' ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-72 border-r border-gray-100 flex-shrink-0`}>
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
              <input value={searchGroup} onChange={e => setSearchGroup(e.target.value)}
                placeholder="Search groups…"
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500 outline-none bg-gray-50" />
            </div>
            <button onClick={() => setShowCreate(true)}
              className="w-7 h-7 flex items-center justify-center bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors flex-shrink-0" title="Create group">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredGroups.map(g => (
              <button key={g.id} onClick={() => openGroup(g.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-50 ${activeId === g.id ? 'bg-violet-50 border-l-2 border-l-violet-600' : ''}`}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-gray-100">
                  {g.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-semibold truncate ${activeId === g.id ? 'text-violet-700' : 'text-gray-900'}`}>{g.name}</p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">{g.lastTime}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-gray-500 truncate">{g.lastMessage}</p>
                    {g.unread > 0 && (
                      <span className="w-4 h-4 rounded-full bg-violet-600 text-white text-[9px] font-bold flex items-center justify-center flex-shrink-0 ml-1">
                        {g.unread}
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                    <Users className="w-2.5 h-2.5" /> {g.memberCount} members
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Chat area ── */}
        {active ? (
          <div className={`${mobileView === 'list' ? 'hidden' : 'flex'} md:flex flex-col flex-1 min-w-0`}>
            {/* Chat header */}
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-white">
              <button onClick={() => setMobileView('list')} className="md:hidden p-1 text-gray-400 hover:text-gray-600">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-gray-100 flex-shrink-0">{active.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{active.name}</p>
                <p className="text-[11px] text-gray-400">{active.members.join(', ')}</p>
              </div>
              <button onClick={() => setShowMembers(v => !v)} className="p-1.5 text-gray-400 hover:text-violet-600 hover:bg-violet-50 rounded-lg transition-colors">
                <Users className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
              {active.messages.map(msg => {
                const isMine = msg.senderId === ME
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
                  placeholder="Type a message…"
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
            <p className="font-medium text-gray-500">Select a group to start studying</p>
            <button onClick={() => setShowCreate(true)} className="text-violet-600 text-sm hover:underline">or create a new group</button>
          </div>
        )}

        {/* Members panel */}
        {showMembers && active && (
          <div className="hidden md:flex flex-col w-52 border-l border-gray-100 flex-shrink-0">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Members</p>
              <button onClick={() => setShowMembers(false)}><X className="w-4 h-4 text-gray-400" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
              {active.members.map(m => {
                const ini = m.split(' ').map(w => w[0]).join('')
                return (
                  <div key={m} className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50">
                    <Avatar initials={ini} size="xs" />
                    <span className="text-xs text-gray-700 font-medium truncate">{m}</span>
                    {m.includes('Om') && <span className="ml-auto text-[9px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full font-medium">You</span>}
                  </div>
                )
              })}
            </div>
            <div className="px-3 py-2 border-t border-gray-100">
              <button className="w-full flex items-center gap-2 text-xs text-violet-600 hover:bg-violet-50 px-2 py-1.5 rounded-lg transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add member
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
              <h3 className="font-bold text-gray-900">Create Study Group</h3>
              <button onClick={() => setShowCreate(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <div className="space-y-3">
              <input value={newGroupName} onChange={e => setNewGroupName(e.target.value)}
                placeholder="Group name (e.g. Chemistry Aces)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
              <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm bg-white focus:ring-2 focus:ring-violet-500 outline-none">
                <option>Select Subject (optional)</option>
                <option>Mathematics</option><option>Physics</option><option>Chemistry</option>
                <option>Biology</option><option>Mixed</option>
              </select>
              <input placeholder="Invite friends (comma-separated names)" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-violet-500 outline-none" />
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
