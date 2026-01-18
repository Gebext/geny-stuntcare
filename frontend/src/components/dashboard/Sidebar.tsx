"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Baby,
  Heart,
  LineChart,
  MessageCircle,
  Bell,
  Users,
  LogOut,
  User,
  Menu,
  X,
  BabyIcon,
  CalendarArrowUp,
  Stethoscope,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { useAuthStore } from "@/store/authStore";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

// Konfigurasi Menu
const motherMenuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard/mother",
  },
  {
    id: "child",
    icon: Baby,
    label: "Data Anak",
    path: "/dashboard/mother/child",
  },
  { id: "me", icon: Heart, label: "Data Ibu", path: "/dashboard/mother/me" },
  {
    id: "analysis",
    icon: LineChart,
    label: "Analisis AI",
    path: "/dashboard/mother/analysis",
  },
  {
    id: "geny",
    icon: MessageCircle,
    label: "GENY Chat",
    path: "/dashboard/mother/geny",
  },
];

const kaderMenuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
    path: "/dashboard/kader",
  },
  {
    id: "children-list",
    icon: Baby,
    label: "Anak Binaan",
    path: "/dashboard/kader/children-list",
  },
  {
    id: "agenda",
    icon: CalendarArrowUp,
    label: "Agenda",
    path: "/dashboard/kader/agenda",
  },
];

const adminMenuItems = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    label: "Dashboard Agregat",
    path: "/dashboard/admin",
  },
  {
    id: "monitoring",
    icon: Users,
    label: "Monitoring Kader",
    path: "/dashboard/admin/monitoring",
  },
  {
    id: "children",
    icon: BabyIcon,
    label: "Children",
    path: "/dashboard/admin/children",
  },
  {
    id: "user-management",
    icon: Stethoscope,
    label: "Nakes Management",
    path: "/dashboard/admin/user-management",
  },
];

const roleLabels: Record<string, string> = {
  mother: "Ibu / Orang Tua",
  kader: "Kader Posyandu",
  admin: "Administrator / Nakes",
};

// Sidebar Content Component (shared between desktop and mobile)
const SidebarContent = ({ userData, currentRole, pathname, logout }: any) => (
  <>
    <div className="p-8">
      <Logo />
    </div>
    <nav className="flex-1 px-4 space-y-1">
      {(currentRole === "kader"
        ? kaderMenuItems
        : currentRole === "admin"
          ? adminMenuItems
          : motherMenuItems
      ).map((item) => (
        <Link key={item.id} href={item.path}>
          <div
            className={cn(
              "flex items-center gap-4 px-4 py-3 rounded-xl transition-all mb-1 font-medium cursor-pointer",
              pathname === item.path
                ? "bg-[#3AC4B6] text-white shadow-lg"
                : "text-[#64748B] hover:bg-slate-50",
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </div>
        </Link>
      ))}
    </nav>

    <div className="px-4 pb-6 border-t border-slate-50 pt-4">
      <button
        onClick={logout}
        className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-[#F43F5E] hover:bg-rose-50 font-medium transition-colors"
      >
        <LogOut className="w-5 h-5 rotate-180" />
        <span>Keluar</span>
      </button>

      <div className="mt-4 p-4 bg-[#ECF7F6] rounded-2xl flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#B6E7E3] flex items-center justify-center text-[#3AC4B6] shrink-0">
          <User className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#1E293B] truncate">
            {userData?.name || "Loading..."}
          </p>
          <p className="text-[10px] text-[#64748B] font-semibold uppercase">
            {roleLabels[currentRole]}
          </p>
        </div>
      </div>
    </div>
  </>
);

export const Sidebar = () => {
  const pathname = usePathname();
  const { token, logout } = useAuthStore();
  const [userData, setUserData] = useState<{
    name: string;
    role: string;
  } | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        // Pastikan pengecekan role lebih aman
        const rawRole = decoded?.roles?.[0]?.toLowerCase() || "mother";
        setUserData({
          name: decoded?.name || "Administrator",
          role: rawRole,
        });
      } catch (e) {
        console.error("Sidebar Decode Error:", e);
      }
    }
  }, [token]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Mencegah Hydration Error: Jangan rendet apapun sampai mounted di client
  if (!mounted) return null;

  const currentRole = userData?.role || "mother";

  return (
    <>
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-slate-100 flex-col z-50">
        <SidebarContent
          userData={userData}
          currentRole={currentRole}
          pathname={pathname}
          logout={logout}
        />
      </aside>

      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-100 flex items-center px-4 z-40">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {mobileOpen ? (
            <X className="w-6 h-6 text-[#64748B]" />
          ) : (
            <Menu className="w-6 h-6 text-[#64748B]" />
          )}
          <span className="sr-only">Toggle menu</span>
        </button>
        <div className="ml-4">
          <Logo />
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-30"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-100 flex flex-col md:hidden z-40 transition-transform duration-300",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <SidebarContent
          userData={userData}
          currentRole={currentRole}
          pathname={pathname}
          logout={logout}
        />
      </aside>

      <style jsx>{`
        @media (max-width: 767px) {
          main {
            margin-top: 4rem; /* h-16 for mobile header */
            margin-left: 0;
          }
        }
        @media (min-width: 768px) {
          main {
            margin-left: 16rem; /* w-64 = 16rem */
            margin-top: 0;
          }
        }
      `}</style>
    </>
  );
};
