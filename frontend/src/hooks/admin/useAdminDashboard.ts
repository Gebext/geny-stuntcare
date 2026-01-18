import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useAdminDashboard = () => {
  return useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: async () => {
      const { data } = await api.get("/dashboard/admin/summary");
      return data.data.data;
    },
    // Tambahkan placeholderData agar saat loading transisi ke sukses,
    // object-nya sudah punya struktur yang benar
    placeholderData: (previousData) => previousData,
  });
};
