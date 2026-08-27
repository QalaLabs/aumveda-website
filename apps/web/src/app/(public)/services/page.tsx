"use client";

import React from 'react';
import ServiceCard from "@/components/ServiceCard";
import {
  BrainCircuit,
  Sparkles,
  Music,
  Wind,
  MessageSquare,
  Zap,
  CalendarCheck,
  Moon,
  Home,
  Gem,
  Layers,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const SEJAL_SERVICES = [
  {
    title: "CBT (Reframing System)",
    shortDesc: "Cognitive Behavioral Re-architecture",
    whatItIs: "A structured approach to identifying and restructuring the mental frameworks that dictate your emotional reality.",
    whoItIsFor: "Individuals trapped in negative thought loops, chronic anxiety, or self-limiting belief systems.",
    outcome: "Cognitive clarity, emotional resilience, and a systematic shift in behavioral patterns.",
    icon: BrainCircuit,
    color: "text-blue-600",
    bg: "bg-blue-50",
    accent: "bg-blue-400"
  },
  {
    title: "Hypnosis",
    shortDesc: "Subconscious Rewiring",
    whatItIs: "Deep-state trance work designed to bypass the critical conscious mind and plant seeds of transformation directly into the subconscious.",
    whoItIsFor: "Those struggling with deep-seated habits, phobias, or trauma that conscious effort hasn't resolved.",
    outcome: "Rapid subconscious alignment and the dissolution of long-standing internal blockages.",
    icon: Moon,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    accent: "bg-indigo-400"
  },
  {
    title: "Sound Therapy",
    shortDesc: "Frequency Regulation",
    whatItIs: "The use of Solfeggio frequencies and binaural beats to entrain the brain into states of deep healing and coherence.",
    whoItIsFor: "High-stress professionals and individuals seeking a non-verbal path to nervous system regulation.",
    outcome: "Profound nervous system harmony and a measurable reduction in cortisol levels.",
    icon: Music,
    color: "text-purple-600",
    bg: "bg-purple-50",
    accent: "bg-purple-400"
  },
  {
    title: "Breathwork",
    shortDesc: "Nervous System Reset",
    whatItIs: "Active meditation through controlled breathing patterns to release stored somatic tension and oxygenate the cellular body.",
    whoItIsFor: "Anyone experiencing burnout, emotional stagnation, or a disconnected mind-body state.",
    outcome: "Immediate physiological calm and a renewed sense of vital energy flow.",
    icon: Wind,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    accent: "bg-emerald-400"
  },
  {
    title: "Talk Therapy",
    shortDesc: "Conscious Processing",
    whatItIs: "A safe, non-judgmental space for verbal exploration of life's complexities, guided by structured psychological principles.",
    whoItIsFor: "Individuals seeking clarity on relationships, career transitions, or general mental health support.",
    outcome: "Deepened self-understanding and the development of healthy coping mechanisms.",
    icon: MessageSquare,
    color: "text-slate-600",
    bg: "bg-slate-100",
    accent: "bg-slate-400"
  },
  {
    title: "Bioresonance Frequency Therapy",
    shortDesc: "Electromagnetic Healing",
    whatItIs: "Utilizing advanced bio-feedback technology to analyze and harmonize the body's unique electromagnetic signature.",
    whoItIsFor: "Those dealing with chronic fatigue, energetic depletion, or unexplained physical imbalances.",
    outcome: "Restored cellular vitality and optimized energetic bio-field coherence.",
    icon: Zap,
    color: "text-amber-600",
    bg: "bg-amber-50",
    accent: "bg-amber-400"
  },
  {
    title: "Behavior Dosing",
    shortDesc: "Daily Healing Protocol System",
    whatItIs: "A proprietary system of micro-interventions designed to integrate healing into the fabric of your daily life.",
    whoItIsFor: "Seekers who want to bridge the gap between therapy sessions and real-world application.",
    outcome: "Sustainable lifestyle transformation through consistent, small-scale systemic shifts.",
    icon: CalendarCheck,
    color: "text-rose-600",
    bg: "bg-rose-50",
    accent: "bg-rose-400"
  }
];

const ARCHANA_SERVICES = [
  {
    title: "Astrology",
    shortDesc: "Vedic + Western Synthesis",
    whatItIs: "A comprehensive mapping of your soul's blueprint using both ancient Jyotish and modern Western astrological techniques.",
    whoItIsFor: "Seekers looking for life purpose, timing for major decisions, and understanding karmic patterns.",
    outcome: "A clear cosmic roadmap and a profound sense of alignment with universal timing.",
    icon: Sparkles,
    color: "text-amber-600",
    bg: "bg-amber-50",
    accent: "bg-amber-400"
  },
  {
    title: "Tarot / Angel Cards",
    shortDesc: "Intuitive Guidance",
    whatItIs: "Archetypal divination to tap into the collective unconscious and provide immediate answers to pressing life questions.",
    whoItIsFor: "Individuals at a crossroads needing immediate clarity or a fresh perspective on a specific situation.",
    outcome: "Actionable intuitive direction and the peace that comes from spiritual confirmation.",
    icon: Layers,
    color: "text-purple-600",
    bg: "bg-purple-50",
    accent: "bg-purple-400"
  },
  {
    title: "Vastu Shastra",
    shortDesc: "Residential + Commercial",
    whatItIs: "The ancient science of architecture and spatial geometry to align your physical environment with natural laws.",
    whoItIsFor: "Homeowners and business owners seeking to remove energetic obstacles to prosperity and peace.",
    outcome: "A harmonized living or working environment that actively supports your growth and success.",
    icon: Home,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    accent: "bg-emerald-400"
  },
  {
    title: "Crystallomancy",
    shortDesc: "Vibrational Alignment",
    whatItIs: "The strategic use of mineral vibrations to amplify intentions and clear stagnant energy from the bio-field.",
    whoItIsFor: "Those seeking energetic protection, amplified manifestation, or a deeper connection to Earth's frequencies.",
    outcome: "An amplified energetic state and a cleared, protected personal sanctuary.",
    icon: Gem,
    color: "text-blue-600",
    bg: "bg-blue-50",
    accent: "bg-blue-400"
  }
];

const PROGRAMS = [
  {
    title: "The 21-Day Synthesis",
    desc: "A rapid immersion into the Aumveda methodology for immediate systemic reset.",
    price: "₹45,000",
    tag: "Most Popular"
  },
  {
    title: "The Cosmic Alignment",
    desc: "A 3-month deep dive into your psychological and celestial architecture.",
    price: "₹1,20,000",
    tag: "Deep Transformation"
  },
  {
    title: "Executive Sanctuary",
    desc: "Bespoke high-performance wellness for leaders and visionaries.",
    price: "Custom",
    tag: "Elite"
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-32">
          {/* Header */}
          <header className="max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles className="w-3 h-3" /> The Architecture of Evolution
            </div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-slate-900 leading-[1.1]">
              Bespoke Paths to <br />
              <span className="text-amber-600 italic">Holistic Transcendence</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed max-w-2xl">
              Two pillars. One system. Archana Jain maps your cosmic blueprint through Astrology, Vastu,
              and Vedic sciences. Sejal Jain rewires it through CBT, hypnosis, and sound therapy.
              Together, they deliver what neither tradition can achieve alone.
            </p>
          </header>

          {/* Archana Section — FIRST (senior founder) */}
          <section className="space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-slate-100 pb-12">
              <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-600">The Eastern Pillar</h2>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Archana Jain</h3>
                <p className="text-slate-500 font-medium">Astrology · Vastu · Tarot · Crystallomancy</p>
              </div>
              <div className="flex items-center gap-3 text-amber-600 font-bold text-sm">
                <Sparkles className="w-5 h-5" />
                Ancient Wisdom Precisely Applied
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {ARCHANA_SERVICES.map((service, i) => (
                <ServiceCard key={i} {...service} />
              ))}
            </div>
          </section>

          {/* Sejal Section */}
          <section className="space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8 border-b border-slate-100 pb-12">
              <div className="space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600">The Western Pillar</h2>
                <h3 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">Sejal Jain</h3>
                <p className="text-slate-500 font-medium">CBT · Hypnosis · Sound Therapy · Breathwork</p>
              </div>
              <div className="flex items-center gap-3 text-blue-600 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                Clinical Precision meets Spiritual Depth
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {SEJAL_SERVICES.map((service, i) => (
                <ServiceCard key={i} {...service} />
              ))}
            </div>
          </section>

          {/* Programs Section */}
          <section className="py-24 bg-slate-900 rounded-[60px] mx-[-24px] px-12 md:px-24 overflow-hidden relative">
            <div className="absolute top-0 right-0 p-24 opacity-10">
              <Layers className="w-96 h-96 text-amber-400" />
            </div>

            <div className="relative z-10 space-y-16">
              <div className="text-center space-y-4">
                <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-400">Structured Transformations</h2>
                <h3 className="text-4xl md:text-6xl font-serif font-bold text-white">Aumveda Programs</h3>
                <p className="text-slate-400 max-w-2xl mx-auto">
                  Comprehensive journeys that integrate multiple pillars for profound, lasting evolution.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {PROGRAMS.map((program, i) => (
                  <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] p-10 flex flex-col justify-between group hover:bg-white/10 transition-all duration-500">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">
                          {program.tag}
                        </span>
                      </div>
                      <h4 className="text-2xl font-serif font-bold text-white">{program.title}</h4>
                      <p className="text-slate-400 text-sm leading-relaxed">{program.desc}</p>
                    </div>
                    <div className="pt-10 space-y-6">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white">{program.price}</span>
                        {program.price !== 'Custom' && <span className="text-slate-500 text-xs font-bold uppercase">Starting at</span>}
                      </div>
                      <Button asChild className="w-full bg-amber-400 text-slate-900 hover:bg-white rounded-2xl h-14 font-bold text-lg">
                        <Link href="/contact">Inquire Now</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="text-center space-y-12 py-12">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-900">
              Not sure where to <span className="text-amber-600 italic">begin?</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto text-lg">
              Book a discovery call to determine which path aligns best with your current energetic and psychological needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button asChild className="h-16 px-12 rounded-2xl bg-slate-900 hover:bg-black text-white font-bold text-lg shadow-2xl shadow-slate-200">
                <Link href="/contact">Book Discovery Call</Link>
              </Button>
              <Button asChild variant="ghost" className="h-16 px-10 rounded-2xl border border-slate-200 font-bold text-lg">
                <Link href="/about">Meet the Healers</Link>
              </Button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
