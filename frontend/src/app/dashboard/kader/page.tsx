"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { Users, ClipboardCheck, AlertCircle, Loader2 } from "lucide-react";
import { useKaderDashboard } from "@/hooks/kader/useKaderDashboard";

export default function KaderOverview() {
  const { stats, isLoading, error } = useKaderDashboard();

  // Handle Error State agar UI tidak blank
  if (error) {
    return (
      <div className="p-8 text-center text-rose-500 font-bold uppercase text-xs tracking-widest">
        Gagal Sinkronisasi Data
      </div>
    );
  }

  return (
    /* PENTING: Pakai "kader" (huruf kecil) karena RoleGuard kamu pakai .toLowerCase() */
    <RoleGuard allowedRoles={["kader"]}>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Dashboard Kader
          </h1>
          <p className="text-sm font-medium text-slate-500 italic">
            Pantau perkembangan anak binaan secara real-time.
          </p>
        </div>

        {/* State Loading diletakkan di dalam RoleGuard agar tidak bentrok dengan logic redirect */}
        {isLoading ? (
          <div className="h-[40vh] flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#3AC4B6] animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Memuat Data...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={<Users className="w-6 h-6" />}
              label="Total Anak Binaan"
              value={`${stats.totalAnak} Anak`}
              bgColor="bg-teal-50"
              textColor="text-[#3AC4B6]"
            />
            <StatCard
              icon={<ClipboardCheck className="w-6 h-6" />}
              label="Sudah Diukur (Bulan Ini)"
              value={stats.pengukuranBulanIni}
              bgColor="bg-purple-50"
              textColor="text-purple-500"
            />
            <StatCard
              icon={<AlertCircle className="w-6 h-6" />}
              label="Indikasi Stunting"
              value={`${stats.indikasiStunting} Anak`}
              bgColor="bg-rose-50"
              textColor="text-rose-600"
            />
          </div>
        )}
      </div>
    </RoleGuard>
  );
}

function StatCard({ icon, label, value, bgColor, textColor }: any) {
  return (
    <div className="p-7 bg-white border border-slate-100 rounded-[35px] shadow-sm hover:shadow-md transition-all">
      <div
        className={`w-12 h-12 ${bgColor} ${textColor} rounded-2xl flex items-center justify-center mb-6`}
      >
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
        {label}
      </p>
      <p className="text-2xl font-black text-slate-800 tracking-tight">
        {value}
      </p>
    </div>
  );
}
