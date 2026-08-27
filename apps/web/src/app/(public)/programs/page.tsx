import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BeginCtaBand,
  EditorialHero,
  EditorialPage,
  EditorialSection,
} from "@/components/marketing/EditorialShell";

export const metadata: Metadata = {
  title: "Programmes — Transformation Stories",
  description:
    "Named transformations with AUMVEDA — regulate your nervous system, restore sleep, release patterns — with clear practices and outcomes.",
};

const PROGRAMMES = [
  {
    title: "Regulate Your Nervous System",
    span: "30 days",
    forWhom: "High-functioning minds that cannot downshift. Anxiety that looks like success.",
    transformation:
      "From constant vigilance to a body that can rest without collapsing — so insight has somewhere safe to land.",
    practices: [
      "Daily Dose breath and somatic micro-practices",
      "1:1 check-ins with Sejal",
      "Optional chart orientation with Archana",
    ],
    outcomes: [
      "Shorter recovery from stress spikes",
      "Clearer sleep onset",
      "A practice you can keep after day 30",
    ],
    img: "/marketing/meditation.jpg",
  },
  {
    title: "Restore Deep Sleep",
    span: "21 days",
    forWhom: "People who fall asleep late, wake wired, or treat rest like a luxury they earn.",
    transformation:
      "From negotiating with the night to a wind-down ritual the nervous system recognises.",
    practices: [
      "Evening Dose sequences",
      "Breath and sound protocols",
      "Vastu / room rhythm notes when relevant",
    ],
    outcomes: [
      "More consistent sleep window",
      "Less midnight rumination",
      "Morning clarity without force",
    ],
    img: "/marketing/ritual.jpg",
  },
  {
    title: "Release What Loops",
    span: "45 days",
    forWhom: "Breakups, grief, or habit loops that coaching alone could not close.",
    transformation:
      "From replaying the story to metabolising it — body, meaning, and daily return.",
    practices: [
      "Somatic and hypnotherapy-informed sessions with Sejal",
      "Karmic / pattern framing with Archana where useful",
      "Journal and Dose continuity",
    ],
    outcomes: [
      "Less compulsive mental replay",
      "Softer relationship to triggers",
      "A forward practice, not only insight",
    ],
    img: "/marketing/herbs.jpg",
  },
  {
    title: "Unwind the Overachiever",
    span: "30 days",
    forWhom: "Leaders and creators whose outer life works while the inner system stays on.",
    transformation:
      "From productivity as identity to presence as capacity — without losing excellence.",
    practices: [
      "Boundary and breath work",
      "Daily Dose personalised by AHI",
      "Discovery-aligned 1:1 pacing",
    ],
    outcomes: [
      "Cleaner work/rest edges",
      "Fewer cortisol-driven decisions",
      "A rhythm that survives busy seasons",
    ],
    img: "/marketing/founders.jpg",
  },
];

