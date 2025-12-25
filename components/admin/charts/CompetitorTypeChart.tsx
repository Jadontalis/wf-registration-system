"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useState, useEffect } from "react";

interface CompetitorTypeChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const COLORS = ['#ffffff', '#cccccc', '#999999', '#666666', '#333333'];

export const CompetitorTypeChart = ({ data }: CompetitorTypeChartProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-full w-full bg-white/5 animate-pulse rounded-xl" />;

  return (
    <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={0}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="40%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(0,0,0,0.2)" cursor="pointer" />
          ))}
        </Pie>
        <Tooltip 
            contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
            itemStyle={{ color: '#fff' }}
            labelStyle={{ color: '#fff' }}
        />
        <Legend 
            layout="vertical"
            verticalAlign="bottom" 
            align="center"
            wrapperStyle={{ width: '100%' }}
            formatter={(value) => <span className="text-gray-300 text-xs">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
