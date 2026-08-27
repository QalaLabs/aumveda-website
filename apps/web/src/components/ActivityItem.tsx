"use client";

import React from 'react';
import { format } from 'date-fns';
import * as Icons from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

interface ActivityItemProps {
  event: any;
  onInspect: (event: any) => void;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ event, onInspect }) => {
  const router = useRouter();
  const IconComponent = (Icons as any)[event.icon] || Icons.Circle;

  const getTypeStyles = (name: string) => {
    if (name.includes('journal')) return "bg-gold/10 text-night border-gold/20";
    if (name.includes('dose')) return "bg-emerald-50 text-emerald-600 border-emerald-100";
    if (name.includes('purchase')) return "bg-rose-50 text-rose-600 border-rose-100";
    if (name.includes('health')) return "bg-gold/10 text-night border-gold/20";
    if (name.includes('ai')) return "bg-gold/10 text-night border-gold/20";
    if (name.includes('achievement')) return "bg-amber-50 text-amber-600 border-amber-100";
    return "bg-slate-50 text-slate-600 border-slate-100";
  };

  const renderAction = () => {
    const name = event.name;
    if (name === 'journal.created') {
      return (
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest border-gold/20 text-night hover:bg-gold/10"
          onClick={(e) => { e.stopPropagation(); router.push('/journal'); }}
        >
          <Icons.BookOpen className="w-3 h-3 mr-1.5" /> View Journal
        </Button>
      );
    }
    if (name === 'achievement.unlocked') {
      return (
        <Button
          variant="outline"
          size="sm"
          className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest border-amber-100 text-amber-600 hover:bg-amber-50"
          onClick={(e) => { e.stopPropagation(); router.push('/profile'); }}
        >
          <Icons.Trophy className="w-3 h-3 mr-1.5" /> View Badges
        </Button>
      );
    }
    return null;
  };

  return (
    <div
      role="button"
      tabIndex={0}
      className="relative flex items-start gap-6 group cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-4 rounded-2xl"
      onClick={() => onInspect(event)}
    >
      <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-100 group-last:hidden" />

      <div className={cn(
        "relative z-10 w-10 h-10 rounded-2xl border-2 border-white shadow-sm flex items-center justify-center transition-transform group-hover:scale-110",
        getTypeStyles(event.name)
      )}>
        <IconComponent className="w-5 h-5" />
      </div>

      <div className="flex-1 bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm hover:shadow-md transition-all mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <h4 className="font-bold text-slate-900 text-sm group-hover:text-night transition-colors">
              {event.title}
            </h4>
            {event.isMilestone && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 rounded-full border border-amber-200">
                <Icons.Trophy className="w-2.5 h-2.5 text-amber-600" />
                <span className="text-[8px] font-black text-amber-700 uppercase tracking-tighter">Milestone</span>
              </div>
            )}
          </div>
          <time className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
            <Icons.Clock className="w-3 h-3" />
            {format(new Date(event.timestamp), 'MMM dd, h:mm a')}
          </time>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed mb-4">
          {event.description}
        </p>

        {event.insight && (
          <div className="mb-4 p-3 bg-gold/10 rounded-xl border border-gold/20 flex gap-3">
            <Icons.Sparkles className="w-4 h-4 text-night shrink-0 mt-0.5" />
            <p className="text-[11px] text-night italic leading-relaxed">
              "{event.insight}"
            </p>
          </div>
        )}

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            {renderAction()}
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 px-3 text-[9px] font-bold uppercase tracking-widest text-slate-300 hover:text-slate-900 hover:bg-slate-50 rounded-lg"
          >
            Inspect Payload
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActivityItem;
