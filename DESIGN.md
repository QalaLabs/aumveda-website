# AUMVEDA Design System

**Language:** Sacred Luxury × Clinical Confidence  
**Status:** LOCKED — Jul 2026  
**Rule:** Codebase = infrastructure only. This file = visual source of truth.

---

## Brand feeling

Sacred · Premium · Scientific · Human · Calm · Personal · Timeless

**Not:** astrology marketplace · yoga app · SaaS dashboard · hospital site · generic wellness landing

---

## Philosophy

Emotion of luxury hospitality (Aman) + trust of clinical products + spirituality without clichés + premium without showing wealth.

Every screen answers **one** question:

| Surface | Question |
|---------|----------|
| Homepage | Why trust us? |
| Portal | What should I do today? |
| Journal | How do I feel? |
| Discovery Call | Am I ready? |
| Checkout | Can I trust this purchase? |
| Dashboard | What is my practice today? |

---

## Product metaphor

**Not a website. A digital luxury retreat.**

When the visitor leaves, they should feel: *“I did not visit a site — I experienced a healing space.”*

---

## Homepage (non-negotiable)

Does **not** dump features or sell like ecommerce. Makes visitor feel: *“These people understand me.”*

Within 5 seconds:

1. Who is AUMVEDA  
2. Why different  
3. Why trust  
4. What next  

**Hero formula only:**

```
AUMVEDA
Your Daily Dose of Healing
Mother–Daughter Neuro-Vedic Healing
[ Begin Your Journey ]
```

One CTA in first viewport. No cards. No chakra icons. No dashboard chrome.

**Scroll architecture** — each beat ≈ one viewport:

1. Night hero (formula + breathing light)  
2. Cinematic founder photograph  
3. One story line  
4. Healing philosophy  
5. Daily Dose  
6. Services (quiet, editorial — not a grid dump)  
7. Discovery Call  
8. Testimonials (editorial quotes — not card walls)  
9. Footer  

Primary action throughout: Begin / Book Discovery → `/step-1`.

---

## Inspiration mix (weighted — synthesize, don’t copy)

| Weight | Source | Steal |
|--------|--------|-------|
| **40%** | **Aman / Six Senses** | Silence, restraint, photo as proof, expensive emptiness |
| **25%** | **Apple** | Hero simplicity, one composition, one CTA |
| **15%** | **Oura** | Personal journey pacing, progressive disclosure |
| **10%** | **Calm** | Emotional pacing, regulate-before-ask |
| **10%** | **Sidewave craft only** | Full-viewport storytelling, motion hierarchy, editorial type scale |

**Reference library (not weight leaders):** Aesop, Hermès, Loewe, COS · WHOOP, Headspace, Levels, Eight Sleep · Kinfolk, Monocle, NOWNESS · Stripe, Linear, Notion.

**Do not become:** Sidewave/Loook/Hubtown agency cocktail · cosmic purple WebGL · B2B SaaS · real-estate deck.

---

## Ban list

- Galaxy / cosmic gradient backgrounds  
- Floating chakra icons everywhere  
- AI spiritual illustrations  
- Neon gradients  
- Glass on content cards  
- Stats strips / feature card walls on homepage  
- “Dr.” for Sejal Jain  
- Teal clinical marketing as primary identity  

## Prefer

Natural light · candlelight · linen · brass · paper · texture · silence · breathing space · cinematic photography of real people/places

---

## Color tokens

| Token | Hex | Role |
|-------|-----|------|
| `--av-night` | `#1A0F3C` | Primary dark surface |
| `--av-ink` | `#0B0720` | Deepest canvas |
| `--av-gold` | `#C9A84C` | Sole accent / primary CTA |
| `--av-gold-soft` | `#E8D5A3` | Soft gold on dark text |
| `--av-parchment` | `#F7F1E8` | Light reading canvas |
| `--av-stone` | `#E8E2D9` | Borders on light |
| `--av-ink-text` | `#1C1917` | Body on parchment |
| `--av-mute` | `#78716C` | Secondary text |
| `--av-sage` | `#4A6B5C` | Success / regulated |
| `--av-rose` | `#8B5A5A` | Soft alert (never panic red walls) |

**Contrast (WCAG):** Gold on Night ≈ 7.8:1 (AAA). Night on Parchment ≈ 15.9:1. Do not use gold text on parchment for body.

Chakra hues: portal step only — never marketing chrome.

---

## Typography

| Role | Family | Notes |
|------|--------|-------|
| Display | Fraunces | Editorial, warm; brand & H1 |
| Body / UI | Source Sans 3 | Clinical clarity |
| Mono | JetBrains Mono | Scores, prices only |

Scale: 12 / 14 / 16 / 18 / 24 / 32 / 48 / 64  
Headings: `text-wrap: balance` · Body max `65ch` · Scores: `tabular-nums`

---

## Spacing · Radius · Elevation

- Grid: 4 / 8 pt (`4 8 12 16 24 32 48 64 96 128`)  
- Section Y: mobile 48–64 · desktop 80–120  
- Content max: ~1120px  
- Radius: sm 8 · md 12 · lg 16 · pill 999 (primary CTA only)  
- Shadows: layered soft tokens only — no `shadow-2xl` marketing blobs  
- Glass: overlays/nav ≤12% white — never content cards  

---

## Motion

Motion = regulation. Else cut.

| Tier | Duration | Use |
|------|----------|-----|
| Ritual | 400–800ms / breath-timed | Portal breath, tarot, constellation |
| Standard | 150–300ms ease-out | Modals, steps |
| Micro | 50–120ms | Hover, press `scale(0.97)` |

`--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`  
Transform/opacity only. Honor `prefers-reduced-motion`.

---

## Components

Keep shadcn/Radix. Map to tokens above.  
Icons: Lucide 1.5 stroke, monochrome.  
Photography > illustration. Founders real when available.

---

## Accessibility

- Focus-visible gold ring on night / night ring on parchment  
- Touch ≥44px  
- Semantic HTML first  
- Captions/transcripts for dose audio  
- Never color-only meaning for chakras  

---

## Quality gate

Before shipping any UI: *Would this feel worthy of a premium, globally recognized wellness brand — and still unmistakably AUMVEDA?*

If no → redesign.
