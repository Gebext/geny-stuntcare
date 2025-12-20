import { RoleGuard } from "@/components/auth/RoleGuard";
import { Users, ClipboardCheck, AlertCircle } from "lucide-react";

export default function KaderOverview() {
  return (
    <RoleGuard allowedRoles={["kader"]}>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Dashboard Kader</h1>
          <p className="text-slate-500">
            Pantau perkembangan anak binaan di wilayah Anda.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-[#3AC4B6] mb-4">
              <Users className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              Total Anak Binaan
            </p>
            <p className="text-2xl font-bold text-slate-800">48 Anak</p>
          </div>

          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center text-purple-500 mb-4">
              <ClipboardCheck className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              Sudah Diukur (Bulan Ini)
            </p>
            <p className="text-2xl font-bold text-slate-800">32/48</p>
          </div>

          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center text-red-500 mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              Indikasi Stunting
            </p>
            <p className="text-2xl font-bold text-red-600">5 Anak</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
