// ─────────────────────────────────────────────────────────────────────────────
//  MyVault & KnowledgeHub.ai — Shared Sync SDK
//  Used by: YesBroker | TheEquinox.ai | MyWills | MyVault
//  Endpoints: api.myvault.in | api.knowledgehub.ai
// ─────────────────────────────────────────────────────────────────────────────

export type PlatformId = 'yesbroker' | 'theequinox' | 'mywills' | 'myvault' | 'curioushat' | 'iqedge'

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
  // CuriousHat education events
  | 'STUDENT_SCORE_UPDATE'
  | 'STUDENT_PROFILE_UPDATE'
  | 'ATTENDANCE_UPDATE'
  | 'EXAM_RESULT_UPDATE'
  | 'SCHOOL_METRICS_UPDATE'
  | 'ADMISSION_LEAD_UPDATE'
  | 'COACHING_LEAD_UPDATE'
  | 'ENTRANCE_EXAM_UPDATE'

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

// ─── CuriousHat.ai → IQEdge.ai Sync Payload ─────────────────────────────────
// Student performance data flows: CuriousHat → IQEdge (analytics) → KnowledgeHub (master)
export interface CuriousHatStudentPayload {
  source: 'curioushat'
  studentId: string
  schoolId: string
  timestamp: string
  student: {
    name: string
    grade: string
    section: string
    board: string
    category?: string // General, OBC, SC, ST, EWS
    state: string
    pincode: string
  }
  scores: Array<{
    subject: string
    examType: string // UT1, UT2, MID, PRE_BOARD, BOARD
    marksObtained: number
    maxMarks: number
    percentage: number
    grade: string
    term: string
    academicYear: string
  }>
  attendance: {
    totalDays: number
    present: number
    absent: number
    percentage: number
  }
  profileCard: {
    overallPercent: number
    stream?: string
    strengthMap: Record<string, number>   // {Mathematics: 92, Physics: 87}
    weaknessAreas: string[]
    aiCareerRecommendations: string[]
    aiStreamRecommendation?: string
    entranceScores?: Record<string, number> // {JEE: 185, CUET: 420}
    isShareable: boolean
  }
  entranceExamPrep?: Array<{
    examName: string
    targetYear: number
    mocksTaken: number
    bestScore: number
    readinessPercent: number
    subjectWise: Record<string, number>
  }>
}

export interface CuriousHatSchoolPayload {
  source: 'curioushat'
  schoolId: string
  timestamp: string
  school: {
    name: string
    type: 'PRIVATE' | 'GOVERNMENT' | 'AIDED' | 'CENTRAL'
    board: string
    udiseCode?: string
    city: string
    state: string
    pincode: string
    studentCount: number
    teacherCount: number
  }
  metrics: {
    avgPassPercent: number
    avgAttendance: number
    boardExamPassRate: number
    topperScore: number
    genderRatio: { boys: number; girls: number }
    dropoutRate: number
    teacherStudentRatio: number
  }
  govtSchemes?: Array<{
    schemeName: string
    compliancePercent: number
    status: string
  }>
}

// ─── IQEdge.ai Analytics Payload (receives from CuriousHat, sends to KnowledgeHub) ──
export interface IQEdgeAnalyticsPayload {
  source: 'iqedge'
  timestamp: string
  scope: 'student' | 'school' | 'district' | 'state' | 'national'
  scopeId: string  // studentId, schoolId, districtCode, stateCode, 'IN'

  // Student-level analytics (when scope = 'student')
  studentAnalytics?: {
    performanceTrend: Array<{ month: string; avgPercent: number }>
    subjectStrength: Record<string, number>
    predictedBoardScore: number
    collegeReadinessScore: number  // 0-100
    entranceExamReadiness: Record<string, number> // {JEE: 65, NEET: 40}
    careerFitScores: Array<{ career: string; fitPercent: number }>
    scholarshipEligibility: string[]
    peerRank: { schoolRank: number; districtRank: number; stateRank: number }
  }

  // School-level analytics (when scope = 'school')
  schoolAnalytics?: {
    passRate3yr: number[]
    avgScoreBySubject: Record<string, number>
    attendanceTrend: number[]
    teacherEffectiveness: Record<string, number>
    infrastructureScore: number
    govtVsPrivateComparison?: { govtAvg: number; privateAvg: number }
  }

  // District/State aggregates
  aggregateAnalytics?: {
    totalStudents: number
    totalSchools: number
    avgPassRate: number
    genderGap: number
    dropoutRate: number
    topPerformingSchools: Array<{ name: string; score: number }>
    bottomPerformingSchools: Array<{ name: string; score: number }>
  }
}

// ─── KnowledgeHub.ai Education Master Data ───────────────────────────────────
export interface KnowledgeHubEducationPayload {
  source: 'curioushat'
  timestamp: string
  dataType: 'student_outcomes' | 'school_metrics' | 'market_intelligence' | 'admission_funnel'

  // Anonymized, aggregated education market data
  educationMetrics?: {
    region: { state: string; district?: string; pincode?: string }
    academicYear: string
    board: string
    totalStudents: number
    avgBoardScore: number
    topStreamDemand: Array<{ stream: string; percent: number }>
    topEntranceExams: Array<{ exam: string; aspirants: number; avgScore: number }>
    collegeAdmissionRate: number
    coachingPenetration: number  // % students enrolled in coaching
  }

