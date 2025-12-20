"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { jwtDecode } from "jwt-decode";
import { Loader2 } from "lucide-react";

export default function DashboardRootPage() {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (token && !isRedirecting) {
      try {
        const decoded: any = jwtDecode(token);
        const role = decoded.roles?.[0]?.toLowerCase();
        setIsRedirecting(true);

        if (role === "mother") router.replace("/dashboard/mother");
        else if (role === "kader") router.replace("/dashboard/kader");
        else if (role === "admin") router.replace("/dashboard/admin");
        else router.replace("/login");
      } catch (error) {
        router.replace("/login");
      }
    }
  }, [token, router, isRedirecting]);

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-3">
      <Loader2 className="w-8 h-8 animate-spin text-[#3AC4B6]" />
      <p className="text-sm font-medium text-slate-500">
        Menyiapkan dashboard Anda...
      </p>
    </div>
  );
}
