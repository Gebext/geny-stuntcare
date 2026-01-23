"use client";

import { useKaderAssignment } from "@/hooks/admin/useKaderAssignment";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import {
  ChevronRight,
  Heart,
  UserPlus,
  ShieldPlus,
  Search,
  Filter,
  ChevronLeft,
  AlertCircle,
  Users,
  UserCheck,
  Loader2,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function MonitoringPage() {
  const {
    mothers,
    kaders,
    meta,
    loading,
    page,
    setPage,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    assignKader,
    unassignKader,
  } = useKaderAssignment();

  const {
    isOpen,
    data: confirmData,
    openModal,
    closeModal,
  } = useConfirmModal<any>();

  const handleConfirmDelete = () => {
    if (confirmData) {
      unassignKader(confirmData.motherId, confirmData.kaderId);
      closeModal();
    }
  };

  

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row items-center gap-6 bg-gradient-to-br from-[#3AC4B6] to-[#2DA89B] p-8 md:p-10 rounded-[40px] text-white shadow-xl shadow-teal-100/50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
        <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[28px] flex items-center justify-center border border-white/30 shrink-0 shadow-inner">
          <Heart className="w-10 h-10 text-white fill-white/20" />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Kesehatan Bunda
          </h1>
          <p className="text-teal-50/80 text-sm font-bold uppercase tracking-widest mt-1">
            Sistem Penugasan & Monitoring Kader
          </p>
        </div>
      </header>

      {/* ACTION & FILTER AREA */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-3 w-full lg:w-auto">
          <QuickActionLink
            href="/dashboard/admin/users/add-kader"
            label="Tambah Kader"
            icon={<UserPlus className="w-4 h-4" />}
            theme="teal"
          />
          <QuickActionLink
            href="/dashboard/admin/users/add-admin"
            label="Tambah Admin"
            icon={<ShieldPlus className="w-4 h-4" />}
            theme="slate"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama ibu binaan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-100 rounded-[20px] text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-[#3AC4B6]/10 shadow-sm transition-all placeholder:text-slate-300"
            />
          </div>
          <div className="relative w-full sm:w-auto">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full pl-11 pr-10 py-3.5 bg-white border border-slate-100 rounded-[20px] text-xs font-black uppercase tracking-widest outline-none appearance-none cursor-pointer shadow-sm text-slate-500 transition-all hover:bg-slate-50"
            >
              <option value="ALL">Semua Status</option>
              <option value="ASSIGNED">Sudah Ditugaskan</option>
              <option value="UNASSIGNED">Belum Ditugaskan</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="bg-white rounded-[35px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Ibu Binaan
                </th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Status & Kader
                </th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Update Penugasan
                </th>
                <th className="px-8 py-7 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <TableLoadingState />
              ) : mothers.length === 0 ? (
                <TableEmptyState />
              ) : (
                mothers.map((mother: any) => {
                  const assignment = mother.kaderAssignments?.[0];
                  return (
                    <tr
                      key={mother.id}
                      className="hover:bg-slate-50/30 transition-all group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="font-black text-slate-700 text-sm group-hover:text-[#3AC4B6] transition-colors">
                            {mother.user?.name}
                          </span>
                          <span className="text-[11px] text-slate-400 font-bold mt-1 tracking-wider">
                            {mother.user?.phone || "TANPA TELEPON"}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {assignment ? (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                            <UserCheck className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              {assignment.kader?.name}
                            </span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-400 rounded-full border border-orange-100">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              Belum Ada Kader
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <select
                          className="w-full max-w-[200px] bg-slate-50 border border-slate-100 rounded-xl px-4 py-3 text-[11px] font-bold text-slate-600 outline-none focus:bg-white focus:ring-4 focus:ring-teal-100/50 transition-all cursor-pointer"
                          value={assignment?.kaderId || ""}
                          onChange={(e) =>
                            assignKader(mother.id, e.target.value)
                          }
                        >
                          <option value="" disabled>
                            Pilih Kader Pendamping...
                          </option>
                          {kaders.map((k: any) => (
                            <option key={k.id} value={k.id}>
                              {k.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-8 py-6 text-center">
                        {assignment && (
                          <button
                            onClick={() =>
                              openModal({
                                motherId: mother.id,
                                kaderId: assignment.kaderId,
                                motherName: mother.user?.name,
                              })
                            }
                            className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all group/btn shadow-sm"
                            title="Hapus Penugasan"
                          >
                            <Trash2 className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Halaman <span className="text-slate-700">{page}</span> Dari{" "}
            <span className="text-slate-700">{meta.totalPage || 1}</span>
          </p>
          <div className="flex gap-3">
            <PaginationButton
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              icon={<ChevronLeft className="w-5 h-5" />}
            />
            <PaginationButton
              onClick={() => setPage((p) => p + 1)}
              disabled={page === meta.totalPage || meta.totalPage === 0}
              icon={<ChevronRight className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>

      {/* MODAL CONFIRMATION */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
            onClick={closeModal}
          />
          <div className="bg-white rounded-[40px] p-10 max-w-md w-full shadow-2xl relative z-10 border border-slate-100 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-rose-50 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-inner">
              <AlertCircle className="w-10 h-10 text-rose-500" />
            </div>
            <h3 className="text-xl font-black text-slate-800 text-center uppercase tracking-tight">
              Putus Penugasan?
            </h3>
            <p className="text-sm text-slate-400 text-center mt-3 leading-relaxed">
              Kader tidak akan lagi memantau data kesehatan ibu{" "}
              <span className="font-black text-slate-700">
                {confirmData?.motherName}
              </span>
              . Tindakan ini bisa dibatalkan nanti.
            </p>
            <div className="flex gap-4 mt-10">
              <button
                onClick={closeModal}
                className="flex-1 py-4.5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-4.5 bg-rose-500 text-white rounded-[20px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-rose-200 active:scale-95 transition-all"
              >
                Hapus Tugas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- REUSABLE MINI COMPONENTS ---

function QuickActionLink({ href, label, icon, theme }: any) {
  const isTeal = theme === "teal";
  return (
    <Link
      href={href}
      className="group bg-white border border-slate-100 px-6 py-4 rounded-[22px] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-4"
    >
      <div
        className={cn(
          "p-2.5 rounded-xl transition-all shadow-sm",
          isTeal
            ? "bg-teal-50 text-[#3AC4B6] group-hover:bg-[#3AC4B6] group-hover:text-white"
            : "bg-slate-50 text-slate-400 group-hover:bg-slate-800 group-hover:text-white",
        )}
      >
        {icon}
      </div>
      <span className="text-xs font-black text-slate-700 uppercase tracking-wider">
        {label}
      </span>
    </Link>
  );
}

function TableLoadingState() {
  return (
    <tr>
      <td colSpan={4} className="py-32 text-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-[#3AC4B6] animate-spin" />
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] animate-pulse">
            Menyelaraskan Data...
          </p>
        </div>
      </td>
    </tr>
  );
}

function TableEmptyState() {
  return (
    <tr>
      <td colSpan={4} className="py-32 text-center">
        <div className="flex flex-col items-center gap-4 opacity-30">
          <Users className="w-16 h-16 text-slate-300" />
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Tidak Ada Data Ibu Binaan
          </p>
        </div>
      </td>
    </tr>
  );
}

function PaginationButton({ onClick, disabled, icon }: any) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className="p-3 bg-white border border-slate-100 rounded-xl text-slate-500 shadow-sm hover:bg-slate-50 disabled:opacity-20 disabled:cursor-not-allowed transition-all active:scale-90"
    >
      {icon}
    </button>
  );
}
