"use client";

import type React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { RoleGuard } from "@/components/auth/RoleGuard";

// Komponen penahan untuk sinkronisasi data global Admin
function AdminDataInitializer({ children }: { children: React.ReactNode }) {
  // Contoh: const { isLoading } = useAdminDashboardStats();
  const isLoading = false;

  if (isLoading) {
    return (
      <div className="flex h-[80vh] w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="h-12 w-12 animate-spin text-[#3AC4B6]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-2 w-2 bg-[#3AC4B6] rounded-full" />
            </div>
          </div>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-700 tracking-[0.3em] uppercase">
              System Admin
            </p>
            <p className="text-[9px] font-bold text-slate-400 tracking-[0.1em] uppercase mt-1">
              Mempersiapkan Panel Kontrol...
            </p>
          </div>
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
    // Proteksi Role: Hanya user dengan role 'admin' yang bisa akses layout ini
    <RoleGuard allowedRoles={["admin"]}>
      <div className="flex min-h-screen bg-[#F8FAFC]">
        {/* Sidebar Admin - Fixed atau Sticky tergantung implementasi Sidebar Anda */}
        <Sidebar />

        {/* Main Content 
          md:ml-64/72: Pastikan margin kiri sesuai dengan lebar Sidebar Anda agar tidak tertutup.
          overflow-x-hidden: Mencegah layout rusak di mobile.
        */}
        <main className="flex-1 transition-all duration-300 ease-in-out min-w-0">
          <div className="mt-16 md:mt-0 p-4 md:p-8 lg:p-10 max-w-[1600px] mx-auto">
            <AdminDataInitializer>
              <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
                {children}
              </div>
            </AdminDataInitializer>
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
