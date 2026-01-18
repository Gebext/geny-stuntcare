import api from "@/lib/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type ActivityType =
  | "immunization"
  | "nutrition"
  | "health"
  | "anthropometry";

const getBaseEndpoint = (type: ActivityType) => {
  if (type === "health") return "/health-history";
  if (type === "anthropometry") return "/anthropometry";
  return `/${type}`;
};

export const useChildHistory = (childId: string, type: ActivityType) => {
  return useQuery({
    queryKey: ["child-history", childId, type],
    queryFn: async () => {
      const endpoint = getBaseEndpoint(type);
      const { data: response } = await api.get(`${endpoint}/child/${childId}`);

      // 1. Cek lapis terdalam dulu (data.data.data) sesuai JSON Nutrition/Health kamu
      if (response?.data?.data && Array.isArray(response.data.data)) {
        return response.data.data;
      }

      // 2. Cek lapis kedua (data.data)
      if (response?.data && Array.isArray(response.data)) {
        return response.data;
      }

      // 3. Fallback jika response langsung berupa array atau struktur lain
      return Array.isArray(response) ? response : [];
    },
    enabled: !!childId,
  });
};

export const useAddActivity = (childId: string, type: ActivityType) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: any) => {
      const endpoint = getBaseEndpoint(type);
      const payload: any = { ...formData, childId };

      // Transformasi data agar sesuai tipe data Backend (NestJS)
      if (type === "anthropometry") {
        payload.weightKg = parseFloat(formData.weightKg);
        payload.heightCm = parseFloat(formData.heightCm);
        payload.measurementDate = formData.measurementDate
          ? new Date(formData.measurementDate).toISOString()
          : new Date().toISOString();
      }

      if (type === "immunization") {
        payload.status = "DONE";
        if (formData.dateGiven)
          payload.dateGiven = new Date(formData.dateGiven).toISOString();
      }

      if (type === "nutrition") {
        payload.frequencyPerDay = parseInt(formData.frequencyPerDay, 10);
      }

      if (type === "health") {
        payload.isChronic = !!formData.isChronic; // Ensure boolean
        if (formData.diagnosisDate)
          payload.diagnosisDate = new Date(
            formData.diagnosisDate,
          ).toISOString();
      }

      const { data } = await api.post(endpoint, payload);
      return data;
    },
    onSuccess: () => {
      // Refresh riwayat spesifik dan profil ibu (untuk status stunting terbaru)
      queryClient.invalidateQueries({
        queryKey: ["child-history", childId, type],
      });
      queryClient.invalidateQueries({ queryKey: ["mother-profile"] });
    },
  });
};
