// ─────────────────────────────────────────────────────────────────────────────
//  MyVault API Route Implementations (Next.js App Router)
//  Copy these into each platform's /app/api/ directory
// ─────────────────────────────────────────────────────────────────────────────

// ── YesBroker: /app/api/myvault/sync/route.ts ─────────────────────────────
export const YESBROKER_SYNC_HANDLER = `
import { NextRequest, NextResponse } from 'next/server'
import { SyncSDK, YesBrokerSyncPayload } from '@myvault/sync-sdk'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const userId = req.headers.get('X-User-ID') || ''
    const apiKey = process.env.MYVAULT_API_KEY || ''

    const sdk = new SyncSDK({ platform: 'yesbroker', userId, apiKey })

    const payload: YesBrokerSyncPayload = {
      source: 'yesbroker',
      userId,
      timestamp: new Date().toISOString(),
      properties: body.properties || [],
      stats: body.stats || {},
    }

    const result = await sdk.pushToMyVault(payload)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
`

// ── TheEquinox: /app/api/myvault/sync/route.ts ────────────────────────────
export const EQUINOX_SYNC_HANDLER = `
import { NextRequest, NextResponse } from 'next/server'
import { SyncSDK, TheEquinoxSyncPayload } from '@myvault/sync-sdk'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const userId = req.headers.get('X-User-ID') || ''
    const apiKey = process.env.MYVAULT_API_KEY || ''

    const sdk = new SyncSDK({ platform: 'theequinox', userId, apiKey })

    const payload: TheEquinoxSyncPayload = {
      source: 'theequinox',
      userId,
      timestamp: new Date().toISOString(),
      portfolio: body.portfolio,
      holdings: body.holdings || [],
      autoRulesActive: body.autoRulesActive || 0,
    }

    const result = await sdk.pushToMyVault(payload)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
`

// ── MyWills: /app/api/myvault/sync/route.ts ───────────────────────────────
export const MYWILLS_SYNC_HANDLER = `
import { NextRequest, NextResponse } from 'next/server'
import { SyncSDK, MyWillsSyncPayload } from '@myvault/sync-sdk'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const userId = req.headers.get('X-User-ID') || ''
    const apiKey = process.env.MYVAULT_API_KEY || ''

    const sdk = new SyncSDK({ platform: 'mywills', userId, apiKey })

    const payload: MyWillsSyncPayload = {
      source: 'mywills',
      userId,
      managedBy: 'legalopinion.co.in',
      timestamp: new Date().toISOString(),
      estate: body.estate,
      assets: body.assets || [],
    }

    const result = await sdk.pushToMyVault(payload)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
`

// ── MyVault → KnowledgeHub.ai: /app/api/knowledgehub/sync/route.ts ─────────
export const MYVAULT_TO_KNOWLEDGEHUB_HANDLER = `
import { NextRequest, NextResponse } from 'next/server'
import { SyncSDK, KnowledgeHubPayload } from '@myvault/sync-sdk'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const userId = req.headers.get('X-User-ID') || ''
    const apiKey = process.env.KNOWLEDGEHUB_API_KEY || ''

    const sdk = new SyncSDK({ platform: 'myvault', userId, apiKey })

    // Build aggregated KnowledgeHub payload from all 3 platform data
    const payload: KnowledgeHubPayload = {
      userId,
      timestamp: new Date().toISOString(),
      userType: body.userType || 'individual',
      geography: body.geography || { country: 'IN', state: 'Maharashtra', city: 'Mumbai' },
      netWorthSnapshot: body.netWorthSnapshot,
      platforms: body.platforms || {},
      aggregateMetrics: {
        wealthGrowthMoM: body.aggregateMetrics?.wealthGrowthMoM || 0,
        wealthGrowthYoY: body.aggregateMetrics?.wealthGrowthYoY || 0,
        diversificationScore: body.aggregateMetrics?.diversificationScore || 0,
        riskScore: body.aggregateMetrics?.riskScore || 0,
        willCoverageScore: body.aggregateMetrics?.willCoverageScore || 0,
      },
    }

    const result = await sdk.pushToKnowledgeHub(payload)
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}
`
