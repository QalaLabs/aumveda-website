# Aumveda — Database Guide

This is the plain-English map of `prisma/schema.prisma`: what each group of
tables is for, how they relate, how connections/pooling work in production,
and the indexing/tracking decisions behind the current schema. Read this
before adding a model or writing a query against a hot path.

- **Engine**: PostgreSQL 17 (Supabase, project `Aumveda` / `ejhqowhmhzganbpzfntk`, region `ap-south-1`)
- **ORM**: Prisma 6 with the `@prisma/adapter-pg` driver adapter (not the default Prisma engine binary)
- **Client factory**: [`src/index.ts`](src/index.ts) — one shared `PrismaClient` per process, backed by a `pg.Pool`

---

## 1. Connection model — read this before touching `src/index.ts`

Supabase gives every project **two** connection strings:

| Env var | Port | What it is | Used for |
|---|---|---|---|
| `DATABASE_URL` | 6543 | PgBouncer transaction pooler (`pgbouncer=true`) | **Every runtime query** — the Next.js app, cron routes, everything under `apps/web` |
| `DIRECT_URL` | 5432 | Direct, unpooled Postgres connection | **Only** `prisma migrate` / `prisma db push` — DDL needs a real session, not a pooled transaction connection |

`createPrismaClient()` in `src/index.ts` must connect with `DATABASE_URL`
first. Serverless/Cloud Run deployments spin up many short-lived container
instances; each one opens its own `pg.Pool`. If runtime code ever falls back
to `DIRECT_URL`, every instance opens raw, unpooled connections against
Postgres's hard connection cap, and the app starts failing under any real
concurrency — this exact bug shipped once (fixed 2026-08-28, see git log for
`packages/db/src/index.ts`) and cost the pooler entirely. `DATABASE_POOL_MAX`
(default `5`) bounds how many connections each *instance's* pool may hold —
tune it down before scaling instance count up, never the other way round.

---

## 2. Model groups

### Auth (NextAuth.js)
`Account`, `Session`, `VerificationToken`, `User` — standard NextAuth Prisma
adapter tables, extended on `User` with `passwordHash`, `otpCode`/`otpExpires`
(credentials + OTP login), `role` (`"user" | "client" | "practitioner" |
"admin" | "super_admin"`, `"user"` treated as a legacy alias for `"client"`
everywhere in app code), and birth-chart fields (`dob`, `birthLat/Lng`,
`sunSign`/`moonSign`/`risingSign`) used by the astrology portal.

### Profile & consent
`Profile` (1:1 with `User` — timezone, bio, streak, progress score),
`Consent` (per-user, per-key boolean with a policy `version` — tracking,
health_sync, marketing, ai_personalization).

### Daily practice & progress engine
`Journal`, `DailyDose` + `DailyDoseCompletion`, `ProgressSnapshot` (the
weighted `P_t` score: 35% sleep + 30% activity + 25% journal + 10%
wellbeing), `Achievement`, `HealthSync` + `HealthMetric` (Google Fit /
Health Connect).

### Commerce
`Product` (crystal sanctuary SKUs — priced in **paise**, i.e.
`priceCents = ₹ × 100`), `Order` + `OrderItem`. Order carries both a
fulfillment `status` (`PENDING → CONFIRMED → SHIPPED → DELIVERED |
CANCELLED`) and a separate `paymentStatus` (`PENDING → PAID | FAILED |
REFUNDED`) — don't conflate the two in queries.

### LMS
`Course` → `Module` (ordered by `orderIndex`, has `ytVideoId`) →
`CourseProgress` (per-user, per-module watch state) and `Enrolment`
(per-user, per-course). Seeded via `prisma/seed-courses.ts`.

### Practitioner services & bookings
`Booking` (1:1 optional `TherapySession` for post-session notes),
`Package` (prepaid session bundles), `Subscription` (community
membership billing). `practitioner` and `serviceType` are free-text
columns, not FK'd to a practitioner table — there is no dedicated
`PractitionerProfile` model; the two practitioners (Archana Jain, Sejal
Jain) are represented by name string today.

### Community
`CommunityMember`, `LiveCircle` + `LiveCircleRSVP` (idempotent — unique on
`[userId, circleId]`), `Challenge` + `ChallengeParticipation`.

