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

  // Ambil list dan meta dari return value hook
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
    <div className="min-h-screen bg-[#FDFEFF] pb-28">
      {/* HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 px-6 py-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/kader"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-lg font-black text-slate-800 tracking-tight">
                Data Anak
              </h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
                Wilayah Kerja Kader
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#3AC4B6]" />
            <input
              type="text"
              placeholder="Cari nama balita..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-11 pr-4 text-[13px] font-medium outline-none focus:bg-white focus:ring-4 focus:ring-[#3AC4B6]/5 focus:border-[#3AC4B6]/20 transition-all"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(true)}
            className={cn(
              "px-4 rounded-2xl border flex items-center justify-center transition-all",
              activeFilter.gender || activeFilter.stuntingRisk
                ? "bg-[#3AC4B6] border-[#3AC4B6] text-white"
                : "bg-white border-slate-100 text-slate-400",
            )}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* LIST CONTENT */}
      <main className="p-6">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-28 bg-slate-50 rounded-[32px] animate-pulse border border-slate-100"
              />
            ))}
          </div>
        ) : childrenList.length > 0 ? (
          <div className="grid gap-4">
            {childrenList.map((child: any) => (
              <Link
                key={child.id}
                href={`/dashboard/kader/children-list/${child.id}`}
                className="bg-white p-5 rounded-[32px] border border-slate-50 shadow-sm flex items-center gap-5 hover:border-[#3AC4B6]/30 transition-all active:scale-[0.98]"
              >
                <div
                  className={cn(
                    "w-16 h-16 rounded-[22px] flex flex-col items-center justify-center shrink-0 border-2 border-white shadow-sm",
                    child.gender === "L"
                      ? "bg-blue-50 text-blue-500"
                      : "bg-rose-50 text-rose-500",
                  )}
                >
                  <span className="text-xl font-black">{child.gender}</span>
                  <span className="text-[7px] font-black uppercase opacity-60">
                    Gender
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-black text-slate-700 text-sm truncate uppercase mb-1">
                    {child.name}
                  </h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 mb-3">
                    <User className="w-3 h-3" /> {child.motherName}
                  </p>
                  <div className="flex gap-2">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[8px] font-black uppercase border",
                        child.stuntingRisk === "HIGH"
                          ? "bg-red-50 text-red-500 border-red-100"
                          : child.stuntingRisk === "MEDIUM"
                            ? "bg-orange-50 text-orange-500 border-orange-100"
                            : "bg-emerald-50 text-emerald-500 border-emerald-100",
                      )}
                    >
                      {child.stuntingRisk} RISK
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <Info className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Data Tidak Ditemukan
            </p>
          </div>
        )}

        {/* PAGINATION */}
        {meta && meta.lastPage > 1 && (
          <div className="mt-8 flex items-center justify-between bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 disabled:opacity-20"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <p className="text-[10px] font-black text-slate-700 uppercase">
              Hal {page} / {meta.lastPage}
            </p>
            <button
              onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
              disabled={page === meta.lastPage}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 disabled:opacity-20"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </main>

      {/* FILTER DRAWER */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-6">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />
          <div className="relative w-full bg-white rounded-[40px] p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black text-slate-800 uppercase">
                Filter
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase mb-3">
                  Jenis Kelamin
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { v: "", l: "Semua" },
                    { v: "L", l: "Laki" },
                    { v: "P", l: "Cewe" },
                  ].map((o) => (
                    <button
                      key={o.v}
                      onClick={() =>
                        setTempFilter({ ...tempFilter, gender: o.v })
                      }
                      className={cn(
                        "py-3 rounded-xl text-[10px] font-black border-2",
                        tempFilter.gender === o.v
                          ? "bg-[#3AC4B6] border-[#3AC4B6] text-white"
                          : "border-slate-50 text-slate-400",
                      )}
                    >
                      {o.l}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              <button
                onClick={resetFilter}
                className="py-4 rounded-2xl text-[10px] font-black uppercase bg-slate-50 text-slate-400"
              >
                Reset
              </button>
              <button
                onClick={applyFilter}
                className="py-4 rounded-2xl text-[10px] font-black uppercase bg-[#3AC4B6] text-white"
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
