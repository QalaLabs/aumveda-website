# AUMVEDA Product Completion — Phase 1 Audit

**Status:** Awaiting approval before any implementation  
**Scope:** AUMVEDA only (no CRM / Admissions / LMS / Website Builder)  
**Date:** Jul 2026  
**Rule:** No new features. Complete and harden existing product.

Interactive summary: open canvas `aumveda-phase1-audit.canvas.tsx` beside chat.

---

## Exit criteria (Phase 1)

- Zero mock business data in production paths
- Every button works or is removed / clearly unavailable in non-local
- No endpoint silently returns fabricated business data
- Critical journeys: real data or graceful fail

---

## 1. Mock Inventory

| Sev | Where | What |
|-----|-------|------|
| P0 | `portal/steps/Step8Booking/PaymentForm.tsx` | Razorpay simulated; `pay_*` random IDs |
| P0 | `api/journals/upload/route.ts` | Fake `r2.aumveda.com` URLs; no storage |
| P0 | `lib/session.ts` + `middleware.ts` | `DEV_BYPASS` → `dev@aumveda.com`; seeds 42/3 |
| P0 | `components/DailyCheckIn.tsx` | Toast-only; no API (legacy) |
| P0 | `components/ImageUpload.tsx` | `mock-user-id`; missing `/api/uploads/*` |
| P0 | `components/AITipsCard.tsx` | Missing `/api/ai/tips` |
| P0 | `dashboard/orders` | Missing `/api/orders*` |
| P0 | `contact/page.tsx` | Toast-only submit |
| P1 | `api/dev/login` | Dev auto-login + seed metrics |
| P1 | `api/astrology/chart` | Silent `mockChart()` fallback |
| P1 | `tools/kundli` | Client fake chart; ignores API |
| P1 | `api/mux/upload` + `mock-receiver` | Mock when Mux unset |
| P1 | `NotificationCenter.tsx` | `MOCK_NOTIFICATIONS` / Dr. Sharma |
| P1 | `DailyDoseList.tsx` | Fake achievement unlock |
| P1 | `dashboard/page.tsx` catch | Fake 42/3 + cosmic note |
| P1 | `lib/email.ts` | SMTP simulator |
| P1 | `api/analytics/track` | n8n WhatsApp = console.log |
| P2 | Public tarot / answer-book | Random entertainment (OK if labeled) |

---

## 2. Placeholder Inventory

| Sev | Where | What |
|-----|-------|------|
| P1 | `apps/admin` | “Dashboard coming in Phase 11” |
| P1 | `dashboard/courses` | “Video loads from R2 in production” |
| P1 | `visionaries` + `Timeline` | “Dr. Sejal Jain” (brand forbids Dr.) |
| P1 | `lib/products-data.ts` | Images from astrotalk.store CDN |
| P2 | Events / shop / HealersSection | Unsplash as product imagery |
| P2 | Step5Intention | Voice input “coming soon” |
| P2 | reels | Thumbnail placeholder asset |

---

## 3. Hardcoded Data Inventory

| Sev | Where | What |
|-----|-------|------|
| P0 | Step8Booking packages | Prices `0 / 1500 / 3999 / 12999` |
| P1 | PaymentForm coupons | `HEAL50` / `WELCOME10` client-only |
| P1 | session / seed-dev-client | `progress: 42`, `streakDays: 3` |
| P1 | DailyDoseCTA | “12-day streak” copy |
| P1 | progress/page | sessions 2/3 + Heart chakra simulated |
| P1 | shop / courses / events | Hardcoded catalogs & prices |
| P1 | public shop | Cashfree copy leftover |

---

## 4. Dead UI Inventory

| Sev | Where | What |
|-----|-------|------|
| P0 | contact, DailyCheckIn, orders, AITips, ImageUpload | Toast-only or missing API |
| P1 | shop cart, courses enroll, routine | No persistence / no payment |
| P1 | middleware `/checkout` | Protected; **no checkout pages** |
| P1 | LeadMagnetCTA | Claims emailed report; lead-only |
| P2 | Step2Chakra / Step3Archetype | `onClick={() => {}}` |

