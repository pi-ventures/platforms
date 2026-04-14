import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 120_000,
  maxRetries: 2,
})

function buildGradingPrompt(modelAnswer: string): string {
  const modelContext = modelAnswer.trim()
    ? `\n\nModel Answer / Marking Scheme provided by the teacher:\n${modelAnswer}`
    : ''

  return `You are an expert exam grader for Indian school boards (CBSE/ICSE).

Carefully read the handwritten answer sheet image(s). For each question you can identify:
1. Extract the student's written answer using OCR
2. Compare it against the expected answer (use your subject knowledge if no model answer is provided)
3. Award marks fairly based on correctness, completeness, and presentation
4. Provide constructive feedback${modelContext}

Respond with ONLY a raw JSON object (no markdown fences):
{
  "studentName": "Name if visible on the sheet, otherwise 'Student'",
  "totalMarks": <number>,
  "maxMarks": <number>,
  "percentage": <number>,
  "grade": "A+/A/B+/B/C/D/F",
  "questions": [
    {
      "no": 1,
      "question": "Question text as seen on the paper",
      "studentAnswer": "What the student wrote (OCR transcription)",
      "modelAnswer": "The correct/expected answer",
      "marksAwarded": <number>,
      "maxMarks": <number>,
      "feedback": "Specific constructive feedback for this answer"
    }
  ]
}`
}

function parseJSON(raw: string): any {
  try { return JSON.parse(raw.trim()) } catch {}
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) { try { return JSON.parse(fenced[1].trim()) } catch {} }
  const braceMatch = raw.match(/\{[\s\S]*\}/)
  if (braceMatch) { try { return JSON.parse(braceMatch[0]) } catch {} }
  throw new Error('Failed to parse grading result from AI response')
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json({ error: 'ANTHROPIC_API_KEY is not configured.' }, { status: 500 })
    }

    const { images, modelAnswer = '' } = await req.json()

    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse.json({ error: 'At least one answer sheet image is required.' }, { status: 400 })
    }

    if (images.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 images per grading request.' }, { status: 400 })
    }

    const content: Anthropic.MessageParam['content'] = []

    // Add all images
    for (const image of images) {
      const base64Data = image.includes(',') ? image.split(',')[1] : image
      const detectedMime = image.includes('data:')
        ? (image.split(';')[0].split(':')[1] as Anthropic.Base64ImageSource['media_type'])
        : 'image/jpeg'

      content.push({
        type: 'image',
        source: {
          type: 'base64',
          media_type: detectedMime as Anthropic.Base64ImageSource['media_type'],
          data: base64Data,
        },
      })
    }

    content.push({ type: 'text', text: buildGradingPrompt(modelAnswer) })

    const start = Date.now()

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8000,
      messages: [{ role: 'user', content }],
    })

    const rawText = message.content[0].type === 'text' ? message.content[0].text : ''
    const result = parseJSON(rawText)

    return NextResponse.json({
      success: true,
      ...result,
      gradingTime: ((Date.now() - start) / 1000).toFixed(1),
      tokensUsed: message.usage.input_tokens + message.usage.output_tokens,
    })

  } catch (error: any) {
    console.error('Grading error:', error)

    if (error?.status === 429) {
      return NextResponse.json({ error: 'Rate limit exceeded. Please wait and try again.' }, { status: 429 })
    }
    if (error?.message?.includes('timeout')) {
      return NextResponse.json({ error: 'Grading timed out. Try fewer images.' }, { status: 504 })
    }

    return NextResponse.json(
      { error: error?.message || 'Failed to grade answer sheets.' },
      { status: 500 }
    )
  }
}
