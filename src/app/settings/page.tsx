export const dynamic = 'force-dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { connections } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function SettingsPage() {
  // Busca na base se já existe conexão viva, para mudarmos a renderização do botão
  const activeConnections = await db
    .select()
    .from(connections)
    .where(eq(connections.workspaceId, "00000000-0000-0000-0000-000000000000"));

  const hasGoogle = activeConnections.some(c => c.provider === "GOOGLE");
  const hasMeta = activeConnections.some(c => c.provider === "META");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configurações & Integrações</h1>
        <p className="text-zinc-500 mt-1">
          Gerencie as conexões de marketing de todos os canais do seu painel e os conectores.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card Google Ads */}
        <Card className="flex flex-col shadow-sm border-zinc-200">
          <CardHeader>
            <div className="h-10 w-10 mb-4 rounded-xl bg-blue-50 flex items-center justify-center p-2">
               {/* Usando SVG Oficial Google */}
               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px"><path fill="#fbc02d" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12	s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20	s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#e53935" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039	l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4caf50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36	c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/><path fill="#1565c0" d="M43.611,20.083L43.595,20L42,20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571	c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
            </div>
            <CardTitle className="text-xl">Google Ads</CardTitle>
            <CardDescription className="pt-2">
              Importação do faturamento consolidado de Campanhas, Grupos e Impressões da sua Mídia de Pesquisa ou Youtube.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            {hasGoogle ? (
              <Button disabled variant="outline" className="w-full font-medium text-emerald-600 border-emerald-200">
                ✔️ Google Ads Conectado
              </Button>
            ) : (
              <form action="/api/oauth/google">
                <Button type="submit" className="w-full bg-zinc-900 font-medium">
                  Conectar ao Google
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Card Meta Ads (Deixado pré-pronto visualmente) */}
        <Card className="flex flex-col shadow-sm border-zinc-200">
          <CardHeader>
            <div className="h-10 w-10 mb-4 rounded-xl bg-blue-50 flex items-center justify-center p-2 text-blue-600 font-bold text-lg">
               Meta
            </div>
            <CardTitle className="text-xl">Facebook Ads</CardTitle>
            <CardDescription className="pt-2">
              Traz CPM, Impressões e Vendas nativas rastreadas pelo Pixel dentro das Campanhas do grupo Meta.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-auto">
            {hasMeta ? (
              <Button disabled variant="outline" className="w-full font-medium text-emerald-600 border-emerald-200">
                ✔️ Meta Conectado
              </Button>
            ) : (
              <Button disabled className="w-full bg-zinc-400 font-medium cursor-not-allowed">
                Conexão Local não configurada ainda
              </Button>
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
