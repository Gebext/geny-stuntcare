"use client";

import { useMotherStore } from "@/store/useMotherStore";
import { useParams, useRouter } from "next/navigation";
import { RoleGuard } from "@/components/auth/RoleGuard";
import { useState, useMemo } from "react";
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
  RefreshCcw,
  CheckCircle2,
  Scale,
  Ruler,
  Calendar,
  Loader2,
  AlertCircle,
  Clock,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  useChildHistory,
  useAddActivity,
  ActivityType,
} from "@/hooks/child/useChildData";

const tabs: { id: ActivityType; label: string; icon: any }[] = [
  { id: "anthropometry", label: "Antropometri", icon: LineChart },
  { id: "immunization", label: "Imunisasi", icon: ShieldCheck },
  { id: "nutrition", label: "Nutrisi", icon: Utensils },
  { id: "health", label: "Kesehatan", icon: Activity },
];

export default function ChildDetailPage() {
  const { id } = useParams();
  const childId = id as string;
  const router = useRouter();
  const { childProfiles } = useMotherStore();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<ActivityType>("anthropometry");

  const {
    data: historyData,
    isLoading: isFetching,
    refetch,
  } = useChildHistory(childId, activeTab);
  const mutation = useAddActivity(childId, activeTab);
  const child = childProfiles?.find((c: any) => c.id === childId);

  const { register, handleSubmit, reset } = useForm();

  // --- LOGIC: DATA TERAKHIR vs DATA LAHIR ---
  const anthroStats = useMemo(() => {
    const stats = {
      latestWeight: null as number | null,
      latestHeight: null as number | null,
      lastUpdate: null as string | null,
    };

    // Cari data antropometri terbaru dari history (jika ada)
    if (
      activeTab === "anthropometry" &&
      Array.isArray(historyData) &&
      historyData.length > 0
    ) {
      const sorted = [...historyData].sort((a, b) => {
        const dateA = new Date(a.measurementDate || a.createdAt).getTime();
        const dateB = new Date(b.measurementDate || b.createdAt).getTime();
        return dateB - dateA;
      });

      const latest = sorted[0];
      stats.latestWeight = latest.weightKg || latest.weight;
      stats.latestHeight = latest.heightCm || latest.height;
      stats.lastUpdate = latest.measurementDate || latest.createdAt;
    }

    return stats;
  }, [historyData, activeTab]);

  // --- LOGIC: HITUNG UMUR ---
  const currentAge = useMemo(() => {
    if (!child?.birthDate) return "";
    const birth = new Date(child.birthDate);
    const now = new Date();
    let months =
      (now.getFullYear() - birth.getFullYear()) * 12 +
      (now.getMonth() - birth.getMonth());
    if (now.getDate() < birth.getDate()) months--;

    if (months < 12) {
      const tempBirth = new Date(birth);
      tempBirth.setMonth(tempBirth.getMonth() + months);
      const weeks = Math.floor(
        (now.getTime() - tempBirth.getTime()) / (1000 * 60 * 60 * 24 * 7),
      );
      return `${months} Bulan ${weeks} Minggu`;
    }
    return `${Math.floor(months / 12)} Tahun ${months % 12} Bulan`;
  }, [child?.birthDate]);

  const items = useMemo(
    () => (Array.isArray(historyData) ? historyData : []),
    [historyData],
  );

  const onSave = (values: any) => {
    const payload = { ...values };
    if (activeTab === "nutrition") {
      payload.frequencyPerDay = Number(payload.frequencyPerDay);
      payload.recordedAt = payload.recordedAt
        ? new Date(payload.recordedAt).toISOString()
        : new Date().toISOString();
    }
    mutation.mutate(payload, {
      onSuccess: () => {
        reset();
        toast({ title: "Berhasil! ✨", description: `Data disimpan.` });
      },
      onError: (err: any) => {
        toast({
          title: "Gagal",
          description: err?.response?.data?.message || "Error",
          variant: "destructive",
        });
      },
    });
  };

  if (!child) return <ProfileNotFound />;

  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-4 md:space-y-6 pb-10 px-4 md:px-0">
        {/* HEADER */}
        <div className="space-y-3 md:space-y-4">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-slate-400 hover:text-[#3AC4B6] text-[9px] md:text-[10px] font-black uppercase tracking-widest py-1"
          >
            <ArrowLeft className="w-3 h-3 md:w-3.5 md:h-3.5" /> Kembali
          </button>
          <header
            className={cn(
              "flex flex-col sm:flex-row items-center gap-3 md:gap-6 p-4 md:p-6 rounded-[25px] md:rounded-[35px] text-white shadow-xl relative overflow-hidden",
              child.gender === "L"
                ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-100"
                : "bg-gradient-to-br from-pink-500 to-pink-600 shadow-pink-100",
            )}
          >
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shrink-0 relative z-10">
              <Baby className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div className="text-center sm:text-left flex-1 relative z-10">
              <h1 className="text-base md:text-xl font-black uppercase truncate">
                {child.name}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 md:gap-2 mt-1.5 md:mt-2">
                <Badge
                  label={`Lahir: ${new Date(child.birthDate).toLocaleDateString("id-ID")}`}
                />
                <Badge
                  icon={<Clock className="w-2.5 h-2.5 md:w-3 md:h-3" />}
                  label={`Umur: ${currentAge}`}
                  className="bg-white/30"
                />
                <Badge
                  label={child.gender === "L" ? "Laki-laki" : "Perempuan"}
                />
              </div>
            </div>
          </header>
        </div>

        {/* KMS GRAPH & STATS */}
        <div className="bg-white rounded-[25px] md:rounded-[35px] p-4 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 md:gap-8">
            <div className="lg:w-1/3 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3AC4B6]/10 rounded-2xl flex items-center justify-center">
                  <LineChart className="w-5 h-5 text-[#3AC4B6]" />
                </div>
                <h2 className="font-black text-[10px] uppercase text-slate-700 tracking-widest">
                  Status Pertumbuhan
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {/* Baris Data Terakhir (Hanya muncul jika ada history) */}
                {anthroStats.latestWeight && (
                  <div className="grid grid-cols-2 gap-2">
                    <StatCard
                      label="Berat Sekarang"
                      value={anthroStats.latestWeight}
                      unit="kg"
                      icon={<Zap className="w-3 h-3" />}
                      variant="active"
                    />
                    <StatCard
                      label="Tinggi Sekarang"
                      value={anthroStats.latestHeight}
                      unit="cm"
                      icon={<Zap className="w-3 h-3" />}
                      variant="active"
                    />
                  </div>
                )}

                {/* Baris Data Lahir */}
                <div className="grid grid-cols-2 gap-2">
                  <StatCard
                    label="Berat Lahir"
                    value={child.birthWeight}
                    unit="kg"
                    icon={<Scale className="w-3 h-3" />}
                  />
                  <StatCard
                    label="Panjang Lahir"
                    value={child.birthLength}
                    unit="cm"
                    icon={<Ruler className="w-3 h-3" />}
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 min-h-[250px] relative bg-slate-50/30 rounded-[30px] p-4 border border-slate-50">
              <div className="absolute top-5 left-6 z-10">
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                  Kurva KMS Digital
                </p>
                <p className="text-[8px] text-slate-400 font-bold uppercase mt-0.5">
                  Tren Berat Badan (kg)
                </p>
              </div>
              <KMSChart data={activeTab === "anthropometry" ? items : []} />
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="bg-white p-2 rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto no-scrollbar gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  reset();
                }}
                className={cn(
                  "flex items-center justify-center gap-3 py-4 px-6 rounded-2xl transition-all shrink-0 flex-1 min-w-[140px]",
                  activeTab === tab.id
                    ? "bg-[#3AC4B6] text-white shadow-lg shadow-teal-100"
                    : "text-slate-400 hover:bg-slate-50",
                )}
              >
                <tab.icon className="w-5 h-5" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <form
            onSubmit={handleSubmit(onSave)}
            className="bg-white p-6 md:p-8 rounded-[35px] border border-slate-100 shadow-sm lg:sticky lg:top-8"
          >
            <h2 className="font-black text-slate-700 text-[10px] uppercase tracking-widest mb-6 flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#3AC4B6]" /> Tambah{" "}
              {tabs.find((t) => t.id === activeTab)?.label}
            </h2>
            <div className="space-y-4">
              {activeTab === "anthropometry" && (
                <AnthropometryFields register={register} />
              )}
              {activeTab === "immunization" && (
                <ImmunizationFields register={register} />
              )}
              {activeTab === "nutrition" && (
                <NutritionFields register={register} />
              )}
              {activeTab === "health" && <HealthFields register={register} />}
            </div>
            <button
              disabled={mutation.isPending}
              className="w-full mt-8 bg-[#3AC4B6] text-white py-5 rounded-2xl font-black text-[11px] tracking-widest shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}{" "}
              SIMPAN DATA
            </button>
          </form>

          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[35px] border border-slate-100 shadow-sm min-h-[400px]">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 mb-6">
              <h2 className="font-black text-slate-700 text-[10px] uppercase tracking-widest flex items-center gap-2">
                <History className="w-4 h-4 text-slate-300" /> Riwayat
              </h2>
              <button
                onClick={() => refetch()}
                className="text-[9px] font-black text-[#3AC4B6] flex items-center gap-1.5 bg-teal-50 px-3 py-1.5 rounded-full"
              >
                <RefreshCcw className="w-3 h-3" /> Refresh
              </button>
            </div>
            <div className="space-y-3">
              {isFetching ? (
                <div className="py-20 text-center animate-pulse text-slate-300 font-black text-[10px] uppercase">
                  Memuat...
                </div>
              ) : items.length > 0 ? (
                items.map((item: any) => (
                  <HistoryCard key={item.id} item={item} type={activeTab} />
                ))
              ) : (
                <div className="py-20 text-center opacity-20 flex flex-col items-center">
                  <History className="w-12 h-12 mb-2" />
                  <p className="text-[10px] font-black uppercase">Kosong</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}

// --- HELPERS ---

function StatCard({ label, value, unit, icon, variant = "default" }: any) {
  return (
    <div
      className={cn(
        "p-3 rounded-2xl border transition-all",
        variant === "active"
          ? "bg-teal-50 border-teal-100"
          : "bg-slate-50/50 border-transparent",
      )}
    >
      <span
        className={cn(
          "text-[7px] font-black uppercase tracking-widest flex items-center gap-1 mb-1",
          variant === "active" ? "text-[#3AC4B6]" : "text-slate-400",
        )}
      >
        {icon} {label}
      </span>
      <p className="text-sm font-black text-slate-700">
        {value}{" "}
        <span className="text-[9px] text-slate-400 font-bold">{unit}</span>
      </p>
    </div>
  );
}

function Badge({ label, icon, className }: any) {
  return (
    <span
      className={cn(
        "bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-1",
        className,
      )}
    >
      {icon} {label}
    </span>
  );
}

function HistoryCard({ item, type }: any) {
  let title = "-";
  let sub = "-";
  let icon = <CheckCircle2 className="w-4 h-4 text-[#3AC4B6]" />;
  if (type === "anthropometry") {
    title = `${item.weightKg ?? item.weight}kg • ${item.heightCm ?? item.height}cm`;
    sub = `Bulan ke-${item.ageMonth || 0}`;
    icon = <Scale className="w-4 h-4 text-[#3AC4B6]" />;
  } else if (type === "nutrition") {
    title = item.foodType;
    sub = `${item.frequencyPerDay}x • ${item.proteinSource}`;
    icon = <Utensils className="w-4 h-4 text-orange-400" />;
  } else if (type === "health") {
    title = item.diseaseName;
    sub = item.isChronic ? "🔴 Kronis" : "🟢 Ringan";
    icon = (
      <Activity
        className={cn(
          "w-4 h-4",
          item.isChronic ? "text-red-500" : "text-blue-500",
        )}
      />
    );
  } else {
    title = item.vaccineName;
    sub = "Imunisasi";
    icon = <ShieldCheck className="w-4 h-4 text-emerald-500" />;
  }
  const date =
    item.recordedAt ||
    item.diagnosisDate ||
    item.measurementDate ||
    item.dateGiven ||
    item.createdAt;
  return (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-teal-100 hover:bg-white transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <p className="text-xs font-black text-slate-700 uppercase">{title}</p>
          <p className="text-[9px] text-slate-400 font-bold uppercase">{sub}</p>
        </div>
      </div>
      <p className="text-[9px] font-black text-slate-300 uppercase">
        {date
          ? new Date(date).toLocaleDateString("id-ID", {
              day: "2-digit",
              month: "short",
            })
          : "-"}
      </p>
    </div>
  );
}

function InputField({ label, name, register, icon, ...props }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
        {label}
      </label>
      <div className="relative">
        <input
          {...register(name, { required: true })}
          {...props}
          className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-100 focus:bg-white rounded-2xl px-5 py-4 text-xs font-bold text-slate-700 outline-none transition-all"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-200">
          {icon}
        </div>
      </div>
    </div>
  );
}

