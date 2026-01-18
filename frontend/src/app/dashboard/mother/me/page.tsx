"use client";

import { useMotherStore } from "@/store/useMotherStore";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  Heart,
  Activity,
  Scale,
  Ruler,
  Save,
  Loader2,
  Info,
  Calendar,
  Baby,
  AlertCircle,
  Home,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateMotherProfile } from "@/hooks/mother/useMotherData";
import Link from "next/link";

const motherFormSchema = z.object({
  age: z.coerce.number().min(12, "Umur minimal 12").max(60, "Umur maksimal 60"),
  heightCm: z.coerce
    .number()
    .min(100, "Tinggi minimal 100")
    .max(250, "Tinggi maksimal 250"),
  weightKg: z.coerce
    .number()
    .min(30, "Berat minimal 30")
    .max(200, "Berat maksimal 200"),
  lilaCm: z.coerce
    .number()
    .min(10, "LILA minimal 10")
    .max(50, "LILA maksimal 50"),
  isPregnant: z.boolean(),
  trimester: z.coerce.number().min(1).max(3).nullable().optional(),
  ttdCompliance: z.boolean(),
});

type MotherFormValues = z.infer<typeof motherFormSchema>;

export default function MotherMePage() {
  const profile = useMotherStore((state) => state.profile);
  const updateMutation = useUpdateMotherProfile();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<MotherFormValues>({
    resolver: zodResolver(motherFormSchema) as any,
    defaultValues: {
      age: 20, // Default wajar agar tidak kena error Zod saat render pertama
      heightCm: 155,
      weightKg: 50,
      lilaCm: 23,
      isPregnant: false,
      trimester: null,
      ttdCompliance: false,
    },
  });

  const isPregnant = watch("isPregnant");

  useEffect(() => {
    // Only reset if profile exists and has data
    if (profile && Object.keys(profile).length > 0) {
      reset({
        age: profile.age || 20,
        heightCm: profile.heightCm || 155,
        weightKg: profile.weightKg || 50,
        lilaCm: profile.lilaCm || 23,
        isPregnant: profile.isPregnant || false,
        trimester: profile.trimester ?? null,
        ttdCompliance: profile.ttdCompliance === "Patuh",
      });
    }
  }, [profile, reset]);

  const onSubmit: SubmitHandler<MotherFormValues> = (data) => {
    const payload = {
      ...data,
      trimester: data.isPregnant ? Number(data.trimester) : null,
      ttdCompliance: data.ttdCompliance ? "Patuh" : "Tidak Patuh",
    };
    updateMutation.mutate(payload);
  };

  const currentWeight = watch("weightKg");
  const currentHeight = watch("heightCm");
  const bmi =
    currentWeight && currentHeight
      ? (currentWeight / Math.pow(currentHeight / 100, 2)).toFixed(1)
      : "0";

  // REMOVED: if (!profile) return null;
  // Ini yang bikin blank. Sekarang form akan tampil meski data profile belum fetch selesai.

  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 pb-10">
        <header className="flex items-center gap-5 bg-gradient-to-br from-[#3AC4B6] to-[#2DA89B] p-8 rounded-[35px] text-white shadow-lg shadow-teal-100/50">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[22px] flex items-center justify-center border border-white/30">
            <Heart className="w-8 h-8 fill-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Kesehatan Bunda
            </h1>
            <p className="text-teal-50/80 text-sm font-medium mt-1">
              Lengkapi data antropometri untuk pemantauan gizi
            </p>
          </div>
        </header>

        <div className="flex justify-start px-2">
          <Link
            href="/dashboard/mother/me/environment"
            className="group flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-100 rounded-full shadow-sm hover:border-[#3AC4B6]/30 hover:bg-[#F0FDFA] transition-all"
          >
            <div className="w-6 h-6 bg-[#F0FDFA] group-hover:bg-[#3AC4B6] rounded-full flex items-center justify-center transition-colors">
              <Home className="w-3 h-3 text-[#3AC4B6] group-hover:text-white" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 group-hover:text-[#3AC4B6] uppercase tracking-widest">
              Setup Lingkungan & Sanitasi
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#3AC4B6] group-hover:translate-x-0.5 transition-all" />
          </Link>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
          <div className="bg-white p-8 md:p-10 rounded-[35px] border border-slate-100 shadow-sm space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Umur Bunda
                </label>
                <div className="relative group">
                  <input
                    {...register("age")}
                    type="number"
                    className={cn(
                      "w-full bg-slate-50 border-2 rounded-[22px] px-6 py-4.5 text-sm font-bold text-slate-700 transition-all outline-none",
                      errors.age
                        ? "border-rose-400"
                        : "border-transparent focus:border-[#3AC4B6]/20 focus:bg-white",
                    )}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">
                    Tahun
                  </span>
                </div>
                {errors.age && (
                  <p className="text-[10px] text-rose-500 font-bold ml-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {errors.age.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Ruler className="w-3 h-3" /> Tinggi Badan
                </label>
                <div className="relative group">
                  <input
                    {...register("heightCm")}
                    type="number"
                    step="0.1"
                    className={cn(
                      "w-full bg-slate-50 border-2 rounded-[22px] px-6 py-4.5 text-sm font-bold text-slate-700 transition-all outline-none",
                      errors.heightCm
                        ? "border-rose-400"
                        : "border-transparent focus:border-[#3AC4B6]/20 focus:bg-white",
                    )}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">
                    cm
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Activity className="w-3 h-3" /> LILA (Lingkar Lengan)
                </label>
                <div className="relative group">
                  <input
                    {...register("lilaCm")}
                    type="number"
                    step="0.1"
                    className={cn(
                      "w-full bg-slate-50 border-2 rounded-[22px] px-6 py-4.5 text-sm font-bold text-slate-700 transition-all outline-none",
                      errors.lilaCm
                        ? "border-rose-400"
                        : "border-transparent focus:border-[#3AC4B6]/20 focus:bg-white",
                    )}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">
                    cm
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Scale className="w-3 h-3" /> Berat Badan
                </label>
                <div className="relative group">
                  <input
                    {...register("weightKg")}
                    type="number"
                    step="0.1"
                    className={cn(
                      "w-full bg-slate-50 border-2 rounded-[22px] px-6 py-4.5 text-sm font-bold text-slate-700 transition-all outline-none",
                      errors.weightKg
                        ? "border-rose-400"
                        : "border-transparent focus:border-[#3AC4B6]/20 focus:bg-white",
                    )}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">
                    kg
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
              <div className="p-6 bg-[#F8FAFC] rounded-[25px] flex items-center justify-between border border-slate-50">
                <div className="flex items-center gap-4">
                  <div
                    className={cn(
                      "w-11 h-11 rounded-2xl flex items-center justify-center transition-colors",
                      isPregnant
                        ? "bg-pink-100 text-pink-500"
                        : "bg-slate-200 text-slate-500",
                    )}
                  >
                    <Baby className="w-5 h-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-700">
                    Status Hamil
                  </h4>
                </div>
                <input
                  type="checkbox"
                  {...register("isPregnant")}
                  className="w-14 h-7 bg-slate-300 rounded-full appearance-none checked:bg-pink-500 transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:w-5 after:h-5 after:rounded-full after:transition-all checked:after:left-8"
                />
              </div>

              <div
                className={cn(
                  "transition-all duration-500",
                  isPregnant
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4 pointer-events-none",
                )}
              >
                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-pink-500 uppercase tracking-widest ml-1">
                    Trimester Kehamilan
                  </label>
                  <select
                    {...register("trimester")}
                    className="w-full bg-pink-50/50 border-2 border-transparent focus:border-pink-200 rounded-[20px] px-6 py-4 text-sm font-bold text-slate-700 outline-none"
                  >
                    <option value={1}>Trimester 1</option>
                    <option value={2}>Trimester 2</option>
                    <option value={3}>Trimester 3</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 bg-[#F8FAFC] rounded-[25px] flex items-center justify-between border border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700">
                    Kepatuhan TTD
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium ">
                    Rutin konsumsi Tablet Tambah Darah
                  </p>
                </div>
              </div>
              <input
                type="checkbox"
                {...register("ttdCompliance")}
                className="w-14 h-7 bg-slate-300 rounded-full appearance-none checked:bg-[#3AC4B6] transition-all cursor-pointer relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:w-5 after:h-5 after:rounded-full after:transition-all checked:after:left-8"
              />
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full flex items-center justify-center gap-3 bg-[#3AC4B6] text-white py-5 rounded-[22px] font-bold hover:bg-[#2DA89B] transition-all disabled:opacity-50 shadow-lg shadow-teal-100/50"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Save className="w-5 h-5" />
              )}
              Simpan Data Antropometri
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="text-left">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  BMI / IMT
                </p>
                <div className="inline-block px-4 py-1.5 rounded-full bg-[#ECF7F6] text-[#3AC4B6] text-[10px] font-bold uppercase">
                  {Number(bmi) < 18.5
                    ? "Kurus"
                    : Number(bmi) < 25
                      ? "Normal"
                      : "Berlebih"}
                </div>
              </div>
              <h3 className="text-5xl font-black text-[#3AC4B6]">{bmi}</h3>
            </div>
            <div className="bg-[#ECF7F6] p-8 rounded-[35px] border border-teal-50 shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[11px] font-bold text-[#3AC4B6] uppercase tracking-widest mb-1">
                  Status LILA
                </p>
                <h3 className="text-4xl font-black text-[#3AC4B6]">
                  {watch("lilaCm") || 0} cm
                </h3>
              </div>
              <Activity className="w-12 h-12 text-[#3AC4B6] opacity-20" />
            </div>
          </div>
        </form>
      </div>
    </RoleGuard>
  );
}
