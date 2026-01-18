"use client";

import { useForm } from "react-hook-form";
import {
  ChevronLeft,
  UserPlus,
  Mail,
  Phone,
  Lock,
  ShieldCheck,
  AlertCircle,
  UserCheck,
  Loader2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useCreateUser } from "@/hooks/admin/useUserMutation";
import { cn } from "@/lib/utils";
import { useConfirmModal } from "@/hooks/useConfirmModal";

interface UserFormProps {
  role: "KADER" | "ADMIN";
}

export default function UserFormPage({ role }: UserFormProps) {
  const { mutate, isPending } = useCreateUser();
  const {
    isOpen,
    data: formData,
    openModal,
    closeModal,
  } = useConfirmModal<any>();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const handlePreSubmit = (data: any) => openModal(data);

  const handleFinalConfirm = () => {
    if (!formData) return;
    mutate(
      { ...formData, role },
      {
        onSuccess: () => {
          reset();
          closeModal();
        },
      },
    );
  };

  return (
    <div className="mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/admin/monitoring"
            className="group p-4 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-[#3AC4B6] transition-all shadow-sm hover:shadow-md active:scale-90"
          >
            <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">
              Registrasi {role === "KADER" ? "Kader" : "Administrator"}
            </h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-0.5">
              Geny Stuntcare Security Protocol
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* FORM MAIN AREA - KOTAK INPUT DIBESARKAN (py-5 & text-base) */}
        <form
          onSubmit={handleSubmit(handlePreSubmit)}
          className="lg:col-span-2 bg-white rounded-[40px] p-8 md:p-12 border border-slate-100 shadow-xl shadow-slate-200/20 space-y-8"
        >
          <div className="space-y-8">
            <h2 className="text-[10px] font-black text-[#3AC4B6] uppercase tracking-[0.4em] border-b border-slate-50 pb-5">
              Informasi Identitas
            </h2>

            {/* Field Nama */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Nama Lengkap
              </label>
              <div className="relative group">
                <UserPlus className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-[#3AC4B6] transition-colors" />
                <input
                  {...register("name", { required: "Nama wajib diisi" })}
                  placeholder="Masukkan nama lengkap..."
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-teal-100 focus:bg-white rounded-[24px] text-base font-bold text-slate-700 outline-none transition-all shadow-inner"
                />
              </div>
              {errors.name && (
                <p className="text-rose-500 text-[10px] font-black ml-1 flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3 h-3" />{" "}
                  {errors.name.message as string}
                </p>
              )}
            </div>

            {/* Field Email */}
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                Email Official
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-[#3AC4B6] transition-colors" />
                <input
                  {...register("email", {
                    required: "Email wajib diisi",
                    pattern: {
                      value: /^\S+@\S+$/i,
                      message: "Format email salah",
                    },
                  })}
                  placeholder="contoh@genystuntcare.com"
                  className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-teal-100 focus:bg-white rounded-[24px] text-base font-bold text-slate-700 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* WhatsApp */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  No. WhatsApp
                </label>
                <div className="relative group">
                  <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-[#3AC4B6] transition-colors" />
                  <input
                    {...register("phone", { required: "Wajib diisi" })}
                    placeholder="0812..."
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-teal-100 focus:bg-white rounded-[24px] text-base font-bold text-slate-700 outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-[#3AC4B6] transition-colors" />
                  <input
                    type="password"
                    {...register("password", {
                      required: "Minimal 8 karakter",
                      minLength: 8,
                    })}
                    placeholder="********"
                    className="w-full pl-14 pr-6 py-5 bg-slate-50 border-2 border-transparent focus:border-teal-100 focus:bg-white rounded-[24px] text-base font-bold text-slate-700 outline-none transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3 px-5 py-3 bg-slate-50 rounded-2xl border border-slate-100">
              <ShieldCheck
                className={cn(
                  "w-6 h-6",
                  role === "ADMIN" ? "text-indigo-500" : "text-[#3AC4B6]",
                )}
              />
              <div className="flex flex-col">
                <span className="text-[8px] font-black text-slate-400 uppercase">
                  Izin Akses
                </span>
                <span className="text-[11px] font-black text-slate-700 uppercase tracking-widest leading-none">
                  {role}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-16 py-6 bg-gradient-to-r from-[#3AC4B6] to-[#2DA89B] text-white rounded-[25px] font-black text-[12px] uppercase tracking-[0.25em] shadow-xl shadow-teal-100 hover:shadow-teal-200 active:scale-95 transition-all"
            >
              Simpan Akun
            </button>
          </div>
        </form>

        {/* SIDE INFO AREA */}
        <div className="hidden lg:block space-y-6">
          <div className="bg-[#3AC4B6] rounded-[40px] p-8 text-white relative overflow-hidden shadow-xl shadow-teal-100">
            <div className="relative z-10">
              <Sparkles className="w-12 h-12 mb-6 opacity-80" />
              <h3 className="text-xl font-black leading-tight uppercase tracking-tight">
                Security
                <br />
                Protocol
              </h3>
              <p className="text-xs text-teal-50 font-medium mt-4 leading-relaxed opacity-70">
                Sistem akan secara otomatis mengenali role personil dan
                menyesuaikan hak akses menu di dashboard.
              </p>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
          </div>

          <div className="bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">
              Ringkasan Hak Akses
            </h4>
            <div className="space-y-4">
              <div
                className={cn(
                  "p-5 rounded-[22px] border transition-all",
                  role === "ADMIN"
                    ? "bg-teal-50 border-teal-100"
                    : "bg-slate-50 border-transparent opacity-40",
                )}
              >
                <p className="text-xs font-black text-slate-700 uppercase leading-none">
                  Admin Level
                </p>
                <p className="text-[10px] text-slate-400 font-bold mt-2">
                  Kelola user, Kader, dan pantau statistik global.
                </p>
              </div>
              <div
                className={cn(
                  "p-5 rounded-[22px] border transition-all",
                  role === "KADER"
                    ? "bg-teal-50 border-teal-100"
                    : "bg-slate-50 border-transparent opacity-40",
                )}
              >
                <p className="text-xs font-black text-slate-700 uppercase leading-none">
                  Kader Level
                </p>
                <p className="text-[10px] text-slate-400 font-bold mt-2">
                  Dampingi ibu binaan dan input data antropometri.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL KONFIRMASI */}
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white rounded-[45px] p-12 max-w-sm w-full shadow-2xl relative z-10 border border-slate-100 animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-teal-50 rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-inner">
              <UserCheck className="w-10 h-10 text-[#3AC4B6]" />
            </div>
            <h3 className="text-xl font-black text-slate-800 text-center uppercase tracking-tight">
              Konfirmasi
            </h3>
            <p className="text-sm text-slate-400 text-center mt-3 leading-relaxed">
              Daftarkan{" "}
              <span className="font-black text-slate-700">
                {formData?.name}
              </span>{" "}
              sebagai personil baru?
            </p>

            <div className="grid grid-cols-2 gap-4 mt-12">
              <button
                onClick={closeModal}
                className="py-5 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors"
              >
                Batal
              </button>
              <button
                disabled={isPending}
                onClick={handleFinalConfirm}
                className="py-5 bg-[#3AC4B6] text-white rounded-[22px] text-[11px] font-black uppercase tracking-widest shadow-xl shadow-teal-100 active:scale-95 transition-all flex items-center justify-center gap-3"
              >
                {isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Simpan"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
