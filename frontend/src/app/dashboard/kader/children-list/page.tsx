"use client";

import React, { useState } from "react";
import {
  Search,
  ChevronRight,
  ArrowLeft,
  ChevronLeft,
  Filter,
  X,
  Info,
  User,
  Baby,
  Activity,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useChildrenKader } from "@/hooks/kader/useChildren";

export default function KaderChildListPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [tempFilter, setTempFilter] = useState({
    gender: "",
    stuntingRisk: "",
  });
  const [activeFilter, setActiveFilter] = useState({
    gender: "",
    stuntingRisk: "",
  });

  const { data: response, isLoading } = useChildrenKader({
    page,
    name: search,
    ...activeFilter,
  });

  const childrenList = response?.list || [];
  const meta = response?.meta;

  const applyFilter = () => {
    setActiveFilter(tempFilter);
    setPage(1);
    setIsFilterOpen(false);
  };

  const resetFilter = () => {
    const empty = { gender: "", stuntingRisk: "" };
    setTempFilter(empty);
    setActiveFilter(empty);
    setPage(1);
    setIsFilterOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] pb-28 animate-in fade-in duration-700">
      {/* HEADER - Dibuat lebih bold & clean */}
      <header className="bg-white/90 backdrop-blur-xl sticky top-0 z-30 border-b border-slate-100 px-6 py-6 md:py-8 shadow-sm">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Link
                href="/dashboard/kader"
                className="w-12 h-12 flex items-center justify-center rounded-[18px] bg-slate-50 text-slate-400 hover:text-[#3AC4B6] hover:bg-teal-50 transition-all active:scale-90"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase">
                  Data Anak
                </h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-0.5 flex items-center gap-2">
                  <LayoutGrid className="w-3 h-3 text-[#3AC4B6]" /> Wilayah
                  Kerja Kader
                </p>
              </div>
            </div>
          </div>

          {/* SEARCH & FILTER - Dibuat "Gagah" seperti sebelumnya */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-[#3AC4B6] transition-colors" />
              <input
                type="text"
                placeholder="Cari nama balita..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-100 focus:bg-white rounded-[22px] py-5 pl-14 pr-6 text-base font-bold text-slate-700 outline-none transition-all shadow-inner"
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              className={cn(
                "h-[64px] px-6 rounded-[22px] border-2 flex items-center justify-center gap-3 transition-all font-black text-[11px] uppercase tracking-widest active:scale-95",
                activeFilter.gender || activeFilter.stuntingRisk
                  ? "bg-[#3AC4B6] border-[#3AC4B6] text-white shadow-lg shadow-teal-100"
                  : "bg-white border-slate-100 text-slate-400 hover:border-teal-100 hover:text-[#3AC4B6]",
              )}
            >
              <Filter className="w-5 h-5" />
              <span className="md:hidden">Filter Data</span>
            </button>
          </div>
        </div>
      </header>

      {/* CONTENT AREA */}
      <main className="max-w-5xl mx-auto p-6 mt-4">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-32 bg-slate-50 rounded-[35px] animate-pulse border border-slate-100"
              />
            ))}
          </div>
        ) : childrenList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {childrenList.map((child: any) => (
              <Link
                key={child.id}
                href={`/dashboard/kader/children-list/${child.id}`}
                className="bg-white p-6 rounded-[40px] border border-slate-100 shadow-sm flex items-center gap-6 hover:border-teal-100 hover:shadow-xl hover:shadow-slate-200/40 transition-all active:scale-[0.97] group"
              >
                {/* Gender Badge - Desain disamakan dengan Admin List */}
                <div
                  className={cn(
                    "w-16 h-16 rounded-[28px] flex flex-col items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-110",
                    child.gender === "L"
                      ? "bg-blue-50 text-blue-500"
                      : "bg-rose-50 text-rose-500",
                  )}
                >
                  <span className="text-[8px] font-black opacity-60 uppercase mb-0.5 tracking-tighter">
                    Gen
                  </span>
                  <span className="text-xl font-black leading-none">
                    {child.gender}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-700 text-base truncate uppercase tracking-tight group-hover:text-[#3AC4B6] transition-colors">
                    {child.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 mb-4">
                    <User className="w-3.5 h-3.5 text-[#3AC4B6]" />
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-tight truncate">
                      Bunda: {child.motherName || "Data Tidak Ada"}
                    </p>
                  </div>

                  {/* Status Risiko */}
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        child.stuntingRisk === "HIGH"
                          ? "bg-rose-50 text-rose-500 border-rose-100"
                          : child.stuntingRisk === "MEDIUM"
                            ? "bg-amber-50 text-amber-500 border-amber-100"
                            : "bg-emerald-50 text-emerald-500 border-emerald-100",
                      )}
                    >
                      {child.stuntingRisk} Risk
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-200 group-hover:text-[#3AC4B6] group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-32 text-center bg-white rounded-[40px] border border-slate-100 border-dashed">
            <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center mx-auto mb-6">
              <Baby className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
              Data Tidak Ditemukan
            </p>
          </div>
        )}

        {/* PAGINATION - Dibuat lebih Modern */}
        {meta && meta.lastPage > 1 && (
          <div className="mt-12 flex items-center justify-between bg-white p-3 rounded-[30px] border border-slate-100 shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-14 h-14 flex items-center justify-center rounded-[22px] bg-slate-50 text-slate-400 disabled:opacity-20 active:scale-90 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                Hal {page} / {meta.lastPage}
              </p>
              <p className="text-[8px] font-bold text-slate-300 uppercase mt-0.5 tracking-tighter">
                Total {meta.total} Balita
              </p>
            </div>
            <button
              onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
              disabled={page === meta.lastPage}
              className="w-14 h-14 flex items-center justify-center rounded-[22px] bg-slate-50 text-slate-400 disabled:opacity-20 active:scale-90 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </main>

      {/* FILTER DRAWER - UI lebih premium */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-6">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-[45px] p-10 animate-in slide-in-from-bottom-full duration-500 shadow-2xl">
            <div className="w-16 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />

            <div className="flex items-center justify-between mb-10">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Filter Data
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center active:scale-90 transition-all"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-1">
                  Jenis Kelamin
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { v: "", l: "Semua" },
                    { v: "L", l: "Laki-laki" },
                    { v: "P", l: "Perempuan" },
                  ].map((o) => (
                    <button
                      key={o.v}
                      onClick={() =>
                        setTempFilter({ ...tempFilter, gender: o.v })
                      }
                      className={cn(
                        "py-5 rounded-[22px] text-[10px] font-black uppercase tracking-widest border-2 transition-all active:scale-95",
                        tempFilter.gender === o.v
                          ? "bg-[#3AC4B6] border-[#3AC4B6] text-white shadow-lg shadow-teal-100"
                          : "border-slate-50 text-slate-400 bg-slate-50/50 hover:border-teal-100",
                      )}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-12">
              <button
                onClick={resetFilter}
                className="py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest bg-slate-50 text-slate-400 hover:bg-slate-100 transition-all"
              >
                Reset
              </button>
              <button
                onClick={applyFilter}
                className="py-5 rounded-[24px] text-[11px] font-black uppercase tracking-widest bg-[#3AC4B6] text-white shadow-xl shadow-teal-100 active:scale-95 transition-all"
              >
                Terapkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
