"use client";

import React from 'react';
import Link from 'next/link';
import { Card, CardContent } from "@/components/ui/card";
import {
  Sparkles,
  Moon,
  Sun,
  Book,
  Hash,
  UserCircle,
  ArrowRight,
  Star
} from "lucide-react";
import { motion } from "framer-motion";

const TOOLS = [
  {
    id: 'mbti',
    title: "MBTI Personality Test",
    desc: "Discover your psychological archetype with animated insights.",
    icon: UserCircle,
    color: "text-night",
    bg: "bg-gold/10",
    path: "/tools/mbti"
  },
  {
    id: 'tarot',
    title: "Tarot Picker",
    desc: "Draw from the sacred deck for immediate guidance.",
    icon: Moon,
    color: "text-night",
    bg: "bg-gold/10",
    path: "/tools/tarot"
  },
  {
    id: 'numerology',
    title: "Moolank & Bhagyank",
    desc: "Calculate your core numbers and their karmic influence.",
    icon: Hash,
    color: "text-amber-500",
    bg: "bg-amber-50",
    path: "/tools/numerology"
  },
  {
    id: 'answer-book',
    title: "The Answer Book",
    desc: "Ask a question and let the universe provide the answer.",
    icon: Book,
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    path: "/tools/answer-book"
  },
  {
    id: 'kundli',
    title: "Kundli Generator",
    desc: "Generate your Vedic birth chart and planetary positions.",
    icon: Sun,
    color: "text-orange-500",
    bg: "bg-orange-50",
    path: "/tools/kundli"
  }
];

const FreeTools = () => {
  return (
    <div className="min-h-screen bg-white">
      <main className="pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <header className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-100 text-amber-600 text-[10px] font-black uppercase tracking-[0.3em]">
              <Sparkles className="w-3 h-3" /> Free Mystical Tools
            </div>
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-slate-900 leading-tight">
              The Digital <br />
              <span className="text-amber-600">Apothecary</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed">
              Explore our suite of interactive tools designed to provide clarity,
              alignment, and a daily dose of healing.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {TOOLS.map((tool, i) => (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link href={tool.path}>
                  <Card className="border-none shadow-xl rounded-[40px] overflow-hidden bg-white group hover:shadow-2xl transition-all duration-500 h-full">
                    <CardContent className="p-10 space-y-6">
                      <div className={`w-16 h-16 rounded-2xl ${tool.bg} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                        <tool.icon className={`w-8 h-8 ${tool.color}`} />
                      </div>
                      <div className="space-y-3">
                        <h3 className="text-2xl font-serif font-bold text-slate-900">{tool.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          {tool.desc}
                        </p>
                      </div>
                      <div className="pt-4 flex items-center gap-2 text-amber-600 font-bold text-xs uppercase tracking-widest">
                        Open Tool <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>

          <section className="bg-slate-900 rounded-[60px] p-12 md:p-24 text-center space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-12 opacity-10">
              <Star className="w-64 h-64 text-amber-400" />
            </div>
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-white">AI-Powered Wisdom</h2>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
              All our tools are integrated with Gemini AI to provide personalized,
              deep-dive interpretations of your results.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
};

export default FreeTools;
