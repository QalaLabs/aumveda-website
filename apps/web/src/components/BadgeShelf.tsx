"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import BadgeItem from './BadgeItem';
import { ShareAchievementModal, LockedAchievementModal } from './AchievementModals';
import { Trophy, Loader2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";


interface Achievement {
  id: string;
  name: string;
  description: string;
  earnedAt: string | null;
  icon: string;
  requirement: string;
  isEarned: boolean;
}

const BadgeShelf = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isLockedOpen, setIsLockedOpen] = useState(false);

  const fetchAchievements = async () => {
    try {
      const res = await fetch('/api/achievements');
      const data = await res.json();
      if (data.success) {
        setAchievements(data.achievements);
      }
    } catch (err) {
      console.error("Failed to fetch achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAchievements();
    
    // Listen for achievement updates
    const handleUpdate = () => fetchAchievements();
    window.addEventListener('progress-updated', handleUpdate);
    return () => window.removeEventListener('progress-updated', handleUpdate);
  }, []);

  const handleBadgeClick = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    if (achievement.isEarned) {
      setIsShareOpen(true);
    } else {
      setIsLockedOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="h-32 flex items-center justify-center bg-white rounded-3xl border border-slate-100">
        <Loader2 className="w-6 h-6 text-night animate-spin" />
      </div>
    );
  }

  const earnedCount = achievements.filter(a => a.isEarned).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">Badge Shelf</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {earnedCount} of {achievements.length} Achievements Unlocked
            </p>
          </div>
        </div>
        <Button asChild variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600">
          <Link href="/dashboard/settings">
            View All <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </Button>
      </div>

      {/* Horizontal Scroll on Mobile, Grid on Desktop */}
      <div className="relative">
        <div className="flex md:grid md:grid-cols-5 lg:grid-cols-6 gap-6 overflow-x-auto pb-4 md:pb-0 scrollbar-hide snap-x">
          {achievements.map((achievement) => (
            <div key={achievement.id} className="snap-center shrink-0">
              <BadgeItem 
                achievement={achievement} 
                onClick={handleBadgeClick} 
              />
            </div>
          ))}
        </div>
        
        {/* Mobile Scroll Indicator Gradient */}
        <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-slate-50 to-transparent pointer-events-none md:hidden" />
      </div>

      <ShareAchievementModal 
        achievement={selectedAchievement} 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
      />
      
      <LockedAchievementModal 
        achievement={selectedAchievement} 
        isOpen={isLockedOpen} 
        onClose={() => setIsLockedOpen(false)} 
      />
    </div>
  );
};

export default BadgeShelf;