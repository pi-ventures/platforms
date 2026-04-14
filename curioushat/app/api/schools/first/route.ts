import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET /api/schools/first — Return the first school in the DB (convenience for pages that need a schoolId)
export async function GET() {
  try {
    const school = await prisma.school.findFirst({
      select: { id: true, name: true },
      orderBy: { createdAt: 'asc' },
    })

    if (!school) {
      return NextResponse.json({ error: 'No schools found' }, { status: 404 })
    }

    return NextResponse.json(school)
  } catch (error) {
    console.error('GET /api/schools/first error:', error)
    return NextResponse.json({ error: 'Failed to fetch school' }, { status: 500 })
  }
}
