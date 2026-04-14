'use client'
import { useState, useRef, useEffect } from 'react'
import { X, Brain, Send, Loader2, BookOpen, Lightbulb, AlertCircle, RefreshCw, Camera, Monitor, Clipboard, ChevronDown, Mic, Sparkles, Star, Square, Pencil } from 'lucide-react'

export interface Book {
  id: number; title: string; subject: string; class: string
  board: string; author: string; lang: string; type: string; pages: number
}

interface TutorResponse { answer: string; explanation: string[]; applications: string[] }

type AIModel = 'claude' | 'openai' | 'ai4bharat'

const MODEL_CONFIG = {
  claude: {
    label: 'Claude', subLabel: 'Sonnet · by Anthropic',
    color: 'from-purple-600 to-indigo-600', hoverShadow: 'hover:shadow-purple-200',
    badge: 'bg-purple-100 text-purple-700', dot: 'bg-purple-400', iconBg: 'bg-purple-600',
    envHint: 'Add ANTHROPIC_API_KEY to .env.local and restart',
    logo: (<svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M13.827 3.52h-3.654L5.551 20h3.651l4.625-16.48zm2.957 0-4.625 16.48h3.652L20.449 3.52h-3.665z"/></svg>),
  },
  openai: {
    label: 'ChatGPT', subLabel: 'GPT-4o · by OpenAI',
    color: 'from-emerald-500 to-teal-600', hoverShadow: 'hover:shadow-emerald-200',
    badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-400', iconBg: 'bg-emerald-600',
    envHint: 'Add OPENAI_API_KEY to .env.local and restart',
    logo: (<svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.896zm16.597 3.855-5.833-3.387 2.019-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.411-.663zm2.01-3.023-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365 2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/></svg>),
  },
  ai4bharat: {
    label: 'AI4Bharat', subLabel: 'IndicLLM · IIT Madras',
    color: 'from-orange-500 to-green-600', hoverShadow: 'hover:shadow-orange-200',
    badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-400', iconBg: 'bg-orange-500',
    envHint: 'Add AI4BHARAT_API_KEY to .env.local and restart',
    logo: (
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="9"/>
        <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
        <line x1="12" y1="3" x2="12" y2="10"/><line x1="12" y1="14" x2="12" y2="21"/>
        <line x1="3" y1="12" x2="10" y2="12"/><line x1="14" y1="12" x2="21" y2="12"/>
        <line x1="5.64" y1="5.64" x2="8.46" y2="8.46"/><line x1="15.54" y1="15.54" x2="18.36" y2="18.36"/>
        <line x1="18.36" y1="5.64" x2="15.54" y2="8.46"/><line x1="8.46" y1="15.54" x2="5.64" y2="18.36"/>
      </svg>
    ),
  },
} as const

const SUBJECT_COLORS: Record<string, string> = {
  Mathematics:'#4F46E5', Physics:'#0891B2', Chemistry:'#059669', Biology:'#7C3AED',
  English:'#D97706', History:'#B45309', 'General Science':'#DC2626', Economics:'#1D4ED8',
  'Computer Science':'#BE185D', Hindi:'#DC2626',
}
const subjectColor = (s: string) => SUBJECT_COLORS[s] || '#6B7280'

interface Props {
  book: Book
  onClose: () => void
  enabled: boolean          // plan feature gate
  role?: 'student' | 'teacher'
}

const STORAGE_KEY = (role: string) => `curioushat_ai_pref_${role}`
const VALID_MODELS: AIModel[] = ['claude', 'openai', 'ai4bharat']

export default function AITutorPanel({ book, onClose, enabled, role = 'student' }: Props) {
  const [selectedModel, setSelectedModel] = useState<AIModel>('claude')
  const [savedDefault, setSavedDefault] = useState<AIModel>('claude')
  const [defaultSavedFlash, setDefaultSavedFlash] = useState(false)
  const [image, setImage] = useState<string | null>(null)
  const [imageFileName, setImageFileName] = useState('')
  const [question, setQuestion] = useState('')
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<TutorResponse | null>(null)
  const [usedModel, setUsedModel] = useState<AIModel>('claude')
  const [error, setError] = useState<string | null>(null)
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false)
  const [askDropdownOpen, setAskDropdownOpen] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [cameraOpen, setCameraOpen] = useState(false)
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [screenSelectOpen, setScreenSelectOpen] = useState(false)
  const [dragStart, setDragStart] = useState<{ x: number; y: number } | null>(null)
  const [dragCurrent, setDragCurrent] = useState<{ x: number; y: number } | null>(null)
  const [selection, setSelection] = useState<{ x: number; y: number; w: number; h: number } | null>(null)
  const [selectMode, setSelectMode] = useState<'rect' | 'freehand'>('rect')

  // Refs so event handlers always read current values (avoids stale closure)
  const draggingRef = useRef(false)
  const selectModeRef = useRef<'rect' | 'freehand'>('rect')
  const freehandPointsRef = useRef<{ x: number; y: number }[]>([])
  const dragStartRef = useRef<{ x: number; y: number } | null>(null)
  const dragCurrentRef = useRef<{ x: number; y: number } | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const screenshotImgRef = useRef<HTMLImageElement>(null)
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null)
  const recognitionRef = useRef<any>(null)

  // Paste
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (!enabled) return
      const items = e.clipboardData?.items
      if (!items) return
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile(); if (!file) continue
          const reader = new FileReader()
          reader.onload = (ev) => { setImage(ev.target?.result as string); setImageFileName('Pasted image'); setResponse(null); setError(null) }
          reader.readAsDataURL(file); break
        }
      }
    }
    document.addEventListener('paste', handlePaste)
    return () => document.removeEventListener('paste', handlePaste)
  }, [enabled])

  useEffect(() => { return () => { streamRef.current?.getTracks().forEach(t => t.stop()) } }, [])

  // Load saved AI preference for this user role
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY(role)) as AIModel | null
    if (saved && VALID_MODELS.includes(saved)) {
      setSelectedModel(saved)
      setSavedDefault(saved)
    }
  }, [role])

  // Save model as this user's default and show brief flash confirmation
  const selectModel = (m: AIModel) => {
    setSelectedModel(m)
    setSavedDefault(m)
    localStorage.setItem(STORAGE_KEY(role), m)
    setDefaultSavedFlash(true)
    setTimeout(() => setDefaultSavedFlash(false), 1800)
  }

  // Voice
  const toggleVoice = () => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return }
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return
    const r = new SR(); r.lang = 'en-IN'; r.continuous = false; r.interimResults = false
    r.onstart = () => setIsListening(true)
    r.onresult = (e: any) => setQuestion(p => p ? p + ' ' + e.results[0][0].transcript : e.results[0][0].transcript)
    r.onend = () => setIsListening(false); r.onerror = () => setIsListening(false)
    recognitionRef.current = r; r.start()
  }

  // Camera
  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream; setCameraOpen(true)
      setTimeout(() => { if (videoRef.current) videoRef.current.srcObject = stream }, 50)
    } catch { }
  }
  const captureCamera = () => {
    if (!videoRef.current) return
    const v = videoRef.current
    const canvas = document.createElement('canvas'); canvas.width = v.videoWidth; canvas.height = v.videoHeight
    canvas.getContext('2d')!.drawImage(v, 0, 0)
    setImage(canvas.toDataURL('image/jpeg', 0.9)); setImageFileName('Camera capture')
    setResponse(null); setError(null); closeCamera()
  }
  const closeCamera = () => { streamRef.current?.getTracks().forEach(t => t.stop()); streamRef.current = null; setCameraOpen(false) }

  // Screen — capture the page behind this panel using html2canvas
  const captureScreen = async () => {
    try {
      const panel = document.getElementById('ai-tutor-panel')
      if (panel) panel.style.visibility = 'hidden'
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(document.body, {
        useCORS: true,
        scale: Math.min(window.devicePixelRatio || 1, 2),
        logging: false,
      })
      if (panel) panel.style.visibility = 'visible'
      setScreenshot(canvas.toDataURL('image/png'))
      setScreenSelectOpen(true)
    } catch (err) {
      const panel = document.getElementById('ai-tutor-panel')
      if (panel) panel.style.visibility = 'visible'
      console.error('Capture error:', err)
    }
  }
  // Draw the accumulated freehand path onto the overlay canvas
  const drawFreehandOverlay = () => {
    const canvas = overlayCanvasRef.current
    if (!canvas) return
    const pts = freehandPointsRef.current
    const ctx = canvas.getContext('2d')!
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (pts.length < 2) return
    ctx.beginPath()
    ctx.moveTo(pts[0].x, pts[0].y)
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y)
    ctx.strokeStyle = '#60a5fa'
    ctx.lineWidth = 2
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.stroke()
    // fill the closed shape lightly
    ctx.closePath()
    ctx.fillStyle = 'rgba(96,165,250,0.15)'
    ctx.fill()
    // start dot
    ctx.beginPath()
    ctx.arc(pts[0].x, pts[0].y, 5, 0, Math.PI * 2)
    ctx.fillStyle = '#60a5fa'
    ctx.fill()
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  const handleSelectionStart = (e: React.MouseEvent) => {
    if (!screenshotImgRef.current) return
    const imgRect = screenshotImgRef.current.getBoundingClientRect()
    const x = e.clientX - imgRect.left
    const y = e.clientY - imgRect.top
    draggingRef.current = true
    if (selectModeRef.current === 'freehand') {
      // size the canvas to exactly match the rendered image
      const canvas = overlayCanvasRef.current
      if (canvas) {
        canvas.width = imgRect.width
        canvas.height = imgRect.height
        canvas.style.width = imgRect.width + 'px'
        canvas.style.height = imgRect.height + 'px'
        canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height)
      }
      freehandPointsRef.current = [{ x, y }]
    } else {
      dragStartRef.current = { x, y }
      dragCurrentRef.current = { x, y }
      setDragStart({ x, y }); setDragCurrent({ x, y }); setSelection(null)
    }
  }

  const handleSelectionMove = (e: React.MouseEvent) => {
    if (!draggingRef.current || !screenshotImgRef.current) return
    const imgRect = screenshotImgRef.current.getBoundingClientRect()
    const x = Math.max(0, Math.min(e.clientX - imgRect.left, imgRect.width))
    const y = Math.max(0, Math.min(e.clientY - imgRect.top, imgRect.height))
    if (selectModeRef.current === 'freehand') {
      const pts = freehandPointsRef.current
      if (pts.length > 0) {
        const last = pts[pts.length - 1]
        if (Math.hypot(x - last.x, y - last.y) < 3) return
      }
      freehandPointsRef.current = [...pts, { x, y }]
      drawFreehandOverlay()
    } else {
      const ds = dragStartRef.current
      if (!ds) return
      dragCurrentRef.current = { x, y }
      setDragCurrent({ x, y })
      setSelection({ x: Math.min(ds.x, x), y: Math.min(ds.y, y), w: Math.abs(x - ds.x), h: Math.abs(y - ds.y) })
    }
  }

  const handleSelectionEnd = () => {
    if (!draggingRef.current || !screenshot || !screenshotImgRef.current) {
      draggingRef.current = false; return
    }
    draggingRef.current = false
    const img = screenshotImgRef.current
    const imgRect = img.getBoundingClientRect()
    const scaleX = img.naturalWidth / imgRect.width
    const scaleY = img.naturalHeight / imgRect.height
    const close = () => {
      setScreenSelectOpen(false); setScreenshot(null)
      setDragStart(null); setDragCurrent(null); setSelection(null)
      freehandPointsRef.current = []
      dragStartRef.current = null; dragCurrentRef.current = null
      const c = overlayCanvasRef.current
      if (c) c.getContext('2d')!.clearRect(0, 0, c.width, c.height)
    }

    if (selectModeRef.current === 'freehand') {
      const pts = freehandPointsRef.current
      if (pts.length < 6) { setImage(screenshot); setImageFileName('Full screen capture'); setResponse(null); setError(null); close(); return }
      const scaled = pts.map(p => ({ x: Math.round(p.x * scaleX), y: Math.round(p.y * scaleY) }))
      const minX = Math.min(...scaled.map(p => p.x)), minY = Math.min(...scaled.map(p => p.y))
      const maxX = Math.max(...scaled.map(p => p.x)), maxY = Math.max(...scaled.map(p => p.y))
      const cropW = maxX - minX, cropH = maxY - minY
      const full = document.createElement('canvas'); full.width = img.naturalWidth; full.height = img.naturalHeight
      const fCtx = full.getContext('2d')!
      fCtx.beginPath(); fCtx.moveTo(scaled[0].x, scaled[0].y)
      scaled.slice(1).forEach(p => fCtx.lineTo(p.x, p.y))
      fCtx.closePath(); fCtx.clip()
      const src = new Image()
      src.onload = () => {
        fCtx.drawImage(src, 0, 0)
        const crop = document.createElement('canvas'); crop.width = cropW; crop.height = cropH
        crop.getContext('2d')!.drawImage(full, minX, minY, cropW, cropH, 0, 0, cropW, cropH)
        setImage(crop.toDataURL('image/png')); setImageFileName('Screen capture (freehand)'); setResponse(null); setError(null); close()
      }
      src.src = screenshot
      return
    }

    // Rectangle mode
    const ds = dragStartRef.current, dc = dragCurrentRef.current
    const x1 = ds ? Math.min(ds.x, dc?.x ?? ds.x) : 0
    const y1 = ds ? Math.min(ds.y, dc?.y ?? ds.y) : 0
    const w = Math.abs((dc?.x ?? 0) - (ds?.x ?? 0))
    const h = Math.abs((dc?.y ?? 0) - (ds?.y ?? 0))
    if (w < 10 || h < 10) { setImage(screenshot); setImageFileName('Full screen capture'); setResponse(null); setError(null); close(); return }
    const canvas = document.createElement('canvas'); canvas.width = Math.round(w * scaleX); canvas.height = Math.round(h * scaleY)
    const src = new Image()
    src.onload = () => { canvas.getContext('2d')!.drawImage(src, Math.round(x1 * scaleX), Math.round(y1 * scaleY), canvas.width, canvas.height, 0, 0, canvas.width, canvas.height); setImage(canvas.toDataURL('image/png')); setImageFileName('Screen capture (region)'); setResponse(null); setError(null); close() }
    src.src = screenshot
  }

  // Ask
  const handleAsk = async (modelOverride?: AIModel) => {
    if (!question.trim() && !image) return
    const model = modelOverride ?? selectedModel
    setLoading(true); setResponse(null); setError(null); setUsedModel(model)
    const bookCtx = `[Textbook: "${book.title}" — ${book.subject}, ${book.class}, ${book.board}, by ${book.author}]`
    const contextQuestion = `${bookCtx}\n\n${question || (role === 'teacher' ? 'How should I teach this? Suggest key topics and a classroom activity.' : 'Explain this textbook and what topics it covers.')}`
    try {
      const res = await fetch('/api/tutor', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ image, question: contextQuestion, model }) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed.')
      setResponse(data)
    } catch (err: any) { setError(err.message || 'Something went wrong.') }
    finally { setLoading(false) }
  }

  const reset = () => { setImage(null); setImageFileName(''); setQuestion(''); setResponse(null); setError(null) }
  const cfg = MODEL_CONFIG[selectedModel], responseCfg = MODEL_CONFIG[usedModel]
  const bookColor = subjectColor(book.subject)

  return (
    <>
      {/* Camera Modal */}
      {cameraOpen && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl overflow-hidden w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <p className="font-semibold text-gray-900 text-sm">Take a Photo</p>
              <button onClick={closeCamera} className="p-1.5 hover:bg-gray-100 rounded-lg"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
            <div className="bg-black aspect-video"><video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" /></div>
            <div className="p-4 flex gap-3">
              <button onClick={closeCamera} className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">Cancel</button>
              <button onClick={captureCamera} className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-purple-700 flex items-center justify-center gap-2"><Camera className="w-4 h-4" /> Capture</button>
            </div>
          </div>
        </div>
      )}

      {/* Screen region selector */}
      {screenSelectOpen && screenshot && (
        <div className="fixed inset-0 z-[60] bg-black/90 flex flex-col">
          {/* Minimal top bar — just title + close */}
          <div className="flex items-center justify-between px-4 py-3 bg-black/60 text-white flex-shrink-0">
            <div>
              <p className="text-sm font-semibold">Select a Region</p>
              <p className="text-xs text-white/50 mt-0.5">
                {selectMode === 'freehand' ? 'Draw freehand around your area · release to crop' : 'Drag to select · release to crop'}
              </p>
            </div>
            <button onClick={() => { setScreenSelectOpen(false); setScreenshot(null); setDragStart(null); setDragCurrent(null); setSelection(null); freehandPointsRef.current = [] }}
              className="p-1.5 hover:bg-white/10 rounded-lg"><X className="w-4 h-4" /></button>
          </div>
          <div
            className={`flex-1 overflow-auto flex items-center justify-center p-6 cursor-crosshair`}
            onMouseDown={handleSelectionStart} onMouseMove={handleSelectionMove} onMouseUp={handleSelectionEnd}>
            <div className="relative inline-block select-none">
              <img ref={screenshotImgRef} src={screenshot} className="block rounded-lg shadow-2xl" draggable={false}
                style={{ maxWidth: '100%', maxHeight: 'calc(100vh - 120px)' }} alt="screen" />

              {/* Rectangle overlay */}
              {selectMode === 'rect' && selection && selection.w > 2 && selection.h > 2 && (
                <div className="absolute border-2 border-blue-400 bg-blue-400/10 pointer-events-none"
                  style={{ left: selection.x, top: selection.y, width: selection.w, height: selection.h }} />
              )}

              {/* Freehand canvas overlay — drawn imperatively, no React state updates during drawing */}
              <canvas
                ref={overlayCanvasRef}
                className="absolute top-0 left-0 pointer-events-none"
                style={{ display: selectMode === 'freehand' ? 'block' : 'none' }}
              />
            </div>

            {/* Floating mode toggle — fixed bottom-center, always visible */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gray-900/90 backdrop-blur-sm border border-white/20 rounded-2xl p-1.5 shadow-2xl pointer-events-auto z-[70]">
              <button
                onMouseDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); selectModeRef.current = 'rect'; setSelectMode('rect') }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectMode === 'rect' ? 'bg-white text-gray-900 shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
                <Square className="w-3.5 h-3.5" /> Rectangle
              </button>
              <button
                onMouseDown={e => e.stopPropagation()}
                onClick={e => { e.stopPropagation(); selectModeRef.current = 'freehand'; setSelectMode('freehand') }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${selectMode === 'freehand' ? 'bg-white text-gray-900 shadow-sm' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
                <Pencil className="w-3.5 h-3.5" /> Freehand
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Drawer ── */}
      <div id="ai-tutor-panel" className="fixed inset-0 z-50 flex">
        {/* Backdrop */}
        <div className="flex-1 bg-black/30" onClick={onClose} />

        {/* Panel */}
        <div className="w-full sm:w-[420px] bg-white shadow-2xl flex flex-col h-full overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                <Brain className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-sm">AI {role === 'teacher' ? 'Teaching Assistant' : 'Tutor'}</p>
                <p className="text-xs text-gray-400">Ask anything about this book</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {/* Model dropdown */}
              {enabled && (
                <div className="relative">
                  <button onClick={() => setModelDropdownOpen(o => !o)} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-white transition-all">
                    <span className={selectedModel === 'claude' ? 'text-purple-600' : 'text-emerald-600'}>{MODEL_CONFIG[selectedModel].logo}</span>
                    {MODEL_CONFIG[selectedModel].label}
                    <ChevronDown className="w-3 h-3 text-gray-400" />
                  </button>
                  {modelDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setModelDropdownOpen(false)} />
                      <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden">
                        <p className="px-3 pt-2 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Your Default AI</p>
                        {(['claude', 'openai', 'ai4bharat'] as AIModel[]).map(m => (
                          <button key={m} onClick={() => { selectModel(m); setModelDropdownOpen(false) }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-xs transition-colors hover:bg-gray-50 ${selectedModel === m ? 'bg-purple-50' : ''}`}>
                            <span className={m === 'claude' ? 'text-purple-600' : m === 'openai' ? 'text-emerald-600' : 'text-orange-500'}>{MODEL_CONFIG[m].logo}</span>
                            <div className="text-left flex-1"><p className="font-medium text-gray-800">{MODEL_CONFIG[m].label}</p><p className="text-gray-400">{MODEL_CONFIG[m].subLabel}</p></div>
                            <Star className={`w-3 h-3 flex-shrink-0 transition-colors ${m === savedDefault ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              )}
              <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><X className="w-4 h-4 text-gray-500" /></button>
            </div>
          </div>

          {/* Default saved flash */}
          {defaultSavedFlash && (
            <div className="mx-4 mt-2 flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 text-xs text-amber-700 font-medium animate-fade-in flex-shrink-0">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              {MODEL_CONFIG[selectedModel].label} set as your default AI
            </div>
          )}

          {/* Book context chip */}
          <div className="px-4 py-2.5 border-b border-gray-100 flex-shrink-0">
            <div className="flex items-center gap-2.5 bg-gray-50 rounded-xl px-3 py-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bookColor + '20' }}>
                <BookOpen className="w-4 h-4" style={{ color: bookColor }} />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-900 truncate">{book.title}</p>
                <p className="text-xs text-gray-400">{book.class} · {book.board} · {book.author}</p>
              </div>
            </div>
          </div>

          {/* ── Upgrade gate ── */}
          {!enabled ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 bg-violet-100 rounded-2xl flex items-center justify-center mb-4">
                <Sparkles className="w-8 h-8 text-violet-600" />
              </div>
              <h3 className="font-black text-gray-900 text-lg mb-2">AI Tutor is a paid feature</h3>
              <p className="text-gray-500 text-sm mb-6 leading-relaxed">Upgrade your plan to unlock AI-powered explanations, step-by-step solutions, and voice Q&amp;A for every book in the library.</p>
              <button className="bg-violet-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-violet-700 transition-colors text-sm">
                View Plans &amp; Upgrade
              </button>
            </div>
          ) : (
            /* ── Active tutor ── */
            <div className="flex-1 overflow-y-auto">
              {!response && !error && (
                <div className="p-4 space-y-3">
                  {/* Captured image preview */}
                  {image && (
                    <div className="relative">
                      <img src={image} alt="Captured" className="w-full max-h-40 object-cover rounded-xl border border-gray-200" />
                      <button onClick={() => { setImage(null); setImageFileName('') }} className="absolute top-1.5 right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 shadow">
                        <X className="w-3 h-3" />
                      </button>
                      <p className="text-xs text-gray-400 mt-1">{imageFileName}</p>
                    </div>
                  )}

                  {/* Capture row */}
                  {!image && (
                    <div className="grid grid-cols-3 gap-2">
                      <button onClick={openCamera} className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 py-2 rounded-xl text-xs font-medium transition-all">
                        <Camera className="w-3.5 h-3.5" /> Camera
                      </button>
                      <button onClick={captureScreen} className="flex items-center justify-center gap-1.5 border border-gray-200 text-gray-600 hover:border-purple-300 hover:text-purple-600 hover:bg-purple-50 py-2 rounded-xl text-xs font-medium transition-all">
                        <Monitor className="w-3.5 h-3.5" /> Capture Page
                      </button>
                      <div className="flex items-center justify-center gap-1 border border-dashed border-gray-200 text-gray-400 py-2 rounded-xl text-xs">
                        <Clipboard className="w-3 h-3" /> Ctrl+V
                      </div>
                    </div>
                  )}

                  {/* Question input — mic + ask button live inside the box */}
                  <div className="relative">
                    <textarea value={question} onChange={e => setQuestion(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); handleAsk() } }}
                      placeholder={isListening ? 'Listening…' : role === 'teacher' ? "Suggest a classroom activity for Chapter 3…" : "Explain Chapter 3, or solve problem 5…"}
                      rows={4}
                      className={`w-full border rounded-xl px-3 pt-2.5 pb-11 text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none resize-none transition-colors ${isListening ? 'border-red-300 bg-red-50/30' : 'border-gray-200'}`}
                    />
                    {/* Bottom toolbar inside textarea */}
                    <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-2 py-1.5 rounded-b-xl bg-gradient-to-t from-white via-white to-transparent pointer-events-none">
                      <span className="text-[10px] text-gray-300 select-none">Ctrl+Enter to send</span>
                      <div className="flex items-center gap-1 pointer-events-auto">
                        {/* Mic */}
                        <button onClick={toggleVoice} title={isListening ? 'Stop listening' : 'Voice input'}
                          className={`p-1.5 rounded-lg transition-all ${isListening ? 'text-red-500 bg-red-100 animate-pulse' : 'text-gray-400 hover:text-purple-600 hover:bg-purple-50'}`}>
                          <Mic className="w-3.5 h-3.5" />
                        </button>
                        {/* Ask (left) + Choose & Go (right chevron) */}
                        <div className="relative flex">
                          <button onClick={() => handleAsk()} disabled={loading || (!question.trim() && !image)}
                            className={`flex items-center gap-1 bg-gradient-to-r ${cfg.color} text-white font-bold px-3 py-1.5 rounded-l-lg disabled:opacity-40 text-xs transition-all border-r border-white/20`}>
                            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                            {loading ? 'Thinking…' : cfg.label}
                          </button>
                          <button onClick={() => setAskDropdownOpen(o => !o)} disabled={loading}
                            title="Choose AI & Go"
                            className={`flex items-center justify-center px-1.5 bg-gradient-to-r ${cfg.color} text-white rounded-r-lg disabled:opacity-40 hover:brightness-110 transition-all`}>
                            <ChevronDown className="w-3 h-3" />
                          </button>
                          {/* Choose & Go dropdown */}
                          {askDropdownOpen && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setAskDropdownOpen(false)} />
                              <div className="absolute right-0 bottom-full mb-2 w-56 bg-white border border-gray-200 rounded-xl shadow-2xl z-20 overflow-hidden">
                                <p className="px-3 pt-2.5 pb-1 text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Choose & Go · saves as your default</p>
                                {(['claude', 'openai', 'ai4bharat'] as AIModel[]).map(m => (
                                  <button key={m} onClick={() => { selectModel(m); setAskDropdownOpen(false); handleAsk(m) }}
                                    className={`w-full flex items-center gap-2.5 px-3 py-2.5 text-xs transition-colors hover:bg-gray-50 ${selectedModel === m ? 'bg-purple-50' : ''}`}>
                                    <span className={
                                      m === 'claude' ? 'text-purple-600' :
                                      m === 'openai' ? 'text-emerald-600' : 'text-orange-500'
                                    }>{MODEL_CONFIG[m].logo}</span>
                                    <div className="text-left flex-1">
                                      <p className="font-semibold text-gray-800">{MODEL_CONFIG[m].label}</p>
                                      <p className="text-gray-400">{MODEL_CONFIG[m].subLabel}</p>
                                    </div>
                                    <Star className={`w-3 h-3 flex-shrink-0 transition-colors ${m === savedDefault ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
                                  </button>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Loading */}
              {loading && (
                <div className="p-4 flex items-center gap-3">
                  {image && <img src={image} alt="" className="w-12 h-12 object-cover rounded-lg border border-gray-100" />}
                  <div>
                    <p className="text-sm font-medium text-gray-900">Analysing…</p>
                    <div className="flex gap-1 mt-1.5">{[0,1,2].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-bounce`} style={{ animationDelay: `${i * 0.15}s` }} />)}</div>
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="m-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-700 text-xs mb-1">Could not get a response</p>
                    <p className="text-red-600 text-xs">{error}</p>
                  </div>
                  <button onClick={reset} className="text-xs text-red-500 hover:underline flex-shrink-0">Retry</button>
                </div>
              )}

              {/* Response */}
              {response && (
                <div className="p-4 space-y-3">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${responseCfg.badge}`}>
                    <span>{responseCfg.logo}</span> {responseCfg.label}
                  </div>

                  <div className={`bg-gradient-to-br ${usedModel === 'claude' ? 'from-purple-50 to-indigo-50 border-purple-100' : 'from-emerald-50 to-teal-50 border-emerald-100'} rounded-xl p-4 border`}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-6 h-6 ${responseCfg.iconBg} rounded-lg flex items-center justify-center text-white`}><Brain className="w-3 h-3" /></div>
                      <p className={`font-bold text-sm ${usedModel === 'claude' ? 'text-purple-900' : 'text-emerald-900'}`}>Answer</p>
                    </div>
                    <p className="text-gray-800 text-sm leading-relaxed">{response.answer}</p>
                  </div>

                  {response.explanation?.length > 0 && (
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="font-bold text-gray-900 text-sm mb-3">Step-by-Step</p>
                      <ol className="space-y-2">
                        {response.explanation.map((step, i) => (
                          <li key={i} className="flex gap-2 text-xs">
                            <span className="w-5 h-5 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-0.5">{i + 1}</span>
                            <span className="text-gray-700 leading-relaxed">{step.replace(/^Step \d+:\s*/i, '')}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {response.applications?.length > 0 && (
                    <div className="bg-white rounded-xl p-4 border border-gray-100">
                      <p className="font-bold text-gray-900 text-sm mb-3">{role === 'teacher' ? 'Classroom Applications' : 'Real-World Applications'}</p>
                      <ul className="space-y-1.5">
                        {response.applications.map((app, i) => (
                          <li key={i} className="flex gap-2 text-xs text-gray-700">
                            <Lightbulb className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <span>{app}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button onClick={reset} className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-xs font-medium hover:bg-gray-50 transition-colors">
                    <RefreshCw className="w-3.5 h-3.5" /> Ask another question
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
