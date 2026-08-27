"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  BrainCircuit,
  Sparkles,
  ShieldCheck,
  Zap,
  Target,
  Quote,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ArchitectModalProps {
  architect: any;
  isOpen: boolean;
  onClose: () => void;
}

const ArchitectModal: React.FC<ArchitectModalProps> = ({ architect, isOpen, onClose }) => {
  if (!architect) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] rounded-[40px] border-none shadow-2xl p-0 overflow-hidden bg-white">
        <div className="grid grid-cols-1 md:grid-cols-12 h-full max-h-[90vh] overflow-y-auto">
          {/* Left: Visual Sidebar */}
          <div className="md:col-span-4 bg-slate-900 relative overflow-hidden min-h-[300px] md:min-h-full">
            <img
              src={architect.image}
              alt={architect.name}
              className="absolute inset-0 w-full h-full object-cover opacity-60 grayscale"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-400">{architect.role}</p>
              <h3 className="text-2xl font-serif font-bold text-white">{architect.name}</h3>
            </div>
          </div>

          {/* Right: Content */}
          <div className="md:col-span-8 p-8 md:p-12 space-y-10">
            <section className="space-y-4">
              <div className="flex items-center gap-2 text-night">
                <Quote className="w-5 h-5 fill-blue-600/10" />
                <span className="text-[10px] font-black uppercase tracking-widest">Philosophy Statement</span>
              </div>
              <p className="text-xl font-serif italic text-slate-800 leading-relaxed">
                &ldquo;{architect.philosophy}&rdquo;
              </p>
            </section>

            <Separator className="bg-slate-100" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Zap className="w-3 h-3 text-amber-500" /> Modalities
                </h4>
                <ul className="space-y-3">
                  {architect.modalities.map((m: string, i: number) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-medium text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      {m}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Target className="w-3 h-3 text-night" /> Signature Approach
                </h4>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {architect.approach}
                </p>
              </section>
            </div>

            <section className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" /> Real-World Impact
              </h4>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                {architect.impact}
              </p>
            </section>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button asChild className="flex-1 bg-slate-900 hover:bg-black rounded-2xl h-14 font-bold text-lg shadow-xl shadow-slate-200">
                <Link href="/contact">Book a Synthesis</Link>
              </Button>
              <Button variant="outline" onClick={onClose} className="rounded-2xl h-14 px-8 font-bold border-slate-200">
                Close Profile
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ArchitectModal;
