import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";

export function useMothersList(role: string) {
  const endpoint = role === "kader" ? "/mother/assigned" : "/mother/all?limit=100";
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["mothers-list", role],
    queryFn: async () => {
       const res = await api.get(endpoint);
       return res.data;
    },
    enabled: role === "kader" || role === "nakes" || role === "admin",
  });

  const mothers = Array.isArray(data) ? data : data?.data || [];

  return {
    mothers,
    isLoading,
    isError,
  };
}
