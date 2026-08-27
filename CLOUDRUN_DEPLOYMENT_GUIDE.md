# 🚀 Google Cloud Run Deployment Guide — Aumveda

This guide outlines the production deployment of the **Aumveda Web Application** onto **Google Cloud Run**.

---

## 🏗️ Architecture & Settings Overview

- **Runtime**: Node.js 20 (Linux Debian Slim container with OpenSSL & Prisma engines)
- **Container Output**: Next.js 14 `output: "standalone"`
- **Host & Port**: Binds to `0.0.0.0` with dynamic port binding via `$PORT` (defaults to `8080`)
- **Lifecycle**: Graceful shutdown on `SIGTERM` / `SIGINT` (10s drain window)
- **Health Check Endpoint**: `/api/health`
- **Recommended Cloud Run Parameters**:
  - Memory: `1 GiB`
  - CPU: `1 vCPU`
  - Concurrency: `80`
  - Startup CPU Boost: `Enabled` (reduces cold start latency by up to 50%)
  - Min instances: `0` (or `1` for zero cold-start latency)
  - Max instances: `10`

---

## 📋 Prerequisites

1. Install Google Cloud SDK (`gcloud` CLI):
   ```bash
   gcloud --version
   ```
2. Login to Google Cloud:
   ```bash
   gcloud auth login
   ```
3. Set your active Google Cloud project:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

---

## 🚀 Option 1: 1-Click Deployment via Deployment Script

### On Linux / macOS / Cloud Shell:
```bash
chmod +x deploy/cloudrun-deploy.sh
./deploy/cloudrun-deploy.sh
```

### On Windows PowerShell:
```powershell
.\deploy\cloudrun-deploy.ps1
```

---

## ⚡ Option 2: Direct `gcloud` Command

Deploy directly from source code in the `App` directory:

```bash
gcloud run deploy aumveda-web \
  --source . \
  --region asia-south1 \
  --platform managed \
  --allow-unauthenticated \
  --memory 1Gi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 10 \
  --concurrency 80 \
  --cpu-boost \
  --set-env-vars "NODE_ENV=production,HOSTNAME=0.0.0.0"
```

---

## 🔨 Option 3: Google Cloud Build CI/CD

Trigger deployment via Google Cloud Build using `cloudbuild.yaml`:

```bash
gcloud builds submit --config=cloudbuild.yaml
```

---

## 🔑 Environment Variables Configuration

Set environment variables in Cloud Run via CLI or Google Cloud Console:

```bash
gcloud run services update aumveda-web \
  --region asia-south1 \
  --set-env-vars "\
DATABASE_URL=postgresql://...,\
DIRECT_URL=postgresql://...,\
NEXTAUTH_SECRET=your-secret,\
NEXTAUTH_URL=https://your-service-url.a.run.app,\
NEXT_PUBLIC_APP_URL=https://your-service-url.a.run.app,\
NEXT_PUBLIC_SUPABASE_URL=https://...,\
NEXT_PUBLIC_SUPABASE_ANON_KEY=...,\
SUPABASE_SERVICE_ROLE_KEY=...,\
GEMINI_API_KEY=..."
```

*(See `.env.cloudrun.example` for the complete list of variables)*

---

## 🌐 Custom Domain Mapping (e.g. `app.aumveda.com`)

1. Go to **Google Cloud Console** > **Cloud Run** > **Custom Domains**.
2. Click **Add Mapping** and select service `aumveda-web`.
3. Enter your domain (e.g. `app.aumveda.com` or `aumveda.com`).
4. Update your DNS records (CNAME / A / AAAA) with the Google-provided records.
5. Google Cloud automatically provisions and renews SSL certificates (Let's Encrypt / Google Trust Services).
