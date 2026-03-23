# medicines.discount

Medicine price comparison — India's only aggregator covering all 14 portals + Jan Aushadhi.

## Stack
- **UI:** Next.js 14 — port 3008 — pm2: `meddisc-ui`
- **API:** FastAPI — port 8007 — pm2: `meddisc-api`
- **Worker:** Celery Beat — pm2: `meddisc-worker`
- **DB:** PostgreSQL `medicines_discount`
- **Cache:** Redis db/3

## Quick Start
```bash
bash setup.sh
pm2 start ecosystem.config.js
```

## Scraper Run Order (first time)
```bash
node scrapers/src/scraper-1mg-catalog.js   # master catalog (2-4 hrs)
node scrapers/src/run-all.js catalog        # remaining 13 portals

cd apps/api && source venv/bin/activate
python ../../scrapers/nppa_loader.py        # NPPA price ceilings
python ../../scrapers/ja_loader.py          # Jan Aushadhi prices
python ../../scrapers/match_generics.py     # Generic equivalents
```

## Intelligence Flow — 3-Tier Architecture

```
medicines.discount          IQEdge.ai               KnowledgeHub.ai
  (operational)    ──────►  (intelligence)  ──────►  (master core)
                              port 8006               port 8000

Raw signals pushed           Enriches + processes     Golden records
to IQEdge daily:             then pushes to KH:       cascade to:
  manufacturers         →      MCA match + CIN    →     pharma graph
  market signals        →      market analytics   →     manufacturer profiles
  geo drug signals      →      disease burden     →     geo intelligence
  price anomalies       →      NPPA violations    →     regulatory flags
                                                        ↓
                                                   TheCredit.exchange
                                                   IQEdge CRM (Cat04)
                                                   Nexus deal flow
                                                   TheEquinox sector data
```

## Celery Beat Schedule
| Time | Task | Destination |
|---|---|---|
| Sunday 2am | Full catalog scrape | Internal DB |
| Daily 3am | Price refresh all portals | Internal DB |
| Every 6h | Stock check | Internal DB |
| Monday 4am | Rebuild generic equivalents | Internal DB |
| Daily 5am | Manufacturers sync | → IQEdge → KH |
| Daily 5:30am | Market signals | → IQEdge → KH |
| Daily 6am | Geo disease signals | → IQEdge → KH → TheCredit/Nexus |
| Daily 6:30am | Price anomalies | → IQEdge → KH |

## Environment Variables
```
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/medicines_discount
REDIS_URL=redis://localhost:6379/3
IQEDGE_API_URL=http://localhost:8006        # IQEdge intelligence layer
```

medicines.discount NEVER calls KnowledgeHub directly.
All intelligence flows through IQEdge.
