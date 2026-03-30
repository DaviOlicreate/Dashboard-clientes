"use client";
import { Button } from "@/components/ui/button";
import { Bell, UserCircle, RefreshCw } from "lucide-react";
import { useState } from "react";

export function Topbar() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await fetch("/api/mock", { method: "POST" });
      window.location.reload();
    } catch (e) {
      console.error(e);
      setIsSyncing(false);
    }
  };

  return (
    <header className="h-16 border-b border-zinc-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex w-full items-center max-w-md">
        <div className="flex bg-zinc-100 rounded-md px-3 py-2 w-full text-sm text-zinc-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Buscar campanhas..." className="bg-transparent outline-none w-full" />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSync}
          disabled={isSyncing}
          className="text-xs font-medium text-zinc-600 bg-white"
        >
          <RefreshCw className={`w-3 h-3 mr-2 ${isSyncing ? 'animate-spin' : ''}`} />
          {isSyncing ? "Puxando Dados..." : "Sincronizar Agora"}
        </Button>
        <button className="text-zinc-500 hover:text-zinc-900"><Bell className="w-5 h-5"/></button>
        <button className="text-zinc-500 hover:text-zinc-900"><UserCircle className="w-6 h-6"/></button>
      </div>
    </header>
  );
}
