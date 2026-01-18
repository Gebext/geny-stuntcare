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
  Info,
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
  { id: "anthropometry", label: "Pertumbuhan", icon: LineChart },
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
    mutation.mutate(values, {
      onSuccess: () => {
        reset();
        toast({
          title: "Berhasil! ✨",
          description: `Data ${activeTab} ditambahkan.`,
        });
      },
      onError: (err: any) => {
        toast({
          title: "Gagal",
          description: err?.response?.data?.message || "Cek koneksi input.",
          variant: "destructive",
        });
      },
    });
  };

  if (!child) return <ProfileNotFound />;

  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-6 pb-10 px-1">
        {/* HEADER */}
        <div className="space-y-4">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-slate-400 hover:text-[#3AC4B6] text-[10px] font-black uppercase tracking-widest"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Kembali
          </button>

          <header
            className={cn(
              "flex flex-col md:flex-row items-center gap-6 p-6 rounded-[35px] text-white shadow-xl transition-all",
              child.gender === "L"
                ? "bg-gradient-to-br from-blue-500 to-blue-600"
                : "bg-gradient-to-br from-pink-500 to-pink-600",
            )}
          >
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/30">
              <Baby className="w-8 h-8 text-white" />
            </div>
            <div className="text-center md:text-left">
              <h1 className="text-xl font-black uppercase truncate">
                {child.name}
              </h1>
              <div className="flex gap-2 mt-2">
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
        <div className="bg-white rounded-[35px] p-6 md:p-8 border border-slate-100 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#3AC4B6]/10 rounded-2xl flex items-center justify-center">
                  <LineChart className="w-5 h-5 text-[#3AC4B6]" />
                </div>
                <h2 className="font-black text-[10px] uppercase text-slate-700 tracking-widest">
                  Analisis Pertumbuhan
                </h2>
              </div>
              <div className="grid grid-cols-1 gap-3">
                <StatCard
                  label="Berat Lahir"
                  value={child.birthWeight}
                  unit="kg"
                  icon={<Scale className="w-3.5 h-3.5" />}
                />
                <StatCard
                  label="Panjang Lahir"
                  value={child.birthLength}
                  unit="cm"
                  icon={<Ruler className="w-3.5 h-3.5" />}
                />
              </div>
            </div>
            <div className="flex-1 min-h-[300px] relative bg-slate-50/30 rounded-[30px] p-4 border border-slate-50">
              <div className="absolute top-4 left-6 z-10">
                <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                  Kurva KMS Digital
                </p>
                <p className="text-[8px] text-slate-400 font-bold uppercase mt-1">
                  Tren Berat Badan (kg)
                </p>
              </div>
              <KMSChart data={activeTab === "anthropometry" ? items : []} />
            </div>
          </div>
        </div>

        {/* TABS */}
        <div className="flex overflow-x-auto bg-white p-2 rounded-3xl border border-slate-100 shadow-sm gap-2 no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                reset();
              }}
              className={cn(
                "flex-1 min-w-[120px] flex items-center justify-center gap-2 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
                activeTab === tab.id
                  ? "bg-[#3AC4B6] text-white shadow-md"
                  : "text-slate-400 hover:bg-slate-50",
              )}
            >
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <form
            onSubmit={handleSubmit(onSave)}
            className="bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm lg:sticky lg:top-8"
          >
            <div className="flex items-center gap-3 border-b border-slate-50 pb-5 mb-6">
              <Plus className="w-4 h-4 text-[#3AC4B6]" />
              <h2 className="font-black text-slate-700 text-[10px] uppercase tracking-widest">
                Tambah {activeTab}
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
              className="w-full mt-8 bg-[#3AC4B6] text-white py-5 rounded-2xl font-black text-[11px] tracking-widest shadow-lg flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {mutation.isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              SIMPAN DATA
            </button>
          </form>

          <div className="lg:col-span-2 bg-white p-8 rounded-[35px] border border-slate-100 shadow-sm min-h-[400px]">
            <div className="flex items-center justify-between border-b border-slate-50 pb-5 mb-6">
              <div className="flex items-center gap-3">
                <History className="w-4 h-4 text-slate-300" />
                <h2 className="font-black text-slate-700 text-[10px] uppercase tracking-widest">
                  Riwayat Pencatatan
                </h2>
              </div>
              <button
                onClick={() => refetch()}
                className="text-[9px] font-black text-[#3AC4B6] flex items-center gap-1"
              >
                <RefreshCcw className="w-3 h-3" /> Refresh
              </button>
            </div>
            <div className="space-y-3">
              {isFetching ? (
                <div className="py-20 text-center text-slate-300 font-black text-[10px] uppercase animate-pulse">
                  Memuat...
                </div>
              ) : items.length > 0 ? (
                items.map((item: any) => (
                  <HistoryCard key={item.id} item={item} type={activeTab} />
                ))
              ) : (
                <div className="py-20 text-center opacity-20 flex flex-col items-center">
                  <History className="w-12 h-12 mb-2" />
                  <p className="text-[10px] font-black uppercase tracking-widest">
                    Kosong
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

// --- VISUALIZATION COMPONENT ---

function KMSChart({ data }: { data: any[] }) {
  const chartData = useMemo(() => {
    if (!data.length) return [];
    return [...data]
      .sort((a, b) => (a.ageMonth || 0) - (b.ageMonth || 0))
      .map((i) => ({
        age: `Bln ${i.ageMonth || 0}`,
        weight: i.weightKg || i.weight,
      }));
  }, [data]);

  if (!chartData.length)
    return (
      <div className="h-full flex items-center justify-center text-[10px] font-black text-slate-300 uppercase">
        Input data antropometri untuk melihat grafik
      </div>
    );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={chartData}
        margin={{ top: 40, right: 20, left: -20, bottom: 0 }}
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
          tick={{ fontSize: 9, fontWeight: 800, fill: "#94a3b8" }}
          dy={10}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fontSize: 9, fontWeight: 800, fill: "#94a3b8" }}
        />
        <Tooltip
          contentStyle={{
            borderRadius: "20px",
            border: "none",
            boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            padding: "12px",
          }}
          itemStyle={{
            fontSize: "10px",
            fontWeight: 900,
            textTransform: "uppercase",
          }}
        />
        <Area
          type="monotone"
          dataKey="weight"
          stroke="#3AC4B6"
          strokeWidth={4}
          fillOpacity={1}
          fill="url(#colorWeight)"
          name="Berat"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

// --- SUB-COMPONENTS ---

function HistoryCard({ item, type }: { item: any; type: ActivityType }) {
  let title = "-";
  let sub = "-";
  let icon = <CheckCircle2 className="w-4 h-4 text-[#3AC4B6]" />;

  if (type === "nutrition") {
    title = item.foodType || "Nutrisi";
    sub = `${item.frequencyPerDay}x • ${item.proteinSource || "Protein -"}`;
    icon = <Utensils className="w-4 h-4 text-orange-400" />;
  } else if (type === "health") {
    title = item.diseaseName || "Keluhan";
    sub = item.isChronic ? "🔴 Kronis" : "🟢 Gejala Ringan";
    icon = (
      <Activity
        className={cn(
          "w-4 h-4",
          item.isChronic ? "text-red-500" : "text-blue-500",
        )}
      />
    );
  } else if (type === "anthropometry") {
    title = `${item.weightKg ?? item.weight}kg • ${item.heightCm ?? item.height}cm`;
    sub = `Bulan ke-${item.ageMonth || 0}`;
  } else {
    title = item.vaccineName || "Vaksin";
    sub = "Selesai";
  }

  const date =
    item.recordedAt ||
    item.diagnosisDate ||
    item.measurementDate ||
    item.dateGiven ||
    item.createdAt;

  return (
    <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-teal-100 hover:bg-white transition-all">
      <div className="flex items-center gap-4 overflow-hidden">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm shrink-0">
          {icon}
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-black text-slate-700 uppercase truncate">
            {title}
          </p>
          <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">
            {sub}
          </p>
        </div>
      </div>
      <p className="text-[9px] font-black text-slate-300 uppercase ml-4">
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
    <div className="bg-[#F8FAFC] p-4 rounded-[20px] border border-slate-100">
      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5 mb-1">
        {icon} {label}
      </span>
      <span className="text-lg font-black text-slate-700">
        {value} <span className="text-[10px] text-slate-300">{unit}</span>
      </span>
    </div>
  );
}

function Badge({ label }: { label: string }) {
  return (
    <span className="bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10">
      {label}
    </span>
  );
}

function InputField({ label, name, register, icon, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">
        {label}
      </label>
      <div className="relative group">
        <input
          {...register(name, { required: true })}
          {...props}
          className="w-full bg-slate-50 border-2 border-transparent focus:border-teal-100 focus:bg-white rounded-2xl px-5 py-4 text-xs font-bold text-slate-700 outline-none transition-all"
        />
        <div className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-200 group-focus-within:text-[#3AC4B6] transition-colors">
          {icon}
        </div>
      </div>
    </div>
  );
}

// --- FORMS ---
function AnthropometryFields({ register }: any) {
  return (
    <div className="space-y-4">
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
        step="0.1"
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
        placeholder="Contoh: Polio"
        icon={<ShieldCheck className="w-4 h-4" />}
      />
      <InputField
        label="Tanggal"
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
      <InputField
        label="Jenis Makanan"
        name="foodType"
        register={register}
        placeholder="Bubur / Buah"
        icon={<Utensils className="w-4 h-4" />}
      />
      <InputField
        label="Frekuensi (x sehari)"
        name="frequencyPerDay"
        register={register}
        type="number"
        icon={<Activity className="w-4 h-4" />}
      />
      <InputField
        label="Sumber Protein"
        name="proteinSource"
        register={register}
        placeholder="Ikan, Telur..."
      />
    </div>
  );
}

function HealthFields({ register }: any) {
  return (
    <div className="space-y-4">
      <InputField
        label="Keluhan"
        name="diseaseName"
        register={register}
        placeholder="Demam / Batuk"
        icon={<AlertCircle className="w-4 h-4" />}
      />
      <InputField
        label="Tanggal Diagnosis"
        name="diagnosisDate"
        register={register}
        type="date"
        icon={<Calendar className="w-4 h-4" />}
      />
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border-2 border-transparent focus-within:border-teal-100 transition-all">
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
          Kronis?
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
    <div className="h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <Baby className="w-12 h-12 text-slate-200 mb-4" />
      <h2 className="text-lg font-black text-slate-800 uppercase tracking-tight">
        Profil Tidak Ditemukan
      </h2>
      <Link
        href="/dashboard/mother/child"
        className="mt-6 bg-[#3AC4B6] text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest"
      >
        Kembali ke Daftar
      </Link>
    </div>
  );
}
