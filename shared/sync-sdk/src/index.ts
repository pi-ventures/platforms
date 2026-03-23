// ─────────────────────────────────────────────────────────────────────────────
//  MyVault & KnowledgeHub.ai — Shared Sync SDK
//  Used by: YesBroker | TheEquinox.ai | MyWills | MyVault
//  Endpoints: api.myvault.in | api.knowledgehub.ai
// ─────────────────────────────────────────────────────────────────────────────

export type PlatformId = 'yesbroker' | 'theequinox' | 'mywills' | 'myvault'

// ─── Sync Event Types ────────────────────────────────────────────────────────
export type SyncEventType =
  | 'FULL_SYNC'
  | 'INCREMENTAL_SYNC'
  | 'PROPERTY_UPDATE'
  | 'LEAD_UPDATE'
  | 'PORTFOLIO_UPDATE'
  | 'WILL_UPDATE'
  | 'ASSET_UPDATE'
  | 'USER_PROFILE_UPDATE'

export interface SyncEvent {
  id: string
  sourcePlatform: PlatformId
  eventType: SyncEventType
  userId: string
  timestamp: string
  payload: Record<string, unknown>
  checksum: string
}

export interface SyncResult {
  success: boolean
  eventId: string
  platform: PlatformId
  recordsSynced: number
  timestamp: string
  errors?: string[]
}

// ─── MyVault Payload Types ───────────────────────────────────────────────────
export interface YesBrokerSyncPayload {
  source: 'yesbroker'
  userId: string
  timestamp: string
  properties: Array<{
    id: string
    title: string
    type: string
    listingType: string
    price: number
    area: number
    city: string
    status: string
  }>
  stats: {
    totalProperties: number
    activeListings: number
    totalLeads: number
    revenueThisMonth: number
    dealsClosedThisMonth: number
    conversionRate: number
  }
}

export interface TheEquinoxSyncPayload {
  source: 'theequinox'
  userId: string
  timestamp: string
  portfolio: {
    totalValue: number
    totalInvested: number
    totalPnL: number
    pnlPercent: number
    dayPnL: number
  }
  holdings: Array<{
    symbol: string
    name: string
    value: number
    pnlPercent: number
  }>
  autoRulesActive: number
}

export interface MyWillsSyncPayload {
  source: 'mywills'
  userId: string
  timestamp: string
  managedBy: 'legalopinion.co.in'
  estate: {
    totalAssets: number
    totalValue: number
    willStatus: 'draft' | 'active' | 'probate'
    beneficiaries: number
    propertiesCount: number
    financialAssetsValue: number
    legalReviewStatus: 'pending' | 'approved' | 'expired'
  }
  assets: Array<{
    id: string
    type: string
    name: string
    value: number
    coveredInWill: boolean
  }>
}

// ─── KnowledgeHub.ai Master Analytics ───────────────────────────────────────
export interface KnowledgeHubPayload {
  userId: string
  timestamp: string
  userType: 'individual' | 'company'
  geography: {
    country: 'IN'
    state: string
    city: string
  }
  netWorthSnapshot: {
    total: number
    realEstate: number
    investments: number
    estateAssets: number
    cash: number
    other: number
    currency: 'INR'
  }
  platforms: {
    yesbroker?: {
      activeListings: number
      totalLeads: number
      monthlyRevenue: number
      connectedAdPlatforms: number
    }
    theequinox?: {
      portfolioValue: number
      pnlPercent: number
      activeAutoRules: number
    }
    mywills?: {
      estateValue: number
      willCoverage: number  // percentage of assets in will
      beneficiaries: number
    }
  }
  aggregateMetrics: {
    wealthGrowthMoM: number        // % month-over-month
    wealthGrowthYoY: number        // % year-over-year
    diversificationScore: number   // 0-100
    riskScore: number              // 0-100 (0 = low risk)
    willCoverageScore: number      // 0-100
  }
}

// ─── SDK Config ──────────────────────────────────────────────────────────────
export interface SyncSDKConfig {
  platform: PlatformId
  userId: string
  apiKey: string
  myVaultEndpoint?: string    // default: https://api.myvault.in
  knowledgeHubEndpoint?: string // default: https://api.knowledgehub.ai
  syncInterval?: number       // ms, default: 300000 (5 min)
  debug?: boolean
}

// ─── Main SDK Class ───────────────────────────────────────────────────────────
export class SyncSDK {
  private config: Required<SyncSDKConfig>
  private intervalId?: ReturnType<typeof setInterval>

  constructor(config: SyncSDKConfig) {
    this.config = {
      myVaultEndpoint: 'https://api.myvault.in',
      knowledgeHubEndpoint: 'https://api.knowledgehub.ai',
      syncInterval: 300_000,
      debug: false,
      ...config,
    }
  }