---

## 5. API Status Matrix (risk focus)

| Path | Auth | Data | Issue |
|------|------|------|-------|
| `/api/portal`, `/api/portal/portal-booking` | Weak/none | Real DB | Accepts fake payment IDs |
| `/api/bookings` | **None** | Real | Unauthenticated write |
| `/api/practitioner/*` | **None** | Real PII | Open |
| `/api/reels/approve` | **None** | Real | Anyone can approve |
| `/api/journals/upload` | Session | Mock URL | No R2 |
| `/api/astrology/chart` | No | Prokerala \| mock | Silent fallback |
| `/api/dashboard/check-in`, `homework` | getApiSession | Real | DEV_BYPASS aware |
| `/api/journals/*` CRUD | Session | Real | OK |
| `/api/daily-dose*` | Session | Real | OK |
| `/api/auth/*` OTP/reset | Token/none | Real | Email may simulate |
| `/api/mux/upload` | No | Real \| mock | mock-receiver |
| `/api/orders*`, `/api/ai/tips`, `/api/uploads*` | — | **MISSING** | UI still calls |
| `apps/api` Fastify | — | Stub | Health only |
| `apps/ahi` | — | Claude if keyed | Often unused by dose UI |

---

## 6. Journey Status

| Journey | Status | Notes |
|---------|--------|-------|
| Auth | Partial | Real stack; SMTP often simulated; DEV_BYPASS in local |
| Portal 1–8 | Partial | Real until Step 8 payment mock |
| Daily Dose | Partial | DB real; fake achievement overlay |
| Dashboard | Partial | Prisma real; catch mocks |
| Journal | Partial | CRUD real; uploads fake |
| Voice notes | Mock | Recorder OK; R2 fake |
| Homework | **Real** | Honest empty |
| Journey | **Real** | Honest empty → portal |
| Booking / checkout | **Broken** | Fake pay; no checkout pages |
| Profile | Partial | users/me OK; upload broken |
| Practitioner | Partial | Unauthenticated APIs |
| Progress | Partial | Hardcoded session/chakra UI |

---

## 7. Production Gap Report

**Money & trust:** Fake Razorpay IDs can create bookings. Shop/courses pretend commerce. Contact & lead magnet claim delivery without send.

**Security:** Practitioner, bookings, reels approve lack auth. Portal trusts client `userId`.

**Media:** Fake R2 URLs; Mux mock-receiver; non-Aumveda CDN imagery.

**Honesty:** Homework/Journey empty states honest. Dashboard catch, notifications, progress, DailyDoseCTA fill with fake data.

**Tooling:** `.ocr/commands/doctor.md` absent; `gh` unavailable on machine. Reviewer rules (universal + TypeScript) applied as checklist.

---

## 8. Prioritized Fix Plan

### P0 (do first)
1. Live Razorpay; reject unverified `pay_*`
2. Real R2 (or fail closed) for journal/voice upload
3. Auth-lock `practitioner/*`, `bookings`, `reels/approve`
4. Hard-fail `DEV_BYPASS` / `/api/dev/login` outside local
5. Fix or remove callers of missing `/api/orders*`, `/api/ai/tips`, `/api/uploads/*`
6. Contact form → real lead write

### P1
7. Remove Cashfree copy; production SMTP
8. Prokerala + labeled fallback; fix kundli tool
9. Honest LeadMagnetCTA or real email
10. Quarantine toast-only shop/courses/routine or wire APIs
11. Remove hardcoded 42/3, “12-day streak”, progress simulations
12. Mux credentials or hide reels upload outside local
13. Brand: remove Dr. Sejal / Dr. Sharma; replace CDN imagery

### P2
14. Dead `onClick` Step2/3; voice-coming-soon honesty

### P3
15. Admin / Fastify stubs: explicit out-of-scope or delete

---

## Approval

Reply **approve Phase 1 P0** (or narrower scope) to start implementation.  
No code changes until then.
