// medicines.discount — PM2 Ecosystem Config
// Start: pm2 start ecosystem.config.js

module.exports = {
  apps: [
    {
      name: 'meddisc-ui',
      cwd: './apps/ui',
      script: 'E:\\nodejs\\node_modules\\next\\dist\\bin\\next',
      args: 'dev -p 3008',
      env: {
        NODE_ENV: 'development',
        DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/medicines_discount',
        NEXT_PUBLIC_API_URL: 'http://localhost:8007',
        NEXT_PUBLIC_SITE_URL: 'http://localhost:3008',
      },
      watch: false,
    },
    {
      name: 'meddisc-api',
      cwd: './apps/api',
      script: 'E:\\Python\\Scripts\\uvicorn.exe',
      args: 'main:app --host 0.0.0.0 --port 8007 --reload',
      env: {
        DATABASE_URL: 'postgresql+asyncpg://postgres:postgres@localhost:5432/medicines_discount',
        REDIS_URL: 'redis://localhost:6379/3',
        PYTHONPATH: '.',
      },
      watch: false,
      interpreter: 'none',
    },
    {
      name: 'meddisc-worker',
      cwd: './apps/api',
      script: 'E:\\Python\\Scripts\\celery.exe',
      args: '-A app.tasks worker --loglevel=info --queues=prices,catalog,geo',
      env: {
        DATABASE_URL: 'postgresql+asyncpg://postgres:postgres@localhost:5432/medicines_discount',
        REDIS_URL: 'redis://localhost:6379/3',
      },
      watch: false,
      interpreter: 'none',
    },
  ],
};