  // ── Push data TO MyVault ──────────────────────────────────────────────────
  async pushToMyVault(
    payload: YesBrokerSyncPayload | TheEquinoxSyncPayload | MyWillsSyncPayload
  ): Promise<SyncResult> {
    const event = this.buildSyncEvent('FULL_SYNC', payload)

    if (this.config.debug) {
      console.log(`[SyncSDK] Pushing to MyVault:`, event)
    }

    try {
      const response = await fetch(`${this.config.myVaultEndpoint}/v1/sync/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-Platform': this.config.platform,
          'X-User-ID': this.config.userId,
        },
        body: JSON.stringify(event),
      })

      if (!response.ok) {
        throw new Error(`MyVault sync failed: ${response.statusText}`)
      }

      const result = await response.json()
      return {
        success: true,
        eventId: event.id,
        platform: this.config.platform,
        recordsSynced: result.recordsSynced || 1,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        eventId: event.id,
        platform: this.config.platform,
        recordsSynced: 0,
        timestamp: new Date().toISOString(),
        errors: [(error as Error).message],
      }
    }
  }

  // ── Push aggregated data TO KnowledgeHub.ai ───────────────────────────────
  async pushToKnowledgeHub(payload: KnowledgeHubPayload): Promise<SyncResult> {
    const event = this.buildSyncEvent('FULL_SYNC', payload)

    if (this.config.debug) {
      console.log(`[SyncSDK] Pushing to KnowledgeHub.ai:`, event)
    }

    try {
      const response = await fetch(`${this.config.knowledgeHubEndpoint}/v1/masterdata/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-Platform': this.config.platform,
          'X-User-ID': this.config.userId,
        },
        body: JSON.stringify(event),
      })

      if (!response.ok) {
        throw new Error(`KnowledgeHub.ai sync failed: ${response.statusText}`)
      }

      return {
        success: true,
        eventId: event.id,
        platform: this.config.platform,
        recordsSynced: 1,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      return {
        success: false,
        eventId: event.id,
        platform: this.config.platform,
        recordsSynced: 0,
        timestamp: new Date().toISOString(),
        errors: [(error as Error).message],
      }
    }
  }

  // ── Pull data FROM MyVault (for other platforms to consume) ───────────────
  async pullFromMyVault<T = Record<string, unknown>>(dataType: string): Promise<T | null> {
    try {
      const response = await fetch(
        `${this.config.myVaultEndpoint}/v1/sync/pull?type=${dataType}&userId=${this.config.userId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'X-Platform': this.config.platform,
          },
        }
      )
      if (!response.ok) return null
      return await response.json() as T
    } catch {
      return null
    }
  }

  // ── Start automatic background sync ──────────────────────────────────────
  startAutoSync(syncFn: () => Promise<void>): void {
    this.intervalId = setInterval(async () => {
      if (this.config.debug) console.log('[SyncSDK] Auto-sync triggered')
      try {
        await syncFn()
      } catch (err) {
        console.error('[SyncSDK] Auto-sync error:', err)
      }
    }, this.config.syncInterval)
  }

  stopAutoSync(): void {
    if (this.intervalId) clearInterval(this.intervalId)
  }

  // ── Helpers ───────────────────────────────────────────────────────────────
  private buildSyncEvent(
    eventType: SyncEventType,
    payload: Record<string, unknown>
  ): SyncEvent {
    const id = `${this.config.platform}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    const timestamp = new Date().toISOString()
    const checksum = this.simpleChecksum(JSON.stringify(payload))
    return { id, sourcePlatform: this.config.platform, eventType, userId: this.config.userId, timestamp, payload, checksum }
  }

  private simpleChecksum(str: string): string {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash).toString(16).padStart(8, '0')
  }
}

// ─── React Hook: useSyncStatus ────────────────────────────────────────────────
// Usage in any platform component:
//   const { status, lastSync, sync } = useSyncStatus(sdk)

export interface SyncStatus {
  status: 'idle' | 'syncing' | 'success' | 'error'
  lastSync?: string
  lastResult?: SyncResult
}

// ─── Convenience Factory Functions ───────────────────────────────────────────
export const createYesBrokerSync = (userId: string, apiKey: string) =>
  new SyncSDK({ platform: 'yesbroker', userId, apiKey })

export const createEquinoxSync = (userId: string, apiKey: string) =>
  new SyncSDK({ platform: 'theequinox', userId, apiKey })

export const createMyWillsSync = (userId: string, apiKey: string) =>
  new SyncSDK({ platform: 'mywills', userId, apiKey })

export const createMyVaultSync = (userId: string, apiKey: string) =>
  new SyncSDK({ platform: 'myvault', userId, apiKey })

// ─── API Route Handlers (Next.js) ────────────────────────────────────────────
// Use these in /app/api/sync/route.ts in each platform

export const MYVAULT_API_ROUTES = {
  INGEST:    '/v1/sync/ingest',       // POST - receive data from platforms
  PULL:      '/v1/sync/pull',         // GET  - serve data to platforms
  STATUS:    '/v1/sync/status',       // GET  - sync health check
  WEBHOOK:   '/v1/sync/webhook',      // POST - receive push notifications
  HISTORY:   '/v1/sync/history',      // GET  - sync history log
}

export const KNOWLEDGEHUB_API_ROUTES = {
  INGEST:    '/v1/masterdata/ingest', // POST - receive aggregate data
  QUERY:     '/v1/masterdata/query',  // GET  - query master analytics
  REPORTS:   '/v1/masterdata/reports',// GET  - pre-built analytics reports
  EXPORT:    '/v1/masterdata/export', // GET  - export data
}

export default SyncSDK
