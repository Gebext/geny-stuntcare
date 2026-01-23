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

  const items = useMemo(
    () => (Array.isArray(historyData) ? historyData : []),
    [historyData],
  );

  const onSave = (values: any) => {
    // Logic tambahan untuk handle payload API yang ketat tanpa merubah desain
    const payload = { ...values };

    if (activeTab === "nutrition") {
      payload.frequencyPerDay = Number(payload.frequencyPerDay);
      // Memenuhi syarat API: recordedAt harus ISO String
      payload.recordedAt = payload.recordedAt
        ? new Date(payload.recordedAt).toISOString()
        : new Date().toISOString();
    }

    mutation.mutate(payload, {
      onSuccess: () => {
        reset();
        toast({
          title: "Berhasil! ✨",
          description: `Data ${tabs.find((t) => t.id === activeTab)?.label} berhasil disimpan.`,
        });
      },
      onError: (err: any) => {
        toast({
          title: "Gagal",
          description:
            err?.response?.data?.message || "Terjadi kesalahan input.",
          variant: "destructive",
        });
      },
    });
  };

  if (!child) return <ProfileNotFound />;

  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 pb-10 px-4 md:px-1">
        {/* HEADER SECTION */}
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-slate-400 hover:text-[#3AC4B6] text-[10px] font-black uppercase tracking-widest py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali
          </button>

          <header
            className={cn(
              "flex flex-col sm:flex-row items-center gap-4 md:gap-6 p-6 rounded-[30px] md:rounded-[35px] text-white shadow-xl transition-all",
              child.gender === "L"
                ? "bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-100"
                : "bg-gradient-to-br from-pink-500 to-pink-600 shadow-pink-100",
            )}
          >
            <div className="w-14 h-14 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30 shrink-0">
              <Baby className="w-7 h-7 md:w-8 md:h-8 text-white" />
            </div>
            <div className="text-center sm:text-left min-w-0 flex-1">
              <h1 className="text-lg md:text-xl font-black uppercase truncate">
                {child.name}
              </h1>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <Badge
                  label={`Lahir: ${new Date(child.birthDate).toLocaleDateString("id-ID")}`}
                />
                <Badge
                  label={child.gender === "L" ? "Laki-laki" : "Perempuan"}
                />
              </div>
            </div>
          </header>
        </div>

        {/* KMS GRAPH SECTION */}
        <div className="bg-white rounded-[30px] md:rounded-[35px] p-5 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
            <div className="lg:w-1/4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 md:w-10 md:h-10 bg-[#3AC4B6]/10 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0">
                  <LineChart className="w-4 h-4 md:w-5 md:h-5 text-[#3AC4B6]" />
                </div>
                <h2 className="font-black text-[9px] md:text-[10px] uppercase text-slate-700 tracking-widest">
                  Analisis Antropometri
                </h2>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                <StatCard
                  label="Berat Lahir"
                  value={child.birthWeight}
                  unit="kg"
                  icon={<Scale className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                />
                <StatCard
                  label="Panjang Lahir"
                  value={child.birthLength}
                  unit="cm"
                  icon={<Ruler className="w-3 h-3 md:w-3.5 md:h-3.5" />}
                />
              </div>
            </div>
            <div className="flex-1 min-h-[250px] md:min-h-[300px] relative bg-slate-50/30 rounded-[25px] md:rounded-[30px] p-2 md:p-4 border border-slate-50">
              <div className="absolute top-4 left-4 md:left-6 z-10">
                <p className="text-[9px] md:text-[10px] font-black text-slate-700 uppercase tracking-widest">
                  Kurva KMS Digital
                </p>
                <p className="text-[7px] md:text-[8px] text-slate-400 font-bold uppercase mt-1">
                  Tren Berat Badan (kg)
                </p>
              </div>
              <KMSChart data={activeTab === "anthropometry" ? items : []} />
            </div>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="bg-white p-2 rounded-[25px] md:rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex overflow-x-auto no-scrollbar gap-2 snap-x">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  reset();
                }}
                className={cn(
                  "flex items-center justify-center gap-3 py-4 px-6 rounded-[20px] md:rounded-2xl transition-all shrink-0 snap-start flex-1 min-w-[140px]",
                  activeTab === tab.id
                    ? "bg-[#3AC4B6] text-white shadow-lg shadow-teal-100"
                    : "text-slate-400 hover:bg-slate-50 hover:text-slate-600",
                )}
              >
                <tab.icon className="w-4 h-4 md:w-5 md:h-5 shrink-0" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <form
            onSubmit={handleSubmit(onSave)}
            className="bg-white p-6 md:p-8 rounded-[30px] md:rounded-[35px] border border-slate-100 shadow-sm lg:sticky lg:top-8"
          >
            <div className="flex items-center gap-3 border-b border-slate-50 pb-4 md:pb-5 mb-5 md:mb-6">
              <Plus className="w-4 h-4 text-[#3AC4B6]" />
              <h2 className="font-black text-slate-700 text-[9px] md:text-[10px] uppercase tracking-widest">
                Tambah {tabs.find((t) => t.id === activeTab)?.label}
              </h2>
            </div>

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
              className="w-full mt-6 md:mt-8 bg-[#3AC4B6] text-white py-4 md:py-5 rounded-[18px] md:rounded-2xl font-black text-[10px] md:text-[11px] tracking-widest shadow-lg shadow-teal-50 flex items-center justify-center gap-3 disabled:opacity-50 active:scale-[0.98] transition-all"
            >
              {mutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              SIMPAN DATA
            </button>
          </form>

          {/* HISTORY SECTION */}
          <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[30px] md:rounded-[35px] border border-slate-100 shadow-sm min-h-[300px] md:min-h-[400px]">
            <div className="flex items-center justify-between border-b border-slate-50 pb-4 md:pb-5 mb-5 md:mb-6">
              <div className="flex items-center gap-3">
                <History className="w-4 h-4 text-slate-300" />
                <h2 className="font-black text-slate-700 text-[9px] md:text-[10px] uppercase tracking-widest">
                  Riwayat {tabs.find((t) => t.id === activeTab)?.label}
                </h2>
              </div>
              <button
                onClick={() => refetch()}
                className="text-[8px] md:text-[9px] font-black text-[#3AC4B6] flex items-center gap-1.5 bg-teal-50 px-3 py-1.5 rounded-full hover:bg-teal-100 transition-colors"
              >
                <RefreshCcw className="w-3 h-3" /> Refresh
              </button>
            </div>

            <div className="space-y-3">
              {isFetching ? (
                <div className="py-20 text-center text-slate-300 font-black text-[9px] md:text-[10px] uppercase animate-pulse">
                  Memuat data...
                </div>
              ) : items.length > 0 ? (
                items.map((item: any) => (
                  <HistoryCard key={item.id} item={item} type={activeTab} />
                ))
              ) : (
                <div className="py-20 text-center opacity-20 flex flex-col items-center">
                  <History className="w-10 h-10 md:w-12 md:h-12 mb-2" />
                  <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">
                    Belum ada catatan
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

function KMSChart({ data }: { data: any[] }) {
  const chartData = useMemo(() => {
    if (!data.length) return [];
    return [...data]
      .sort((a, b) => (a.ageMonth || 0) - (b.ageMonth || 0))
      .map((i) => ({
        age: `${i.ageMonth || 0} bln`,
        weight: i.weightKg || i.weight,
      }));
  }, [data]);

  if (!chartData.length)
    return (
      <div className="h-full flex items-center justify-center text-[9px] md:text-[10px] font-black text-slate-300 uppercase px-6 text-center leading-relaxed">
        Input data antropometri untuk melihat grafik kurva pertumbuhan
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

function HistoryCard({ item, type }: { item: any; type: ActivityType }) {
  let title = "-";
  let sub = "-";
  let icon = (
    <CheckCircle2 className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#3AC4B6]" />
  );

  if (type === "nutrition") {
    title = item.foodType || "Nutrisi";
    sub = `${item.frequencyPerDay}x • ${item.proteinSource || "Protein -"}`;
    icon = <Utensils className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-400" />;
  } else if (type === "health") {
    title = item.diseaseName || "Keluhan";
    sub = item.isChronic ? "🔴 Kronis" : "🟢 Gejala Ringan";
    icon = (
      <Activity
        className={cn(
          "w-3.5 h-3.5 md:w-4 md:h-4",
          item.isChronic ? "text-red-500" : "text-blue-500",
        )}
      />
    );
  } else if (type === "anthropometry") {
    title = `${item.weightKg ?? item.weight}kg • ${item.heightCm ?? item.height}cm`;
    sub = `Bulan ke-${item.ageMonth || 0}`;
    icon = <Scale className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#3AC4B6]" />;
  } else {
    title = item.vaccineName || "Vaksin";
    sub = "Imunisasi Selesai";
    icon = (
      <ShieldCheck className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-500" />
    );
  }

  const date =
    item.recordedAt ||
    item.diagnosisDate ||
    item.measurementDate ||
    item.dateGiven ||
    item.createdAt;

  return (
    <div className="flex items-center justify-between p-3.5 md:p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-teal-100 hover:bg-white transition-all group">
      <div className="flex items-center gap-3 md:gap-4 overflow-hidden">
        <div className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div className="overflow-hidden">
          <p className="text-[11px] md:text-xs font-black text-slate-700 uppercase truncate">
            {title}
          </p>
          <p className="text-[8px] md:text-[9px] text-slate-400 font-bold uppercase mt-0.5">
            {sub}
          </p>
        </div>
      </div>
      <p className="text-[8px] md:text-[9px] font-black text-slate-300 uppercase ml-2 shrink-0">
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

function StatCard({ label, value, unit, icon }: any) {
  return (
    <div className="bg-[#F8FAFC] p-3.5 md:p-4 rounded-[18px] md:rounded-[20px] border border-slate-50">
      <span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
        {icon} {label}
      </span>
      <span className="text-base md:text-lg font-black text-slate-700">
        {value}{" "}
        <span className="text-[9px] md:text-[10px] text-slate-300 font-bold">
          {unit}
        </span>
      </span>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="bg-white/20 backdrop-blur-md px-2.5 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[8px] md:text-[9px] font-black uppercase tracking-widest border border-white/10 whitespace-nowrap">
      {label}
    </span>
  );
}

function InputField({ label, name, register, icon, ...props }: any) {
  return (
    <div className="space-y-1.5 md:space-y-2">
      <label className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          {...register(name, { required: true })}
          {...props}
          className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-100 focus:bg-white rounded-xl md:rounded-2xl px-4 md:px-5 py-3.5 md:py-4 text-[11px] md:text-xs font-bold text-slate-700 outline-none transition-all"
        />
        <div className="absolute right-4 md:right-5 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-[#3AC4B6] transition-colors">
          {icon}
        </div>
      </div>
    </div>
  );
}

function AnthropometryFields({ register }: any) {
  return (
    <div className="space-y-4">
      <InputField
        label="Berat Badan (kg)"
        name="weightKg"
        register={register}
        type="number"
        step="0.01"
        icon={<Scale className="w-4 h-4" />}
      />
      <InputField
        label="Tinggi / Panjang (cm)"
        name="heightCm"
        register={register}
        type="number"
        step="0.1"
        icon={<Ruler className="w-4 h-4" />}
      />
      <InputField
        label="Tanggal Pengukuran"
        name="measurementDate"
        register={register}
        type="date"
        defaultValue={new Date().toISOString().split("T")[0]}
        icon={<Calendar className="w-4 h-4" />}
      />
    </div>
  );
}

function ImmunizationFields({ register }: any) {
  return (
    <div className="space-y-4">
      <InputField
        label="Nama Vaksin"
        name="vaccineName"
        register={register}
        placeholder="Contoh: Polio, BCG"
        icon={<ShieldCheck className="w-4 h-4" />}
      />
      <InputField
        label="Tanggal Pemberian"
        name="dateGiven"
        register={register}
        type="date"
        icon={<Calendar className="w-4 h-4" />}
      />
    </div>
  );
}

function NutritionFields({ register }: any) {
  return (
    <div className="space-y-4">
      {/* Input Tanggal untuk recordedAt agar API tidak error */}
      <InputField
        label="Tanggal Pencatatan"
        name="recordedAt"
        register={register}
        type="date"
        defaultValue={new Date().toISOString().split("T")[0]}
        icon={<Calendar className="w-4 h-4" />}
      />
      <InputField
        label="Jenis Makanan"
        name="foodType"
        register={register}
        placeholder="Contoh: MPASI Bubur"
        icon={<Utensils className="w-4 h-4" />}
      />
      <InputField
        label="Frekuensi (kali/hari)"
        name="frequencyPerDay"
        register={register}
        type="number"
        icon={<Activity className="w-4 h-4" />}
      />
      <InputField
        label="Sumber Protein"
        name="proteinSource"
        register={register}
        placeholder="Contoh: Ikan, Ayam"
      />
    </div>
  );
}

function HealthFields({ register }: any) {
  return (
    <div className="space-y-4">
      <InputField
        label="Keluhan / Gejala"
        name="diseaseName"
        register={register}
        placeholder="Contoh: Demam"
        icon={<AlertCircle className="w-4 h-4" />}
      />
      <InputField
        label="Tanggal Diagnosis"
        name="diagnosisDate"
        register={register}
        type="date"
        icon={<Calendar className="w-4 h-4" />}
      />
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl md:rounded-2xl border-2 border-transparent focus-within:border-teal-100 transition-all">
        <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
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

function ProfileNotFound() {
  return (
    <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6 px-10">
      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
        <Baby className="w-10 h-10 text-slate-200" />
      </div>
      <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
        Profil Tidak Ditemukan
      </h2>
      <p className="text-slate-400 text-xs mt-2 max-w-xs">
        ID anak tidak valid atau data sudah dihapus.
      </p>
      <Link
        href="/dashboard/mother/child"
        className="mt-8 bg-[#3AC4B6] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-teal-50"
      >
        Kembali ke Daftar
      </Link>
    </div>
  );
}
