"use client";

import { useMotherStore } from "@/store/useMotherStore";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  Baby,
  TrendingUp,
  Heart,
  ChevronRight,
  PlusCircle,
  Sparkles,
  LayoutGrid, // Icon tambahan
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function MotherDashboardPage() {
  const { profile, childProfiles } = useMotherStore();

  const motherName = (profile as any)?.user?.name?.split(" ")[0] || "Bunda";
  const isPregnant = profile?.isPregnant || false;
  const ttdStatus = profile?.ttdCompliance || "Belum Ada Data";

  // LOGIC LIMIT: Hanya ambil 4 anak pertama untuk dashboard
  const displayedChildren = childProfiles?.slice(0, 4) || [];
  const hasMoreChildren = (childProfiles?.length || 0) > 4;

  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="space-y-8 pb-20">
        {/* HEADER */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">
              Halo, <span className="text-[#3AC4B6]">{motherName}!</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Status Monitoring:{" "}
              <span className={profile ? "text-emerald-500" : "text-amber-500"}>
                {profile ? "Aktif" : "Lengkapi Profil"}
              </span>
            </p>
          </div>
        </header>

        {/* SECTION: DAFTAR ANAK */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Buah Hati Bunda ({childProfiles?.length || 0})
            </h3>

            {/* LINK LIHAT SEMUA (Hanya muncul jika anak > 4) */}
            {hasMoreChildren && (
              <Link
                href="/dashboard/mother/child"
                className="flex items-center gap-1 text-[#3AC4B6] hover:underline"
              >
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Lihat Semua
                </span>
                <ChevronRight size={14} />
              </Link>
            )}
          </div>

          {!childProfiles || childProfiles.length === 0 ? (
            <div className="bg-white p-10 rounded-[40px] border-2 border-dashed border-slate-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
                <Baby size={32} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Belum ada data anak terdaftar
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Render Maksimal 4 Anak */}
              {displayedChildren.map((child) => (
                <ChildCard key={child.id} child={child} />
              ))}

              {/* ACTION CARD: Jika anak > 4, tampilkan kartu navigasi "Lihat Lainnya" */}
              {hasMoreChildren && (
                <Link href="/dashboard/mother/child">
                  <div className="bg-slate-900 h-full p-6 rounded-[35px] border border-slate-800 shadow-sm hover:bg-slate-800 transition-all group flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center text-[#3AC4B6] group-hover:scale-110 transition-transform">
                        <LayoutGrid size={24} />
                      </div>
                      <div>
                        <h4 className="font-black text-white uppercase tracking-tight">
                          +{childProfiles.length - 4} Anak Lainnya
                        </h4>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                          Lihat semua daftar anak
                        </p>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* SECTION: INFO KESEHATAN IBU & AI (Sama seperti sebelumnya) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ... (AI Card & Status Bunda) */}
          <div className="lg:col-span-2 bg-[#3AC4B6] p-8 rounded-[40px] text-white shadow-xl shadow-teal-100/50 relative overflow-hidden group">
            <Sparkles className="absolute -right-4 -top-4 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                  <TrendingUp size={20} />
                </div>
                <h3 className="font-black uppercase tracking-widest text-sm">
                  Geny AI Insight
                </h3>
              </div>
              <p className="text-sm font-medium opacity-95 leading-relaxed mb-8 max-w-md">
                AI kami memantau pertumbuhan si kecil. Klik tombol di bawah
                untuk melihat analisis mendalam berdasarkan data terbaru.
              </p>
              <Link href="/dashboard/mother/analysis">
                <button className="bg-white text-[#3AC4B6] px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-teal-50 transition-all active:scale-95">
                  Buka Dashboard Analisis
                </button>
              </Link>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm flex flex-col justify-between">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-pink-50 text-pink-500 rounded-[24px]">
                <Heart size={24} fill="currentColor" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Kondisi Bunda
                </p>
                <p className="font-black text-slate-800 uppercase tracking-tight">
                  {isPregnant ? "Sedang Hamil" : "Ibu Menyusui"}
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Kepatuhan TTD
              </span>
              <span className="text-[10px] font-black text-[#3AC4B6] uppercase">
                {ttdStatus}
              </span>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

// --- SUB COMPONENTS ---
function ChildCard({ child }: { child: any }) {
  return (
    <Link href={`/dashboard/mother/child/${child.id}`}>
      <div className="bg-white p-6 rounded-[35px] border border-slate-100 shadow-sm hover:border-[#3AC4B6]/30 transition-all group cursor-pointer">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#3AC4B6] group-hover:bg-[#3AC4B6] group-hover:text-white transition-colors">
              <Baby size={24} />
            </div>
            <div>
              <h4 className="font-black text-slate-700 uppercase tracking-tight group-hover:text-[#3AC4B6] transition-colors">
                {child.name}
              </h4>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                {child.gender === "MALE" ? "Laki-laki" : "Perempuan"}
              </p>
            </div>
          </div>
          <ChevronRight
            className="text-slate-300 group-hover:text-[#3AC4B6] transition-all group-hover:translate-x-1"
            size={20}
          />
        </div>

        <div className="grid grid-cols-3 gap-3">
          <StatBox label="Lahir (kg)" val={child.birthWeight} />
          <StatBox label="Lahir (cm)" val={child.birthLength} />
          <StatBox
            label="Status AI"
            val={child.stuntingRisk || "Pending"}
            color={
              child.stuntingRisk === "NORMAL"
                ? "text-emerald-500"
                : "text-amber-500"
            }
          />
        </div>
      </div>
    </Link>
  );
}

function StatBox({
  label,
  val,
  color = "text-slate-700",
}: {
  label: string;
  val: string | number;
  color?: string;
}) {
  return (
    <div className="bg-slate-50 p-3 rounded-2xl border border-white flex flex-col items-center text-center">
      <p className="text-[7px] font-black text-slate-400 uppercase mb-1 tracking-tighter">
        {label}
      </p>
      <p className={cn("text-[10px] font-black uppercase", color)}>{val}</p>
    </div>
  );
}
