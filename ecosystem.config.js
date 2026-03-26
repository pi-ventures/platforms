// ─────────────────────────────────────────────────────────────────
//  Platforms — PM2 Ecosystem Config
//  Usage:
//    pm2 start ecosystem.config.js          # start all
//    pm2 start ecosystem.config.js --only yesbroker
//    pm2 stop all | pm2 restart all
//    pm2 logs [app-name]
//    pm2 status
//    pm2 save && pm2 startup               # auto-start on boot
// ─────────────────────────────────────────────────────────────────

const NODE = 'C:\\Program Files\\nodejs\\node.exe'
const NEXT = 'node_modules/next/dist/bin/next'

module.exports = {
  apps: [

    // ── YesBroker — Real Estate CRM ───────────────────── :3001 ──
    {
      name: 'yesbroker',
      cwd: './yesbroker',
      script: NODE,
      args: `${NEXT} dev -p 3001`,
      interpreter: 'none',
      env: { NODE_ENV: 'development' },
      watch: false,
    },

    // ── TheEquinox.ai — Auto Trading ──────────────────── :3002 ──
    {
      name: 'theequinox',
      cwd: './theequinox',
      script: NODE,
      args: `${NEXT} dev -p 3002`,
      interpreter: 'none',
      env: { NODE_ENV: 'development' },
      watch: false,
    },

    // ── MyWills — Estate Management ───────────────────── :3003 ──
    {
      name: 'mywills',
      cwd: './mywills',
      script: NODE,
      args: `${NEXT} dev -p 3003`,
      interpreter: 'none',
      env: { NODE_ENV: 'development' },
      watch: false,
    },

    // ── MyVault — Central Wealth Hub ──────────────────── :3004 ──
    {
      name: 'myvault',
      cwd: './myvault',
      script: NODE,
      args: `${NEXT} dev -p 3004`,
      interpreter: 'none',
      env: { NODE_ENV: 'development' },
      watch: false,
    },

    // ── CuriousHat.ai — EdTech Platform ──────────────── :3005 ──
    {
      name: 'curioushat',
      cwd: './curioushat',
      script: NODE,
      args: 'node_modules/next/dist/bin/next dev -p 3005',
      interpreter: 'none',
      env: { NODE_ENV: 'development' },
      watch: false,
    },

    // ── IQEdge.ai — Intelligence Layer ─────────────────── :3006 ──
    {
      name: 'iqedge',
      cwd: './iqedge',
      script: NODE,
      args: `${NEXT} dev -p 3006`,
      interpreter: 'none',
      env: { NODE_ENV: 'development' },
      watch: false,
    },

    // ── KnowledgeHub.ai — Master Core ──────────────── :3007 ──
    {
      name: 'knowledgehub',
      cwd: './knowledgehub',
      script: NODE,
      args: `${NEXT} dev -p 3007`,
      interpreter: 'none',
      env: { NODE_ENV: 'development' },
      watch: false,
    },

    // ── TheCredit.exchange — Finance ──────────────────── :3009 ──
    {
      name: 'thecredit',
      cwd: './thecredit',
      script: NODE,
      args: `${NEXT} dev -p 3009`,
      interpreter: 'none',
      env: { NODE_ENV: 'development' },
      watch: false,
    },

    // ── JustBuild.com — Infrastructure ──────────────── :3010 ──
    {
      name: 'justbuild',
      cwd: './justbuild',
      script: NODE,
      args: `${NEXT} dev -p 3010`,
      interpreter: 'none',
      env: { NODE_ENV: 'development' },
      watch: false,
    },

    // ── LegalOpinion.co.in — Legal + MyWills ────────── :3011 ──
    {
      name: 'legalopinion',
      cwd: './legalopinion',
      script: NODE,
      args: `${NEXT} dev -p 3011`,
      interpreter: 'none',
      env: { NODE_ENV: 'development' },
      watch: false,
    },

    // ── PI Foundation — CSR & Impact ────────────────── :3012 ──
    {
      name: 'pifoundation',
      cwd: './pifoundation',
      script: NODE,
      args: `${NEXT} dev -p 3012`,
      interpreter: 'none',
      env: { NODE_ENV: 'development' },
      watch: false,
    },

    // ── MedicinesDiscount UI ──────────────────────────── :3008 ──
    {
      name: 'meddisc-ui',
      cwd: './medicines-discount/apps/ui',
      script: NODE,
      args: 'node_modules/next/dist/bin/next dev -p 3008',
      interpreter: 'none',
      env: {
        NODE_ENV: 'development',
        NEXT_PUBLIC_API_URL: 'http://localhost:8007',
        NEXT_PUBLIC_SITE_URL: 'http://localhost:3008',
      },
      watch: false,
    },

    // ── MedicinesDiscount API ─────────────────────────── :8007 ──
    {
      name: 'meddisc-api',
      cwd: './medicines-discount/apps/api',
      script: 'E:\\Python\\Scripts\\uvicorn.exe',
      args: 'main:app --host 0.0.0.0 --port 8007 --reload',
      interpreter: 'none',
      env: {
        DATABASE_URL: 'postgresql+asyncpg://postgres:postgres@localhost:5432/medicines_discount',
        REDIS_URL: 'redis://localhost:6379/3',
        PYTHONPATH: '.',
      },
      watch: false,
    },

    // ── MedicinesDiscount Worker (Celery) ────────────────────────
    {
      name: 'meddisc-worker',
      cwd: './medicines-discount/apps/api',
      script: 'E:\\Python\\Scripts\\celery.exe',
      args: '-A app.tasks worker --loglevel=info --queues=prices,catalog,geo',
      interpreter: 'none',
      env: {
        DATABASE_URL: 'postgresql+asyncpg://postgres:postgres@localhost:5432/medicines_discount',
        REDIS_URL: 'redis://localhost:6379/3',
      },
      watch: false,
    },

  ],
}
