import { RoleGuard } from "@/components/auth/RoleGuard";
import { Baby, Calendar, Activity } from "lucide-react";

export default function MotherOverview() {
  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="space-y-8 animate-in fade-in duration-500">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Halo, Bunda Siti!
          </h1>
          <p className="text-slate-500">
            Berikut adalah ringkasan kesehatan buah hati Anda hari ini.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-[#3AC4B6] mb-4">
              <Baby className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              Status Gizi Budi
            </p>
            <p className="text-2xl font-bold text-slate-800">Normal (Baik)</p>
          </div>

          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500 mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              Update Terakhir
            </p>
            <p className="text-2xl font-bold text-slate-800">12 Des 2023</p>
          </div>

          <div className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-500 mb-4">
              <Calendar className="w-6 h-6" />
            </div>
            <p className="text-sm font-medium text-slate-500">
              Jadwal Posyandu
            </p>
            <p className="text-2xl font-bold text-slate-800">20 Jan 2024</p>
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
