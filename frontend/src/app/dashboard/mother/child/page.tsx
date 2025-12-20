import { RoleGuard } from "@/components/auth/RoleGuard";

export default function MotherChildPage() {
  return (
    <RoleGuard allowedRoles={["mother"]}>
      <div className="animate-in fade-in duration-500">
        <h1 className="text-2xl font-bold text-slate-800">Data Anak</h1>
        <p className="text-slate-500">
          Pantau pertumbuhan dan kesehatan anak Anda.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm h-40 border-dashed flex items-center justify-center text-slate-400">
            Belum ada data anak
          </div>
        </div>
      </div>
    </RoleGuard>
  );
}
