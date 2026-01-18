"use client";

import type React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar"; // Pastikan Sidebar ini menghandle menu Admin
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/authStore"; // Opsional: Untuk verifikasi role di layout

// Komponen penahan untuk sinkronisasi data global Admin (Jika ada data dashboard admin)
function AdminDataInitializer({ children }: { children: React.ReactNode }) {
  // Jika Admin punya hooks fetch data statistik global, panggil di sini
  // const { isLoading } = useFetchAdminStats();
  const isLoading = false; // Set default false jika belum ada hooks khusus

  if (isLoading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-[#38C1B3]" />
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase">
            Mempersiapkan Panel Kontrol...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex  bg-[#F8FAFC]">
      {/* Sidebar Admin */}
      <Sidebar />

      <main className="flex-1 mt-16 md:mt-0 p-8">
        {/* Konten Halaman Admin */}
        <AdminDataInitializer>{children}</AdminDataInitializer>
      </main>
    </div>
  );
}
