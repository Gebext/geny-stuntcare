"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Calendar,
  Phone,
  Home,
  Activity,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Droplets,
  User,
  Syringe,
  Apple,
  Stethoscope,
  Plus,
  Scale,
  Ruler,
  X,
  Loader2,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  useChildDetail,
  useChildImmunization,
  useChildNutrition,
  useChildHealthHistory,
  useAddAnthropometry,
} from "@/hooks/kader/useChildren";
import { motion, AnimatePresence } from "framer-motion";

export default function ChildDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const childId = id as string;

  const [activeTab, setActiveTab] = useState("overview");
  const [isMeasureModalOpen, setIsMeasureModalOpen] = useState(false);

  // --- DATA FETCHING ---
  const { data: child, isLoading: isChildLoading } = useChildDetail(childId);
  const { data: immunizations } = useChildImmunization(childId);
  const { data: nutritions } = useChildNutrition(childId);
  const { data: healthHistories } = useChildHealthHistory(childId);

  // --- MUTATION ---
  const { mutate: addMeasure, isPending } = useAddAnthropometry(childId);
  const { register, handleSubmit, reset } = useForm();

  const onSubmitMeasure = (values: any) => {
    addMeasure(
      {
        weightKg: parseFloat(values.weightKg),
        heightCm: parseFloat(values.heightCm),
        // Mengubah tanggal ke format ISO 8601 (2023-10-27T00:00:00Z)
        measurementDate: new Date(values.measurementDate).toISOString(),
        headCircumferenceCm: values.headCircumferenceCm
          ? parseFloat(values.headCircumferenceCm)
          : undefined,
        armCircumferenceCm: values.armCircumferenceCm
          ? parseFloat(values.armCircumferenceCm)
          : undefined,
      },
      {
        onSuccess: () => {
          setIsMeasureModalOpen(false);
          reset();
        },
      },
    );
  };

  if (isChildLoading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center">
            <BabyIcon className="w-10 h-10 text-teal-200" />
          </div>
          <div className="h-2 w-24 bg-slate-100 rounded-full" />
        </div>
      </div>
    );

  const TABS = [
    { id: "overview", label: "Ringkasan", icon: Activity },
    { id: "growth", label: "Riwayat", icon: TrendingUp },
    { id: "family", label: "Keluarga", icon: Home },
  ];

  const formatDate = (date: string) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-[#FDFEFF] pb-10">
      {/* HEADER TOP */}
      <div className="bg-[#3AC4B6] pt-8 pb-32 px-6 rounded-b-[50px] relative overflow-hidden shadow-2xl shadow-teal-100/50">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />

        <div className="flex items-center justify-between relative z-10 mb-8">
          <button
            onClick={() => router.back()}
            className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md border border-white/20 active:scale-90 transition-transform"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md border border-white/20">
            <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">
              Data Kader
            </span>
          </div>
        </div>

        <div className="flex items-center gap-5 relative z-10 text-white">
          <div className="w-20 h-20 rounded-[28px] bg-white flex items-center justify-center text-3xl font-black shadow-xl text-[#3AC4B6]">
            {child?.gender === "MALE" ? "L" : "P"}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black truncate uppercase leading-tight mb-1">
              {child?.name}
            </h1>
            <div className="flex items-center gap-2 opacity-80 text-[10px] font-bold uppercase tracking-widest">
              <Calendar className="w-3 h-3" />
              Lahir: {formatDate(child?.birthDate)}
            </div>
          </div>
        </div>
      </div>

      <main className="px-6 -mt-20 relative z-20">
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: "Berat Lahir", val: `${child?.birthWeight || 0}kg` },
            { label: "Tinggi Lahir", val: `${child?.birthLength || 0}cm` },
            { label: "Status", val: child?.stuntingRisk || "NORMAL" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-[30px] shadow-sm border border-slate-50 text-center"
            >
              <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-tighter">
                {item.label}
              </p>
              <p
                className={cn(
                  "text-xs font-black",
                  item.val === "STUNTED" || item.val === "RISK"
                    ? "text-red-500"
                    : "text-slate-700",
                )}
              >
                {item.val}
              </p>
            </div>
          ))}
        </div>

        {/* TAB NAVIGATION */}
        <div className="bg-white p-2 rounded-[24px] shadow-sm border border-slate-50 flex mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-3 rounded-2xl flex flex-col items-center gap-1 transition-all",
                activeTab === tab.id
                  ? "bg-[#3AC4B6] text-white shadow-lg shadow-teal-100"
                  : "text-slate-400",
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase tracking-widest">
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="space-y-6 pb-20">
          {activeTab === "overview" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  Pengukuran Terakhir
                </h2>
                <button
                  onClick={() => setIsMeasureModalOpen(true)}
                  className="flex items-center gap-1.5 text-[9px] font-black text-white bg-[#3AC4B6] px-4 py-2 rounded-full shadow-lg shadow-teal-100 active:scale-95 transition-all"
                >
                  <Plus className="w-3 h-3" /> INPUT DATA
                </button>
              </div>

              {child?.anthropometries?.length > 0 ? (
                <div className="space-y-3">
                  {child.anthropometries.map((measure: any, idx: number) => (
                    <div
                      key={idx}
                      className="bg-white rounded-[25px] border border-slate-50 p-5 shadow-sm flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-[#3AC4B6]">
                          <Activity className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-slate-700 uppercase">
                            {formatDate(measure.createdAt)}
                          </p>
                          <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                            Umur: {measure.ageInMonths} Bln
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs font-black text-slate-700">
                          {measure.weightKg} kg
                        </p>
                        <p className="text-[10px] font-bold text-[#3AC4B6]">
                          {measure.heightCm} cm
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-[32px] border-2 border-dashed border-slate-100 p-10 text-center">
                  <ClipboardList className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-[10px] font-black text-slate-300 uppercase">
                    Belum ada pengukuran
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === "growth" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-end mb-6">
                <Link
                  href={`/dashboard/kader/children-list/${childId}/add-history`}
                  className="flex items-center gap-2 bg-[#3AC4B6] text-white px-5 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4" /> Tambah Riwayat
                </Link>
              </div>

              <div className="space-y-8">
                {/* 1. IMUNISASI */}
                <Section
                  title="Riwayat Imunisasi"
                  icon={<Syringe className="text-indigo-400 w-3 h-3" />}
                >
                  {immunizations?.length > 0 ? (
                    immunizations.map((item: any) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-[24px] border border-slate-50 shadow-sm flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center text-[10px]">
                            💉
                          </div>
                          <div>
                            <h4 className="text-[11px] font-black text-slate-700 uppercase">
                              {item.vaccineName}
                            </h4>
                            <p className="text-[8px] font-bold text-slate-400 uppercase">
                              {formatDate(item.dateGiven)}
                            </p>
                          </div>
                        </div>
                        <span className="bg-emerald-50 text-emerald-500 text-[8px] font-black px-2 py-1 rounded-md uppercase">
                          {item.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </Section>

                {/* 2. NUTRISI */}
                <Section
                  title="Pola Nutrisi"
                  icon={<Apple className="text-rose-400 w-3 h-3" />}
                >
                  {nutritions?.length > 0 ? (
                    nutritions.map((item: any) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-[24px] border border-slate-50 shadow-sm"
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="text-[11px] font-black text-slate-700 uppercase">
                            {item.foodType}
                          </h4>
                          <span className="text-[8px] font-black bg-rose-50 text-rose-500 px-2 py-1 rounded-md">
                            {item.frequencyPerDay}x Sehari
                          </span>
                        </div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">
                          Sumber: {item.proteinSource}
                        </p>
                      </div>
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </Section>

                {/* 3. RIWAYAT KESEHATAN / PENYAKIT */}
                <Section
                  title="Riwayat Penyakit"
                  icon={<Stethoscope className="text-blue-400 w-3 h-3" />}
                >
                  {healthHistories?.length > 0 ? (
                    healthHistories.map((item: any) => (
                      <div
                        key={item.id}
                        className="bg-white p-4 rounded-[24px] border border-slate-50 shadow-sm flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-[10px]">
                            🌡️
                          </div>
                          <div>
                            <h4 className="text-[11px] font-black text-slate-700 uppercase">
                              {item.diseaseName}
                            </h4>
                            <p className="text-[8px] font-bold text-slate-400 uppercase">
                              {formatDate(item.diagnosisDate)}
                            </p>
                          </div>
                        </div>
                        {item.isChronic && (
                          <span className="bg-red-500 text-white text-[7px] font-black px-2 py-1 rounded-full uppercase">
                            Kronis
                          </span>
                        )}
                      </div>
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </Section>
              </div>
            </div>
          )}
          {activeTab === "family" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#3AC4B6]">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                      Nama Ibu
                    </p>
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-tight">
                      {child?.mother?.user?.name || "Data Tidak Ada"}
                    </h3>
                  </div>
                </div>
                <a
                  href={`tel:${child?.mother?.user?.phone}`}
                  className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#3AC4B6]" />
                    <span className="text-xs font-bold text-slate-600">
                      {child?.mother?.user?.phone || "-"}
                    </span>
                  </div>
                  <span className="text-[8px] font-black text-[#3AC4B6] uppercase">
                    Hubungi
                  </span>
                </a>
              </div>

              <div className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-50">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 ml-1">
                  Kondisi Lingkungan
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Droplets className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase">
                        Air Bersih
                      </span>
                    </div>
                    <p className="text-[10px] font-black text-slate-700">
                      {child?.mother?.environment?.cleanWater
                        ? "TERSEDIA"
                        : "TIDAK ADA"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase">
                        Sanitasi
                      </span>
                    </div>
                    <p className="text-[10px] font-black text-slate-700 uppercase">
                      {child?.mother?.environment?.sanitation || "BELUM SET"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* --- MODAL INPUT ANTROPOMETRI --- */}
      <AnimatePresence>
        {isMeasureModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMeasureModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-white w-full max-w-lg rounded-t-[40px] sm:rounded-[40px] p-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-[#3AC4B6]">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">
                    Input Pengukuran
                  </h3>
                </div>
                <button
                  onClick={() => setIsMeasureModalOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-50 text-slate-400"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleSubmit(onSubmitMeasure)}
                className="space-y-5"
              >
                {/* Field Tanggal Pengukuran */}
                <div className="space-y-2 text-left">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Tanggal Pengukuran
                  </label>
                  <input
                    {...register("measurementDate", { required: true })}
                    type="date"
                    defaultValue={new Date().toISOString().split("T")[0]}
                    className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-xs font-bold text-slate-700 outline-none focus:bg-white border-2 border-transparent focus:border-teal-100 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Berat (kg)"
                    name="weightKg"
                    register={register}
                    icon={<Scale />}
                    placeholder="Contoh: 8.5"
                  />
                  <InputField
                    label="Tinggi (cm)"
                    name="heightCm"
                    register={register}
                    icon={<Ruler />}
                    placeholder="Contoh: 70.2"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full bg-[#3AC4B6] text-white py-5 rounded-2xl font-black text-[11px] tracking-[0.2em] shadow-lg shadow-teal-100 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50 mt-4"
                >
                  {isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  SIMPAN PENGUKURAN
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- HELPER COMPONENTS ---
function Section({ title, icon, children }: any) {
  return (
    <section>
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 ml-2 flex items-center gap-2">
        {icon} {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function EmptyState() {
  return (
    <p className="text-[9px] text-center text-slate-300 py-6 border-2 border-dashed rounded-[24px] uppercase font-black tracking-widest">
      Data Kosong
    </p>
  );
}

function BabyIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 12h.01" />
      <path d="M15 12h.01" />
      <path d="M10 16c.5 1 1.5 1 2 1s1.5 0 2-1" />
      <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1" />
      <path d="M12 7c0-2.5-2-2.5-2-2.5" />
    </svg>
  );
}

function InputField({ label, name, register, icon, ...props }: any) {
  return (
    <div className="space-y-2 text-left">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          {...register(name, { required: props.placeholder !== "Optional" })}
          type="number"
          step="0.01"
          {...props}
          className="w-full bg-slate-50 rounded-2xl px-5 py-4 text-xs font-bold text-slate-700 outline-none focus:bg-white border-2 border-transparent focus:border-teal-100 transition-all"
        />
        {icon && (
          <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-[#3AC4B6] transition-colors scale-75">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
