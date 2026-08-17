# AGENTS.md — Aumveda Project Memory

## Session Context (Aug 17, 2026 — Go-Live Phase: Production Configuration + Honesty Fixes)

### Production Deployment Target (Verified)
- **Platform**: Hostinger VPS (self-managed Linux)
- **Process Manager**: PM2 (3 apps: aumveda-api, aumveda-web, aumveda-admin)
- **CI/CD**: GitHub Actions — push to `main` (prod) / `develop` (staging) → SSH into VPS → git pull → pnpm install → PM2 restart
- **Primary Domain**: `app.aumveda.com` (www.aumveda.com → 301 to app.aumveda.com)
- **Database**: Supabase PostgreSQL (cloud, ap-south-1 pooler:6543)
- **Storage**: Cloudflare R2 (`assets.aumveda.com`)
- **Branching**: `main` = production, `develop` = staging

### Honesty Fixes Applied (Critical)
- **Checkout confirmation page**: Was showing green checkmark + "Order Confirmed!" + "Thank you for your purchase" + promising a confirmation email — all when no payment was made. Now shows amber clock icon + "Order Received" + honest "Payment pending" notice explaining online payment is not yet available.
- **Cart clearing**: Was destroying cart immediately after order creation (before payment). Now only clears cart when `paymentUrl` is present (actual payment redirect). If no payment URL, cart is preserved.
- **Checkout footer**: Was claiming "Payment processing by EazeBus. Your data is encrypted and secure." Now honestly states: "Online payment is not yet available. Our team will contact you to complete your purchase."
- **OrderDetailModal tracking**: Was showing fabricated tracking number `AUM-7721-X92` and fake delivery date `Oct 24, 2023`. Now only shows tracking section when real `trackingNumber` exists on the order.
- **AITipsCard**: Was sending hardcoded `userId: 'mock-user-id'` to API. Now sends empty body (server derives user from session).

### Security Fixes Applied
- **Error message leaks**: `POST /api/users/register` and `POST /api/journals/reflect` were returning raw `error.message` to clients. Now return generic error strings.
- **Gemini API key**: Demoted from `NEXT_PUBLIC_GEMINI_API_KEY` to `GEMINI_API_KEY` (server-only).
- **Analytics track**: Added `getServerSession(authOptions)` check (was unauthenticated).
- **Account deletion**: Added `{ "confirmation": "confirm-delete" }` JSON body requirement.
- **Upload file-type validation**: Added MIME type whitelist (image + audio only, 415 for disallowed).

### Environment Variable Audit (47 variables used in source code)
| Category | Variables | Production Value Available? |
|----------|-----------|---------------------------|
| Auth | NEXTAUTH_SECRET, NEXTAUTH_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET | Must configure |
| Database | DATABASE_URL, DIRECT_URL | Must configure (Supabase) |
| Supabase | NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, SUPABASE_SERVICE_ROLE_KEY | Must configure |
| AI | GEMINI_API_KEY, AHI_URL | Must configure / optional |
| Storage | CLOUDFLARE_R2_ACCOUNT_ID, *_ACCESS_KEY_ID, *_SECRET_ACCESS_KEY, *_BUCKET_NAME, *_PUBLIC_URL | Must configure |
| Email | EMAIL_SERVER_HOST, EMAIL_SERVER_PORT, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD, EMAIL_FROM | Must configure |
| Booking | PRACTITIONER_NOTIFY_EMAIL, SEJAL_NOTIFY_EMAIL, ARCHANA_NOTIFY_EMAIL, ADMIN_NOTIFY_EMAIL | Must configure |
| Payment | EAZEBUS_BASE_URL, EAZEBUS_MERCHANT_ID, EAZEBUS_API_KEY | DEFERRED |
| Webhooks | N8N_PORTAL_WEBHOOK_URL, N8N_WHATSAPP_WEBHOOK | Optional |
| Config | NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_BASE_URL, ADMIN_URL, PORT, COURSE_JWT_SECRET, CRON_SECRET | Must configure |
| Feature Flags | NEXT_PUBLIC_FLAG_SHORT_PORTAL, *_BREATH_VARIANT, *_EXIT_INTENT | Optional |
| Astrology | PROKERALA_CLIENT_ID, PROKERALA_CLIENT_SECRET | DEFERRED |
| Google Places | NEXT_PUBLIC_GOOGLE_PLACES_API_KEY | DEFERRED |

