import { db } from "@/lib/db";
import { dailyMetrics } from "@/lib/db/schema";
import { sum, desc } from "drizzle-orm";

export default async function CampaignsPage() {
  // Busca e agrega dados por campanha
  const result = await db
    .select({
      id: dailyMetrics.campaignId,
      name: dailyMetrics.campaignName,
      provider: dailyMetrics.provider,
      spend: sum(dailyMetrics.spendCentavos),
      revenue: sum(dailyMetrics.revenueCentavos),
      conversions: sum(dailyMetrics.conversions),
    })
    .from(dailyMetrics)
    .groupBy(dailyMetrics.campaignId, dailyMetrics.campaignName, dailyMetrics.provider)
    .orderBy(desc(sum(dailyMetrics.spendCentavos)));
  
  return (
    <div className="flex flex-col gap-6 w-full max-w-[1200px] mx-auto pb-10 2xl:max-w-[1400px]">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Campanhas Ativas</h1>
        <p className="text-sm text-zinc-500 mt-1">
          Acompanhe o retorno financeiro de cada frente de captação isoladamente.
        </p>
      </div>

      <div className="border border-zinc-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-zinc-200 bg-zinc-50">
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Campanha</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Rede</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Gasto</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Receita</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">Vendas</th>
              <th className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider text-right">ROAS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200">
            {result.map((camp, idx) => {
              const spend = Number(camp.spend || 0) / 100;
              const revenue = Number(camp.revenue || 0) / 100;
              const roas = spend > 0 ? (revenue / spend).toFixed(2) : "0.00";
              const bgColor = camp.provider === 'GOOGLE' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' : 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';

              return (
                <tr key={camp.id || idx} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-medium text-zinc-900">{camp.name || "Campanha Desconhecida"}</div>
                    <div className="text-xs text-zinc-400 font-mono mt-0.5">{String(camp.id).substring(0, 15)}...</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${bgColor}`}>
                      {camp.provider === 'GOOGLE' ? 'Google Ads' : 'Meta Ads'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-zinc-600">
                    R$ {spend.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-emerald-600">
                    R$ {revenue.toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                  </td>
                  <td className="px-6 py-4 text-right text-sm text-zinc-600">
                    {Number(camp.conversions || 0)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`font-semibold ${Number(roas) >= 3 ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {roas}x
                    </span>
                  </td>
                </tr>
              )
            })}
            
            {result.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-sm text-zinc-500">
                  Nenhuma campanha encontrada. Sincronize os dados no painel inicial.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
