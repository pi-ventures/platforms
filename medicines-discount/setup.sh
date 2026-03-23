#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# medicines.discount — Full Setup Script
# Run once after cloning. Then: pm2 start ecosystem.config.js
# ═══════════════════════════════════════════════════════════════

set -e
echo "🚀 Setting up medicines.discount..."

# ── Check dependencies ────────────────────────────────────────
command -v node   >/dev/null || { echo "❌ Node.js required"; exit 1; }
command -v python3>/dev/null || { echo "❌ Python 3 required"; exit 1; }
command -v psql   >/dev/null || { echo "❌ PostgreSQL required"; exit 1; }
command -v pm2    >/dev/null || { echo "⚠ pm2 not found, installing..."; npm i -g pm2; }

# ── DB setup ──────────────────────────────────────────────────
echo ""
echo "📦 Setting up database..."
DB_NAME="medicines_discount"

psql -U postgres -tc "SELECT 1 FROM pg_database WHERE datname = '$DB_NAME'" | grep -q 1 || \
  psql -U postgres -c "CREATE DATABASE $DB_NAME;"

psql -U postgres -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS pg_trgm;" 2>/dev/null || true
psql -U postgres -d $DB_NAME -c "CREATE EXTENSION IF NOT EXISTS unaccent;" 2>/dev/null || true

psql -U postgres -d $DB_NAME -f migrations/001_core_schema.sql
echo "✓ DB schema created"

# ── Python API setup ──────────────────────────────────────────
echo ""
echo "🐍 Setting up Python API..."
cd apps/api
python3 -m venv venv
source venv/bin/activate
pip install -q \
  fastapi uvicorn[standard] \
  sqlalchemy[asyncio] asyncpg \
  alembic \
  redis celery \
  aiohttp beautifulsoup4 \
  pydantic \
  python-dotenv
echo "✓ Python deps installed"
deactivate
cd ../..

# ── Next.js UI setup ──────────────────────────────────────────
echo ""
echo "⚛ Setting up Next.js UI..."
cd apps/ui
if [ ! -f package.json ]; then
  npx create-next-app@latest . --typescript --tailwind --app --src-dir --no-git --yes
fi
npm install
echo "✓ Next.js deps installed"
cd ../..

# ── Scraper setup ─────────────────────────────────────────────
echo ""
echo "🕷 Setting up scrapers..."
cd scrapers
npm init -y > /dev/null
npm install --save \
  playwright \
  axios \
  xml2js \
  pg \
  p-queue \
  cheerio

npx playwright install chromium
echo "✓ Scraper deps installed"
cd ..

# ── Create .env files ─────────────────────────────────────────
echo ""
echo "📝 Creating .env files..."

cat > apps/api/.env << 'EOF'
DATABASE_URL=postgresql+asyncpg://postgres:postgres@localhost:5432/medicines_discount
REDIS_URL=redis://localhost:6379/3
EOF

cat > apps/ui/.env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:8007
NEXT_PUBLIC_SITE_URL=http://localhost:3007
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medicines_discount
EOF

cat > scrapers/.env << 'EOF'
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/medicines_discount
EOF

echo "✓ .env files created"

# ── Summary ───────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo ""
echo "  1. Start all services:"
echo "     pm2 start ecosystem.config.js"
echo ""
echo "  2. Run 1mg catalog scraper (takes 2-4 hours for full catalog):"
echo "     node scrapers/src/scraper-1mg-catalog.js"
echo ""
echo "  3. Load NPPA price ceilings:"
echo "     cd apps/api && source venv/bin/activate"
echo "     python ../../scrapers/nppa_loader.py"
echo ""
echo "  4. Load Jan Aushadhi prices:"
echo "     python ../../scrapers/ja_loader.py"
echo ""
echo "  5. Build generic equivalents map:"
echo "     python ../../scrapers/match_generics.py"
echo ""
echo "  UI:  http://localhost:3007"
echo "  API: http://localhost:8007"
echo "  API docs: http://localhost:8007/docs"
echo "═══════════════════════════════════════════════════════════"
