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
  Activity, // Icon tambahan untuk Z-Score
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

  const { isOpen, openModal, closeModal } = useConfirmModal();

  const handleExecuteAi = () => {
    triggerAnalysis(undefined, {
      onSuccess: () => {
        closeModal();
        toast({
          title: "Analisis Berhasil",
          description:
            "Diagnosa medis terbaru telah diperbarui oleh Llama-3 AI.",
        });
      },
      onError: (err: any) => {
        closeModal();
        toast({
          variant: "destructive",
          title: "Gagal Menganalisis",
          description:
            err.response?.data?.message || "Terjadi gangguan pada otak AI.",
        });
      },
    });
  };

  if (isLoading) {
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#3AC4B6] animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          Sinkronisasi Diagnosa AI...
        </p>
      </div>
    );
  }

  const recommendations = Array.isArray(analysis?.recommendations)
    ? (analysis.recommendations as any[])
    : [];

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
            Analisis <span className="text-[#3AC4B6]">Medis Llama-3</span>
          </h1>
        </div>

        {analysis && (
          <button
            onClick={() => openModal(null)}
            disabled={isTriggering}
            className="flex items-center gap-3 bg-white border-2 border-slate-100 hover:border-[#3AC4B6] text-slate-600 hover:text-[#3AC4B6] px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-sm disabled:opacity-50"
          >
            <RefreshCw
              className={cn("w-4 h-4", isTriggering && "animate-spin")}
            />
            {isTriggering ? "Menganalisis..." : "Perbarui Diagnosa"}
          </button>
        )}
      </div>

      {!analysis ? (
        <div className="bg-white rounded-[40px] border-2 border-dashed border-slate-100 p-12 md:p-24 flex flex-col items-center text-center shadow-sm">
          <div className="w-24 h-24 bg-[#F0FDFB] rounded-[35px] flex items-center justify-center text-[#3AC4B6] mb-8 shadow-inner">
            <Brain className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-3 uppercase tracking-tight">
            Mulai Deteksi Dini
          </h2>
          <p className="text-slate-400 text-sm max-w-md mb-10 font-medium uppercase tracking-wide text-[11px]">
            AI akan menghitung Z-Score secara akurat dan memberikan peringatan
            dini terhadap risiko stunting atau gizi buruk.
          </p>
          <button
            onClick={() => openModal(null)}
            className="bg-[#3AC4B6] text-white px-10 py-5 rounded-[26px] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-emerald-100 flex items-center gap-4 hover:scale-105 transition-all"
          >
            <Zap className="w-5 h-5 fill-current" />
            Jalankan Diagnosa Sekarang
          </button>
        </div>
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* Main Score & Z-Score Status */}
          <div className="bg-white rounded-[45px] border border-slate-100 shadow-sm p-8 md:p-14 relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              {/* Circular Score */}
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
                    className={cn(
                      "transition-all duration-1000 ease-in-out",
                      analysis.score < 50 ? "text-red-500" : "text-[#3AC4B6]",
                    )}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-6xl font-black text-slate-800 tracking-tighter">
                    {analysis?.score}
                  </span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                    Health Index
                  </span>
                </div>
              </div>

              {/* Diagnosis Text */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                  <div
                    className={cn(
                      "inline-flex items-center gap-2 px-5 py-2 rounded-full border",
                      analysis.score < 50
                        ? "bg-red-50 text-red-600 border-red-100"
                        : "bg-emerald-50 text-[#3AC4B6] border-emerald-100",
                    )}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      {analysis?.status}
                    </span>
                  </div>

                  {/* Z-SCORE BADGE */}
                  <div className="inline-flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-full border border-slate-800">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">
                      Z-Score: {analysis?.zScore?.toFixed(2)}
                    </span>
                  </div>
                </div>

                <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight uppercase">
                  Diagnosa Ahli
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed font-medium italic italic-quote">
                  &quot;{analysis?.summary}&quot;
                </p>
              </div>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Scale />}
              label="Skor Berat"
              value={analysis?.weightScore}
              color="text-blue-500"
              bgColor="bg-blue-50"
              barColor="bg-blue-500"
            />
            <StatCard
              icon={<Ruler />}
              label="Skor Tinggi"
              value={analysis?.heightScore}
              color="text-purple-500"
              bgColor="bg-purple-50"
              barColor="bg-purple-500"
            />
            <StatCard
              icon={<Utensils />}
              label="Pola Makan"
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

          {/* Recommendations List */}
          <div className="bg-white rounded-[45px] border border-slate-100 shadow-sm p-8 md:p-12">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-10 ml-2">
              Rekomendasi Tindakan Medis
            </h3>
            <div className="grid gap-5">
              {recommendations.map((rec: any, idx: number) => (
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
                      <AlertTriangle className="w-6 h-6" />
                    ) : rec.type === "SUCCESS" ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Info className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-base mb-1 uppercase tracking-tight">
                      {rec.title}
                    </h4>
                    <p className="text-slate-500 text-[13px] font-medium leading-relaxed">
                      {rec.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isOpen}
        onClose={closeModal}
        onConfirm={handleExecuteAi}
        isLoading={isTriggering}
        icon={Brain}
        variant="teal"
        title="AI Medical Analysis"
        description={
          <span>
            Jalankan diagnosa cerdas{" "}
            <span className="text-[#3AC4B6] font-bold">Llama-3.3</span> untuk
            mendeteksi risiko stunting dan status gizi anak secara akurat?
          </span>
        }
        confirmText="Ya, Jalankan Diagnosa"
      />
    </div>
  );
}

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
            style={{ width: `${value || 0}%` }}
          />
        </div>
        <span className="text-xs font-black text-slate-700 tracking-tighter">
          {value || 0}%
        </span>
      </div>
    </div>
  );
}
