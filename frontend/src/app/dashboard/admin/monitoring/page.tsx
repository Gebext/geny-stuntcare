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
  MoreHorizontal,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

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
    <div className="space-y-6 pb-12">
      {/* Header */}
      <header className="flex items-center gap-6 bg-gradient-to-br from-[#3AC4B6] to-[#2DA89B] p-8 rounded-[35px] text-white shadow-lg relative overflow-hidden">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[22px] flex items-center justify-center border border-white/30 relative z-10">
          <Heart className="w-8 h-8 text-white fill-white/20" />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Kesehatan Bunda
          </h1>
          <p className="text-teal-50/80 text-sm font-medium mt-1">
            Sistem Penugasan Kader Pendamping.
          </p>
        </div>
      </header>

      {/* Action Area & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
        <div className="flex gap-3">
          <Link
            href="/dashboard/admin/users/add-kader"
            className="group bg-white border border-slate-100 px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="bg-teal-50 p-2 rounded-xl group-hover:bg-[#3AC4B6] transition-colors">
              <UserPlus className="w-4 h-4 text-[#3AC4B6] group-hover:text-white" />
            </div>
            <span className="text-sm font-bold text-slate-700">
              Tambah Kader
            </span>
          </Link>
          <Link
            href="/dashboard/admin/users/add-admin"
            className="group bg-white border border-slate-100 px-5 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center gap-3"
          >
            <div className="bg-slate-50 p-2 rounded-xl group-hover:bg-slate-800 transition-colors">
              <ShieldPlus className="w-4 h-4 text-slate-400 group-hover:text-white" />
            </div>
            <span className="text-sm font-bold text-slate-700">
              Tambah Admin
            </span>
          </Link>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div className="relative flex-1 lg:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama ibu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-[#3AC4B6]/20 shadow-sm transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-11 pr-8 py-3 bg-white border border-slate-100 rounded-2xl text-sm outline-none appearance-none cursor-pointer shadow-sm text-slate-600 font-medium"
            >
              <option value="ALL">Semua Status</option>
              <option value="ASSIGNED">Sudah Ditugaskan</option>
              <option value="UNASSIGNED">Belum Ditugaskan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-[32px] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-white">
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Ibu Binaan
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Kader Aktif
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest">
                  Pilih Penugasan
                </th>
                <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-20 text-center text-slate-400 font-bold animate-pulse"
                  >
                    Sinkronisasi Data...
                  </td>
                </tr>
              ) : mothers.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-20 text-center text-slate-400 font-medium"
                  >
                    Data tidak ditemukan.
                  </td>
                </tr>
              ) : (
                mothers.map((mother: any) => {
                  const assignment = mother.kaderAssignments?.[0];
                  return (
                    <tr
                      key={mother.id}
                      className="hover:bg-slate-50/50 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="font-bold text-slate-700 text-sm group-hover:text-[#3AC4B6] transition-colors">
                          {mother.user?.name}
                        </div>
                        <div className="text-[12px] text-slate-400 font-medium mt-0.5">
                          {mother.user?.phone || "No. Telepon -"}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {assignment ? (
                          <div className="inline-flex items-center px-4 py-1.5 bg-teal-50 text-[#3AC4B6] rounded-full text-[11px] font-bold border border-teal-100/50">
                            👤 {assignment.kader?.name}
                          </div>
                        ) : (
                          <div className="inline-flex items-center px-4 py-1.5 bg-slate-100 text-slate-400 rounded-full text-[10px] font-bold">
                            BELUM DITUGASKAN
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <select
                          className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-600 outline-none focus:bg-white focus:ring-2 focus:ring-teal-100 transition-all cursor-pointer"
                          value={assignment?.kaderId || ""}
                          onChange={(e) =>
                            assignKader(mother.id, e.target.value)
                          }
                        >
                          <option value="" disabled>
                            Pilih Kader...
                          </option>
                          {kaders.map((k: any) => (
                            <option key={k.id} value={k.id}>
                              {k.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-8 py-5 text-center">
                        {assignment && (
                          <button
                            onClick={() =>
                              openModal({
                                motherId: mother.id,
                                kaderId: assignment.kaderId,
                                motherName: mother.user?.name,
                              })
                            }
                            className="text-rose-400 hover:text-rose-600 text-[10px] font-black uppercase tracking-widest transition-transform hover:scale-105"
                          >
                            Hapus
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

        {/* Pagination Footer */}
        <div className="p-6 bg-slate-50/30 border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            Halaman {page} Dari {meta.totalPage}
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="p-2 bg-white border rounded-xl disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5 text-slate-500" />
            </button>
            <button
              disabled={page === meta.totalPage}
              onClick={() => setPage((p) => p + 1)}
              className="p-2 bg-white border rounded-xl disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-8 h-8 text-rose-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 text-center mb-2">
              Hapus Penugasan?
            </h3>
            <p className="text-sm text-slate-500 text-center mb-8 ">
              Pelepasan kader untuk ibu{" "}
              <span className="font-bold text-slate-700">
                {confirmData?.motherName}
              </span>{" "}
              akan menghentikan pengawasan sementara.
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-4 text-sm font-bold text-slate-400"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-4 bg-rose-500 text-white rounded-2xl text-sm font-bold shadow-lg shadow-rose-100"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