### DEV_BYPASS Security (Verified)
- Triple guard: `NODE_ENV !== 'production'` AND `DEV_BYPASS === 'true'` in 3 session functions + middleware
- Cannot be triggered by any HTTP request — pure server-side env check
- Middleware only bypasses dashboard routes (NOT admin or practitioner)
- In DEV_BYPASS mode, `getApiSession()` returns `role: 'client'` — admin routes correctly reject it
- `.env.local` (sets DEV_BYPASS=true) is properly gitignored

### Security Audit Summary
- **CRITICAL**: 0 | **HIGH**: 0 | **MEDIUM**: 4 (all portal/lead-capture routes intentionally unauthenticated) | **LOW**: 6
- No hardcoded secrets in source code
- All admin routes double-protected (middleware + API-level role check)
- JWT + DB session tracking + revocation at getServerSession level
- CSP headers, HSTS, X-Frame-Options DENY all configured

### Build Verification (Aug 17, 2026)
- `pnpm --filter @aumveda/web typecheck` — PASS (0 errors)
- `pnpm --filter @aumveda/web lint` — PASS (only pre-existing warnings)
- `pnpm --filter @aumveda/web build` — PASS (116 routes)

---

## Session Context (Aug 17, 2026 — Full Production Readiness Audit + Hardening)

### What We Did
Comprehensive 26-phase production readiness audit across environment, auth, security, commerce, dashboard, portal, storage, email, 3D, SEO, performance, mobile, logging, and dependencies. All findings fixed or documented.

#### Security Fixes Applied
- **Gemini API key demoted to server-only**: `NEXT_PUBLIC_GEMINI_API_KEY` → `GEMINI_API_KEY` (was exposed to client bundle). Updated in `lib/gini.ts`, `.env.example`, `turbo.json`.
- **Analytics track endpoint auth-protected**: `/api/analytics/track` now requires valid session (`getServerSession`). Previously unauthenticated — anyone could write events.
- **Account deletion requires confirmation**: `/api/users/me` DELETE now requires `{ "confirmation": "confirm-delete" }` in body. Previously a single click deleted the account.
- **Upload file-type validation**: `/api/journals/upload` now accepts only image (JPEG, PNG, WebP, GIF, AVIF) and audio (MP3, WAV, WebM, OGG) MIME types (415 for disallowed). Previously accepted any file type.
- **ImageUpload.tsx fixed**: Was calling dead routes (`/api/uploads/presign`, `/api/uploads/complete`) with hardcoded `mock-user-id`. Now calls real `/api/journals/upload` via FormData. `accept` attribute restricted to allowed image types.

#### SEO Fixes Applied
- **robots.txt created**: `public/robots.txt` — allows public routes, blocks `/dashboard/`, `/admin/`, `/practitioner/`, `/api/`, `/step-*`, `/onboarding/`, `/auth/`.
- **Dynamic sitemap created**: `src/app/sitemap.ts` — generates sitemap.xml for all public routes (14 static + 8 portal steps). Uses `NEXT_PUBLIC_BASE_URL`.

#### Reliability Fixes Applied
- **Dashboard error boundary**: `src/app/(dashboard)/error.tsx` — catches server-component errors with retry/back-to-dashboard UX.
- **Global error boundary**: `src/app/error.tsx` — catches app-level errors.
- **Dashboard loading state**: `src/app/(dashboard)/loading.tsx` — spinner during server-component streaming.
- **Journal list error handling**: `src/app/(dashboard)/dashboard/journal/page.tsx` — try/catch around Prisma query, gracefully falls back to empty list instead of crashing.

#### Environment Cleanup
- **`.env.example` fully rewritten**: Removed CASHFREE vars, added EAZEBUS placeholder, added `NEXT_PUBLIC_BASE_URL`, `GEMINI_API_KEY`, `N8N_WHATSAPP_WEBHOOK`, `DEV_BYPASS` warning. Removed dead `CALENDLY_*` hardcoded placeholder values.
- **Dead legacy file removed**: `apps/web/db.js` (old Supabase client using nonexistent `SUPABASE_URL`/`SUPABASE_ANON_KEY`). Not imported anywhere.

