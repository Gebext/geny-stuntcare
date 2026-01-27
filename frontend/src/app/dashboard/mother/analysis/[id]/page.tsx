"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useMotherAiAnalysis } from "@/hooks/mother/useAi";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Brain,
  Scale,
  Ruler,
  Utensils,
  Droplets,
  AlertCircle,
  CheckCircle2,
  Info,
  Sparkles,
  RefreshCw,
  Zap,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { ConfirmModal } from "@/components/ui/confirmModal";

export default function MotherAnalysisDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const childId = id as string;

  const { toast } = useToast();
  const { analysis, isLoading, isTriggering, triggerAnalysis } =
    useMotherAiAnalysis(childId);

  // Hook untuk Modal Konfirmasi
  const { isOpen, openModal, closeModal } = useConfirmModal();

  // Handler untuk menjalankan AI
  const handleExecuteAi = () => {
    triggerAnalysis(undefined, {
      onSuccess: () => {
        closeModal();
        toast({
          title: "Analisis Selesai",
          description: "Data kesehatan terbaru berhasil diproses oleh AI.",
        });
      },
      onError: (err: any) => {
        closeModal();
        toast({
          variant: "destructive",
          title: "Gagal Menganalisis",
          description:
            err.response?.data?.message || "Terjadi gangguan koneksi.",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#3AC4B6] animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Sinkronisasi AI...
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Kembali
            </span>
          </button>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            Analisis <span className="text-[#3AC4B6]">AI</span>
          </h1>
        </div>

        {/* Update Button (Only visible if analysis data exists) */}
        {analysis && (
          <button
            onClick={() => openModal(null)}
            disabled={isTriggering}
            className="flex items-center gap-3 bg-white border-2 border-slate-100 hover:border-[#3AC4B6] text-slate-600 hover:text-[#3AC4B6] px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw
              className={cn("w-4 h-4", isTriggering && "animate-spin")}
            />
            {isTriggering ? "Memproses..." : "Perbarui Analisis"}
          </button>
        )}
      </div>

      {!analysis ? (
        /* --- STATE 1: EMPTY / NOT TRIGGERED YET --- */
        <div className="bg-white rounded-[40px] border-2 border-dashed border-slate-100 p-12 md:p-24 flex flex-col items-center text-center shadow-sm">
          <div className="w-24 h-24 bg-[#F0FDFB] rounded-[35px] flex items-center justify-center text-[#3AC4B6] mb-8 shadow-inner">
            <Brain className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-tight">
            Mulai Deteksi Dini
          </h2>
          <p className="text-slate-400 text-sm max-w-md mb-10 font-medium leading-relaxed uppercase tracking-wide text-[11px]">
            Sistem belum memiliki riwayat analisis. Klik tombol di bawah untuk
            meminta AI menghitung risiko stunting anak Anda.
          </p>
          <button
            onClick={() => openModal(null)}
            className="bg-[#3AC4B6] text-white px-10 py-5 rounded-[26px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 flex items-center gap-4 hover:scale-105 active:scale-95 transition-all"
          >
            <Zap className="w-5 h-5 fill-current" />
            Jalankan Analisis Sekarang
          </button>
        </div>
      ) : (
        /* --- STATE 2: ANALYSIS RESULT DASHBOARD --- */
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Main Score Card */}
          <div className="bg-white rounded-[45px] border border-slate-100 shadow-sm p-8 md:p-14 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              {/* Circular Progress SVG */}
              <div className="relative flex items-center justify-center scale-110">
                <svg className="w-52 h-52 transform -rotate-90">
                  <circle
                    cx="104"
                    cy="104"
                    r="94"
                    stroke="currentColor"
                    strokeWidth="14"
                    fill="transparent"
                    className="text-slate-50"
                  />
                  <circle
                    cx="104"
                    cy="104"
                    r="94"
                    stroke="currentColor"
                    strokeWidth="14"
                    fill="transparent"
                    strokeDasharray={590.6}
                    strokeDashoffset={
                      590.6 - (590.6 * (analysis?.score || 0)) / 100
                    }
                    className="text-[#3AC4B6] transition-all duration-1000 ease-in-out"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-6xl font-black text-slate-800 tracking-tighter">
                    {analysis?.score}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Health Score
                  </span>
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2 px-5 py-2 bg-emerald-50 text-[#3AC4B6] rounded-full mb-6 border border-emerald-100">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    {analysis?.status}
                  </span>
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight uppercase ">
                  Laporan Gizi Pintar
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed font-medium ">
                  &quot;{analysis?.summary}&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Scale />}
              label="Berat Badan"
              value={analysis?.weightScore}
              color="text-blue-500"
              bgColor="bg-blue-50"
              barColor="bg-blue-500"
            />
            <StatCard
              icon={<Ruler />}
              label="Tinggi Badan"
              value={analysis?.heightScore}
              color="text-purple-500"
              bgColor="bg-purple-50"
              barColor="bg-purple-500"
            />
            <StatCard
              icon={<Utensils />}
              label="Asupan Gizi"
              value={analysis?.nutritionScore}
              color="text-orange-500"
              bgColor="bg-orange-50"
              barColor="bg-orange-500"
            />
            <StatCard
              icon={<Droplets />}
              label="Sanitasi"
              value={analysis?.sanitationScore}
              color="text-emerald-500"
              bgColor="bg-emerald-50"
              barColor="bg-emerald-500"
            />
          </div>

          {/* Recommendation List */}
          <div className="bg-white rounded-[45px] border border-slate-100 shadow-sm p-8 md:p-12">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-10 ml-2">
              Rekomendasi Ahli AI
            </h3>
            <div className="grid gap-5">
              {analysis?.recommendations?.map((rec: any, idx: number) => (
                <div
                  key={idx}
                  className={cn(
                    "p-7 rounded-[35px] flex items-start gap-6 border transition-all hover:bg-white hover:shadow-md duration-300",
                    rec.type === "WARNING"
                      ? "bg-red-50/40 border-red-100"
                      : rec.type === "SUCCESS"
                        ? "bg-emerald-50/40 border-emerald-100"
                        : "bg-blue-50/40 border-blue-100",
                  )}
                >
                  <div
                    className={cn(
                      "p-4 rounded-2xl shadow-sm bg-white",
                      rec.type === "WARNING"
                        ? "text-red-500"
                        : rec.type === "SUCCESS"
                          ? "text-emerald-500"
                          : "text-blue-500",
                    )}
                  >
                    {rec.type === "WARNING" ? (
                      <AlertCircle />
                    ) : rec.type === "SUCCESS" ? (
                      <CheckCircle2 />
                    ) : (
                      <Info />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-base mb-1 uppercase tracking-tight">
                      {rec.title}
                    </h4>
                    <p className="text-slate-500 text-[13px] font-medium leading-relaxed uppercase tracking-tight">
                      {rec.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CONFIRMATION MODAL - Using the Component we discussed */}
      <ConfirmModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleExecuteAi}
        isLoading={isTriggering}
        icon={Brain}
        variant="teal"
        title="AI Health Analysis"
        description={
          <span>
            Apakah Anda ingin menjalankan analisis kesehatan menggunakan{" "}
            <span className="text-[#3AC4B6]">AI Gemini</span> untuk data anak
            ini?
          </span>
        }
        confirmText="Ya, Jalankan"
      />
    </div>
  );
}

/* HELPER COMPONENT: STAT CARD */
function StatCard({ icon, label, value, color, bgColor, barColor }: any) {
  return (
    <div className="bg-white p-7 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-3 mb-6">
        <div
          className={cn(
            "p-3 rounded-2xl transition-all group-hover:scale-110",
            bgColor,
            color,
          )}
        >
          {icon}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000",
              barColor,
            )}
            style={{ width: `${value}%` }}
          />
        </div>
        <span className="text-xs font-black text-slate-700 tracking-tighter">
          {value}%
        </span>
      </div>
    </div>
  );
}
