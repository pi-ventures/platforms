import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { NextRequest, NextResponse } from 'next/server'

const anthropicClient = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SYSTEM_PROMPT = `You are an expert AI tutor for Indian school students (Classes 6–12, CBSE/ICSE boards).
Your job is to explain any concept, solve any problem, and connect learning to the real world.

When given an image:
- Read ALL text in the image carefully — handwriting, printed text, equations, diagrams, graphs, tables
- Identify exactly what question or problem is being asked
- Solve it completely and correctly

Always respond with ONLY a raw JSON object (no markdown, no code fences, no extra text) in this exact format:
{
  "answer": "Direct, accurate answer to the question in 2-3 sentences",
  "explanation": [
    "Step 1: ...",
    "Step 2: ...",
    "Step 3: ...",
    "Step 4: ...",
    "Step 5: ..."
  ],
  "applications": [
    "Real-world application 1",
    "Real-world application 2",
    "Real-world application 3",
    "Real-world application 4"
  ]
}

Be specific, accurate, and grade-appropriate. If the image contains a math/science problem, solve it fully with working shown in the explanation steps.`

async function callClaude(image: string | null, mimeType: string | null, question: string): Promise<string> {
  const content: Anthropic.MessageParam['content'] = []

  if (image) {
    const base64Data = image.includes(',') ? image.split(',')[1] : image
    const detectedMime = image.includes('data:')
      ? (image.split(';')[0].split(':')[1] as Anthropic.Base64ImageSource['media_type'])
      : (mimeType || 'image/jpeg')

    content.push({
      type: 'image',
      source: {
        type: 'base64',
        media_type: detectedMime as Anthropic.Base64ImageSource['media_type'],
        data: base64Data,
      },
    })
  }

  content.push({ type: 'text', text: question })

  const message = await anthropicClient.messages.create({
    model: 'claude-opus-4-5-20251101',
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content }],
  })

  return message.content[0].type === 'text' ? message.content[0].text.trim() : ''
}

async function callAI4Bharat(image: string | null, question: string): Promise<string> {
  const apiKey = process.env.AI4BHARAT_API_KEY
  if (!apiKey) throw new Error('AI4BHARAT_API_KEY is not configured. Add it to your .env.local file. Get access at https://ai4bharat.iitm.ac.in/')

  // AI4Bharat exposes an OpenAI-compatible chat completions endpoint
  const userContent: Array<{ type: string; text?: string; image_url?: { url: string } }> = []
  if (image) {
    const imageUrl = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`
    userContent.push({ type: 'image_url', image_url: { url: imageUrl } })
  }
  userContent.push({ type: 'text', text: question })

  const response = await fetch('https://api.ai4bharat.org/v1/chat/completions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'Airavata',   // AI4Bharat's instruction-tuned IndicLLM
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userContent },
      ],
      max_tokens: 1500,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`AI4Bharat API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content?.trim() ?? ''
}

async function callOpenAI(image: string | null, question: string): Promise<string> {
  const userContent: OpenAI.Chat.ChatCompletionContentPart[] = []

  if (image) {
    // OpenAI accepts full data URL directly
    const imageUrl = image.startsWith('data:') ? image : `data:image/jpeg;base64,${image}`
    userContent.push({
      type: 'image_url',
      image_url: { url: imageUrl, detail: 'high' },
    })
  }

  userContent.push({ type: 'text', text: question })

  const response = await openaiClient.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 1500,
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: userContent },
    ],
  })

  return response.choices[0]?.message?.content?.trim() ?? ''
}

function parseResponse(rawText: string) {
  // Strip any accidental markdown fences the model might add
  const jsonText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
  try {
    return JSON.parse(jsonText)
  } catch {
    return {
      answer: rawText,
      explanation: ['The AI returned a response but it was not in the expected format. See the answer above.'],
      applications: [],
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { image, mimeType, question, model } = await req.json()

    // Validate API key for chosen model
    if (model === 'openai' && !process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OPENAI_API_KEY is not configured. Add it to your .env.local file.' }, { status: 500 })
    }
    if (model === 'ai4bharat' && !process.env.AI4BHARAT_API_KEY) {
      return NextResponse.json({ error: 'AI4BHARAT_API_KEY is not configured. Add it to your .env.local file. Get API access at https://ai4bharat.iitm.ac.in/' }, { status: 500 })
    }
    if (model !== 'openai' && model !== 'ai4bharat' && !process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured. Add it to your .env.local file.' }, { status: 500 })
    }

    if (!image && !question?.trim()) {
      return NextResponse.json(
        { error: 'Please upload an image or type a question.' },
        { status: 400 }
      )
    }

    const userText = question?.trim()
      ? question.trim()
      : 'Please read this image carefully. If it contains a question or problem, solve it completely. If it is a diagram or concept, explain it in detail.'

    const rawText = model === 'openai'
      ? await callOpenAI(image, userText)
      : model === 'ai4bharat'
        ? await callAI4Bharat(image, userText)
        : await callClaude(image, mimeType, userText)

    const parsed = parseResponse(rawText)
    return NextResponse.json(parsed)

  } catch (error: any) {
    console.error('AI Tutor error:', error)
    const message = error?.message || 'An unexpected error occurred'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
