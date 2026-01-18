import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useKaderDashboard = () => {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["kader-dashboard-summary"],
    queryFn: async () => {
      const response = await api.get("/dashboard/kader/summary");
      return response.data.data;
    },
  });

  return {
    stats: data?.stats || {
      totalAnak: 0,
      pengukuranBulanIni: "0/0",
      indikasiStunting: 0,
    },
    pendingMeasurements: data?.pendingMeasurements || [],
    riskDistribution: data?.riskDistribution || [],
    isLoading,
    error,
    refresh: refetch,
  };
};
