"use client";

import React from 'react';
import { Moon, Zap, BookOpen } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Metric {
  label: string;
  value: string | number;
  score: number;
  icon: React.ElementType;
  color: string;
}

interface SecondaryMetricsProps {
  metrics: {
    sleep: { value: number; score: number; unit: string };
    activity: { value: number; score: number; unit: string };
    journal: { value: number; score: number; unit: string };
  };
}

const SecondaryMetrics: React.FC<SecondaryMetricsProps> = ({ metrics }) => {
  const items: Metric[] = [
    {
      label: "Sleep",
      value: `${metrics.sleep.value}${metrics.sleep.unit}`,
      score: metrics.sleep.score,
      icon: Moon,
      color: "text-night"
    },
    {
      label: "Activity",
      value: `${metrics.activity.value}${metrics.activity.unit}`,
      score: metrics.activity.score,
      icon: Zap,
      color: "text-amber-500"
    },
    {
      label: "Journal",
      value: `${metrics.journal.value} ${metrics.journal.unit}`,
      score: metrics.journal.score,
      icon: BookOpen,
      color: "text-emerald-500"
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <div key={item.label} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <item.icon className={cn("w-4 h-4", item.color)} />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-sm font-bold text-slate-900">{item.value}</span>
            <span className={cn("text-[10px] font-bold", item.score >= 90 ? "text-emerald-500" : "text-amber-500")}>
              {item.score}%
            </span>
          </div>
          <div className="mt-2 h-1 bg-slate-50 rounded-full overflow-hidden">
            <div
              className={cn("h-full transition-all duration-500", item.score >= 90 ? "bg-emerald-500" : "bg-amber-500")}
              style={{ width: `${item.score}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SecondaryMetrics;
