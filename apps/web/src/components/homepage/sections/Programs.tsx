"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useSectionReveal } from "../useSectionReveal";
import { CheckCircle2, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const PROGRAMS = [
  {
    name: "21-Day Synthesis",
    tagline: "Full-Spectrum Nervous System & Karmic Reset",
    price: "₹45,000",
    badge: "Fast Immersion",
    color: "border-[hsl(var(--av-stone)/0.3)] bg-[hsl(var(--av-ink)/0.8)]",
    features: [
      "Daily 1:1 sessions with Sejal & Archana",
      "Custom 528 Hz binaural audio protocol",
      "Vedic astrology & karmic chart reading",
      "Reflective journal & nervous system tracking",
      "Personalised daily AHI synthesis score",
    ],
    cta: "Inquire Now",
    featured: false,
  },
  {
    name: "Cosmic Alignment",
    tagline: "3-Month Deep Psychological & Cosmic Transformation",
    price: "₹1,20,000",
    badge: "Most Popular",
    color: "border-[hsl(var(--av-gold)/0.6)] bg-gradient-to-b from-[hsl(var(--av-ink)/0.9)] to-[hsl(var(--av-night))] ring-1 ring-[hsl(var(--av-gold)/0.4)]",
    features: [
      "90-day comprehensive guided journey",
      "Residential or commercial Vastu audit",
      "Kundli & Tarot archetypal breakdown",
      "Monthly sound & breathwork retreats",
      "Unlimited practitioner direct correspondence",
    ],
    cta: "Apply for Alignment",
    featured: true,
  },
  {
    name: "Executive Sanctuary",
    tagline: "Bespoke Wellness & Spatial Architecture for Leaders",
    price: "Custom",
    badge: "Elite High-Performance",
    color: "border-[hsl(var(--av-stone)/0.3)] bg-[hsl(var(--av-ink)/0.8)]",
    features: [
      "Executive 1:1 neuro-somatic coaching",
      "High-stress downshift protocols",
      "Workspace energetic Vastu restructuring",
      "Bioresonance frequency harmonization",
      "KPI & cognitive stamina metrics",
    ],
    cta: "Request Bespoke",
    featured: false,
  },
];

const PATHWAYS = [
  {
    k: "1:1 Practice",
    s: "Private & Bespoke",
    d: "Direct one-to-one sessions with Sejal (Mumbai) or Archana (Jaipur) — held online or in person.",
    href: "/services",
  },
  {
    k: "Community Circles",
    s: "Shared Ritual",
    d: "Live monthly circles for collective breath, moon rituals, and meditation.",
    href: "/community",
  },
  {
    k: "Sacred Apothecary",
    s: "Jaipur Sourced",
    d: "Energized crystals, yantras, and biofield tools aligned with your specific chakra.",
    href: "/shop",
  },
];

export function Programs() {
  const ref = useRef<HTMLElement>(null);
  useSectionReveal(ref);

  return (
    <section
      id="programs"
      ref={ref}
      className="relative min-h-screen w-full py-28 px-6 md:px-16 text-[hsl(var(--av-parchment))] flex flex-col items-center justify-center space-y-20"
    >
      <div className="text-center max-w-3xl space-y-6">
        <div data-reveal className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[hsl(var(--av-gold)/0.4)] bg-[hsl(var(--av-night)/0.6)] backdrop-blur-md text-[10px] font-black uppercase tracking-[0.3em] text-[hsl(var(--av-gold))]">
          <Sparkles className="w-3 h-3" /> Structured Evolution Protocols
        </div>
        <h2
          data-reveal
          className="av-film-title font-serif text-[8vw] md:text-[4.2vw] leading-[1.05] tracking-[-0.02em] text-[hsl(var(--av-parchment))]"
        >
          Transformation <span className="italic text-[hsl(var(--av-copper-soft))]">Protocols.</span>
        </h2>
        <p data-reveal className="font-body text-sm md:text-base text-[hsl(var(--av-parchment)/0.75)] max-w-xl mx-auto leading-relaxed">
          Time-bound, structured arcs that integrate Eastern Vedic wisdom with Western nervous system regulation for permanent change.
        </p>
      </div>

      {/* 3 Core Tier Programs Grid */}
      <div data-reveal className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {PROGRAMS.map((p) => (
          <div
            key={p.name}
            className={`relative rounded-[36px] p-8 md:p-10 border backdrop-blur-xl flex flex-col justify-between transition-all duration-500 hover:border-[hsl(var(--av-gold))] shadow-2xl ${p.color}`}
          >
            {p.featured && (
              <div className="absolute -top-3.5 right-8 px-3.5 py-1 rounded-full bg-[hsl(var(--av-gold))] text-[hsl(var(--av-ink))] text-[9px] font-black uppercase tracking-widest shadow-lg">
                {p.badge}
              </div>
            )}
            {!p.featured && (
              <div className="inline-block self-start px-3 py-1 rounded-full bg-[hsl(var(--av-stone)/0.2)] text-[hsl(var(--av-parchment)/0.7)] text-[9px] font-black uppercase tracking-widest mb-4">
                {p.badge}
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="font-serif text-2xl md:text-3xl font-bold text-[hsl(var(--av-parchment))]">{p.name}</h3>
                <p className="font-body text-xs text-[hsl(var(--av-parchment)/0.6)] mt-2 leading-relaxed">{p.tagline}</p>
              </div>

              <ul className="space-y-3 pt-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-xs text-[hsl(var(--av-parchment)/0.85)] leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[hsl(var(--av-gold))] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 mt-8 border-t border-[hsl(var(--av-stone)/0.2)] flex items-center justify-between gap-4">
              <div>
                <span className="font-body text-[9px] uppercase tracking-widest text-[hsl(var(--av-parchment)/0.5)] block">
                  {p.price !== 'Custom' ? 'Starting at' : 'Investment'}
                </span>
                <span className="font-serif text-2xl font-bold text-[hsl(var(--av-gold-soft))]">{p.price}</span>
              </div>
              <Button asChild className="rounded-xl px-5 h-11 bg-[hsl(var(--av-parchment))] hover:bg-white text-[hsl(var(--av-ink))] text-xs font-bold transition-all shadow-md">
                <Link href="/contact">{p.cta}</Link>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* 3 Modality Pathways */}
      <div data-reveal className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        {PATHWAYS.map((item) => (
          <Link
            key={item.k}
            href={item.href}
            className="group rounded-2xl border border-[hsl(var(--av-stone)/0.25)] bg-[hsl(var(--av-ink)/0.5)] backdrop-blur-md p-6 transition-all duration-300 hover:border-[hsl(var(--av-gold)/0.5)] hover:bg-[hsl(var(--av-ink)/0.8)] flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg font-bold text-[hsl(var(--av-parchment))]">{item.k}</span>
                <span className="font-body text-[10px] uppercase tracking-widest text-[hsl(var(--av-gold))]">{item.s}</span>
              </div>
              <p className="font-body text-xs text-[hsl(var(--av-parchment)/0.65)] leading-relaxed">{item.d}</p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-[hsl(var(--av-gold-soft))] group-hover:text-white transition-colors">
              <span>Explore</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
