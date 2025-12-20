"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";

export default function AdminOverviewPage() {
  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="animate-in fade-in slide-in-from-bottom-3 duration-500">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard Agregat</h1>
        <p className="text-slate-500 mt-1">
          Selamat datang di panel Administrator.
        </p>

        <div className="mt-8 p-12 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400">
          <div className="bg-slate-50 p-4 rounded-full mb-4"></div>
          <p className="font-medium">Statistik wilayah sedang disiapkan...</p>
        </div>
      </div>
    </RoleGuard>
  );
}
