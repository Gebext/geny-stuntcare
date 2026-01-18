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

  // 1. Fungsi saat tombol form ditekan (Hanya buka modal)
  const handlePreSubmit = (data: any) => {
    openModal(data);
  };

  // 2. Fungsi eksekusi final setelah konfirmasi di modal
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
    <div className="mx-auto space-y-8">
      {/* Breadcrumb & Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/admin/monitoring"
          className="p-3 bg-white rounded-2xl border border-slate-100 text-slate-400 hover:text-[#3AC4B6] transition-colors shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-xl font-bold text-slate-800">
            Registrasi {role === "KADER" ? "Kader" : "Administrator"}
          </h1>
          <p className="text-sm text-slate-400">
            Tambahkan personil baru ke dalam sistem Geny Stuntcare.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(handlePreSubmit)}
        className="bg-white rounded-[35px] p-10 border border-slate-100 shadow-sm space-y-6"
      >
        {/* Field Nama */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
            Nama Lengkap
          </label>
          <div className="relative">
            <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input
              {...register("name", { required: "Nama wajib diisi" })}
              placeholder="Masukkan nama lengkap..."
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#3AC4B6]/20 outline-none transition-all"
            />
          </div>
          {errors.name && (
            <p className="text-rose-500 text-[10px] font-bold ml-1">
              {errors.name.message as string}
            </p>
          )}
        </div>

        {/* Field Email */}
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
            Email Official
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
            <input
              {...register("email", {
                required: "Email wajib diisi",
                pattern: { value: /^\S+@\S+$/i, message: "Format email salah" },
              })}
              placeholder="contoh@geny.com"
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#3AC4B6]/20 outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              No. WhatsApp
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input
                {...register("phone")}
                placeholder="0812..."
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#3AC4B6]/20 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input
                type="password"
                {...register("password", {
                  minLength: { value: 8, message: "Minimal 8 karakter" },
                })}
                placeholder="********"
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-[#3AC4B6]/20 outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="pt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
            <ShieldCheck
              className={cn(
                "w-4 h-4",
                role === "ADMIN" ? "text-indigo-500" : "text-[#3AC4B6]",
              )}
            />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              {role} ACCESS
            </span>
          </div>

          <button
            type="submit"
            className="px-10 py-4 bg-gradient-to-r from-[#3AC4B6] to-[#2DA89B] text-white rounded-2xl font-bold text-sm shadow-lg shadow-teal-100/50 hover:scale-105 active:scale-95 transition-all"
          >
            Simpan Akun
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] p-8 max-w-sm w-full shadow-2xl border border-slate-100 animate-in zoom-in duration-200">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <UserCheck className="w-8 h-8 text-[#3AC4B6]" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 text-center mb-2">
              Konfirmasi Akun
            </h3>
            <p className="text-sm text-slate-500 text-center mb-8">
              Apakah Anda yakin ingin mendaftarkan{" "}
              <span className="font-bold text-slate-700">{formData?.name}</span>{" "}
              sebagai <span className="lowercase">{role}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="flex-1 py-4 text-sm font-bold text-slate-400"
              >
                Batal
              </button>
              <button
                disabled={isPending}
                onClick={handleFinalConfirm}
                className="flex-1 py-4 bg-[#3AC4B6] text-white rounded-2xl text-sm font-bold shadow-lg shadow-teal-100 flex items-center justify-center gap-2"
              >
                {isPending && (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                Ya, Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
