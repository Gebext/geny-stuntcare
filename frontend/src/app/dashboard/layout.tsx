"use client";

import type React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useFetchMotherProfile } from "@/hooks/mother/useMotherData";
import { Loader2 } from "lucide-react";

// Komponen penahan agar halaman tidak render sebelum data masuk Zustand
function DashboardDataInitializer({ children }: { children: React.ReactNode }) {
  const { isLoading } = useFetchMotherProfile();

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-[#3AC4B6]" />
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
            Sinkronisasi Data Bunda...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar tetap muncul instan */}
      <Sidebar />

      <main className="flex-1 mt-16 md:mt-0 md:ml-64 p-8">
        <header className="flex justify-end mb-8">
          <div className="bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm text-[10px] font-bold text-slate-400">
            GENY STUNTCARE v0.1.0
          </div>
        </header>

        {/* Hanya konten halaman yang menunggu sinkronisasi data */}
        <DashboardDataInitializer>{children}</DashboardDataInitializer>
      </main>
    </div>
  );
}
