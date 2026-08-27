"use client";

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";

interface ProgressChartProps {
  data: { date: string; score: number }[];
  average: number;
}

const ProgressChart: React.FC<ProgressChartProps> = ({ data, average }) => {
  return (
    <Card className="border-none av-shadow-parchment bg-card overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-foreground">
            <Activity className="w-5 h-5 text-gold" />
            Wellness Journey
          </CardTitle>
          <div className="text-right">
            <span className="text-[10px] font-bold text-mute uppercase tracking-widest">Weekly Avg</span>
            <p className="text-xl font-black text-night tabular">{average}%</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#C9A84C" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E2D9" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#78716C', fontWeight: 600 }}
                dy={10}
              />
              <YAxis
                domain={[0, 100]}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: '#78716C' }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #E8E2D9', boxShadow: '0 10px 15px -3px rgb(11 7 32 / 0.12)', background: '#F7F1E8' }}
                itemStyle={{ color: '#C9A84C', fontWeight: 'bold' }}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#C9A84C"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorScore)"
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressChart;
