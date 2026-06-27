# AGENTS.md — Aumveda Project Memory

## Session Context (Jun 25, 2026)

### What We Did
- 📖 Analyzed the full product requirements document `AUMVEDA_Full_PRD_v3_June2026.docx` containing the comprehensive technical specifications for all 5 platform pillars.
- 📝 Created a detailed [implementation_plan.md](file:///C:/Users/aashi/.gemini/antigravity/brain/ba6769c4-1864-4b92-8696-de30e614cef1/implementation_plan.md) in the agent's brain directory.
- ⚙️ Documented the technical roadmap for the remaining phases (Phase 1–5), including the FastAPI AHI Companion Engine, n8n workflow routing, Razorpay checkout migration, and Mux streaming Reels.
- 🔒 Outlined strict DPDP Act 2023 compliance procedures (Mumbai region ap-south-1 locking, explicit consent checklists, and anonymization pathways).

### Key Decisions
- **NextAuth Deprecation:** NextAuth will be fully deprecated and replaced by Supabase Auth (magic-link/OTP only, credentials/password login will be removed).
- **Payment Provider Transition:** Cashfree references will be completely removed and replaced by Razorpay for crystal checkout, 1:1 sessions, and subscriptions.
- **Vastu Design Integration:** Visual progress badges and the Daily Dose CTA must occupy the upper-right (Northeast) quadrant of dashboards.

## Session Context (Jun 24, 2026)


### What We Did
- ✅ Completed Phase 0 portal build: 8 steps (Breath → Chakra → Archetype → Tarot → Intention → Constellation → Pattern Test → Booking)
- ✅ Fixed Prisma schema: added ContentView, Reel models; fixed Challenge relation
- ✅ Fixed build: removed duplicate next-auth types, fixed ProfileResult type
- ✅ Updated homepage CTAs to link to `/step-1`
- ✅ Set up local PostgreSQL via Docker (`aumveda-pg` container, port 5432)
- ✅ `pnpm db:migrate` — all migrations applied (42 tables)
- ✅ `pnpm db:seed` — all reference tables populated (7 chakras, 6 archetypes, 7 tarot themes, 36 chart predictions, 7 pattern questions, 28 scoring rules, 6 profile maps)
- ✅ Built Phase 1: AHI microservice (`apps/ahi/`), practitioner dashboard (`/practitioner/*`), API routes, Prisma models (DailyDoseOverride, DailyDoseDelivery), auth migration starter
- ✅ Full Next.js build passes (83 routes, clean)

### Blocked → Resolved
- ~~Supabase project credentials stale~~ → Using local PostgreSQL Docker container
- ~~`prisma db:migrate` fails~~ → Migration + seed both successful locally

### How to Use Local DB
```bash
docker start aumveda-pg          # Start PostgreSQL
pnpm db:migrate                  # Apply migrations (already done)
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
- PostgreSQL runs locally in Docker; Supabase used only for Auth client (NEXT_PUBLIC_* vars)

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
