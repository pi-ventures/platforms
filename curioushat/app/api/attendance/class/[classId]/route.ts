import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/attendance/class/[classId]?date=2026-04-02 — Get attendance for a class on a date
export async function GET(req: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  try {
    const { classId } = await params
    const dateStr = req.nextUrl.searchParams.get('date')

    if (!dateStr) {
      return NextResponse.json({ error: 'date query parameter is required (YYYY-MM-DD)' }, { status: 400 })
    }

    const date = new Date(dateStr + 'T00:00:00.000Z')

    // Get all students in the class
    const classInfo = await prisma.schoolClass.findUnique({
      where: { id: classId },
      include: {
        students: {
          where: { leftAt: null },
          include: {
            student: {
              include: {
                user: { select: { name: true } },
                attendance: {
                  where: { date },
                },
              },
            },
          },
          orderBy: { rollNumber: 'asc' },
        },
      },
    })

    if (!classInfo) {
      return NextResponse.json({ error: 'Class not found' }, { status: 404 })
    }

    const students = classInfo.students.map((sc: any) => {
      const att = sc.student.attendance[0]
      return {
        studentId: sc.student.id,
        name: sc.student.user.name,
        rollNumber: sc.rollNumber,
        status: att?.status || null,
        remarks: att?.remarks || null,
      }
    })

    return NextResponse.json({
      classId,
      grade: classInfo.grade,
      section: classInfo.section,
      date: dateStr,
      students,
    })
  } catch (error) {
    console.error('GET /api/attendance/class/[classId] error:', error)
    return NextResponse.json({ error: 'Failed to fetch attendance' }, { status: 500 })
  }
}

// POST /api/attendance/class/[classId] — Bulk mark attendance
// body: { date: "2026-04-02", records: [{ studentId, status, remarks? }] }
export async function POST(req: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  try {
    const { classId } = await params
    const body = await req.json()
    const { date: dateStr, records } = body

    if (!dateStr || !records || !Array.isArray(records)) {
      return NextResponse.json(
        { error: 'date and records[] are required' },
        { status: 400 }
      )
    }

    const date = new Date(dateStr + 'T00:00:00.000Z')
    let marked = 0

    for (const { studentId, status, remarks } of records) {
      await (prisma.attendance as any).upsert({
        where: {
          studentId_date: { studentId, date },
        },
        update: { status, remarks: remarks || null },
        create: {
          studentId,
          date,
          status,
          remarks: remarks || null,
        },
      })
      marked++
    }

    return NextResponse.json({ success: true, classId, date: dateStr, marked })
  } catch (error) {
    console.error('POST /api/attendance/class/[classId] error:', error)
    return NextResponse.json({ error: 'Failed to mark attendance' }, { status: 500 })
  }
}
