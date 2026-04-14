import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'

// Some language codes need alternate forms for Google TTS
const TTS_CODE_MAP: Record<string, string[]> = {
  'fa': ['fa', 'fa-IR', 'ar'],        // Persian → try Arabic as last resort
  'he': ['he', 'iw', 'he-IL'],        // Hebrew (Google uses 'iw' internally)
  'zh-CN': ['zh-CN', 'zh', 'zh-TW'],  // Chinese variants
  'or': ['or', 'or-IN', 'hi'],        // Odia → try Hindi as fallback
  'pa': ['pa', 'pa-IN', 'hi'],        // Punjabi → try Hindi as fallback
}

export async function GET(req: NextRequest) {
  const lang = req.nextUrl.searchParams.get('lang') || 'en'
  const text = req.nextUrl.searchParams.get('text') || ''

  if (!text) {
    return NextResponse.json({ error: 'Missing text' }, { status: 400 })
  }

  // Try the requested code first, then alternates
  const codesToTry = TTS_CODE_MAP[lang] || [lang]

  for (const code of codesToTry) {
    try {
      const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${code}&q=${encodeURIComponent(text.slice(0, 200))}`
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0' },
      })

      if (res.ok) {
        const audioBuffer = await res.arrayBuffer()
        // Verify it's actual audio (not an error page)
        if (audioBuffer.byteLength > 100) {
          return new NextResponse(audioBuffer, {
            headers: {
              'Content-Type': 'audio/mpeg',
              'Cache-Control': 'public, max-age=86400',
            },
          })
        }
      }
    } catch {
      continue
    }
  }

  return NextResponse.json({ error: 'TTS not available for this language' }, { status: 502 })
}
