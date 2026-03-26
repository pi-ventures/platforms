'use client'
import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Brain, BookOpen, Lightbulb, Globe, X, AlertCircle, RefreshCw, Camera, Monitor, Clipboard, ChevronDown, Mic, Search } from 'lucide-react'

/* ─── Book data (shared with library) ─── */
interface Book { id: number; title: string; subject: string; class: string; board: string; author: string; lang: string; type: string; pages: number }
const ALL_BOOKS: Book[] = [
  { id:1,  title:'Mathematics',                subject:'Mathematics',     class:'Class I',    board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:120 },
  { id:2,  title:'Marigold (English)',          subject:'English',         class:'Class I',    board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:140 },
  { id:3,  title:'Rimjhim (Hindi)',             subject:'Hindi',           class:'Class II',   board:'CBSE', author:'NCERT',       lang:'Hindi',   type:'Textbook',      pages:130 },
  { id:4,  title:'Ganit',                       subject:'Mathematics',     class:'Class III',  board:'CBSE', author:'NCERT',       lang:'Hindi',   type:'Textbook',      pages:148 },
  { id:5,  title:'EVS – Looking Around',        subject:'General Science', class:'Class IV',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:180 },
  { id:6,  title:'Mathematics',                subject:'Mathematics',     class:'Class V',    board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:210 },
  { id:7,  title:'Science',                     subject:'General Science', class:'Class VI',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:280 },
  { id:8,  title:'Mathematics',                subject:'Mathematics',     class:'Class VI',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:310 },
  { id:9,  title:'History – Our Pasts I',       subject:'History',         class:'Class VI',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:220 },
  { id:10, title:'Science',                     subject:'General Science', class:'Class VII',  board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:290 },
  { id:11, title:'Mathematics',                subject:'Mathematics',     class:'Class VII',  board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:324 },
  { id:12, title:'Science',                     subject:'General Science', class:'Class VIII', board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:304 },
  { id:13, title:'Mathematics',                subject:'Mathematics',     class:'Class IX',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:338 },
  { id:14, title:'Science',                     subject:'General Science', class:'Class IX',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:312 },
  { id:15, title:'Social Science – India & Contemporary World', subject:'History', class:'Class IX', board:'CBSE', author:'NCERT', lang:'English', type:'Textbook', pages:256 },
  { id:16, title:'Mathematics',                subject:'Mathematics',     class:'Class X',    board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:334 },
  { id:17, title:'Science',                     subject:'General Science', class:'Class X',    board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:294 },
  { id:18, title:'First Flight (English)',       subject:'English',         class:'Class X',    board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:190 },
  { id:19, title:'Mathematics Part I',          subject:'Mathematics',     class:'Class XI',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:382 },
  { id:20, title:'Mathematics Part II',         subject:'Mathematics',     class:'Class XI',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:194 },
  { id:21, title:'Physics Part I',              subject:'Physics',         class:'Class XI',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:296 },
  { id:22, title:'Physics Part II',             subject:'Physics',         class:'Class XI',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:310 },
  { id:23, title:'Chemistry Part I',            subject:'Chemistry',       class:'Class XI',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:264 },
  { id:24, title:'Chemistry Part II',           subject:'Chemistry',       class:'Class XI',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:288 },
  { id:25, title:'Biology',                     subject:'Biology',         class:'Class XI',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:408 },
  { id:26, title:'Hornbill – English Reader',   subject:'English',         class:'Class XI',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:174 },
  { id:27, title:'Statistics for Economics',    subject:'Economics',       class:'Class XI',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:196 },
  { id:28, title:'Computer Science with Python',subject:'Computer Science',class:'Class XI',   board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:320 },
  { id:29, title:'Mathematics Part I',          subject:'Mathematics',     class:'Class XII',  board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:352 },
  { id:30, title:'Mathematics Part II',         subject:'Mathematics',     class:'Class XII',  board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:298 },
  { id:31, title:'Physics Part I',              subject:'Physics',         class:'Class XII',  board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:334 },
  { id:32, title:'Physics Part II',             subject:'Physics',         class:'Class XII',  board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:286 },
  { id:33, title:'Chemistry Part I',            subject:'Chemistry',       class:'Class XII',  board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:270 },
  { id:34, title:'Chemistry Part II',           subject:'Chemistry',       class:'Class XII',  board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:292 },
  { id:35, title:'Biology',                     subject:'Biology',         class:'Class XII',  board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:388 },
  { id:36, title:'Flamingo (English)',           subject:'English',         class:'Class XII',  board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:210 },
  { id:37, title:'Macro Economics',             subject:'Economics',       class:'Class XII',  board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:224 },
  { id:38, title:'Computer Science (Python)',   subject:'Computer Science',class:'Class XII',  board:'CBSE', author:'NCERT',       lang:'English', type:'Textbook',      pages:340 },
  { id:39, title:'Concepts of Physics Vol 1',   subject:'Physics',         class:'JEE Main Preparatory',     board:'CBSE', author:'H.C. Verma',  lang:'English', type:'Reference Book', pages:468 },
  { id:40, title:'Concepts of Physics Vol 2',   subject:'Physics',         class:'JEE Main Preparatory',     board:'CBSE', author:'H.C. Verma',  lang:'English', type:'Reference Book', pages:490 },
  { id:41, title:'Organic Chemistry',           subject:'Chemistry',       class:'JEE Advanced Preparatory', board:'CBSE', author:'O.P. Tandon', lang:'English', type:'Reference Book', pages:512 },
  { id:42, title:'Objective Biology (NEET)',    subject:'Biology',         class:'NEET (UG) Preparatory',    board:'CBSE', author:'Dinesh',      lang:'English', type:'Reference Book', pages:620 },
]
const SUBJECT_COLORS: Record<string, string> = {
  Mathematics:'#4F46E5', Physics:'#0891B2', Chemistry:'#059669', Biology:'#7C3AED',
  English:'#D97706', History:'#B45309', 'General Science':'#DC2626', Economics:'#1D4ED8',
  'Computer Science':'#BE185D', Hindi:'#DC2626',
}
const subjectColor = (s: string) => SUBJECT_COLORS[s] || '#6B7280'

