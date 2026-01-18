import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

export const useMotherAiAnalysis = (childId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["mother-ai-analysis", childId],
    queryFn: async () => {
      const res = await api.get(`/ai-analysis/${childId}`);
      return res.data?.data || null;
    },
    enabled: !!childId,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await api.post(`/ai-analysis/trigger/${childId}`);
      return res.data?.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["mother-ai-analysis", childId],
      });
      toast({
        title: "Analisis Berhasil",
        description: "Data kesehatan si kecil telah diperbarui.",
      });
    },
  });

  return {
    analysis: query.data,
    isLoading: query.isLoading,
    isTriggering: mutation.isPending,
    triggerAnalysis: mutation.mutate,
  };
};
