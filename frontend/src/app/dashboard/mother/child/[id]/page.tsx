"use client";

import { useMotherStore } from "@/store/useMotherStore";
import { useParams } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import {
  Baby,
  ArrowLeft,
  ShieldCheck,
  Utensils,
  Activity,
  Plus,
  Save,
  LineChart,
  History,
  ChevronRight,
  Info,
  Loader2,
  AlertCircle,
  RefreshCcw,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useChildHistory, useAddActivity } from "@/hooks/child/useChildData";

export default function ChildDetailPage() {
  const { id } = useParams();
  const childId = id as string;
  const { childProfiles } = useMotherStore();
  const { toast } = useToast();

  // State Tab Aktif
  const [activeTab, setActiveTab] = useState<
    "immunization" | "nutrition" | "health"
  >("immunization");

  // 1. GET: http://localhost:3000/[type]/child/[childId]
  const {
    data: historyData,
    isLoading: isFetching,
    isError: isFetchError,
    refetch,
  } = useChildHistory(childId, activeTab);

  // 2. POST: http://localhost:3000/[type] + payload { childId, ... }
  const mutation = useAddActivity(childId, activeTab);

  const child = childProfiles?.find((c: any) => c.id === childId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Handle Form Submission
  const onSave = (values: any) => {
    mutation.mutate(values, {
      onSuccess: () => {
        reset();
        toast({
          title: "Data Disimpan! ✨",
          description: `Riwayat ${activeTab} si kecil telah berhasil ditambahkan.`,
        });
      },
      onError: (err: any) => {
        toast({
          title: "Gagal Menyimpan",
          description:
            err?.response?.data?.message ||
            "Otoritas ditolak atau masalah server.",
          variant: "destructive",
        });
      },
    });
  };

  if (!child) return <ProfileNotFound />;

  // Helper untuk normalisasi data riwayat (array atau object.data)
  const items = Array.isArray(historyData)
    ? historyData
    : historyData?.data || [];

  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 pb-10">
        {/* TOP NAVIGATION */}
        <div className="space-y-4">
          <Link
            href="/dashboard/mother/child"
            className="flex items-center gap-2 text-slate-400 hover:text-[#3AC4B6] transition-colors text-[10px] font-bold uppercase tracking-[0.2em] ml-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Daftar
          </Link>

          <header
            className={cn(
              "flex flex-col md:flex-row items-center gap-6 p-8 rounded-[35px] text-white shadow-lg",
              child.gender === "L"
                ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-100"
                : "bg-gradient-to-br from-pink-500 to-pink-600 shadow-pink-100"
            )}
          >
            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[25px] flex items-center justify-center border border-white/30 shrink-0">
              <Baby className="w-10 h-10 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-black tracking-tight uppercase">
                {child.name}
              </h1>
              <p className="text-white/80 text-[10px] font-bold uppercase tracking-widest mt-1 italic">
                Lahir:{" "}
                {new Date(child.birthDate).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </header>
        </div>

        {/* GROWTH STATS & KMS PREVIEW */}
        <div className="bg-white rounded-[35px] p-8 border border-slate-100 shadow-sm relative">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3AC4B6]/10 rounded-xl flex items-center justify-center">
                  <LineChart className="w-5 h-5 text-[#3AC4B6]" />
                </div>
                <h2 className="font-bold text-sm uppercase text-slate-700">
                  Kurva Pertumbuhan
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3 pt-2">
                <StatCard
                  label="Berat Badan"
                  value={child.birthWeight}
                  unit="kg"
                />
                <StatCard
                  label="Tinggi/Panjang"
                  value={child.birthLength}
                  unit="cm"
                />
              </div>
            </div>
            <div className="flex-1 min-h-[250px] bg-slate-50/50 rounded-[30px] border-2 border-dashed border-slate-100 flex items-center justify-center">
              <div className="text-center">
                <Info className="w-6 h-6 text-slate-200 mx-auto mb-2" />
                <p className="text-slate-300 text-[9px] font-bold uppercase tracking-widest">
                  Visualisasi KMS Aktif
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex bg-white p-2 rounded-[25px] border border-slate-100 shadow-sm gap-2">
          {[
            {
              id: "immunization",
              label: "Imunisasi",
              icon: <ShieldCheck className="w-4 h-4" />,
            },
            {
              id: "nutrition",
              label: "Nutrisi",
              icon: <Utensils className="w-4 h-4" />,
            },
            {
              id: "health",
              label: "Kesehatan",
              icon: <Activity className="w-4 h-4" />,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                reset();
              }}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-4 rounded-[20px] text-[10px] font-bold uppercase tracking-widest transition-all",
                activeTab === tab.id
                  ? "bg-[#3AC4B6] text-white shadow-lg"
                  : "text-slate-400 hover:bg-slate-50"
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* FORM INPUT SECTION */}
          <form
            onSubmit={handleSubmit(onSave)}
            className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm flex flex-col h-full"
          >
            <div className="flex items-center gap-3 border-b border-slate-50 pb-5 mb-6">
              <Plus className="w-5 h-5 text-[#3AC4B6]" />
              <h2 className="font-bold text-slate-700 text-xs uppercase tracking-widest">
                Input {activeTab}
              </h2>
            </div>

            <div className="space-y-4 flex-grow">
              {activeTab === "immunization" && (
                <ImmunizationFields register={register} errors={errors} />
              )}
              {activeTab === "nutrition" && (
                <NutritionFields register={register} errors={errors} />
              )}
              {activeTab === "health" && (
                <HealthFields register={register} errors={errors} />
              )}
            </div>

            <button
              disabled={mutation.isPending}
              className="w-full mt-8 bg-[#3AC4B6] text-white py-5 rounded-[22px] font-bold text-[10px] tracking-[0.2em] hover:bg-[#2DA89B] shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              SIMPAN DATA
            </button>
          </form>

          {/* HISTORY DISPLAY SECTION */}
          <div className="lg:col-span-2 bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm flex flex-col h-full">
            <div className="flex items-center gap-3 border-b border-slate-50 pb-5 mb-6">
              <History className="w-5 h-5 text-slate-300" />
              <h2 className="font-bold text-slate-700 text-xs uppercase tracking-widest">
                Riwayat {activeTab}
              </h2>
            </div>

            <div className="flex-grow overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
              {isFetching ? (
                <div className="py-20 text-center animate-pulse text-slate-300 font-bold text-[10px] uppercase">
                  Sinkronisasi...
                </div>
              ) : isFetchError ? (
                <div className="py-20 text-center flex flex-col items-center">
                  <AlertCircle className="w-10 h-10 text-rose-500 mb-2 opacity-20" />
                  <p className="text-xs font-bold text-slate-400 mb-4">
                    Sesi berakhir atau gagal memuat
                  </p>
                  <button
                    onClick={() => refetch()}
                    className="flex items-center gap-2 text-[10px] font-black text-[#3AC4B6] uppercase tracking-widest hover:underline"
                  >
                    <RefreshCcw className="w-3 h-3" /> Coba Lagi
                  </button>
                </div>
              ) : items.length > 0 ? (
                <div className="space-y-3">
                  {items.map((item: any, idx: number) => (
                    <HistoryCard key={item.id || idx} item={item} />
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center opacity-20 flex flex-col items-center">
                  <History className="w-12 h-12 mb-2" />
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em]">
                    Data Kosong
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

// --- SUB-COMPONENTS & HELPERS ---

function StatCard({ label, value, unit }: any) {
  return (
    <div className="bg-[#F0FDFA] p-5 rounded-[25px] border border-teal-50 flex items-center justify-between">
      <span className="text-[9px] font-black text-[#3AC4B6] uppercase tracking-[0.1em]">
        {label}
      </span>
      <span className="text-xl font-black text-slate-700">
        {value} <span className="text-xs font-bold text-slate-400">{unit}</span>
      </span>
    </div>
  );
}

function HistoryCard({ item }: any) {
  // Normalisasi properti karena tiap kategori punya nama field berbeda di API
  const title =
    item.vaccineName || item.foodType || item.diseaseName || "Data Terdaftar";
  const date =
    item.dateGiven || item.recordedAt || item.diagnosisDate || item.createdAt;

  return (
    <div className="flex items-center justify-between p-5 bg-slate-50/50 rounded-[25px] border border-transparent hover:border-teal-100 hover:bg-white transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#3AC4B6] group-hover:scale-105 transition-transform">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div>
          <p className="text-xs font-bold text-slate-700 uppercase leading-none mb-1">
            {title}
          </p>
          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
            {date
              ? new Date(date).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "-"}
          </p>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-200 group-hover:text-[#3AC4B6] transition-colors" />
    </div>
  );
}

function ProfileNotFound() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
        <Baby className="w-8 h-8" />
      </div>
      <p className="font-bold text-slate-400 text-sm">
        Profil si kecil tidak ditemukan.
      </p>
      <Link
        href="/dashboard/mother/children"
        className="bg-slate-100 px-6 py-2 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-200 transition-colors"
      >
        Kembali
      </Link>
    </div>
  );
}

// --- TAB-SPECIFIC INPUT FIELDS ---

function ImmunizationFields({ register, errors }: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">
          Nama Vaksin
        </label>
        <input
          {...register("vaccineName", { required: "Nama vaksin wajib diisi" })}
          placeholder="Contoh: Polio 1"
          className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-500/20 rounded-[18px] px-5 py-4 text-xs font-bold outline-none transition-all"
        />
        {errors.vaccineName && (
          <p className="text-[9px] text-rose-500 font-bold ml-1">
            {errors.vaccineName.message}
          </p>
        )}
      </div>
      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">
          Tanggal Pemberian
        </label>
        <input
          {...register("dateGiven", { required: true })}
          type="date"
          className="w-full bg-slate-50 border-none rounded-[18px] px-5 py-4 text-xs font-bold outline-none"
        />
      </div>
    </div>
  );
}

function NutritionFields({ register, errors }: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Jenis Makanan
        </label>
        <input
          {...register("foodType", { required: "Jenis makanan wajib diisi" })}
          placeholder="Contoh: MPASI Bubur Wortel"
          className="w-full bg-slate-50 border-none rounded-[18px] px-5 py-4 text-xs font-bold outline-none"
        />
        {errors.foodType && (
          <p className="text-[9px] text-rose-500 font-bold ml-1">
            {errors.foodType.message}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Frekuensi (kali/hari)
        </label>
        <input
          {...register("frequencyPerDay", { required: true, min: 1 })}
          type="number"
          placeholder="3"
          className="w-full bg-slate-50 border-none rounded-[18px] px-5 py-4 text-xs font-bold outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Sumber Protein
        </label>
        <input
          {...register("proteinSource")}
          placeholder="Contoh: Ikan Salmon / Telur"
          className="w-full bg-slate-50 border-none rounded-[18px] px-5 py-4 text-xs font-bold outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
          Tanggal Pencatatan
        </label>
        <input
          {...register("recordedAt", { required: true })}
          type="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          className="w-full bg-slate-50 border-none rounded-[18px] px-5 py-4 text-xs font-bold outline-none"
        />
      </div>
    </div>
  );
}

function HealthFields({ register }: any) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">
          Keluhan / Penyakit
        </label>
        <input
          {...register("diseaseName", { required: true })}
          placeholder="Contoh: Batuk Pilek"
          className="w-full bg-slate-50 border-none rounded-[18px] px-5 py-4 text-xs font-bold outline-none"
        />
      </div>
      <div className="space-y-1">
        <label className="text-[9px] font-black text-slate-400 uppercase tracking-[0.1em] ml-1">
          Tanggal Diagnosis
        </label>
        <input
          {...register("diagnosisDate", { required: true })}
          type="date"
          className="w-full bg-slate-50 border-none rounded-[18px] px-5 py-4 text-xs font-bold outline-none"
        />
      </div>
      <div className="bg-slate-50 rounded-[20px] px-5 py-4 flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          Kondisi Kronis?
        </span>
        <input
          {...register("isChronic")}
          type="checkbox"
          className="w-5 h-5 accent-[#3AC4B6] cursor-pointer"
        />
      </div>
    </div>
  );
}
