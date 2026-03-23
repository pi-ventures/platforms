# 🏗️ Platform Ecosystem — Complete Architecture

**4 Platforms · 1 Unified Vault · Powered by KnowledgeHub.ai**

---

## 📦 Platform Overview

| Platform | Port | Theme | Purpose |
|----------|------|-------|---------|
| **YesBroker** | 3001 | Mustard Yellow | India's #1 Real Estate Broker Platform |
| **TheEquinox.ai** | 3002 | Royal Luxe (Purple/Gold) | AI Auto-Trading & Investment Platform |
| **MyWills** | 3003 | Legal (Navy/Gold) | Will, Estate & Family Legal Management |
| **MyVault** | 3004 | Golden Black Luxury | Central Wealth Sync Hub |

---

## 🔄 Sync Architecture

```
┌──────────────────────────────────────────────────────────────────────────┐
│                           PLATFORM ECOSYSTEM                             │
│                                                                          │
│  ┌─────────────────┐     sync      ┌──────────────────────────────────┐ │
│  │  YesBroker      │─────────────▶│                                   │ │
│  │  (Real Estate)  │              │           MyVault                 │ │
│  │  Port: 3001     │◀─────────────│       (Central Hub)               │ │
│  └─────────────────┘   pull data  │         Port: 3004                │ │
│                                   │    Golden Black Theme             │ │
│  ┌─────────────────┐     sync     │                                   │ │
│  │ TheEquinox.ai   │─────────────▶│  Stores:                          │ │
│  │  (Trading)      │              │  • Properties from YesBroker      │ │
│  │  Port: 3002     │◀─────────────│  • Portfolio from TheEquinox.ai   │ │
│  └─────────────────┘   pull data  │  • Will/Estate from MyWills       │ │
│                                   │                                   │ │
│  ┌─────────────────┐     sync     │  Analytics → KnowledgeHub.ai ────▶│ │
│  │   MyWills       │─────────────▶│                                   │ │
│  │  (Legal/Wills)  │              └──────────────────────────────────┘ │
│  │  Port: 3003     │                              │                     │
│  │  Managed by:    │                              │ master analytics    │
│  │ legalopinion    │                              ▼                     │
│  │   .co.in        │              ┌──────────────────────────────────┐ │
│  └─────────────────┘              │         KnowledgeHub.ai          │ │
│                                   │     (Master Data Analytics)      │ │
│                                   │   api.knowledgehub.ai            │ │
│                                   └──────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start — Run All 4 Platforms

```bash
# Terminal 1 — YesBroker (Real Estate)
cd yesbroker && npm install && npm run dev
# → http://localhost:3001

# Terminal 2 — TheEquinox.ai (Trading)
cd theequinox && npm install && npm run dev
# → http://localhost:3002

# Terminal 3 — MyWills (Legal)
cd mywills && npm install && npm run dev
# → http://localhost:3003

# Terminal 4 — MyVault (Central Hub)
cd myvault && npm install && npm run dev
# → http://localhost:3004
```

---

## 🏠 YesBroker — India's #1 Real Estate Platform

**Theme:** Mustard Yellow (#F5A623) on Dark Navy (#1A1A2E)

### Key Features
- **Property Management** — List, manage, track properties with rich media & RERA compliance
- **Lead Kanban CRM** — Pipeline stages: New → Contacted → Site Visit → Negotiation → Closed
- **Unified Inbox** — All leads from 40+ platforms delivered to one inbox
- **3D Floor Planner** — Create floor plans and virtual tours
- **Map View** — Interactive property map with price heatmaps
- **Advertising Hub** — Connect and manage 40+ Indian ad platforms

### 40+ Ad Platform Integrations
```
PORTALS:    99acres, MagicBricks, Housing.com, NoBroker, PropTiger, SquareYards,
            CommonFloor, Makaan, HomeOnline, Anarock, RoofandFloor, TimesProperty...
