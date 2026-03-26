import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/students/[id]/scores?year=2025-26
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const year = req.nextUrl.searchParams.get('year') || '2025-26'

  const student = await prisma.student.findFirst({
    where: { OR: [{ id }, { userId: id }] },
    select: { id: true },
  })

  if (!student) {
    return NextResponse.json({ error: 'Student not found' }, { status: 404 })
  }

  const scores = await prisma.score.findMany({
    where: { studentId: student.id, academicYear: year },
    include: { subject: { select: { subjectName: true, teacher: { select: { user: { select: { name: true } } } } } } },
    orderBy: [{ subject: { subjectName: 'asc' } }, { examType: 'asc' }],
  })

  // Group by subject
  const bySubject: Record<string, {
    subject: string
    teacher: string
    exams: { type: string; marks: number; maxMarks: number; pct: number; grade: string }[]
    avg: number
    overallGrade: string
  }> = {}

  for (const s of scores) {
    const subj = s.subject.subjectName
    if (!bySubject[subj]) {
      bySubject[subj] = {
        subject: subj,
        teacher: s.subject.teacher?.user?.name || '',
        exams: [],
        avg: 0,
        overallGrade: '',
      }
    }
    bySubject[subj].exams.push({
      type: s.examType,
      marks: s.marksObtained,
      maxMarks: s.maxMarks,
      pct: s.percentage,
      grade: s.grade || '',
    })
  }

  // Calculate averages
  for (const subj of Object.values(bySubject)) {
    const avg = subj.exams.reduce((a, e) => a + e.pct, 0) / subj.exams.length
    subj.avg = Math.round(avg * 10) / 10
    subj.overallGrade = avg >= 90 ? 'A+' : avg >= 80 ? 'A' : avg >= 70 ? 'B+' : avg >= 60 ? 'B' : avg >= 50 ? 'C' : avg >= 40 ? 'D' : 'F'
  }

  const subjects = Object.values(bySubject)
  const overall = subjects.length > 0
    ? Math.round(subjects.reduce((a, s) => a + s.avg, 0) / subjects.length)
    : 0

  return NextResponse.json({ studentId: student.id, academicYear: year, subjects, overall })
}
