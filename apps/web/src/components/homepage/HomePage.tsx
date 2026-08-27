"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { preloadHeroAssets } from "./assets/AssetManager";
import { ScrollProvider } from "./ScrollProvider";
import { FloatingNav, SectionRail } from "./FloatingNav";
import { CinematicPreloader } from "./CinematicPreloader";
import { Reveal } from "@/components/marketing/Reveal";
import type { ProductView } from "@/lib/product-types";

const HERO = "/marketing/hero.jpg";
const FOUNDERS = "/marketing/founders.jpg";
const HERBS = "/marketing/herbs.jpg";
const MEDITATION = "/marketing/meditation.jpg";
const RITUAL = "/marketing/ritual.jpg";
const SEJAL =
  "https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=1200";
const ARCHANA =
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=1200";
const BLUR =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCAAKAAoDASIAAhEBAxEB/8QAFwAAAwEAAAAAAAAAAAAAAAAAAgQFBv/EABQBAQAAAAAAAAAAAAAAAAAAAAP/2gAMAwEAAhADEAAAAcpixczEK//EABwQAAICAgMAAAAAAAAAAAAAAAECAwQFEQASIf/aAAgBAQABBQINTKz7c5nSHRDSKcMU+P/EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQMBAT8BP//EABQRAQAAAAAAAAAAAAAAAAAAABD/2gAIAQIBAT8BP//EAB4QAAECBwEAAAAAAAAAAAAAAAECAwAEERIhIjFB/9oACAEBAAY/AtvIojDeBOtSMt2ii5FCiw3wSJXvv+n/xAAdEAEAAgEFAQAAAAAAAAAAAAABABEhMUFRYXGB/9oACAEBAAE/IcuNjvIGxLpwyrpEXczTFywwcE6/BAWMPUvxAWFn8Wf/2gAMAwEAAgADAAAAENf/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAEDAQE/EDX/xAAUEQEAAAAAAAAAAAAAAAAAAAAQ/9oACAECAQE/EDX/xAAdEAEBAAIBBQAAAAAAAAAAAAABEQAhMUFhcYGh/9oACAEBAAE/EE/PAlV5AGoGngIPS8Yg67AmJIcnJvKGN4E5nBjtxg7Q+FRP2b//2Q==";

// The R3F canvas is client-only and non-trivial to construct — load it
// lazily so it never blocks first paint or ships into the server bundle.
const SceneCanvas = dynamic(() => import("./SceneCanvas").then((m) => m.SceneCanvas), {
  ssr: false,
});

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

