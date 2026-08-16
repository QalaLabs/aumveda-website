"use client";

import React from 'react';
import { PlayCircle, CheckCircle2, Clock, ShieldCheck } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Module {
  id: string | number;
  title: string;
  durationSec: number | null;
  isPreview: boolean;
  orderIndex: number;
  completed?: boolean;
  watchedSec?: number;
}

interface CourseSidebarProps {
  modules: Module[];
  activeModuleId: string | number;
  onModuleSelect: (id: string | number) => void;
  courseTitle: string;
  overallProgress: number;
}

function formatDuration(durationSec: number | null): string {
  if (durationSec == null) return '';
  const m = Math.floor(durationSec / 60)
  const s = Math.round(durationSec % 60)
  if (m < 1) return `${s}s`
  if (s === 0) return `${m} min`
  return `${m}:${String(s).padStart(2, '0')}`
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  modules,
  activeModuleId,
  onModuleSelect,
  courseTitle,
  overallProgress
}) => {
  return (
    <div className="flex flex-col h-full border-l border-slate-100 bg-white">
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <PlayCircle className="w-5 h-5 text-blue-500" />
          {courseTitle}
        </h3>
        <div className="mt-4">
          <div className="flex justify-between items-end mb-2">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Course Progress</span>
            <span className="text-[10px] font-bold text-blue-600">{overallProgress}%</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-500 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {modules.map((mod, index) => {
          const isActive = activeModuleId === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => onModuleSelect(mod.id)}
              className={cn(
                "w-full text-left p-4 rounded-xl transition-all duration-200 group relative border",
                isActive
                  ? "bg-blue-50 border-blue-100 shadow-sm"
                  : "hover:bg-slate-50 border-transparent"
              )}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider",
                  isActive ? "text-blue-600" : "text-slate-400"
                )}>
                  Lesson {index + 1}{mod.durationSec != null ? ` • ${formatDuration(mod.durationSec)}` : ''}
                </span>
                {mod.completed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : isActive ? (
                  <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-slate-300" />
                )}
              </div>
              <h4 className={cn(
                "font-semibold text-sm leading-tight",
                isActive ? "text-blue-900" : "text-slate-700"
              )}>
                {mod.title}
              </h4>
            </button>
          );
        })}
      </div>

      <div className="p-6 bg-slate-900 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Forensic Security</span>
        </div>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          Your session is uniquely watermarked. Any unauthorized distribution will be traced back to your account ID.
        </p>
      </div>
    </div>
  );
};

export default CourseSidebar;
