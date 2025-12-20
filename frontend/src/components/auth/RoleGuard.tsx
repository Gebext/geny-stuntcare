"use client";

import { useAuthStore } from "@/store/authStore";
import { jwtDecode } from "jwt-decode";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const RoleGuard = ({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) => {
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const userRole = decoded.roles?.[0]?.toLowerCase();

      if (allowedRoles.includes(userRole)) {
        setAuthorized(true);
      } else {
        router.replace("/dashboard");
      }
    } catch (error) {
      console.error("Invalid token");
      router.replace("/login");
    }
  }, [token, allowedRoles, router]);

  if (!authorized) return null; // Mencegah render konten sebelum role terverifikasi

  return <>{children}</>;
};
