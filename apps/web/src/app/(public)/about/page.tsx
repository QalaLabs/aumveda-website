import type { Metadata } from "next";
import Image from "next/image";
import {
  BeginCtaBand,
  EditorialHero,
  EditorialPage,
  EditorialSection,
} from "@/components/marketing/EditorialShell";

export const metadata: Metadata = {
  title: "About — Why AUMVEDA Exists",
  description:
    "Mother–daughter Neuro-Vedic healing. Archana Jain (Jaipur) and Sejal Jain (Mumbai) — why this is not astrology, therapy, or coaching alone.",
};

const FOUNDERS = "/marketing/founders.jpg";
const RITUAL = "/marketing/ritual.jpg";

export default function AboutPage() {
  return (
    <EditorialPage>
      <EditorialHero
        eyebrow="About · Trust"
        title={
          <>
            Why these two women —
            <span className="italic text-night"> and why this practice.</span>
          </>
        }
        lede="AUMVEDA exists because one lineage could not hold the whole person. Eastern craft without nervous-system safety leaves insight stranded. Western care without meaning leaves the body regulated but the story empty. Mother and daughter chose to hold both."
      />

      <section className="border-b border-stone">
        <div className="relative aspect-[21/9] w-full overflow-hidden md:aspect-[3/1]">
          <Image
            src={RITUAL}
            alt="Quiet ritual light — ceramic and warmth"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="av-content av-gutter py-12 md:py-16">
          <p className="av-lede max-w-[65ch] text-ink-text">
            Healing here is not a marketplace of modalities. It is a relationship —
            rooted in Jaipur&apos;s Vedic craft and Mumbai&apos;s clinical clarity —
            for the mind that is successful outside and unfinished within.
          </p>
        </div>
      </section>

      <EditorialSection
        id="why"
        eyebrow="Origin"
        title="Why AUMVEDA exists"
      >
        <div className="av-measure space-y-6 av-lede text-mute">
          <p>
            Too many people arrive having tried astrology, therapy, coaching, apps,
            and retreats — each helpful in pieces, none able to stay with the whole
            pattern. AUMVEDA was built so the person does not have to translate
            themselves between worlds.
          </p>
          <p>
            Archana brings decades of Vedic precision: Vastu, chart, tarot, karmic
            insight, ritual. Sejal brings nervous-system literacy: CBT-informed
            coaching, breath, hypnotherapy, somatic and sound practice. Together they
            form a dual-practitioner model no competitor owns — clinical care and
            metaphysical craft in one family.
          </p>
        </div>
      </EditorialSection>

      <EditorialSection id="lineage" eyebrow="Lineage" title="Mother and daughter.">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-20">
          <div className="relative aspect-[3/4] overflow-hidden lg:col-span-5">
            <Image
              src={FOUNDERS}
              alt="Archana Jain and Sejal Jain, founders of AUMVEDA"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-14 lg:col-span-7">
            <article className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Jaipur</p>
              <h3 className="font-serif text-3xl text-night">Archana Jain</h3>
              <p className="text-[13px] uppercase tracking-[0.18em] text-mute">
                Vedic Practitioner
              </p>
              <p className="av-lede text-mute">
                Over twenty-five years of Vastu, astrology, tarot, karmic work, and
                ritual — offered with reverence and precision. She maps the outer
                architecture of a life so the inner work has somewhere true to land.
              </p>
            </article>
            <article className="space-y-4 border-t border-stone pt-14">
              <p className="text-[11px] uppercase tracking-[0.22em] text-gold">Mumbai</p>
              <h3 className="font-serif text-3xl text-night">Sejal Jain</h3>
              <p className="text-[13px] uppercase tracking-[0.18em] text-mute">
                Healing Facilitator & Wellness Coach
              </p>
              <p className="av-lede text-mute">
                CBT-informed coaching, hypnotherapy, breathwork, vagus regulation,
                sound, and somatic practice — so the body learns safety again. She
                tends the inner system that must be regulated before insight can stay.
              </p>
            </article>
          </div>
        </div>
      </EditorialSection>

      <EditorialSection
        id="not"
        eyebrow="Clarity"
        title="What this is — and is not."
      >
        <ul className="divide-y divide-stone border-y border-stone">
          {[
            {
              k: "Not astrology alone",
              v: "Charts inform orientation. They do not replace nervous-system work or daily practice.",
            },
            {
              k: "Not therapy alone",
              v: "Clinical tools are present, but AUMVEDA is not a substitute for psychiatric care or crisis treatment.",
            },
            {
              k: "Not coaching alone",
              v: "Goals matter. So does lineage, ritual, and the quiet architecture of meaning.",
            },
            {
              k: "Neuro-Vedic practice",
              v: "Neuroscience meets metaphysics — held by two practitioners who refuse to make you choose.",
            },
          ].map((row) => (
            <li
              key={row.k}
              className="grid grid-cols-1 gap-3 py-8 md:grid-cols-12 md:gap-10 md:py-10"
            >
              <p className="font-serif text-xl text-night md:col-span-4">{row.k}</p>
              <p className="av-lede text-mute md:col-span-8">{row.v}</p>
            </li>
          ))}
        </ul>
      </EditorialSection>

      <EditorialSection id="method" eyebrow="Methodology" title="How healing is held.">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Decode",
              d: "Portal first — breath, pattern, intention — so nothing is prescribed before you are seen.",
            },
            {
              n: "02",
              t: "Dose",
              d: "A short daily practice shaped by your profile — minutes that accumulate into change.",
            },
            {
              n: "03",
              t: "Relationship",
              d: "Discovery, sessions, and circles — with Sejal or Archana — for as long as the work needs.",
            },
          ].map((m) => (
            <div key={m.n} className="space-y-4">
              <p className="font-mono text-[11px] tracking-[0.2em] text-gold">{m.n}</p>
              <h3 className="font-serif text-2xl text-night">{m.t}</h3>
              <p className="text-[15px] leading-[1.9] text-mute">{m.d}</p>
            </div>
          ))}
        </div>
      </EditorialSection>

      <EditorialSection id="values" eyebrow="Values" title="What we protect.">
        <div className="av-measure space-y-6 av-lede text-mute">
          <p>Silence over spectacle. Relationship over product. Precision over performance.</p>
          <p>
            We will not sell fear, cosmic panic, or endless upsell. We will ask you to
            begin with trust — and earn it with presence.
          </p>
        </div>
      </EditorialSection>

      <BeginCtaBand
        title="If this lineage feels right, begin quietly."
        body="No pitch deck. A portal that listens first — then a Discovery Call if you wish."
      />
    </EditorialPage>
  );
}
