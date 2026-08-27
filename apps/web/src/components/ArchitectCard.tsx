"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ArchitectCardProps {
  architect: any;
  onClick: () => void;
  variant?: 'blue' | 'amber';
}

const ArchitectCard: React.FC<ArchitectCardProps> = ({ architect, onClick, variant = 'blue' }) => {
  return (
    <motion.div
      whileHover={{ y: -10 }}
      onClick={onClick}
      className="group cursor-pointer relative"
    >
      {/* Dynamic Glow Effect */}
      <div className={cn(
        "absolute -inset-4 rounded-[60px] opacity-0 group-hover:opacity-20 blur-3xl transition-all duration-700 -z-10",
        variant === 'blue' ? "bg-night" : "bg-amber-500"
      )} />

      <div className="aspect-[4/5] rounded-[60px] overflow-hidden mb-8 relative border border-slate-100 shadow-sm group-hover:shadow-2xl transition-all duration-500">
        <img
          src={architect.image}
          alt={architect.name}
          className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
        />

        {/* Overlay Info */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/10 backdrop-blur-xl rounded-[40px] border border-white/20 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
          <div className="flex items-center justify-between mb-4">
            <div className={cn(
              "flex items-center gap-2",
              variant === 'blue' ? "text-gold" : "text-amber-400"
            )}>
              {variant === 'blue' ? <ShieldCheck className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              <span className="text-[10px] font-black uppercase tracking-widest">System Designer</span>
            </div>
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
          <p className="text-sm text-white/90 leading-relaxed font-medium">
            Click to explore the {architect.role.split(' ')[0]} architecture protocols.
          </p>
        </div>
      </div>

      <div className="space-y-2 text-center md:text-left px-4">
        <h4 className="text-3xl font-serif font-bold text-slate-900 group-hover:text-slate-700 transition-colors">
          {architect.name}
        </h4>
        <p className={cn(
          "font-black uppercase tracking-[0.3em] text-[10px]",
          variant === 'blue' ? "text-night" : "text-amber-600"
        )}>
          {architect.role}
        </p>
      </div>
    </motion.div>
  );
};

export default ArchitectCard;
