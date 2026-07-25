"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/marketing/Reveal";

const HERO = "/marketing/hero.jpg";
const FOUNDERS = "/marketing/founders.jpg";
const HERBS = "/marketing/herbs.jpg";
const MEDITATION = "/marketing/meditation.jpg";
const RITUAL = "/marketing/ritual.jpg";

function BeginArrow() {
  return (
    <svg width="24" height="8" viewBox="0 0 24 8" fill="none" aria-hidden>
      <path
        d="M0 4h22m0 0L18.5 0.5M22 4l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="0.8"
      />
    </svg>
  );
}

function Hero() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const on = () => setT(window.scrollY);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <section
      id="top"
      className="relative h-[100svh] min-h-[720px] w-full overflow-hidden bg-[hsl(var(--av-ink))] av-grain av-vignette"
    >
      <div
        className="absolute inset-0"
        style={{ transform: `translate3d(0, ${t * 0.35}px, 0)` }}
      >
        <Image
          src={HERO}
          alt="Warm brass oil lamp glowing in a sacred healing sanctuary"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-[0.72] animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--av-ink)/0.4)] via-[hsl(var(--av-ink)/0.2)] to-[hsl(var(--av-ink))]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--av-ink)/0.7)] via-transparent to-[hsl(var(--av-ink)/0.3)]" />
      </div>

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex flex-1 items-end px-6 pb-20 pt-24 md:items-center md:px-16 md:pb-0">
          <div className="max-w-[900px]">
            <p className="av-eyebrow mb-8 flex items-center gap-4 animate-av-rise">
              <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
              Mother–Daughter Neuro-Vedic Healing
            </p>
            <h1
              className="font-serif text-[13vw] leading-[0.92] tracking-[-0.03em] text-[hsl(var(--av-parchment))] md:text-[9.5vw] lg:text-[8.2vw] animate-av-veil"
              style={{ animationDelay: "300ms" }}
            >
              Your Daily
              <br />
              <span className="italic text-[hsl(var(--av-gold-soft))]">Dose</span> of Healing
            </h1>
            <p
              className="mt-10 max-w-xl font-body text-[15px] leading-[1.9] text-[hsl(var(--av-parchment)/0.65)] animate-av-rise"
              style={{ animationDelay: "900ms" }}
            >
              Eastern wisdom and Western nervous-system practice, held by mother and
              daughter — Archana in Jaipur, Sejal in Mumbai. A return to yourself, one
              quiet dose at a time.
            </p>

            <div
              className="mt-14 flex flex-wrap items-center gap-8 animate-av-rise"
              style={{ animationDelay: "1100ms" }}
            >
              <Link
                href="/step-1"
                className="group relative inline-flex items-center gap-6 border border-[hsl(var(--av-parchment)/0.22)] px-8 py-5 text-[11px] uppercase tracking-[0.32em] text-[hsl(var(--av-parchment))] transition-all duration-700 hover:border-[hsl(var(--av-gold))] hover:bg-[hsl(var(--av-gold))] hover:text-[hsl(var(--av-ink))]"
              >
                <span>Begin Your Journey</span>
                <BeginArrow />
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-6 right-6 flex items-end justify-between text-[10px] uppercase tracking-[0.32em] text-[hsl(var(--av-parchment)/0.35)] md:left-16 md:right-16">
          <div>
            <span className="text-[hsl(var(--av-parchment))]">01 </span>— AUMVEDA
          </div>
          <div className="hidden md:block">Jaipur · Mumbai · Online</div>
          <div>Scroll</div>
        </div>
      </div>
    </section>
  );
}

