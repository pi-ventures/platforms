import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import crypto from 'crypto'
import { cache } from '@/lib/cache'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 120_000,
  maxRetries: 2,
})

interface ExamRequest {
  board: string
  class: string
  subject: string
  topic: string
  totalMarks: string
  duration: string
  difficulty: string
  mcq: string
  short: string
  long: string
}

function requestHash(req: ExamRequest): string {
  const key = `${req.board}:${req.class}:${req.subject}:${req.topic}:${req.totalMarks}:${req.difficulty}:${req.mcq}:${req.short}:${req.long}`
  return crypto.createHash('md5').update(key).digest('hex')
}

function buildPrompt(req: ExamRequest): string {
  return `Generate a complete ${req.board} Class ${req.class} ${req.subject} exam paper.

Topic/Chapter: ${req.topic}
Total Marks: ${req.totalMarks}
Duration: ${req.duration} minutes
Difficulty: ${req.difficulty}

Question distribution:
- MCQ (1 mark each): ${req.mcq} questions
- Short answer (3 marks each): ${req.short} questions
- Long answer (5 marks each): ${req.long} questions

Requirements:
1. Questions must be board-aligned, grade-appropriate, and factually accurate
2. Include a model answer and marking scheme for EVERY question
3. MCQs must have 4 options (a, b, c, d) with the correct answer indicated
4. Short answers should need 3-5 sentences
5. Long answers should need 8-10 sentences or include diagrams/derivations

Respond with ONLY a raw JSON object (no markdown fences, no extra text):
{
  "title": "Paper title including board, class, subject, and topic",
  "sections": [
    {
      "title": "Section A — Multiple Choice Questions (1 × N = X marks)",
      "questions": [
        { "no": 1, "text": "Question text with options (a) ... (b) ... (c) ... (d) ...", "marks": 1, "answer": "Correct option with brief explanation" }
      ]
    },
    {
      "title": "Section B — Short Answer Questions (3 × N = X marks)",
      "questions": [
        { "no": 6, "text": "Question text", "marks": 3, "answer": "Model answer with key points" }
      ]
    },
    {
      "title": "Section C — Long Answer Questions (5 × N = X marks)",
      "questions": [
        { "no": 9, "text": "Question text", "marks": 5, "answer": "Detailed model answer" }
      ]
    }
  ]
}`
}

function parseJSON(raw: string): any {
  // Try direct parse
  try { return JSON.parse(raw.trim()) } catch {}

  // Strip markdown fences
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) {
    try { return JSON.parse(fenced[1].trim()) } catch {}
  }

  // Extract first JSON object
  const braceMatch = raw.match(/\{[\s\S]*\}/)
  if (braceMatch) {
    try { return JSON.parse(braceMatch[0]) } catch {}
  }

  throw new Error('Failed to parse exam paper from AI response')
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured.' }, { status: 500 })
    }

    const body: ExamRequest = await req.json()

    if (!body.subject || !body.topic?.trim()) {
      return NextResponse.json({ error: 'Subject and topic are required.' }, { status: 400 })
    }

    // Check cache (24-hour TTL)
    const cacheKey = `exam:${requestHash(body)}`
    const cached = cache.get(cacheKey)
    if (cached) {
      return NextResponse.json({ ...JSON.parse(cached), fromCache: true })
    }

    const start = Date.now()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{ role: 'user', content: buildPrompt(body) }],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
    const paper = parseJSON(rawText)

    const response = {
      success: true,
      paper,
      generationTime: ((Date.now() - start) / 1000).toFixed(1),
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
    }

    // Cache for 24 hours
    cache.set(cacheKey, JSON.stringify(response), 86400)

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Exam generation error:', error)

    if (error?.status === 429) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait and try again.' }, { status: 429 })
    }
    if (error?.status === 401) {
      return NextResponse.json({ error: 'API key is invalid.' }, { status: 500 })
    }
    if (error?.message?.includes('timeout')) {
      return NextResponse.json({ error: 'Generation timed out. Try fewer questions or a simpler topic.' }, { status: 504 })
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to generate exam paper.' },
      { status: 500 }
    )
  }
}
