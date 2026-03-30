import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { campaigns, dailyMetrics, workspaces } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST() {
  const workspaceId = "00000000-0000-0000-0000-000000000000";

  try {
    // 1. Garante que o Workspace existe
    const existing = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId));
    if (existing.length === 0) {
      await db.insert(workspaces).values({ id: workspaceId, name: "Workspace B2B MVP" });
    }

    // 2. Injeta Campanhas Realistas no Cofre
    const mockCampaigns = [
      { id: "11111111-1111-1111-1111-111111111111", workspaceId, name: "PMax - Captação São Luiz", provider: "GOOGLE", externalCampaignId: "x01", status: "ACTIVE" },
      { id: "22222222-2222-2222-2222-222222222222", workspaceId, name: "Pesquisa - Fundo de Funil", provider: "GOOGLE", externalCampaignId: "x02", status: "ACTIVE" },
      { id: "33333333-3333-3333-3333-333333333333", workspaceId, name: "FB/IG - Retargeting 30D", provider: "META", externalCampaignId: "x03", status: "PAUSED" }
    ];

    await db.insert(campaigns).values(mockCampaigns).onConflictDoNothing();

    // 3. Injeta o Desempenho Matemático dos últimos 15 dias
    const today = new Date();
    const metricsToInsert = [];

    for (let i = 0; i < 15; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];

        mockCampaigns.forEach(camp => {
            // Se Meta, vamos fingir que gastou menos pois ta paused, ou só pros dias velhos.
            // Gastos em CENTAVOS (R$ 100,00 = 10000)
            const baseSpend = camp.provider === "GOOGLE" ? (Math.floor(Math.random() * 20000) + 15000) : 8000;
            // ROAS girando em 3.5 a 6.2x
            const roasMultiplier = (Math.random() * 3) + 3.5; 
            const revenue = Math.floor(baseSpend * roasMultiplier);
            
            metricsToInsert.push({
                workspaceId,
                provider: camp.provider,
                campaignId: camp.id,
                campaignName: camp.name,
                date: dateStr,
                spendCentavos: baseSpend,
                impressions: Math.floor(Math.random() * 8000) + 1500,
                clicks: Math.floor(Math.random() * 300) + 80,
                conversions: Math.floor(Math.random() * 12) + 1,
                revenueCentavos: revenue
            });
        });
    }

    // Bulk insert direto salva a conexão no serverless
    if (metricsToInsert.length > 0) {
        await db.insert(dailyMetrics).values(metricsToInsert).onConflictDoNothing();
    }

    return NextResponse.json({ success: true, message: "MVP Data Seeded!" });
  } catch (error: any) {
    console.error("Erro Mocking Data:", error);
    return NextResponse.json({ 
        error: error.message || "Unknown error", 
        code: error.code,
        detail: error.detail,
        constraint: error.constraint
    }, { status: 500 });
  }
}
