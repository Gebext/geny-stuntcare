import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useChat = (sessionId: string | null) => {
  return useQuery({
    queryKey: ["chat-history", sessionId],
    queryFn: async () => {
      if (!sessionId || sessionId === "null") return [];
      const { data } = await api.get(`/chat/history/${sessionId}`);
      // Mapping data sesuai response backend
      return Array.isArray(data.data) ? data.data : data.data?.messages || [];
    },
    enabled: !!sessionId && sessionId !== "null",
    staleTime: Infinity, // Menjaga data tetap di cache agar tidak hilang saat pindah page
    gcTime: 1000 * 60 * 60, // Simpan cache selama 1 jam
  });
};

export const useAddChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      message,
      sessionId,
    }: {
      message: string;
      sessionId?: string | null;
    }) => {
      const payload: any = { message };
      if (sessionId && sessionId.length > 30) payload.sessionId = sessionId;

      const { data } = await api.post(`/chat/send`, payload);
      return data;
    },
    onSuccess: (res) => {
      if (res.data?.sessionId) {
        queryClient.invalidateQueries({
          queryKey: ["chat-history", res.data.sessionId],
        });
      }
    },
  });
};
