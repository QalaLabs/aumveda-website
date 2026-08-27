"use client";

import React from 'react';
import { ShieldCheck, Zap, Home } from 'lucide-react';
import { Button } from "@/components/ui/button";
import Link from "next/link";

const CorporateWellness = () => {
  return (
    <section className="py-24 bg-slate-900 rounded-[60px] mx-4 overflow-hidden relative">
      <div className="absolute inset-0 neural-mesh opacity-10" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-night/10 border border-night/20 text-gold text-[10px] font-black uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" /> Institutional Evolution
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
              Corporate <br />
              <span className="text-gold italic">Vastu &amp; Wellness</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              We optimize organizational performance by aligning the physical workspace with
              Vedic spatial laws and the psychological health of the leadership team.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-3">
                <Home className="w-8 h-8 text-emerald-400" />
                <h4 className="text-white font-bold">Spatial Audit</h4>
                <p className="text-xs text-slate-500">Vastu protocols to remove energetic friction in the boardroom.</p>
              </div>
              <div className="p-6 rounded-[32px] bg-white/5 border border-white/10 space-y-3">
                <Zap className="w-8 h-8 text-amber-400" />
                <h4 className="text-white font-bold">Peak Flow</h4>
                <p className="text-xs text-slate-500">Neuro-reprogramming for high-stakes decision making.</p>
              </div>
            </div>

            <Button asChild className="h-16 px-10 rounded-2xl bg-night text-white hover:bg-night font-bold text-lg">
              <Link href="/contact">Inquire for Organizations</Link>
            </Button>
          </div>

          <div className="relative aspect-square rounded-[60px] overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1000"
              alt="Modern Corporate Office"
              className="w-full h-full object-cover grayscale opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-night/20 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CorporateWellness;