function HeroSection() {
  const [t, setT] = useState(0);
  useEffect(() => {
    const on = () => setT(window.scrollY);
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  return (
    <section
      id="top"
      className="relative min-h-[100svh] w-full overflow-hidden flex flex-col justify-end px-6 pb-20 pt-32 md:justify-center md:px-16 md:pb-0"
    >
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{ transform: `translate3d(0, ${t * 0.25}px, 0)` }}
      >
        <Image
          src={HERO}
          alt="Warm brass oil lamp glowing in a sacred healing sanctuary"
          fill
          priority
          sizes="100vw"
          className="object-cover animate-ken-burns"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--av-ink)/0.8)] via-[hsl(var(--av-ink)/0.4)] to-[hsl(var(--av-ink)/0.9)]" />
      </div>

      <div className="relative z-10 max-w-[960px] mx-auto w-full">
        <p className="av-eyebrow mb-8 flex items-center gap-4 animate-av-rise">
          <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
          Mother–Daughter Neuro-Vedic Healing
        </p>
        <h1
          className="font-serif text-[12vw] leading-[0.92] tracking-[-0.03em] text-[hsl(var(--av-parchment))] md:text-[8.5vw] lg:text-[7.2vw] animate-av-veil"
          style={{ animationDelay: "200ms" }}
        >
          Your Daily
          <br />
          <span className="italic text-[hsl(var(--av-gold-soft))]">Dose</span> of Healing
        </h1>
        <p
          className="mt-8 max-w-xl font-body text-[15px] md:text-[17px] leading-[1.9] text-[hsl(var(--av-parchment)/0.75)] animate-av-rise"
          style={{ animationDelay: "600ms" }}
        >
          Eastern wisdom and Western nervous-system practice, held by mother and daughter —
          Archana in Jaipur, Sejal in Mumbai. A return to yourself, one quiet dose at a time.
        </p>

        <div
          className="mt-12 flex flex-wrap items-center gap-6 animate-av-rise"
          style={{ animationDelay: "800ms" }}
        >
          <Link
            href="/step-1"
            className="group relative inline-flex items-center gap-6 border border-[hsl(var(--av-gold)/0.6)] bg-[hsl(var(--av-gold)/0.12)] px-8 py-5 text-[11px] uppercase tracking-[0.32em] text-[hsl(var(--av-parchment))] backdrop-blur-md transition-all duration-700 hover:border-[hsl(var(--av-gold))] hover:bg-[hsl(var(--av-gold))] hover:text-[hsl(var(--av-ink))] shadow-lg"
          >
            <span>Begin Your Journey</span>
            <BeginArrow />
          </Link>
          <Link
            href="#origin"
            className="text-[11px] uppercase tracking-[0.28em] text-[hsl(var(--av-parchment)/0.5)] transition-colors hover:text-[hsl(var(--av-gold-soft))]"
          >
            Explore Lineage &darr;
          </Link>
        </div>
      </div>

      <div className="relative z-10 mt-16 max-w-[960px] mx-auto w-full flex items-end justify-between text-[10px] uppercase tracking-[0.32em] text-[hsl(var(--av-parchment)/0.4)]">
        <div>
          <span className="text-[hsl(var(--av-gold))]">01 </span>— AUMVEDA
        </div>
        <div className="hidden md:block">Jaipur · Mumbai · Online</div>
        <div>Scroll to Journey</div>
      </div>
    </section>
  );
}