// --- FIELD GROUPS ---
const AnthropometryFields = ({ register }: any) => (
  <>
    <InputField
      label="Berat (kg)"
      name="weightKg"
      register={register}
      type="number"
      step="0.01"
      icon={<Scale className="w-4 h-4" />}
    />
    <InputField
      label="Tinggi (cm)"
      name="heightCm"
      register={register}
      type="number"
      step="0.01"
      icon={<Ruler className="w-4 h-4" />}
    />
    <InputField
      label="Tanggal"
      name="measurementDate"
      register={register}
      type="date"
      defaultValue={new Date().toISOString().split("T")[0]}
      icon={<Calendar className="w-4 h-4" />}
    />
  </>
);
const ImmunizationFields = ({ register }: any) => (
  <>
    <InputField
      label="Vaksin"
      name="vaccineName"
      register={register}
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
);
const NutritionFields = ({ register }: any) => (
  <>
    <InputField
      label="Tanggal"
      name="recordedAt"
      register={register}
      type="date"
      defaultValue={new Date().toISOString().split("T")[0]}
      icon={<Calendar className="w-4 h-4" />}
    />
    <InputField
      label="Makanan"
      name="foodType"
      register={register}
      icon={<Utensils className="w-4 h-4" />}
    />
    <InputField
      label="Frekuensi"
      name="frequencyPerDay"
      register={register}
      type="number"
      icon={<Activity className="w-4 h-4" />}
    />
    <InputField label="Protein" name="proteinSource" register={register} />
  </>
);
const HealthFields = ({ register }: any) => (
  <>
    <InputField
      label="Gejala"
      name="diseaseName"
      register={register}
      icon={<AlertCircle className="w-4 h-4" />}
    />
    <InputField
      label="Tanggal"
      name="diagnosisDate"
      register={register}
      type="date"
      icon={<Calendar className="w-4 h-4" />}
    />
    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-transparent">
      <span className="text-[9px] font-black text-slate-400 uppercase">
        Kronis?
      </span>
      <input
        {...register("isChronic")}
        type="checkbox"
        className="w-5 h-5 accent-[#3AC4B6]"
      />
    </div>
  </>
);

