import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/timetable/[classId] — Get timetable for a class, grouped by day
export async function GET(req: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  try {
    const { classId } = await params

    const entries = await prisma.timetable.findMany({
      where: { classId },
      orderBy: [{ day: 'asc' }, { period: 'asc' }],
    })

    if (entries.length === 0) {
      // Check if class exists at all
      const classExists = await prisma.schoolClass.findUnique({ where: { id: classId } })
      if (!classExists) {
        return NextResponse.json({ error: 'Class not found' }, { status: 404 })
      }
    }

    // Group by day
    const grouped: Record<string, any[]> = {}
    for (const entry of entries) {
      if (!grouped[entry.day]) grouped[entry.day] = []
      grouped[entry.day].push({
        period: entry.period,
        startTime: entry.startTime,
        endTime: entry.endTime,
        subject: entry.subject,
        teacherName: entry.teacherName,
        room: entry.room,
      })
    }

    return NextResponse.json({ classId, timetable: grouped })
  } catch (error) {
    console.error('GET /api/timetable/[classId] error:', error)
    return NextResponse.json({ error: 'Failed to fetch timetable' }, { status: 500 })
  }
}
