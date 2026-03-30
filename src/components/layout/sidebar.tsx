import Link from "next/link";
import { LayoutDashboard, Megaphone, BarChart3, Settings } from "lucide-react";

export function Sidebar({ className }: { className?: string }) {
  return (
    <aside className={`flex flex-col border-r border-zinc-200 bg-white ${className}`}>
      <div className="flex h-16 items-center border-b border-zinc-200 px-6">
        <Link href="/" className="font-bold text-lg tracking-tight">
          ExecutiveDash
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        <Link href="/" className="flex items-center rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900">
          <LayoutDashboard className="mr-3 h-4 w-4" />
          Visão Geral
        </Link>
        <Link href="/campaigns" className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900">
          <Megaphone className="mr-3 h-4 w-4" />
          Campanhas
        </Link>
        <Link href="/reports" className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900">
          <BarChart3 className="mr-3 h-4 w-4" />
          Relatórios
        </Link>
        <Link href="/settings" className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900">
          <Settings className="mr-3 h-4 w-4" />
          Configurações
        </Link>
      </nav>
      <div className="p-4 border-t border-zinc-200 text-xs text-zinc-500 text-center">
        Powered by AI
      </div>
    </aside>
  );
}
