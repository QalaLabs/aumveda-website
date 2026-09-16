"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Heart } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TimelineStep {
  day: string;
  title: string;
  neurological: string;
  emotional: string;
  icon: React.ElementType;
}

interface ProgramTimelineProps {
  steps: TimelineStep[];
  color: string;
}

const ProgramTimeline: React.FC<ProgramTimelineProps> = ({ steps, color }) => {
  return (
    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-100">
      {steps.map((step, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="relative flex items-start gap-8 group"
        >
          <div className={cn(
            "relative z-10 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
            color
          )}>
            <step.icon className="w-4 h-4 text-white" />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">{step.day}</span>
              <h4 className="text-lg font-bold text-slate-900">{step.title}</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gold/10 border border-gold/20">
                <div className="flex items-center gap-2 mb-2">
                  <BrainCircuit className="w-3 h-3 text-night" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-night">Neurological Shift</span>
                </div>
                <p className="text-xs text-night/70 leading-relaxed">{step.neurological}</p>
              </div>
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100/50">
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-3 h-3 text-amber-500" />
                  <span className="text-[9px] font-black uppercase tracking-widest text-amber-600">Emotional State</span>
                </div>
                <p className="text-xs text-amber-800/70 leading-relaxed">{step.emotional}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default ProgramTimeline;
