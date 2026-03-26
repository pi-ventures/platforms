import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { text, source, targets } = await req.json() as {
      text: string
      source: string
      targets: { lang: string; code: string }[]
    }

    if (!text || !targets?.length) {
      return NextResponse.json({ error: 'Missing text or targets' }, { status: 400 })
    }

    const results: Record<string, string> = {}

    // Translate in parallel batches of 8
    const batchSize = 8
    for (let i = 0; i < targets.length; i += batchSize) {
      const batch = targets.slice(i, i + batchSize)
      const promises = batch.map(async ({ lang, code }) => {
        try {
          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source}&tl=${code}&dt=t&q=${encodeURIComponent(text)}`
          const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0' },
          })
          if (!res.ok) {
            results[lang] = `[Error: ${res.status}]`
            return
          }
          const data = await res.json()
          let translated = ''
          if (Array.isArray(data) && Array.isArray(data[0])) {
            for (const segment of data[0]) {
              if (Array.isArray(segment) && segment[0]) translated += segment[0]
            }
          }
          results[lang] = translated || text
        } catch {
          results[lang] = `[Translation unavailable]`
        }
      })
      await Promise.all(promises)
    }

    return NextResponse.json({ translations: results })
  } catch {
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}
