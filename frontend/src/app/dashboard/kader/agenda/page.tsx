"use client";

import { RoleGuard } from "@/components/auth/RoleGuard";
import {
  Users,
  Activity,
  AlertCircle,
  ChevronRight,
  Loader2,
  MessageCircle,
  CalendarDays,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { useKaderDashboard } from "@/hooks/kader/useKaderDashboard";
import { useKaderAgenda } from "@/hooks/kader/useKaderAgenda";
import Link from "next/link";

export default function KaderCleanDashboard() {
  const {
    stats,
    pendingMeasurements,
    isLoading: statsLoading,
  } = useKaderDashboard();
  const { agenda, isLoading: agendaLoading } = useKaderAgenda();

  if (statsLoading || agendaLoading) {
    return (
      <div className="h-[80vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#3ac3b5]" />
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["kader", "KADER", "admin"]}>
      <div className="bg-[#fbfcfc] min-h-screen p-6 space-y-8 pb-24">
        {/* Soft Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              E-Posyandu
            </h1>
            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-slate-100 rounded-full w-fit shadow-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3ac3b5] animate-pulse" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Kader Aktif
              </span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center shadow-sm">
            <CalendarDays className="text-[#3ac3b5]" size={20} />
          </div>
        </div>

        {/* Floating Stats */}
        <div className="grid grid-cols-1 gap-4">
          <div className="bg-white p-6 rounded-[35px] shadow-sm border border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#3ac3b5]/10 flex items-center justify-center text-[#3ac3b5]">
                <Activity size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Progress Pengukuran
                </p>
                <p className="text-2xl font-black text-slate-700">
                  {stats?.pengukuranBulanIni}
                </p>
              </div>
            </div>
            <div className="h-12 w-1.5 bg-slate-50 rounded-full overflow-hidden">
              <div className="bg-[#3ac3b5] w-full h-1/2 rounded-full" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-[30px] shadow-sm border border-slate-50">
              <Users className="text-blue-400 mb-2" size={20} />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Binaan
              </p>
              <p className="text-lg font-black text-slate-700">
                {stats?.totalAnak}
              </p>
            </div>
            <div className="bg-white p-5 rounded-[30px] shadow-sm border border-slate-50">
              <AlertCircle className="text-rose-400 mb-2" size={20} />
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                Risiko
              </p>
              <p className="text-lg font-black text-slate-700">
                {stats?.indikasiStunting}
              </p>
            </div>
          </div>
        </div>

        {/* Agenda Section */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-2">
            Agenda Hari Ini
          </h3>
          {agenda.length > 0 ? (
            agenda.slice(0, 3).map((item: any) => (
              <div
                key={item.childId}
                className="bg-white border border-slate-100 p-5 rounded-[30px] flex items-center justify-between group hover:border-[#3ac3b5] transition-all shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#3ac3b5]/5 flex items-center justify-center text-[#3ac3b5]">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <p className="text-[11px] font-black text-slate-700 uppercase leading-none mb-1">
                      {item.childName}
                    </p>
                    <p className="text-[9px] font-bold text-slate-400 max-w-[150px] truncate">
                      {item.reason}
                    </p>
                  </div>
                </div>
                {/* Dialihkan ke halaman detail anak sesuai ID */}
                <Link
                  href={`/dashboard/kader/children-list/${item.childId}`}
                  className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-[#3ac3b5] group-hover:text-white transition-all"
                >
                  <ArrowRight size={14} />
                </Link>
              </div>
            ))
          ) : (
            <div className="py-10 text-center bg-white rounded-[30px] border border-dashed border-slate-200">
              <CheckCircle2
                className="mx-auto text-[#3ac3b5]/20 mb-2"
                size={32}
              />
              <p className="text-[10px] font-black text-slate-300 uppercase ">
                Belum ada agenda
              </p>
            </div>
          )}
        </div>

        {/* Quick Action List */}
        <div className="bg-white rounded-[35px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 pb-2">
            <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Butuh Pengukuran
            </h3>
          </div>
          <div className="p-2 space-y-1">
            {pendingMeasurements?.slice(0, 4).map((anak: any) => (
              <div
                key={anak.id}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-[10px] font-black text-[#3ac3b5]">
                    {anak.name?.substring(0, 2).toUpperCase()}
                  </div>
                  <p className="text-xs font-bold text-slate-600">
                    {anak.name}
                  </p>
                </div>
                {/* Tombol Input diarahkan ke detail anak binaan */}
                <Link
                  href={`/dashboard/kader/children-list/${anak.id}`}
                  className="text-[9px] font-black text-[#3ac3b5] uppercase py-2 px-4 bg-[#3ac3b5]/5 rounded-xl hover:bg-[#3ac3b5] hover:text-white transition-all"
                >
                  Input
                </Link>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/kader/children-list"
            className="block text-center w-full py-5 text-[10px] font-black text-slate-400 border-t border-slate-50 uppercase tracking-widest hover:text-[#3ac3b5] transition-all"
          >
            Lihat Data Lengkap
          </Link>
        </div>
      </div>
    </RoleGuard>
  );
}
