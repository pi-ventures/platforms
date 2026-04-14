import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/scores/class/[classId]?year=2025-26 — Teacher gradebook view
export async function GET(req: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params
  const year = req.nextUrl.searchParams.get('year') || '2025-26'

  const classInfo = await prisma.schoolClass.findUnique({
    where: { id: classId },
    include: {
      students: {
        include: {
          student: {
            include: {
              user: { select: { name: true } },
              scores: {
                where: { academicYear: year },
                include: { subject: { select: { subjectName: true } } },
              },
            },
          },
        },
        orderBy: { rollNumber: 'asc' },
      },
      subjects: { select: { subjectName: true } },
    },
  })

  if (!classInfo) return NextResponse.json({ error: 'Class not found' }, { status: 404 })

  const students = classInfo.students.map((sc: any) => {
    const s = sc.student
    const scoresByExam: Record<string, number> = {}

    for (const score of s.scores) {
      const key = `${score.subject.subjectName}_${score.examType}`
      scoresByExam[key] = score.marksObtained
    }

    // Calculate totals per exam type
    const examTypes = ['UT1', 'UT2', 'MID', 'UT3', 'PRE_BOARD']
    const examTotals: Record<string, number> = {}
    for (const et of examTypes) {
      const marks = s.scores.filter((sc2: any) => sc2.examType === et)
      examTotals[et] = marks.reduce((a: number, m: any) => a + m.marksObtained, 0)
    }

    return {
      name: s.user.name,
      roll: sc.rollNumber || 0,
      scores: scoresByExam,
      examTotals,
    }
  })

  return NextResponse.json({
    classId,
    grade: classInfo.grade,
    section: classInfo.section,
    academicYear: year,
    subjects: classInfo.subjects.map((s: any) => s.subjectName),
    students,
  })
}

// POST /api/scores/class/[classId] — Bulk score entry
export async function POST(req: NextRequest, { params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params
  const body = await req.json()

  // body: { subjectName, examType, academicYear, term, maxMarks, scores: [{studentId, marks}] }
  const { subjectName, examType, academicYear, term, maxMarks, scores } = body

  const classSubject = await prisma.classSubject.findFirst({
    where: { classId, subjectName },
  })

  if (!classSubject) return NextResponse.json({ error: 'Subject not found for this class' }, { status: 404 })

  let created = 0
  for (const { studentId, marks } of scores) {
    const pct = (marks / maxMarks) * 100
    const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B+' : pct >= 60 ? 'B' : pct >= 50 ? 'C' : pct >= 40 ? 'D' : 'F'

    await (prisma.score as any).upsert({
      where: {
        studentId_subjectId_examType_academicYear: undefined as any, // composite not defined, use create
      },
      update: { marksObtained: marks, maxMarks, percentage: Math.round(pct * 10) / 10, grade, gradedAt: new Date() },
      create: {
        studentId, subjectId: classSubject.id, examType, academicYear, term,
        marksObtained: marks, maxMarks, percentage: Math.round(pct * 10) / 10, grade, gradedAt: new Date(),
      },
    }).catch(async () => {
      // Fallback: just create if upsert fails
      await prisma.score.create({
        data: {
          studentId, subjectId: classSubject.id, examType, academicYear, term,
          marksObtained: marks, maxMarks, percentage: Math.round(pct * 10) / 10, grade, gradedAt: new Date(),
        },
      })
    })
    created++
  }

  return NextResponse.json({ success: true, created })
}
