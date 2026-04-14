import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/classes/school/[schoolId] — List classes with student counts and class teacher info
export async function GET(req: NextRequest, { params }: { params: Promise<{ schoolId: string }> }) {
  try {
    const { schoolId } = await params

    const school = await prisma.school.findUnique({
      where: { id: schoolId },
      select: { id: true, name: true },
    })

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 })
    }

    const classes = await prisma.schoolClass.findMany({
      where: { schoolId },
      include: {
        students: {
          where: { leftAt: null },
          select: { id: true },
        },
        subjects: {
          select: { subjectName: true },
        },
      },
      orderBy: [{ grade: 'asc' }, { section: 'asc' }],
    })

    // Collect classTeacherIds to batch-fetch teacher info
    const teacherIds = classes
      .map((c: { classTeacherId: string | null }) => c.classTeacherId)
      .filter((id: string | null): id is string => id !== null)

    const teachers = teacherIds.length > 0
      ? await prisma.teacher.findMany({
          where: { id: { in: teacherIds } },
          include: { user: { select: { name: true } } },
        })
      : []

    const teacherMap: Record<string, string> = {}
    for (const t of teachers) {
      teacherMap[t.id] = (t as any).user.name
    }

    const result = classes.map((c: any) => ({
      id: c.id,
      grade: c.grade,
      section: c.section,
      academicYear: c.academicYear,
      roomNumber: c.roomNumber,
      studentCount: c.students.length,
      subjects: c.subjects.map((s: any) => s.subjectName),
      classTeacher: c.classTeacherId
        ? { id: c.classTeacherId, name: teacherMap[c.classTeacherId] || null }
        : null,
    }))

    return NextResponse.json({ school, classes: result })
  } catch (error) {
    console.error('GET /api/classes/school/[schoolId] error:', error)
    return NextResponse.json({ error: 'Failed to fetch classes' }, { status: 500 })
  }
}