  // Admission marketplace intelligence
  admissionFunnel?: {
    totalProfiles: number
    totalLeadsSent: number
    totalApplications: number
    totalAdmissions: number
    conversionRate: number
    topCollegesByLeads: Array<{ name: string; leads: number }>
    topCoachingByEnrollment: Array<{ name: string; enrolled: number }>
    avgLeadCost: number  // ₹ per verified lead
  }
}

// ─── SDK Config ──────────────────────────────────────────────────────────────
export interface SyncSDKConfig {
  platform: PlatformId
  userId: string
  apiKey: string
  myVaultEndpoint?: string       // default: https://api.myvault.in
  knowledgeHubEndpoint?: string  // default: https://api.knowledgehub.ai
  iqEdgeEndpoint?: string        // default: https://api.iqedge.ai
  syncInterval?: number          // ms, default: 300000 (5 min)
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
      iqEdgeEndpoint: 'https://api.iqedge.ai',
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

  // ── Push student/school data TO IQEdge.ai (CuriousHat → IQEdge) ─────────
  async pushToIQEdge(
    payload: CuriousHatStudentPayload | CuriousHatSchoolPayload
  ): Promise<SyncResult> {
    const event = this.buildSyncEvent(
      payload.source === 'curioushat' && 'student' in payload ? 'STUDENT_PROFILE_UPDATE' : 'SCHOOL_METRICS_UPDATE',
      payload
    )

    if (this.config.debug) {
      console.log(`[SyncSDK] Pushing to IQEdge.ai:`, event)
    }

    try {
      const response = await fetch(`${this.config.iqEdgeEndpoint}/v1/education/ingest`, {
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
        throw new Error(`IQEdge.ai sync failed: ${response.statusText}`)
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

  // ── Push analytics FROM IQEdge TO KnowledgeHub (IQEdge → KnowledgeHub) ──
  async pushEducationToKnowledgeHub(
    payload: KnowledgeHubEducationPayload
  ): Promise<SyncResult> {
    const event = this.buildSyncEvent('FULL_SYNC', payload)

    try {
      const response = await fetch(`${this.config.knowledgeHubEndpoint}/v1/masterdata/education/ingest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'X-Platform': this.config.platform,
        },
        body: JSON.stringify(event),
      })

      if (!response.ok) throw new Error(`KnowledgeHub education sync failed: ${response.statusText}`)

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

export const createCuriousHatSync = (userId: string, apiKey: string) =>
  new SyncSDK({ platform: 'curioushat', userId, apiKey })

export const createIQEdgeSync = (userId: string, apiKey: string) =>
  new SyncSDK({ platform: 'iqedge', userId, apiKey })

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
  INGEST:    '/v1/masterdata/ingest',           // POST - receive aggregate data
  QUERY:     '/v1/masterdata/query',            // GET  - query master analytics
  REPORTS:   '/v1/masterdata/reports',          // GET  - pre-built analytics reports
  EXPORT:    '/v1/masterdata/export',           // GET  - export data
  EDU_INGEST:'/v1/masterdata/education/ingest', // POST - education market data
  EDU_QUERY: '/v1/masterdata/education/query',  // GET  - education analytics
}

export const IQEDGE_API_ROUTES = {
  INGEST:          '/v1/education/ingest',        // POST - receive student/school data from CuriousHat
  STUDENT_PROFILE: '/v1/education/student/:id',   // GET  - student analytics profile
  SCHOOL_METRICS:  '/v1/education/school/:id',    // GET  - school performance metrics
  DISTRICT:        '/v1/education/district/:code', // GET  - district-level aggregates
  STATE:           '/v1/education/state/:code',    // GET  - state-level aggregates
  PREDICT:         '/v1/education/predict',        // POST - AI predictions (career, college)
  COMPARE:         '/v1/education/compare',        // POST - govt vs private comparison
  LEADERBOARD:     '/v1/education/leaderboard',    // GET  - school/district rankings
}

export const CURIOUSHAT_API_ROUTES = {
  // Auth
  LOGIN:           '/api/auth/login',
  SIGNUP:          '/api/auth/signup',
  LOGOUT:          '/api/auth/logout',

  // Students
  STUDENT_PROFILE: '/api/students/:id/profile',
  STUDENT_SCORES:  '/api/students/:id/scores',
  STUDENT_ATTENDANCE: '/api/students/:id/attendance',

  // Scores (teacher entry)
  SCORES_ENTRY:    '/api/scores/entry',          // POST - bulk score entry
  SCORES_BY_CLASS: '/api/scores/class/:classId',

  // Library
  BOOKS:           '/api/books',                 // GET list, POST upload
  BOOK_DETAIL:     '/api/books/:id',
  BOOK_PROGRESS:   '/api/books/:id/progress',

  // Marketplace
  COLLEGE_LEADS:   '/api/marketplace/college-leads',
  COACHING_LEADS:  '/api/marketplace/coaching-leads',
  SCHOLARSHIP_MATCH: '/api/marketplace/scholarships',

  // Sync
  SYNC_TO_IQEDGE:  '/api/sync/iqedge',          // POST - push to IQEdge.ai
  SYNC_TO_KNOWLEDGEHUB: '/api/sync/knowledgehub', // POST - push to KnowledgeHub.ai
  SYNC_STATUS:     '/api/sync/status',
}

export default SyncSDK
