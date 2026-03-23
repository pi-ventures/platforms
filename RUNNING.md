# Running & Maintaining the Platforms

All apps are managed via **PM2** from the root `e:/Platforms` directory.
Config file: [`ecosystem.config.js`](ecosystem.config.js)

---

## Prerequisites

| Requirement | Used by |
|-------------|---------|
| Node.js 24+ | All Next.js apps |
| Python + uvicorn | meddisc-api |
| PostgreSQL (`medicines_discount` DB) | meddisc-api, meddisc-worker |
| Redis (port 6379) | meddisc-worker |

---

## Start

```bash
# All 7 processes
npx pm2 start ecosystem.config.js

# One app
npx pm2 start ecosystem.config.js --only yesbroker

# Multiple apps
npx pm2 start ecosystem.config.js --only yesbroker,theequinox,mywills,myvault
```

---

## App URLs

| App | URL | Notes |
|-----|-----|-------|
| **yesbroker** | http://localhost:3001 | Real estate CRM |
| **theequinox** | http://localhost:3002 | Auto trading |
| **mywills** | http://localhost:3003 | Estate management |
| **myvault** | http://localhost:3004 | Central wealth hub |
| **meddisc-ui** | http://localhost:3008 | Medicine price UI |
| **meddisc-api** | http://localhost:8007 | FastAPI backend |
| **meddisc-worker** | — | Celery background worker |

> The 4 Next.js platforms (ports 3001–3004) run standalone with mock data.
> `meddisc-api` and `meddisc-worker` require PostgreSQL and Redis to be running first.

---

## Monitor

```bash
npx pm2 status          # overview of all processes (status, CPU, memory, restarts)
npx pm2 monit           # live dashboard
```

---

## Logs

```bash
npx pm2 logs            # stream all logs
npx pm2 logs yesbroker  # one app
npx pm2 logs meddisc-api --lines 100   # last 100 lines
npx pm2 flush           # clear all log files
```

---

## Stop / Restart

```bash
npx pm2 stop all
npx pm2 stop yesbroker

npx pm2 restart all
npx pm2 restart meddisc-api

npx pm2 reload all      # zero-downtime reload (for production)
```

---

## Delete a Process

```bash
npx pm2 delete yesbroker       # remove from PM2 list
npx pm2 delete all             # remove everything
```

---

## Auto-Start on Windows Boot (run once)

```bash
npx pm2 save            # saves current process list
npx pm2 startup         # registers PM2 as a Windows startup service
```

After this, all saved processes restart automatically when Windows boots.

To update the saved list after adding/removing apps:
```bash
npx pm2 save
```

---

## First-Time Setup (each app)

Before starting via PM2, install dependencies:

```bash
cd yesbroker && npm install
cd theequinox && npm install
cd mywills && npm install
cd myvault && npm install
cd medicines-discount/apps/ui && npm install
```

Python deps for medicines-discount:
```bash
cd medicines-discount/apps/api
pip install -r requirements.txt
```

---

## Troubleshooting

**App shows `errored` in pm2 status**
```bash
npx pm2 logs <app-name>    # read the error
npx pm2 restart <app-name>
```

**Port already in use**
```bash
# Find what's using the port (e.g. 3001)
netstat -ano | findstr :3001
# Kill it by PID
taskkill /PID <pid> /F
```

**meddisc-api fails to start**
- Check PostgreSQL is running: `pg_isready` or open pgAdmin
- Check Redis is running: `redis-cli ping` should return `PONG`
- Check `.env` at `medicines-discount/apps/api/.env`

**After pulling new code**
```bash
cd <platform> && npm install   # install any new deps
npx pm2 restart <app-name>
```