#### Verification (Aug 17, 2026)
- `pnpm --filter @aumveda/web typecheck` — PASSES (0 errors)
- `pnpm --filter @aumveda/web lint` — PASSES (only pre-existing `<img>` warnings + 1 useEffect dep)
- `pnpm --filter @aumveda/web build` — PASSES (116 routes, all `/api/*` dynamic)

#### Key Security Properties (Current)
- Identity always from session (`getApiSession()` / `getServerSession()`); client-supplied `userId` ignored in API routes
- `DEV_BYPASS` mechanism exists in `lib/session.ts` — when `NODE_ENV !== 'production'` AND `DEV_BYPASS=true`, returns hardcoded dev session. **Must ensure production never has DEV_BYPASS=true.**
- Admin routes (`/admin/*`) role-gated via `isAdminRole()` middleware
- Practitioner routes role-gated via `getApiPractitionerSession()` (practitioner/admin/super_admin)
- `/api/user/delete` requires `password: "confirm-delete"` string; `/api/users/me` DELETE requires `{ confirmation: "confirm-delete" }` JSON body
- `/api/journals/upload` rejects non-image/audio MIME types (415), 503 if R2 unconfigured
- CSP headers configured: script-src, img-src, connect-src, frame-src all scoped to known domains
- NextAuth JWT maxAge: 30 days, bcrypt 12 rounds, OTP 6-digit/10min expiry, email verify 24h, password reset 1h

### Known Gaps (Deferred — Not Blockers for Launch)
| Gap | Why Deferred | Impact |
|-----|-------------|--------|
| EazeBus payment integration | No API docs/credentials available yet | Checkout creates order with PENDING payment status; cannot complete payment flow |
| Prokerala astrology | No API credentials configured | Step 6 portal falls back to deterministic placeholder chart |
| Cal.com booking | No API key; Calendly env vars are hardcoded placeholders | Booking confirmation page shows fake Calendly links |
| Email/SMTP | No email provider configured | Magic links, order confirmations, booking emails non-functional |
| Cloudflare R2 production | Credentials only in dev .env.local | Image uploads work in dev; production URLs may show `undefined.r2` prefix |
| Dashboard courses/learn pages | Fully hardcoded demo data | Not wired to course APIs yet |
| Fastify API (apps/api) | Only route stubs | All logic in Next.js API routes currently |
| Admin app (apps/admin) | Placeholder only | Not built out — real admin is in web app `/admin/*` |
| Docker compose | Manual Docker only | Hinders reproducible dev env |
| PostgreSQL production | Local Docker vs cloud Supabase | Session data not synced |
| `<img>` tags vs `next/image` | ~15 components use `<img>` | LCP/bandwidth warnings; functional but suboptimal |
| 3D fallback components | No error boundaries for GLB loading | If model fails to load, user sees blank canvas |
| Next.js config warnings | `duration-[1400ms]` etc. ambiguous Tailwind classes | Cosmetic only, no functional impact |

---

## Session Context (Aug 08, 2026 — Commerce Foundation + Admin Panel + Dashboard APIs)

### What We Did
- **Commerce Foundation**: Prisma schema (Product with category/tags/compareAtPriceCents/metadata, Order with paymentStatus/eazebusOrderId/customerEmail/customerName), ProductService, Zod validation, reusable ProductTable/ProductForm/ProductInventoryBadge, Cart system (localStorage persistent), Payment abstraction, EazeBus adapter skeleton, Order mapper
- **Admin Panel (Phase 2)**: Admin layout with nav, Dashboard with real DB metrics, Products CRUD, Orders list/detail with status management, Users list/detail, Leads list, Appointments list/detail. All 8 admin API routes.
- **Database Activation (Phase 3)**: Docker started, PostgreSQL activated, commerce migration applied (5+5+1 schema changes), Prisma Client regenerated, 21 products seeded and verified across 4 categories
- **Commerce Smoke Tests**: All 16 tests passed against real PostgreSQL (products API, PDP, checkout, order creation, inventory decrement, quantity validation, admin auth)
- **Dashboard Bug Fixes**: Fixed `paid` field (was filtering fulfillment not paymentStatus), `revenue` shape (was `{totalInr}`, page expected flat), `bookings` → `appointments` rename, added failed/refunded metrics

