# AGENTS.md — Aumveda Project Memory

## Session Context (Aug 08, 2026 — Dashboard honesty pass / zero fabricated data)

### What We Did
- Removed the last production-facing hardcoded demo data in the dashboard:
  - `/dashboard/activity` — fabricated `stats` (growthScore 84 / consistency 12 / milestones 5 / `events.length + 142`) replaced with real derived values (`ActivityStats` now takes `{total, activeDays, milestones, eventTypes}` computed via `useMemo` from loaded `/api/events`).
  - `/dashboard/orders` — demo `RECOMMENDED_PRODUCT` (Unsplash journal, fake 4.8 rating) replaced with real first `Product` from `/api/products`; `QuickShopCard` rewritten to real shape (`title`, `priceInr`, `imageUrl`, no rating, `Browse Shop` link instead of 404 `/shop/[id]`).
  - `/dashboard/shop` — removed fabricated `4.8` star rating chip.
  - `/dashboard/routine` — m1/m2 no longer pre-marked `completed: true`.
  - `/dashboard/programs` — "assigned practitioners" card softened (no fake per-user mapping claim).
  - `ProfileHeader` — sparkline catch no longer seeds fake `[65,72,68,85,78,92,88]` (uses `[]`); removed fabricated "Last sync: 2 days ago" pill; removed no-op "Connect Google" button; Logout now wired to `signOut({ callbackUrl: '/auth/login' })`; removed unused `ShieldCheck`/`RefreshCw` imports.
  - `/api/profile/progress` — no-snapshot `breakdown` fallback now zeros (`{sleep:0,activity:0,journal:0,wellbeing:0}`), not fake 50s.
- **Consent fixes (DPDP opt-in):** `ConsentManager` no longer defaults toggles ON (`tracking/health_sync/ai_personalization` were `true` with no DB rows — now all `false` until user opts in); `SettingsForm` notification + consent checkboxes were decorative `defaultChecked`/`disabled` — now real `Switch`es bound to `/api/consent` (keys `notifications.email_progress`, `notifications.whatsapp_daily`, `therapeutic_sharing`, `dpdp_2023_digital_consent`), default off, persisted via POST.
- Dashboard home (`/dashboard`), `TodayDoseCard`, `CosmicNoteCard`, `QuietGrounding` verified clean: all DB-derived with null-degrade, no fabricated metrics.
- Known dead code (not production-facing, never imported): `NotificationCenter.tsx` (`MOCK_NOTIFICATIONS`), plus unused `RecentJournals`/`QuickActions`/`ProgressRing` under `dashboard/_components` — candidates for deletion later.

### Verification
- `pnpm --filter @aumveda/web typecheck` PASSES.
- `pnpm --filter @aumveda/web lint` PASSES — only pre-existing warnings (`<img>` tags, `activity` page `useEffect` dep that predates this session).
- `pnpm --filter @aumveda/web build` PASSES — 106 routes, all `/api/*` dynamic (ƒ), static prerender DB-free. `NotificationCenter` still bundled (unused import) — fine.

## Session Context (Aug 08, 2026 — Dashboard APIs production-hardening)

### What We Did
- Implemented 14 missing `/api/*` route handlers that dashboard consumers referenced but were stubs/404: `/api/profile`, `/api/consent`, `/api/events`, `/api/health/metrics`, `/api/ai/tips`, `/api/orders` + `/api/orders/[id]` + `/reorder` + `/invoice`, `/api/user/export`, `/api/user/delete`, `/api/uploads/presign` + `/api/uploads/complete`, `/api/courses/progress`, `/api/courses/[courseId]/modules/[moduleId]/embed-token`, `/api/embed/config`.
- All new routes: derive user from `getApiSession()` (never client `userId`), `export const dynamic = 'force-dynamic'`, Zod-validate input, write `Event` audit rows where meaningful. No mock data in any production path.
- Fixed existing routes: `/api/profile/progress` returns `{success,current,average,history,trend,summary,breakdown}`; `/api/journals/reflect` uses `process.env.AHI_URL` (local rules fallback when unset); `/api/journals/upload` does real R2 PUT (max 25MB, 413/503/502 handling).
- New libs: `apps/web/src/lib/r2.ts` (SigV4 presigned PUT for Cloudflare R2, `REGION='auto'`, `isR2Configured()`), `apps/web/src/lib/course-token.ts` (HMAC-SHA256 sign/verify with `COURSE_JWT_SECRET`, exp check).
- `.env.example` gains: `AHI_URL`, `CRON_SECRET`, `COURSE_JWT_SECRET` (already had R2/health-sync blocks).
- ImageUpload.tsx hardened: throws on failed presign so a broken avatar isn't saved.

