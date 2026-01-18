"use client";

import type React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useFetchMotherProfile } from "@/hooks/mother/useMotherData";
import { Loader2, Heart } from "lucide-react";

// Komponen penahan agar halaman tidak render sebelum data masuk Zustand
function DashboardDataInitializer({ children }: { children: React.ReactNode }) {
  const { isLoading } = useFetchMotherProfile();

  if (isLoading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="h-10 w-10 md:h-12 md:w-12 animate-spin text-[#3AC4B6]" />
            <Heart className="w-4 h-4 text-[#3AC4B6] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-[9px] md:text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase text-center">
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
      {/* Sidebar tetap muncul. 
        Pastikan di dalam komponen Sidebar Anda sudah menangani toggle mobile.
      */}
      <Sidebar />

      {/* Main Content:
        - md:ml-64: Memberi ruang untuk sidebar di desktop.
        - pt-20: Memberi ruang untuk header mobile (mt-16 sebelumnya diganti pt agar scroll lebih natural).
      */}
      <main className="flex-1 min-w-0 pt-20 md:pt-0 md:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10">
          {/* Header Dashboard */}
          <header className="hidden md:flex justify-end mb-8">
            <div className="bg-white px-5 py-2.5 rounded-full border border-slate-100 shadow-sm text-[9px] font-black text-slate-400 tracking-widest uppercase">
              GENY STUNTCARE <span className="text-[#3AC4B6] ml-1">v0.1.0</span>
            </div>
          </header>

          {/* Hanya konten halaman yang menunggu sinkronisasi data */}
          <DashboardDataInitializer>
            <div className="animate-in fade-in duration-500">{children}</div>
          </DashboardDataInitializer>
        </div>
      </main>
    </div>
  );
}
