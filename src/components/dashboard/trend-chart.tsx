"use client";

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from "recharts";

type TrendData = {
  date: string;
  Receita: number;
  Gasto: number;
}[];

export function TrendChart({ data }: { data: TrendData }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex w-full items-center justify-center min-h-[300px] text-sm text-zinc-500">
        Nenhum dado financeiro para renderizar.
      </div>
    );
  }

  return (
    <div className="w-full h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 20, right: 0, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => value.substring(0, 5)}
            className="text-xs text-zinc-500"
          />
          <YAxis 
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `R$ ${value >= 1000 ? (value/1000).toFixed(0)+'k' : value}`}
            className="text-xs text-zinc-500"
          />
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: '1px solid #e4e4e7', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            formatter={(value: any) => `R$ ${Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 2})}`}
          />
          <Area 
            type="monotone" 
            dataKey="Receita" 
            stroke="#10b981" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorReceita)" 
          />
          <Area 
            type="monotone" 
            dataKey="Gasto" 
            stroke="#f43f5e" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorGasto)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
