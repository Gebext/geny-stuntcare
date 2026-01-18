"use client";

import { useState } from "react";
import { useUserManagement } from "@/hooks/admin/useUserManagement";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import {
  Trash2,
  Edit3,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Search,
  AlertTriangle,
  Filter,
  X,
} from "lucide-react";

export default function UserManagementPage() {
  const [page, setPage] = useState(1);
  const {
    users,
    meta,
    isLoading,
    deleteMutation,
    updateMutation,
    search,
    setSearch,
    role,
    setRole,
  } = useUserManagement(page, 10);

  const {
    isOpen: isDelOpen,
    data: delData,
    openModal: openDel,
    closeModal: closeDel,
  } = useConfirmModal<{ id: string; name: string }>();

  const [editData, setEditData] = useState<any>(null);

  const confirmDelete = () => {
    if (delData) deleteMutation.mutate(delData.id, { onSuccess: closeDel });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(
      { id: editData.id, payload: editData },
      { onSuccess: () => setEditData(null) },
    );
  };

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto pb-24 bg-[#fbfcfc] min-h-screen">
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight  uppercase">
            User Management
          </h1>
          <p className="text-[10px] font-black text-[#3ac3b5] uppercase tracking-widest ">
            Akses Database Posyandu
          </p>
        </div>
        <div className="relative group w-full md:w-80">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#3ac3b5]"
            size={18}
          />
          <input
            type="text"
            placeholder="CARI NAMA / EMAIL..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[22px] shadow-sm outline-none text-[11px] font-black uppercase tracking-widest transition-all focus:ring-2 focus:ring-[#3ac3b5]/10"
          />
        </div>
      </div>

      {/* --- ROLE FILTER --- */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["ALL", "ADMIN", "KADER"].map((r) => (
          <button
            key={r}
            onClick={() => {
              setRole(r);
              setPage(1);
            }}
            className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] transition-all ${
              role === r
                ? "bg-[#3ac3b5] text-white shadow-lg shadow-[#3ac3b5]/20"
                : "bg-white text-slate-400 border border-slate-100"
            }`}
          >
            {r === "ALL" ? "SEMUA USER" : r}
          </button>
        ))}
      </div>

      {/* --- TABLE --- */}
      <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Identitas
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Akses
                </th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr>
                  <td colSpan={3} className="p-24 text-center">
                    <Loader2
                      className="animate-spin mx-auto text-[#3ac3b5]"
                      size={40}
                    />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="p-20 text-center text-[10px] font-black text-slate-300 uppercase "
                  >
                    Data tidak ditemukan
                  </td>
                </tr>
              ) : (
                users.map((user: any) => (
                  <tr
                    key={user.id}
                    className="hover:bg-slate-50/30 transition-all"
                  >
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 uppercase ">
                          {user.name.substring(0, 2)}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-700 uppercase  leading-none mb-1">
                            {user.name}
                          </p>
                          <p className="text-[9px] font-bold text-slate-400 lowercase">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      {/* Logic: Kita cari apakah di dalam array roles ada yang namanya 'ADMIN' */}
                      {(() => {
                        const isAdmin = user.roles?.some(
                          (r: any) =>
                            r.role?.name === "ADMIN" || r.roleId === 1,
                        );

                        return (
                          <span
                            className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                              isAdmin
                                ? "bg-amber-50 text-amber-500 border-amber-100"
                                : "bg-teal-50 text-teal-500 border-teal-100"
                            }`}
                          >
                            {isAdmin ? "Admin" : "Kader"}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="p-6">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setEditData(user)}
                          className="p-2.5 text-slate-300 hover:text-[#3ac3b5] hover:bg-[#3ac3b5]/5 rounded-xl transition-all"
                        >
                          <Edit3 size={18} />
                        </button>
                        <button
                          onClick={() =>
                            openDel({ id: user.id, name: user.name })
                          }
                          className="p-2.5 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* --- PAGINATION --- */}
        <div className="p-8 bg-slate-50/30 flex items-center justify-between border-t border-slate-50">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Halaman {page} / {meta?.lastPage || 1}
          </p>
          <div className="flex items-center gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#3ac3b5] disabled:opacity-20 shadow-sm transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              disabled={page >= (meta?.lastPage || 1)}
              onClick={() => setPage((p) => p + 1)}
              className="w-10 h-10 flex items-center justify-center bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#3ac3b5] disabled:opacity-20 shadow-sm transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* --- MODAL EDIT --- */}
      {editData && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-black text-slate-800 uppercase ">
                Edit Profil
              </h3>
              <button
                onClick={() => setEditData(null)}
                className="p-2 bg-slate-50 rounded-full text-slate-400 hover:text-rose-500 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                  Nama
                </label>
                <input
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#3ac3b5]/20 outline-none transition-all"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-2 tracking-widest">
                  Email
                </label>
                <input
                  className="w-full px-6 py-4 bg-slate-50 border-none rounded-2xl text-xs font-bold focus:ring-2 focus:ring-[#3ac3b5]/20 outline-none transition-all"
                  value={editData.email}
                  onChange={(e) =>
                    setEditData({ ...editData, email: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="w-full py-5 bg-[#3ac3b5] text-white rounded-[20px] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-[#3ac3b5]/20 mt-4 disabled:opacity-50"
              >
                {updateMutation.isPending ? (
                  <Loader2 className="animate-spin mx-auto" size={18} />
                ) : (
                  "Simpan Perubahan"
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL HAPUS --- */}
      {isDelOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-20 h-20 bg-rose-50 rounded-[30px] flex items-center justify-center text-rose-500 mb-2">
                <AlertTriangle size={40} />
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase ">
                Konfirmasi Hapus
              </h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter ">
                Hapus{" "}
                <span className="text-slate-700 underline">
                  {delData?.name}
                </span>
                ? Data tidak dapat dipulihkan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-8">
              <button
                onClick={closeDel}
                className="py-4 bg-slate-50 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest"
              >
                Batal
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                className="py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-200 disabled:opacity-50"
              >
                {deleteMutation.isPending ? (
                  <Loader2 className="animate-spin mx-auto" size={16} />
                ) : (
                  "Hapus User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
