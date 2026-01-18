"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAdminChildren } from "@/hooks/admin/useAdminChildren";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Baby,
  Calendar,
  User,
  Activity,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";

export default function AdminChildrenPage() {
  const {
    children,
    meta,
    isLoading,
    isError,
    page,
    setPage,
    search,
    setSearch,
    riskStatus,
    setRiskStatus,
  } = useAdminChildren();

  return (
    <RoleGuard allowedRoles={["admin"]}>
      <div className="space-y-6 animate-in fade-in duration-700 pb-20">
        {/* Header & Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              Database Anak
            </h1>
            <p className="text-sm font-medium text-slate-500 italic">
              Data terpadu tumbuh kembang dan skor risiko stunting.
            </p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-[30px] border border-slate-100 shadow-sm">
          <div className="relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <input
              type="text"
              placeholder="Cari nama anak atau ibu..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-[#3ac3b5] transition-all outline-none"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="relative">
            <Filter
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
              size={18}
            />
            <select
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-50 border-none text-sm focus:ring-2 focus:ring-[#3ac3b5] appearance-none cursor-pointer outline-none font-bold text-slate-600"
              value={riskStatus}
              onChange={(e) => {
                setRiskStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua Tingkat Risiko</option>
              <option value="Risiko Rendah">🟢 Risiko Rendah</option>
              <option value="Perlu Pantauan">🟡 Perlu Pantauan</option>
              <option value="Risiko Tinggi">🔴 Risiko Tinggi</option>
            </select>
          </div>
        </div>

        {/* Main Table */}
        <div className="bg-white border border-slate-100 rounded-[40px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Biodata Anak
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    AI Health Score
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Status
                  </th>
                  <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Activity className="w-8 h-8 text-[#3ac3b5] animate-pulse" />
                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                          Sinkronisasi Database...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : isError ? (
                  <tr>
                    <td colSpan={4} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-3 text-rose-400">
                        <AlertCircle size={32} />
                        <p className="text-xs font-bold uppercase">
                          Gagal memuat data dari server
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : children.length > 0 ? (
                  children.map((item: any) => {
                    const aiScore = item.aiAnalysis?.score || 0;
                    const scoreColor =
                      aiScore >= 80
                        ? "text-[#3ac3b5]"
                        : aiScore >= 60
                          ? "text-amber-500"
                          : "text-rose-500";
                    const barColor =
                      aiScore >= 80
                        ? "bg-[#3ac3b5]"
                        : aiScore >= 60
                          ? "bg-amber-500"
                          : "bg-rose-500";

                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/40 transition-all group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shadow-sm ${item.gender === "L" ? "bg-blue-50 text-blue-500" : "bg-rose-50 text-rose-500"}`}
                            >
                              {item.gender}
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-700 uppercase leading-none mb-1.5">
                                {item.name}
                              </p>
                              <div className="flex items-center gap-2 text-slate-400">
                                <User size={12} className="text-[#3ac3b5]" />
                                <span className="text-[10px] font-bold uppercase tracking-tight">
                                  {item.mother?.user?.name || "Tanpa Nama"}
                                </span>
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="w-40 space-y-2">
                            <div className="flex justify-between items-end">
                              <span
                                className={`text-[11px] font-black ${scoreColor}`}
                              >
                                {aiScore > 0 ? `${aiScore}/100` : "N/A"}
                              </span>
                              <span className="text-[9px] font-bold text-slate-300 uppercase">
                                Growth Index
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden shadow-inner">
                              <div
                                className={`h-full rounded-full transition-all duration-1000 ${barColor}`}
                                style={{ width: `${aiScore}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div
                            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                              item.aiAnalysis?.status?.includes("Tinggi")
                                ? "bg-rose-50 text-rose-500 border-rose-100"
                                : item.aiAnalysis?.status?.includes("Pantauan")
                                  ? "bg-amber-50 text-amber-600 border-amber-100"
                                  : "bg-[#3ac3b5]/10 text-[#3ac3b5] border-[#3ac3b5]/20"
                            }`}
                          >
                            <div
                              className={`w-1.5 h-1.5 rounded-full animate-pulse ${item.aiAnalysis?.status?.includes("Tinggi") ? "bg-rose-500" : "bg-[#3ac3b5]"}`}
                            />
                            {item.aiAnalysis?.status || "PENDING"}
                          </div>
                        </td>

                        <td className="px-8 py-6 text-center">
                          <button className="px-5 py-2.5 bg-white text-slate-400 text-[10px] font-black uppercase rounded-2xl hover:bg-[#3ac3b5] hover:text-white hover:shadow-lg hover:shadow-[#3ac3b5]/20 transition-all border border-slate-100">
                            Detail Periksa
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-32 text-center text-slate-300 font-black uppercase text-[10px] tracking-[0.3em]"
                    >
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Futuristic Pagination */}
          <div className="px-8 py-8 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
            <div className="flex flex-col">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Halaman {page} dari {meta.totalPages}
              </p>
              <p className="text-[9px] font-bold text-slate-300 uppercase italic">
                Total {meta.total} data terdaftar
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl disabled:opacity-30 hover:border-[#3ac3b5] hover:text-[#3ac3b5] transition-all shadow-sm"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= meta.totalPages || isLoading}
                className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 rounded-2xl disabled:opacity-30 hover:border-[#3ac3b5] hover:text-[#3ac3b5] transition-all shadow-sm"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
