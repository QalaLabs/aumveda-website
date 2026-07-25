import type { Metadata } from "next";
import Link from "next/link";
import {
  BeginCtaBand,
  EditorialHero,
  EditorialPage,
  EditorialSection,
} from "@/components/marketing/EditorialShell";

export const metadata: Metadata = {
  title: "Services — The Healing Journey",
  description:
    "From Discovery Call to Healing Blueprint and ongoing practice — how AUMVEDA holds transformation with Archana and Sejal.",
};

const JOURNEY = [
  {
    n: "01",
    t: "Journey",
    d: "You arrive with a pattern — sleep, stress, relationship, purpose. We do not rush to sell. We orient.",
  },
  {
    n: "02",
    t: "Discovery Call",
    d: "About fifteen quiet minutes with Sejal or Archana. Listening first. Sensing fit. No pressure.",
  },
  {
    n: "03",
    t: "Assessment",
    d: "The portal decode — breath, chakra, archetype, intention, chart, pattern — becomes your living map.",
  },
  {
    n: "04",
    t: "Healing Blueprint",
    d: "AHI and practitioner insight shape a Daily Dose and session plan matched to your nervous system and story.",
  },
  {
    n: "05",
    t: "Programme",
    d: "1:1 sessions, structured programmes, or community circles — chosen for depth, not catalogue size.",
  },
  {
    n: "06",
    t: "Transformation",
    d: "Return. Measure in sleep, breath, belonging — not streak theatre. Practice that stays.",
  },
];

export default function ServicesPage() {
  return (
    <EditorialPage>
      <EditorialHero
        eyebrow="Services · Path"
        title={
          <>
            Not a menu.
            <span className="italic"> A journey.</span>
          </>
        }
        lede="AUMVEDA is not priced like a spa menu. It is a sequence: discovery, assessment, blueprint, practice — held by a Vedic practitioner and a healing facilitator who work as one lineage."
      />

      <EditorialSection
        id="journey"
        eyebrow="How care moves"
        title="From curiosity to transformation."
      >
        <ol className="divide-y divide-stone border-y border-stone">
          {JOURNEY.map((step) => (
            <li
              key={step.n}
              className="grid grid-cols-1 gap-4 py-10 md:grid-cols-12 md:items-baseline md:gap-10 md:py-12"
            >
              <p className="font-mono text-[11px] tracking-[0.2em] text-gold md:col-span-1">
                {step.n}
              </p>
              <h3 className="font-serif text-2xl text-night md:col-span-3 md:text-3xl">
                {step.t}
              </h3>
              <p className="av-lede text-mute md:col-span-8">{step.d}</p>
            </li>
          ))}
        </ol>
      </EditorialSection>

      <EditorialSection
        id="held-by"
        eyebrow="Who holds you"
        title="Two practitioners. One map."
      >
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
          <div className="space-y-4 border-t border-stone pt-8">
            <h3 className="font-serif text-2xl text-night">With Archana</h3>
            <p className="text-[15px] leading-[1.9] text-mute">
              Outer architecture — chart, Vastu, ritual, karmic pattern. When the room
              and the rhythm of a life need reordering before the mind can rest.
            </p>
          </div>
          <div className="space-y-4 border-t border-stone pt-8">
            <h3 className="font-serif text-2xl text-night">With Sejal</h3>
            <p className="text-[15px] leading-[1.9] text-mute">
              Inner system — breath, somatic safety, CBT-informed coaching, hypnosis,
              sound. When the body must feel safe before insight can stay.
            </p>
          </div>
        </div>
        <p className="av-lede mt-12 max-w-[60ch] text-mute">
          Many clients move between both. That is the moat: you are not asked to pick
          East or West.
        </p>
      </EditorialSection>

      <EditorialSection
        id="doorways"
        eyebrow="Doorways"
        title="Ways to enter — without a price wall."
      >
        <ul className="space-y-0">
          {[
            {
              t: "Portal Decode",
              d: "Free to begin. Eight steps. Your map.",
              href: "/step-1",
              cta: "Begin",
            },
            {
              t: "Discovery Call",
              d: "Fifteen quiet minutes. Fit, not force.",
              href: "/step-1",
              cta: "Start toward a call",
            },
            {
              t: "Structured programmes",
              d: "Named transformations — regulate, sleep, release — with clear outcomes.",
              href: "/programs",
              cta: "See programmes",
            },
          ].map((row) => (
            <li
              key={row.t}
              className="flex flex-col gap-4 border-t border-stone py-8 md:flex-row md:items-end md:justify-between md:py-10"
            >
              <div className="max-w-xl space-y-2">
                <h3 className="font-serif text-2xl text-night">{row.t}</h3>
                <p className="text-[15px] leading-[1.8] text-mute">{row.d}</p>
              </div>
              <Link
                href={row.href}
                className="inline-flex text-[11px] uppercase tracking-[0.28em] text-gold transition-colors hover:text-night"
              >
                {row.cta} →
              </Link>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <BeginCtaBand
        title="The first step is not a purchase."
        body="Begin the portal. If the lineage fits, we meet on a Discovery Call."
      />
    </EditorialPage>
  );
}
