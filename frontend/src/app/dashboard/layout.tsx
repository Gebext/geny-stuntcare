import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-end mb-8">
          <div className="bg-white px-4 py-2 rounded-full border border-slate-100 shadow-sm text-[10px] font-bold text-slate-400">
            GENY STUNTCARE v1.0
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
