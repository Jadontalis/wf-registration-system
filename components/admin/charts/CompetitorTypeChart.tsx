"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CompetitorTypeChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const COLORS = ['#ffffff', '#cccccc', '#999999', '#666666', '#333333'];

export const CompetitorTypeChart = ({ data }: CompetitorTypeChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
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
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-gray-300">{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};
