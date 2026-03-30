/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
export type UnifiedMetric = {
  provider: "GOOGLE" | "META";
  campaignId: string;
  campaignName: string;
  date: string;
  spendCentavos: number;
  impressions: number;
  clicks: number;
  conversions: number;
  revenueCentavos: number;
};

export function normalizeGoogleData(rows: any[]): UnifiedMetric[] {
  return rows.map((r) => ({
    provider: "GOOGLE",
    campaignId: r.campaign.id.toString(),
    campaignName: r.campaign.name,
    date: r.segments.date,
    spendCentavos: Math.round(Number(r.metrics.cost_micros) / 10000), 
    impressions: Number(r.metrics.impressions),
    clicks: Number(r.metrics.clicks),
    conversions: Number(r.metrics.conversions),
    revenueCentavos: Math.round(Number(r.metrics.conversions_value) * 100),
  }));
}

export function normalizeMetaData(rows: any[]): UnifiedMetric[] {
  return rows.map((r) => {
    const purchasesItem = r.actions?.find((a: any) => a.action_type === "purchase");
    const revenueItem = r.action_values?.find((a: any) => a.action_type === "purchase");

    return {
      provider: "META",
      campaignId: r.campaign_id,
      campaignName: r.campaign_name,
      date: r.date_start, 
      spendCentavos: Math.round(Number(r.spend) * 100),
      impressions: Number(r.impressions),
      clicks: Number(r.clicks),
      conversions: Number(purchasesItem?.value || 0),
      revenueCentavos: Math.round(Number(revenueItem?.value || 0) * 100),
    };
  });
}
