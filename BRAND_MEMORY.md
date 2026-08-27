# AUMVEDA Brand Memory (from Downloads/Aumveda files — Jun 2026)

**Source of truth for this UI.** Ingested Jul 24 2026. Updated Aug 2026.

## Non-negotiable corrections
- Founders: **Archana Jain** (mother, Jaipur) + **Sejal Jain** (daughter, Mumbai)
- Sejal is **NOT** a doctor — never "Dr. Sejal"
- Sejal roles: Healing Facilitator & Wellness Coach (CBT-informed, hypnotherapy, sound, vagus, breathwork, somatic) — not "Clinical Psychologist" / not Oxford neuroscientist fiction
- Archana: Vedic Practitioner & Healer (Vastu, Astrology, Tarot, karmic work, ritual)
- Locations: **Jaipur · Mumbai · Online** — not Kerala sanctuary / London HQ
- Tagline: **Your Daily Dose of Healing**
- Positioning: Mother–Daughter Neuro-Vedic Healing / Eastern + Western held together
- Primary CTA: **Begin Your Journey** → Discovery / portal
- Product reality: Portal (8 steps) → AHI Daily Dose (5–15 min) → Discovery Call → 1:1 / Community / Shop
- Ban: fake founder names, invented Kerala Panchakarma programs (Anantam/Nidra/Prakriti), "no app" framing for Daily Dose, Dr. prefix, galaxy/cosmic clutter

## Navigation & UI Rules
- **8-Step Portal**: Must ALWAYS have a prominent **"Skip to Home →"** button on every step (`/step-1` to `/step-8`) in `PortalShell.tsx` linking to `/`.
- **Homepage Structure & Video Animation**:
  - `CinematicPreloader.tsx`: Uses `/story/beat0-arrival.mp4` with pulsing ॐ medallion, frequency alignment progression (0% to 100%), and "Skip Intro" option.
  - `MasterFilm.tsx` & `SceneCanvas.tsx`: Continuous fixed video scrub background with seek-coalescing and direct blob fallback, composited with 3D mist and lighting.
  - `FloatingNav.tsx`: Includes top golden scroll-progress bar across window header and an interactive right-hand vertical milestone rail (`01 Hero` through `11 Insights`).
  - Narrative Sections: Complete 11-section editorial flow (01 Hero, 02 Origin, 03 Philosophy, 04 Daily Dose, 05 Journey, 06 Healers, 07 Services, 08 Crystals, 09 Discovery, 10 Reflections, 11 Insights, and HomeFooter).
- **Client/Server Module Isolation**: Client components must import shared types and pure helpers from `@/lib/product-types` — never from `@/lib/product-service` or `@aumveda/db` to avoid bundling native Node modules (`fs`, `net`, `tls`, `dns`).
- **Selection State & Locking**: `SelectionProvider` accepts optional item `id` in `lock(id)` to prevent async state race conditions during immediate click-to-lock interactions.
- **Theme & Toasts**: App defaults to parchment light aesthetic (`--av-parchment`). UI components such as Sonner Toaster must stay pinned to `theme="light"` unless a full dark token system is explicitly mounted.

## Infrastructure & Hosting
- **Runtime DB Adapter**: `@prisma/adapter-pg` over SSL port `5432` (`DIRECT_URL`) for Hostinger shared/cloud hosting compatibility (avoids Linux kernel `timer_create` panic).
- **Process Manager**: PM2 cluster mode via `ecosystem.config.js` or hPanel Node.js Application Manager with startup file `server.js`.
- **Cloud Run Deployment**: Containerized Next.js standalone build via `Dockerfile`, `cloudbuild.yaml`, and automated `.github/workflows/deploy-cloudrun.yml`.
- **Git Repositories**:
  - Primary: `https://github.com/QalaLabs/aumveda-website.git`
  - Upstream / UI: `https://github.com/aumvedabyarchanajain-ui/Spiritual-Healing-App.git`
  - SHA 2: `https://github.com/QalaLabs/SHA2.git`
- **Branch Strategy & Alignment**: All feature/deployment branches (`main`, `master`, `phase/1-auth-onboarding`, `claude/peaceful-napier-c7867e`) merged and aligned to `main`.

## Visual (PRD + Design)
- Night `#1A0F3C` · Gold `#C9A84C` · Parchment warmth
- Feel: digital luxury retreat / Sacred Luxury × Clinical Confidence

