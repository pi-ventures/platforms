import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/students/[id]/attendance?month=2026-03
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const month = req.nextUrl.searchParams.get('month')

  const student = await prisma.student.findFirst({
    where: { OR: [{ id }, { userId: id }] },
    select: { id: true },
  })

  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

  const where: Record<string, unknown> = { studentId: student.id }
  if (month) {
    const [y, m] = month.split('-').map(Number)
    where.date = {
      gte: new Date(y, m - 1, 1),
      lt: new Date(y, m, 1),
    }
  }

  const records = await prisma.attendance.findMany({
    where: where as any,
    orderBy: { date: 'desc' },
  })

  const total = records.length
  const present = records.filter(r => r.status === 'PRESENT').length
  const absent = records.filter(r => r.status === 'ABSENT').length
  const late = records.filter(r => r.status === 'LATE').length
  const pct = total > 0 ? Math.round((present / total) * 1000) / 10 : 0

  return NextResponse.json({
    studentId: student.id,
    summary: { total, present, absent, late, percentage: pct },
    records: records.map(r => ({ date: r.date, status: r.status, remarks: r.remarks })),
  })
}
