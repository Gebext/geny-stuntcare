"use client";

import { useMotherStore } from "@/store/useMotherStore";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { Baby, TrendingUp, Calendar, Heart, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function MotherDashboardPage() {
  const { profile, childProfiles } = useMotherStore();

  // AMBIL DATA ATAU BERIKAN DEFAULT (0 / FALSE)
  const motherName = (profile as any)?.user?.name?.split(" ")[0] || "Bunda";
  const isPregnant = profile?.isPregnant || false;
  const trimester = profile?.trimester || 0;
  const ttdStatus = profile?.ttdCompliance || "Belum Ada Data";

  // Data Anak pertama atau object kosong supaya tidak crash
  const mainChild = childProfiles?.[0] || null;

  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="space-y-8 pb-10">
        <header>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
            Halo, <span className="text-[#3AC4B6]">{motherName}!</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Status Monitoring:{" "}
            <span className={profile ? "text-emerald-500" : "text-amber-500"}>
              {profile ? "Aktif" : "Data Belum Lengkap"}
            </span>
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Card - Tetap muncul meski data 0 */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-16 h-16 rounded-[24px] bg-slate-50 flex items-center justify-center text-slate-300 border-2 border-dashed border-slate-200">
                <Baby size={32} />
              </div>
              <div>
                <h2 className="font-black text-slate-700 uppercase tracking-tight">
                  {mainChild?.name || "Belum Ada Data Anak"}
                </h2>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                  {mainChild
                    ? `Lahir: ${new Date(mainChild.birthDate).toLocaleDateString()}`
                    : "Silakan tambah data anak"}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <StatBox
                label="Berat"
                val={mainChild ? `${mainChild.birthWeight} kg` : "0 kg"}
              />
              <StatBox
                label="Tinggi"
                val={mainChild ? `${mainChild.birthLength} cm` : "0 cm"}
              />
              <StatBox
                label="ASI"
                val={mainChild?.asiExclusive ? "YA" : "TIDAK"}
              />
            </div>
          </div>

          {/* AI Card */}
          <div className="bg-[#3AC4B6] p-8 rounded-[40px] text-white shadow-lg shadow-teal-100/50">
            <TrendingUp className="mb-6 opacity-50" />
            <h3 className="font-black uppercase mb-3">Rekomendasi AI</h3>
            <p className="text-xs font-medium opacity-90 leading-relaxed">
              {isPregnant
                ? `Bunda sedang di Trimester ${trimester}. Pastikan nutrisi cukup.`
                : "Lengkapi profil Bunda untuk mendapatkan saran kesehatan harian."}
            </p>
          </div>
        </div>

        {/* Status Bunda */}
        <div className="bg-white p-6 rounded-[35px] border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Heart className="text-[#3AC4B6]" />
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Status
              </p>
              <p className="text-xs font-black text-slate-700 uppercase">
                {isPregnant ? "Ibu Hamil" : "Ibu Balita"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
              Kepatuhan TTD
            </p>
            <p className="text-xs font-black text-[#3AC4B6] uppercase">
              {ttdStatus}
            </p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

function StatBox({ label, val }: { label: string; val: string }) {
  return (
    <div className="bg-slate-50 p-4 rounded-2xl border border-white">
      <p className="text-[8px] font-black text-slate-400 uppercase mb-1">
        {label}
      </p>
      <p className="text-xs font-black text-slate-700">{val}</p>
    </div>
  );
}