### Product Management
- Reusable `ProductForm` and `ProductTable` components are panel-agnostic with configurable `apiBasePath`, `redirectPath`, `editBasePath` props
- Used by both `/admin/products` (admin API) and `/dashboard/shop` (shop API)
- Product model: id, title, slug (unique), description, sku (unique), priceInr, compareAtPriceCents, imageUrl, category, tags, isActive, inventory, metadata (JSON), createdAt, updatedAt

### Order State Machine
- `status`: PENDING → CONFIRMED → SHIPPED → DELIVERED | CANCELLED (fulfillment)
- `paymentStatus`: PENDING → PAID | FAILED → REFUNDED (payments)
- These are separate fields — order can be CONFIRMED but PENDING payment

### Commerce Seed Data
- 21 products: AUM-0001 through AUM-0021
- 4 categories: teas, supplements, journals, accessories
- Price range: ₹399-₹4,999
- All active, inventory=100

---

## Session Context (Aug 08, 2026 — Dashboard honesty pass / zero fabricated data)

### What We Did
- Removed all production-facing hardcoded demo data in dashboard
- ConsentManager no longer defaults toggles ON (DPDP opt-in compliance)
- SettingsForm notification + consent checkboxes now real Switches bound to /api/consent
- ProfileHeader: removed fake sparkline, "Last sync" pill, no-op "Connect Google" button
- /api/profile/progress fallback now zeros (not fake 50s)
- Verified clean: /dashboard, TodayDoseCard, CosmicNoteCard, QuietGrounding

---

## Session Context (Aug 08, 2026 — Dashboard APIs production-hardening)

### What We Did
- Implemented 14 missing /api/* route handlers
- All routes: derive user from getApiSession(), force-dynamic, Zod-validate, Event audit rows
- Fixed /api/profile/progress response shape
- New libs: r2.ts (SigV4 presigned PUT), course-token.ts (HMAC-SHA256)
- ImageUpload hardened: throws on failed presign

---

## Portal Engine Architecture (Jun 28, 2026)
- Location: `apps/web/src/portal/` (22 files)
- Engine: PortalProvider, StateMachine, Context, Router, StepRegistry, ValidationEngine, AutosaveManager, SessionPersistence, AnimationManager, ProgressManager, PortalApiClient
- Steps: Step1Breath (7 files) — 3-cycle breathing ritual
- 8 extension point interfaces (Prokerala, Google Places, Cal.com, Razorpay, n8n, AHI, Daily Dose, CRM)

## Architecture Snapshot (Jun 28, 2026 — Full Audit)

### Monorepo
- **4 apps**: web (Next.js 14 / :3000), api (Fastify 5 / :3001), admin (Next.js 14 / :3002), ahi (FastAPI Python / :8000)
- **3 packages**: db (Prisma + 42 models), types (shared enums/interfaces), utils (PII hash, scoring INR format, slug)
- **Tooling**: pnpm 10.28 workspaces, Turborepo 2.3

### Database — PostgreSQL (local Docker: aumveda-pg, :5432)
- **44 Prisma models** (42 original + Product, Order), 6 migrations, seed data loaded
- Reference tables: 7 chakras, 6 archetypes, 7 tarot themes, 36 chart predictions, 7 pattern questions, 28 scoring rules, 6 profile maps, 21 products

### External Services
- **Auth**: NextAuth 4 + Supabase Auth (dual, migrating to Supabase-only)
- **Storage**: Cloudflare R2 (images/audio)
- **AI**: Claude API (via AHI), Gemini (server-only via lib/gini.ts)
- **Payments**: EazeBus (planned, adapter skeleton exists)
- **Analytics**: GTM, Meta Pixel, GA4, Pinterest Ads
- **Astrology**: Prokerala (stubbed — deterministic fallback)
- **Infra**: Upstash Redis, Pinecone, OpenAI

### How to Use Local DB
```bash
docker start aumveda-pg          # Start PostgreSQL
pnpm db:migrate                  # Apply migrations
pnpm db:seed                     # Seed reference + product data
pnpm --filter web dev            # Run dev server
```

### When Ready to Deploy
1. Set production env vars in Vercel (DATABASE_URL, NEXTAUTH_SECRET, GEMINI_API_KEY, R2 credentials, etc.)
2. Ensure DEV_BYPASS is NOT set in production
3. `prisma migrate deploy` for schema migration
4. `prisma db seed` for reference data
5. Configure EazeBus credentials when available
6. Configure Prokerala/Cal.com/SMTP credentials
