# CLAUDE.md — Platforms Monorepo

**Owner:** pi-ventures (progressiveinitiatives.ventures@gmail.com)
**GitHub:** https://github.com/pi-ventures/platforms
**Stack:** Next.js 14 · TypeScript · TailwindCSS · Python FastAPI · PostgreSQL · Redis

---

## What This Is

A monorepo of 5 interconnected platforms built for the Indian market. Four consumer platforms sync their data into a central wealth hub (MyVault), which aggregates and pushes analytics to KnowledgeHub.ai.

```
YesBroker ──┐
TheEquinox ─┼──► MyVault ──► KnowledgeHub.ai
MyWills ────┘
```

---

## Platform Map

| Dir | Platform | Port | Theme | Purpose |
|-----|----------|------|-------|---------|
| `yesbroker/` | YesBroker | 3001 | Mustard Yellow `#F5A623` on Dark Navy `#1A1A2E` | Real estate CRM for brokers — 40+ ad platform integrations, lead kanban, map view |
| `theequinox/` | TheEquinox.ai | 3002 | Royal Purple `#1A0533` + Gold `#C9A84C` | Auto-trading platform — SIP, stop-loss, profit-booking rules, NSE/BSE focus |
| `mywills/` | MyWills | 3003 | Legal Navy `#1A2744` + Gold `#C9A84C` + Cream `#F8F6F0` | Will & estate management — Indian Succession Act compliant, legalopinion.co.in partner |
| `myvault/` | MyVault | 3004 | Jet Black `#0A0A0A` + Gold `#C9A84C` | Central wealth hub — aggregates net worth from all 3 platforms |
| `medicines-discount/` | MedicinesDiscount | 3008 | — | Medicine price comparison — Next.js UI + FastAPI backend + scrapers |

**Empty (reserved):** `iqedge/`, `justbuild/`, `knowledgehub/`

---

## Shared Sync SDK

`shared/sync-sdk/` — TypeScript library (`@myvault/sync-sdk`)

```typescript
import { SyncSDK, createYesBrokerSync } from '@myvault/sync-sdk'

const sdk = createYesBrokerSync(userId, apiKey)
await sdk.pushToMyVault(payload)       // push platform data to MyVault
await sdk.pullFromMyVault('properties') // pull data from MyVault
sdk.startAutoSync(async () => { ... }) // background sync every 5 min
```

**Payload types:** `YesBrokerSyncPayload`, `TheEquinoxSyncPayload`, `MyWillsSyncPayload`, `KnowledgeHubPayload`
**Source:** `shared/sync-sdk/src/index.ts`

---

## Tech Stack Per Project

### Next.js platforms (yesbroker, theequinox, mywills, myvault)
- Next.js 14.2, React 18.3, TypeScript 5.4
- TailwindCSS, Lucide icons, Recharts
- Source in `src/app/` (App Router), components in `src/components/`, types/mock data in `src/lib/`
- **Status: all frontends currently use mock data** (`src/lib/mockData.ts`) — no real backend connected yet

### medicines-discount
- **UI:** Next.js 14 at `apps/ui/` — port 3008, `NEXT_PUBLIC_API_URL=http://localhost:8007`
- **API:** Python FastAPI at `apps/api/` — port 8007, uvicorn, SQLAlchemy async + asyncpg
- **Worker:** Celery + Redis (port 6379, DB 3) — queues: `prices`, `catalog`, `geo`
- **DB:** PostgreSQL — `medicines_discount` database
- **Scrapers:** Node.js Playwright scrapers at `scrapers/src/` — targets 1mg, PharmEasy, Apollo, Netmeds, MedPlus
- **Run all:** `pm2 start ecosystem.config.js` (from `medicines-discount/`)
- **Status: has real backend — most production-ready of all projects**

---

## Running Locally

```bash
# Individual platforms
cd yesbroker && npm install && npm run dev      # localhost:3001
cd theequinox && npm install && npm run dev     # localhost:3002
cd mywills && npm install && npm run dev        # localhost:3003
cd myvault && npm install && npm run dev        # localhost:3004

# medicines-discount (full stack)
cd medicines-discount
pm2 start ecosystem.config.js
# UI: localhost:3008 | API: localhost:8007

# medicines-discount API only
cd medicines-discount/apps/api
uvicorn main:app --port 8007 --reload

# medicines-discount worker only
cd medicines-discount/apps/api
celery -A app.tasks worker --loglevel=info --queues=prices,catalog,geo
```

---

## Environment Variables

Each Next.js platform needs `.env.local`:
```bash
NEXT_PUBLIC_MYVAULT_API=https://api.myvault.in
MYVAULT_API_KEY=your_key

# MyVault only
NEXT_PUBLIC_KNOWLEDGEHUB_API=https://api.knowledgehub.ai
KNOWLEDGEHUB_API_KEY=your_key

# YesBroker only
NEXT_PUBLIC_MAPS_KEY=your_google_maps_key

# MyWills only
LEGALOPINION_API_KEY=your_key
```

medicines-discount API uses `.env` at `medicines-discount/apps/api/.env`:
```bash
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/medicines_discount
REDIS_URL=redis://localhost:6379/3
```

---

## What's Real vs Mock

| Platform | Data Layer | What's needed |
|----------|-----------|---------------|
| medicines-discount | **Real** FastAPI + PostgreSQL + scrapers | Most complete — focus here first |
| yesbroker | Mock (`mockData.ts`) | Needs real backend API |
| theequinox | Mock (`mockData.ts`) | Needs broker/trading API integration |
| mywills | Mock (`mockData.ts`) | Needs real auth + DB |
| myvault | Mock (`mockData.ts`) | Needs sync engine backend — depends on others |
| shared/sync-sdk | Typed but no live endpoints | Needs api.myvault.in backend |

---

## Domain / API Targets (Production)

- `api.myvault.in` — MyVault sync API
- `api.knowledgehub.ai` — Master analytics API
- `legalopinion.co.in` — MyWills legal review partner

---

## Key Business Rules

**YesBroker**
- Lead pipeline: New → Contacted → Site Visit → Negotiation → Closed
- Properties must have RERA registration for will validity in MyWills
- 40+ Indian ad platforms integrated (99acres, MagicBricks, Housing.com, Facebook, Google Ads, etc.)

**TheEquinox**
- Auto-trading rule types: `SIP | STOP_LOSS | PROFIT_BOOKING | REBALANCE | SECTOR_CAP`
- Indian markets only: NSE/BSE

**MyWills**
- Indian Succession Act: Class I heirs (spouse, sons, daughters, mother) take priority
- Class II heirs inherit only if no Class I heirs exist
- Legal review handled by legalopinion.co.in

**MyVault Net Worth**
```
Total = Real Estate (YesBroker) + Portfolio (TheEquinox) + Estate (MyWills) + Cash (manual)
```

---

## Suggested Work Order

1. **medicines-discount** — wire scrapers → DB → UI, fix any API gaps
2. **yesbroker** — replace mockData with real property/lead APIs
3. **myvault backend** — build api.myvault.in sync engine
4. **connect platforms** — wire sync SDK to live MyVault API
5. **theequinox / mywills** — replace mockData once vault is live

---

## Git Workflow

```bash
git add <specific files>
git commit -m "platform: brief description"
git push origin master
```

Commit per feature/fix. Never commit `.env` files.
