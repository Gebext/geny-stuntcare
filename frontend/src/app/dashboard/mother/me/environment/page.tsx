"use client";

import { useMotherStore } from "@/store/useMotherStore";
import { useForm, SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  Home,
  Droplets,
  ShieldCheck,
  MapPin,
  Bike,
  Save,
  Loader2,
  ArrowLeft,
  AlertCircle,
  Activity,
  Info,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUpdateEnvironment } from "@/hooks/mother/useMotherData";
import Link from "next/link";

const envFormSchema = z.object({
  cleanWater: z.boolean(),
  sanitation: z.string().min(1, "Sanitasi wajib diisi"),
  distanceFaskesKm: z.coerce.number().min(0, "Jarak tidak boleh negatif"),
  transportation: z.string().min(1, "Transportasi wajib diisi"),
});

type EnvFormValues = z.infer<typeof envFormSchema>;

export default function MotherEnvironmentPage() {
  const profile = useMotherStore(
    (state: any) => state.profile || state.motherData,
  );
  const updateMutation = useUpdateEnvironment();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<EnvFormValues>({
    resolver: zodResolver(envFormSchema) as any,
    defaultValues: {
      cleanWater: true,
      sanitation: "Septic Tank",
      distanceFaskesKm: 0,
      transportation: "Motor",
    },
  });

  const currentCleanWater = watch("cleanWater");
  const currentDistance = watch("distanceFaskesKm");

  // Sync data
  useEffect(() => {
    if (profile?.environment) {
      reset({
        cleanWater: !!profile.environment.cleanWater,
        sanitation: profile.environment.sanitation || "Septic Tank",
        distanceFaskesKm: Number(profile.environment.distanceFaskesKm) || 0,
        transportation: profile.environment.transportation || "Motor",
      });
    }
  }, [profile, reset]);

  const onSubmit: SubmitHandler<EnvFormValues> = (data) => {
    updateMutation.mutate({
      motherId: profile?.id || "",
      ...data,
    });
  };

  // --- PEMBATAS ANTI-BLANK ---
  if (!profile) {
    return (
      <RoleGuard allowedRoles={["mother"]}>
        <div className="min-h-[80vh] flex items-center justify-center p-6 text-center">
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto border border-slate-100">
              <ClipboardList className="w-12 h-12 text-slate-300" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                Profil Belum Siap
              </h2>
              <p className="text-sm text-slate-400 mt-2 max-w-xs mx-auto">
                Bunda perlu mengakses menu <b>Profil Kesehatan</b> terlebih
                dahulu sebelum mengatur lingkungan.
              </p>
            </div>
            <Link
              href="/dashboard/mother/me"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#3AC4B6] text-white rounded-[22px] font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-teal-100 transition-transform active:scale-95"
            >
              Ke Profil Bunda
            </Link>
          </div>
        </div>
      </RoleGuard>
    );
  }

  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-4 md:space-y-8 pb-10 px-4 md:px-0">
        <div className="space-y-3 md:space-y-4">
          <Link
            href="/dashboard/mother/me"
            className="group flex items-center gap-2 text-slate-400 hover:text-[#3AC4B6] transition-colors text-[9px] md:text-[10px] font-bold uppercase tracking-[0.15em] md:tracking-[0.2em]"
          >
            <ArrowLeft className="w-3 h-3 md:w-3.5 md:h-3.5 group-hover:-translate-x-1 transition-transform" />{" "}
            Kembali ke Profil
          </Link>

          <header className="flex items-center gap-3 md:gap-5 bg-gradient-to-br from-[#3AC4B6] to-[#2DA89B] p-4 md:p-8 rounded-[35px] text-white shadow-lg shadow-teal-100/50">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-[22px] flex items-center justify-center border border-white/30">
              <Home className="w-6 h-6 md:w-8 md:h-8 fill-white" />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold tracking-tight text-white">
                Lingkungan Bunda
              </h1>
              <p className="text-teal-50/80 text-[10px] md:text-sm font-medium mt-0.5">
                Setup sanitasi & aksesibilitas hunian
              </p>
            </div>
          </header>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit as any)}
          className="space-y-4 md:space-y-8"
        >
          <div className="bg-white p-4 md:p-10 rounded-[35px] border border-slate-100 shadow-sm space-y-6 md:space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-4 md:gap-y-8">
              {/* Air Bersih */}
              <div className="space-y-3 md:space-y-4">
                <label className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5 md:gap-2">
                  <Droplets className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#3AC4B6]" />{" "}
                  Akses Air Bersih
                </label>
                <div className="flex gap-4">
                  {[
                    { label: "LAYAK & BERSIH", value: true },
                    { label: "TIDAK LAYAK", value: false },
                  ].map((option) => (
                    <button
                      key={option.label}
                      type="button"
                      onClick={() => setValue("cleanWater", option.value)}
                      className={cn(
                        "flex-1 py-3 md:py-4.5 rounded-[22px] border-2 font-bold text-[8px] md:text-[10px] tracking-wider transition-all",
                        currentCleanWater === option.value
                          ? "border-[#3AC4B6] bg-[#F0FDFA] text-[#3AC4B6] shadow-md shadow-teal-900/5"
                          : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jarak Faskes */}
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5 md:gap-2">
                  <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#3AC4B6]" />{" "}
                  Jarak ke Faskes
                </label>
                <div className="relative group">
                  <input
                    {...register("distanceFaskesKm")}
                    type="number"
                    step="0.1"
                    className={cn(
                      "w-full bg-slate-50 border-2 rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 transition-all outline-none",
                      errors.distanceFaskesKm
                        ? "border-rose-400"
                        : "border-transparent focus:border-[#3AC4B6]/20 focus:bg-white",
                    )}
                  />
                  <span className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-[7px] md:text-xs uppercase tracking-widest">
                    KM
                  </span>
                </div>
              </div>

              {/* Jenis Sanitasi */}
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5 md:gap-2">
                  <ShieldCheck className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#3AC4B6]" />{" "}
                  Jenis Sanitasi
                </label>
                <div className="relative">
                  <select
                    {...register("sanitation")}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#3AC4B6]/20 rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all cursor-pointer appearance-none"
                  >
                    <option value="Septic Tank">
                      Septic Tank (Leher Angsa)
                    </option>
                    <option value="Lubang Tanah">
                      Cemplung / Lubang Tanah
                    </option>
                    <option value="Saluran Terbuka">
                      Sungai / Saluran Terbuka
                    </option>
                  </select>
                  <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <Activity className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                </div>
              </div>

              {/* Transportasi */}
              <div className="space-y-1.5 md:space-y-2">
                <label className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5 md:gap-2">
                  <Bike className="w-3 h-3 md:w-3.5 md:h-3.5 text-[#3AC4B6]" />{" "}
                  Transportasi Utama
                </label>
                <div className="relative">
                  <select
                    {...register("transportation")}
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-[#3AC4B6]/20 rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all cursor-pointer appearance-none"
                  >
                    <option value="Motor">Sepeda Motor</option>
                    <option value="Mobil">Mobil Pribadi</option>
                    <option value="Angkutan Umum">Angkutan Umum</option>
                    <option value="Jalan Kaki">Jalan Kaki</option>
                  </select>
                  <div className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300">
                    <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 md:p-6 bg-[#F8FAFC] rounded-[25px] flex items-center gap-3 md:gap-5 border border-slate-50">
              <div className="w-9 h-9 md:w-11 md:h-11 bg-teal-50 text-[#3AC4B6] rounded-2xl flex items-center justify-center shrink-0">
                <Info className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <h4 className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-tight">
                  Validasi Lokasi
                </h4>
                <p className="text-[8px] md:text-[10px] text-slate-400 font-medium leading-relaxed">
                  Data ini membantu tim medis menganalisis faktor eksternal
                  risiko stunting si kecil.
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="w-full flex items-center justify-center gap-2 md:gap-3 bg-[#3AC4B6] text-white py-3 md:py-5 rounded-[22px] font-black uppercase tracking-[0.1em] md:tracking-widest text-[10px] md:text-[11px] hover:bg-[#2DA89B] transition-all disabled:opacity-50 shadow-lg shadow-teal-100"
            >
              {updateMutation.isPending ? (
                <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
              ) : (
                <Save className="w-4 h-4 md:w-5 md:h-5" />
              )}
              Simpan Data Lingkungan
            </button>
          </div>

          {/* STATUS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <div className="bg-white p-4 md:p-8 rounded-[35px] border border-slate-100 shadow-sm flex items-center justify-between group">
              <div>
                <p className="text-[9px] md:text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Status Air
                </p>
                <div
                  className={cn(
                    "inline-block px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-tighter",
                    currentCleanWater
                      ? "bg-emerald-50 text-[#3AC4B6]"
                      : "bg-rose-50 text-rose-500",
                  )}
                >
                  {currentCleanWater ? "Sangat Layak" : "Perlu Filter"}
                </div>
              </div>
              <Droplets
                className={cn(
                  "w-10 h-10 md:w-12 md:h-12 transition-transform group-hover:scale-110 duration-500",
                  currentCleanWater
                    ? "text-[#3AC4B6] opacity-20"
                    : "text-rose-500 opacity-20",
                )}
              />
            </div>

            <div className="bg-[#ECF7F6] p-4 md:p-8 rounded-[35px] border border-teal-50 shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[9px] md:text-[11px] font-bold text-[#3AC4B6] uppercase tracking-widest mb-1">
                  Akses Faskes
                </p>
                <h3 className="text-3xl md:text-4xl font-black text-[#3AC4B6]">
                  {currentDistance || 0}{" "}
                  <span className="text-base md:text-lg">KM</span>
                </h3>
              </div>
              <Activity className="w-10 h-10 md:w-12 md:h-12 text-[#3AC4B6] opacity-10 absolute right-6 md:right-8 group-hover:rotate-12 transition-transform duration-500" />
            </div>
          </div>
        </form>
      </div>
    </RoleGuard>
  );
}
