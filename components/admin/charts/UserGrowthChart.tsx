"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useState, useEffect } from "react";

interface UserGrowthChartProps {
  data: {
    date: string;
    count: number;
  }[];
}

export const UserGrowthChart = ({ data }: UserGrowthChartProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-white/5 animate-pulse rounded-xl" />;

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#ffffff" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#ffffff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: '#fff' }}
            cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
        />
        <Area
          type="monotone"
          dataKey="count"
          stroke="#ffffff"
          fillOpacity={1}
          fill="url(#colorCount)"
          cursor="pointer"
          activeDot={{ r: 6, cursor: 'pointer' }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