function FounderStory() {
  return (
    <section id="philosophy" className="relative bg-[hsl(var(--av-ink))] px-6 py-32 md:px-16 md:py-48">
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24">
        <Reveal className="lg:col-span-5">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={FOUNDERS}
              alt="Archana Jain and Sejal Jain, founders of AUMVEDA"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--av-ink)/0.4)] to-transparent" />
          </div>
          <div className="mt-6 flex justify-between text-[10px] uppercase tracking-[0.28em] text-[hsl(var(--av-parchment)/0.35)]">
            <span>Archana & Sejal Jain</span>
            <span>Founders</span>
          </div>
        </Reveal>

        <div className="lg:col-span-7 lg:pt-16">
          <Reveal>
            <p className="av-eyebrow mb-8 flex items-center gap-4">
              <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
              02 — Origin
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-serif text-[42px] leading-[1.05] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[64px]">
              A lineage
              <br />
              carried by <span className="italic text-[hsl(var(--av-gold-soft))]">two hands.</span>
            </h2>
          </Reveal>
          <Reveal
            delay={240}
            className="mt-12 max-w-[560px] space-y-8 text-[15px] leading-[1.95] text-[hsl(var(--av-parchment)/0.65)]"
          >
            <p>
              AUMVEDA is a mother–daughter practice. Archana Jain, Vedic Practitioner in
              Jaipur, brings over twenty-five years of Vastu, astrology, tarot, karmic
              work, and ritual. Sejal Jain, Healing Facilitator & Wellness Coach in Mumbai,
              holds the Western lens — CBT-informed coaching, hypnotherapy, sound, vagus,
              breathwork, and somatic practice.
            </p>
            <p>
              Eastern and Western are not blended into one method. They are held together —
              so the person is met where they are, not where a single tradition insists
              they should be.
            </p>
          </Reveal>
          <Reveal
            delay={360}
            className="mt-14 grid grid-cols-2 gap-8 border-t border-[hsl(var(--av-parchment)/0.1)] pt-10 sm:grid-cols-3"
          >
            {[
              { k: "25+", u: "Years of Archana's practice" },
              { k: "2", u: "Cities. One lineage." },
              { k: "01", u: "Daily Dose of Healing" },
            ].map((s) => (
              <div key={s.u}>
                <div className="font-serif text-4xl text-[hsl(var(--av-parchment))] md:text-5xl">
                  {s.k}
                </div>
                <div className="mt-3 text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--av-parchment)/0.35)]">
                  {s.u}
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Philosophy() {
  const pillars = [
    {
      n: "i.",
      t: "Eastern Wisdom",
      d: "Vastu, astrology, tarot, karmic insight, and ritual — the lived lineage Archana carries from Jaipur, offered with reverence and precision.",
    },
    {
      n: "ii.",
      t: "Nervous System & Western Practice",
      d: "Breathwork, somatic work, vagus regulation, hypnotherapy, and CBT-informed coaching — Sejal's Mumbai practice, where the body learns safety again.",
    },
    {
      n: "iii.",
      t: "The Daily Dose",
      d: "A short, personalized practice each day — drawn from your portal profile and AHI — so healing accumulates in minutes, not marathons.",
    },
  ];

  return (
    <section
      id="practice"
      className="relative overflow-hidden bg-[hsl(var(--av-night))] px-6 py-32 md:px-16 md:py-48"
    >
      <div className="pointer-events-none absolute -left-40 top-20 h-[500px] w-[500px] rounded-full bg-[hsl(var(--av-gold)/0.05)] blur-[120px]" />
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="av-eyebrow mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
            03 — Philosophy
          </p>
        </Reveal>
        <Reveal delay={120} className="grid grid-cols-1 gap-16 lg:grid-cols-12">
          <h2 className="font-serif text-[42px] leading-[1.02] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[72px] lg:col-span-8">
            Three currents,
            <br />
            <span className="italic text-[hsl(var(--av-gold-soft))]">one river.</span>
          </h2>
          <p className="lg:col-span-4 lg:pt-6 text-[15px] leading-[1.95] text-[hsl(var(--av-parchment)/0.65)]">
            Neuro-Vedic healing moves along three quiet lines. Each supports the others.
            None stands alone.
          </p>
        </Reveal>

        <div className="mt-24 grid grid-cols-1 gap-px overflow-hidden border border-[hsl(var(--av-parchment)/0.1)] md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal
              key={p.t}
              delay={i * 140}
              className="group relative bg-[hsl(var(--av-night))] p-10 transition-colors duration-700 hover:bg-[hsl(255_50%_22%)] md:p-14"
            >
              <div className="font-serif text-2xl italic text-[hsl(var(--av-gold))]">{p.n}</div>
              <h3 className="mt-10 font-serif text-3xl leading-tight text-[hsl(var(--av-parchment))] md:text-4xl">
                {p.t}
              </h3>
              <p className="mt-8 text-[14px] leading-[1.9] text-[hsl(var(--av-parchment)/0.65)]">
                {p.d}
              </p>
              <div className="mt-14 h-px w-8 bg-[hsl(var(--av-gold)/0.4)] transition-all duration-700 group-hover:w-24" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DailyDose() {
  return (
    <section
      id="dose"
      className="relative overflow-hidden bg-[hsl(var(--av-ink))] px-6 py-32 md:px-16 md:py-48"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-20 lg:grid-cols-12 lg:gap-24">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <Reveal>
            <p className="av-eyebrow mb-8 flex items-center gap-4">
              <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
              04 — The Daily Dose
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-serif text-[42px] leading-[1.02] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[72px]">
              A dose,
              <br />
              measured in <span className="italic text-[hsl(var(--av-gold-soft))]">minutes.</span>
            </h2>
          </Reveal>
          <Reveal
            delay={240}
            className="mt-10 max-w-lg text-[15px] leading-[1.95] text-[hsl(var(--av-parchment)/0.65)]"
          >
            Five to fifteen minutes each day. A personalized practice shaped by your portal
            profile and AHI — breath, ritual, reflection — so care accumulates without
            demanding your whole morning.
          </Reveal>
          <Reveal delay={360} className="mt-16 space-y-6">
            {[
              ["Portal", "Your decode becomes the map."],
              ["AHI", "A practice written for you alone."],
              ["5–15 min", "Short enough to keep. Deep enough to matter."],
              ["Return", "Tomorrow, the dose meets you again."],
            ].map(([time, act]) => (
              <div
                key={time}
                className="group grid grid-cols-[auto_1fr] items-baseline gap-6 border-t border-[hsl(var(--av-parchment)/0.1)] py-4"
              >
                <span className="font-mono text-[11px] tracking-[0.15em] text-[hsl(var(--av-gold))]">
                  {time}
                </span>
                <span className="font-serif text-lg text-[hsl(var(--av-parchment))] md:text-xl">
                  {act}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
        <Reveal delay={200} className="order-1 lg:order-2 lg:col-span-6">
          <div className="relative">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={RITUAL}
                alt="Hands cupping a steaming ceramic cup of herbal tea by candlelight"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden h-40 w-40 border border-[hsl(var(--av-gold)/0.4)] md:block" />
            <div className="pointer-events-none absolute bottom-8 left-8 h-2 w-2 rounded-full bg-[hsl(var(--av-gold))] animate-av-breathe" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Journey() {
  const chapters = [
    {
      n: "I",
      t: "Portal Decode",
      d: "Eight quiet steps. Breath, pattern, intention — a map of where you are before anything is prescribed.",
    },
    {
      n: "II",
      t: "Daily Dose",
      d: "A personalized 5–15 minute practice each day, shaped by your profile and AHI.",
    },
    {
      n: "III",
      t: "Discovery Call",
      d: "About fifteen quiet minutes with Sejal or Archana — to sense if this practice is right for you.",
    },
    {
      n: "IV",
      t: "Ongoing Practice",
      d: "1:1 sessions, community circles, and the rhythm of returning — as long as you need.",
    },
  ];

  return (
    <section id="journey" className="relative bg-[hsl(var(--av-night))] px-6 py-32 md:px-16 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="av-eyebrow mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
            05 — The Journey
          </p>
        </Reveal>
        <Reveal delay={120} className="max-w-4xl">
          <h2 className="font-serif text-[42px] leading-[1.02] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[72px]">
            Four steps,
            <br />
            <span className="italic text-[hsl(var(--av-gold-soft))]">unhurried.</span>
          </h2>
        </Reveal>

        <div className="relative mt-24">
          <div className="absolute left-0 top-0 hidden h-full w-px bg-[hsl(var(--av-parchment)/0.1)] md:block" />
          <div className="grid grid-cols-1 gap-16 md:grid-cols-2 lg:grid-cols-4">
            {chapters.map((c, i) => (
              <Reveal key={c.t} delay={i * 120} className="relative pl-8 md:pl-10">
                <div className="absolute left-0 top-1 hidden md:block">
                  <div className="h-2 w-2 rounded-full bg-[hsl(var(--av-gold))]" />
                </div>
                <div className="font-serif text-5xl italic text-[hsl(var(--av-gold)/0.6)]">{c.n}</div>
                <h3 className="mt-8 font-serif text-2xl text-[hsl(var(--av-parchment))]">{c.t}</h3>
                <p className="mt-4 text-[14px] leading-[1.9] text-[hsl(var(--av-parchment)/0.65)]">
                  {c.d}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Services() {
  const items = [
    {
      k: "1:1",
      s: "With Sejal or Archana",
      p: "Private",
      d: "One-to-one sessions with Sejal (Healing Facilitator & Wellness Coach, Mumbai) or Archana (Vedic Practitioner, Jaipur) — held online or in person.",
      img: MEDITATION,
    },
    {
      k: "Circles",
      s: "Community Practice",
      p: "Shared",
      d: "Live community circles for shared ritual, breath, and reflection — belonging without performance.",
      img: RITUAL,
    },
    {
      k: "Crystal",
      s: "Shop · Jaipur",
      p: "Curated",
      d: "A curated crystal shop rooted in Jaipur — pieces chosen with care for practice and presence.",
      img: HERBS,
    },
  ];

  return (
    <section id="services" className="relative bg-[hsl(var(--av-ink))] px-6 py-32 md:px-16 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="av-eyebrow mb-8 flex items-center gap-4">
              <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
              06 — Services
            </p>
            <h2 className="font-serif text-[42px] leading-[1.02] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[72px]">
              Three <span className="italic text-[hsl(var(--av-gold-soft))]">doorways.</span>
            </h2>
          </div>
          <Link
            href="/step-1"
            className="group inline-flex items-center gap-4 text-[11px] uppercase tracking-[0.28em] text-[hsl(var(--av-parchment)/0.55)] transition-colors hover:text-[hsl(var(--av-parchment))]"
          >
            Begin Your Journey
            <span className="h-px w-16 bg-[hsl(var(--av-parchment)/0.1)] transition-all duration-500 group-hover:w-24 group-hover:bg-[hsl(var(--av-gold))]" />
          </Link>
        </Reveal>

        <div className="mt-20 space-y-px">
          {items.map((it, i) => (
            <Reveal
              key={it.k}
              delay={i * 100}
              className="group grid grid-cols-1 items-center gap-8 border-t border-[hsl(var(--av-parchment)/0.1)] py-10 transition-all duration-700 hover:bg-[hsl(var(--av-night)/0.4)] md:grid-cols-12 md:gap-12 md:py-14"
            >
              <div className="relative h-48 overflow-hidden md:col-span-3 md:h-40">
                <Image
                  src={it.img}
                  alt={it.s}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-[1400ms] group-hover:scale-105"
                />
              </div>
              <div className="md:col-span-2">
                <div className="font-serif text-3xl text-[hsl(var(--av-parchment))] md:text-4xl">
                  {it.k}
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.28em] text-[hsl(var(--av-gold))]">
                  {it.s}
                </div>
              </div>
              <p className="max-w-xl text-[14px] leading-[1.9] text-[hsl(var(--av-parchment)/0.65)] md:col-span-5">
                {it.d}
              </p>
              <div className="flex items-center justify-between md:col-span-2 md:justify-end md:gap-6">
                <span className="text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--av-parchment)/0.35)]">
                  {it.p}
                </span>
                <span className="grid h-11 w-11 place-items-center rounded-full border border-[hsl(var(--av-parchment)/0.22)] text-[hsl(var(--av-parchment))] transition-all duration-500 group-hover:border-[hsl(var(--av-gold))] group-hover:bg-[hsl(var(--av-gold))] group-hover:text-[hsl(var(--av-ink))]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
                    <path
                      d="M2 6h8m0 0L6.5 2.5M10 6l-3.5 3.5"
                      stroke="currentColor"
                      strokeWidth="1"
                    />
                  </svg>
                </span>
              </div>
            </Reveal>
          ))}
          <div className="border-t border-[hsl(var(--av-parchment)/0.1)]" />
        </div>
      </div>
    </section>
  );
}

function Discovery() {
  return (
    <section
      id="discovery"
      className="relative overflow-hidden bg-[hsl(var(--av-night))] px-6 py-32 md:px-16 md:py-48 av-grain"
    >
      <Image
        src={HERBS}
        alt=""
        aria-hidden
        fill
        sizes="100vw"
        className="pointer-events-none object-cover opacity-[0.14]"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--av-night))] via-[hsl(var(--av-night)/0.8)] to-[hsl(var(--av-night))]" />
      <div className="relative mx-auto max-w-[1100px] text-center">
        <Reveal>
          <p className="av-eyebrow mb-10 inline-flex items-center gap-4">
            <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
            07 — Discovery
            <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="font-serif text-[48px] leading-[1.02] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[96px]">
            A quiet
            <br />
            <span className="italic text-[hsl(var(--av-gold-soft))]">conversation.</span>
          </h2>
        </Reveal>
        <Reveal
          delay={240}
          className="mx-auto mt-10 max-w-xl text-[15px] leading-[1.95] text-[hsl(var(--av-parchment)/0.65)]"
        >
          About fifteen quiet minutes with Sejal or Archana. No pressure. A listening, so we
          may know if this practice is right for you. Start in the portal — your decode
          informs the call.
        </Reveal>
        <Reveal delay={360} className="mt-16 flex flex-col items-center gap-6">
          <Link
            href="/step-1"
            className="group inline-flex items-center gap-6 border border-[hsl(var(--av-gold)/0.6)] bg-[hsl(var(--av-gold)/0.1)] px-10 py-6 text-[12px] uppercase tracking-[0.32em] text-[hsl(var(--av-parchment))] transition-all duration-700 hover:bg-[hsl(var(--av-gold))] hover:text-[hsl(var(--av-ink))] av-glow-gold"
          >
            <span>Begin Your Journey</span>
            <svg width="28" height="10" viewBox="0 0 28 10" fill="none" aria-hidden>
              <path
                d="M0 5h26m0 0L22 1M26 5l-4 4"
                stroke="currentColor"
                strokeWidth="0.9"
              />
            </svg>
          </Link>
          <a
            href="mailto:hello@aumveda.com?subject=Discovery%20Call"
            className="text-[11px] uppercase tracking-[0.28em] text-[hsl(var(--av-parchment)/0.35)] transition-colors hover:text-[hsl(var(--av-parchment))]"
          >
            Or book a Discovery Call
          </a>
        </Reveal>
        <Reveal
          delay={480}
          className="mt-10 text-[10px] uppercase tracking-[0.32em] text-[hsl(var(--av-parchment)/0.35)]"
        >
          Jaipur · Mumbai · Online
        </Reveal>
      </div>
    </section>
  );
}

function Testimonials() {
  const quotes = [
    {
      q: "I did not know how loud my body had become until the Daily Dose taught me to listen. A few weeks in, I sleep like I have not in years.",
      a: "Priya M.",
      r: "Mumbai · Daily Dose",
    },
    {
      q: "Archana and Sejal hold something rare — East and West without forcing either. I return to the practice the way one returns to weather.",
      a: "Kavya R.",
      r: "Bangalore · 1:1",
    },
    {
      q: "There is a stillness here I have not found in years of trying. Quiet. Personal. It is changing how I move through my days.",
      a: "Sneha K.",
      r: "Delhi · Discovery",
    },
  ];

  return (
    <section className="relative bg-[hsl(var(--av-ink))] px-6 py-32 md:px-16 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <p className="av-eyebrow mb-8 flex items-center gap-4">
            <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
            08 — Reflections
          </p>
        </Reveal>
        <div className="mt-8 grid grid-cols-1 gap-16 lg:grid-cols-3 lg:gap-20">
          {quotes.map((q, i) => (
            <Reveal key={q.a} delay={i * 140} className="flex flex-col">
              <svg
                width="28"
                height="20"
                viewBox="0 0 28 20"
                fill="none"
                className="text-[hsl(var(--av-gold))]"
                aria-hidden
              >
                <path
                  d="M0 20V10C0 4.48 4.48 0 10 0v4C6.69 4 4 6.69 4 10h6v10H0zM16 20V10C16 4.48 20.48 0 26 0v4c-3.31 0-6 2.69-6 6h6v10H16z"
                  fill="currentColor"
                  opacity="0.7"
                />
              </svg>
              <p className="mt-8 font-serif text-2xl leading-[1.4] text-[hsl(var(--av-parchment))] md:text-[26px]">
                {q.q}
              </p>
              <div className="mt-auto pt-10">
                <div className="h-px w-10 bg-[hsl(var(--av-gold)/0.6)]" />
                <div className="mt-4 text-[13px] text-[hsl(var(--av-parchment))]">{q.a}</div>
                <div className="text-[10px] uppercase tracking-[0.28em] text-[hsl(var(--av-parchment)/0.35)]">
                  {q.r}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Insights() {
  const posts = [
    {
      d: "Sep 2026",
      t: "On the vagus nerve, and returning to the body.",
      c: "Practice",
      href: "/insights",
    },
    {
      d: "Aug 2026",
      t: "Why we say Daily Dose — not wellness.",
      c: "Essays",
      href: "/insights",
    },
    {
      d: "Jul 2026",
      t: "A conversation with my mother, on returning home.",
      c: "Lineage",
      href: "/insights",
    },
  ];

  return (
    <section id="insights" className="relative bg-[hsl(var(--av-night))] px-6 py-32 md:px-16 md:py-48">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="av-eyebrow mb-8 flex items-center gap-4">
              <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
              09 — Insights
            </p>
            <h2 className="font-serif text-[42px] leading-[1.02] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[64px]">
              Field notes from the{" "}
              <span className="italic text-[hsl(var(--av-gold-soft))]">practice.</span>
            </h2>
          </div>
        </Reveal>
        <div className="mt-20 space-y-px">
          {posts.map((p, i) => (
            <Reveal key={p.t} delay={i * 100}>
              <Link
                href={p.href}
                className="group grid grid-cols-1 items-baseline gap-4 border-t border-[hsl(var(--av-parchment)/0.1)] py-8 transition-colors duration-500 hover:bg-[hsl(var(--av-ink)/0.4)] md:grid-cols-12 md:gap-8 md:py-10"
              >
                <span className="text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--av-gold))] md:col-span-2">
                  {p.d}
                </span>
                <h3 className="font-serif text-2xl leading-tight text-[hsl(var(--av-parchment))] md:col-span-7 md:text-[32px]">
                  {p.t}
                </h3>
                <span className="text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--av-parchment)/0.35)] md:col-span-2">
                  {p.c}
                </span>
                <span className="text-[hsl(var(--av-parchment))] md:col-span-1 md:text-right">
                  <span className="inline-block transition-transform duration-500 group-hover:translate-x-2">
                    →
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
          <div className="border-t border-[hsl(var(--av-parchment)/0.1)]" />
        </div>
      </div>
    </section>
  );
}

function HomeFooter() {
  return (
    <footer className="relative overflow-hidden bg-[hsl(var(--av-ink))] px-6 pb-16 pt-32 md:px-16 md:pb-20 md:pt-48">
      <div className="mx-auto max-w-[1400px]">
        <Reveal>
          <div className="font-serif text-[18vw] leading-[0.85] tracking-[-0.04em] text-[hsl(var(--av-parchment)/0.1)] md:text-[14vw]">
            AUMVEDA
          </div>
        </Reveal>
        <div className="mt-16 grid grid-cols-2 gap-10 border-t border-[hsl(var(--av-parchment)/0.1)] pt-10 md:grid-cols-4 md:gap-8">
          <div>
            <div className="av-eyebrow">Presence</div>
            <p className="mt-4 font-serif text-lg leading-relaxed text-[hsl(var(--av-parchment))]">
              Jaipur · Mumbai
              <br />
              Online
            </p>
          </div>
          <div>
            <div className="av-eyebrow">Correspondence</div>
            <a
              href="mailto:hello@aumveda.com"
              className="mt-4 block font-serif text-lg text-[hsl(var(--av-parchment))] transition-colors hover:text-[hsl(var(--av-gold-soft))]"
            >
              hello@aumveda.com
            </a>
          </div>
          <div>
            <div className="av-eyebrow">Explore</div>
            <ul className="mt-4 space-y-2 text-[hsl(var(--av-parchment))]">
              {[
                { l: "About", href: "/about" },
                { l: "Services", href: "/services" },
                { l: "Insights", href: "/insights" },
              ].map((item) => (
                <li key={item.l}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 font-serif text-lg transition-colors hover:text-[hsl(var(--av-gold-soft))]"
                  >
                    {item.l}
                    <span className="-translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="av-eyebrow">Practice</div>
            <p className="mt-4 text-[13px] leading-[1.8] text-[hsl(var(--av-parchment)/0.55)]">
              Mother–daughter Neuro-Vedic healing. Your Daily Dose of Healing — held with
              care.
            </p>
            <Link
              href="/step-1"
              className="mt-6 inline-flex text-[11px] uppercase tracking-[0.28em] text-[hsl(var(--av-gold))] transition-colors hover:text-[hsl(var(--av-gold-soft))]"
            >
              Begin Your Journey →
            </Link>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-start justify-between gap-4 border-t border-[hsl(var(--av-parchment)/0.1)] pt-8 text-[10px] uppercase tracking-[0.28em] text-[hsl(var(--av-parchment)/0.35)] md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} AUMVEDA · Jaipur · Mumbai</div>
          <div className="flex gap-8">
            <Link href="/privacy-policy" className="transition-colors hover:text-[hsl(var(--av-parchment))]">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[hsl(var(--av-parchment))]">
              Terms
            </Link>
            <Link href="/auth/login" className="transition-colors hover:text-[hsl(var(--av-parchment))]">
              Client login
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[hsl(var(--av-gold))] animate-av-breathe" />
            In practice
          </div>
        </div>
      </div>
    </footer>
  );
}

/** Lovable marketing homepage port — Archana/Sejal copy, portal CTAs → /step-1 */
export default function HomeMarketing() {
  return (
    <div className="relative bg-[hsl(var(--av-ink))] text-[hsl(var(--av-parchment))]">
      <Hero />
      <FounderStory />
      <Philosophy />
      <DailyDose />
      <Journey />
      <Services />
      <Discovery />
      <Testimonials />
      <Insights />
      <HomeFooter />
    </div>
  );
}
