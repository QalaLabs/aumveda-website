#!/usr/bin/env bash
# ==============================================================================
# Aumveda - Hostinger One-Click Deployment Script
# ==============================================================================
set -e

echo "🚀 Starting Aumveda Deployment on Hostinger..."

# 1. Check Node.js and PNPM
echo "📦 Checking environment..."
node -v
if ! command -v pnpm &> /dev/null; then
    echo "pnpm not found. Installing pnpm globally..."
    npm install -g pnpm
fi
pnpm -v

# 2. Install dependencies
echo "📥 Installing dependencies with pnpm..."
pnpm install --frozen-lockfile

# 3. Prisma Generate
echo "🔧 Generating Prisma Client with Hostinger pg-adapter..."
pnpm db:generate

# 4. Optional: Run Database Migrations (Direct URL)
if [ -n "$DIRECT_URL" ]; then
    echo "🗄️ Applying pending database migrations..."
    pnpm db:migrate || npx prisma migrate deploy --schema=packages/db/prisma/schema.prisma
fi

# 5. Build Next.js Application
echo "🏗️ Building Next.js application..."
pnpm build

# 6. Restart Process (PM2 or Node.js)
if command -v pm2 &> /dev/null; then
    echo "🔄 Restarting application with PM2..."
    pm2 restart ecosystem.config.js || pm2 start ecosystem.config.js
    pm2 save
else
    echo "ℹ️ PM2 not detected. If using Hostinger Node.js Application Manager, restart application from hPanel."
fi

echo "✨ Aumveda deployment completed successfully!"