type AIModel = 'claude' | 'openai'

interface TutorResponse {
  answer: string
  explanation: string[]
  applications: string[]
}

const MODEL_CONFIG = {
  claude: {
    label: 'Claude',
    subLabel: 'by Anthropic',
    color: 'from-purple-600 to-indigo-600',
    hoverShadow: 'hover:shadow-purple-200',
    badge: 'bg-purple-100 text-purple-700',
    loadingText: 'Claude is analysing your',
    dot: 'bg-purple-400',
    iconBg: 'bg-purple-600',
    envHint: 'Add ANTHROPIC_API_KEY=sk-ant-... to your .env.local file and restart the dev server',
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M13.827 3.52h-3.654L5.551 20h3.651l4.625-16.48zm2.957 0-4.625 16.48h3.652L20.449 3.52h-3.665z"/>
      </svg>
    ),
  },
  openai: {
    label: 'ChatGPT',
    subLabel: 'GPT-4o by OpenAI',
    color: 'from-emerald-500 to-teal-600',
    hoverShadow: 'hover:shadow-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700',
    loadingText: 'ChatGPT is analysing your',
    dot: 'bg-emerald-400',
    iconBg: 'bg-emerald-600',
    envHint: 'Add OPENAI_API_KEY=sk-... to your .env.local file and restart the dev server',
    logo: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855-5.833-3.387 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.411-.663zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
      </svg>
    ),
  },
} as const

const QUICK_PROMPTS = [
  'Explain this concept in simple terms for Class 8 students',
  'Give me 3 real-life examples I can use in class',
  'What are common misconceptions students have about this?',
  'Suggest a classroom activity to reinforce this topic',
  'How does this connect to the CBSE syllabus?',
]

