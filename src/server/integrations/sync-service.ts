import { db } from "@/lib/db";
import { dailyMetrics } from "@/lib/db/schema";
import { UnifiedMetric } from "./normalizer";
import { sql } from "drizzle-orm";

export async function upsertMetrics(workspaceId: string, metrics: UnifiedMetric[]) {
  if (metrics.length === 0) return;

  const insertData = metrics.map((m) => ({
    workspaceId,
    provider: m.provider,
    campaignId: m.campaignId,
    campaignName: m.campaignName,
    date: m.date,
    spendCentavos: m.spendCentavos,
    impressions: m.impressions,
    clicks: m.clicks,
    conversions: m.conversions,
    revenueCentavos: m.revenueCentavos,
  }));

  // Operação atômica que suporta rodar a cada hora sem duplicata
  await db
    .insert(dailyMetrics)
    .values(insertData)
    .onConflictDoUpdate({
      target: [dailyMetrics.workspaceId, dailyMetrics.campaignId, dailyMetrics.date],
      set: {
        spendCentavos: sql`EXCLUDED.spend_centavos`,
        impressions: sql`EXCLUDED.impressions`,
        clicks: sql`EXCLUDED.clicks`,
        conversions: sql`EXCLUDED.conversions`,
        revenueCentavos: sql`EXCLUDED.revenue_centavos`,
        campaignName: sql`EXCLUDED.campaign_name`, 
      },
    });
}
