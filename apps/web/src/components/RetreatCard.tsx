"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, ArrowRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface RetreatCardProps {
  title: string;
  location: string;
  date: string;
  capacity: string;
  description: string;
  image: string;
  price: string;
  category: string;
}

const RetreatCard: React.FC<RetreatCardProps> = ({
  title, location, date, capacity, description, image, price, category
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative overflow-hidden rounded-[48px] bg-white shadow-xl hover:shadow-2xl transition-all duration-700"
    >
      <div className="aspect-[16/10] overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />
        <Badge className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white border-white/20 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5">
          {category}
        </Badge>
      </div>

      <div className="p-10 space-y-6">
        <div className="space-y-2">
          <h3 className="text-3xl font-serif font-bold text-slate-900 leading-tight group-hover:text-amber-600 transition-colors">
            {title}
          </h3>
          <div className="flex flex-wrap gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-amber-500" />
              {location}
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-night" />
              {date}
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-500" />
              {capacity}
            </div>
          </div>
        </div>

        <p className="text-slate-500 leading-relaxed line-clamp-3 text-sm">
          {description}
        </p>

        <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Investment</p>
            <p className="text-2xl font-black text-slate-900">{price}</p>
          </div>
          <Button asChild className="bg-slate-900 hover:bg-black rounded-2xl h-14 px-8 font-bold shadow-xl shadow-slate-200 group/btn">
            <Link href="/contact">
              Apply Now <ArrowRight className="ml-2 w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default RetreatCard;
