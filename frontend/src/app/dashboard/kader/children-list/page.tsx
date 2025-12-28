"use client";

import React, { useState } from "react";
import {
  Search,
  Plus,
  ChevronRight,
  Baby,
  ArrowLeft,
  ChevronLeft,
  Filter,
  X,
  Check,
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

  // State untuk Filter
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

  const childrenList = response?.data || [];
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
    <div className="min-h-screen bg-[#FDFEFF] pb-28 font-sans">
      {/* GLASSMORPHISM HEADER */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-100 px-6 py-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/kader"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-50 text-slate-600 hover:bg-slate-100 transition-all"
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

        {/* SEARCH & FILTER TRIGGER */}
        <div className="flex gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-[#3AC4B6] transition-colors" />
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
                : "bg-white border-slate-100 text-slate-400 hover:bg-slate-50"
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
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-32 bg-slate-50 rounded-[32px] animate-pulse border border-slate-100"
              />
            ))}
          </div>
        ) : childrenList.length > 0 ? (
          <div className="grid gap-4">
            {childrenList.map((child: any) => (
              <Link
                key={child.id}
                href={`/dashboard/kader/children-list/${child.id}`}
                className="bg-white p-5 rounded-[32px] border border-slate-50 shadow-[0_8px_30px_rgb(0,0,0,0.02)] flex items-center gap-5 hover:border-[#3AC4B6]/30 hover:shadow-xl hover:shadow-teal-900/5 transition-all active:scale-[0.98]"
              >
                <div
                  className={cn(
                    "w-20 h-20 rounded-[24px] flex flex-col items-center justify-center shrink-0 shadow-inner border-2 border-white",
                    child.gender === "L"
                      ? "bg-blue-50/50 text-blue-500"
                      : "bg-rose-50/50 text-rose-500"
                  )}
                >
                  <span className="text-2xl font-black">{child.gender}</span>
                  <span className="text-[8px] font-black uppercase opacity-60 tracking-tighter">
                    Gender
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <h3 className="font-black text-slate-700 text-sm truncate uppercase tracking-tight mb-1">
                      {child.name}
                    </h3>
                  </div>

                  <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5 mb-3">
                    <User className="w-3 h-3 text-slate-300" />{" "}
                    {child.motherName}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border",
                        child.stuntingRisk === "HIGH"
                          ? "bg-red-50 border-red-100 text-red-500"
                          : child.stuntingRisk === "MEDIUM"
                          ? "bg-orange-50 border-orange-100 text-orange-500"
                          : "bg-emerald-50 border-emerald-100 text-emerald-500"
                      )}
                    >
                      {child.stuntingRisk} RISK
                    </span>
                    {child.isVerified && (
                      <span className="bg-blue-50 border border-blue-100 text-blue-500 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider">
                        Verified
                      </span>
                    )}
                  </div>
                </div>

                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#3AC4B6] group-hover:text-white transition-all">
                  <ChevronRight className="w-6 h-6" />
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center px-10">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Info className="w-10 h-10 text-slate-200" />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest leading-loose">
              Data tidak ditemukan.
              <br />
              Coba ubah filter atau pencarian Mama.
            </p>
          </div>
        )}

        {/* PAGINATION */}
        {meta && meta.lastPage > 1 && (
          <div className="mt-10 flex items-center justify-between bg-white p-2 rounded-3xl border border-slate-100 shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 disabled:opacity-20 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="text-center">
              <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-1">
                Halaman
              </p>
              <p className="text-xs font-black text-slate-700">
                {page} <span className="text-slate-300">/</span> {meta.lastPage}
              </p>
            </div>
            <button
              onClick={() => setPage((p) => Math.min(meta.lastPage, p + 1))}
              disabled={page === meta.lastPage}
              className="w-12 h-12 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-400 disabled:opacity-20 transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        )}
      </main>

      {/* FILTER DRAWER (OVERLAY) */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center px-4 pb-6 sm:pb-10">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setIsFilterOpen(false)}
          />

          <div className="relative w-full  bg-white rounded-[40px] shadow-2xl p-8 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
                Filter Data
              </h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="space-y-8">
              {/* Gender Filter */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  Jenis Kelamin
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: "", label: "Semua" },
                    { val: "L", label: "Laki-laki" },
                    { val: "P", label: "Perempuan" },
                  ].map((opt) => (
                    <button
                      key={opt.val}
                      onClick={() =>
                        setTempFilter({ ...tempFilter, gender: opt.val })
                      }
                      className={cn(
                        "py-3 rounded-2xl text-[11px] font-black transition-all border-2",
                        tempFilter.gender === opt.val
                          ? "bg-[#3AC4B6] border-[#3AC4B6] text-white"
                          : "bg-white border-slate-50 text-slate-400"
                      )}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Risk Filter */}
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                  Risiko Stunting
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {["HIGH", "MEDIUM", "LOW", "PENDING"].map((risk) => (
                    <button
                      key={risk}
                      onClick={() =>
                        setTempFilter({ ...tempFilter, stuntingRisk: risk })
                      }
                      className={cn(
                        "py-3 rounded-2xl text-[11px] font-black transition-all border-2",
                        tempFilter.stuntingRisk === risk
                          ? "bg-[#3AC4B6] border-[#3AC4B6] text-white"
                          : "bg-white border-slate-50 text-slate-400"
                      )}
                    >
                      {risk}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              <button
                onClick={resetFilter}
                className="py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-400 bg-slate-50"
              >
                Reset
              </button>
              <button
                onClick={applyFilter}
                className="py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white bg-[#3AC4B6] shadow-lg shadow-teal-100"
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
