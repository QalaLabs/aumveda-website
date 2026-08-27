# ==============================================================================
# Aumveda - Google Cloud Run Deployment Script (PowerShell for Windows)
# ==============================================================================
[CmdletBinding()]
param (
    [string]$ServiceName = "aumveda-web",
    [string]$Region = "asia-south1"
)

$ErrorActionPreference = "Stop"

$ProjectId = (gcloud config get-value project 2>$null)
if (-not $ProjectId) {
    Write-Host "❌ Error: Google Cloud Project ID not set in gcloud config." -ForegroundColor Red
    Write-Host "👉 Run: gcloud config set project YOUR_PROJECT_ID" -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 Starting Google Cloud Run deployment for $ServiceName in $Region (Project: $ProjectId)..." -ForegroundColor Cyan

# 1. Enable required GCP APIs
Write-Host "🔌 Ensuring required GCP APIs are enabled..." -ForegroundColor Yellow
gcloud services enable `
    run.googleapis.com `
    cloudbuild.googleapis.com `
    containerregistry.googleapis.com `
    secretmanager.googleapis.com `
    --quiet

# 2. Deploy directly from source to Cloud Run
Write-Host "🏗️ Building container image and deploying to Cloud Run..." -ForegroundColor Yellow
gcloud run deploy $ServiceName `
    --source . `
    --region $Region `
    --platform managed `
    --allow-unauthenticated `
    --memory 1Gi `
    --cpu 1 `
    --min-instances 0 `
    --max-instances 10 `
    --concurrency 80 `
    --cpu-boost `
    --set-env-vars "NODE_ENV=production,HOSTNAME=0.0.0.0"

# 3. Retrieve service URL
$ServiceUrl = (gcloud run services describe $ServiceName --region $Region --format='value(status.url)')
Write-Host "✨ Deployment successful!" -ForegroundColor Green
Write-Host "🌐 Aumveda Service URL: $ServiceUrl" -ForegroundColor Cyan
