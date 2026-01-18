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
      <div className="h-[80vh] w-full flex flex-col items-center justify-center gap-4 px-6">
        <div className="relative">
          <Loader2 className="w-10 h-10 md:w-12 md:h-12 animate-spin text-[#3AC4B6]" />
          <Heart className="w-4 h-4 md:w-5 md:h-5 text-[#3AC4B6] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
        </div>
        <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] md:tracking-[0.3em] text-center">
          Menyinkronkan data Bunda...
        </p>
      </div>
    );
  }

  if (!profile) {
    return (
      <RoleGuard allowedRoles={["mother"]}>
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-2xl mx-auto pt-6 md:pt-10 px-4">
          <div className="bg-white p-6 md:p-10 rounded-[30px] md:rounded-[45px] border border-slate-100 shadow-xl shadow-slate-200/50 text-center">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-teal-50 rounded-[25px] md:rounded-[35px] flex items-center justify-center mx-auto mb-6 md:mb-8 relative">
              <Sparkles className="absolute -top-1 -right-1 text-amber-400 w-6 h-6 md:w-8 md:h-8" />
              <Heart className="w-10 h-10 md:w-12 md:h-12 text-[#3AC4B6] fill-[#3AC4B6]/20" />
            </div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mb-3 md:mb-4">
              Halo Bunda, Selamat Datang!
            </h1>
            <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed mb-8 md:mb-10">
              Untuk memberikan analisis kesehatan yang akurat bagi Bunda dan si
              kecil, yuk lengkapi profil kesehatan Bunda terlebih dahulu.
            </p>
            <Link
              href="/dashboard/mother/me"
              className="group flex items-center justify-center gap-3 w-full py-4 md:py-5 bg-[#3AC4B6] text-white rounded-[20px] md:rounded-[25px] font-black uppercase tracking-[0.2em] text-[10px] md:text-[11px] shadow-lg shadow-teal-100 hover:scale-[1.02] transition-all"
            >
              Lengkapi Profil Sekarang{" "}
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </RoleGuard>
    );
  }

  const mainChild = childProfiles?.[0];
  const hasMultipleChildren = childProfiles && childProfiles.length > 1;

  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="animate-in fade-in slide-in-from-bottom-3 duration-700 space-y-6 md:space-y-8 pb-10 px-4 md:px-0">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
              Halo, <span className="text-[#3AC4B6]">Bunda!</span>
            </h1>
            <p className="text-slate-400 text-[9px] md:text-[11px] font-bold uppercase tracking-widest mt-1">
              Ringkasan Kesehatan Keluarga
            </p>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 rounded-full bg-[#3AC4B6] animate-ping" />
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card Anak Utama */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[30px] md:rounded-[40px] border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] relative overflow-hidden">
            {mainChild ? (
              <>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-8 md:mb-10 relative z-10">
                  <div className="flex gap-4 md:gap-5">
                    <div className="shrink-0 w-14 h-14 md:w-16 md:h-16 rounded-[20px] md:rounded-[24px] bg-[#FDEEE9] flex flex-col items-center justify-center text-[#F47458] shadow-inner border-2 border-white">
                      <span className="text-[8px] md:text-[10px] font-black leading-none uppercase">
                        {mainChild.gender === "L" ? "LK" : "PR"}
                      </span>
                      <Baby className="w-6 h-6 md:w-7 md:h-7" />
                    </div>
                    <div>
                      <h2 className="text-lg md:text-xl font-black text-slate-800 uppercase tracking-tight line-clamp-1">
                        {mainChild.name}
                      </h2>
                      <p className="text-slate-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mt-1">
                        <Calendar className="w-3 h-3 text-[#3AC4B6]" />
                        {new Date(mainChild.birthDate).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          },
                        )}
                      </p>
                    </div>
                  </div>

                  {hasMultipleChildren && (
                    <Link
                      href="/dashboard/mother/child"
                      className="inline-flex items-center self-start gap-2 px-3 py-2 bg-slate-50 hover:bg-[#3AC4B6] text-slate-400 hover:text-white rounded-xl border border-slate-100 transition-all duration-300 group/btn"
                    >
                      <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                        Semua Anak ({childProfiles.length})
                      </span>
                      <ChevronRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 relative z-10">
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
                      className: "col-span-2 md:col-span-1",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={cn(
                        "p-4 md:p-5 bg-slate-50/50 rounded-2xl md:rounded-3xl border border-white",
                        stat.className,
                      )}
                    >
                      <p className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1 md:mb-2">
                        {stat.label}
                      </p>
                      <p
                        className={cn(
                          "text-xs md:text-sm font-black uppercase",
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
              <div className="h-full flex flex-col items-center justify-center py-8 md:py-10 text-center">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-slate-200">
                  <PlusCircle className="w-6 h-6 md:w-8 md:h-8 text-slate-300" />
                </div>
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
                  Data Balita Belum Ada
                </p>
                <Link
                  href="/dashboard/mother/child"
                  className="px-5 py-3 bg-[#3AC4B6] text-white text-[9px] md:text-[10px] font-black rounded-xl md:rounded-2xl uppercase tracking-[0.2em] shadow-lg shadow-teal-50 hover:scale-105 transition-transform"
                >
                  Tambah Data Si Kecil
                </Link>
              </div>
            )}
          </div>

          {/* AI Insight Card */}
          <div className="bg-gradient-to-br from-[#3AC4B6] to-[#2DA89B] p-7 md:p-9 rounded-[30px] md:rounded-[45px] text-white shadow-xl shadow-teal-100/50 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-full -mr-12 -mt-12 md:-mr-16 md:-mt-16 blur-2xl transition-transform group-hover:scale-150 duration-700" />
            <div className="relative z-10">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 backdrop-blur-md rounded-xl md:rounded-2xl flex items-center justify-center mb-6 md:mb-8 border border-white/30">
                <TrendingUp className="w-5 h-5 md:w-6 h-6 text-white" />
              </div>
              <h3 className="text-base md:text-lg font-black uppercase tracking-tight mb-2 md:mb-3">
                Rekomendasi GENY
              </h3>
              <p className="text-xs md:text-sm text-teal-50 font-medium leading-relaxed opacity-90">
                {profile?.isPregnant
                  ? `Bunda sedang hamil Trimester ${profile.trimester}. Pastikan asupan zat besi terjaga ya!`
                  : "Optimalkan tumbuh kembang si kecil dengan stimulasi motorik setiap hari."}
              </p>
            </div>
            <Link
              href={"/dashboard/mother/analysis"}
              className="mt-6 md:mt-8 flex items-center justify-center gap-3 text-[9px] md:text-[10px] font-black uppercase tracking-widest bg-white text-[#3AC4B6] py-3 md:py-4 rounded-xl md:rounded-[20px] transition-all hover:bg-teal-50 shadow-lg active:scale-95"
            >
              Analisis Detail <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Info Ringkas Status Ibu */}
        <div className="bg-white p-5 md:p-7 rounded-[30px] md:rounded-[40px] border border-slate-50 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:border-[#3AC4B6]/20 transition-all">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="w-12 h-12 md:w-14 md:h-14 bg-[#ECF7F6] text-[#3AC4B6] rounded-xl md:rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-12">
              <Calendar className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div>
              <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                Status Bunda
              </p>
              <p className="text-xs md:text-sm font-black text-slate-700 uppercase tracking-tight">
                {profile?.isPregnant
                  ? `Ibu Hamil (TRIMESTER ${profile.trimester})`
                  : "Ibu Balita / Menyusui"}
              </p>
            </div>
          </div>
          <div className="w-full sm:w-auto flex sm:flex-col justify-between sm:justify-end items-center sm:items-end border-t sm:border-t-0 pt-3 sm:pt-0">
            <p className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Kepatuhan TTD
            </p>
            <div className="flex items-center gap-2">
              {profile?.ttdCompliance === "Patuh" && (
                <CheckCircle2 className="w-3 h-3 md:w-4 md:h-4 text-[#3AC4B6]" />
              )}
              <p
                className={cn(
                  "text-xs md:text-sm font-black uppercase tracking-tight",
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
