import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/students/[id]/profile
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const student = await prisma.student.findFirst({
    where: { OR: [{ id }, { userId: id }] },
    include: {
      user: { select: { name: true, email: true, avatarUrl: true } },
      school: { select: { name: true, board: true, city: true, state: true, type: true } },
      profileCard: true,
      classes: { include: { class: { select: { grade: true, section: true, academicYear: true } } }, orderBy: { joinedAt: 'desc' }, take: 1 },
      entranceExamPrep: true,
      scholarships: true,
    },
  })

  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

  // Get attendance summary
  const allAttendance = await prisma.attendance.findMany({ where: { studentId: student.id } })
  const totalDays = allAttendance.length
  const presentDays = allAttendance.filter(a => a.status === 'PRESENT').length

  return NextResponse.json({
    id: student.id,
    name: student.user.name,
    email: student.user.email,
    school: student.school,
    currentClass: student.classes[0]?.class || null,
    rollNumber: student.rollNumber,
    gender: student.gender,
    category: student.category,
    dateOfBirth: student.dateOfBirth,
    attendance: { total: totalDays, present: presentDays, percentage: totalDays > 0 ? Math.round((presentDays / totalDays) * 1000) / 10 : 0 },
    profileCard: student.profileCard,
    entranceExamPrep: student.entranceExamPrep,
    scholarships: student.scholarships,
  })
}