SOCIAL:     Facebook Ads, Instagram Ads, WhatsApp Business, LinkedIn, YouTube, Snapchat...
SEARCH:     Google Ads, Bing Ads
CLASSIFIEDS: OLX, Quikr, Sulekha, JustDial, IndiaMart, TradeIndia...
AGGREGATORS: Nestaway, HomeShikari, PropertyWala, SmartOwner, BricksDaddy...
```

### MyVault Sync (YesBroker → MyVault)
```typescript
// Triggered on: new property, lead status change, deal closure
const payload: YesBrokerSyncPayload = {
  source: 'yesbroker',
  userId: broker.id,
  properties: broker.properties.map(p => ({ id, title, type, price, area, city, status })),
  stats: { totalProperties, activeListings, totalLeads, revenueThisMonth, ... }
}
await sdk.pushToMyVault(payload)
```

---

## 📈 TheEquinox.ai — Royal Luxe Auto Trading Platform

**Theme:** Royal Purple (#1A0533) + Rich Gold (#C9A84C)

### Key Features
- **Auto-Trading Rules** — Set SIP, Stop-Loss, Profit-Booking, Rebalance rules
- **Portfolio Dashboard** — Real-time P&L, sector allocation, performance charts
- **Watchlist** — Track stocks with price alerts
- **Analytics** — Advanced performance charts and risk metrics
- **Indian Market Focus** — NSE/BSE integration, Indian stocks, mutual funds

### Auto-Trading Rule Types
```typescript
type RuleType =
  | 'SIP'             // Systematic Investment Plan — auto buy on schedule
  | 'STOP_LOSS'       // Auto sell when stock drops X%
  | 'PROFIT_BOOKING'  // Auto sell when profit reaches X%
  | 'REBALANCE'       // Auto rebalance portfolio to target allocation
  | 'SECTOR_CAP'      // Limit exposure to any single sector
```

### MyVault Sync (TheEquinox → MyVault)
```typescript
const payload: TheEquinoxSyncPayload = {
  source: 'theequinox',
  portfolio: { totalValue, totalInvested, totalPnL, pnlPercent, dayPnL },
  holdings: holdingsSummary,
  autoRulesActive: activeRulesCount,
}
await sdk.pushToMyVault(payload)
```

---

## ⚖️ MyWills — Legal Will & Estate Management

**Theme:** Legal Navy (#1A2744) + Gold (#C9A84C) + Cream (#F8F6F0)

**Managed By:** [legalopinion.co.in](https://legalopinion.co.in) — Legal Review Partner

### Key Features
- **Will Builder** — Create court-admissible wills compliant with Indian Succession Act
- **Asset Registry** — Track properties, investments, jewelry, vehicles, and more
- **Family Tree** — Define legal heirs (Class I and Class II per Indian law)
- **Legal Opinion** — Get will reviewed by lawyers on legalopinion.co.in
- **Document Vault** — Store all legal documents securely
- **Beneficiary Management** — Assign specific % of each asset to each heir

### Indian Succession Act Compliance
```
CLASS I HEIRS: Spouse, Sons, Daughters, Mother (equal share by default)
CLASS II HEIRS: Father, siblings, nephew/niece (inherit only if no Class I heirs)
WILL OVERRIDE: A valid will overrides intestate succession rules
RERA COMPLIANCE: Properties must have RERA registration for will validity
```

### MyVault Sync (MyWills → MyVault)
```typescript
const payload: MyWillsSyncPayload = {
  source: 'mywills',
  managedBy: 'legalopinion.co.in',
  estate: { totalAssets, totalValue, willStatus, beneficiaries, legalReviewStatus },
  assets: assetsSummary,
}
await sdk.pushToMyVault(payload)
```

---

## 🏦 MyVault — Golden Black Luxury Wealth Hub

**Theme:** Jet Black (#0A0A0A) + Rich Gold (#C9A84C) + Charcoal (#1A1A1A)

### Key Features
- **Unified Net Worth** — Aggregates wealth from YesBroker + TheEquinox + MyWills
- **Sync Engine** — Manages data flow from all 3 platforms
- **Wealth Analytics** — Complete wealth dashboard with growth trends
- **KnowledgeHub.ai Integration** — Pushes master analytics for institutional insights
- **Smart Alerts** — Notify when net worth milestones are reached
- **Data Privacy** — User controls what each platform can see/share

### Net Worth Calculation
```
Total Net Worth =
  Real Estate Value (from YesBroker)
