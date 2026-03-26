import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// POST /api/v1/masterdata/ingest — Receive wealth data from MyVault
export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    const data = payload.payload || payload

    await prisma.ingestLog.create({
      data: { source: payload.sourcePlatform || 'myvault', dataType: 'wealth', status: 'received' },
    })

    await prisma.wealthSnapshot.create({
      data: {
        userId: data.userId,
        userType: data.userType || 'individual',
        state: data.geography?.state || '',
        city: data.geography?.city || '',
        netWorth: data.netWorthSnapshot || {},
        platforms: data.platforms || {},
        metrics: data.aggregateMetrics || {},
      },
    })

    return NextResponse.json({ success: true, recordsSynced: 1 })
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
