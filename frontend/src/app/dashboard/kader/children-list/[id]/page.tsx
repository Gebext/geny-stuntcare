"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Baby,
  Calendar,
  Phone,
  Home,
  Activity,
  Syringe,
  ClipboardList,
  ShieldCheck,
  TrendingUp,
  MapPin,
  Droplets,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useChildDetail } from "@/hooks/kader/useChildren";

export default function ChildDetailPage() {
  const { id } = useParams();
  const { data: child, isLoading } = useChildDetail(id as string);
  const [activeTab, setActiveTab] = useState("overview");

  if (isLoading)
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-slate-100 rounded-full" />
          <div className="h-4 w-32 bg-slate-100 rounded" />
        </div>
      </div>
    );

  const TABS = [
    { id: "overview", label: "Ringkasan", icon: Activity },
    { id: "growth", label: "Pertumbuhan", icon: TrendingUp },
    { id: "family", label: "Keluarga", icon: Home },
  ];

  return (
    <div className="min-h-screen bg-[#FDFEFF] pb-10">
      {/* HEADER TOP */}
      <div className="bg-[#3AC4B6] pt-8 pb-32 px-6 rounded-b-[50px] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />

        <div className="flex items-center justify-between relative z-10 mb-8">
          <Link
            href="/dashboard/kader/children-list"
            className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <button className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/20 text-white backdrop-blur-md">
            <ShieldCheck className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-5 relative z-10 text-white">
          <div className="w-20 h-20 rounded-[28px] bg-white flex items-center justify-center text-3xl font-black shadow-xl text-[#3AC4B6]">
            {child?.gender}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-black truncate uppercase leading-tight mb-1">
              {child?.name}
            </h1>
            <div className="flex items-center gap-2 opacity-80 text-[10px] font-bold uppercase tracking-widest">
              <Calendar className="w-3 h-3" />
              Lahir:{" "}
              {new Date(child?.birthDate).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CARD CONTENT */}
      <main className="px-6 -mt-20 relative z-20">
        {/* STATS OVERVIEW */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            {
              label: "Berat Lahir",
              val: `${child?.birthWeight}kg`,
              color: "bg-blue-500",
            },
            {
              label: "Tinggi Lahir",
              val: `${child?.birthLength}cm`,
              color: "bg-orange-500",
            },
            { label: "Status", val: child?.stuntingRisk, color: "bg-red-500" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-4 rounded-[30px] shadow-sm border border-slate-50 text-center"
            >
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1">
                {item.label}
              </p>
              <p
                className={cn(
                  "text-xs font-black",
                  item.label === "Status" ? "text-red-500" : "text-slate-700"
                )}
              >
                {item.val}
              </p>
            </div>
          ))}
        </div>

        {/* TAB NAVIGATION */}
        <div className="bg-white p-2 rounded-[24px] shadow-sm border border-slate-50 flex mb-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex-1 py-3 rounded-2xl flex flex-col items-center gap-1 transition-all",
                activeTab === tab.id
                  ? "bg-[#3AC4B6] text-white shadow-lg shadow-teal-100"
                  : "text-slate-400"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-[8px] font-black uppercase tracking-widest">
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="space-y-6">
          {activeTab === "overview" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-2">
                Data Antropometri Terakhir
              </h2>
              {child?.anthropometries.length > 0 ? (
                // List measurement
                <div className="bg-white rounded-[32px] border border-slate-50 p-6 shadow-sm">
                  {/* Map measurements here */}
                </div>
              ) : (
                <div className="bg-white rounded-[32px] border-2 border-dashed border-slate-100 p-10 text-center">
                  <ClipboardList className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-[10px] font-black text-slate-300 uppercase">
                    Belum ada pengukuran
                  </p>
                  <Link
                    href={`/dashboard/kader/add-measurement/${child?.id}`}
                    className="inline-block mt-4 text-[10px] font-black text-[#3AC4B6] underline uppercase"
                  >
                    Input Data Sekarang
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "family" && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Mother Info */}
              <div className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-50">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-teal-50 rounded-2xl flex items-center justify-center text-[#3AC4B6]">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest">
                      Nama Ibu
                    </p>
                    <h3 className="text-sm font-black text-slate-700 uppercase tracking-tight">
                      {child?.motherName}
                    </h3>
                  </div>
                </div>
                <a
                  href={`tel:${child?.contactMother}`}
                  className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl active:scale-95 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-[#3AC4B6]" />
                    <span className="text-xs font-bold text-slate-600">
                      {child?.contactMother}
                    </span>
                  </div>
                  <span className="text-[8px] font-black text-[#3AC4B6] uppercase">
                    Hubungi Sekarang
                  </span>
                </a>
              </div>

              {/* Environment Info */}
              <div className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-50">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-5 ml-1">
                  Kondisi Lingkungan
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Droplets className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase">
                        Air Bersih
                      </span>
                    </div>
                    <p className="text-[10px] font-black text-slate-700">
                      {child?.mother?.environment?.cleanWater
                        ? "TERSEDIA"
                        : "TIDAK ADA"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3 h-3" />
                      <span className="text-[9px] font-bold uppercase">
                        Sanitasi
                      </span>
                    </div>
                    <p className="text-[10px] font-black text-slate-700 uppercase">
                      {child?.mother?.environment?.sanitation}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
