"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, RefreshCw, Quote, BrainCircuit, Timer, ShieldCheck } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import { cn } from "@/lib/utils";

const AITipsCard = () => {
  const [tips, setTips] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchTips = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/ai/tips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      const data = await res.json();
      if (res.ok) {
        setTips(data);
        if (data.isPersonalized) {
          showSuccess("Personalized tips generated!");
        }
      } else {
        throw new Error(data.error || "Failed to fetch tips");
      }
    } catch (err: any) {
      showError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

  if (!tips && !loading) return null;

  return (
    <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="w-5 h-5 text-amber-300" />
            AI Wellness Insights
          </CardTitle>
          {tips?.isPersonalized && (
            <div className="flex items-center gap-1.5 px-2 py-1 bg-white/20 backdrop-blur-md rounded-full border border-white/10">
              <ShieldCheck className="w-3 h-3 text-emerald-300" />
              <span className="text-[9px] font-bold uppercase tracking-wider">Personalized</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6 pt-4">
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-4">
            <RefreshCw className="w-8 h-8 animate-spin text-white/50" />
            <p className="text-sm font-medium animate-pulse text-white/70">Synthesizing your journey...</p>
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-100">
                <BrainCircuit className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Mindset Reframes</span>
              </div>
              <div className="space-y-2">
                {tips.reframes.map((reframe: string, i: number) => (
                  <div key={i} className="p-3 bg-white/10 rounded-xl border border-white/5 text-sm leading-relaxed">
                    {reframe}
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-indigo-100">
                <Timer className="w-4 h-4" />
                <span className="text-[10px] font-bold uppercase tracking-widest">Micro Practice</span>
              </div>
              <div className="p-4 bg-amber-400/20 rounded-xl border border-amber-400/30 text-sm font-medium">
                {tips.micro_practice}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 relative">
              <Quote className="absolute -top-2 -left-1 w-8 h-8 text-white/5" />
              <p className="text-center italic text-indigo-50 font-medium px-4">
                "{tips.seed}"
              </p>
            </div>

            <Button
              onClick={fetchTips}
              variant="ghost"
              className="w-full hover:bg-white/10 text-white/70 hover:text-white text-xs"
            >
              <RefreshCw className="w-3 h-3 mr-2" />
              Refresh Insights
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default AITipsCard;
