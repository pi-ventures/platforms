import { NextRequest, NextResponse } from 'next/server'
import { runScrapeJob, matchBusinessesToCompanies, SCRAPE_CATEGORIES, ScrapeCategory } from '@/lib/scrapers/google-maps'
import prisma from '@/lib/prisma'

// POST /api/v1/scraper — Run a scrape job
// Body: { category: "real_estate", state: "Delhi", pincode: "110001", lat: 28.6, lng: 77.2 }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { category, action, ...params } = body

    if (action === 'match') {
      // Match pending Google Maps businesses to Company records
      const result = await matchBusinessesToCompanies()
      return NextResponse.json({ success: true, ...result })
    }

    if (!category || !SCRAPE_CATEGORIES[category as ScrapeCategory]) {
      return NextResponse.json({
        error: 'Invalid category',
        validCategories: Object.keys(SCRAPE_CATEGORIES),
      }, { status: 400 })
    }

    const result = await runScrapeJob({ category: category as ScrapeCategory, ...params })
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

// GET /api/v1/scraper — Get scraper job status and stats
export async function GET(req: NextRequest) {
  const jobId = req.nextUrl.searchParams.get('jobId')

  if (jobId) {
    const job = await prisma.scraperJob.findUnique({ where: { id: jobId } })
    return NextResponse.json(job)
  }

  // Summary stats
  const [totalJobs, totalBusinesses, pendingMatch, matched, newCompanies, totalCompanies] = await Promise.all([
    prisma.scraperJob.count(),
    prisma.googleMapsBusiness.count(),
    prisma.googleMapsBusiness.count({ where: { matchStatus: 'pending' } }),
    prisma.googleMapsBusiness.count({ where: { matchStatus: 'matched' } }),
    prisma.googleMapsBusiness.count({ where: { matchStatus: 'new_company' } }),
    prisma.company.count(),
  ])

  const recentJobs = await prisma.scraperJob.findMany({
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  return NextResponse.json({
    stats: {
      totalJobs,
      totalBusinesses,
      pendingMatch,
      matched,
      newCompanies,
      totalCompanies,
    },
    categories: Object.keys(SCRAPE_CATEGORIES),
    recentJobs,
  })
}