export default function ProgramsPage() {
  return (
    <EditorialPage>
      <EditorialHero
        eyebrow="Programmes · Transformation"
        title={
          <>
            Not products.
            <span className="italic"> Named change.</span>
          </>
        }
        lede="Each programme is a transformation story: who it is for, what shifts, which practices hold you, and what you should feel by the end — not a feature list."
      />

      <EditorialSection eyebrow="How to read this" title="Story first. Price later.">
        <p className="av-lede max-w-[60ch] text-mute">
          Commerce comes after trust. Here we name the work. Fit is confirmed on a
          Discovery Call after your portal decode — so nothing is sold into the wrong
          nervous system.
        </p>
        <Link
          href="/services"
          className="mt-8 inline-flex text-[11px] uppercase tracking-[0.28em] text-gold hover:text-night"
        >
          See the full journey →
        </Link>
      </EditorialSection>

      {PROGRAMMES.map((p, i) => (
        <section key={p.title} className="border-b border-stone">
          <div className="av-wide av-gutter av-section-y grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
            <div className={`relative aspect-[4/5] overflow-hidden lg:col-span-5 ${i % 2 === 1 ? "lg:order-2" : ""}`}>
              <Image
                src={p.img}
                alt=""
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
            </div>
            <div className={`space-y-8 lg:col-span-7 ${i % 2 === 1 ? "lg:order-1" : ""}`}>
              <div>
                <p className="text-[11px] uppercase tracking-[0.28em] text-gold">{p.span}</p>
                <h2 className="av-title mt-4 text-night">{p.title}</h2>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.22em] text-mute">Who it is for</p>
                <p className="av-lede text-ink-text">{p.forWhom}</p>
              </div>
              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-[0.22em] text-mute">
                  Expected transformation
                </p>
                <p className="av-lede text-mute">{p.transformation}</p>
              </div>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-mute">Practices</p>
                  <ul className="mt-3 space-y-2 text-[15px] leading-[1.8] text-ink-text">
                    {p.practices.map((x) => (
                      <li key={x} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-[11px] uppercase tracking-[0.22em] text-mute">Outcomes</p>
                  <ul className="mt-3 space-y-2 text-[15px] leading-[1.8] text-ink-text">
                    {p.outcomes.map((x) => (
                      <li key={x} className="flex gap-3">
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" aria-hidden />
                        {x}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <Link
                href="/step-1"
                className="inline-flex text-[11px] uppercase tracking-[0.28em] text-gold hover:text-night"
              >
                Begin toward this work →
              </Link>
            </div>
          </div>
        </section>
      ))}

      {/* Structured Transformation Tiers from Previous Site */}
      <EditorialSection
        id="protocols"
        eyebrow="Structured Arcs"
        title="Core Synthesis Protocols"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
          {[
            {
              title: "The 21-Day Synthesis",
              desc: "A rapid immersion into the Aumveda methodology for immediate nervous system and karmic reset.",
              price: "₹45,000",
              tag: "Most Popular",
              features: [
                "Daily 1:1 sessions with Sejal & Archana",
                "Custom 528 Hz binaural audio protocol",
                "Astrology & chart decode",
                "Journal & daily progress score",
              ],
            },
            {
              title: "The Cosmic Alignment",
              desc: "A 3-month deep dive into your psychological, somatic, and celestial architecture.",
              price: "₹1,20,000",
              tag: "Deep Transformation",
              features: [
                "90-day guided transformation",
                "Residential/commercial Vastu audit",
                "Kundli + Tarot deep analysis",
                "Monthly retreats & direct access",
              ],
            },
            {
              title: "Executive Sanctuary",
              desc: "Bespoke high-performance wellness and spatial energetics for founders and leaders.",
              price: "Custom",
              tag: "Elite",
              features: [
                "Executive neuro-somatic coaching",
                "Workspace Vastu restructuring",
                "Bioresonance frequency harmonization",
                "Stamina & focus metrics",
              ],
            },
          ].map((program) => (
            <div
              key={program.title}
              className="rounded-3xl border border-stone bg-sand/30 p-8 flex flex-col justify-between space-y-6 hover:border-gold transition-all duration-300 shadow-sm"
            >
              <div className="space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-gold/10 text-gold text-[10px] font-black uppercase tracking-widest">
                  {program.tag}
                </div>
                <h3 className="font-serif text-2xl text-night">{program.title}</h3>
                <p className="text-sm text-mute leading-relaxed">{program.desc}</p>
                <ul className="space-y-2 pt-2 text-xs text-ink-text border-t border-stone/50">
                  {program.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="text-gold font-bold">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-6 border-t border-stone flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-mute block">Starting at</span>
                  <span className="font-serif text-2xl font-bold text-night">{program.price}</span>
                </div>
                <Link
                  href="/contact"
                  className="rounded-xl px-4 py-2 bg-night hover:bg-black text-parchment text-xs font-bold transition-all"
                >
                  Inquire →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </EditorialSection>

      <BeginCtaBand
        title="Programmes follow fit — not impulse."
        body="Decode in the portal. Meet on a Discovery Call. Then we place you in the right arc."
      />
    </EditorialPage>
  );
}
