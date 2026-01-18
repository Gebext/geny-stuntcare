"use client";

import { useMotherStore } from "@/store/useMotherStore";
import { useAddChild } from "@/hooks/mother/useMotherData";
import { useForm } from "react-hook-form";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  Baby,
  Calendar,
  Scale,
  Ruler,
  Heart,
  Plus,
  Loader2,
  AlertCircle,
  User,
  ChevronRight,
  Save,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

const childSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  gender: z.enum(["L", "P"]).refine((val) => val === "L" || val === "P", {
    message: "Pilih Laki-laki atau Perempuan",
  }),
  birthDate: z.string().min(1, "Tanggal lahir wajib diisi"),
  birthWeight: z.coerce
    .number()
    .min(0.5, "Berat minimal 0.5 kg")
    .max(10, "Berat maksimal 10 kg"),
  birthLength: z.coerce
    .number()
    .min(30, "Panjang minimal 30 cm")
    .max(70, "Panjang maksimal 70 cm"),
  asiExclusive: z.boolean().default(false),
});

type ChildFormValues = z.infer<typeof childSchema>;

export default function MotherChildrenPage() {
  const { childProfiles } = useMotherStore();
  const addChildMutation = useAddChild();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ChildFormValues>({
    resolver: zodResolver(childSchema) as any,
    defaultValues: {
      gender: "L",
      asiExclusive: false,
    },
  });

  // Fungsi Handler Submit (Skenario 1, 2, 3)
  const handleOnSubmit = (values: ChildFormValues) => {
    console.log("Submit dipicu! Data:", values);

    const payload = {
      ...values,
      birthDate: new Date(values.birthDate).toISOString(),
    };

    // Eksekusi POST ke Backend
    addChildMutation.mutate(payload, {
      onSuccess: () => {
        reset(); // Bersihkan form jika Skenario 1 Berhasil
      },
    });
  };

  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 pb-10  mx-auto">
        {/* Header - Gradient Teal */}
        <header className="flex items-center gap-5 bg-gradient-to-br from-[#3AC4B6] to-[#2DA89B] p-8 rounded-[35px] text-white shadow-lg shadow-teal-100/50">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[22px] flex items-center justify-center border border-white/30">
            <Baby className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Daftar Buah Hati
            </h1>
            <p className="text-teal-50/80 text-sm font-medium mt-1">
              Daftarkan dan pantau tumbuh kembang si kecil secara real-time.
            </p>
          </div>
        </header>

        {/* FORM SECTION (Full Width) */}
        <div className="bg-white p-8 md:p-10 rounded-[35px] border border-slate-100 shadow-sm space-y-8">
          <div className="flex items-center gap-3 border-b border-slate-50 pb-6">
            <div className="w-10 h-10 bg-teal-50 text-[#3AC4B6] rounded-xl flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            <h2 className="font-bold text-slate-700 text-lg">
              Tambah Anak Baru
            </h2>
          </div>

          <form onSubmit={handleSubmit(handleOnSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              {/* Nama Lengkap */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Nama Lengkap
                </label>
                <input
                  {...register("name")}
                  placeholder="Contoh: Budi Santoso"
                  className={cn(
                    "w-full bg-slate-50 border-2 rounded-[22px] px-6 py-4.5 text-sm font-bold text-slate-700 outline-none transition-all",
                    errors.name
                      ? "border-rose-400"
                      : "border-transparent focus:border-[#3AC4B6]/20 focus:bg-white",
                  )}
                />
                {errors.name && (
                  <p className="text-[10px] text-rose-500 font-bold ml-2 flex items-center gap-1 italic">
                    <AlertCircle className="w-3 h-3" /> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Tanggal Lahir */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                  Tanggal Lahir
                </label>
                <input
                  {...register("birthDate")}
                  type="date"
                  className={cn(
                    "w-full bg-slate-50 border-2 rounded-[22px] px-6 py-4.5 text-sm font-bold text-slate-700 outline-none transition-all",
                    errors.birthDate
                      ? "border-rose-400"
                      : "border-transparent focus:border-[#3AC4B6]/20 focus:bg-white",
                  )}
                />
                {errors.birthDate && (
                  <p className="text-[10px] text-rose-500 font-bold ml-2 flex items-center gap-1 italic">
                    <AlertCircle className="w-3 h-3" />{" "}
                    {errors.birthDate.message}
                  </p>
                )}
              </div>

              {/* Gender & ASI Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    ASI Eksklusif
                  </label>
                  <div className="h-[62px] bg-slate-50 rounded-[22px] flex items-center justify-between px-6 border-2 border-transparent">
                    <Heart
                      className={cn(
                        "w-5 h-5 transition-all",
                        watch("asiExclusive")
                          ? "text-rose-500 fill-rose-500 scale-110"
                          : "text-slate-300",
                      )}
                    />
                    <input
                      type="checkbox"
                      {...register("asiExclusive")}
                      className="w-11 h-6 bg-slate-300 rounded-full appearance-none checked:bg-[#3AC4B6] transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:w-4 after:h-4 after:rounded-full after:transition-all checked:after:left-6 shadow-inner"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
                    Jenis Kelamin
                  </label>
                  <select
                    {...register("gender")}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#3AC4B6]/20 rounded-[22px] px-6 py-4.5 text-sm font-bold text-slate-700 outline-none cursor-pointer"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              {/* Berat & Panjang Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Scale className="w-3 h-3" /> Berat (kg)
                  </label>
                  <div className="relative">
                    <input
                      {...register("birthWeight")}
                      type="number"
                      step="0.1"
                      className={cn(
                        "w-full bg-slate-50 border-2 rounded-[22px] px-6 py-4.5 text-sm font-bold text-slate-700 outline-none transition-all",
                        errors.birthWeight
                          ? "border-rose-400"
                          : "border-transparent focus:border-[#3AC4B6]/20",
                      )}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">
                      kg
                    </span>
                  </div>
                  {errors.birthWeight && (
                    <p className="text-[10px] text-rose-500 font-bold ml-2 italic">
                      {errors.birthWeight.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <Ruler className="w-3 h-3" /> Panjang (cm)
                  </label>
                  <div className="relative">
                    <input
                      {...register("birthLength")}
                      type="number"
                      step="0.1"
                      className={cn(
                        "w-full bg-slate-50 border-2 rounded-[22px] px-6 py-4.5 text-sm font-bold text-slate-700 outline-none transition-all",
                        errors.birthLength
                          ? "border-rose-400"
                          : "border-transparent focus:border-[#3AC4B6]/20",
                      )}
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">
                      cm
                    </span>
                  </div>
                  {errors.birthLength && (
                    <p className="text-[10px] text-rose-500 font-bold ml-2 italic">
                      {errors.birthLength.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={addChildMutation.isPending}
              className="w-full bg-[#3AC4B6] text-white py-5 rounded-[22px] font-bold hover:bg-[#2DA89B] shadow-lg shadow-teal-100 transition-all flex items-center justify-center gap-3 active:scale-[0.98] disabled:opacity-50"
            >
              {addChildMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Daftarkan Anak Sekarang
            </button>
          </form>
        </div>

        {/* BOTTOM SECTION (Horizontal Row) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Stats Card */}
          <div className="bg-[#ECF7F6] p-8 rounded-[35px] border border-teal-50 flex flex-col items-center justify-center text-center">
            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-4 text-[#3AC4B6] shadow-sm">
              <CheckCircle2Icon className="w-6 h-6" />
            </div>
            <p className="text-[11px] font-bold text-[#3AC4B6] uppercase tracking-widest mb-1">
              Total Anak Terdaftar
            </p>
            <h3 className="text-5xl font-black text-[#3AC4B6]">
              {childProfiles?.length || 0}
            </h3>
          </div>

          {/* Child Preview Cards */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {childProfiles?.length === 0 ? (
              <div className="col-span-full bg-slate-50 rounded-[30px] flex items-center justify-center border-2 border-dashed border-slate-200 text-slate-400 font-bold uppercase text-[10px] tracking-widest p-10">
                Belum ada data anak
              </div>
            ) : (
              childProfiles.map((child: any) => (
                <Link
                  href={`/dashboard/mother/child/${child.id}`} // SAMBUNG KE HALAMAN DINAMIS
                  key={child.id}
                  className="bg-white p-6 rounded-[30px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[#3AC4B6]/30 transition-all cursor-pointer active:scale-[0.98]"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center",
                        child.gender === "L"
                          ? "bg-blue-50 text-blue-500"
                          : "bg-pink-50 text-pink-500",
                      )}
                    >
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-700 text-sm line-clamp-1">
                        {child.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">
                        {child.gender === "L" ? "Laki-laki" : "Perempuan"}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-[#3AC4B6] group-hover:translate-x-1 transition-all" />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

// Helper icon jika CheckCircle2 tidak ditemukan
function CheckCircle2Icon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
