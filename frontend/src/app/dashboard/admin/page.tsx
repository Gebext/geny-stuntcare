"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAdminDashboard } from "@/hooks/admin/useAdminDashboard";
import {
  Users,
  Baby,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  TrendingUp,
  UserPlus,
  Mail,
  Clock,
} from "lucide-react";

export default function AdminOverviewPage() {
  const { data, isLoading, error } = useAdminDashboard();

  if (error)
    return (
      <div className="p-10 text-center text-rose-500 font-black text-xs tracking-widest uppercase">
        Gagal Sinkronisasi Data Agregat
      </div>
    );

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 pb-10">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
            Dashboard Agregat
          </h1>
          <p className="text-sm font-medium text-slate-500 italic">
            Data terintegrasi seluruh wilayah binaan.
          </p>
        </div>

        {isLoading ? (
          <div className="h-[50vh] flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#3ac3b5] animate-spin mb-4" />
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center">
              Menghubungkan ke Pusat Data...
            </p>
          </div>
        ) : (
          <>
            {/* 1. STATS ROW (Overview) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard
                title="Total User"
                value={data?.overview?.totalUsers ?? 0}
                icon={<Users size={20} />}
                color="bg-blue-50 text-blue-600"
              />
              <StatCard
                title="Total Anak"
                value={data?.overview?.totalAnak ?? 0}
                icon={<Baby size={20} />}
                color="bg-emerald-50 text-emerald-600"
              />
              <StatCard
                title="Total Ibu"
                value={data?.overview?.totalIbu ?? 0}
                icon={<Users size={20} />}
                color="bg-orange-50 text-orange-600"
              />
              <StatCard
                title="Kader Aktif"
                value={data?.overview?.totalKader ?? 0}
                icon={<ShieldCheck size={20} />}
                color="bg-purple-50 text-purple-600"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* 2. LEFT COLUMN: DISTRIBUTION & RECENT */}
              <div className="space-y-8 lg:col-span-1">
                {/* Analisa Risiko AI */}
                <div className="bg-white border border-slate-100 rounded-[35px] p-8 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <TrendingUp size={14} /> Analisa Risiko AI
                  </h3>
                  <div className="space-y-4">
                    {(data?.stuntingDistribution || []).map(
                      (item: any, idx: number) => (
                        <div
                          key={idx}
                          className="p-4 bg-slate-50/50 rounded-2xl flex items-center justify-between border border-slate-100"
                        >
                          <span className="text-xs font-bold text-slate-600">
                            {item.status}
                          </span>
                          <span className="px-3 py-1 bg-white text-[#3ac3b5] rounded-lg text-sm font-black shadow-sm border border-slate-100">
                            {item.count}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {/* Pendaftar Terbaru */}
                <div className="bg-white border border-slate-100 rounded-[35px] p-8 shadow-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                    <UserPlus size={14} /> Pendaftar Terbaru
                  </h3>
                  <div className="space-y-5">
                    {(data?.recentRegistrations || []).map(
                      (user: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex flex-col gap-1 border-b border-slate-50 pb-3 last:border-0"
                        >
                          <p className="text-[11px] font-black text-slate-800 uppercase truncate">
                            {user.name}
                          </p>
                          <div className="flex items-center gap-3 text-slate-400">
                            <span className="flex items-center gap-1 text-[9px] font-bold">
                              <Mail size={10} /> {user.email}
                            </span>
                            <span className="flex items-center gap-1 text-[9px] font-bold text-slate-300">
                              <Clock size={10} />{" "}
                              {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>

              {/* 3. RIGHT COLUMN: KADER PERFORMANCE (#3ac3b5 Theme) */}
              <div className="lg:col-span-2 bg-white border border-slate-100 rounded-[40px] p-10 shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#3ac3b5]">
                      Kinerja Binaan Kader
                    </h3>
                    <div className="px-3 py-1 bg-[#3ac3b5]/10 rounded-full text-[9px] font-black text-[#3ac3b5] uppercase tracking-tighter">
                      Sistem Pantau Aktif
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(data?.kaderPerformance || []).map(
                      (kader: any, idx: number) => (
                        <div
                          key={idx}
                          className="group p-6 bg-slate-50/50 border border-slate-100 rounded-[30px] hover:bg-white hover:border-[#3ac3b5]/30 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-white border border-slate-100 text-[#3ac3b5] flex items-center justify-center font-black shadow-sm">
                              {idx + 1}
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-white border border-slate-100 px-3 py-1 rounded-full group-hover:text-[#3ac3b5] transition-colors">
                              {kader.jumlahIbuDibina} Binaan
                            </span>
                          </div>

                          <p className="text-sm font-black uppercase tracking-tight text-slate-700 group-hover:text-[#3ac3b5] transition-colors truncate">
                            {kader.namaKader}
                          </p>

                          <div className="mt-5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                                Cakupan Wilayah
                              </span>
                              <span className="text-[9px] font-black text-[#3ac3b5] italic">
                                {Math.min(
                                  (kader.jumlahIbuDibina / 10) * 100,
                                  100,
                                ).toFixed(0)}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#3ac3b5] h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(58,195,181,0.3)]"
                                style={{
                                  width: `${Math.min((kader.jumlahIbuDibina / 10) * 100, 100)}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </RoleGuard>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <div className="p-7 bg-white border border-slate-100 rounded-[35px] shadow-sm hover:shadow-md transition-all group">
      <div
        className={`w-12 h-12 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
      >
        {icon}
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
        {title}
      </p>
      <p className="text-2xl font-black text-slate-800 tracking-tight">
        {value}
      </p>
    </div>
  );
}
