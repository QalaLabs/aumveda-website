"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ContentCardProps {
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  image: string;
  type: 'blog' | 'news' | 'story';
  date: string;
  slug?: string;
}

const ContentCard: React.FC<ContentCardProps> = ({ title, excerpt, category, readTime, image, type, date, slug }) => {
  const getTypeStyles = () => {
    switch (type) {
      case 'blog': return "bg-gold/10 text-night border-gold/20";
      case 'news': return "bg-amber-50 text-amber-600 border-amber-100";
      case 'story': return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default: return "bg-slate-50 text-slate-600";
    }
  };

  const inner = (
    <>
      <div className="aspect-[16/10] overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent" />
        <Badge className={cn("absolute top-6 left-6 border-none text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 backdrop-blur-md", getTypeStyles())}>
          {category}
        </Badge>
      </div>

      <div className="p-8 md:p-10 flex-1 flex flex-col space-y-6">
        <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5" />
            {readTime}
          </div>
          <span>{date}</span>
        </div>

        <div className="space-y-3 flex-1">
          <h3 className="text-2xl font-serif font-bold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
            {excerpt}
          </p>
        </div>

        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2 text-amber-600 font-black text-[10px] uppercase tracking-[0.2em]">
            Read Protocol <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
          {type === 'story' && (
            <div className="flex items-center gap-1.5 text-emerald-500">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold uppercase tracking-widest">Verified Case</span>
            </div>
          )}
        </div>
      </div>
    </>
  )

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group cursor-pointer bg-white rounded-[40px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full"
    >
      {slug ? (
        <Link href={`/insights/${slug}`} className="flex flex-col h-full">
          {inner}
        </Link>
      ) : inner}
    </motion.div>
  );
};

export default ContentCard;
