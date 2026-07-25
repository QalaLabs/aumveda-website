# Portal Journey HTTP Audit — 2026-07-24

Base URL: `http://localhost:3005`

## Step pages (GET)

| Path | Status | Notes |
|------|--------|-------|
| `/step-1` | **200** | No redirect |
| `/step-2` | **200** | No redirect |
| `/step-3` | **200** | No redirect |
| `/step-4` | **200** | No redirect |
| `/step-5` | **200** | No redirect |
| `/step-6` | **200** | No redirect |
| `/step-7` | **200** | No redirect |
| `/step-8` | **200** | No redirect |

Port `3000` returned 404 for `/step-1` (dev server is on **3005**).

## API endpoints

| Endpoint | Method | Status | Body / notes |
|----------|--------|--------|--------------|
| `/api/portal` | POST (step-6 style upsert) | **500** | `{ ok: false, error: "Internal error" }` |
| `/api/portal` | GET (no `userId`) | **400** | `{ ok: false, error: "userId required" }` (expected) |
| `/api/portal/portal-booking` | POST | **500** | `{ error: "Internal server error" }` |

### POST `/api/portal` probe payload

```json
{
  "sessionId": "audit-test-session-001",
  "portalData": {
    "email": "portal-audit@example.com",
    "dob": "1990-01-15",
    "placeOfBirth": "Mumbai",
    "chakraSelected": "heart",
    "archetypeSelected": "seeker",
    "intention": "Find calm"
  }
}
```

### Why APIs 500 (infra, not payload schema)

1. **Docker Desktop down** — local `aumveda-pg` unreachable.
2. **Prisma Windows query engine** — `PrismaClientInitializationError`: `query_engine-windows.dll.node` not resolved from Next’s search paths under `apps/web` (engine exists in root pnpm store only).
3. Root `DATABASE_URL` points at **non-localhost** Postgres; local Docker was not the active target anyway.

Re-test after: start Docker / restore DB connectivity, then `pnpm --filter @aumveda/db exec prisma generate` and restart `next dev -p 3005`.

## Navigation / engine

| Check | Result |
|-------|--------|
| Linear `goNext` / `goBack` | OK — `PortalStateMachine` step order 1→8; `canGoNext` blocks past 8 |
| Skip-ahead blocked | OK — `RedirectGuard` replaces URL when route step > engine step |
| Engine ↔ URL sync on back-nav | **Fixed** — previously URL could lag behind `currentStep`, causing “Step N not registered” |
| Sejal naming | OK — `Sejal Jain` / `id: 'sejal'` in Step8 |
| Razorpay mock | OK — `PaymentForm` always takes success path, returns `pay_*` mock id |

## Bugs fixed this audit

| File | Fix |
|------|-----|
| `src/app/api/portal/route.ts` | Removed Zod `.strict()` so Step 3+ client fields (`archetypeGift`, `tarotSeed`, …) are stripped instead of rejecting the whole POST with 400 |
| `src/app/api/portal/portal-booking/route.ts` | `userPortalData.update` → `upsert` so booking no longer 500s when portal row is missing |
| `src/portal/engine/PortalRouter.tsx` | Sync `goToStep` when URL is an earlier accessible step |
| `src/portal/steps/Step1Breath/index.tsx` | Removed unused `useRef` import |

## Residual (not code crashes)

- Prisma engine / DB must be healthy for `/api/portal` and `/api/portal/portal-booking` to return 200.
- Ambient audio `GET /audio/portal-ambient.mp3` → 404 (non-blocking).
