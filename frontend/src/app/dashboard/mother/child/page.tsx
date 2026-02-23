"use client";

import { useMotherStore } from "@/store/useMotherStore";
import { useAddChild, useEditChild } from "@/hooks/mother/useMotherData";
import { useForm } from "react-hook-form";
import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  Baby,
  Scale,
  Ruler,
  Heart,
  Plus,
  Loader2,
  AlertCircle,
  User,
  ChevronRight,
  Save,
  Edit2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";

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
  birthHeadCircumference: z.coerce
    .number()
    .min(20, "Minimal 20 cm")
    .max(60, "Maksimal 60 cm")
    .optional()
    .or(z.literal("")),
  birthArmCircumference: z.coerce
    .number()
    .min(5, "Minimal 5 cm")
    .max(40, "Maksimal 40 cm")
    .optional()
    .or(z.literal("")),
  asiExclusive: z.boolean().default(false),
});

type ChildFormValues = z.infer<typeof childSchema>;

export default function MotherChildrenPage() {
  const { childProfiles } = useMotherStore();
  const addChildMutation = useAddChild();
  const editChildMutation = useEditChild();
  const [editingChild, setEditingChild] = useState<any>(null);

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

  const {
    register: editRegister,
    handleSubmit: handleEditSubmit,
    reset: editReset,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm<ChildFormValues>({
    resolver: zodResolver(childSchema) as any,
  });

  const birthDateValue = watch("birthDate");

  const handleOnSubmit = (values: ChildFormValues) => {
    const payload = {
      ...values,
      birthDate: new Date(values.birthDate).toISOString(),
      asiExclusive: values.asiExclusive,
      birthHeadCircumference: values.birthHeadCircumference
        ? Number(values.birthHeadCircumference)
        : undefined,
      birthArmCircumference: values.birthArmCircumference
        ? Number(values.birthArmCircumference)
        : undefined,
    };

    addChildMutation.mutate(payload, {
      onSuccess: () => {
        reset();
      },
    });
  };

  const handleEditChild = (child: any) => {
    setEditingChild(child);
    setEditValue("name", child.name);
    setEditValue("gender", child.gender);
    setEditValue("birthDate", child.birthDate.split("T")[0]);
    setEditValue("birthWeight", child.birthWeight);
    setEditValue("birthLength", child.birthLength);
    setEditValue("birthHeadCircumference", child.birthHeadCircumference || "");
    setEditValue("birthArmCircumference", child.birthArmCircumference || "");
    setEditValue("asiExclusive", child.asiExclusive);
  };

  const onEditFormSubmit = (values: ChildFormValues) => {
    if (!editingChild) return;

    const payload = {
      childId: editingChild.id,
      ...values,
      birthDate: new Date(values.birthDate).toISOString(),
      asiExclusive: values.asiExclusive,
      birthHeadCircumference: values.birthHeadCircumference
        ? Number(values.birthHeadCircumference)
        : undefined,
      birthArmCircumference: values.birthArmCircumference
        ? Number(values.birthArmCircumference)
        : undefined,
    };

    editChildMutation.mutate(payload, {
      onSuccess: () => {
        setEditingChild(null);
        editReset();
      },
    });
  };

  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 space-y-4 md:space-y-8 pb-10 px-4 md:px-0">
        {/* Header - Gradient Teal */}
        <header className="flex items-center gap-3 md:gap-5 bg-gradient-to-br from-[#3AC4B6] to-[#2DA89B] p-4 md:p-8 rounded-[30px] md:rounded-[35px] text-white shadow-lg shadow-teal-100/50">
          <div className="shrink-0 w-10 h-10 md:w-16 md:h-16 bg-white/20 backdrop-blur-md rounded-[18px] md:rounded-[22px] flex items-center justify-center border border-white/30">
            <Baby className="w-5 h-5 md:w-8 md:h-8 text-white" />
          </div>
          <div>
            <h1 className="text-lg md:text-2xl font-bold tracking-tight uppercase">
              Daftar Buah Hati
            </h1>
            <p className="text-teal-50/80 text-[10px] md:text-sm font-medium mt-0.5">
              Registrasi dan pantau tumbuh kembang si kecil.
            </p>
          </div>
        </header>

        {/* FORM SECTION */}
        <div className="bg-white p-4 md:p-10 rounded-[30px] md:rounded-[35px] border border-slate-100 shadow-sm space-y-4 md:space-y-8">
          <div className="flex items-center gap-2.5 border-b border-slate-50 pb-3 md:pb-6">
            <div className="w-7 h-7 md:w-10 md:h-10 bg-teal-50 text-[#3AC4B6] rounded-lg md:rounded-xl flex items-center justify-center">
              <Plus className="w-4 h-4 md:w-6 md:h-6" />
            </div>
            <h2 className="font-black text-slate-700 text-sm md:text-lg uppercase tracking-tight">
              Tambah Anak Baru
            </h2>
          </div>

          <form
            onSubmit={handleSubmit(handleOnSubmit)}
            className="space-y-4 md:space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 md:gap-y-6">
              {/* Nama Lengkap */}
              <div className="space-y-1.5">
                <label className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nama Lengkap
                </label>
                <input
                  {...register("name")}
                  placeholder="Contoh: Budi Santoso"
                  className={cn(
                    "w-full bg-slate-50 border-2 rounded-[18px] md:rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all",
                    errors.name
                      ? "border-rose-400 bg-rose-50/30"
                      : "border-transparent focus:border-[#3AC4B6]/20 focus:bg-white",
                  )}
                />
                {errors.name && (
                  <p className="text-[10px] text-rose-500 font-black ml-2 flex items-center gap-1 animate-in slide-in-from-top-1">
                    <AlertCircle className="w-3 h-3" /> {errors.name.message}
                  </p>
                )}
              </div>

              {/* Tanggal Lahir */}
              <div className="space-y-1.5 ">
                <label className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Tanggal Lahir
                </label>
                <input
                  {...register("birthDate")}
                  type="date"
                  className={cn(
                    "w-full bg-slate-50 border-2 rounded-[18px] md:rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all",
                    errors.birthDate
                      ? "border-rose-400 bg-rose-50/30"
                      : "border-transparent focus:border-[#3AC4B6]/20 focus:bg-white",
                  )}
                />
                {errors.birthDate && (
                  <p className="text-[10px] text-rose-500 font-black ml-2 flex items-center gap-1 animate-in slide-in-from-top-1">
                    <AlertCircle className="w-3 h-3" />{" "}
                    {errors.birthDate.message}
                  </p>
                )}
              </div>

              {/* ASI & Gender */}
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    ASI Eksklusif
                  </label>
                  <div className="h-[48px] md:h-[62px] bg-slate-50 rounded-[18px] md:rounded-[22px] flex items-center justify-between px-3 md:px-6 border-2 border-transparent">
                    <Heart
                      className={cn(
                        "w-4 h-4 md:w-5 md:h-5 transition-all",
                        watch("asiExclusive")
                          ? "text-rose-500 fill-rose-500 scale-110"
                          : "text-slate-300",
                      )}
                    />
                    <input
                      type="checkbox"
                      {...register("asiExclusive")}
                      className={cn(
                        "w-9 md:w-11 h-5 md:h-6 bg-slate-300 rounded-full appearance-none checked:bg-[#3AC4B6] transition-all relative after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:w-3 md:after:w-4 after:h-3 md:after:h-4 after:rounded-full after:transition-all checked:after:left-5 md:checked:after:left-6 shadow-inner",
                        "cursor-pointer",
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Jenis Kelamin
                  </label>
                  <select
                    {...register("gender")}
                    className={cn(
                      "w-full h-[48px] md:h-[62px] bg-slate-50 border-2 rounded-[18px] md:rounded-[22px] px-3 md:px-6 text-xs md:text-sm font-bold text-slate-700 outline-none cursor-pointer appearance-none transition-all",
                      errors.gender
                        ? "border-rose-400 bg-rose-50/30"
                        : "border-transparent focus:border-[#3AC4B6]/20",
                    )}
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                  {errors.gender && (
                    <p className="text-[10px] text-rose-500 font-black ml-2 mt-1 flex items-center gap-1 animate-in slide-in-from-top-1">
                      <AlertCircle className="w-3 h-3" />{" "}
                      {errors.gender.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Berat & Panjang */}
              <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Scale className="w-2.5 h-2.5 md:w-3 md:h-3" /> Berat (kg)
                  </label>
                  <div className="relative">
                    <input
                      {...register("birthWeight")}
                      type="number"
                      step="0.01"
                      className={cn(
                        "w-full bg-slate-50 border-2 rounded-[18px] md:rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all",
                        errors.birthWeight
                          ? "border-rose-400 bg-rose-50/30"
                          : "border-transparent focus:border-[#3AC4B6]/20",
                      )}
                    />
                    <span className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-[8px] md:text-xs">
                      kg
                    </span>
                  </div>
                  {errors.birthWeight && (
                    <p className="text-[10px] text-rose-500 font-black ml-2 flex items-center gap-1 animate-in slide-in-from-top-1">
                      <AlertCircle className="w-3 h-3" />{" "}
                      {errors.birthWeight.message}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Ruler className="w-2.5 h-2.5 md:w-3 md:h-3" /> Panjang (cm)
                  </label>
                  <div className="relative">
                    <input
                      {...register("birthLength")}
                      type="number"
                      step="0.01"
                      className={cn(
                        "w-full bg-slate-50 border-2 rounded-[18px] md:rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all",
                        errors.birthLength
                          ? "border-rose-400 bg-rose-50/30"
                          : "border-transparent focus:border-[#3AC4B6]/20",
                      )}
                    />
                    <span className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-[8px] md:text-xs">
                      cm
                    </span>
                  </div>
                  {errors.birthLength && (
                    <p className="text-[10px] text-rose-500 font-black ml-2 flex items-center gap-1 animate-in slide-in-from-top-1">
                      <AlertCircle className="w-3 h-3" />{" "}
                      {errors.birthLength.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Lingkar Kepala & Lingkar Lengan */}
           
            </div>
               <div className="grid grid-cols-2 gap-2 md:gap-4">
                <div className="space-y-1.5">
                  <label className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Baby className="w-2.5 h-2.5 md:w-3 md:h-3" /> L. Kepala (cm)
                  </label>
                  <div className="relative">
                    <input
                      {...register("birthHeadCircumference")}
                      type="number"
                      step="0.01"
                      placeholder="Opsional"
                      className={cn(
                        "w-full bg-slate-50 border-2 rounded-[18px] md:rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all",
                        "border-transparent focus:border-[#3AC4B6]/20",
                      )}
                    />
                    <span className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-[8px] md:text-xs">
                      cm
                    </span>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                    <Baby className="w-2.5 h-2.5 md:w-3 md:h-3" /> L. Lengan (cm)
                  </label>
                  <div className="relative">
                    <input
                      {...register("birthArmCircumference")}
                      type="number"
                      step="0.01"
                      placeholder="Opsional"
                      className={cn(
                        "w-full bg-slate-50 border-2 rounded-[18px] md:rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all",
                        "border-transparent focus:border-[#3AC4B6]/20",
                      )}
                    />
                    <span className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-[8px] md:text-xs">
                      cm
                    </span>
                  </div>
                </div>
              </div>

            <button
              type="submit"
              disabled={addChildMutation.isPending}
              className="w-full bg-[#3AC4B6] text-white py-3 md:py-5 rounded-[18px] md:rounded-[22px] font-black uppercase tracking-[0.1em] md:tracking-[0.2em] hover:bg-[#2DA89B] shadow-lg shadow-teal-100 transition-all flex items-center justify-center gap-2 md:gap-3 active:scale-[0.98] disabled:opacity-50 text-[10px] md:text-xs"
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

        {/* BOTTOM LIST SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="bg-[#ECF7F6] p-4 md:p-8 rounded-[30px] md:rounded-[35px] border border-teal-50 flex flex-row lg:flex-col items-center justify-between lg:justify-center text-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-2xl flex items-center justify-center text-[#3AC4B6] shadow-sm shrink-0">
              <Baby className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <p className="text-[9px] md:text-[11px] font-black text-[#3AC4B6] uppercase tracking-widest">
              Total Terdaftar:{" "}
              <span className="text-lg md:text-3xl ml-1 md:ml-2">
                {childProfiles?.length || 0}
              </span>
            </p>
          </div>

          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            {childProfiles?.length === 0 ? (
              <div className="col-span-full bg-slate-50 rounded-[25px] flex items-center justify-center border-2 border-dashed border-slate-200 text-slate-400 font-black uppercase text-[9px] md:text-[10px] tracking-widest p-8 md:p-10">
                Belum ada data anak
              </div>
            ) : (
              childProfiles.map((child: any) => (
                <div
                  key={child.id}
                  className="bg-white p-4 md:p-6 rounded-[25px] md:rounded-[30px] border border-slate-100 shadow-sm flex items-center justify-between group hover:border-[#3AC4B6]/30 transition-all"
                >
                  <Link
                    href={`/dashboard/mother/child/${child.id}`}
                    className="flex items-center gap-3 md:gap-4 truncate flex-1 active:scale-[0.98]"
                  >
                    <div
                      className={cn(
                        "shrink-0 w-9 h-9 md:w-10 md:h-10 rounded-xl flex items-center justify-center",
                        child.gender === "L"
                          ? "bg-blue-50 text-blue-500"
                          : "bg-pink-50 text-pink-500",
                      )}
                    >
                      <User className="w-5 h-5" />
                    </div>
                    <div className="truncate">
                      <h4 className="font-black text-slate-700 text-sm uppercase truncate">
                        {child.name}
                      </h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                        {child.gender === "L" ? "Laki-laki" : "Perempuan"}
                      </p>
                    </div>
                  </Link>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleEditChild(child)}
                      className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 transition-all active:scale-95"
                      title="Edit data anak"
                    >
                      <Edit2 className="w-4 h-4 md:w-5 md:h-5" />
                    </button>
                    <ChevronRight className="shrink-0 w-5 h-5 text-slate-300 group-hover:text-[#3AC4B6] group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* MODAL EDIT ANAK */}
        {editingChild && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end md:items-center justify-center p-4">
            <div className="bg-white w-full max-w-lg rounded-t-[30px] md:rounded-[35px] shadow-2xl animate-in slide-in-from-bottom-4 md:fade-in md:slide-in-from-center duration-300 max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white flex items-center justify-between p-4 md:p-6 border-b border-slate-100 rounded-t-[30px] md:rounded-t-[35px]">
                <h2 className="font-black text-slate-700 text-sm md:text-lg uppercase tracking-wide">
                  <Edit2 className="w-4 h-4 md:w-5 md:h-5 inline-block mr-2" />
                  Edit Data {editingChild.name}
                </h2>
                <button
                  onClick={() => {
                    setEditingChild(null);
                    editReset();
                  }}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form
                onSubmit={handleEditSubmit(onEditFormSubmit)}
                className="p-4 md:p-6 space-y-4 md:space-y-6"
              >
                {/* Nama */}
                <div className="space-y-1.5">
                  <label className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                    Nama Lengkap
                  </label>
                  <input
                    {...editRegister("name")}
                    placeholder="Contoh: Budi Santoso"
                    className={cn(
                      "w-full bg-slate-50 border-2 rounded-[18px] md:rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all",
                      editErrors.name
                        ? "border-rose-400 bg-rose-50/30"
                        : "border-transparent focus:border-[#3AC4B6]/20",
                    )}
                  />
                  {editErrors.name && (
                    <p className="text-[10px] text-rose-500 font-black ml-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />{" "}
                      {editErrors.name.message}
                    </p>
                  )}
                </div>

                {/* Tanggal & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 md:gap-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Tanggal Lahir
                    </label>
                    <input
                      {...editRegister("birthDate")}
                      type="date"
                      className={cn(
                        "w-full bg-slate-50 border-2 rounded-[18px] md:rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all",
                        editErrors.birthDate
                          ? "border-rose-400 bg-rose-50/30"
                          : "border-transparent focus:border-[#3AC4B6]/20",
                      )}
                    />
                    {editErrors.birthDate && (
                      <p className="text-[10px] text-rose-500 font-black ml-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {editErrors.birthDate.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                      Jenis Kelamin
                    </label>
                    <select
                      {...editRegister("gender")}
                      className={cn(
                        "w-full bg-slate-50 border-2 rounded-[18px] md:rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all",
                        editErrors.gender
                          ? "border-rose-400 bg-rose-50/30"
                          : "border-transparent focus:border-[#3AC4B6]/20",
                      )}
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                    {editErrors.gender && (
                      <p className="text-[10px] text-rose-500 font-black ml-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {editErrors.gender.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Berat & Panjang */}
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Scale className="w-2.5 h-2.5 md:w-3 md:h-3" /> Berat (kg)
                    </label>
                    <div className="relative">
                      <input
                        {...editRegister("birthWeight")}
                        type="number"
                        step="0.01"
                        className={cn(
                          "w-full bg-slate-50 border-2 rounded-[18px] md:rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all",
                          editErrors.birthWeight
                            ? "border-rose-400 bg-rose-50/30"
                            : "border-transparent focus:border-[#3AC4B6]/20",
                        )}
                      />
                      <span className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-[8px] md:text-xs">
                        kg
                      </span>
                    </div>
                    {editErrors.birthWeight && (
                      <p className="text-[10px] text-rose-500 font-black ml-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {editErrors.birthWeight.message}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Ruler className="w-2.5 h-2.5 md:w-3 md:h-3" /> Panjang
                      (cm)
                    </label>
                    <div className="relative">
                      <input
                        {...editRegister("birthLength")}
                        type="number"
                        step="0.01"
                        className={cn(
                          "w-full bg-slate-50 border-2 rounded-[18px] md:rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all",
                          editErrors.birthLength
                            ? "border-rose-400 bg-rose-50/30"
                            : "border-transparent focus:border-[#3AC4B6]/20",
                        )}
                      />
                      <span className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-[8px] md:text-xs">
                        cm
                      </span>
                    </div>
                    {editErrors.birthLength && (
                      <p className="text-[10px] text-rose-500 font-black ml-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />{" "}
                        {editErrors.birthLength.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Lingkar Kepala & Lingkar Lengan (Edit) */}
                <div className="grid grid-cols-2 gap-2 md:gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Baby className="w-2.5 h-2.5 md:w-3 md:h-3" /> L. Kepala (cm)
                    </label>
                    <div className="relative">
                      <input
                        {...editRegister("birthHeadCircumference")}
                        type="number"
                        step="0.01"
                        placeholder="Opsional"
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-[#3AC4B6]/20 rounded-[18px] md:rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all"
                      />
                      <span className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-[8px] md:text-xs">
                        cm
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[9px] md:text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1 flex items-center gap-1.5">
                      <Baby className="w-2.5 h-2.5 md:w-3 md:h-3" /> L. Lengan (cm)
                    </label>
                    <div className="relative">
                      <input
                        {...editRegister("birthArmCircumference")}
                        type="number"
                        step="0.01"
                        placeholder="Opsional"
                        className="w-full bg-slate-50 border-2 border-transparent focus:border-[#3AC4B6]/20 rounded-[18px] md:rounded-[22px] px-4 md:px-6 py-3 md:py-4.5 text-xs md:text-sm font-bold text-slate-700 outline-none transition-all"
                      />
                      <span className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-slate-300 font-black text-[8px] md:text-xs">
                        cm
                      </span>
                    </div>
                  </div>
                </div>

                {/* ASI Eksklusif */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      {...editRegister("asiExclusive")}
                      type="checkbox"
                      className="w-4 h-4 rounded accent-[#3AC4B6]"
                    />
                    <span className="text-[9px] md:text-[11px] font-black text-slate-700 uppercase tracking-widest">
                      ASI Eksklusif
                    </span>
                  </label>
                </div>

                {/* Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingChild(null);
                      editReset();
                    }}
                    className="flex-1 bg-slate-100 text-slate-700 py-3 md:py-4 rounded-[18px] md:rounded-[22px] font-black uppercase tracking-[0.1em] hover:bg-slate-200 transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={editChildMutation.isPending}
                    className="flex-1 bg-[#3AC4B6] text-white py-3 md:py-4 rounded-[18px] md:rounded-[22px] font-black uppercase tracking-[0.1em] hover:bg-[#2DA89B] shadow-lg shadow-teal-100 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {editChildMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4" />
                    )}
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
