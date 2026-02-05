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
  Clock,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Zap,
  Loader2,
  AlertTriangle,
  Activity,
  ChevronRight,
  ClipboardCheck,
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

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(dateString));
  };

  const handleExecuteAi = () => {
    triggerAnalysis(undefined, {
      onSuccess: () => {
        closeModal();
        toast({
          title: "Analisis Berhasil",
          description: "Diagnosa medis diperbarui oleh Llama-3.",
        });
      },
      onError: (err: any) => {
        closeModal();
        const msg =
          err?.response?.data?.message || "Data pendukung belum lengkap.";
        toast({
          variant: "destructive",
          title: "Gagal Menganalisis",
          description: msg,
        });
      },
    });
  };

  if (isLoading)
    return (
      <div className="h-[80vh] w-full flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-[#3AC4B6] animate-spin" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
          Menghubungkan ke Ai Geny Assistant
        </p>
      </div>
    );

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-20">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 mb-4 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Kembali
            </span>
          </button>
          <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight">
            Analisis <span className="text-[#3AC4B6]">Medis AI</span>
          </h1>
        </div>

        {analysis && (
          <button
            onClick={() => openModal(null)}
            disabled={isTriggering}
            className="flex items-center gap-3 bg-white border-2 border-slate-100 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-[#3AC4B6] transition-all disabled:opacity-50 shadow-sm"
          >
            <RefreshCw
              className={cn("w-4 h-4", isTriggering && "animate-spin")}
            />
            {isTriggering ? "Proses..." : "Perbarui Diagnosa"}
          </button>
        )}
      </div>

      {!analysis ? (
        <EmptyState
          childId={childId}
          onAction={() => openModal(null)}
          isTriggering={isTriggering}
        />
      ) : (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
          {/* MAIN DASHBOARD */}
          <div className="bg-white rounded-[45px] border border-slate-100 shadow-sm p-8 md:p-14 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
              <Brain className="w-64 h-64" />
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <ScoreCircle score={analysis.score} />
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                  <Badge
                    color={analysis.score < 50 ? "red" : "emerald"}
                    icon={<Sparkles className="w-3.5 h-3.5" />}
                    label={analysis.status}
                  />
                  <Badge
                    color="slate"
                    icon={<Activity className="w-3.5 h-3.5" />}
                    label={`Z-Score: ${analysis.zScore?.toFixed(2)}`}
                  />
                </div>
                <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight uppercase">
                  Diagnosa Ahli
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed font-medium italic mb-6">
                  &quot;{analysis.summary}&quot;
                </p>
                <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400 border-t border-slate-50 pt-4">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Analisa Terakhir: {formatDate(analysis.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={<Scale />}
              label="Skor Berat"
              value={analysis.weightScore}
              color="text-blue-500"
              bgColor="bg-blue-50"
              barColor="bg-blue-500"
            />
            <StatCard
              icon={<Ruler />}
              label="Skor Tinggi"
              value={analysis.heightScore}
              color="text-purple-500"
              bgColor="bg-purple-50"
              barColor="bg-purple-500"
            />
            <StatCard
              icon={<Utensils />}
              label="Pola Makan"
              value={analysis.nutritionScore}
              color="text-orange-500"
              bgColor="bg-orange-50"
              barColor="bg-orange-500"
            />
            <StatCard
              icon={<Droplets />}
              label="Sanitasi"
              value={analysis.sanitationScore}
              color="text-emerald-500"
              bgColor="bg-emerald-50"
              barColor="bg-emerald-500"
            />
          </div>

          {/* RECOMMENDATIONS */}
          <div className="bg-white rounded-[45px] border border-slate-100 shadow-sm p-8 md:p-12">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-10 ml-2">
              Rekomendasi Tindakan
            </h3>
            <div className="grid gap-5">
              {(analysis.recommendations as any[]).map((rec, idx) => (
                <RecommendationCard key={idx} rec={rec} />
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
        title="Jalankan Diagnosa AI"
        confirmText="Ya, Analisis"
        description="Pastikan data antropometri terbaru sudah diinput agar hasil akurat."
      />
    </div>
  );
}

// --- SUB COMPONENTS ---

function EmptyState({ childId, onAction, isTriggering }: any) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-[50px] border-2 border-dashed border-slate-100 p-10 md:p-20 flex flex-col items-center text-center">
      <div className="w-24 h-24 bg-[#F0FDFB] rounded-[35px] flex items-center justify-center text-[#3AC4B6] mb-8 ring-8 ring-[#F0FDFB]/50 animate-bounce-slow">
        <ClipboardCheck className="w-12 h-12" />
      </div>
      <h2 className="text-3xl font-black text-slate-800 mb-3 uppercase tracking-tight">
        Data Belum Lengkap
      </h2>
      <p className="text-slate-400 text-[11px] font-black uppercase tracking-[0.2em] max-w-md mb-12 leading-relaxed">
        AI Llama-3 membutuhkan data dasar sebelum memberikan diagnosa medis.
        Silakan lengkapi langkah berikut:
      </p>

      {/* QUICK ACTIONS CHECKLIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-12">
        <button
          onClick={() => router.push(`/dashboard/mother/child/${childId}`)}
          className="flex items-center gap-5 p-6 bg-slate-50 rounded-[30px] border border-transparent hover:border-[#3AC4B6] hover:bg-white transition-all group text-left"
        >
          <div className="p-4 bg-white rounded-2xl text-[#3AC4B6] shadow-sm group-hover:bg-[#3AC4B6] group-hover:text-white transition-colors">
            <Scale className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-black text-xs uppercase text-slate-700 tracking-tight">
              Antropometri
            </h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase">
              Input Berat & Tinggi
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </button>

        <button
          onClick={() => router.push(`/dashboard/mother/me/environment`)}
          className="flex items-center gap-5 p-6 bg-slate-50 rounded-[30px] border border-transparent hover:border-[#3AC4B6] hover:bg-white transition-all group text-left"
        >
          <div className="p-4 bg-white rounded-2xl text-blue-500 shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Droplets className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-black text-xs uppercase text-slate-700 tracking-tight">
              Lingkungan
            </h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase">
              Data Air & Sanitasi
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-6">
        <button
          onClick={onAction}
          disabled={isTriggering}
          className="bg-[#3AC4B6] text-white px-12 py-6 rounded-[30px] font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-[#3AC4B6]/30 hover:scale-105 transition-all flex items-center gap-4 disabled:opacity-50"
        >
          {isTriggering ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Zap className="w-5 h-5 fill-current" />
          )}
          Jalankan Diagnosa Sekarang
        </button>
        <div className="flex items-center gap-2 text-red-400 bg-red-50 px-4 py-2 rounded-full">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="text-[9px] font-black uppercase tracking-widest">
            Pastikan Minimal ada 1 data Antropometri
          </span>
        </div>
      </div>
    </div>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const offset = 590.6 - (590.6 * (score || 0)) / 100;
  return (
    <div className="relative flex items-center justify-center scale-110">
      <svg className="w-52 h-52 transform -rotate-90">
        <circle
          cx="104"
          cy="104"
          r="94"
          stroke="#F8FAFC"
          strokeWidth="14"
          fill="transparent"
        />
        <circle
          cx="104"
          cy="104"
          r="94"
          stroke={score < 50 ? "#EF4444" : "#3AC4B6"}
          strokeWidth="14"
          fill="transparent"
          strokeDasharray="590.6"
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-6xl font-black text-slate-800 tracking-tighter">
          {score}
        </span>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Index
        </span>
      </div>
    </div>
  );
}

function Badge({ color, icon, label }: any) {
  const styles: any = {
    emerald: "bg-emerald-50 text-[#3AC4B6] border-emerald-100",
    red: "bg-red-50 text-red-600 border-red-100",
    slate: "bg-slate-900 text-white border-slate-800",
  };
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-5 py-2 rounded-full border",
        styles[color],
      )}
    >
      {icon}{" "}
      <span className="text-[10px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

function StatCard({ icon, label, value, color, bgColor, barColor }: any) {
  return (
    <div className="bg-white p-7 rounded-[40px] border border-slate-50 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-3 mb-6">
        <div className={cn("p-3 rounded-2xl", bgColor, color)}>{icon}</div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-1000", barColor)}
            style={{ width: `${value || 0}%` }}
          />
        </div>
        <span className="text-xs font-black text-slate-700">{value || 0}%</span>
      </div>
    </div>
  );
}

function RecommendationCard({ rec }: any) {
  const isWarn = rec.type === "WARNING";
  return (
    <div
      className={cn(
        "p-7 rounded-[35px] flex items-start gap-6 border transition-all hover:translate-x-1",
        isWarn
          ? "bg-red-50/40 border-red-100"
          : "bg-emerald-50/40 border-emerald-100",
      )}
    >
      <div
        className={cn(
          "p-4 rounded-2xl bg-white shadow-sm",
          isWarn ? "text-red-500" : "text-emerald-500",
        )}
      >
        {isWarn ? (
          <AlertTriangle className="animate-pulse" />
        ) : (
          <CheckCircle2 />
        )}
      </div>
      <div>
        <h4 className="font-black text-slate-800 text-base mb-1 uppercase tracking-tight">
          {rec.title}
        </h4>
        <p className="text-slate-500 text-[13px] leading-relaxed font-medium">
          {rec.desc}
        </p>
      </div>
    </div>
  );
}
