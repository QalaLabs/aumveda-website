"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Zap, TrendingUp, Trophy, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityStatsProps {
  stats: {
    total: number;
    activeDays: number;
    milestones: number;
    eventTypes: number;
  };
}

const ActivityStats: React.FC<ActivityStatsProps> = ({ stats }) => {
  const items = [
    {
      label: "Activities",
      value: stats.total,
      icon: Star,
      color: "text-purple-600",
      bg: "bg-purple-50",
      description: "Events in this timeline"
    },
    {
      label: "Active Days",
      value: `${stats.activeDays} Day${stats.activeDays === 1 ? '' : 's'}`,
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-50",
      description: "Distinct days with activity"
    },
    {
      label: "Milestones",
      value: stats.milestones,
      icon: Trophy,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      description: "Key milestones reached"
    },
    {
      label: "Types Tracked",
      value: stats.eventTypes,
      icon: TrendingUp,
      color: "text-blue-600",
      bg: "bg-blue-50",
      description: "Kinds of activities"
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {items.map((item) => (
        <Card key={item.label} className="border-none shadow-sm bg-white rounded-[24px] overflow-hidden group hover:shadow-md transition-all">
          <CardContent className="p-5 flex items-center gap-4">
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", item.bg)}>
              <item.icon className={cn("w-6 h-6", item.color)} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.label}</p>
              <p className="text-xl font-black text-slate-900">{item.value}</p>
              <p className="text-[9px] font-medium text-slate-400 mt-0.5">{item.description}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ActivityStats;
