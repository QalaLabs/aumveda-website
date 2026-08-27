"use client";

import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from "@/lib/utils";

interface RoutineItemProps {
  title: string;
  time: string;
  description: string;
  completed: boolean;
  onToggle: () => void;
}

const RoutineItem: React.FC<RoutineItemProps> = ({ title, time, description, completed, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      className={cn(
        "group cursor-pointer p-5 rounded-2xl border transition-all duration-300 flex items-start gap-4",
        completed
          ? "bg-emerald-50/50 border-emerald-100"
          : "bg-white border-slate-100 hover:border-gold/25 hover:shadow-md"
      )}
    >
      <div className="mt-1">
        {completed ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
        ) : (
          <Circle className="w-6 h-6 text-slate-200 group-hover:text-gold" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <h4 className={cn(
            "font-bold text-sm transition-colors",
            completed ? "text-emerald-900" : "text-slate-900"
          )}>
            {title}
          </h4>
          <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <Clock className="w-3 h-3" />
            {time}
          </div>
        </div>
        <p className={cn(
          "text-xs leading-relaxed transition-colors",
          completed ? "text-emerald-700/70" : "text-slate-500"
        )}>
          {description}
        </p>
      </div>
    </div>
  );
};

export default RoutineItem;
