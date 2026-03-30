/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/lib/db";
import { dailyMetrics } from "@/lib/db/schema";
import { sum, sql, asc, desc } from "drizzle-orm";

export async function getDashboardOverview() {
  // Para MVP sem login fixamos o query ou ignoramos workspace_id por enquanto
  // Totais Cards
  const result = await db
    .select({
      totalSpend: sum(dailyMetrics.spendCentavos),
      totalRevenue: sum(dailyMetrics.revenueCentavos),
      totalClicks: sum(dailyMetrics.clicks),
      totalConversions: sum(dailyMetrics.conversions),
    })
    .from(dailyMetrics);

  const stats = result[0];
  const spend = Number(stats.totalSpend || 0) / 100;
  const revenue = Number(stats.totalRevenue || 0) / 100;
  const conversions = Number(stats.totalConversions || 0);

  const roas = spend > 0 ? (revenue / spend).toFixed(2) : "0.00";
  const cpa = conversions > 0 ? (spend / conversions).toFixed(2) : "0.00";

  // Trend Data (Gráfico de Área)
  const trendRaw = await db
    .select({
      date: dailyMetrics.date,
      spend: sum(dailyMetrics.spendCentavos),
      revenue: sum(dailyMetrics.revenueCentavos)
    })
    .from(dailyMetrics)
    .groupBy(dailyMetrics.date)
    .orderBy(asc(dailyMetrics.date));

  const trendData = trendRaw.map(row => {
    // Tenta formatar a string de data caso não venha objeto typeof Date do driver PgCore
    const dStr = String(row.date);
    const dObj = new Date(dStr + "T00:00:00");
    const label = dObj.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
    
    return {
      date: label !== "Invalid Date" ? label : dStr,
      Gasto: Number(row.spend || 0) / 100,
      Receita: Number(row.revenue || 0) / 100
    };
  });

  // Share by Platform Data (Gráfico de Rosca)
  const platformRaw = await db
    .select({
      provider: dailyMetrics.provider,
      spend: sum(dailyMetrics.spendCentavos)
    })
    .from(dailyMetrics)
    .groupBy(dailyMetrics.provider);

  const platformData = platformRaw.map(row => ({
    name: row.provider === "GOOGLE" ? "Google Ads" : row.provider === "META" ? "Meta Ads" : row.provider,
    value: Number(row.spend || 0) / 100
  }));

  return { 
    spend, 
    revenue, 
    roas, 
    cpa, 
    clicks: stats.totalClicks || 0, 
    conversions,
    trendData,
    platformData
  };
}
