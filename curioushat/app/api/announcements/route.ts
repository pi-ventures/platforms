import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import prisma from '@/lib/prisma'

// GET /api/announcements?schoolId=xxx — List announcements for a school
export async function GET(req: NextRequest) {
  try {
    const schoolId = req.nextUrl.searchParams.get('schoolId')

    if (!schoolId) {
      return NextResponse.json({ error: 'schoolId is required' }, { status: 400 })
    }

    const announcements = await prisma.announcement.findMany({
      where: { schoolId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ announcements })
  } catch (error) {
    console.error('GET /api/announcements error:', error)
    return NextResponse.json({ error: 'Failed to fetch announcements' }, { status: 500 })
  }
}

// POST /api/announcements — Create a new announcement
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { schoolId, title, content, audience, priority, createdBy } = body

    if (!schoolId || !title || !content || !createdBy) {
      return NextResponse.json(
        { error: 'schoolId, title, content, and createdBy are required' },
        { status: 400 }
      )
    }

    const announcement = await prisma.announcement.create({
      data: {
        schoolId,
        title,
        content,
        audience: audience || [],
        priority: priority || 'normal',
        createdBy,
      },
    })

    return NextResponse.json({ announcement }, { status: 201 })
  } catch (error) {
    console.error('POST /api/announcements error:', error)
    return NextResponse.json({ error: 'Failed to create announcement' }, { status: 500 })
  }
}