### Verification
- `pnpm --filter @aumveda/web typecheck` PASSES.
- `pnpm --filter @aumveda/web lint` PASSES (only pre-existing warnings: `<img>` tags, two useEffect deps).
- `pnpm --filter @aumveda/web build` PASSES — 106 routes, all `/api/*` dynamic (ƒ), static prerender does NOT hit the DB (builds DB-less in Vercel). R2/Cashfree/email remain unverified without live keys.

### Known Gaps (unchanged)
- No live Postgres/Docker daemon → no DB smoke tests, no `prisma migrate`/seed locally.
- `/dashboard/courses` + `/dashboard/learn` pages are still fully hardcoded demo data (COURSE array / Phase 8 placeholder) — not wired to course APIs yet.
- Cashfree env vars still present (migration to Razorpay is docs-only).
- `/api/embed/config` only verifies the token; it returns video metadata, not an actual stream.

### Key Security Properties
- Practitioner routes (`/api/practitioner/*`) are role-gated via `getApiPractitionerSession()` (practitioner/admin/super_admin), which is why the earlier DB-less static-prerender failure is gone.
- `/api/portal` GET is owner-only (401/403); POST stays open (lead capture).
- `/api/user/delete` requires `password: "confirm-delete"` string confirmation; `/api/uploads/presign` rejects non-image/audio (415), 503 if R2 unconfigured.
- Identity always from session (`getApiSession()`); client-supplied `userId` is ignored.

## Portal Engine Architecture (Jun 28, 2026 — New)
- Location: `apps/web/src/portal/` (22 files)
- Engine: `portal/engine/` — PortalProvider, StateMachine, Context, Router, StepRegistry, ValidationEngine, AutosaveManager, SessionPersistence, AnimationManager, ProgressManager, PortalApiClient
- Steps: `portal/steps/Step1Breath/` (7 files) — first step implemented
- Components: `portal/components/` — PortalShell, StepRenderer, ProgressBar
- Hooks: `portal/hooks/` — usePortalAnalytics, usePortalAuth, usePortalNavigation
- Schemas: `portal/schemas/` — Zod schemas for all 8 steps
- Types: `portal/types/` — step.types.ts, integration.types.ts (8 extension interfaces)
- Key properties: Linear state machine (no skip/jump), autosave (localStorage + Supabase), session persistence (survives refresh), per-step Zod validation, framer-motion animation orchestration, Mixpanel-ready analytics, 8 extension point interfaces (Prokerala, Google Places, Cal.com, Razorpay, n8n, AHI, Daily Dose, CRM)
- The old Zustand store (`lib/portal/store.ts`) is superseded by the engine but kept for backward compat until steps port over

### Step 1 — Breath Gateway (Jun 28, 2026)
- `portal/steps/Step1Breath/` — index.tsx, BreathingOrb, BreathingText, AmbientAudio, breath-timeline, animations, constants
- 3-cycle breathing ritual (Inhale 4s → Hold 2s → Exhale 4s) via useBreathTimeline hook
- framer-motion useAnimate for 60 FPS orb animation (GPU-composited, no layout shifts)
- CSS star field (80 stars, random positions, staggered opacity twinkle)
- Ambient audio with lazy-load, requestAnimationFrame fade, mute preference in localStorage
- Accessibility: prefers-reduced-motion, aria-live screen reader, keyboard nav, visible focus, sr-only breathing announcements
- CTA disabled until all 3 cycles complete; uses engine's onNext() — no router.push
- Self-contained: stores no portal data, no engine modifications, no router imports

## Architecture Snapshot (Jun 28, 2026 — Full Audit)

### Monorepo
- **4 apps**: `web` (Next.js 14 / :3000), `api` (Fastify 5 / :3001), `admin` (Next.js 14 / :3002), `ahi` (FastAPI Python / :8000)
- **3 packages**: `db` (Prisma + 42 models), `types` (shared enums/interfaces), `utils` (PII hash, scoring INR format, slug)
- **Tooling**: pnpm 10.28 workspaces, Turborepo 2.3, turbo.json configured for build/dev/lint/typecheck/test

