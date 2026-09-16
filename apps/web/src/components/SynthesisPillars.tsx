"use client";

import React from 'react';
import { BrainCircuit, Sparkles, Home, Music, Database, CalendarCheck } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const PILLARS = [
  {
    title: "Neuro-Reprogramming",
    desc: "Integrating clinical CBT with deep-state hypnosis to rewrite subconscious patterns.",
    icon: BrainCircuit,
    color: "text-night",
    bg: "bg-gold/10"
  },
  {
    title: "Celestial Mapping",
    desc: "Vedic and Western astrology to navigate your life's karmic and cosmic currents.",
    icon: Sparkles,
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    title: "Spatial Alchemy",
    desc: "Vastu Shastra protocols to align your physical environment with your energetic goals.",
    icon: Home,
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  {
    title: "Vibrational Medicine",
    desc: "Solfeggio sound healing and bioresonance to restore cellular harmony.",
    icon: Music,
    color: "text-night",
    bg: "bg-gold/10"
  },
  {
    title: "AI Personalization",
    desc: "Proprietary algorithms that synthesize your data into daily wellness insights.",
    icon: Database,
    color: "text-night",
    bg: "bg-gold/10"
  },
  {
    title: "Ritual Architecture",
    desc: "Bespoke Dinacharya routines designed for your unique Prakriti and lifestyle.",
    icon: CalendarCheck,
    color: "text-rose-500",
    bg: "bg-rose-50"
  }
];

const SynthesisPillars = () => {
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-24 space-y-6">
          <h2 className="text-[12px] font-sans font-black uppercase tracking-[0.4em] text-primary">The Aumveda Synthesis</h2>
          <h3 className="text-[48px] font-serif font-bold text-slate-900 normal-case">Where Science Meets the Sacred</h3>
          <p className="text-[16px] font-body text-slate-500 leading-relaxed">
            Our methodology is a multi-dimensional approach to human optimization,
            bridging the gap between the tangible and the transcendental.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {PILLARS.map((pillar, i) => (
            <Card key={i} className="border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[40px] group overflow-hidden bg-slate-50/50">
              <CardContent className="p-12 space-y-8">
                <div className={`w-20 h-20 rounded-2xl ${pillar.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                  <pillar.icon className={`w-10 h-10 ${pillar.color}`} />
                </div>
                <div className="space-y-4">
                  <h4 className="text-2xl font-sans font-semibold text-slate-900">{pillar.title}</h4>
                  <p className="text-[15px] font-body text-slate-500 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SynthesisPillars;
