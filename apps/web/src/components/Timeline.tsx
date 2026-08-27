"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain, Globe, ShieldCheck } from 'lucide-react';

const EVENTS = [
  {
    year: "2012",
    title: "The Clinical Foundation",
    desc: "Dr. Sejal Jain begins her doctoral research into the limitations of traditional CBT in treating deep-seated subconscious trauma.",
    icon: Brain,
    color: "text-night",
    bg: "bg-gold/10"
  },
  {
    year: "2015",
    title: "Celestial Integration",
    desc: "Archana Jain synthesizes Vedic astrology with Western psychological archetypes, creating a new framework for life-path mapping.",
    icon: Sparkles,
    color: "text-amber-500",
    bg: "bg-amber-50"
  },
  {
    year: "2018",
    title: "The Synthesis Protocol",
    desc: "The sisters merge their practices to create the first multi-dimensional assessment system, bridging clinical science and metaphysics.",
    icon: Globe,
    color: "text-emerald-500",
    bg: "bg-emerald-50"
  },
  {
    year: "2023",
    title: "Aumveda Digital Sanctuary",
    desc: "Launch of the proprietary AI-driven platform, ensuring forensic-level data security and personalized wellness protocols.",
    icon: ShieldCheck,
    color: "text-night",
    bg: "bg-gold/10"
  }
];

const Timeline = () => {
  return (
    <div className="relative space-y-12 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
      {EVENTS.map((event, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.2 }}
          className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-slate-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
            <event.icon className={`w-4 h-4 ${event.color}`} />
          </div>

          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-[32px] bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-2">
              <span className={`text-xs font-black uppercase tracking-widest ${event.color}`}>{event.year}</span>
            </div>
            <h4 className="text-lg font-bold text-slate-900 mb-2">{event.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed">{event.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Timeline;
