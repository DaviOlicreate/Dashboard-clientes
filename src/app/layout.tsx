import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Dashboard Executivo",
  description: "Performance de Mídia Paga",
};

import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex h-screen w-full bg-zinc-50/50 text-zinc-900 font-sans">
          <Sidebar className="hidden md:flex w-[260px] flex-col" />
          
          <div className="flex flex-1 flex-col overflow-hidden">
            <Topbar />
            
            <main className="flex-1 overflow-y-auto p-4 md:p-8">
              <div className="mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-500">
                {children}
              </div>
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
