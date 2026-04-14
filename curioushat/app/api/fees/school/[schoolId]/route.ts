import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/fees/school/[schoolId] — Fee summary: structures + payment status per student
export async function GET(req: NextRequest, { params }: { params: Promise<{ schoolId: string }> }) {
  try {
    const { schoolId } = await params

    const [feeStructures, payments, school] = await Promise.all([
      prisma.feeStructure.findMany({
        where: { schoolId },
        orderBy: [{ academicYear: 'desc' }, { grade: 'asc' }],
      }),
      prisma.feePayment.findMany({
        where: { schoolId },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.school.findUnique({
        where: { id: schoolId },
        select: { id: true, name: true },
      }),
    ])

    if (!school) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 })
    }

    // Aggregate payments by student
    const paymentsByStudent: Record<string, { paid: number; pending: number; payments: any[] }> = {}
    for (const p of payments) {
      if (!paymentsByStudent[p.studentId]) {
        paymentsByStudent[p.studentId] = { paid: 0, pending: 0, payments: [] }
      }
      const entry = paymentsByStudent[p.studentId]
      if (p.status === 'paid') {
        entry.paid += p.amount
      } else {
        entry.pending += p.amount
      }
      entry.payments.push({
        id: p.id,
        amount: p.amount,
        feeType: p.feeType,
        term: p.term,
        academicYear: p.academicYear,
        status: p.status,
        paidAt: p.paidAt,
        receiptNo: p.receiptNo,
      })
    }

    // Summary stats
    const totalCollected = payments
      .filter((p) => p.status === 'paid')
      .reduce((sum, p) => sum + p.amount, 0)
    const totalPending = payments
      .filter((p) => p.status !== 'paid')
      .reduce((sum, p) => sum + p.amount, 0)

    return NextResponse.json({
      school,
      feeStructures,
      summary: {
        totalCollected,
        totalPending,
        studentCount: Object.keys(paymentsByStudent).length,
      },
      paymentsByStudent,
    })
  } catch (error) {
    console.error('GET /api/fees/school/[schoolId] error:', error)
    return NextResponse.json({ error: 'Failed to fetch fee data' }, { status: 500 })
  }
}
