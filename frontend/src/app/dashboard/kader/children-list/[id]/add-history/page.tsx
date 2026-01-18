"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  ArrowLeft,
  Baby,
  ShieldCheck,
  Utensils,
  Activity,
  Save,
  Loader2,
  Calendar,
  AlertCircle,
  Plus,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useChildDetail,
  useChildHealthMutation,
} from "@/hooks/kader/useChildren";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useConfirmModal } from "@/hooks/useConfirmModal";
import { motion, AnimatePresence } from "framer-motion";

type TabType = "immunization" | "nutrition" | "health";

export default function KaderAddHistoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const childId = id as string;
  const [activeTab, setActiveTab] = useState<TabType>("immunization");

  // Hook Konfirmasi
  const {
    isOpen,
    data: pendingData,
    openModal,
    closeModal,
  } = useConfirmModal<any>();

  // Data Fetching & Mutations
  const { data: child, isLoading: isChildLoading } = useChildDetail(childId);
  const { addImmunization, addNutrition, addHealth, isLoading } =
    useChildHealthMutation(childId);

  const { register, handleSubmit, reset } = useForm();

  // Trigger Modal Konfirmasi
  const handlePreSave = (values: any) => {
    openModal(values);
  };

  // Eksekusi Final ke Backend
  const executeSave = () => {
    if (!pendingData) return;

    const options = {
      onSuccess: () => {
        closeModal(); // Tutup modal
        reset(); // PERUBAHAN: Kosongkan semua field input
      },
    };

    if (activeTab === "immunization") {
      addImmunization({ ...pendingData, status: "DONE" }, options);
    } else if (activeTab === "nutrition") {
      addNutrition(
        {
          ...pendingData,
          frequencyPerDay: parseInt(pendingData.frequencyPerDay),
          recordedAt: new Date().toISOString(),
        },
        options,
      );
    } else if (activeTab === "health") {
      addHealth(
        {
          ...pendingData,
          isChronic: !!pendingData.isChronic,
          diagnosisDate: new Date(pendingData.diagnosisDate).toISOString(),
        },
        options,
      );
    }
  };

  if (isChildLoading)
    return (
      <div className="min-h-screen flex items-center justify-center font-black text-slate-300 uppercase tracking-widest animate-pulse">
        Memuat Data Anak...
      </div>
    );

  return (
    <RoleGuard allowedRoles={["KADER", "kader"]}>
      <div className="min-h-screen bg-[#FDFEFF] pb-10 px-6 pt-8">
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-400 hover:text-[#3AC4B6] transition-colors text-[10px] font-black uppercase tracking-[0.2em] mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </button>

        {/* HEADER CARD */}
        <header className="bg-[#3AC4B6] p-6 rounded-[35px] text-white shadow-xl flex items-center gap-5 mb-8">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[24px] flex items-center justify-center border border-white/30">
            <Baby className="w-8 h-8 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg font-black uppercase truncate">
              {child?.name}
            </h1>
            <p className="text-[9px] font-bold opacity-80 uppercase tracking-widest mt-1">
              Input Data Kesehatan
            </p>
          </div>
        </header>

        {/* TAB NAVIGATION */}
        <div className="flex bg-white p-2 rounded-[28px] border border-slate-100 shadow-sm gap-2 mb-8 overflow-x-auto no-scrollbar">
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
                setActiveTab(tab.id as TabType);
                reset(); // Reset form saat ganti tab agar data tidak campur aduk
              }}
              className={cn(
                "flex-1 min-w-[120px] flex items-center justify-center gap-2 py-4 rounded-[22px] text-[9px] font-black uppercase tracking-widest transition-all",
                activeTab === tab.id
                  ? "bg-[#3AC4B6] text-white shadow-lg shadow-teal-100"
                  : "text-slate-400",
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* FORM SECTION */}
        <form
          onSubmit={handleSubmit(handlePreSave)}
          className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm"
        >
          <div className="flex items-center gap-3 border-b border-slate-50 pb-6 mb-8">
            <Plus className="w-5 h-5 text-[#3AC4B6]" />
            <h2 className="font-black text-slate-700 text-[10px] uppercase tracking-[0.2em]">
              Data {activeTab}
            </h2>
          </div>

          <div className="space-y-6">
            {activeTab === "immunization" && (
              <>
                <InputField
                  label="Nama Vaksin"
                  name="vaccineName"
                  register={register}
                  placeholder="Contoh: Polio 1"
                  icon={<ShieldCheck className="w-4 h-4" />}
                />
                <InputField
                  label="Tanggal"
                  name="dateGiven"
                  register={register}
                  type="date"
                  icon={<Calendar className="w-4 h-4" />}
                />
              </>
            )}
            {activeTab === "nutrition" && (
              <>
                <InputField
                  label="Makanan"
                  name="foodType"
                  register={register}
                  placeholder="Bubur Tim"
                  icon={<Utensils className="w-4 h-4" />}
                />
                <InputField
                  label="Frekuensi"
                  name="frequencyPerDay"
                  register={register}
                  type="number"
                  placeholder="3"
                  icon={<Activity className="w-4 h-4" />}
                />
                <InputField
                  label="Protein"
                  name="proteinSource"
                  register={register}
                  placeholder="Hati Ayam"
                  icon={<Plus className="w-4 h-4" />}
                />
              </>
            )}
            {activeTab === "health" && (
              <>
                <InputField
                  label="Keluhan"
                  name="diseaseName"
                  register={register}
                  placeholder="Demam"
                  icon={<AlertCircle className="w-4 h-4" />}
                />
                <InputField
                  label="Tanggal"
                  name="diagnosisDate"
                  register={register}
                  type="date"
                  icon={<Calendar className="w-4 h-4" />}
                />
                <div className="bg-slate-50 p-5 rounded-[22px] flex items-center justify-between border-2 border-transparent focus-within:border-teal-100 transition-all">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Kronis?
                  </span>
                  <input
                    {...register("isChronic")}
                    type="checkbox"
                    className="w-6 h-6 accent-[#3AC4B6] cursor-pointer"
                  />
                </div>
              </>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-10 bg-[#3AC4B6] text-white py-5 rounded-[22px] font-black text-[11px] tracking-[0.2em] shadow-lg shadow-teal-100 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save className="w-5 h-5" />
            SIMPAN DATA
          </button>
        </form>
      </div>

      {/* --- CONFIRMATION MODAL --- */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-sm rounded-[40px] p-8 shadow-2xl"
            >
              <div className="w-16 h-16 bg-teal-50 text-[#3AC4B6] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-black text-slate-800 uppercase leading-tight mb-2">
                Konfirmasi Data
              </h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wide mb-8 px-4 leading-relaxed">
                Apakah data <span className="text-[#3AC4B6]">{activeTab}</span>{" "}
                yang Anda masukkan sudah benar?
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={executeSave}
                  disabled={isLoading}
                  className="py-4 rounded-[20px] text-[10px] font-black uppercase tracking-widest text-white bg-[#3AC4B6] shadow-lg shadow-teal-100 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    "Ya, Simpan"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </RoleGuard>
  );
}

function InputField({ label, name, register, icon, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group text-left">
        <input
          {...register(name, { required: true })}
          {...props}
          className="w-full bg-slate-50 rounded-[20px] px-6 py-4.5 text-xs font-bold text-slate-700 outline-none focus:bg-white border-2 border-transparent focus:border-[#3AC4B6]/20 transition-all placeholder:text-slate-300"
        />
        <div className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-[#3AC4B6] transition-colors">
          {icon}
        </div>
      </div>
    </div>
  );
}
