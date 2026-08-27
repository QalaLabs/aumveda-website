"use client";

import React from 'react';
import { BrainCircuit, Moon, Home, Music, Sparkles } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";

const PILLARS = [
  {
    title: "Mind (CBT)",
    desc: "We utilize Cognitive Behavioral Re-architecture to identify and restructure the conscious mental frameworks that dictate your emotional reality.",
    icon: BrainCircuit,
    color: "text-night",
    bg: "bg-gold/10"
  },
  {
    title: "Subconscious (Hypnosis)",
    desc: "Bypassing the critical conscious mind to plant seeds of transformation directly into the subconscious, resolving deep-seated patterns.",
    icon: Moon,
    color: "text-night",
    bg: "bg-gold/10"
  },
  {
    title: "Space (Vastu)",
    desc: "Aligning your physical environment with natural laws to remove energetic obstacles and support your psychological evolution.",
    icon: Home,
    color: "text-emerald-600",
    bg: "bg-emerald-50"
  },
  {
    title: "Energy (Sound)",
    desc: "Utilizing Solfeggio frequencies and bioresonance to entrain the nervous system into states of deep cellular coherence.",
    icon: Music,
    color: "text-night",
    bg: "bg-gold/10"
  },
  {
    title: "Destiny (Astrology)",
    desc: "Mapping your soul's blueprint through Vedic and Western synthesis to navigate karmic currents and universal timing.",
    icon: Sparkles,
    color: "text-amber-600",
    bg: "bg-amber-50"
  }
];

const PhilosophyGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {PILLARS.map((pillar, i) => (
        <Card key={i} className="border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[40px] group overflow-hidden bg-white">
          <CardContent className="p-10 space-y-6">
            <div className={`w-16 h-16 rounded-2xl ${pillar.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
              <pillar.icon className={`w-8 h-8 ${pillar.color}`} />
            </div>
            <div className="space-y-3">
              <h4 className="text-xl font-bold text-slate-900">{pillar.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
      <div className="hidden lg:flex items-center justify-center p-10">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center mx-auto animate-breathing">
            <Sparkles className="w-10 h-10 text-amber-400" />
          </div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">The Synthesis</p>
        </div>
      </div>
    </div>
  );
};

export default PhilosophyGrid;
