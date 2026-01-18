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
  AlertCircle,
  PlusCircle,
  Heart,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useFetchMotherProfile } from "@/hooks/mother/useMotherData";
import Link from "next/link";

export default function MotherDashboardPage() {
  const { isLoading } = useFetchMotherProfile();
  const { profile, childProfiles } = useMotherStore();

  if (isLoading) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-[#3AC4B6]" />
          <Heart className="w-5 h-5 text-[#3AC4B6] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Menyinkronkan data Bunda...
        </p>
      </div>
    );
  }

  // LOGIC: Jika profil Bunda belum diisi sama sekali
  if (!profile) {
    return (
      <RoleGuard allowedRoles={["mother"]}>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto pt-10 px-4">
          <div className="bg-white p-10 rounded-[45px] border border-slate-100 shadow-xl shadow-slate-200/50 text-center">
            <div className="w-24 h-24 bg-teal-50 rounded-[35px] flex items-center justify-center mx-auto mb-8 relative">
              <Sparkles className="absolute -top-2 -right-2 text-amber-400 w-8 h-8" />
              <Heart className="w-12 h-12 text-[#3AC4B6] fill-[#3AC4B6]/20" />
            </div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-4">
              Halo Bunda, Selamat Datang!
            </h1>
            <p className="text-sm text-slate-400 font-medium leading-relaxed mb-10">
              Untuk memberikan analisis kesehatan yang akurat bagi Bunda dan si
              kecil, yuk lengkapi profil kesehatan Bunda terlebih dahulu.
            </p>
            <Link
              href="/dashboard/mother/me"
              className="group flex items-center justify-center gap-3 w-full py-5 bg-[#3AC4B6] text-white rounded-[25px] font-black uppercase tracking-[0.2em] text-[11px] shadow-lg shadow-teal-100 hover:scale-[1.02] transition-all"
            >
              Lengkapi Profil Sekarang{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </RoleGuard>
    );
  }

  // Ambil anak pertama untuk display
  const mainChild = childProfiles?.[0];

  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 space-y-8 pb-10">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Halo, <span className="text-[#3AC4B6]">Bunda!</span>
            </h1>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mt-1">
              Ringkasan Kesehatan Keluarga
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#3AC4B6] animate-ping" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Anak Utama */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden">
            {mainChild ? (
              <>
                <div className="flex justify-between items-start mb-10 relative z-10">
                  <div className="flex gap-5">
                    <div className="w-16 h-16 rounded-[24px] bg-[#FDEEE9] flex flex-col items-center justify-center text-[#F47458] shadow-inner border-2 border-white">
                      <span className="text-xs font-black leading-none">
                        {mainChild.gender}
                      </span>
                      <Baby className="w-7 h-7" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                        {mainChild.name}
                      </h2>
                      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3 h-3" />
                        Lahir:{" "}
                        {new Date(mainChild.birthDate).toLocaleDateString(
                          "id-ID",
                          { day: "numeric", month: "long", year: "numeric" },
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 relative z-10">
                  {[
                    {
                      label: "Berat Lahir",
                      val: `${mainChild.birthWeight} kg`,
                      color: "bg-blue-50 text-blue-600",
                    },
                    {
                      label: "Tinggi Lahir",
                      val: `${mainChild.birthLength} cm`,
                      color: "bg-purple-50 text-purple-600",
                    },
                    {
                      label: "ASI Eksklusif",
                      val: mainChild.asiExclusive ? "YA" : "TIDAK",
                      color: "bg-orange-50 text-orange-600",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="p-5 bg-slate-50/50 rounded-3xl border border-white"
                    >
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">
                        {stat.label}
                      </p>
                      <p
                        className={cn(
                          "text-sm font-black uppercase",
                          stat.color.split(" ")[1],
                        )}
                      >
                        {stat.val}
                      </p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              /* State Jika Belum Ada Data Anak */
              <div className="h-full flex flex-col items-center justify-center py-10 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
                  <PlusCircle className="w-8 h-8 text-slate-300" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Data Balita Belum Ada
                </p>
                <Link
                  href="/dashboard/mother/child"
                  className="text-xs font-black text-[#3AC4B6] underline uppercase tracking-widest"
                >
                  Tambah Data Si Kecil
                </Link>
              </div>
            )}
          </div>

          {/* AI Insight Card */}
          <div className="bg-gradient-to-br from-[#3AC4B6] to-[#2DA89B] p-9 rounded-[45px] text-white shadow-xl shadow-teal-100/50 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl transition-transform group-hover:scale-150 duration-700" />
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 border border-white/30">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight mb-3">
                Rekomendasi GENY
              </h3>
              <p className="text-sm text-teal-50 font-medium leading-relaxed opacity-90">
                {profile?.isPregnant
                  ? `Bunda sedang hamil Trimester ${profile.trimester}. Pastikan asupan zat besi terjaga ya!`
                  : "Optimalkan tumbuh kembang si kecil dengan stimulasi motorik setiap hari."}
              </p>
            </div>
            <Link
              href={"/dashboard/mother/analysis"}
              className="mt-8 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest bg-white text-[#3AC4B6] py-4 rounded-[20px] transition-all hover:bg-teal-50 shadow-lg active:scale-95"
            >
              Analisis Detail <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Info Ringkas Status Ibu */}
        <div className="bg-white p-7 rounded-[40px] border border-slate-50 shadow-sm flex items-center justify-between group hover:border-[#3AC4B6]/20 transition-all">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-[#ECF7F6] text-[#3AC4B6] rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Status Bunda
              </p>
              <p className="text-sm font-black text-slate-700 uppercase tracking-tight">
                {profile?.isPregnant
                  ? `Ibu Hamil (TRIMESTER ${profile.trimester})`
                  : "Ibu Balita / Menyusui"}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Kepatuhan TTD
            </p>
            <div className="flex items-center gap-2 justify-end">
              {profile?.ttdCompliance === "Patuh" && (
                <CheckCircle2 className="w-4 h-4 text-[#3AC4B6]" />
              )}
              <p
                className={cn(
                  "text-sm font-black uppercase tracking-tight",
                  profile?.ttdCompliance === "Patuh"
                    ? "text-[#3AC4B6]"
                    : "text-rose-500",
                )}
              >
                {profile?.ttdCompliance || "Tidak Patuh"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
