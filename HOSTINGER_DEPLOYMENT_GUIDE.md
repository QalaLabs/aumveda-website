# 🌸 Aumveda Website — Hostinger Deployment Guide

This guide provides end-to-end instructions for hosting the **Aumveda Monorepo** (Next.js 14 App Router + Prisma PostgreSQL with `@prisma/adapter-pg` + Web Audio & 3D Portal + Transformation Dashboard) on **Hostinger**.

---

## 🏗️ Architecture Overview

- **Framework**: Next.js 14.2 (App Router)
- **Runtime**: Node.js 20.x+
- **Monorepo**: Turborepo + PNPM Workspaces (`@aumveda/web`, `@aumveda/db`, `@aumveda/api`, `@aumveda/admin`, `@aumveda/types`, `@aumveda/utils`)
- **Database**: PostgreSQL (Supabase / Neon.tech)
  - **Runtime Query Adapter**: `@prisma/adapter-pg` (Pure Node.js `pg` driver with SSL — **avoids Hostinger's Linux kernel `timer_create` panic**).
  - **Connection Mode**: Session connection over direct port `5432` (`DIRECT_URL`).
- **Media & Assets**: Cloudflare R2 / AWS S3 compatible object storage (`CLOUDFLARE_R2_*`).
- **AI & Integrations**: Google Gemini AI, Prokerala Astrology API, Google Places Autocomplete, Calendly Embed, Eazebuzz Payment Gateway.

---

## 📋 Prerequisites on Hostinger

1. **Hostinger Plan**: Business Web Hosting, Cloud Startup/Professional, or VPS (Ubuntu 22.04/24.04).
2. **Node.js Version**: `20.x` or `22.x` (LTS).
3. **Database**: Remote PostgreSQL database (e.g. Supabase or Neon).

---

## 🚀 Deployment Option 1: Hostinger Web / Cloud Hosting (hPanel Node.js Application Manager)

### Step 1: Configure Node.js Application in hPanel
1. Open **Hostinger hPanel** -> Navigate to **Websites** -> Select your domain.
2. Go to **Advanced** / **Node.js** (or search "Node.js" in the sidebar).
3. Click **Create Application** or edit your existing Node.js config:
   - **Node.js Version**: `20.x` (or `22.x`)
   - **Application Mode**: `Production`
   - **Application Root**: `/home/uXXXXXXX/domains/yourdomain.com/public_html`
   - **Application Startup File**: `server.js` (Root file that delegates to `apps/web/server.js`)
   - **Custom Environment Variables**: (Add your production secrets — see [Environment Variables Checklist](#-environment-variables-checklist))

### Step 2: Upload Application Files
You can upload via **Git Integration**, **SSH**, or **File Manager**:
- **Via SSH / Git (Recommended)**:
  ```bash
  cd domains/yourdomain.com/public_html
  git clone <YOUR_GIT_REPO_URL> .
  ```
- **Via File Manager / FTP**:
  - Upload the repository files.
  - **Do NOT upload** `node_modules` or `.next` (build them directly on the server).

### Step 3: Run Build via SSH or hPanel Terminal
Open the terminal / SSH into your Hostinger account and run:
```bash
cd domains/yourdomain.com/public_html

# Install pnpm if not already present
npm install -g pnpm

# Install project dependencies
pnpm install --frozen-lockfile

# Generate Prisma client with pg-adapter
pnpm db:generate

# Build Next.js application
pnpm build
```

### Step 4: Start Application
- In Hostinger hPanel -> Node.js section, click **Restart Application**.
- Your website is now live!

---

## 🚀 Deployment Option 2: Hostinger VPS (Ubuntu 22.04 / 24.04 + PM2 + NGINX)

### Step 1: Initial VPS Setup
SSH into your VPS as `root`:
```bash
# Update packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git build-essential

# Install pnpm and PM2 globally
sudo npm install -g pnpm pm2
```

### Step 2: Clone & Configure Project
```bash
# Create directory
sudo mkdir -p /var/www/aumveda
sudo chown -R $USER:$USER /var/www/aumveda
cd /var/www/aumveda

# Clone repo
git clone <YOUR_GIT_REPO_URL> .

# Setup environment
cp .env.example .env
nano .env  # Enter your actual production secrets
```

### Step 3: Build & Start with PM2
```bash
# Install dependencies & build
pnpm install --frozen-lockfile
pnpm db:generate
pnpm build

# Start using PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Step 4: Configure NGINX Reverse Proxy
Create `/etc/nginx/sites-available/aumveda`:
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
Enable the site and install SSL with Let's Encrypt Certbot:
```bash
sudo ln -s /etc/nginx/sites-available/aumveda /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Install SSL certificate
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔑 Environment Variables Checklist

Ensure the following variables are defined in `.env` or hPanel Environment Settings:

| Key | Example / Description |
| :--- | :--- |
| `NODE_ENV` | `production` |
| `PORT` | `3000` |
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?schema=public&pgbouncer=true` |
| `DIRECT_URL` | `postgresql://postgres:[PASS]@db.[REF].supabase.co:5432/postgres?schema=public` |
| `NEXTAUTH_SECRET` | 32-character random string (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | `https://yourdomain.com` |
| `NEXT_PUBLIC_APP_URL` | `https://yourdomain.com` |
| `NEXT_PUBLIC_BASE_URL` | `https://yourdomain.com` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://[REF].supabase.co` |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Anon Key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Service Role Key |
| `CRON_SECRET` | Secret token for automated lifecycle cron triggers |
| `GEMINI_API_KEY` | Google Gemini API Key |
| `PROKERALA_CLIENT_ID` | Prokerala Astrology Client ID |
| `PROKERALA_CLIENT_SECRET` | Prokerala Astrology Client Secret |
| `NEXT_PUBLIC_GOOGLE_PLACES_API_KEY` | Google Maps / Places API Key |
| `NEXT_PUBLIC_CALENDLY_URL` | Calendly Scheduling URL |

---

## ⏰ Cron Jobs (Rituals & Booking Communications)

In Hostinger hPanel -> **Advanced** -> **Cron Jobs**:
- **Interval**: Daily at 03:00 AM (`0 3 * * *`)
- **Command**:
  ```bash
  curl -X GET "https://yourdomain.com/api/cron/booking-comms" -H "Authorization: Bearer YOUR_CRON_SECRET"
  ```

---

## 🔄 Updates & Deployments

Whenever you push updates, simply run on Hostinger:
```bash
cd domains/yourdomain.com/public_html
git pull
./deploy/hostinger-deploy.sh
```
