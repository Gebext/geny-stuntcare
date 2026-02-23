"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMotherSelfAiAnalysis } from "@/hooks/mother/useMotherSelfAi";
import { useMotherStore } from "@/store/useMotherStore";
import { useToast } from "@/hooks/use-toast";
import {
  ArrowLeft,
  Brain,
  Scale,
  Ruler,
  Heart,
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
  Baby,
  Pill,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { ConfirmModal } from "@/components/ui/confirmModal";
import { RoleGuard } from "@/components/auth/RoleGuard";
import Link from "next/link";

export default function MotherSelfAnalysisPage() {
  const router = useRouter();
  const profile = useMotherStore((state) => state.profile);
  const { toast } = useToast();
  const motherId = profile?.id || "";
  const { analysis, isLoading, isTriggering, triggerAnalysis } =
    useMotherSelfAiAnalysis(motherId);
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

  const bmi =
    profile?.weightKg && profile?.heightCm
      ? (
          profile.weightKg / Math.pow(profile.heightCm / 100, 2)
        ).toFixed(1)
      : "0";

  const handleExecuteAi = () => {
    triggerAnalysis(undefined, {
      onSuccess: () => {
        closeModal();
        toast({
          title: "Analisis Berhasil ✨",
          description: "Diagnosa kesehatan Bunda diperbarui oleh Llama-3.",
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

  if (isLoading || !profile)
    return (
      <RoleGuard allowedRoles={["mother"]}>
        <div className="h-[80vh] w-full flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-12 h-12 text-[#3AC4B6] animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 text-center">
            Menghubungkan ke Ai Geny Assistant
          </p>
        </div>
      </RoleGuard>
    );

  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 uppercase tracking-tight">
              Analisis <span className="text-pink-500">Kesehatan Bunda</span>
            </h1>
            <p className="text-slate-400 text-[10px] md:text-xs font-bold uppercase tracking-wider mt-1">
              AI menganalisis data antropometri, gizi, dan lingkungan Bunda
            </p>
          </div>

          {analysis && (
            <button
              onClick={() => openModal(null)}
              disabled={isTriggering}
              className="flex items-center gap-3 bg-white border-2 border-slate-100 px-6 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-pink-300 transition-all disabled:opacity-50 shadow-sm"
            >
              <RefreshCw
                className={cn("w-4 h-4", isTriggering && "animate-spin")}
              />
              {isTriggering ? "Proses..." : "Perbarui Diagnosa"}
            </button>
          )}
        </div>

        {/* QUICK STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <QuickStat
            label="BMI"
            value={bmi}
            unit=""
            color="text-blue-500"
            bgColor="bg-blue-50"
            status={
              Number(bmi) < 18.5
                ? "Kurus"
                : Number(bmi) < 25
                  ? "Normal"
                  : Number(bmi) < 30
                    ? "Berlebih"
                    : "Obesitas"
            }
          />
          <QuickStat
            label="LILA"
            value={String(profile.lilaCm)}
            unit="cm"
            color="text-emerald-500"
            bgColor="bg-emerald-50"
            status={
              (profile.lilaCm || 0) < 23.5 ? "Risiko KEK" : "Normal"
            }
          />
          <QuickStat
            label="Berat"
            value={String(profile.weightKg)}
            unit="kg"
            color="text-purple-500"
            bgColor="bg-purple-50"
          />
          <QuickStat
            label="Status"
            value={profile.isPregnant ? `T${profile.trimester || "-"}` : "—"}
            unit=""
            color="text-pink-500"
            bgColor="bg-pink-50"
            status={profile.isPregnant ? "Hamil" : "Tidak Hamil"}
          />
        </div>

        {!analysis ? (
          <MotherEmptyState
            onAction={() => openModal(null)}
            isTriggering={isTriggering}
          />
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            {/* MAIN DASHBOARD */}
            <div className="bg-white rounded-[35px] md:rounded-[45px] border border-slate-100 shadow-sm p-6 md:p-14 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                <Heart className="w-64 h-64" />
              </div>

              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
                <ScoreCircle score={analysis.score} />
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-6">
                    <Badge
                      color={analysis.score < 50 ? "red" : "emerald"}
                      icon={<Sparkles className="w-3.5 h-3.5" />}
                      label={analysis.status}
                    />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 tracking-tight uppercase">
                    Diagnosa Kesehatan Bunda
                  </h2>
                  <p className="text-slate-500 text-sm md:text-lg leading-relaxed font-medium italic mb-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
              <StatCard
                icon={<Scale />}
                label="Skor BMI"
                value={analysis.bmiScore}
                color="text-blue-500"
                bgColor="bg-blue-50"
                barColor="bg-blue-500"
              />
              <StatCard
                icon={<Activity />}
                label="Skor LILA"
                value={analysis.lilaScore}
                color="text-emerald-500"
                bgColor="bg-emerald-50"
                barColor="bg-emerald-500"
              />
              <StatCard
                icon={<Heart />}
                label="Nutrisi"
                value={analysis.nutritionScore}
                color="text-orange-500"
                bgColor="bg-orange-50"
                barColor="bg-orange-500"
              />
              <StatCard
                icon={<Pill />}
                label="Kepatuhan TTD"
                value={analysis.ttdScore}
                color="text-purple-500"
                bgColor="bg-purple-50"
                barColor="bg-purple-500"
              />
              <StatCard
                icon={<Baby />}
                label="Kehamilan"
                value={analysis.pregnancyScore}
                color="text-pink-500"
                bgColor="bg-pink-50"
                barColor="bg-pink-500"
              />
            </div>

            {/* RECOMMENDATIONS */}
            <div className="bg-white rounded-[35px] md:rounded-[45px] border border-slate-100 shadow-sm p-6 md:p-12">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em] mb-8 md:mb-10 ml-2">
                Rekomendasi Tindakan
              </h3>
              <div className="grid gap-4 md:gap-5">
                {(analysis.recommendations as any[])?.map(
                  (rec: any, idx: number) => (
                    <RecommendationCard key={idx} rec={rec} />
                  ),
                )}
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
          title="Jalankan Analisis AI Bunda"
          confirmText="Ya, Analisis"
          description="Pastikan data profil kesehatan Bunda sudah terlengkapi (berat, tinggi, LILA, status kehamilan) agar hasil akurat."
        />
      </div>
    </RoleGuard>
  );
}

// --- SUB COMPONENTS ---

function QuickStat({ label, value, unit, color, bgColor, status }: any) {
  return (
    <div className="bg-white p-4 md:p-5 rounded-[22px] md:rounded-[28px] border border-slate-50 shadow-sm">
      <span
        className={cn(
          "text-[8px] md:text-[9px] font-black uppercase tracking-[0.15em] md:tracking-widest",
          color,
        )}
      >
        {label}
      </span>
      <div className="flex items-baseline gap-1 mt-1">
        <span className="text-xl md:text-2xl font-black text-slate-800">
          {value}
        </span>
        {unit && (
          <span className="text-[9px] text-slate-400 font-bold">{unit}</span>
        )}
      </div>
      {status && (
        <div
          className={cn(
            "inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[7px] md:text-[8px] font-black uppercase",
            bgColor,
            color,
          )}
        >
          {status}
        </div>
      )}
    </div>
  );
}

function MotherEmptyState({ onAction, isTriggering }: any) {
  return (
    <div className="bg-white rounded-[40px] md:rounded-[50px] border-2 border-dashed border-slate-100 p-8 md:p-20 flex flex-col items-center text-center">
      <div className="w-20 h-20 md:w-24 md:h-24 bg-pink-50 rounded-[30px] md:rounded-[35px] flex items-center justify-center text-pink-400 mb-6 md:mb-8 ring-8 ring-pink-50/50">
        <ClipboardCheck className="w-10 h-10 md:w-12 md:h-12" />
      </div>
      <h2 className="text-xl md:text-3xl font-black text-slate-800 mb-3 uppercase tracking-tight">
        Belum Ada Analisis
      </h2>
      <p className="text-slate-400 text-[10px] md:text-[11px] font-black uppercase tracking-[0.15em] md:tracking-[0.2em] max-w-md mb-10 md:mb-12 leading-relaxed">
        AI Llama-3 akan menganalisis kesehatan Bunda berdasarkan data profil.
        Pastikan langkah berikut sudah terpenuhi:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 w-full max-w-2xl mb-10 md:mb-12">
        <Link
          href="/dashboard/mother/me"
          className="flex items-center gap-4 md:gap-5 p-5 md:p-6 bg-slate-50 rounded-[25px] md:rounded-[30px] border border-transparent hover:border-pink-300 hover:bg-white transition-all group text-left"
        >
          <div className="p-3 md:p-4 bg-white rounded-2xl text-pink-500 shadow-sm group-hover:bg-pink-500 group-hover:text-white transition-colors">
            <Heart className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-black text-xs uppercase text-slate-700 tracking-tight">
              Data Kesehatan
            </h4>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase">
              Berat, Tinggi, LILA, TTD
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </Link>

        <Link
          href="/dashboard/mother/me/environment"
          className="flex items-center gap-4 md:gap-5 p-5 md:p-6 bg-slate-50 rounded-[25px] md:rounded-[30px] border border-transparent hover:border-pink-300 hover:bg-white transition-all group text-left"
        >
          <div className="p-3 md:p-4 bg-white rounded-2xl text-blue-500 shadow-sm group-hover:bg-blue-500 group-hover:text-white transition-colors">
            <Droplets className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-black text-xs uppercase text-slate-700 tracking-tight">
              Lingkungan
            </h4>
            <p className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase">
              Data Air & Sanitasi
            </p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300" />
        </Link>
      </div>

      <div className="flex flex-col items-center gap-4 md:gap-6">
        <button
          onClick={onAction}
          disabled={isTriggering}
          className="bg-gradient-to-r from-pink-500 to-rose-500 text-white px-10 md:px-12 py-5 md:py-6 rounded-[25px] md:rounded-[30px] font-black text-[10px] md:text-[11px] uppercase tracking-[0.15em] md:tracking-[0.2em] shadow-xl shadow-pink-200/50 hover:scale-105 transition-all flex items-center gap-3 md:gap-4 disabled:opacity-50"
        >
          {isTriggering ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Zap className="w-5 h-5 fill-current" />
          )}
          Jalankan Analisis Sekarang
        </button>
        <div className="flex items-center gap-2 text-amber-500 bg-amber-50 px-4 py-2 rounded-full">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest">
            Pastikan data profil sudah terisi lengkap
          </span>
        </div>
      </div>
    </div>
  );
}

function ScoreCircle({ score }: { score: number }) {
  const offset = 590.6 - (590.6 * (score || 0)) / 100;
  return (
    <div className="relative flex items-center justify-center scale-90 md:scale-110">
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
          stroke={score < 50 ? "#EF4444" : "#EC4899"}
          strokeWidth="14"
          fill="transparent"
          strokeDasharray="590.6"
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-5xl md:text-6xl font-black text-slate-800 tracking-tighter">
          {score}
        </span>
        <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
          Index
        </span>
      </div>
    </div>
  );
}

function Badge({ color, icon, label }: any) {
  const styles: any = {
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    red: "bg-red-50 text-red-600 border-red-100",
    slate: "bg-slate-900 text-white border-slate-800",
  };
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full border",
        styles[color],
      )}
    >
      {icon}{" "}
      <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">
        {label}
      </span>
    </div>
  );
}

function StatCard({ icon, label, value, color, bgColor, barColor }: any) {
  return (
    <div className="bg-white p-5 md:p-7 rounded-[30px] md:rounded-[40px] border border-slate-50 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
        <div className={cn("p-2.5 md:p-3 rounded-xl md:rounded-2xl", bgColor, color)}>
          {icon}
        </div>
        <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] md:tracking-[0.2em]">
          {label}
        </span>
      </div>
      <div className="flex items-center gap-3 md:gap-5">
        <div className="flex-1 h-2.5 md:h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={cn("h-full transition-all duration-1000", barColor)}
            style={{ width: `${value || 0}%` }}
          />
        </div>
        <span className="text-xs font-black text-slate-700">
          {value || 0}%
        </span>
      </div>
    </div>
  );
}

function RecommendationCard({ rec }: any) {
  const isWarn = rec.type === "WARNING";
  return (
    <div
      className={cn(
        "p-5 md:p-7 rounded-[28px] md:rounded-[35px] flex items-start gap-4 md:gap-6 border transition-all hover:translate-x-1",
        isWarn
          ? "bg-red-50/40 border-red-100"
          : rec.type === "INFO"
            ? "bg-blue-50/40 border-blue-100"
            : "bg-emerald-50/40 border-emerald-100",
      )}
    >
      <div
        className={cn(
          "p-3 md:p-4 rounded-xl md:rounded-2xl bg-white shadow-sm",
          isWarn
            ? "text-red-500"
            : rec.type === "INFO"
              ? "text-blue-500"
              : "text-emerald-500",
        )}
      >
        {isWarn ? (
          <AlertTriangle className="animate-pulse" />
        ) : (
          <CheckCircle2 />
        )}
      </div>
      <div>
        <h4 className="font-black text-slate-800 text-sm md:text-base mb-1 uppercase tracking-tight">
          {rec.title}
        </h4>
        <p className="text-slate-500 text-[11px] md:text-[13px] leading-relaxed font-medium">
          {rec.desc}
        </p>
      </div>
    </div>
  );
}