function KMSChart({ data }: { data: any[] }) {
  const chartData = useMemo(
    () =>
      [...data]
        .sort((a, b) => (a.ageMonth || 0) - (b.ageMonth || 0))
        .map((i) => ({
          age: `${i.ageMonth || 0} bln`,
          weight: i.weightKg || i.weight,
        })),
    [data],
  );
  if (!chartData.length)
    return (
      <div className="h-full flex items-center justify-center text-[10px] font-black text-slate-300 uppercase px-6 text-center leading-relaxed">
        Input data antropometri untuk melihat kurva
      </div>
    );
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 45, right: 10, left: -25, bottom: 0 }}
      >
        <defs>
          <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3AC4B6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3AC4B6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke="#f1f5f9"
        />
        <XAxis
          dataKey="age"
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 8, fontWeight: 800, fill: "#94a3b8" }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 8, fontWeight: 800, fill: "#94a3b8" }}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "15px",
            border: "none",
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            padding: "8px 12px",
          }}
          itemStyle={{
            fontSize: "9px",
            fontWeight: 900,
            textTransform: "uppercase",
          }}
        />
        <Area
          type="monotone"
          dataKey="weight"
          stroke="#3AC4B6"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorWeight)"
          name="Berat"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function ProfileNotFound() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center p-4">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
        <Baby className="w-10 h-10 text-slate-200" />
      </div>
      <h2 className="text-lg font-black text-slate-800 uppercase">
        Profil Tidak Ditemukan
      </h2>
      <Link
        href="/dashboard/mother/child"
        className="mt-8 bg-[#3AC4B6] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase shadow-lg shadow-teal-50"
      >
        Kembali ke Daftar
      </Link>
    </div>
  );
}
