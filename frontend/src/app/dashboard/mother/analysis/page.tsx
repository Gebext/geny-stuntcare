"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Baby, ChevronRight, Brain, Sparkles } from "lucide-react";
import { useMotherChildren } from "@/hooks/mother/useChildren";

export default function MotherAnalysisSelectionPage() {
  const router = useRouter();
  const { data: children, isLoading } = useMotherChildren();

  return (
    <div className="min-h-screen bg-[#FDFEFF] pb-10 px-6 pt-8">
      {/* Header Section */}
      <header className="flex items-center gap-5 bg-gradient-to-br from-[#3AC4B6] to-[#2DA89B] p-8 rounded-[35px] text-white shadow-lg shadow-teal-100/50">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[22px] flex items-center justify-center border border-white/30">
          <Brain className="w-8 h-8 fill-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analisis AI</h1>
          <p className="text-teal-50/80 text-sm font-medium mt-1">
            Sistem kami menganalisis data antropometri dan pola makan untuk
            memberikan rekomendasi kesehatan terbaik.{" "}
          </p>
        </div>
      </header>

      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 mb-4 mt-6">
        Daftar Anak Anda
      </h3>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 w-full bg-slate-100 animate-pulse rounded-[30px]"
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4">
          {children?.length > 0 ? (
            children.map((child: any) => (
              <button
                key={child.id}
                onClick={() =>
                  router.push(`/dashboard/mother/analysis/${child.id}`)
                }
                className="bg-white p-5 rounded-[30px] border border-slate-50 shadow-sm flex items-center justify-between group hover:border-[#3AC4B6] transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-[#3AC4B6] group-hover:bg-[#3AC4B6] group-hover:text-white transition-colors">
                    <Baby className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-black text-slate-800 text-base tracking-tight">
                      {child.name}
                    </h4>
                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      {child.gender === "L" ? "Laki-laki" : "Perempuan"} •{" "}
                      {calculateAge(child.birthDate)} Bulan
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50 p-2 rounded-xl text-slate-300 group-hover:bg-emerald-50 group-hover:text-[#3AC4B6]">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </button>
            ))
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-400 font-bold text-sm">
                Belum ada profil anak terdaftar.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Helper untuk hitung bulan
function calculateAge(birthDate: string) {
  const birth = new Date(birthDate);
  const now = new Date();
  return (
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth())
  );
}
