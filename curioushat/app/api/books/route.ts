import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/books?page=1&limit=20&domain=NCERT&subject=Math&search=algebra — Paginated book listing
export async function GET(req: NextRequest) {
  try {
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10)
    const limit = Math.min(parseInt(req.nextUrl.searchParams.get('limit') || '20', 10), 100)
    const domain = req.nextUrl.searchParams.get('domain')
    const subject = req.nextUrl.searchParams.get('subject')
    const search = req.nextUrl.searchParams.get('search')

    const where: any = {}
    if (domain) where.domain = domain
    if (subject) where.subject = { contains: subject, mode: 'insensitive' }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { author: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [books, total] = await Promise.all([
      prisma.book.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.book.count({ where }),
    ])

    return NextResponse.json({
      books,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('GET /api/books error:', error)
    return NextResponse.json({ error: 'Failed to fetch books' }, { status: 500 })
  }
}
