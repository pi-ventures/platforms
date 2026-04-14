import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/courses?classLevel=10&subject=Math — List courses with enrollment counts
export async function GET(req: NextRequest) {
  try {
    const classLevel = req.nextUrl.searchParams.get('classLevel')
    const subject = req.nextUrl.searchParams.get('subject')

    const where: any = {}
    if (classLevel) where.classLevel = classLevel
    if (subject) where.subject = { contains: subject, mode: 'insensitive' }

    const courses = await prisma.course.findMany({
      where,
      include: {
        enrollments: {
          select: { id: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    const result = courses.map((c: any) => ({
      id: c.id,
      title: c.title,
      subject: c.subject,
      classLevel: c.classLevel,
      board: c.board,
      description: c.description,
      isPublished: c.isPublished,
      chapters: c.chapters,
      enrollmentCount: c.enrollments.length,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    }))

    return NextResponse.json({ courses: result, total: result.length })
  } catch (error) {
    console.error('GET /api/courses error:', error)
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