### Portal / astrology reference data
`UserPortalData` (per-user quiz answers + derived scores from the onboarding
portal), and read-only reference tables seeded once and never written to by
users: `ChakraReveal`, `ArchetypeReveal`, `TarotTheme`, `ChartPrediction`,
`PatternQuestion`, `PatternScoring`, `PatternProfile`. Seeded via
`prisma/seed.ts`.

### Content & dashboard
`Reel` (short-form video, Mux-backed), `ContentView` (anonymous-friendly —
`userId` is nullable), `CosmicNote` (weekly editorial card), `DailyCheckIn`,
`ClientHomework` (practitioner-assigned, client-submitted, practitioner-reviewed).

### Event log — the "capture every step" table
`Event` is an **append-only** table: `eventId` (public id), `userId`
(nullable — supports anonymous events), `eventName`, `payload` (JSON),
`source` (`"client" | "server"`), `forwarded` (whether it's been relayed to
GTM/ad platforms). Indexed on `(eventName, createdAt)` and `(userId,
eventName)`.

**Current gap**: the two write endpoints (`/api/analytics/track`,
`/api/track/event` — duplicates of each other) both require an
authenticated session and 401 otherwise, so nothing before sign-up
(landing page, the onboarding portal quiz) is actually captured despite
the client hook (`usePortalAnalytics`) trying to send it. `Event.userId`
is already nullable for exactly this reason — the schema supports
anonymous events, the API layer just doesn't allow them yet. See
`ARCHITECTURE.md` / the tracking recommendations thread for the fix
(anon-ID cookie + identity backfill on sign-in + endpoint consolidation).

---

## 3. Indexing strategy

Postgres does **not** auto-index a plain foreign-key column, and Prisma
only creates a DB index for the **leading** column of a composite
`@@unique` — a query filtered by the trailing column alone gets a seq scan.
Every `@@index` in the schema exists because a real query in
`apps/web/src/app/api/**` needs it — cross-check `grep -rn
"prisma\.<model>\.find" apps/web/src` before adding or removing one.

Migration `20260828060000_add_hot_path_indexes` added indexes that were
missing on `Order` (userId/status/createdAt), `OrderItem`
(orderId/productId), `Module.courseId`, `Enrolment.courseId`,
`CourseProgress.moduleId`, `Booking` (userId, status+bookingDatetime),
`TherapySession.userId`, `Package.userId`, `DailyDoseOverride.userId`,
`DailyDoseDelivery.date`, `Subscription` (status+nextBillingDate),
`LiveCircleRSVP.circleId`, `ChallengeParticipation.challengeId`, `Reel`
(isPublished+publishedAt), `ContentView` (userId, contentType+contentId).

---

## 4. Migrations & seeding

```bash
# generate the Prisma client (run after any schema.prisma change)
pnpm --filter @aumveda/db generate

# apply pending migrations to the connected database (production-safe)
pnpm --filter @aumveda/db push          # `prisma db push` — no migration history
# or, for a tracked migration:
npx prisma migrate deploy --schema=prisma/schema.prisma   # from packages/db

# seed reference data, products, and courses (idempotent — safe to re-run)
pnpm --filter @aumveda/db seed
# or individually:
pnpm --filter @aumveda/db seed:reference   # chakra/archetype/tarot/pattern tables
pnpm --filter @aumveda/db seed:products    # crystal sanctuary SKUs
pnpm --filter @aumveda/db seed:courses     # the 5 core LMS courses
```

Migrations in `prisma/migrations/` are hand-authored when there's no live
DB to run `prisma migrate dev` against (e.g. this repo's CI sandbox) —
always verify a hand-written migration against `prisma migrate diff
--from-empty --to-schema-datamodel prisma/schema.prisma --script` to catch
naming drift before committing it.

---

## 5. Known trade-offs (accepted, not bugs)

- **`role: "user" | "client" | ...`** — `types/src/index.ts`'s `UserRole`
  type only exports 4 values (no `"user"`); the DB default and legacy rows
  can still be `"user"`, normalized to `"client"` in `auth.ts` and
  `middleware.ts`. Keep that normalization in both places if you touch
  either file.
- **No dedicated `PractitionerProfile`/`ServiceOffering` models** —
  practitioner and service type are free-text on `Booking`/`TherapySession`.
  Fine at 2-practitioner scale; revisit if a 3rd practitioner or
  self-service practitioner onboarding is ever needed.
- **`Event` has no partitioning/archival** — append-only and will grow
  unbounded. Fine at current volume; plan a monthly-partition or
  export-and-prune job before it reaches multi-GB.
