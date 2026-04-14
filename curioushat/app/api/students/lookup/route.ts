import { NextRequest, NextResponse } from 'next/server'
export const dynamic = 'force-dynamic'
import prisma from '@/lib/prisma'

// GET /api/students/lookup?roll=1&email=...
export async function GET(req: NextRequest) {
  const roll = req.nextUrl.searchParams.get('roll')
  const email = req.nextUrl.searchParams.get('email')

  let student
  if (roll) {
    student = await prisma.student.findFirst({
      where: { rollNumber: parseInt(roll) },
      select: { id: true, userId: true, rollNumber: true, user: { select: { name: true, email: true } } },
    })
  } else if (email) {
    student = await prisma.student.findFirst({
      where: { user: { email } },
      select: { id: true, userId: true, rollNumber: true, user: { select: { name: true, email: true } } },
    })
  }

  if (!student) return NextResponse.json({ error: 'Student not found' }, { status: 404 })

  return NextResponse.json({ id: student.id, userId: student.userId, roll: student.rollNumber, name: student.user.name, email: student.user.email })
}
