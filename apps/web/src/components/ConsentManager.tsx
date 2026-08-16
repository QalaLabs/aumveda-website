"use client";

import React, { useState, useEffect } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ShieldCheck, Info, BrainCircuit, Mail, Activity } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";
import ConsentHistory from "./ConsentHistory";
import DataManagement from "./DataManagement";
import { Separator } from "@/components/ui/separator";

const ConsentManager = () => {
  const [consents, setConsents] = useState({
    tracking: false,
    marketing: false,
    health_sync: false,
    ai_personalization: false
  });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchConsents = async () => {
    try {
      const res = await fetch('/api/consent');
      const data = await res.json();
      if (data.consents) {
        const mapped = data.consents.reduce((acc: any, c: any) => {
          acc[c.key] = c.value;
          return acc;
        }, {});
        setConsents(prev => ({ ...prev, ...mapped }));
      }
      if (data.history) {
        setHistory(data.history);
      }
    } catch (err) {
      console.error("Failed to load consents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsents();
  }, []);

  const handleToggle = async (key: string, value: boolean) => {
    setConsents(prev => ({ ...prev, [key]: value }));
    try {
      const res = await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, value })
      });
      if (res.ok) {
        showSuccess(`Preference updated: ${key.replace('_', ' ')}`);
        fetchConsents();
      } else {
        throw new Error();
      }
    } catch (err) {
      showError("Failed to update preference");
      setConsents(prev => ({ ...prev, [key]: !value }));
    }
  };

  if (loading) return <div className="animate-pulse space-y-8">
    <div className="h-48 bg-slate-100 rounded-2xl" />
    <div className="h-64 bg-slate-100 rounded-2xl" />
  </div>;

  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="w-5 h-5 text-[#0F5B56]" />
          <h3 className="font-bold text-slate-900">Privacy Preferences</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-500" />
                <Label className="text-sm font-bold text-slate-800 cursor-pointer">Activity Tracking</Label>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">Personalize your journey insights. PII is redacted if disabled.</p>
            </div>
            <Switch
              checked={consents.tracking}
              onCheckedChange={(val) => handleToggle('tracking', val)}
              className="data-[state=checked]:bg-[#0F5B56]"
            />
          </div>

          <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <Label className="text-sm font-bold text-slate-800 cursor-pointer">Health Sync</Label>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">Automatically sync metrics with connected devices.</p>
            </div>
            <Switch
              checked={consents.health_sync}
              onCheckedChange={(val) => handleToggle('health_sync', val)}
              className="data-[state=checked]:bg-[#0F5B56]"
            />
          </div>

          <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-500" />
                <Label className="text-sm font-bold text-slate-800 cursor-pointer">AI Personalization</Label>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">Allow AI to analyze your journals for tailored wellness tips.</p>
            </div>
            <Switch
              checked={consents.ai_personalization}
              onCheckedChange={(val) => handleToggle('ai_personalization', val)}
              className="data-[state=checked]:bg-[#0F5B56]"
            />
          </div>

          <div className="flex items-center justify-between p-5 rounded-2xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-md group">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-500" />
                <Label className="text-sm font-bold text-slate-800 cursor-pointer">Marketing Updates</Label>
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">Receive tips and product recommendations via email.</p>
            </div>
            <Switch
              checked={consents.marketing}
              onCheckedChange={(val) => handleToggle('marketing', val)}
              className="data-[state=checked]:bg-[#0F5B56]"
            />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-blue-50 border border-blue-100 flex gap-3">
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-[10px] text-blue-700 leading-relaxed">
            We use forensic watermarking and PII redaction to ensure your data remains secure.
            Disabling tracking will immediately stop PII forwarding to external analytics.
          </p>
        </div>
      </div>

      <Separator className="bg-slate-100" />
      <ConsentHistory history={history} />
      <Separator className="bg-slate-100" />
      <DataManagement />
    </div>
  );
};

export default ConsentManager;
