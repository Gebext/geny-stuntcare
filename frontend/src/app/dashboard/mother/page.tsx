"use client";

import { useMotherStore } from "@/store/useMotherStore";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  Loader2,
  Baby,
  TrendingUp,
  ChevronRight,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFetchMotherProfile } from "@/hooks/mother/useMotherData";

export default function MotherDashboardPage() {
  // 1. Trigger fetching di sini (Centralized)
  const { isLoading } = useFetchMotherProfile();

  // 2. Ambil data dari Zustand
  const { profile, childProfiles } = useMotherStore();

  if (isLoading) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#3AC4B6]" />
        <p className="text-slate-500 font-medium">
          Menyinkronkan data Bunda...
        </p>
      </div>
    );
  }

  // Ambil anak pertama untuk display (sesuai JSON yang Anda kirim)
  const mainChild = childProfiles[0];

  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 space-y-8 pb-10">
        <header>
          <h1 className="text-2xl font-bold text-slate-800">
            Selamat Pagi, <span className="text-[#3AC4B6]">Bunda!</span>
          </h1>
          <p className="text-slate-500 text-sm">
            Berikut adalah ringkasan kesehatan keluarga kecil Anda.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Anak Utama */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-8">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#FDEEE9] flex items-center justify-center text-[#F47458]">
                  <Baby className="w-9 h-9" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">
                    {mainChild?.name || "Belum Ada Data"}
                  </h2>
                  <p className="text-slate-400 text-sm font-medium">
                    {mainChild?.birthDate
                      ? `Lahir: ${new Date(
                          mainChild.birthDate
                        ).toLocaleDateString("id-ID")}`
                      : "-"}
                  </p>
                </div>
              </div>
              <div
                className={cn(
                  "px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest",
                  mainChild?.stuntingRisk === "PENDING"
                    ? "bg-amber-50 text-amber-600"
                    : "bg-[#ECF7F6] text-[#3AC4B6]"
                )}
              >
                {mainChild?.stuntingRisk || "UNKNOWN"}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Berat Lahir
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {mainChild?.birthWeight || 0} kg
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Tinggi Lahir
                </p>
                <p className="text-lg font-bold text-slate-800">
                  {mainChild?.birthLength || 0} cm
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl md:col-span-1 col-span-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  ASI Eksklusif
                </p>
                <p className="text-sm font-bold text-[#3AC4B6]">
                  {mainChild?.asiExclusive ? "Ya" : "Tidak"}
                </p>
              </div>
            </div>
          </div>

          {/* AI Insight Card */}
          <div className="bg-gradient-to-br from-[#3AC4B6] to-[#2DA89B] p-8 rounded-[35px] text-white shadow-lg shadow-teal-100 flex flex-col justify-between">
            <div>
              <TrendingUp className="w-10 h-10 mb-6 opacity-80" />
              <h3 className="text-lg font-bold mb-2">Rekomendasi GENY</h3>
              <p className="text-sm text-teal-50 leading-relaxed opacity-90">
                {profile?.isPregnant
                  ? "Bunda sedang hamil trimester " +
                    profile.trimester +
                    ". Jangan lupa konsumsi TTD setiap hari ya!"
                  : "Si kecil membutuhkan nutrisi seimbang untuk mendukung pertumbuhannya."}
              </p>
            </div>
            <button className="mt-6 flex items-center gap-2 text-xs font-bold bg-white/20 hover:bg-white/30 backdrop-blur-md px-5 py-3 rounded-2xl transition-all">
              Buka Analisis <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Info Ringkas Status Ibu */}
        <div className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#ECF7F6] text-[#3AC4B6] rounded-full flex items-center justify-center">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase">
                Status Bunda
              </p>
              <p className="text-sm font-bold text-slate-700">
                {profile?.isPregnant
                  ? `Ibu Hamil (Trimester ${profile.trimester})`
                  : "Ibu Balita"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold text-slate-400 uppercase">
              Kepatuhan TTD
            </p>
            <p
              className={cn(
                "text-sm font-bold",
                profile?.ttdCompliance === "Patuh"
                  ? "text-[#3AC4B6]"
                  : "text-rose-500"
              )}
            >
              {profile?.ttdCompliance || "Tidak Patuh"}
            </p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
