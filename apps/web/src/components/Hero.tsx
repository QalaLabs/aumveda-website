"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, ShieldCheck } from "lucide-react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden rounded-[60px] mx-4 mt-4 py-24">
      <div className="absolute inset-0 animate-cosmic z-0" />
      <div className="absolute inset-0 neural-mesh z-10 opacity-30" />

      <div className="relative z-20 max-w-5xl mx-auto text-center px-6 space-y-12">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-slate-300 text-[12px] font-sans font-semibold uppercase tracking-[0.3em] animate-fade-in">
          <Sparkles className="w-4 h-4 text-amber-400/60" /> Neuroscience meets Metaphysics
        </div>

        <h1 className="text-[48px] md:text-[80px] font-serif font-bold text-white leading-[1.1] tracking-tight animate-breathing">
          The Architecture of <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-teal-200 to-slate-200">
            Your Evolution
          </span>
        </h1>

        <p className="text-[16px] md:text-[20px] text-slate-400 max-w-2xl mx-auto leading-relaxed font-body animate-slide-up">
          We don't treat symptoms. We reprogram systems. Experience a bespoke synthesis of clinical psychology and Vedic wisdom.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-12 animate-slide-up">
          <Button asChild className="h-16 px-12 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-sans font-bold text-lg border-none">
            <Link href="/step-1">Begin Your Journey</Link>
          </Button>
          <Button asChild variant="ghost" className="text-white hover:bg-white/10 h-16 px-10 font-sans font-bold border border-white/20 rounded-2xl">
            <Link href="/services">Explore the Pillars <ArrowRight className="ml-2 w-5 h-5" /></Link>
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent z-20" />
    </section>
  );
};

export default Hero;
