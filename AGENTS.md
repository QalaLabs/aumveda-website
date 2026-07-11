# AGENTS.md — Aumveda Project Memory

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