export default function TeacherAITutorPage() {
  const [selectedModel, setSelectedModel] = useState<AIModel>('claude')
  const [image, setImage] = useState<string | null>(null)
  const [imageFileName, setImageFileName] = useState<string>('')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<TutorResponse | null>(null)
  const [usedModel, setUsedModel] = useState<AIModel>('claude')
  const [error, setError] = useState<string | null>(null)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [libraryOpen, setLibraryOpen] = useState(false)
  const [bookSearch, setBookSearch] = useState('')
  const recognitionRef = useRef<any>(null)

  const filteredBooks = ALL_BOOKS.filter(b =>
    !bookSearch || b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.subject.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.class.toLowerCase().includes(bookSearch.toLowerCase())
  )

  const toggleVoice = () => {
    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const recognition = new SR()
    recognition.lang = 'en-IN'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      setQuestion(prev => prev ? prev + ' ' + transcript : transcript)
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }

  // Camera
  const [cameraOpen, setCameraOpen] = useState(false)

  // Screen capture & region select
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [screenSelectOpen, setScreenSelectOpen] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null)
  const [selection, setSelection] = useState<{ x: number; y: number; w: number; h: number } | null>(null)

  const fileRef = useRef<HTMLInputElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const screenshotImgRef = useRef<HTMLImageElement>(null)

  // ── Clipboard paste ──────────────────────────────────────────────
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (!file) continue
          const reader = new FileReader()
          reader.onload = (ev) => {
            setImage(ev.target?.result as string)
            setImageFileName('Pasted image')
            setResponse(null)
            setError(null)
          }
          reader.readAsDataURL(file)
          break
        }
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [])

  useEffect(() => {
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()) }
  }, [])

  // ── Camera ───────────────────────────────────────────────────────
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      setCameraOpen(true)
      setTimeout(() => {
        if (videoRef.current) videoRef.current.srcObject = stream
      }, 50)
    } catch (err: any) {
      if (err.name !== 'NotAllowedError') console.error('Camera error:', err)
    }
  }

  const captureCamera = () => {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')!.drawImage(video, 0, 0)
    setImage(canvas.toDataURL('image/jpeg', 0.9))
    setImageFileName('Camera capture')
    setResponse(null)
    setError(null)
    closeCamera()
  }

  const closeCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraOpen(false)
  }

  // ── Screen capture ───────────────────────────────────────────────
  const captureScreen = async () => {
    try {
      const stream = await (navigator.mediaDevices as any).getDisplayMedia({ video: true })
      const video = document.createElement('video')
      video.muted = true
      video.srcObject = stream
      await video.play()
      await new Promise(r => setTimeout(r, 300))

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      canvas.getContext('2d')!.drawImage(video, 0, 0)
      stream.getTracks().forEach((t: MediaStreamTrack) => t.stop())

      setScreenshot(canvas.toDataURL('image/png'))
      setScreenSelectOpen(true)
    } catch (err: any) {
      if (err.name !== 'AbortError' && err.name !== 'NotAllowedError') {
        console.error('Screen capture error:', err)
      }
    }
  }

  // ── Region selection ─────────────────────────────────────────────
  const handleSelectionStart = (e: React.MouseEvent) => {
    if (!screenshotImgRef.current) return
    const rect = screenshotImgRef.current.getBoundingClientRect()
    setDragStart({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setDragCurrent({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    setDragging(true)
    setSelection(null)
  }

  const handleSelectionMove = (e: React.MouseEvent) => {
    if (!dragging || !dragStart || !screenshotImgRef.current) return
    const rect = screenshotImgRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width))
    const y = Math.max(0, Math.min(e.clientY - rect.top, rect.height))
    setDragCurrent({ x, y })
    setSelection({
      x: Math.min(dragStart.x, x),
      y: Math.min(dragStart.y, y),
      w: Math.abs(x - dragStart.x),
      h: Math.abs(y - dragStart.y),
    })
  }

  const handleSelectionEnd = () => {
    if (!dragging || !screenshot || !screenshotImgRef.current) { setDragging(false); return }
    setDragging(false)

    const img = screenshotImgRef.current
    const rect = img.getBoundingClientRect()
    const scaleX = img.naturalWidth / rect.width
    const scaleY = img.naturalHeight / rect.height
    const x1 = dragStart ? Math.min(dragStart.x, dragCurrent?.x ?? dragStart.x) : 0
    const y1 = dragStart ? Math.min(dragStart.y, dragCurrent?.y ?? dragStart.y) : 0
    const w = Math.abs((dragCurrent?.x ?? 0) - (dragStart?.x ?? 0))
    const h = Math.abs((dragCurrent?.y ?? 0) - (dragStart?.y ?? 0))

    const closeOverlay = () => {
      setScreenSelectOpen(false); setScreenshot(null)
      setDragStart(null); setDragCurrent(null); setSelection(null)
      setResponse(null); setError(null)
    }

    if (w < 10 || h < 10) {
      setImage(screenshot); setImageFileName('Full screen capture'); closeOverlay(); return
    }

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(w * scaleX)
    canvas.height = Math.round(h * scaleY)
    const sourceImg = new Image()
    sourceImg.onload = () => {
      canvas.getContext('2d')!.drawImage(sourceImg, Math.round(x1 * scaleX), Math.round(y1 * scaleY), canvas.width, canvas.height, 0, 0, canvas.width, canvas.height)
      setImage(canvas.toDataURL('image/png'))
      setImageFileName('Screen capture (region)')
      closeOverlay()
    }
    sourceImg.src = screenshot
  }

  // ── Ask AI ───────────────────────────────────────────────────────
  const handleAsk = async () => {
    if (!question.trim() && !image && !selectedBook) return
    setLoading(true); setResponse(null); setError(null); setUsedModel(selectedModel)
    const contextQuestion = selectedBook
      ? `[Textbook: "${selectedBook.title}" — ${selectedBook.subject}, ${selectedBook.class}, ${selectedBook.board}, by ${selectedBook.author}]\n\n${question || 'How should I teach this textbook? What are the key topics and suggested classroom activities?'}`
      : question
    try {
      const res = await fetch('/api/tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image, question: contextQuestion, model: selectedModel }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to get a response.')
      setResponse(data)
    } catch (err: any) { setError(err.message || 'Something went wrong.') }
    finally { setLoading(false) }
  }

  const reset = () => {
    setImage(null); setImageFileName(''); setSelectedBook(null)
    setQuestion(''); setResponse(null); setError(null)
  }

  const cfg = MODEL_CONFIG[selectedModel]
  const responseCfg = MODEL_CONFIG[usedModel]

  return (
    <div className="max-w-4xl mx-auto">

      {/* ── Camera Modal ── */}
      {cameraOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-gray-900 text-sm">Capture from Camera</p>
              <button onClick={closeCamera} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="bg-black aspect-video">
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            </div>
            <div className="p-4 flex gap-3">
              <button onClick={closeCamera} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={captureCamera} className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
                <Camera className="w-4 h-4" /> Capture
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Screen Region Selector ── */}
      {screenSelectOpen && screenshot && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-black/60 text-white flex-shrink-0">
            <div>
              <p className="text-sm font-semibold">Select a Region</p>
              <p className="text-xs text-white/50 mt-0.5">Drag to crop · Click without dragging to use the full screenshot</p>
            </div>
            <button
              onClick={() => { setScreenSelectOpen(false); setScreenshot(null); setDragStart(null); setDragCurrent(null); setSelection(null) }}
              className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div
            className="flex-1 overflow-auto flex items-center justify-center p-6 cursor-crosshair"
            onMouseDown={handleSelectionStart}
            onMouseMove={handleSelectionMove}
            onMouseUp={handleSelectionEnd}
          >
            <div className="relative inline-block select-none">
              <img
                ref={screenshotImgRef}
                src={screenshot}
                className="block rounded-lg shadow-2xl"
                draggable={false}
                style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 120px)' }}
                alt="Screen capture"
              />
              {selection && selection.w > 2 && selection.h > 2 && (
                <div
                  className="absolute border-2 border-blue-400 bg-blue-400/10 pointer-events-none"
                  style={{ left: selection.x, top: selection.y, width: selection.w, height: selection.h }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Brain className="w-7 h-7 text-purple-600" /> AI Teaching Assistant
          </h1>
          <p className="text-gray-500 mt-1">Capture your whiteboard, textbook page, or screen — get instant explanations to use in class</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Model dropdown */}
          <div className="relative">
            <button
              onClick={() => setModelDropdownOpen(o => !o)}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
            >
              <span className={selectedModel === 'claude' ? 'text-purple-600' : 'text-emerald-600'}>
                {MODEL_CONFIG[selectedModel].logo}
              </span>
              {MODEL_CONFIG[selectedModel].label}
              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            </button>
            {modelDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setModelDropdownOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                  {(['claude', 'openai'] as AIModel[]).map(m => (
                    <button key={m} onClick={() => { setSelectedModel(m); setModelDropdownOpen(false) }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-gray-50 ${selectedModel === m ? 'bg-purple-50' : ''}`}
                    >
                      <span className={selectedModel === m ? (m === 'claude' ? 'text-purple-600' : 'text-emerald-600') : 'text-gray-500'}>
                        {MODEL_CONFIG[m].logo}
                      </span>
                      <div className="text-left">
                        <p className={`font-medium ${selectedModel === m ? 'text-gray-900' : 'text-gray-700'}`}>{MODEL_CONFIG[m].label}</p>
                        <p className="text-xs text-gray-400">{MODEL_CONFIG[m].subLabel}</p>
                      </div>
                      {selectedModel === m && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          {(response || error) && (
            <button onClick={reset} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-xl hover:bg-gray-50 transition-all">
              <RefreshCw className="w-3.5 h-3.5" /> New Question
            </button>
          )}
        </div>
      </div>

      {/* Input card */}
      {!response && !error && (
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-6">

          {/* ── Library Picker Modal ── */}
      {libraryOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl flex flex-col shadow-2xl" style={{ maxHeight: '80vh' }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <p className="font-bold text-gray-900">Select from Teaching Library</p>
              <button onClick={() => setLibraryOpen(false)} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input autoFocus type="text" placeholder="Search by title, subject or class…" value={bookSearch} onChange={e => setBookSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 outline-none" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredBooks.map(book => {
                  const color = subjectColor(book.subject)
                  return (
                    <button key={book.id} onClick={() => { setSelectedBook(book); setImage(null); setImageFileName(''); setLibraryOpen(false); setBookSearch(''); setResponse(null); setError(null) }}
                      className="text-left rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all overflow-hidden group">
                      <div className="h-20 flex items-center justify-center" style={{ backgroundColor: color + '12', borderBottom: `2px solid ${color}30` }}>
                        <BookOpen className="w-7 h-7 transition-transform group-hover:scale-110" style={{ color }} />
                      </div>
                      <div className="p-2.5">
                        <p className="text-xs font-semibold text-gray-900 line-clamp-2 leading-snug mb-1">{book.title}</p>
                        <p className="text-xs text-gray-400">{book.class}</p>
                        <p className="text-xs text-gray-400">{book.author}</p>
                      </div>
                    </button>
                  )
                })}
                {filteredBooks.length === 0 && <p className="col-span-3 text-center text-sm text-gray-400 py-8">No books found</p>}
              </div>
            </div>
          </div>
        </div>
      )}

          {/* Context: library book or captured image */}
          {selectedBook ? (
            <div className="flex items-center gap-3 bg-violet-50 border border-violet-200 rounded-xl px-4 py-3 mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: subjectColor(selectedBook.subject) + '20' }}>
                <BookOpen className="w-5 h-5" style={{ color: subjectColor(selectedBook.subject) }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{selectedBook.title}</p>
                <p className="text-xs text-gray-500">{selectedBook.class} · {selectedBook.board} · {selectedBook.author}</p>
              </div>
              <button onClick={() => setSelectedBook(null)} className="p-1 hover:bg-violet-100 rounded-lg transition-colors flex-shrink-0">
                <X className="w-4 h-4 text-violet-400" />
              </button>
            </div>
          ) : image ? (
            <div className="relative inline-block mb-3 w-full text-center">
              <img src={image} alt="Captured" className="max-h-48 rounded-xl mx-auto shadow-sm" />
              <button onClick={() => { setImage(null); setImageFileName('') }}
                className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 shadow">
                <X className="w-3 h-3" />
              </button>
              <p className="text-xs text-gray-400 mt-1">{imageFileName}</p>
            </div>
          ) : (
            <button onClick={() => setLibraryOpen(true)}
              className="w-full border-2 border-dashed border-gray-200 rounded-xl p-5 text-center hover:border-purple-400 hover:bg-purple-50 transition-all mb-3 group">
              <div className="w-11 h-11 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-gray-700 font-medium text-sm">Browse Teaching Library</p>
              <p className="text-gray-400 text-xs mt-0.5">Pick a textbook to teach from</p>
            </button>
          )}

          {/* Capture buttons */}
          {!image && !selectedBook && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
              <button onClick={openCamera}
                className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 py-2.5 rounded-xl text-sm font-medium transition-all">
                <Camera className="w-4 h-4" /> Camera
              </button>
              <button onClick={captureScreen}
                className="flex items-center justify-center gap-2 border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 py-2.5 rounded-xl text-sm font-medium transition-all">
                <Monitor className="w-4 h-4" /> Screen
              </button>
              <div className="flex items-center justify-center gap-2 border border-dashed border-gray-200 text-gray-400 py-2.5 rounded-xl text-xs">
                <Clipboard className="w-3.5 h-3.5" /><span>Ctrl+V to paste</span>
              </div>
            </div>
          )}

          {/* Quick prompts */}
          {!image && !question && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Quick prompts</p>
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map(p => (
                  <button key={p} onClick={() => setQuestion(p)}
                    className="text-xs border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded-lg transition-all text-left">
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="relative mb-1">
            <textarea
              value={question}
              onChange={e => setQuestion(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleAsk() }}
              placeholder={isListening ? 'Listening…' : "Type or speak — e.g. 'How do I explain Newton's 3rd law to Class 9?'"}
              rows={3}
              className={`w-full border rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-colors ${isListening ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`}
            />
            <button
              onClick={toggleVoice}
              title={isListening ? 'Stop listening' : 'Speak your question'}
              className={`absolute bottom-3 right-3 p-1.5 rounded-lg transition-all ${isListening ? 'text-red-500 bg-red-100 animate-pulse' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'}`}
            >
              <Mic className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-gray-300 text-right mb-3">Ctrl+Enter to submit</p>

          <button onClick={handleAsk} disabled={loading || (!question.trim() && !image)}
            className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${cfg.color} text-white font-bold py-3.5 rounded-xl disabled:opacity-50 hover:shadow-lg ${cfg.hoverShadow} transition-all`}>
            {loading
              ? <><Loader2 className="w-5 h-5 animate-spin" />Analysing with {cfg.label}…</>
              : <><Send className="w-4 h-4" />Ask {cfg.label}</>}
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-2xl p-6 border border-purple-100 shadow-sm mb-6 flex items-center gap-4">
          {image && <img src={image} alt="Analysing" className="w-16 h-16 object-cover rounded-xl border border-gray-100" />}
          <div>
            <p className="font-semibold text-gray-900 text-sm">{cfg.loadingText} {image ? 'image' : 'question'}…</p>
            <p className="text-xs text-gray-400 mt-1">Preparing classroom-ready explanation</p>
            <div className="flex gap-1 mt-2">
              {[0, 1, 2].map(i => <div key={i} className={`w-2 h-2 rounded-full ${cfg.dot} animate-bounce`} style={{ animationDelay: `${i * 0.15}s` }} />)}
            </div>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-6 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="font-semibold text-red-700 text-sm mb-1">Could not get a response</p>
            <p className="text-red-600 text-sm">{error}</p>
            {(error.includes('ANTHROPIC_API_KEY') || error.includes('OPENAI_API_KEY')) && (
              <p className="text-red-500 text-xs mt-2 bg-red-100 rounded-lg px-3 py-2 font-mono">{MODEL_CONFIG[usedModel].envHint}</p>
            )}
          </div>
          <button onClick={reset} className="text-xs text-red-500 hover:underline">Try again</button>
        </div>
      )}

      {/* Response */}
      {response && (
        <div className="space-y-4">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold ${responseCfg.badge}`}>
            <span>{responseCfg.logo}</span>
            Answered by {responseCfg.label} ({responseCfg.subLabel})
          </div>

          {image && (
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center gap-3">
              <img src={image} alt="Your input" className="w-14 h-14 object-cover rounded-xl border border-gray-200" />
              <div>
                <p className="text-xs font-semibold text-gray-500">Your input</p>
                <p className="text-sm text-gray-600">{imageFileName}</p>
                {question && <p className="text-xs text-gray-400 mt-0.5">"{question}"</p>}
              </div>
            </div>
          )}

          <div className={`bg-gradient-to-br ${usedModel === 'claude' ? 'from-purple-50 to-indigo-50 border-purple-100' : 'from-emerald-50 to-teal-50 border-emerald-100'} rounded-2xl p-6 border`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 ${responseCfg.iconBg} rounded-xl flex items-center justify-center text-white`}>
                <Brain className="w-4 h-4" />
              </div>
              <h3 className={`font-bold ${usedModel === 'claude' ? 'text-purple-900' : 'text-emerald-900'}`}>Answer</h3>
            </div>
            <p className="text-gray-800 leading-relaxed text-sm">{response.answer}</p>
          </div>

          {response.explanation?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">Step-by-Step Breakdown</h3>
              </div>
              <ol className="space-y-3">
                {response.explanation.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <span className="w-6 h-6 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-gray-700 leading-relaxed">{step.replace(/^Step \d+:\s*/i, '')}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {response.applications?.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Globe className="w-4 h-4 text-emerald-600" />
                </div>
                <h3 className="font-bold text-gray-900">Classroom Applications</h3>
              </div>
              <ul className="space-y-2">
                {response.applications.map((app, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{app}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className={`${usedModel === 'claude' ? 'bg-purple-50 border-purple-100' : 'bg-emerald-50 border-emerald-100'} rounded-2xl p-4 border text-center`}>
            <p className={`text-sm ${usedModel === 'claude' ? 'text-purple-700' : 'text-emerald-700'} mb-3`}>Need another explanation?</p>
            <button onClick={reset}
              className={`bg-gradient-to-r ${responseCfg.color} text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity`}>
              Ask Another Question
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
