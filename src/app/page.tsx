import { MetricCard } from "@/components/shared/metric-card";
import { getDashboardOverview } from "@/server/services/dashboard.service";
import { TrendChart } from "@/components/dashboard/trend-chart";
import { PlatformPieChart } from "@/components/dashboard/platform-pie-chart";

export default async function DashboardOverview() {
  const data = await getDashboardOverview();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Visão Geral</h1>
        <p className="text-zinc-500 mt-1">
          Performance consolidada lida diretamente do PostgreSQL.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard 
          title="Receita Gerada" 
          value={`R$ ${data.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
          trend={0} 
          trendDescription="Filtro de data em breve" 
        />
        <MetricCard 
          title="Investimento (Gasto)" 
          value={`R$ ${data.spend.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`} 
        />
        <MetricCard 
          title="ROAS Consolidado" 
          value={`${data.roas}x`} 
        />
        <MetricCard 
          title="Custo Médio por Venda (CPA)" 
          value={`R$ ${data.cpa}`} 
        />
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Box Grande Esquerdo */}
        <div className="md:col-span-5 border border-zinc-200 rounded-xl bg-white p-6 shadow-sm flex flex-col min-h-[300px]">
           <div className="mb-4">
             <h3 className="font-semibold text-zinc-900">Evolução Financeira</h3>
             <p className="text-xs text-zinc-500">Últimos 15 dias de Receita vs Gasto Faturado</p>
           </div>
           <TrendChart data={data.trendData} />
        </div>
        {/* Box Menor Direito */}
        <div className="md:col-span-2 border border-zinc-200 rounded-xl bg-white p-6 shadow-sm flex flex-col min-h-[300px]">
           <div className="mb-4">
             <h3 className="font-semibold text-zinc-900">Origem de Gasto</h3>
             <p className="text-xs text-zinc-500">Split por Rede de Mídia</p>
           </div>
           <PlatformPieChart data={data.platformData} />
        </div>
      </div>
    </div>
  );
}