function FounderStorySection() {
  return (
    <section id="origin" className="relative px-6 py-32 md:px-16 md:py-44">
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-24 items-center">
        <Reveal className="lg:col-span-5">
          <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-[hsl(var(--av-parchment)/0.15)] shadow-2xl bg-[hsl(var(--av-night)/0.6)] backdrop-blur-sm">
            <Image
              src={FOUNDERS}
              alt="Archana Jain and Sejal Jain, founders of AUMVEDA"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--av-ink)/0.8)] via-transparent to-transparent" />
          </div>
          <div className="mt-5 flex justify-between text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--av-parchment)/0.5)]">
            <span className="text-[hsl(var(--av-gold-soft))]">Archana &amp; Sejal Jain</span>
            <span>Mother &amp; Daughter</span>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal>
            <p className="av-eyebrow mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
              02 — Origin
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-serif text-[38px] leading-[1.08] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[58px]">
              A lineage
              <br />
              carried by <span className="italic text-[hsl(var(--av-gold-soft))]">two hands.</span>
            </h2>
          </Reveal>
          <Reveal
            delay={240}
            className="mt-8 max-w-[560px] space-y-6 text-[15px] md:text-[16px] leading-[1.95] text-[hsl(var(--av-parchment)/0.7)]"
          >
            <p>
              AUMVEDA is a mother–daughter practice. Archana Jain, Vedic Practitioner in
              Jaipur, brings over twenty-five years of Vastu, astrology, tarot, karmic
              work, and ritual. Sejal Jain, Healing Facilitator &amp; Wellness Coach in Mumbai,
              holds the Western lens — CBT-informed coaching, hypnotherapy, sound, vagus,
              breathwork, and somatic practice.
            </p>
            <p>
              Eastern and Western are not blended into a generic compromise. They are held together —
              so the person is met where they are, not where a single tradition insists they should be.
            </p>
          </Reveal>
          <Reveal
            delay={360}
            className="mt-12 grid grid-cols-2 gap-8 border-t border-[hsl(var(--av-parchment)/0.12)] pt-10 sm:grid-cols-3"
          >
            {[
              { k: "25+", u: "Years of Archana's practice" },
              { k: "2", u: "Cities. One lineage." },
              { k: "01", u: "Daily Dose of Healing" },
            ].map((s) => (
              <div key={s.u}>
                <div className="font-serif text-3xl md:text-4xl text-[hsl(var(--av-gold))]">
                  {s.k}
                </div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[hsl(var(--av-parchment)/0.45)]">
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

function PhilosophySection() {
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
      id="philosophy"
      className="relative overflow-hidden px-6 py-32 md:px-16 md:py-44"
    >
      <div className="mx-auto max-w-[1300px]">
        <Reveal>
          <p className="av-eyebrow mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
            03 — Philosophy
          </p>
        </Reveal>
        <Reveal delay={120} className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <h2 className="font-serif text-[38px] leading-[1.05] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[64px] lg:col-span-8">
            Three currents,
            <br />
            <span className="italic text-[hsl(var(--av-gold-soft))]">one river.</span>
          </h2>
          <p className="lg:col-span-4 lg:pt-4 text-[15px] leading-[1.9] text-[hsl(var(--av-parchment)/0.7)]">
            Neuro-Vedic healing moves along three quiet lines. Each supports the others.
            None stands alone.
          </p>
        </Reveal>

        <div className="mt-20 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <Reveal
              key={p.t}
              delay={i * 140}
              className="group relative rounded-2xl border border-[hsl(var(--av-parchment)/0.12)] bg-[hsl(var(--av-night)/0.5)] backdrop-blur-md p-8 md:p-10 transition-all duration-700 hover:border-[hsl(var(--av-gold)/0.4)] hover:bg-[hsl(var(--av-night)/0.75)] shadow-xl"
            >
              <div className="font-serif text-2xl italic text-[hsl(var(--av-gold))]">{p.n}</div>
              <h3 className="mt-8 font-serif text-2xl leading-snug text-[hsl(var(--av-parchment))] md:text-3xl">
                {p.t}
              </h3>
              <p className="mt-6 text-[14px] leading-[1.9] text-[hsl(var(--av-parchment)/0.65)]">
                {p.d}
              </p>
              <div className="mt-10 h-px w-8 bg-[hsl(var(--av-gold)/0.4)] transition-all duration-700 group-hover:w-20" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DailyDoseSection() {
  return (
    <section
      id="dose"
      className="relative overflow-hidden px-6 py-32 md:px-16 md:py-44"
    >
      <div className="mx-auto grid max-w-[1300px] grid-cols-1 items-center gap-16 lg:grid-cols-12 lg:gap-24">
        <div className="order-2 lg:order-1 lg:col-span-6">
          <Reveal>
            <p className="av-eyebrow mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
              04 — The Daily Dose
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-serif text-[38px] leading-[1.05] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[60px]">
              A dose,
              <br />
              measured in <span className="italic text-[hsl(var(--av-gold-soft))]">minutes.</span>
            </h2>
          </Reveal>
          <Reveal
            delay={240}
            className="mt-8 max-w-lg text-[15px] leading-[1.95] text-[hsl(var(--av-parchment)/0.7)]"
          >
            Five to fifteen minutes each day. A personalized practice shaped by your portal
            profile and AHI — breath, ritual, reflection — so care accumulates without
            demanding your whole morning.
          </Reveal>
          <Reveal delay={360} className="mt-12 space-y-4">
            {[
              ["Portal", "Your decode becomes the personalized map."],
              ["AHI Engine", "A micro-practice tuned for your nervous system."],
              ["5–15 min", "Short enough to keep. Deep enough to heal."],
              ["Daily Return", "Tomorrow, the practice meets you again."],
            ].map(([time, act]) => (
              <div
                key={time}
                className="group grid grid-cols-[100px_1fr] items-baseline gap-4 border-t border-[hsl(var(--av-parchment)/0.1)] py-4"
              >
                <span className="font-mono text-[11px] tracking-[0.15em] text-[hsl(var(--av-gold))]">
                  {time}
                </span>
                <span className="font-serif text-base text-[hsl(var(--av-parchment))] md:text-lg">
                  {act}
                </span>
              </div>
            ))}
          </Reveal>
        </div>
        <Reveal delay={200} className="order-1 lg:order-2 lg:col-span-6">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[hsl(var(--av-parchment)/0.15)] shadow-2xl bg-[hsl(var(--av-night)/0.5)] backdrop-blur-md">
            <Image
              src={RITUAL}
              alt="Hands cupping a steaming ceramic cup of herbal tea by candlelight"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--av-ink)/0.7)] via-transparent to-transparent" />
            <div className="pointer-events-none absolute bottom-8 left-8 h-2.5 w-2.5 rounded-full bg-[hsl(var(--av-gold))] animate-av-breathe" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function JourneySection() {
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
    <section id="journey" className="relative px-6 py-32 md:px-16 md:py-44">
      <div className="mx-auto max-w-[1300px]">
        <Reveal>
          <p className="av-eyebrow mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
            05 — The Journey
          </p>
        </Reveal>
        <Reveal delay={120} className="max-w-3xl">
          <h2 className="font-serif text-[38px] leading-[1.05] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[60px]">
            Four steps,
            <br />
            <span className="italic text-[hsl(var(--av-gold-soft))]">unhurried.</span>
          </h2>
        </Reveal>

        <div className="relative mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {chapters.map((c, i) => (
            <Reveal
              key={c.t}
              delay={i * 120}
              className="relative rounded-2xl border border-[hsl(var(--av-parchment)/0.12)] bg-[hsl(var(--av-night)/0.5)] backdrop-blur-md p-8 transition-all duration-500 hover:border-[hsl(var(--av-gold)/0.4)]"
            >
              <div className="font-serif text-4xl italic text-[hsl(var(--av-gold)/0.7)]">{c.n}</div>
              <h3 className="mt-6 font-serif text-xl text-[hsl(var(--av-parchment))]">{c.t}</h3>
              <p className="mt-4 text-[13px] leading-[1.85] text-[hsl(var(--av-parchment)/0.65)]">
                {c.d}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HealersSection() {
  return (
    <section id="healers" className="relative px-6 py-32 md:px-16 md:py-44">
      <div className="mx-auto max-w-[1300px] space-y-16">
        <Reveal className="max-w-2xl space-y-4">
          <p className="av-eyebrow flex items-center gap-4">
            <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
            06 — The Lineage
          </p>
          <h2 className="font-serif text-[38px] md:text-[54px] text-[hsl(var(--av-parchment))] leading-tight">
            Two traditions. One healing relationship.
          </h2>
          <p className="font-body text-base text-[hsl(var(--av-parchment)/0.7)] leading-relaxed">
            Not co-founders on a slide — a mother and daughter. Eastern roots meet Western
            nervous-system work across Jaipur and Mumbai.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14">
          <Reveal delay={100} className="space-y-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[hsl(var(--av-parchment)/0.15)] shadow-2xl bg-[hsl(var(--av-night)/0.6)] backdrop-blur-md">
              <Image
                src={SEJAL}
                alt="Sejal Jain, Healing Facilitator and Wellness Coach, Mumbai"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                placeholder="blur"
                blurDataURL={BLUR}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--av-ink)/0.8)] via-transparent to-transparent" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl md:text-3xl text-[hsl(var(--av-parchment))]">
                Sejal Jain
              </h3>
              <p className="font-body text-sm text-[hsl(var(--av-gold-soft))] uppercase tracking-[0.18em]">
                Healing Facilitator · Somatic &amp; Nervous-System Work · Mumbai
              </p>
              <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.65)] leading-relaxed pt-2">
                CBT-informed coaching, hypnotherapy, sound healing, vagus regulation, and breathwork.
              </p>
            </div>
          </Reveal>

          <Reveal delay={250} className="space-y-6 md:pt-12">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-[hsl(var(--av-parchment)/0.15)] shadow-2xl bg-[hsl(var(--av-night)/0.6)] backdrop-blur-md">
              <Image
                src={ARCHANA}
                alt="Archana Jain, Vedic Practitioner and Healer, Jaipur"
                fill
                sizes="(min-width: 768px) 40vw, 100vw"
                placeholder="blur"
                blurDataURL={BLUR}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--av-ink)/0.8)] via-transparent to-transparent" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl md:text-3xl text-[hsl(var(--av-parchment))]">
                Archana Jain
              </h3>
              <p className="font-body text-sm text-[hsl(var(--av-gold-soft))] uppercase tracking-[0.18em]">
                Vedic Practitioner · Astrology, Vastu, Ritual · Jaipur
              </p>
              <p className="font-body text-sm text-[hsl(var(--av-parchment)/0.65)] leading-relaxed pt-2">
                Over 25 years of lived Vedic practice, karmic reading, and space harmonization.
              </p>
            </div>
          </Reveal>
        </div>

        <Reveal delay={350} className="text-center pt-6">
          <Link
            href="/about"
            className="font-body text-sm text-[hsl(var(--av-parchment))] underline underline-offset-8 decoration-[hsl(var(--av-parchment)/0.3)] hover:decoration-[hsl(var(--av-gold))] transition-colors"
          >
            Read the full founder story &rarr;
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function ServicesSection() {
  const items = [
    {
      k: "1:1",
      s: "With Sejal or Archana",
      p: "Private",
      d: "One-to-one sessions with Sejal (Mumbai) or Archana (Jaipur) — held online or in person.",
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
      k: "Shop",
      s: "Crystals · Jaipur",
      p: "Curated",
      d: "A curated crystal shop rooted in Jaipur — pieces chosen with care for practice and presence.",
      img: HERBS,
    },
  ];

  return (
    <section id="services" className="relative px-6 py-32 md:px-16 md:py-44">
      <div className="mx-auto max-w-[1300px]">
        <Reveal className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="av-eyebrow mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
              07 — Services
            </p>
            <h2 className="font-serif text-[38px] leading-[1.05] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[60px]">
              Three <span className="italic text-[hsl(var(--av-gold-soft))]">doorways.</span>
            </h2>
          </div>
          <Link
            href="/step-1"
            className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-[hsl(var(--av-gold-soft))] transition-colors hover:text-[hsl(var(--av-parchment))]"
          >
            <span>Begin Your Journey</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">&rarr;</span>
          </Link>
        </Reveal>

        <div className="mt-16 space-y-4">
          {items.map((it, i) => (
            <Reveal
              key={it.k}
              delay={i * 100}
              className="group grid grid-cols-1 items-center gap-8 rounded-2xl border border-[hsl(var(--av-parchment)/0.12)] bg-[hsl(var(--av-night)/0.5)] backdrop-blur-md p-6 md:p-8 transition-all duration-700 hover:border-[hsl(var(--av-gold)/0.4)] hover:bg-[hsl(var(--av-night)/0.75)] md:grid-cols-12 md:gap-10 shadow-lg"
            >
              <div className="relative h-44 overflow-hidden rounded-xl md:col-span-3">
                <Image
                  src={it.img}
                  alt={it.s}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                  className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                />
              </div>
              <div className="md:col-span-3">
                <div className="font-serif text-3xl text-[hsl(var(--av-parchment))]">
                  {it.k}
                </div>
                <div className="mt-2 text-[11px] uppercase tracking-[0.24em] text-[hsl(var(--av-gold-soft))]">
                  {it.s}
                </div>
              </div>
              <p className="text-[14px] leading-[1.9] text-[hsl(var(--av-parchment)/0.7)] md:col-span-4">
                {it.d}
              </p>
              <div className="flex items-center justify-between md:col-span-2 md:justify-end">
                <span className="grid h-11 w-11 place-items-center rounded-full border border-[hsl(var(--av-parchment)/0.25)] text-[hsl(var(--av-parchment))] transition-all duration-500 group-hover:border-[hsl(var(--av-gold))] group-hover:bg-[hsl(var(--av-gold))] group-hover:text-[hsl(var(--av-ink))]">
                  &rarr;
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CrystalsSection() {
  const [products, setProducts] = useState<ProductView[]>([]);

  useEffect(() => {
    fetch("/api/products?category=Crystals&limit=3&isActive=true")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        const all: ProductView[] = data?.products ?? [];
        setProducts(all.filter((p) => p.category === "Crystals").slice(0, 3));
      })
      .catch(() => {});
  }, []);

  return (
    <section id="crystals" className="relative px-6 py-32 md:px-16 md:py-44">
      <div className="mx-auto max-w-[1300px] text-center">
        <Reveal>
          <p className="av-eyebrow mb-6 inline-flex items-center gap-4">
            <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
            08 — Sacred Shop
            <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="font-serif text-[38px] leading-[1.05] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[60px]">
            Crystals, <span className="italic text-[hsl(var(--av-gold-soft))]">Chosen.</span>
          </h2>
        </Reveal>
        <Reveal delay={240} className="mt-6 max-w-xl mx-auto text-[15px] text-[hsl(var(--av-parchment)/0.7)] leading-relaxed">
          Energized and curated in Jaipur for grounding, meditation, and daily space harmonization.
        </Reveal>

        {products.length > 0 && (
          <Reveal delay={360} className="mt-12 flex flex-wrap items-center justify-center gap-6">
            {products.map((p) => (
              <Link
                key={p.id}
                href={`/shop/${p.slug}`}
                className="rounded-full border border-[hsl(var(--av-parchment)/0.2)] bg-[hsl(var(--av-night)/0.5)] px-6 py-3 text-sm text-[hsl(var(--av-parchment)/0.8)] backdrop-blur-md transition-all duration-300 hover:border-[hsl(var(--av-gold))] hover:text-[hsl(var(--av-gold-soft))] hover:shadow-lg"
              >
                {p.title} &rarr;
              </Link>
            ))}
          </Reveal>
        )}

        <Reveal delay={480} className="mt-12">
          <Link
            href="/shop"
            className="inline-flex items-center gap-3 border-b border-[hsl(var(--av-gold)/0.5)] pb-1 text-[11px] uppercase tracking-[0.3em] text-[hsl(var(--av-gold-soft))] transition-all duration-300 hover:text-[hsl(var(--av-parchment))] hover:border-[hsl(var(--av-parchment))]"
          >
            <span>Enter the Full Shop</span>
            <span>&rarr;</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

function DiscoverySection() {
  return (
    <section
      id="discovery"
      className="relative overflow-hidden px-6 py-32 md:px-16 md:py-44"
    >
      <div className="relative mx-auto max-w-[1000px] text-center rounded-3xl border border-[hsl(var(--av-gold)/0.3)] bg-[hsl(var(--av-night)/0.6)] backdrop-blur-xl p-10 md:p-20 shadow-2xl">
        <Reveal>
          <p className="av-eyebrow mb-8 inline-flex items-center gap-4">
            <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
            09 — Discovery
            <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
          </p>
        </Reveal>
        <Reveal delay={120}>
          <h2 className="font-serif text-[42px] leading-[1.02] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[72px]">
            A quiet
            <br />
            <span className="italic text-[hsl(var(--av-gold-soft))]">conversation.</span>
          </h2>
        </Reveal>
        <Reveal
          delay={240}
          className="mx-auto mt-8 max-w-xl text-[15px] leading-[1.95] text-[hsl(var(--av-parchment)/0.75)]"
        >
          About fifteen quiet minutes with Sejal or Archana. No pressure. A listening, so we
          may know if this practice is right for you. Start in the portal — your decode
          informs the call.
        </Reveal>
        <Reveal delay={360} className="mt-12 flex flex-col items-center gap-6">
          <Link
            href="/step-1"
            className="group inline-flex items-center gap-6 border border-[hsl(var(--av-gold)/0.8)] bg-[hsl(var(--av-gold)/0.15)] px-10 py-5 text-[12px] uppercase tracking-[0.32em] text-[hsl(var(--av-parchment))] backdrop-blur-md transition-all duration-700 hover:bg-[hsl(var(--av-gold))] hover:text-[hsl(var(--av-ink))] shadow-xl"
          >
            <span>Begin Your Journey</span>
            <BeginArrow />
          </Link>
          <a
            href="mailto:hello@aumveda.com?subject=Discovery%20Call"
            className="text-[11px] uppercase tracking-[0.28em] text-[hsl(var(--av-parchment)/0.45)] transition-colors hover:text-[hsl(var(--av-gold-soft))]"
          >
            Or write to us: hello@aumveda.com
          </a>
        </Reveal>
        <Reveal
          delay={480}
          className="mt-8 text-[10px] uppercase tracking-[0.32em] text-[hsl(var(--av-parchment)/0.35)]"
        >
          Jaipur · Mumbai · Online
        </Reveal>
      </div>
    </section>
  );
}

function TestimonialsSection() {
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
    <section id="reflections" className="relative px-6 py-32 md:px-16 md:py-44">
      <div className="mx-auto max-w-[1300px]">
        <Reveal>
          <p className="av-eyebrow mb-6 flex items-center gap-4">
            <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
            10 — Reflections
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {quotes.map((q, i) => (
            <Reveal
              key={q.a}
              delay={i * 140}
              className="flex flex-col justify-between rounded-2xl border border-[hsl(var(--av-parchment)/0.12)] bg-[hsl(var(--av-night)/0.5)] backdrop-blur-md p-8 md:p-10 shadow-lg"
            >
              <div>
                <span className="font-serif text-3xl text-[hsl(var(--av-gold)/0.6)]">“</span>
                <p className="mt-4 font-serif text-xl leading-[1.6] text-[hsl(var(--av-parchment))]">
                  {q.q}
                </p>
              </div>
              <div className="mt-10 pt-6 border-t border-[hsl(var(--av-parchment)/0.1)]">
                <div className="font-serif text-sm text-[hsl(var(--av-parchment))]">{q.a}</div>
                <div className="text-[10px] uppercase tracking-[0.24em] text-[hsl(var(--av-gold-soft))]">
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

function InsightsSection() {
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
    <section id="insights" className="relative px-6 py-32 md:px-16 md:py-44">
      <div className="mx-auto max-w-[1300px]">
        <Reveal className="flex flex-wrap items-end justify-between gap-8">
          <div>
            <p className="av-eyebrow mb-6 flex items-center gap-4">
              <span className="h-px w-10 bg-[hsl(var(--av-gold))]" />
              11 — Insights
            </p>
            <h2 className="font-serif text-[38px] leading-[1.05] tracking-[-0.02em] text-[hsl(var(--av-parchment))] md:text-[58px]">
              Field notes from the{" "}
              <span className="italic text-[hsl(var(--av-gold-soft))]">practice.</span>
            </h2>
          </div>
        </Reveal>
        <div className="mt-16 space-y-3">
          {posts.map((p, i) => (
            <Reveal key={p.t} delay={i * 100}>
              <Link
                href={p.href}
                className="group grid grid-cols-1 items-baseline gap-4 rounded-xl border border-[hsl(var(--av-parchment)/0.08)] bg-[hsl(var(--av-night)/0.4)] backdrop-blur-sm p-6 transition-all duration-500 hover:border-[hsl(var(--av-gold)/0.4)] hover:bg-[hsl(var(--av-night)/0.7)] md:grid-cols-12 md:gap-8"
              >
                <span className="text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-gold-soft))] md:col-span-2">
                  {p.d}
                </span>
                <h3 className="font-serif text-xl text-[hsl(var(--av-parchment))] md:col-span-7 md:text-2xl">
                  {p.t}
                </h3>
                <span className="text-[11px] uppercase tracking-[0.22em] text-[hsl(var(--av-parchment)/0.45)] md:col-span-2">
                  {p.c}
                </span>
                <span className="text-[hsl(var(--av-parchment))] md:col-span-1 md:text-right">
                  <span className="inline-block transition-transform duration-500 group-hover:translate-x-2">
                    &rarr;
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function HomeFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-[hsl(var(--av-parchment)/0.12)] bg-[hsl(var(--av-ink)/0.9)] backdrop-blur-xl px-6 pb-16 pt-28 md:px-16 md:pb-20">
      <div className="mx-auto max-w-[1300px]">
        <Reveal>
          <div className="font-serif text-[16vw] leading-[0.85] tracking-[-0.04em] text-[hsl(var(--av-parchment)/0.08)] select-none">
            AUMVEDA
          </div>
        </Reveal>
        <div className="mt-14 grid grid-cols-2 gap-10 border-t border-[hsl(var(--av-parchment)/0.1)] pt-10 md:grid-cols-4 md:gap-8">
          <div>
            <div className="av-eyebrow">Presence</div>
            <p className="mt-4 font-serif text-base leading-relaxed text-[hsl(var(--av-parchment))]">
              Jaipur · Mumbai
              <br />
              Online
            </p>
          </div>
          <div>
            <div className="av-eyebrow">Correspondence</div>
            <a
              href="mailto:hello@aumveda.com"
              className="mt-4 block font-serif text-base text-[hsl(var(--av-parchment))] transition-colors hover:text-[hsl(var(--av-gold-soft))]"
            >
              hello@aumveda.com
            </a>
          </div>
          <div>
            <div className="av-eyebrow">Explore</div>
            <ul className="mt-4 space-y-2 text-sm text-[hsl(var(--av-parchment)/0.8)]">
              {[
                { l: "About", href: "/about" },
                { l: "Services", href: "/services" },
                { l: "Programs", href: "/programs" },
                { l: "Shop", href: "/shop" },
                { l: "Insights", href: "/insights" },
              ].map((item) => (
                <li key={item.l}>
                  <Link
                    href={item.href}
                    className="hover:text-[hsl(var(--av-gold-soft))] transition-colors"
                  >
                    {item.l}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="av-eyebrow">Practice</div>
            <p className="mt-4 text-[13px] leading-[1.8] text-[hsl(var(--av-parchment)/0.6)]">
              Mother–daughter Neuro-Vedic healing. Your Daily Dose of Healing — held with
              care.
            </p>
            <Link
              href="/step-1"
              className="mt-5 inline-flex text-[11px] uppercase tracking-[0.26em] text-[hsl(var(--av-gold))] transition-colors hover:text-[hsl(var(--av-gold-soft))]"
            >
              Begin Your Journey &rarr;
            </Link>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-[hsl(var(--av-parchment)/0.1)] pt-8 text-[10px] uppercase tracking-[0.26em] text-[hsl(var(--av-parchment)/0.4)] md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} AUMVEDA · Jaipur · Mumbai</div>
          <div className="flex gap-8">
            <Link href="/privacy-policy" className="transition-colors hover:text-[hsl(var(--av-parchment))]">
              Privacy
            </Link>
            <Link href="/terms-of-service" className="transition-colors hover:text-[hsl(var(--av-parchment))]">
              Terms
            </Link>
            <Link href="/auth/login?portal=client" className="transition-colors hover:text-[hsl(var(--av-parchment))]">
              Client login
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[hsl(var(--av-gold))] animate-av-breathe" />
            In practice
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Unified AUMVEDA Homepage:
 * - Gemini video preloader with glowing ॐ monogram & status progress
 * - Continuous video scrub / 3D canvas background (MasterFilm)
 * - Full canonical editorial marketing narrative & sections
 */
export default function HomePage() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    preloadHeroAssets();
  }, []);

  return (
    <>
      <CinematicPreloader />
      <SceneCanvas />
      <ScrollProvider rootRef={rootRef}>
        <FloatingNav />
        <SectionRail />
        <main className="relative z-10 text-[hsl(var(--av-parchment))]">
          <HeroSection />
          <FounderStorySection />
          <PhilosophySection />
          <DailyDoseSection />
          <JourneySection />
          <HealersSection />
          <ServicesSection />
          <CrystalsSection />
          <DiscoverySection />
          <TestimonialsSection />
          <InsightsSection />
          <HomeFooter />
        </main>
      </ScrollProvider>
    </>
  );
}