+ Investment Portfolio (from TheEquinox.ai)
+ Estate Assets (from MyWills)
+ Cash & Liquid Assets (manual entry)
+ Other Assets (manual entry)
```

### KnowledgeHub.ai Master Data Flow
```typescript
// MyVault aggregates all platform data and pushes to KnowledgeHub.ai
const knowledgeHubPayload: KnowledgeHubPayload = {
  userId,
  netWorthSnapshot: { total, realEstate, investments, estateAssets, cash, currency: 'INR' },
  platforms: {
    yesbroker:  { activeListings, totalLeads, monthlyRevenue, connectedAdPlatforms },
    theequinox: { portfolioValue, pnlPercent, activeAutoRules },
    mywills:    { estateValue, willCoverage, beneficiaries },
  },
  aggregateMetrics: {
    wealthGrowthMoM,   // % change from last month
    wealthGrowthYoY,   // % change from last year
    diversificationScore, // 0-100 (how well-diversified)
    riskScore,         // 0-100 (portfolio risk level)
    willCoverageScore, // % of assets covered by valid will
  },
}
await sdk.pushToKnowledgeHub(knowledgeHubPayload)
```

---

## 🔗 Shared Sync SDK

Located in `shared/sync-sdk/`

```typescript
import { SyncSDK, createYesBrokerSync } from '@myvault/sync-sdk'

// Initialize per platform
const sdk = createYesBrokerSync(userId, apiKey)

// Push data
await sdk.pushToMyVault(payload)
await sdk.pushToKnowledgeHub(khPayload)

// Pull data
const data = await sdk.pullFromMyVault('properties')

// Auto background sync every 5 minutes
sdk.startAutoSync(async () => {
  await sdk.pushToMyVault(buildPayload())
})
```

---

## 🌐 API Endpoints

### MyVault API (api.myvault.in)
```
POST /v1/sync/ingest        — Receive data from platforms
GET  /v1/sync/pull          — Serve data to platforms
GET  /v1/sync/status        — Platform sync health
POST /v1/sync/webhook       — Push notification endpoint
GET  /v1/sync/history       — Sync history log
```

### KnowledgeHub.ai API (api.knowledgehub.ai)
```
POST /v1/masterdata/ingest  — Receive aggregate analytics
GET  /v1/masterdata/query   — Query master analytics
GET  /v1/masterdata/reports — Pre-built reports
GET  /v1/masterdata/export  — Export data
```

---

## 🔐 Environment Variables

Each platform needs these in `.env.local`:

```bash
# MyVault Integration
NEXT_PUBLIC_MYVAULT_API=https://api.myvault.in
MYVAULT_API_KEY=your_myvault_api_key

# KnowledgeHub.ai Integration (MyVault only)
NEXT_PUBLIC_KNOWLEDGEHUB_API=https://api.knowledgehub.ai
KNOWLEDGEHUB_API_KEY=your_knowledgehub_key

# Platform-specific
NEXT_PUBLIC_MAPS_KEY=your_google_maps_key    # YesBroker only
LEGALOPINION_API_KEY=your_key               # MyWills only
```

---

## 📱 User Journey

```
1. Broker signs up on YesBroker
   → Lists properties, manages leads, runs ad campaigns on 40+ platforms
   → Enables MyVault sync → Properties automatically appear in MyVault

2. Same user signs up on TheEquinox.ai
   → Auto-trading rules set up, portfolio grows
   → Enables MyVault sync → Portfolio appears in MyVault

3. User creates account on MyWills
   → Adds all assets (including properties from YesBroker)
   → Defines family tree and beneficiaries
   → Gets legal opinion from legalopinion.co.in
   → Enables MyVault sync → Will/Estate data in MyVault

4. MyVault now shows complete financial picture
   → Total Net Worth: Real Estate + Investments + Estate Assets
   → Pushes anonymized aggregate analytics to KnowledgeHub.ai
   → User gets full wealth dashboard + insights
```

---

*Built with Next.js 14 · TypeScript · Tailwind CSS · Recharts · Made for India 🇮🇳*
