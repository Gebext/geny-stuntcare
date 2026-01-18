"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import { useAdminChildren } from "@/hooks/admin/useAdminChildren";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  User,
  Activity,
  AlertCircle,
  Baby,
  Dna,
  ArrowUpRight,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

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
        {/* HEADER SECTION - Responsive Padding */}

        <header className="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-[#3AC4B6] to-[#2DA89B] p-8 md:p-10 rounded-[40px] text-white shadow-xl shadow-teal-100/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
          <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[28px] flex items-center justify-center border border-white/30 shrink-0 shadow-inner">
            <Heart className="w-10 h-10 text-white fill-white/20" />
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Database Anak
            </h1>
            <p className="text-teal-50/80 text-sm font-bold uppercase tracking-widest mt-1">
              Global Monitoring System
            </p>
          </div>
        </header>

        {/* FILTER BAR - FIXED: Single column di mobile agar lebar (Gagah) */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-5 rounded-[30px] border border-slate-100 shadow-md shadow-slate-200/20">
          {/* Search Box - Full Width di Mobile */}
          <div className="flex-1 relative group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#3ac3b5] transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Cari nama anak atau ibu..."
              className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-teal-100 focus:bg-white rounded-[22px] text-base font-bold text-slate-700 transition-all outline-none shadow-inner"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Select Box - Full Width di Mobile */}
          <div className="w-full md:w-72 relative group">
            <Filter
              className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#3ac3b5] pointer-events-none"
              size={18}
            />
            <select
              className="w-full pl-14 pr-10 py-5 bg-slate-50 border-2 border-transparent focus:border-teal-100 focus:bg-white rounded-[22px] text-xs font-black uppercase tracking-widest text-slate-600 appearance-none cursor-pointer outline-none transition-all shadow-inner"
              value={riskStatus}
              onChange={(e) => {
                setRiskStatus(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Semua Risiko</option>
              <option value="Risiko Rendah">🟢 Risiko Rendah</option>
              <option value="Perlu Pantauan">🟡 Perlu Pantauan</option>
              <option value="Risiko Tinggi">🔴 Risiko Tinggi</option>
            </select>
          </div>
        </div>

        {/* TABLE CONTAINER - Added horizontal scroll shadow indicators */}
        <div className="bg-white border border-slate-100 rounded-[35px] md:rounded-[45px] overflow-hidden shadow-2xl shadow-slate-200/30 relative">
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-[850px]">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Identitas
                  </th>
                  <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                    Growth Index
                  </th>
                  <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
                    Status AI
                  </th>
                  <th className="px-8 py-7 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">
                    Opsi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {isLoading ? (
                  <TableLoading />
                ) : isError ? (
                  <TableError />
                ) : children.length > 0 ? (
                  children.map((item: any) => {
                    const aiScore = item.aiAnalysis?.score || 0;
                    return (
                      <tr
                        key={item.id}
                        className="hover:bg-slate-50/50 transition-all group"
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm shadow-inner shrink-0",
                                item.gender === "L"
                                  ? "bg-blue-50 text-blue-500"
                                  : "bg-rose-50 text-rose-500",
                              )}
                            >
                              {item.gender}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-black text-slate-700 truncate uppercase">
                                {item.name}
                              </p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter truncate">
                                Bunda: {item.mother?.user?.name || "-"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6">
                          <div className="w-40 space-y-2">
                            <div className="flex justify-between items-end">
                              <span
                                className={cn(
                                  "text-[11px] font-black",
                                  aiScore >= 80
                                    ? "text-[#3ac3b5]"
                                    : aiScore >= 60
                                      ? "text-amber-500"
                                      : "text-rose-500",
                                )}
                              >
                                {aiScore > 0 ? `${aiScore}%` : "N/A"}
                              </span>
                              <span className="text-[8px] font-bold text-slate-300 uppercase">
                                Growth
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all duration-1000",
                                  aiScore >= 80
                                    ? "bg-[#3ac3b5]"
                                    : aiScore >= 60
                                      ? "bg-amber-500"
                                      : "bg-rose-500",
                                )}
                                style={{ width: `${aiScore}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="px-8 py-6 text-center">
                          <StatusBadge status={item.aiAnalysis?.status} />
                        </td>

                        <td className="px-8 py-6 text-right">
                          <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-[#3ac3b5] hover:text-white transition-all shadow-sm">
                            <ArrowUpRight size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <TableEmpty />
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION - Mobile optimized */}
          <div className="px-8 py-8 bg-slate-50/50 border-t border-slate-100 flex flex-row items-center justify-between gap-4">
            <div className="hidden sm:block">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Hal {page} / {meta.totalPages || 1}
              </p>
            </div>

            <div className="flex gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <PaginationBtn
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1 || isLoading}
                icon={<ChevronLeft size={20} />}
              />
              {/* Info page muncul di mobile di tengah tombol */}
              <div className="flex sm:hidden items-center px-4 bg-white border border-slate-100 rounded-2xl text-[10px] font-black">
                {page} / {meta.totalPages || 1}
              </div>
              <PaginationBtn
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= (meta.totalPages || 1) || isLoading}
                icon={<ChevronRight size={20} />}
              />
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

// --- REUSABLE MINI COMPONENTS ---

function StatusBadge({ status }: { status?: string }) {
  const isHigh = status?.includes("Tinggi");
  const isWarning = status?.includes("Pantauan");

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-tighter border shadow-sm",
        isHigh
          ? "bg-rose-50 text-rose-500 border-rose-100"
          : isWarning
            ? "bg-amber-50 text-amber-600 border-amber-100"
            : "bg-[#3ac3b5]/10 text-[#3ac3b5] border-[#3ac3b5]/20",
      )}
    >
      <div
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          isHigh
            ? "bg-rose-500 animate-pulse"
            : isWarning
              ? "bg-amber-500"
              : "bg-[#3ac3b5]",
        )}
      />
      {status || "PENDING"}
    </div>
  );
}

function PaginationBtn({ onClick, disabled, icon }: any) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-12 h-12 flex items-center justify-center bg-white border border-slate-200 text-slate-400 rounded-[18px] disabled:opacity-20 hover:border-[#3ac3b5] transition-all shadow-sm"
    >
      {icon}
    </button>
  );
}

function TableLoading() {
  return (
    <tr>
      <td
        colSpan={4}
        className="py-32 text-center text-[10px] font-black text-slate-300 uppercase animate-pulse"
      >
        Scanning Database...
      </td>
    </tr>
  );
}

function TableError() {
  return (
    <tr>
      <td
        colSpan={4}
        className="py-32 text-center text-[10px] font-black text-rose-400 uppercase tracking-[0.2em]"
      >
        Koneksi Gagal
      </td>
    </tr>
  );
}

function TableEmpty() {
  return (
    <tr>
      <td
        colSpan={4}
        className="py-32 text-center text-[10px] font-black text-slate-300 uppercase"
      >
        Data Kosong
      </td>
    </tr>
  );
}
