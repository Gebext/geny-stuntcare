import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useAdminStats = () => {
  return useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => {
      const { data } = await api.get("/admin/dashboard/stats");
      // Mengambil data total anak, jumlah stunting, wilayah terdampak, dll.
      return data.data;
    },
  });
};