### Auth
- **NextAuth 4** (primary): Google OAuth, Email magic-link, Credentials (legacy — being deprecated)
- **Supabase Auth** (client-side only): NEXT_PUBLIC_* vars for Supabase client; service role key for admin ops
- **Middleware** protects: `/dashboard`, `/onboarding`, `/learn`, `/checkout`, `/practitioner`
- Portal steps (`/step-*`) intentionally unprotected (lead capture)

### Database — PostgreSQL (local Docker: aumveda-pg, :5432)
- **42 Prisma models**, 5 migrations applied, seed data loaded
- Key model groups: NextAuth (3), Core (3 User/Profile/Consent), Content (4 Journal/DailyDose+), Health (2), Commerce (3), Courses (3), Events (1), Portal (10 UserPortalData/Booking/TherapySession/Package/Subscription/CommunityMember/LiveCircle/Challenge/ChallengeParticipation), Media (2 Reel/ContentView), Override/Delivery (2), Reference (7)
- Reference tables seeded: 7 chakras, 6 archetypes, 7 tarot themes, 36 chart predictions, 7 pattern questions, 28 scoring rules, 6 profile maps

### Frontend Route Groups (83+ routes)
| Group | Routes |
|-------|--------|
| Public (11) | /, /about, /contact, /events, /programs, /services, /visionaries, /shop, /insights, /insights/[slug], /tools |
| Tools (5) | /tools/answer-book, /tools/kundli, /tools/mbti, /tools/numerology, /tools/tarot |
| Auth (5) | /auth/login, /auth/register, /auth/magic-link, /auth/verify, /auth/error |
| Dashboard (15) | /dashboard, /dashboard/activity, /dashboard/courses, /dashboard/dose, /dashboard/food-guide, /dashboard/journal, /dashboard/journal/new, /dashboard/journal/[id], /dashboard/learn, /dashboard/orders, /dashboard/profile, /dashboard/progress, /dashboard/routine, /dashboard/settings, /dashboard/shop |
| Portal (8) | /step-1 through /step-8 |
| Onboarding (4) | /onboarding/step-1 through /onboarding/step-4 |
| Practitioner (4) | /practitioner, /practitioner/sessions, /practitioner/notes, /practitioner/overrides |
| API (13) | auth/[...nextauth], astrology/chart, portal, practitioner/clients, practitioner/notes, practitioner/overrides, practitioner/sessions, achievements, bookings, daily-dose, journals, leads, profile, reference, track, users |

### Components
- **49 shadcn/ui primitives** (button, card, dialog, form, table, chart via recharts, etc.)
- **58 custom components** (Hero, DailyDose*, Navigation*, Progress*, Activity*, Journal*, etc.)
- State: Zustand (portal), React hooks (local), next-auth SessionProvider

### AHI Microservice (apps/ahi)
- FastAPI on :8000, Claude API via httpx
- Endpoints: GET /health, POST /ahi/generate-dose, POST /ahi/generate-initial-plan, POST /ahi/pre-session-brief
- Pydantic models for request/response validation

### Fastify API (apps/api)
- :3001, Helmet + CORS + Cookie + Rate-limit (100/min) + JWT auth plugin
- Routes stubbed per-phase (Phase 1-10), none implemented yet

### Admin Panel (apps/admin)
- :3002, placeholder page, NextAuth admin-only middleware

### External Services
- **Auth**: NextAuth 4 + Supabase Auth (dual, migrating to Supabase-only)
- **Storage**: Cloudflare R2 (images/audio)
- **AI**: Claude API (via AHI), Gemini (client-side in lib/gemini.ts)
- **Payments**: Cashfree (env vars exist — migrating to Razorpay)
- **Analytics**: GTM, Meta Pixel, GA4, Pinterest Ads
- **Astrology**: Prokerala (stubbed — returns random signs)
- **Infra**: Upstash Redis, Pinecone (vector DB), OpenAI

