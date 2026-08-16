"use client";

import React, { useState, useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import {
  Edit2,
  LogOut,
  Globe
} from "lucide-react";
import { cn } from "@/lib/utils";
import EditProfileModal from "./EditProfileModal";
import AvatarUploadModal from "./AvatarUploadModal";

const Sparkline = ({ data }: { data: number[] }) => {
  if (!data || data.length < 2) return null;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const width = 60;
  const height = 20;
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((val - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        fill="none"
        stroke="#C79A3B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};

const ProfileHeader = () => {
  const [profile, setProfile] = useState<any>(null);
  const [sparkData, setSparkData] = useState<number[]>([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await fetch('/api/profile');
      const data = await res.json();
      setProfile(data);
    } catch (err) {
      console.error("Failed to load profile");
    }
  };

  const fetchProgress = async () => {
    try {
      const res = await fetch('/api/profile/progress');
      const data = await res.json();
      if (data.success) {
        setSparkData(data.trend.map((t: any) => t.score));
      }
    } catch (err) {
      setSparkData([]);
    }
  };

  useEffect(() => {
    fetchProfile();
    fetchProgress();
  }, []);

  if (!profile) return <div className="h-32 animate-pulse bg-slate-100 rounded-2xl" />;

  const initials = profile.displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase();

  return (
    <div className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-slate-100">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <button
            onClick={() => setIsAvatarModalOpen(true)}
            className="relative group focus:outline-none focus:ring-2 focus:ring-[#0F5B56] focus:ring-offset-4 rounded-full transition-all"
            aria-label={`Change ${profile.displayName} avatar`}
          >
            <Avatar className="w-[72px] h-[72px] border-4 border-white shadow-xl">
              <AvatarImage src={profile.avatarUrl} alt={`${profile.displayName} avatar`} />
              <AvatarFallback className="bg-[#0F5B56] text-white font-bold text-xl">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Edit2 className="w-5 h-5 text-white" />
            </div>
          </button>

          <div className="space-y-2">
            <h1 className="text-[28px] font-serif font-bold text-[#0F5B56] leading-tight">
              {profile.displayName}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 text-slate-500 text-sm">
              <div className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" />
                {profile.timezone}
              </div>
              <span className="w-1 h-1 rounded-full bg-slate-300 hidden md:block" />
              <Badge variant="secondary" className="bg-[#C79A3B]/10 text-[#C79A3B] border-none font-bold text-[10px] uppercase tracking-widest px-3 py-1">
                {profile.membershipTier}
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto">
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-4 bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-100 cursor-help group hover:border-[#C79A3B]/30 transition-colors">
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Latest P Score</span>
                    <span className="text-lg font-black text-[#C79A3B]">{profile.progress}</span>
                  </div>
                  <Sparkline data={sparkData} />
                </div>
              </TooltipTrigger>
              <TooltipContent className="bg-slate-900 text-white border-none rounded-xl p-3">
                <p className="text-xs font-medium">Latest daily score: {profile.progress}</p>
              </TooltipContent>
            </Tooltip>
          </div>

          <div className="flex flex-wrap justify-center md:justify-end items-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-xl border-slate-200 hover:bg-slate-50 font-bold text-xs h-10 px-5"
            >
              <Edit2 className="w-3.5 h-3.5 mr-2" />
              Edit Profile
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="rounded-xl text-rose-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs h-10 px-5"
            >
              <LogOut className="w-3.5 h-3.5 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        currentName={profile.displayName}
        onUpdate={(newName) => setProfile({ ...profile, displayName: newName })}
      />
      <AvatarUploadModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onUploadComplete={(url) => setProfile({ ...profile, avatarUrl: url })}
      />
    </div>
  );
};

export default ProfileHeader;
