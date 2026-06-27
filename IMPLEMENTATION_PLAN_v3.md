# AUMVEDA — Full Implementation Plan v3.0

**Based on:** `AUMVEDA_Full_PRD_v3_June2026.docx`
**Current path:** `E:\Aumveda Website\App`
**Timeline:** Jul 1 – Sep 30, 2026
**Target:** ₹500K MRR, 1000 portal completions, 40 service clients, 200 community members

---

## Table of Contents

1. [What Already Exists](#1-what-already-exists)
2. [Gap Summary](#2-gap-summary)
3. [Phase 0 — Portal MVP (Jul 1–21)](#phase-0--portal-mvp-jul-121)
4. [Phase 1 — AI Companion (Jul 22–Aug 11)](#phase-1--ai-companion-jul-22aug-11)
5. [Phase 2 — Community (Aug 12–25)](#phase-2--community-aug-1225)
6. [Phase 3 — Ecommerce (Aug 26–Sep 8)](#phase-3--ecommerce-aug-26sep-8)
7. [Phase 4 — Reels & Influencers (Sep 9–22)](#phase-4--reels--influencers-sep-922)
8. [Phase 5 — Scale & Optimise (Sep 23–30)](#phase-5--scale--optimise-sep-2330)
9. [Auth Migration Strategy](#9-auth-migration-strategy)
10. [Database Schema Overlay](#10-database-schema-overlay)
11. [Dependencies to Install](#11-dependencies-to-install)
12. [Risk Mitigation](#12-risk-mitigation)

---

## 1. What Already Exists

### ✅ Fully Built & Production-Ready

| Area | Details |
|------|---------|
| **Monorepo** | Turborepo + pnpm workspace — apps/web, apps/api, apps/admin, packages/db, packages/types, packages/utils |
| **Auth** | NextAuth v4 (JWT, 30-day sessions) with Google OAuth + Email magic link + Credentials — login, register, magic-link, verify, error pages all built |
| **Public Pages** | Homepage (hero, stats, 5 pillars, healers, features, programs, testimonials, CTA), /about, /services, /programs, /events, /insights + [slug], /contact, /visionaries |
| **Shop (static)** | /shop with categories, cart, 90+ static products in `products-data.ts` |
| **Free Tools** | /tools/kundli, /tools/numerology, /tools/tarot, /tools/mbti, /tools/answer-book |
| **Dashboard** | 14 routes — home, activity, courses, dose, food-guide, journal (+new/+[id]), learn, orders, profile, progress, routine, settings, shop |
| **Journal** | Full CRUD with rich text, mood, tags, images (R2) — auto progress recalculation |
| **Daily Dose** | Audio-based daily practices with completion tracking |
| **Progress Engine** | `P_t = 0.35*S_t + 0.30*A_t + 0.25*J_t + 0.10*W_t` with snapshots |
| **Prisma Schema** | 20 models — User, Profile, Account, Session, VerifToken, Consent, Journal, DailyDose, DailyDoseCompletion, ProgressSnapshot, Achievement, HealthSync, HealthMetric, Product, Order, OrderItem, Course, Module, Enrolment, CourseProgress, Event |
| **R2 Storage** | Cloudflare R2 presigned URLs for images/audio |
| **Payments** | Cashfree schema (Orders, OrderItems) — sandbox keys present |
| **Fastify API** | Server with Helmet, CORS, Cookie, Rate-limit, Health check — phase-based route stubs |
| **GSAP/Framer** | framer-motion 12, tailwindcss-animate — GSAP not installed |
| **Dark Mode** | next-themes class-based dark mode |

### ⚠️ Partially Built / Needs Adaptation

| Area | Current State | PRD Wants |
|------|---------------|-----------|
| **Auth system** | NextAuth v4 (3 providers, password-based) | Supabase Auth (magic link only, no password) |
| **Shop** | Static `products-data.ts`, Cashfree payment | DB-backed products, Razorpay, Shiprocket, crystal-specific |
| **Daily Dose** | Audio practices, manually created | AI-generated AHI engine, WhatsApp delivery @ 7am IST |
| **Homepage** | Current wellness site messaging | New portal-first funnel, single CTA "Begin Your Journey" |
| **API backend** | Fastify stubs per phase | Python FastAPI AHI engine, n8n automation |
| **Analytics** | Custom Event table, GTM | Mixpanel, ConvertKit, Meta Pixel |
| **E-commerce** | Cashfree integration | Razorpay (payments) + Shiprocket (fulfillment) |

### ❌ Needs Complete New Build

| Feature | PRD Reference |
|---------|---------------|
| **8-Step Portal** (Breath → Chakra → Archetype → Tarot → Intention → Constellation → Pattern Test → Booking) | Section 1 |
| **AHI Engine** (Python FastAPI microservice + Claude API for Daily Dose generation) | Section 4 |
| **Community Hub** (Circles, Challenges, Member tiers ₹999/mo) | Journey 3 |
| **Crystal Shop** (DB-backed, Razorpay, Shiprocket, profile-matched recs) | Journey 2 |
| **Reels Section** (Mux streaming, influencer submissions, vertical swipe UI) | Section 4.2 |
| **Practitioner Dashboard** (Client pipeline, session notes, distress alerts, revenue) | Section 4.6 |
| **Service Booking** (Cal.com + Razorpay for paid sessions) | Journey 4 |
| **n8n Automations** (10 defined workflows: lead capture → Daily Dose delivery) | Section 6.2 |
| **Sanity CMS** (Reels metadata, blog, crystal content, Vedic almanac) | Tech Stack |
| **WhatsApp Delivery** (Meta Business API for Daily Dose, reminders, alerts) | Section 4.1 |
| **Mixpanel Analytics** | Section 6.1 |
| **ConvertKit Email** (Lead nurture sequences) | Section 6.1 |
| **Supabase RLS** (Row-level security for DPDP compliance) | Section 6.3 |

---

## 2. Gap Summary

### 🔴 High Priority (Phases 0–1)

| Gap | Existing | Action |
|-----|----------|--------|
| 8-step portal | Nothing — current site is marketing, not portal | NEW BUILD |
| Prisma: user_portal_data | Not in schema | NEW MODEL |
| Prisma: bookings/sessions/packages | Not in schema | NEW MODELS |
| Prisma: reference tables (7 tables) | Not in schema | NEW MODELS |
| Prokerala API | Not integrated | NEW INTEGRATION |
| Google Places API | Not integrated | NEW INTEGRATION |
| AHI Engine (Python FastAPI) | Not built | NEW SERVICE |
| n8n automations | Not set up | NEW SERVICE |
| Calendly/Cal.com | Not integrated | NEW INTEGRATION |
| WhatsApp Meta API | Not integrated | NEW INTEGRATION |
| Supabase Auth migration | Using NextAuth | MIGRATION |
| Razorpay | Cashfree exists, not Razorpay | SWITCH PAYMENTS |

### 🟡 Medium Priority (Phases 2–3)

| Gap | Existing | Action |
|-----|----------|--------|
| Community models | Not in schema | NEW MODELS |
| Crystal-specific product fields | Generic Product model | EXTEND MODEL |
| Shiprocket fulfillment | Not integrated | NEW INTEGRATION |
| Mixpanel | Not integrated | NEW INTEGRATION |
| ConvertKit | Not integrated | NEW INTEGRATION |
| Sanity CMS | Not integrated | NEW INTEGRATION |

### 🟢 Low Priority (Phases 4–5)

| Gap | Existing | Action |
|-----|----------|--------|
| Reels models | Not in schema | NEW MODELS |
| Mux video streaming | Not integrated | NEW INTEGRATION |
| ElevenLabs AI voice | Not integrated | NEW INTEGRATION |
| Scale optimisation | Not applicable | OPTIMISE |

---

## Phase 0 — Portal MVP (Jul 1–21)

**Goal:** Portal live. Email capture working. Discovery Calls booking via Calendly.
**Target:** 50 portal completions · 20 email captures · 10 Discovery Calls booked

### Week 1 (Jul 1–6): Foundation

#### Task 0.1 — Database schema overhaul
- [ ] Add new Prisma models to `packages/db/prisma/schema.prisma`:
  - `UserPortalData` — chakra_selected, archetype_selected, tarot_card, tarot_theme, intention_text, q1–q7 answers, computed scores, profile_result, portal_completed_at
  - `Booking` — user_id, practitioner (archana/sejal), service_type, booking_datetime, duration_minutes, status, amount_paid, razorpay_payment_id, zoom_link
  - `Session` (therapy) — booking_id, user_id, practitioner, session_date, key_themes[], practices_assigned[], next_session_recommendation, distress_flag, recording_url
  - `Package` — user_id, package_type (3/6/12 session), sessions_total, sessions_used, amount_paid, expires_at
  - `Subscription` — user_id, plan, amount, start_date, next_billing_date, razorpay_subscription_id, status
  - 7 reference tables: `ChakraReveal`, `ArchetypeReveal`, `TarotTheme`, `ChartPrediction`, `PatternQuestion`, `PatternScoring`, `PatternProfile`
- [ ] Run `pnpm db:migrate`
- [ ] Create seed script at `packages/db/prisma/seed.ts` with reference table data (7 chakras, 6 archetypes, 22 tarot cards → 7 themes, 36 chart predictions, 7 pattern questions, 28 scoring rules, 6 profile maps)

#### Task 0.2 — Infrastructure setup
- [ ] Set up Supabase project (Mumbai region) — auth, DB, RLS policies
- [ ] Configure Prokerala API account + test endpoint
- [ ] Configure Google Places API (restrict to domain)
- [ ] Set up n8n self-hosted (DigitalOcean or local Docker)
- [ ] Set up Calendly account (Phase 0 — free calls)
- [ ] Set up ConvertKit account + email sequences
- [ ] Set up Razorpay account (sandbox)
- [ ] Create `.env` entries for all new services

#### Task 0.3 — Shared types update
- [ ] Add types to `packages/types/src/index.ts`:
  - Portal data types (PortalStep, ChakraType, ArchetypeType, TarotTheme, ProfileResult, etc.)
  - Booking/session types
  - Reference table types
  - API response types for portal endpoints

### Week 2 (Jul 7–13): Portal Steps 1–5

#### Task 0.4 — Portal routing & layout
- [ ] Create new route group `(portal)/` with linear 8-step layout
  - Layout: full-screen dark theme (`#1A0F3C`), no nav, no footer, progress dots at bottom
  - Middleware: no auth required (lead capture happens during portal)
  - Step persistence: localStorage + Supabase partial saves per step
- [ ] Create shared portal state management (Zustand store for step data)
- [ ] Create `StepIndicator` component (8 dots, current step highlighted)

#### Task 0.5 — Step 1: Breath Gateway
- [ ] Full-screen dark background (`#1A0F3C`)
- [ ] GSAP breathing circle animation (expand/contract, 3 cycles)
- [ ] INHALE/EXHALE text fade in/out
- [ ] Optional 432hz tone via Web Audio API or Howler.js
- [ ] "Good. You're here. Fully." → CTA "Begin Your Journey →"
- [ ] No DB write (experiential only)

#### Task 0.6 — Step 2: Chakra Frequency Test
- [ ] 7 chakra buttons with hover → sound + glow (GSAP orb animation)
- [ ] Pre-recorded frequency .mp3 files (396hz / 417hz / 528hz / 639hz / 741hz / 852hz / 963hz)
- [ ] After selection: chakra name + symbol + "This chakra is blocked" reveal
- [ ] DB: write `chakra_selected` to `user_portal_data`

#### Task 0.7 — Step 3: Archetype Test
- [ ] 6 icon cards — Sword, Heart, Eye, Star, Hands, Flame
- [ ] GSAP card flip/reveal animation on selection
- [ ] After selection: archetype name + gift + wound + how it shows up
- [ ] DB: write `archetype_selected` to `user_portal_data`

#### Task 0.8 — Step 4: Tarot Card Pull
- [ ] Deck of 22 face-down cards (Major Arcana), shuffles + fans across screen
- [ ] CSS 3D flip on click → card art revealed + theme message
- [ ] Random selection from 22 cards mapped to 7 themes
- [ ] DB: write `tarot_card` + `tarot_theme` to `user_portal_data`

#### Task 0.9 — Step 5: Intention Setting
- [ ] Styled text input + Web Speech API voice-to-text option
- [ ] "Continue quietly" skip link
- [ ] Confirmation screen: "We see you. We hear you."
- [ ] DB: write `intention_text` to `user_portal_data`

### Week 3 (Jul 14–21): Portal Steps 6–8 + Lead Flow

#### Task 0.10 — Step 6: Constellation Mirror
- [ ] DOB + time of birth + place of birth input (Google Places autocomplete)
- [ ] Server-side call to Prokerala Astrology API → sun/moon/rising signs
- [ ] Three.js star particle map (user's actual birth sky at coordinates)
- [ ] 3 planet reveals: Sun (gold), Moon (silver), Rising (purple) with predictions
- [ ] ★ EMAIL CAPTURE at peak emotional investment — before full chart reveal
- [ ] DB: write to `users` table (email, dob, tob, place, lat, lng, sun/moon/rising)

#### Task 0.11 — Step 7: Mind & Pattern Test
- [ ] 7 MCQs, one per screen, full dark starry bg, 4 gold glowing tiles
- [ ] Questions: Q1 Sleep · Q2 Mood · Q3 Nervous System · Q4 Relationships · Q5 Finances · Q6 Parents · Q7 Childhood
- [ ] JS scoring logic → compute nervous_system_score, relationship_score, childhood_score, financial_score
- [ ] Profile mapping → 1 of 6 outcomes (anxious_achiever / frozen_heart / wounded_warrior / silent_sufferer / lost_soul / awakening_one)
- [ ] DB: write q1–q7 answers + computed scores + profile_result

#### Task 0.12 — Step 8: Book Discovery Call
- [ ] Calendly embed (Phase 0) or Cal.com (Phase 1+)
- [ ] Pre-fill with name + email from portal data
- [ ] On booking: n8n webhook → WhatsApp to Sejal with profile summary
- [ ] DB: set `portal_completed_at` on `user_portal_data`
- [ ] Create ClickUp card "New Lead" via n8n

#### Task 0.13 — n8n Lead Automation (Workflow 1)
- [ ] Trigger: `user_portal_data.portal_completed_at` fires
- [ ] Actions: 1) Add to ConvertKit with tags (chakra, archetype, profile) 2) Create ClickUp "New Lead" 3) WhatsApp Sejal with profile summary 4) Start 7-day nurture email if no booking in 48h
- [ ] Output: Lead in CRM + WhatsApp notification to Sejal within 2 min

#### Task 0.14 — Portal edge services
- [ ] Build `POST /api/portal/step` — save partial portal data per step
- [ ] Build `GET /api/portal/step/:step` — resume portal from last saved step
- [ ] Build `POST /api/portal/complete` — finalize portal, trigger n8n
- [ ] Build `POST /api/astrology/chart` — Prokerala API proxy (server-side)
- [ ] Build `GET /api/reference/:table` — serve reference table content

#### Task 0.15 — Auth setup (minimal — leads don't need login)
- [ ] Portal is unauthenticated — anonymous lead capture
- [ ] After portal complete → create Supabase user (magic link) from captured email
- [ ] Post-portal login via Supabase Auth magic link only (no password)
- [ ] Migrate NextAuth → Supabase Auth (see Section 9 for full plan)

---

## Phase 1 — AI Companion (Jul 22–Aug 11)

**Goal:** Daily Dose live. Session workflow operational. First 10 paid clients.
**Target:** 10 paid service clients · Daily Dose delivered daily · AHI >80% no-override

### Week 1 (Jul 22–27): AHI Engine Foundation

#### Task 1.1 — Python FastAPI AHI microservice
- [ ] Create new `apps/ahi/` directory (Python FastAPI, separate from existing Fastify)
- [ ] Dependencies: fastapi, uvicorn, pydantic, httpx (Claude API client), supabase-py
- [ ] POST `/ahi/generate-dose` endpoint:
  - Input: user context object (profile_result, chakra, archetype, tarot_theme, moon_sign, days_in_journey, moon phase, last session notes)
  - Constructs AHI prompt → calls Claude API (claude-sonnet) → returns structured Daily Dose JSON
- [ ] POST `/ahi/generate-initial-plan` endpoint:
  - Generates first 7 days of Daily Doses when portal completed
  - Returns array of 7 daily prescriptions with modalities matched to profile

#### Task 1.2 — Daily Dose content library (human recordings)
- [ ] Archana records 52 Vedic insight clips (one per week of year) → upload to Cloudinary/R2
- [ ] Sejal records 7 somatic practice audios (one per practice type) → upload to Cloudinary/R2
- [ ] Create DB entries in reference tables for audio content

#### Task 1.3 — Daily Dose data models
- [ ] Add `DailyDoseOverride` model to Prisma — user_id, practice_type, instruction_text, starts_at, duration_days, source (session_id FK)
- [ ] Add `daily_doses` delivery tracking — user_id, date, content_type, content_ref, delivered_at, opened_at, completed_at, override_source

### Week 2 (Jul 28–Aug 4): Daily Dose Delivery

#### Task 1.4 — WhatsApp delivery via n8n
- [ ] Set up Meta Business API (or Twilio WhatsApp) — test messaging
- [ ] n8n CRON workflow (7am IST): fetch active users → call AHI → generate dose → send WhatsApp → log in DB
- [ ] Delivery tracking: opened_at (via link tracking), completed_at (user replies "Done")
- [ ] Fallback: email delivery if WhatsApp fails

#### Task 1.5 — Session workflow
- [ ] Calendly → Cal.com migration for paid sessions
- [ ] Razorpay payment link for first session (manual via Sejal WhatsApp)
- [ ] Create booking → payment → confirmation flow in n8n
- [ ] Post-session: structured notes form → AHI ingests → updates Daily Dose
- [ ] n8n Workflow 2: Razorpay confirmed → create booking → send invoice + confirmation

#### Task 1.6 — AHI generates pre-session brief
- [ ] Endpoint: GET `/ahi/pre-session-brief/{user_id}`
- [ ] Returns 1-page brief for practitioner: profile, chakra, archetype, intention, astro placements, previous session themes
- [ ] Sent to ClickUp card before session

### Week 3 (Aug 5–11): Practitioner Dashboard (MVP)

#### Task 1.7 — Practitioner dashboard (apps/web)
- [ ] New route: `/practitioner/` or `/dashboard/admin`
- [ ] Client list with profile_result, last session date, sessions remaining, current Daily Dose theme
- [ ] Upcoming sessions view (Cal.com integration)
- [ ] Session notes input form (structured: key themes / practices assigned / next session focus / distress flag)
- [ ] Daily Dose override control (manual per-user override)

#### Task 1.8 — n8n post-session workflow
- [ ] n8n Workflow 3: Cal.com "booking.completed" webhook → 2h timer → remind practitioner for notes → after notes → send Session Summary to client → AHI ingests
- [ ] Session Summary email template with: key themes, 3 assigned practices, next steps

#### Task 1.9 — Auth migration (full)
- [ ] Complete Supabase Auth migration (see Section 9)
- [ ] Remove NextAuth dependency, password fields
- [ ] Update middleware for Supabase session
- [ ] Update Fastify auth plugin for Supabase JWT

---

## Phase 2 — Community (Aug 12–25)

**Goal:** Community platform live. First live circle hosted. ₹999/month memberships.
**Target:** 50 community members · 20 paid · ₹20K MRR

### Week 1 (Aug 12–18): Community Foundation

#### Task 2.1 — Community data models
- [ ] Add to Prisma: `CommunityMember` (user_id, tier free/paid, joined_at, last_active_at, circles_attended, challenges_completed)
- [ ] Add to Prisma: `LiveCircle` (id, host, topic, scheduled_at, zoom_link, attendee_count, recording_url)
- [ ] Add to Prisma: `Challenge` (id, title, duration_days, profile_targets[], chakra_targets[], start_date)
- [ ] Add to Prisma: `ChallengeParticipation` (user_id, challenge_id, enrolled_at, days_completed, completed_at)

#### Task 2.2 — Community section (web + dashboard)
- [ ] New route: `/community` (public) and `/dashboard/community` (member)
- [ ] Community feed: Daily Dose of the day, Reel of the day, Weekly circle schedule
- [ ] Challenge tracker: active challenges, daily task, completion progress
- [ ] Live circle listing: upcoming circles, RSVP, join Zoom, past recordings

#### Task 2.3 — WhatsApp broadcast → Meta API automation
- [ ] Migrate from WhatsApp broadcast list to Meta Business API
- [ ] n8n workflow for Daily Dose bulk delivery
- [ ] Welcome message sequence: Day 1 (intention prompt) → Day 3 (circle invite) → Day 5 (challenge enroll) → Day 7 (upgrade offer)

### Week 2 (Aug 19–25): Community Monetization

#### Task 2.4 — Live circles (first 2 hosted)
- [ ] Archana hosts first Vedic astrology circle (bi-weekly, 45 min Zoom)
- [ ] Sejal hosts first healing circle (bi-weekly, 45 min Zoom)
- [ ] n8n: 24h reminder + post-circle recording upload to Mux
- [ ] Recording made available in community library

#### Task 2.5 — 7-day healing challenge (first run)
- [ ] "7 Days of Root Chakra Healing" challenge
- [ ] Daily WhatsApp task at 7am IST for 7 days
- [ ] Community thread for sharing
- [ ] Profile badge on completion

#### Task 2.6 — ₹999/month subscription
- [ ] Razorpay recurring subscription integration
- [ ] Upgrade CTA: Day 14 of free tier / after first circle / after first challenge
- [ ] Paid tier unlocks: private circles (6 max), 2 Daily Doses/day, monthly crystal, priority booking
- [ ] n8n: payment confirmed → upgrade tier → unlock features → Sejal welcome voice note
- [ ] Subscription lifecycle: renewal reminder, retry on failure, downgrade after 3 failed retries

#### Task 2.7 — Community engagement tracking
- [ ] Mixpanel events: community_joined, circle_attended, challenge_enrolled, challenge_completed, tier_upgraded
- [ ] n8n: track circles_attended, challenges_completed per user
- [ ] Community → Service upgrade trigger: 7+ Daily Doses + 2+ circles → Sejal personal upgrade message

---

## Phase 3 — Ecommerce (Aug 26–Sep 8)

**Goal:** Crystal shop live. First 20 orders. Shiprocket fulfillment live.
**Target:** 20 orders · ₹1,800 AOV · Zero fulfillment errors

### Week 1 (Aug 26–31): Shop Infrastructure

#### Task 3.1 — Crystal product data models
- [ ] Add to Prisma: `CrystalProduct` extending/supplementing existing `Product` model:
  - chakra_association, healing_properties (JSONB), stock_quantity, weight_grams, origin, cloudinary_image_ids[]
- [ ] Seed 15-20 crystal SKUs from Archana's Jaipur catalog
- [ ] Product categories: Entry (₹350-800), Mid (₹800-2,000), Premium (₹2,000-6,000)

#### Task 3.2 — Razorpay checkout integration
- [ ] Migrate from Cashfree to Razorpay for all payment processing
- [ ] Cart + checkout flow: Next.js cart session → Razorpay checkout → order confirmation
- [ ] Payment methods: UPI, Cards, Net Banking, Wallets, COD (under ₹2,000)
- [ ] n8n Workflow: Razorpay webhook → create Shiprocket order → send confirmation email

#### Task 3.3 — Shiprocket fulfillment
- [ ] Shiprocket API integration for order fulfillment
- [ ] n8n: Razorpay confirmed → create Shiprocket shipment → tracking number stored
- [ ] Order status flow: PENDING → PAID → FULFILLED → SHIPPED → DELIVERED
- [ ] WhatsApp/SMS tracking notification to customer on dispatch

### Week 2 (Sep 1–8): Shop Experience

#### Task 3.4 — Profile-matched recommendations
- [ ] Dashboard widget: "This week, your [chakra] needs [crystal]"
- [ ] Product page badge: "Perfect for your [chakra] profile" (if logged in with portal data)
- [ ] Bundle products: "Crystal + 1 Healing Session — ₹X" (increases AOV)

#### Task 3.5 — Sanity CMS for crystal catalog
- [ ] Set up Sanity.io project → Sanity Studio for Archana to manage:
  - Crystal product metadata without touching code
  - Product images, descriptions, stock status
- [ ] GROQ queries from Next.js → server-side render product pages
- [ ] Archana training: how to add/edit products, mark stock status

#### Task 3.6 — Post-purchase content
- [ ] Each order email includes: Crystal activation PDF + corresponding healing audio from Sejal
- [ ] n8n post-purchase sequence: Day 1 (activation guide) → Day 7 (how's your practice?) → Day 14 (review request + 10% off)
- [ ] Cross-sell banner: "Pair your crystal with a healing session"

#### Task 3.7 — Inventory management
- [ ] Stock tracking in `CrystalProduct.stock_quantity`
- [ ] Auto-alert: if stock < 5 units → WhatsApp to Archana
- [ ] Backorder feature: show expected restock date
- [ ] Phase 0-1: Archana packs from Jaipur. Plan 3PL for 100+ orders/month.

---

## Phase 4 — Reels & Influencers (Sep 9–22)

**Goal:** Reels section live with 30+ videos. 5 influencer partnerships active.
**Target:** 30 Reels · 500 views/wk · 10 portal signups from influencer UTMs

### Week 1 (Sep 9–15): Reels Infrastructure

#### Task 4.1 — Reels data models
- [ ] Add to Prisma: `Reel` — id, title, creator_name, creator_handle, mux_asset_id, healing_modality, profile_tags[], chakra_tag, duration_seconds, published_at, approved_by
- [ ] Add to Prisma: `ContentView` — user_id, content_type, content_id, viewed_at, completion_percent

#### Task 4.2 — Mux video streaming setup
- [ ] Mux account + API keys
- [ ] Video upload pipeline: influencer submits → transcodes via Mux → approved by Sejal → published
- [ ] Mux Data for playthrough analytics
- [ ] GSAP vertical swipe transition for mobile Reels browsing

#### Task 4.3 — Reels section UI
- [ ] New route: `/reels` (public, SEO-indexed) and `/dashboard/reels` (personalized)
- [ ] Vertical swipe feed UI (Reels-style, 60-90 sec videos)
- [ ] Tagging: each Reel tagged with healing_modality + target_profile + chakra + duration_category
- [ ] Personalization: logged-in users see profile-matched Reels first

### Week 2 (Sep 16–22): Influencer Program

#### Task 4.4 — Creator submission portal
- [ ] `/influencer/submit` — form for influencers to submit Reels for review
- [ ] Upload via Mux direct upload
- [ ] Terms + guidelines acknowledgement

#### Task 4.5 — Sejal/Archana approval workflow
- [ ] Admin dashboard: pending Reels → preview → approve/reject with reason
- [ ] Rejection criteria: no diagnoses, no cure claims, no competitive brands, no political
- [ ] Once approved → published to /reels + featured in community feed

#### Task 4.6 — Influencer UTM tracking
- [ ] Each influencer gets unique UTM parameters
- [ ] Mixpanel: track influencer attribution → portal signups → Discovery Calls
- [ ] Incentive: top 10 creators/month → featured placement + 10% referral commission on Discovery Calls booked from their Reel UTM

#### Task 4.7 — SEO for Reels
- [ ] `/reels` page with `VideoObject` schema markup
- [ ] Target keywords: "somatic healing exercises", "chakra balancing techniques", "Vedic astrology for anxiety"
- [ ] Individual Reel pages for SEO indexing

---

## Phase 5 — Scale & Optimise (Sep 23–30)

**Goal:** Hit Sep 30 targets. Review metrics. Plan Q4.
**Target:** 100 Discovery Calls · 40 clients · ₹500K MRR · 1,000 portal completions · 200 community members

### Week 1 (Sep 23–30): Optimisation

#### Task 5.1 — Analytics review
- [ ] Mixpanel funnel review for all 6 phases:
  - Portal completion rate (target 35%)
  - Email capture rate (target 60% of Step 6 reach)
  - Discovery Call booking rate (target 25%)
  - Service conversion (target 40%)
  - Community activation (target 70%)
  - Community paid conversion (target 15%)

#### Task 5.2 — A/B test
- [ ] Test: portal Step 1 variant (current breath animation vs static page)
- [ ] Measure: drop-off at Step 1 → 2
- [ ] Hotjar heatmaps to identify drop points across all 8 steps

#### Task 5.3 — Conversion optimisation
- [ ] Exit-intent popup: "Don't lose your chart — enter email to get your report"
- [ ] Shorter portal test: 5-step variant (combine Steps 1-3)
- [ ] WhatsApp re-engagement for incomplete portals (n8n: 1h after drop-off at Step 2-5)

#### Task 5.4 — Q4 roadmap draft
- [ ] Mobile app (React Native Expo) — Phase 4 in PRD
- [ ] Recorded courses (Astrology ₹4,999, Somatic ₹5,999)
- [ ] Peer matching for community
- [ ] Associate healer onboarding
- [ ] Push notification infrastructure

#### Task 5.5 — Feature flags & cleanup
- [ ] Vercel Edge Config for feature flags (phase 0-5 rollouts)
- [ ] Remove old code: NextAuth, Cashfree references, unused routes
- [ ] Performance audit: Lighthouse scores >90 for all pages
- [ ] Security audit: Supabase RLS verification, DPDP compliance check

---

## 9. Auth Migration Strategy

**Current:** NextAuth v4 with JWT (30-day sessions), Google OAuth, Email magic link, Credentials (password).
**Target:** Supabase Auth with magic link only (no password, no Google OAuth initially).

### Why Migrate
- PRD specifies Supabase Auth as the auth system
- PRD says "no password auth" — magic link only
- Supabase RLS policies require Supabase Auth session
- Single auth system simplifies middleware, API, and JWT verification

### Migration Steps

#### Step 1 (Phase 0 — pre-portal): Dual auth
- Keep NextAuth for existing users
- New portal users get Supabase Auth magic link
- `User` model stores both `nextAuthId` and `supabaseUserId`
- Middleware checks both auth providers

#### Step 2 (Phase 0 — post-portal): Migration script
- Copy NextAuth users to Supabase Auth via admin API
- Map NextAuth sessions to Supabase sessions
- Run in dry-run mode first

#### Step 3 (Phase 1): Switch middleware
- Update `apps/web/src/middleware.ts` to use Supabase `getSession()`
- Update `apps/web/src/lib/session.ts` to use Supabase session
- Fastify auth plugin (`apps/api/src/plugins/auth.ts`): switch from `@panva/hkdf` + `jose` decryption to Supabase JWT verification (JWKS endpoint)

#### Step 4 (Phase 1): Deprecate NextAuth
- Remove NextAuth packages from dependencies
- Remove `CredentialsProvider` (no passwords)
- Remove Google OAuth if PRD confirms no social login
- Clean up User model: remove `passwordHash`, `googleId`
- Archive unused auth pages (register with password, etc.)

### Affected Files
| File | Change |
|------|--------|
| `apps/web/src/lib/auth.ts` | Replace with Supabase Auth config |
| `apps/web/src/middleware.ts` | Supabase `getSession()` instead of cookie check |
| `apps/web/src/lib/session.ts` | Supabase session helpers |
| `apps/web/src/app/api/auth/[...nextauth]/route.ts` | Replace with Supabase auth endpoints |
| `apps/web/src/app/(auth)/auth/login/page.tsx` | Magic link only, no password form |
| `apps/web/src/app/(auth)/auth/register/page.tsx` | Remove or redirect to portal |
| `apps/web/src/providers.tsx` | Replace SessionProvider with Supabase provider |
| `apps/api/src/plugins/auth.ts` | Supabase JWT verification |
| `packages/db/prisma/schema.prisma` | Remove Account/Session/VerificationToken, remove passwordHash/googleId from User |

---

## 10. Database Schema Overlay

### New Prisma Models (Add to `packages/db/prisma/schema.prisma`)

```prisma
// === PORTAL (Phase 0) ===
model UserPortalData {
  id                 String   @id @default(cuid())
  user               User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId             String   @unique
  chakraSelected     String?  // root|sacral|solar_plexus|heart|throat|third_eye|crown
  archetypeSelected  String?  // warrior|lover|sage|innocent|caregiver|creator
  tarotCard          String?  // Full card name
  tarotTheme         String?  // transformation|awakening|inner_work|power_will|love_relationships|surrender|purpose_path
  intentionText      String?  @db.Text
  q1Answer           String?  // A/B/C/D
  q2Answer           String?  // A/B/C/D
  q3Answer           String?  // A/B/C/D
  q4Answer           String?  // A/B/C/D
  q5Answer           String?  // A/B/C/D
  q6Answer           String?  // A/B/C/D
  q7Answer           String?  // A/B/C/D
  nervousSystemScore String?  // regulated|anxious|hyperactive|shutdown|fight
  relationshipScore  String?  // secure|people_pleasing|avoidant|repeating_patterns
  childhoodScore     String?  // secure|emotional_neglect|absent|wounded|parentified|lonely
  financialScore     String?  // secure|scarcity|self_sabotage|leaky_bucket
  profileResult      String?  // anxious_achiever|frozen_heart|wounded_warrior|silent_sufferer|lost_soul|awakening_one
  portalCompletedAt  DateTime?
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

// === BOOKING & SESSIONS (Phase 1) ===
model Booking {
  id               String   @id @default(cuid())
  user             User     @relation(fields: [userId], references: [id])
  userId           String
  practitioner     String   // archana | sejal
  serviceType      String   // discovery_call|astrology_reading|vastu_home|vastu_office|healing_session|somatic|trauma_release
  bookingDatetime  DateTime
  durationMinutes  Int
  status           String   @default("pending") // pending|confirmed|completed|cancelled|no_show
  amountPaid       Decimal  @db.Decimal(10, 2)
  razorpayPaymentId String?
  zoomLink         String?
  calendlyEventId  String?
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
  session          Session?
}

model Session {
  id                       String   @id @default(cuid())
  booking                  Booking  @relation(fields: [bookingId], references: [id])
  bookingId                String   @unique
  user                     User     @relation(fields: [userId], references: [id])
  userId                   String
  practitioner             String   // archana | sejal
  sessionDate              DateTime
  keyThemes                String[] // Array of themes from session notes
  practicesAssigned        String[] // Practices assigned during session
  nextSessionRecommendation String?  @db.Text
  distressFlag             Boolean  @default(false)
  recordingUrl             String?
  notesSubmittedAt         DateTime?
  createdAt                DateTime @default(now())
  updatedAt                DateTime @updatedAt
}

model Package {
  id            String   @id @default(cuid())
  user          User     @relation(fields: [userId], references: [id])
  userId        String
  packageType   String   // 3_session|6_session|12_session
  sessionsTotal Int
  sessionsUsed  Int      @default(0)
  amountPaid    Decimal  @db.Decimal(10, 2)
  purchasedAt   DateTime @default(now())
  expiresAt     DateTime?
}

// === COMMUNITY (Phase 2) ===
model CommunityMember {
  id                 String   @id @default(cuid())
  user               User     @relation(fields: [userId], references: [id])
  userId             String   @unique
  tier               String   @default("free") // free|paid
  joinedAt           DateTime @default(now())
  lastActiveAt       DateTime @default(now())
  circlesAttended    Int      @default(0)
  challengesCompleted Int     @default(0)
}

model Subscription {
  id                   String   @id @default(cuid())
  user                 User     @relation(fields: [userId], references: [id])
  userId               String   @unique
  plan                 String   // community_monthly
  amount               Decimal  @db.Decimal(10, 2)
  startDate            DateTime @default(now())
  nextBillingDate      DateTime
  razorpaySubscriptionId String?
  status               String   @default("active") // active|paused|cancelled|past_due
}

model LiveCircle {
  id               String   @id @default(cuid())
  host             String   // archana | sejal
  topic            String
  scheduledAt      DateTime
  zoomLink         String
  attendeeCount    Int      @default(0)
  recordingUrl     String?
  recordingAvailableAt DateTime?
  createdAt        DateTime @default(now())
}

model Challenge {
  id            String   @id @default(cuid())
  title         String
  durationDays  Int
  profileTargets String[] // Target profile types
  chakraTargets  String[] // Target chakras
  startDate     DateTime
  createdAt     DateTime @default(now())
}

model ChallengeParticipation {
  id             String   @id @default(cuid())
  user           User     @relation(fields: [userId], references: [id])
  userId         String
  challenge      Challenge @relation(fields: [challengeId], references: [id])
  challengeId    String
  enrolledAt     DateTime @default(now())
  daysCompleted  Int      @default(0)
  completedAt    DateTime?
  @@unique([userId, challengeId])
}

// === ECOMMERCE (Phase 3) ===
model CrystalProduct {
  id               String   @id @default(cuid())
  name             String
  slug             String   @unique
  chakraAssociation String?
  healingProperties Json?
  description      String?  @db.Text
  price            Decimal  @db.Decimal(10, 2)
  stockQuantity    Int      @default(0)
  weightGrams      Int?
  origin           String?
  cloudinaryImageIds String[]
  isActive         Boolean  @default(true)
  createdAt        DateTime @default(now())
  updatedAt        DateTime @updatedAt
}

// === REELS & CONTENT (Phase 4) ===
model Reel {
  id              String   @id @default(cuid())
  title           String
  creatorName     String
  creatorHandle   String?
  muxAssetId      String
  healingModality String   // somatic|astrology|breathwork|ayurveda|meditation|crystal
  profileTags     String[] // Target profile types
  chakraTag       String?
  durationSeconds Int
  isPublished     Boolean  @default(false)
  publishedAt     DateTime?
  approvedBy      String?  // sejal|archana
  createdAt       DateTime @default(now())
}

model ContentView {
  id                String   @id @default(cuid())
  user              User?    @relation(fields: [userId], references: [id])
  userId            String?
  contentType       String   // reel|article|circle_recording|almanac
  contentId         String
  viewedAt          DateTime @default(now())
  completionPercent Float?
}

// === REFERENCE TABLES (Phase 0) ===
model ChakraReveal {
  id         String @id @default(cuid())
  chakraName String @unique
  heading    String
  sub        String
  blockedText String @db.Text
  showsUpAs  String  @db.Text
}

model ArchetypeReveal {
  id         String @id @default(cuid())
  name       String @unique
  icon       String // sword|heart|eye|star|hands|flame
  gift       String @db.Text
  wound      String @db.Text
  showsUpAs  String @db.Text
}

model TarotTheme {
  id         String @id @default(cuid())
  themeName  String @unique
  message    String @db.Text
  cardNames  String[] // Cards belonging to this theme
}

model ChartPrediction {
  id             String @id @default(cuid())
  placementType  String // sun|moon|rising
  sign           String // aries|taurus|...|pisces
  predictionText String @db.Text
  @@unique([placementType, sign])
}

model PatternQuestion {
  id          String @id @default(cuid())
  questionId  String @unique // q1-q7
  questionText String @db.Text
  dimension   String // sleep|mood|nervous|relations|finances|parents|childhood
  options     Json   // {A: "...", B: "...", C: "...", D: "..."}
}

model PatternScoring {
  id             String @id @default(cuid())
  questionId     String // q1-q7
  answer         String // A/B/C/D
  dimension      String // nervous_system|relationship|childhood|financial
  dimensionValue String
  @@unique([questionId, answer])
}

model PatternProfile {
  id          String @id @default(cuid())
  profileName String @unique
  nsMatch     String
  relMatch    String
  childhoodMatch String
  profileText String @db.Text
}
```

### Models to Deprecate (NextAuth)
- `Account` — remove after auth migration
- `Session` — remove (NextAuth sessions)
- `VerificationToken` — remove
- `User.passwordHash` — remove field
- `User.googleId` — remove field

---

## 11. Dependencies to Install

### apps/web (new packages)
```bash
pnpm add three @react-three/fiber @react-three/drei   # 3D star map (Step 6)
pnpm add gsap @gsap/react                              # Portal animations (all steps)
pnpm add howler                                          # Web Audio (Step 1-2)
pnpm add @supabase/ssr                                   # Supabase auth helpers
pnpm add @supabase/auth-helpers-nextjs                   # Supabase-NextAuth bridge
pnpm add mixpanel-browser                                # Client analytics
pnpm add @sanity/client @sanity/image-url                # Sanity CMS
pnpm add @calcom/embed-react                             # Cal.com booking widget
pnpm add razorpay                                        # Payment gateway
```

### New app: ahi (Python FastAPI)
- Create `apps/ahi/` with `requirements.txt`:
  ```
  fastapi==0.111.0
  uvicorn==0.30.1
  pydantic==2.7.4
  httpx==0.27.0
  supabase-py==2.5.0
  python-dotenv==1.0.1
  ```
- Dependencies managed via pip/poetry, separate from pnpm

### Infrastructure / External
- n8n (self-hosted Docker or DigitalOcean)
- Cal.com (self-hosted for Phase 1+)
- Mux account
- Sanity.io project
- Mixpanel project
- ConvertKit account
- Meta Business API access (WhatsApp)
- Shiprocket account
- Prokerala API subscription
- Google Places API key
- ElevenLabs API (optional)

---

## 12. Risk Mitigation

### Priority Risks & Contingency

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **Portal drop-off >70%** | MEDIUM | HIGH (kills lead pipeline) | A/B test shorter portal (5 steps). Hotjar heatmaps. Exit-intent email capture. |
| **Practitioner bottleneck** | HIGH (by M3) | HIGH (revenue cap) | Pre-build waitlist. Group sessions (₹1,500/5-persons). Plan associate healers Q1 2027. |
| **WhatsApp delivery restrictions** | MEDIUM | HIGH (kills Daily Dose) | Email fallback. Push notifications in Phase 2. Never rely 100% on single channel. |
| **Prokerala API downtime** | LOW-MED | MEDIUM (breaks Step 6) | Cache responses per user. Fallback manual sign entry. Backup API (AstroSage). |
| **Auth migration breaks existing users** | MEDIUM | VERY HIGH | Dual auth during transition. Rollback plan documented. Test with 5 users before full cutover. |
| **Cashfree → Razorpay migration** | LOW | MEDIUM (payment outage) | Run both gateways for 1 week. No simultaneous active payments — migrate when zero pending. |
| **n8n self-hosted failure** | LOW-MED | MEDIUM (automations stop) | Health check alerts. Manual backup flows documented. Aayush on-call rotation. |
| **Data breach (DPDP liability)** | LOW | VERY HIGH | RLS on all tables. Encryption at rest. Quarterly audit. Cyber insurance by M2. |

---

## Summary: Phase vs PRD Section Mapping

| Phase | PRD Sections | New Models | New Integrations | n8n Workflows |
|-------|-------------|------------|------------------|---------------|
| 0 | 1 (Portal), 3 (Schema), 7.1 | 10 models (portal + reference) | Prokerala, Google Places, Calendly, ConvertKit | 1 (Lead capture) |
| 1 | 4 (AHI), 5 (Practitioner) | 3 models (DailyDoseOverride, Booking, Session, Package) | Claude API, Meta WhatsApp, Razorpay, Cal.com | 3 (Dose, Payment, Session) |
| 2 | 4.5 (Community) | 4 models (CommunityMember, Subscription, LiveCircle, Challenge, ChallengeParticipation) | Razorpay recurring, Zoom | 2 (Circle, Upgrade) |
| 3 | 4.3 (Crystal Shop) | 1 model (CrystalProduct) | Shiprocket, Sanity CMS, Razorpay checkout | 2 (Fulfillment, Post-purchase) |
| 4 | 4.2 (Reels) | 2 models (Reel, ContentView) | Mux, ElevenLabs | 1 (Reel approval) |
| 5 | 7.2 (Metrics) | None | Mixpanel, Hotjar | Review & optimise |

**Total new Prisma models:** ~20 (10 core + 4 community + 1 ecom + 2 content + 7 reference)
**Total new n8n workflows:** ~10
**Total new integrations:** ~15
**Timeline:** 92 days (Jul 1 – Sep 30)
