import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const getBaseEndpoint = (type: string) => {
  if (type === "health") return "/health-history";
  return `/${type}`;
};

export const useChildHistory = (
  childId: string,
  type: "immunization" | "nutrition" | "health"
) => {
  return useQuery({
    queryKey: ["child-history", childId, type],
    queryFn: async () => {
      const endpoint = getBaseEndpoint(type);
      const { data } = await api.get(`${endpoint}/child/${childId}`);
      return data;
    },
    enabled: !!childId,
  });
};

export const useAddActivity = (
  childId: string,
  type: "immunization" | "nutrition" | "health"
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      const endpoint = getBaseEndpoint(type);

      // 1. Buat payload dasar
      const payload: any = {
        ...formData,
        childId: childId,
      };

      // 2. LOGIC STATUS: Cuma Immunization yang butuh status: "DONE"
      // Nutrition dan Health akan error jika ada field status
      if (type === "immunization") {
        payload.status = "DONE";
      }

      // 3. Normalisasi Tanggal ke ISO format
      if (formData.dateGiven)
        payload.dateGiven = new Date(formData.dateGiven).toISOString();
      if (formData.recordedAt)
        payload.recordedAt = new Date(formData.recordedAt).toISOString();
      if (formData.diagnosisDate)
        payload.diagnosisDate = new Date(formData.diagnosisDate).toISOString();

      // 4. Pastikan angka untuk Nutrisi
      if (formData.frequencyPerDay)
        payload.frequencyPerDay = Number(formData.frequencyPerDay);

      // Hit API
      const { data } = await api.post(endpoint, payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["child-history", childId, type],
      });
    },
  });
};
