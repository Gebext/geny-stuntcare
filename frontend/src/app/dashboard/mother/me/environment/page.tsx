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
    (state: any) => state.profile || state.motherData
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

  if (!profile) return null;

  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-8 pb-10">
        {/* HEADER SECTION - Sama dengan Mother Me */}
        <div className="space-y-4">
          <Link
            href="/dashboard/mother/me"
            className="flex items-center gap-2 text-slate-400 hover:text-[#3AC4B6] transition-colors text-[10px] font-bold uppercase tracking-[0.2em] ml-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke Profil
          </Link>
          <header className="flex items-center gap-5 bg-gradient-to-br from-[#3AC4B6] to-[#2DA89B] p-8 rounded-[35px] text-white shadow-lg shadow-teal-100/50">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-[22px] flex items-center justify-center border border-white/30">
              <Home className="w-8 h-8 fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Lingkungan Bunda
              </h1>
              <p className="text-teal-50/80 text-sm font-medium mt-1">
                Setup sanitasi & aksesibilitas hunian
              </p>
            </div>
          </header>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-8">
          <div className="bg-white p-8 md:p-10 rounded-[35px] border border-slate-100 shadow-sm space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
              {/* Air Bersih - Radio Style like Status Hamil */}
              <div className="space-y-4">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Droplets className="w-3.5 h-3.5 text-[#3AC4B6]" /> Akses Air
                  Bersih
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
                        "flex-1 py-4.5 rounded-[22px] border-2 font-bold text-[10px] tracking-wider transition-all",
                        currentCleanWater === option.value
                          ? "border-[#3AC4B6] bg-[#F0FDFA] text-[#3AC4B6] shadow-sm"
                          : "border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Jarak Faskes - Input with Unit */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#3AC4B6]" />{" "}
                  <span>Jarak ke Faskes</span>
                </label>
                <div className="relative group">
                  <input
                    {...register("distanceFaskesKm")}
                    type="number"
                    step="0.1"
                    className={cn(
                      "w-full bg-slate-50 border-2 rounded-[22px] px-6 py-4.5 text-sm font-bold text-slate-700 transition-all outline-none",
                      errors.distanceFaskesKm
                        ? "border-rose-400"
                        : "border-transparent focus:border-[#3AC4B6]/20 focus:bg-white"
                    )}
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 font-bold text-xs">
                    KM
                  </span>
                </div>
                {errors.distanceFaskesKm && (
                  <p className="text-[10px] text-rose-500 font-bold ml-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />{" "}
                    {errors.distanceFaskesKm.message}
                  </p>
                )}
              </div>

              {/* Jenis Sanitasi - Select Style */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#3AC4B6]" /> Jenis
                  Sanitasi
                </label>
                <select
                  {...register("sanitation")}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#3AC4B6]/20 rounded-[22px] px-6 py-4.5 text-sm font-bold text-slate-700 outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="Septic Tank">Septic Tank (Leher Angsa)</option>
                  <option value="Lubang Tanah">Cemplung / Lubang Tanah</option>
                  <option value="Saluran Terbuka">
                    Sungai / Saluran Terbuka
                  </option>
                </select>
              </div>

              {/* Transportasi - Select Style */}
              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                  <Bike className="w-3.5 h-3.5 text-[#3AC4B6]" /> Transportasi
                  Utama
                </label>
                <select
                  {...register("transportation")}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#3AC4B6]/20 rounded-[22px] px-6 py-4.5 text-sm font-bold text-slate-700 outline-none transition-all cursor-pointer appearance-none"
                >
                  <option value="Motor">Sepeda Motor</option>
                  <option value="Mobil">Mobil Pribadi</option>
                  <option value="Angkutan Umum">Angkutan Umum</option>
                  <option value="Jalan Kaki">Jalan Kaki</option>
                </select>
              </div>
            </div>

            {/* TTD Compliance Style Info Box */}
            <div className="p-6 bg-[#F8FAFC] rounded-[25px] flex items-center justify-between border border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-teal-50 text-[#3AC4B6] rounded-2xl flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-700">
                    Validasi Lokasi
                  </h4>
                  <p className="text-[11px] text-slate-400 font-medium italic">
                    Data ini digunakan untuk analisis aksesibilitas kesehatan
                  </p>
                </div>
              </div>
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
              SIMPAN DATA LINGKUNGAN
            </button>
          </div>

          {/* BOTTOM STATUS CARDS - Sama dengan BMI & LILA */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm flex items-center justify-between">
              <div className="text-left">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Status Air
                </p>
                <div
                  className={cn(
                    "inline-block px-4 py-1.5 rounded-full text-[10px] font-bold uppercase",
                    currentCleanWater
                      ? "bg-[#ECF7F6] text-[#3AC4B6]"
                      : "bg-rose-50 text-rose-500"
                  )}
                >
                  {currentCleanWater ? "Layak Konsumsi" : "Tidak Layak"}
                </div>
              </div>
              <Droplets
                className={cn(
                  "w-12 h-12 opacity-20",
                  currentCleanWater ? "text-[#3AC4B6]" : "text-rose-500"
                )}
              />
            </div>

            <div className="bg-[#ECF7F6] p-8 rounded-[35px] border border-teal-50 shadow-sm flex items-center justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[11px] font-bold text-[#3AC4B6] uppercase tracking-widest mb-1">
                  Akses Faskes
                </p>
                <h3 className="text-4xl font-black text-[#3AC4B6]">
                  {currentDistance || 0} KM
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
