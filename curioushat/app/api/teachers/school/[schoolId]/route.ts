import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/teachers/school/[schoolId] — List teachers with subjects, experience, class assignments
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

    const teachers = await prisma.teacher.findMany({
      where: { schoolId },
      include: {
        user: { select: { name: true, email: true, phone: true, avatarUrl: true } },
        classSubjects: {
          include: {
            class: { select: { grade: true, section: true, academicYear: true } },
          },
        },
      },
      orderBy: { user: { name: 'asc' } },
    })

    const result = teachers.map((t: any) => ({
      id: t.id,
      name: t.user.name,
      email: t.user.email,
      phone: t.user.phone,
      avatarUrl: t.user.avatarUrl,
      employeeId: t.employeeId,
      qualification: t.qualification,
      specialization: t.specialization,
      subjects: t.subjects,
      experience: t.experience,
      joinDate: t.joinDate,
      isClassTeacher: t.isClassTeacher,
      classAssignments: t.classSubjects.map((cs: any) => ({
        subjectName: cs.subjectName,
        grade: cs.class.grade,
        section: cs.class.section,
        academicYear: cs.class.academicYear,
      })),
    }))

    return NextResponse.json({ school, teachers: result })
  } catch (error) {
    console.error('GET /api/teachers/school/[schoolId] error:', error)
    return NextResponse.json({ error: 'Failed to fetch teachers' }, { status: 500 })
  }
}