### Audit Findings (new)
| Issue | Status | Impact |
|-------|--------|--------|
| Cashfree env vars + code still present | Awaiting Razorpay migration | Payment flows not usable |
| Credentials provider active in NextAuth | To be removed per deprecation plan | Password login still works |
| Astrology chart API returns mock data | Needs Prokerala integration | Production data incorrect |
| Fastify API has only route stubs | No backend API serving yet | All logic in Next.js API routes currently |
| Admin app is placeholder only | Not built out | No admin functionality |
| No docker-compose.yml checked in | Manual Docker only | Hinders reproducible dev env |
| Local PostgreSQL vs cloud Supabase | Pending cloud migration | Session data not synced |
| `server.js` at root delegates to web | Works but unclear purpose | Minor cleanup opportunity |

## Session Context (Jun 25, 2026)

### What We Did
- Analyzed the full product requirements document `AUMVEDA_Full_PRD_v3_June2026.docx`
- Created detailed implementation_plan.md
- Documented technical roadmap (Phase 1–5): FastAPI AHI, n8n routing, Razorpay, Mux Reels
- Outlined DPDP Act 2023 compliance (ap-south-1, consent checklists, anonymization)

### Key Decisions
- **NextAuth Deprecation:** NextAuth → Supabase Auth (magic-link/OTP only, remove credentials)
- **Payment Provider Transition:** Cashfree → Razorpay (crystal checkout, 1:1 sessions, subscriptions)
- **Vastu Design Integration:** Progress badges + Daily Dose CTA in upper-right (Northeast) dashboard quadrant

## Session Context (Jun 24, 2026)

### What We Did
- ✅ Completed Phase 0 portal build: 8 steps (Breath → Chakra → Archetype → Tarot → Intention → Constellation → Pattern Test → Booking)
- ✅ Fixed Prisma schema: added ContentView, Reel models; fixed Challenge relation
- ✅ Fixed build: removed duplicate next-auth types, fixed ProfileResult type
- ✅ Updated homepage CTAs to link to `/step-1`
- ✅ Set up local PostgreSQL via Docker (`aumveda-pg` container, port 5432)
- ✅ `pnpm db:migrate` — all migrations applied (42 tables)
- ✅ `pnpm db:seed` — all reference tables populated
- ✅ Built Phase 1: AHI microservice (`apps/ahi/`), practitioner dashboard (`/practitioner/*`), API routes, Prisma models (DailyDoseOverride, DailyDoseDelivery), auth migration starter
- ✅ Full Next.js build passes (83 routes, clean)

### Blocked → Resolved
- ~~Supabase project credentials stale~~ → Using local PostgreSQL Docker container
- ~~`prisma db:migrate` fails~~ → Migration + seed both successful locally

### How to Use Local DB
```bash
docker start aumveda-pg          # Start PostgreSQL
pnpm db:migrate                  # Apply migrations
pnpm db:seed                     # Seed reference data (already done)
pnpm --filter web dev            # Run dev server
```

### When Ready to Push to Supabase
1. Update `.env` — swap DATABASE_URL/DIRECT_URL to Supabase connection strings
2. `pnpm db:push` to push schema to Supabase
3. `pnpm db:seed` to seed Supabase reference tables

### Key Decisions
- Portal is unauthenticated (lead capture) — middleware does NOT protect `/step-*`
- Dual auth during NextAuth→Supabase migration
- Razorpay replaces Cashfree; Cal.com replaces Calendly
- PostgreSQL runs locally in Docker; Supabase used only for Auth client

### Practitioner Dashboard
- `/practitioner` — Client list with profile results, sessions left, distress flags
- `/practitioner/sessions` — Upcoming/past sessions with Zoom join links
- `/practitioner/notes` — Structured session notes form (key themes, practices, distress flag)
- `/practitioner/overrides` — Daily Dose override controls (per-user, per-practice-type)

### AHI Microservice
- `apps/ahi/` — Python FastAPI on port 8000
- Endpoints: `/ahi/generate-dose`, `/ahi/generate-initial-plan`, `/ahi/pre-session-brief`
- Uses Claude API (claude-sonnet) via httpx
- Run: `cd apps/ahi && pip install -r requirements.txt && python -m uvicorn ahi.main:app --reload`

### Architecture Diagram
See `ARCHITECTURE.md` in the project root for full architecture diagrams (monorepo, frontend, backend, database, data flows, deployment).
