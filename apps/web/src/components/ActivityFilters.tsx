"use client";

import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface ActivityFiltersProps {
  activeType: string;
  onTypeChange: (type: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const FILTER_TYPES = [
  { id: 'all', label: 'All Events' },
  { id: 'journal.created', label: 'Journals' },
  { id: 'daily_dose.completed', label: 'Doses' },
  { id: 'purchase.completed', label: 'Purchases' },
  { id: 'health.synced', label: 'Health Syncs' },
  { id: 'ai.tips.generated', label: 'AI Tips' },
];

const ActivityFilters: React.FC<ActivityFiltersProps> = ({
  activeType,
  onTypeChange,
  searchQuery,
  onSearchChange
}) => {
  return (
    <div className="space-y-8">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search activity logs..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-11 pr-4 py-3 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-gold/60 bg-white text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-slate-500"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] px-2">
          <Filter className="w-3 h-3" />
          Filter by Type
        </div>
        <div className="flex flex-col gap-1">
          {FILTER_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onTypeChange(type.id)}
              className={cn(
                "w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all",
                activeType === type.id
                  ? "bg-night text-white shadow-lg shadow-blue-100"
                  : "text-slate-500 hover:bg-white hover:text-slate-900"
              )}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 bg-slate-900 rounded-3xl text-white">
        <h4 className="text-xs font-bold uppercase tracking-widest mb-2 text-gold">Audit Log</h4>
        <p className="text-[10px] text-slate-400 leading-relaxed">
          This timeline is an append-only record of your interactions. Events cannot be modified or deleted to ensure data integrity for your wellness journey.
        </p>
      </div>
    </div>
  );
};

export default ActivityFilters;
