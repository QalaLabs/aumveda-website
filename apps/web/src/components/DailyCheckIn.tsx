"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Smile, Zap, Moon, CheckCircle2, Loader2 } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

const DailyCheckIn = () => {
  const [mood, setMood] = useState([7]);
  const [energy, setEnergy] = useState([6]);
  const [sleep, setSleep] = useState([7]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSuccess("Daily metrics logged! Your P_t score is updating.");
      setSubmitted(true);
    } catch (err) {
      showError("Failed to save metrics");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card className="border-none shadow-lg bg-emerald-50/50 border-emerald-100">
        <CardContent className="pt-6 text-center">
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-white w-6 h-6" />
          </div>
          <h3 className="font-bold text-emerald-900">Check-in Complete</h3>
          <p className="text-sm text-emerald-700 mt-1">Your wellness data has been synchronized.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-lg bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          Daily Check-in
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Smile className="w-4 h-4 text-night" /> Mood
            </Label>
            <span className="text-sm font-bold text-night">{mood[0]}/10</span>
          </div>
          <Slider
            value={mood}
            onValueChange={setMood}
            max={10}
            step={1}
            className="py-2"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" /> Energy
            </Label>
            <span className="text-sm font-bold text-amber-600">{energy[0]}/10</span>
          </div>
          <Slider
            value={energy}
            onValueChange={setEnergy}
            max={10}
            step={1}
            className="py-2"
          />
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <Moon className="w-4 h-4 text-night" /> Sleep (Hours)
            </Label>
            <span className="text-sm font-bold text-night">{sleep[0]}h</span>
          </div>
          <Slider
            value={sleep}
            onValueChange={setSleep}
            max={12}
            step={0.5}
            className="py-2"
          />
        </div>

        <Button
          className="w-full bg-slate-900 hover:bg-black rounded-xl h-12 font-bold"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : "Log Metrics"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DailyCheckIn;
