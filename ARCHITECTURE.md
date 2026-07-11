# Aumveda Platform Architecture

## Monorepo Overview (Turborepo + pnpm)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           aumveda-website-main                              │
│                    pnpm workspace | Turborepo | Node 20+                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │                         APPS (4)                               │       │
│  ├────────────────┬────────────────┬──────────────────┬────────────┤       │
│  │                │                │                  │            │       │
│  │   apps/web     │   apps/api    │   apps/admin     │  apps/ahi  │       │
│  │   ─────────    │   ────────    │   ───────────    │  ────────  │       │
│  │   Next.js 14   │   Fastify 5   │   Next.js 14     │  FastAPI   │       │
│  │   Port 3000    │   Port 3001   │   Port 3002      │  Port 8000 │       │
│  │   Main App     │   Backend API │   Admin Panel    │  AI Service│       │
│  │                │                │                  │  (Python)   │       │
│  └───────┬────────┴───────┬────────┴────────┬─────────┴────────────┘       │
│          │                │                  │                              │
│  ┌───────┴────────────────┴──────────────────┴────────────────────┐        │
│  │                    PACKAGES (3)                                │        │
│  ├────────────────────┬──────────────────────┬────────────────────┤        │
│  │  packages/db       │  packages/types      │  packages/utils    │        │
│  │  Prisma ORM        │  Shared TS types     │  Utility helpers   │        │
│  │  42 models         │  Portal, Booking,    │  PII hash, slug,   │        │
│  │  5 migrations      │  Events, Commerce    │  scoring, INR fmt  │        │
│  └────────────────────┴──────────────────────┴────────────────────┘        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Frontend Architecture (apps/web)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         apps/web — Next.js 14 App Router                   │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌──────────┐  ┌───────────────────────────────┐  ┌─────────────────────┐ │
│  │ PROVIDERS│  │      MIDDLEWARE                │  │   AUTH (NextAuth)   │ │
│  │──────────│  │───────────────────────────────│  │─────────────────────│ │
│  │ Session  │  │ Protects: /dashboard,          │  │ Google OAuth        │ │
│  │ Provider │  │ /onboarding, /learn, /checkout,│  │ Email Magic Link    │ │
│  │          │  │ /practitioner                  │  │ Credentials (legacy)│ │
│  └──────────┘  │ Checks next-auth.session-token │  │ JWT Strategy        │ │
│                └───────────────────────────────┘  └─────────────────────┘ │
│                                                                            │
│  ┌─────────────────── ROUTE GROUPS ─────────────────────────────────────┐ │
│  │                                                                      │ │
│  │  (public)     (auth)      (dashboard)   (portal)   (onboarding)     │ │
│  │  ─────────    ──────      ───────────   ────────   ───────────     │ │
│  │  /            /auth/*     /dashboard    /step-1    /onboarding/*    │ │
│  │  /about       login       /activity     /step-2                      │ │
│  │  /contact     register    /courses      /step-3                      │ │
│  │  /events      magic-link  /dose         /step-4     practitioner    │ │
│  │  /programs    verify      /food-guide   /step-5    ─────────────    │ │
│  │  /services    error       /journal/*    /step-6    /practitioner    │ │
│  │  /visionaries             /learn        /step-7    /sessions        │ │
│  │  /shop                    /orders       /step-8    /notes           │ │
│  │  /insights/*              /profile                /overrides        │ │
│  │  /tools/*                 /progress                                        │
│  │                           /routine                                        │
│  │                           /settings                                        │
│  │                           /shop                                            │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌─────────────────── COMPONENT LAYER ──────────────────────────────────┐ │
│  │                                                                      │ │
│  │  49 shadcn/ui primitives   58 Custom components                      │ │
│  │  (button, card, dialog,    (Hero, DailyDose*, Navigation*,          │ │
│  │   form, table, etc.)        Progress*, Journal*, Activity*, etc.)    │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
│  ┌─────────── STATE / LIBS ─────────────────────────────────────────────┐ │
│  │                                                                      │ │
│  │  Zustand (portal store)  │  Prisma Client (server)                   │ │
│  │  Supabase Auth (client)  │  Gemini AI lib (client)                   │ │
│  │  Zod schemas             │  Session utils                            │ │
│  │                                                                      │ │
│  └──────────────────────────────────────────────────────────────────────┘ │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

## Backend Architecture

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         API LAYER                                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  apps/api (Fastify 5)              apps/ahi (FastAPI Python)              │
│  ────────────────────              ─────────────────────────              │
│  Port 3001                          Port 8000                             │
│                                                                            │
│  Plugins:                           Endpoints:                            │
│  ├── Helmet (CSP)                   ├── /health                           │
│  ├── CORS                           ├── /ahi/generate-dose                │
│  ├── Cookie                         ├── /ahi/generate-initial-plan        │
│  ├── Rate Limit (100/min)           └── /ahi/pre-session-brief            │
│  └── Auth (JWT verify)                                                   │
│                                                                           │
│  Routes (stubbed — per-phase impl):                                      │
│  ├── Auth & Consent (Phase 1)                                            │
│  ├── Journals (Phase 3)                                                  │
│  ├── Daily Dose (Phase 4)                                                │
│  ├── Progress/Achievements (Phase 5)                                     │
│  ├── E-Commerce (Phase 6)                                                │
│  ├── GTM relay (Phase 7)                                                 │
│  ├── Courses (Phase 8)                                                   │
│  ├── AI Tips (Phase 9)                                                   │
│  └── Health Sync (Phase 10)                                              │
│                                                                           │
└────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────┐
│                         DATABASE LAYER                                     │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  PostgreSQL (local Docker / Supabase)                                     │
│  Prisma ORM + @prisma/adapter-pg                                          │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐   │
│  │                       42 MODELS                                    │   │
│  ├────────────────────────────────────────────────────────────────────┤   │
│  │                                                                    │   │
│  │  NEXT-AUTH ──── Account, Session, VerificationToken                │   │
│  │                                                                    │   │
│  │  CORE ───────── User, Profile, Consent                             │   │
│  │                                                                    │   │
│  │  CONTENT ────── Journal, DailyDose, DailyDoseCompletion,           │   │
│  │                 DailyDoseOverride, DailyDoseDelivery               │   │
│  │                                                                    │   │
│  │  HEALTH ─────── HealthSync, HealthMetric                           │   │
│  │                                                                    │   │
│  │  COMMERCE ───── Product, Order, OrderItem                          │   │
│  │                                                                    │   │
│  │  COURSES ────── Course, Module, Enrolment, CourseProgress           │   │
│  │                                                                    │   │
│  │  EVENTS ─────── Event (append-only audit log)                      │   │
│  │                                                                    │   │
│  │  PORTAL ─────── UserPortalData, Booking, TherapySession,           │   │
│  │                 Package, Subscription, CommunityMember,            │   │
│  │                 LiveCircle, Challenge, ChallengeParticipation      │   │
│  │                                                                    │   │
│  │  MEDIA ──────── Reel, ContentView                                  │   │
│  │                                                                    │   │
│  │  REFERENCE ──── ChakraReveal, ArchetypeReveal, TarotTheme,        │   │
│  │                 ChartPrediction, PatternQuestion, PatternScoring,  │   │
│  │                 PatternProfile                                     │   │
│  │                                                                    │   │
│  └────────────────────────────────────────────────────────────────────┘   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Diagrams

### Portal Flow (Unauthenticated)
```
Visitor ──→ step-1 ──→ step-2 ──→ step-3 ──→ step-4 ──→ step-5 ──→ step-6 ──→ step-7 ──→ step-8
            Breath    Chakra    Archetype  Tarot      Intention  Constellation Pattern    Booking
              │          │          │         │            │         │           │          │
              │          │          │         │            │         │           │          │
              └──────────┴──────────┴─────────┴────────────┴─────────┴───────────┴──────────┘
                                               │
                                    Zustand PortalStore (client-side)
                                               │
                                    POST /api/portal (persist per step)
                                               │
                                    ┌──────────┴──────────┐
                                    │    PostgreSQL        │
                                    │  UserPortalData      │
                                    │  Event (audit log)   │
                                    └─────────────────────┘
```

### Auth Flow
```
User ──→ /auth/login ──→ NextAuth Provider ──→ PrismaAdapter ──→ User table
          │                  │         │                                    │
          │           Google OAuth  Email Link                          Profile
          │                  │         │                           (auto-created)
          ▼                  ▼         ▼
     JWT Token ──────→ Session stored in cookie
                           │
                    Middleware validates on:
                    /dashboard, /onboarding, /learn,
                    /checkout, /practitioner
```

### Daily Dose Flow
```
                 AHI Microservice (apps/ahi)
                         │
    User Context ──→ /ahi/generate-dose ──→ Claude API ──→ Daily Dose Response
                         │
                    apps/web route handler
                         │
                    ┌────┴────┐
                    │         │
              DailyDose    DailyDoseDelivery
              Completion    (push/email/in-app)
```

## External Services

```
┌───────────────────────────────────────────────────────────────┐
│                    EXTERNAL INTEGRATIONS                       │
├───────────────────────────────────────────────────────────────┤
│                                                               │
│  Auth (Dual)         Storage       AI / ML       Payments    │
│  ────────────       ─────────     ─────────      ─────────   │
│  NextAuth 4         Cloudflare    Claude API     Cashfree*   │
│  (Google, Email)     R2           (via AHI)     (→Razorpay)  │
│  Supabase Auth      (images,      Gemini AI                  │
│  (client-side)       audio)       (client-side)              │
│                                                               │
│  Analytics           Astrology                Infrastructure  │
│  ──────────          ──────────               ──────────────  │
│  Google Tag Manager  Prokerala API            Upstash Redis  │
│  Meta Pixel          (stubbed →               Pinecone       │
│  GA4                  placeholder)            (vector DB)    │
│  Pinterest Ads                                 OpenAI API    │
│                                                               │
└───────────────────────────────────────────────────────────────┘
  * Cashfree references exist but migration to Razorpay is planned per AGENTS.md
```

## Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        TRAFFIC                               │
│                          │                                   │
│                    ┌──────┴──────┐                            │
│                    │  Vercel     │                            │
│                    │ (apps/web,  │                            │
│                    │  apps/admin)│                            │
│                    └──────┬──────┘                            │
│                           │                                   │
│        ┌──────────────────┼──────────────────┐               │
│        ▼                  ▼                  ▼               │
│  apps/web (3000)    apps/api (3001)    apps/ahi (8000)      │
│  Next.js SSR        Fastify API        FastAPI (Python)      │
│  Edge Middleware     REST endpoints     Claude AI Client     │
│        │                  │                  │               │
│        └──────────────────┼──────────────────┘               │
│                           ▼                                   │
│                    ┌──────────┐                               │
│                    │PostgreSQL│                               │
│                    │(Supabase)│                               │
│                    └──────────┘                               │
│                                                               │
│  CI/CD: GitHub Actions (ci-test, deploy-staging, deploy-prod) │
│  Package Manager: pnpm 10.28                                  │
│  Monorepo Tool: Turborepo 2.3                                 │
└─────────────────────────────────────────────────────────────┘
```

## Key Technical Decisions & Audit Notes

| Area | Current State | Planned Change |
|------|--------------|----------------|
| Auth | NextAuth (Google, Email, Credentials) + Supabase client | Deprecate NextAuth → Supabase Auth only (magic-link/OTP) |
| Payments | Cashfree (env vars exist, code in place) | Razorpay migration |
| Booking | /step-8 (basic Booking model + UserPortalData) | Cal.com integration |
| Astrology | Mocked random signs in `/api/astrology/chart` | Real Prokerala API |
| Fastify API | Route stubs only | Per-phase implementation |
| Admin Panel | Placeholder only | Full admin dashboard |
| Docker Compose | No compose file checked in | Needs to be created |
| Database | Local PostgreSQL Docker container | Supabase/Neon cloud |

## Route Map Summary

### apps/web — 83+ routes
- **Public (11)**: /, /about, /contact, /events, /programs, /services, /visionaries, /shop, /insights, /insights/[slug], /tools
- **Tools (5)**: /tools/answer-book, /tools/kundli, /tools/mbti, /tools/numerology, /tools/tarot
- **Auth (5)**: /auth/login, /auth/register, /auth/magic-link, /auth/verify, /auth/error
- **Dashboard (14)**: /dashboard, /dashboard/activity, /dashboard/courses, /dashboard/dose, /dashboard/food-guide, /dashboard/journal, /dashboard/journal/new, /dashboard/journal/[id], /dashboard/learn, /dashboard/orders, /dashboard/profile, /dashboard/progress, /dashboard/routine, /dashboard/settings, /dashboard/shop
- **Portal (8)**: /step-1 through /step-8
- **Onboarding (4)**: /onboarding/step-1 through /onboarding/step-4
- **Practitioner (4)**: /practitioner, /practitioner/sessions, /practitioner/notes, /practitioner/overrides
- **API Routes (13)**: auth/[...nextauth], astrology/chart, portal, practitioner/clients, practitioner/notes, practitioner/overrides, practitioner/sessions, achievements, bookings, daily-dose, journals, leads, profile, reference, track, users

### apps/admin — 1 route
- `/` (placeholder)

### apps/ahi — 4 endpoints
- GET /health, POST /ahi/generate-dose, POST /ahi/generate-initial-plan, POST /ahi/pre-session-brief

### apps/api — 1 route
- GET /api/health (other routes stubbed)
