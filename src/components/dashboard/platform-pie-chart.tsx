"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

type PlatformData = {
  name: string;
  value: number;
}[];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];

export function PlatformPieChart({ data }: { data: PlatformData }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex w-full items-center justify-center min-h-[300px] text-sm text-zinc-500">
        Nenhum dado por plataforma.
      </div>
    );
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => `R$ ${Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
            contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
