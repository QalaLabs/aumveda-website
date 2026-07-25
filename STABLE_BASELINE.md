# Stable local baseline — Jul 24, 2026

Use this as the starting point for the next phase of work.

## What is stable

| Surface | URL | Status |
|---------|-----|--------|
| Marketing home | http://localhost:3005/ | Live |
| Client login | http://localhost:3005/auth/login | Live |
| Practice home | http://localhost:3005/dashboard | Live (`DEV_BYPASS`) |
| Daily check-in | http://localhost:3005/dashboard/check-in | Live + API |
| Homework | http://localhost:3005/dashboard/homework | Live + API |
| Journey | http://localhost:3005/dashboard/journey | Live |
| Portal start | http://localhost:3005/step-1 | Live (8-step) |

APIs verified: `GET /api/dashboard/check-in`, `GET /api/dashboard/homework`.

## How to boot (every session)

```powershell
# 1) Postgres (Docker Desktop must be running)
docker start aumveda-pg

# 2) Optional: refresh demo client data
pnpm --filter @aumveda/db exec tsx scripts/seed-dev-client.ts

# 3) Next.js app
pnpm --filter web exec next dev -p 3005
```

## Env (apps/web/.env.local)

- `DEV_BYPASS=true` — opens dashboard without real auth (local only)
- `DATABASE_URL` / `DIRECT_URL` → `postgresql://postgres:postgres@localhost:5432/aumveda?sslmode=disable`

## Demo user

- Email: `dev@aumveda.com`
- Seeded: profile, portal answers, cosmic note, sample homework

## Known limits (acceptable for this baseline)

- Real Google / magic-link login still needs valid NextAuth + Supabase secrets
- Fastify API (`apps/api`) and admin app are stubs
- Homework is empty until seed script runs (or practitioner assigns)
- Keep Docker Desktop running or Postgres (and writes) will fail
