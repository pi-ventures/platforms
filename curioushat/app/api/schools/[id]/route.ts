import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/schools/[id]
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const school = await prisma.school.findUnique({
    where: { id },
    include: {
      classes: { select: { id: true, grade: true, section: true, academicYear: true } },
      _count: { select: { students: true, teachers: true, announcements: true } },
      govtSchemes: true,
      feeStructures: { where: { academicYear: '2025-26' } },
      announcements: { orderBy: { createdAt: 'desc' }, take: 5 },
    },
  })

  if (!school) return NextResponse.json({ error: 'School not found' }, { status: 404 })

  return NextResponse.json(school)
}
