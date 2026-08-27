"use client";

import React from 'react';
import { XCircle, CheckCircle2, Layers, Zap, BrainCircuit, Moon, Music, Sparkles } from 'lucide-react';

const IntegrationSection = () => {
  return (
    <section className="py-24 bg-slate-900 rounded-[60px] mx-4 overflow-hidden relative">
      <div className="absolute top-0 left-0 p-24 opacity-5">
        <Layers className="w-96 h-96 text-white" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-3 h-3" /> The Systemic Gap
            </div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
              Why Traditional <br />
              <span className="text-rose-400 italic">Healing Fails</span>
            </h2>
            <p className="text-lg text-slate-400 leading-relaxed">
              Most approaches treat the human experience as a collection of isolated parts.
              Psychology ignores the environment; astrology ignores the subconscious;
              medicine ignores the energetic bio-field.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
                  <XCircle className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Fragmentation</h4>
                  <p className="text-sm text-slate-500">Treating symptoms in silos leads to temporary relief but systemic stagnation.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-white font-bold">Aumveda Integration</h4>
                  <p className="text-sm text-slate-500">We synchronize your mental, subconscious, spatial, and cosmic layers into a single, coherent protocol.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-square rounded-[40px] bg-white/5 border border-white/10 flex flex-col items-center justify-center p-8 text-center animate-float">
                  <BrainCircuit className="w-10 h-10 text-gold mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Neural Nodes</span>
                </div>
                <div className="aspect-square rounded-[40px] bg-white/5 border border-white/10 flex flex-col items-center justify-center p-8 text-center animate-float-delayed">
                  <Sparkles className="w-10 h-10 text-amber-400 mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Karmic Flow</span>
                </div>
              </div>
              <div className="space-y-4 pt-12">
                <div className="aspect-square rounded-[40px] bg-white/5 border border-white/10 flex flex-col items-center justify-center p-8 text-center animate-float-delayed">
                  <Moon className="w-10 h-10 text-gold mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subconscious</span>
                </div>
                <div className="aspect-square rounded-[40px] bg-white/5 border border-white/10 flex flex-col items-center justify-center p-8 text-center animate-float">
                  <Music className="w-10 h-10 text-gold mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cellular Resonance</span>
                </div>
              </div>
            </div>
            {/* Connecting Lines (Visual Only) */}
            <div className="absolute inset-0 neural-mesh opacity-20 pointer-events-none" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default IntegrationSection;
