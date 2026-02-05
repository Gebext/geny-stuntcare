import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useMotherAiAnalysis = (childId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["mother-ai-analysis", childId],
    queryFn: async () => {
      const res = await api.get(`/ai-analysis/${childId}`);
      /**
       * MENGATASI DOUBLE WRAPPING:
       * res.data = Response dari Axios
       * res.data.data = Response dari Global Interceptor NestJS
       * res.data.data.data = Isi objek jika Controller juga membungkus (Double)
       */
      const result = res.data?.data?.data || res.data?.data || res.data;
      return result;
    },
    enabled: !!childId,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/ai-analysis/trigger/${childId}`);
      // Bongkar bungkusannya di sini juga
      const result = res.data?.data?.data || res.data?.data || res.data;
      return result;
    },
    onSuccess: (newData) => {
      // Update cache agar UI langsung sinkron tanpa loading ulang
      queryClient.setQueryData(["mother-ai-analysis", childId], newData);

      // Pastikan cache benar-benar fresh
      queryClient.invalidateQueries({
        queryKey: ["mother-ai-analysis", childId],
      });
    },
    onError: (error: any) => {
      console.error("AI Trigger Error:", error.response?.data || error.message);
    },
  });

  return {
    analysis: query.data,
    isLoading: query.isLoading,
    isTriggering: mutation.isPending,
    triggerAnalysis: mutation.mutate,
    isError: query.isError || mutation.isError,
  };
};
