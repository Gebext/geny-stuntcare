import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";

export const useMotherSelfAiAnalysis = (motherId: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["mother-self-ai-analysis", motherId],
    queryFn: async () => {
      const res = await api.get(`/ai-analysis/mother/${motherId}`);
      const result = res.data?.data?.data || res.data?.data || res.data;
      return result;
    },
    enabled: !!motherId,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/ai-analysis/mother/trigger/${motherId}`);
      const result = res.data?.data?.data || res.data?.data || res.data;
      return result;
    },
    onSuccess: (newData) => {
      queryClient.setQueryData(
        ["mother-self-ai-analysis", motherId],
        newData,
      );
      queryClient.invalidateQueries({
        queryKey: ["mother-self-ai-analysis", motherId],
      });
    },
    onError: (error: any) => {
      console.error(
        "Mother AI Trigger Error:",
        error.response?.data || error.message,
      );
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
