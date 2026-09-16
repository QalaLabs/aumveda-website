"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Share2, Lock, Loader2, CheckCircle2, Copy } from "lucide-react";
import { showSuccess, showError } from "@/utils/toast";

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  isEarned: boolean;
}

interface ShareModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAchievementModal: React.FC<ShareModalProps> = ({ achievement, isOpen, onClose }) => {
  const [isConsented, setIsConsented] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const handleShare = async () => {
    if (!isConsented) return;
    setIsSharing(true);
    try {
      // 1. Update Consent
      await fetch('/api/consent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'share_achievements', value: true })
      });

      // 2. Track Event
      await fetch('/api/track/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: "achievement.shared",
          payload: { achievementId: achievement?.id }
        })
      });

      // 3. Generate Mock Link
      const token = Math.random().toString(36).substring(7);
      setShareLink(`https://aumveda.app/share/achieve/${token}`);
      showSuccess("Share link generated!");
    } catch (err) {
      showError("Failed to share achievement");
    } finally {
      setIsSharing(false);
    }
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      showSuccess("Link copied to clipboard");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-[32px] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="w-6 h-6 text-night" />
            Share Achievement
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6 space-y-6">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center text-center gap-3">
            <div className="text-5xl mb-2">{achievement?.icon}</div>
            <h3 className="font-bold text-lg text-slate-900">{achievement?.name}</h3>
            <p className="text-sm text-slate-500">{achievement?.description}</p>
          </div>

          {!shareLink ? (
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-4 bg-gold/10 rounded-xl border border-gold/20">
                <Checkbox 
                  id="consent" 
                  checked={isConsented} 
                  onCheckedChange={(val) => setIsConsented(!!val)}
                  className="mt-1"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="consent" className="text-xs font-bold text-ink cursor-pointer">
                    Allow public sharing of this achievement
                  </Label>
                  <p className="text-[10px] text-night">
                    By checking this, you agree to generate a temporary public link that displays your achievement and display name.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Your Share Link</Label>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-100 p-3 rounded-xl text-xs font-mono truncate text-slate-600">
                  {shareLink}
                </div>
                <Button size="icon" variant="outline" onClick={copyToClipboard} className="rounded-xl">
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          {!shareLink ? (
            <Button 
              onClick={handleShare} 
              disabled={!isConsented || isSharing}
              className="w-full bg-slate-900 hover:bg-black rounded-xl h-12 font-bold"
            >
              {isSharing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Share2 className="w-4 h-4 mr-2" />}
              Generate Share Link
            </Button>
          ) : (
            <Button onClick={onClose} className="w-full bg-slate-900 hover:bg-black rounded-xl h-12 font-bold">
              Done
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface LockedModalProps {
  achievement: Achievement | null;
  isOpen: boolean;
  onClose: () => void;
}

export const LockedAchievementModal: React.FC<LockedModalProps> = ({ achievement, isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Lock className="w-5 h-5 text-slate-400" />
            Locked Achievement
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-8 flex flex-col items-center text-center gap-6">
          <div className="w-24 h-24 rounded-full bg-slate-50 border-4 border-slate-100 flex items-center justify-center text-5xl grayscale opacity-50">
            {achievement?.icon}
          </div>
          
          <div className="space-y-2">
            <h3 className="font-bold text-xl text-slate-900">{achievement?.name}</h3>
            <p className="text-sm text-slate-500 px-4">{achievement?.description}</p>
          </div>

          <div className="w-full p-4 bg-amber-50 rounded-2xl border border-amber-100">
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 block mb-1">How to Unlock</span>
            <p className="text-sm font-semibold text-amber-900">{achievement?.requirement}</p>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="w-full bg-slate-900 hover:bg-black rounded-xl h-12 font-bold">
            Got it
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};