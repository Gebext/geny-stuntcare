import api from "@/lib/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook Dasar Detail Anak
 */
export const useChildDetail = (id: string) => {
  return useQuery({
    queryKey: ["child-detail", id],
    queryFn: async () => {
      const res = await api.get(`/children/${id}`);
      return res.data?.data?.data;
    },
    enabled: !!id,
  });
};

/**
 * 1. RIWAYAT IMUNISASI
 */
export const useChildImmunization = (childId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["child-immunization", childId],
    queryFn: async () => {
      const res = await api.get(`/immunization/child/${childId}`);
      // Perbaikan drilling data (Level res.data.data.data)
      const data = res.data?.data?.data || res.data?.data || [];
      return Array.isArray(data) ? data : [];
    },
    enabled: !!childId,
  });

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      return await api.post("/immunization", { ...payload, childId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["child-immunization", childId],
      });
      toast({ title: "Berhasil", description: "Imunisasi telah dicatat." });
    },
  });

  return {
    ...query,
    data: query.data || [], // Pastikan selalu mengembalikan array
    addImmunization: mutation.mutate,
    isAdding: mutation.isPending,
  };
};

/**
 * 2. RIWAYAT NUTRISI
 */
export const useChildNutrition = (childId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["child-nutrition", childId],
    queryFn: async () => {
      const res = await api.get(`/nutrition/child/${childId}`);
      const data = res.data?.data?.data || res.data?.data || [];
      return Array.isArray(data) ? data : [];
    },
    enabled: !!childId,
  });

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      return await api.post("/nutrition", { ...payload, childId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["child-nutrition", childId] });
      toast({ title: "Berhasil", description: "Data nutrisi telah disimpan." });
    },
  });

  return {
    ...query,
    data: query.data || [],
    addNutrition: mutation.mutate,
    isAdding: mutation.isPending,
  };
};

/**
 * 3. RIWAYAT KESEHATAN
 */
export const useChildHealthHistory = (childId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const query = useQuery({
    queryKey: ["child-health-history", childId],
    queryFn: async () => {
      const res = await api.get(`/health-history/child/${childId}`);
      const data = res.data?.data?.data || res.data?.data || [];
      return Array.isArray(data) ? data : [];
    },
    enabled: !!childId,
  });

  const mutation = useMutation({
    mutationFn: async (payload: any) => {
      return await api.post("/health-history", { ...payload, childId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["child-health-history", childId],
      });
      toast({
        title: "Berhasil",
        description: "Riwayat penyakit telah dicatat.",
      });
    },
  });

  return {
    ...query,
    data: query.data || [],
    addHealth: mutation.mutate,
    isAdding: mutation.isPending,
  };
};

export const useChildrenKader = (params: {
  page?: number;
  name?: string;
  gender?: string;
  stuntingRisk?: string;
}) => {
  return useQuery({
    queryKey: ["kader-children-list", params],
    queryFn: async () => {
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== "" && v !== undefined),
      );

      const res = await api.get("/mother/assigned-children", {
        params: cleanParams,
      });

      /**
       * BERDASARKAN STRUKTUR JSON ANDA:
       * res.data -> Axios Wrapper
       * res.data.data -> Interceptor 1 (success, message, data)
       * res.data.data.data -> Interceptor 2 (data, meta)
       * res.data.data.data.data -> ARRAY ANAK UTAMA
       */
      const level1 = res.data?.data;
      const level2 = level1?.data;

      return {
        list: level2?.data || [], // Array [ {id, name, ...} ]
        meta: level2?.meta || { total: 0, page: 1, lastPage: 1 },
      };
    },
  });
};

export const useChildHealthMutation = (childId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fungsi helper untuk refresh semua data terkait anak ini
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["child-detail", childId] });
    queryClient.invalidateQueries({
      queryKey: ["child-immunization", childId],
    });
    queryClient.invalidateQueries({ queryKey: ["child-nutrition", childId] });
    queryClient.invalidateQueries({
      queryKey: ["child-health-history", childId],
    });
  };

  const addImmunization = useMutation({
    mutationFn: async (payload: any) =>
      api.post("/immunization", { ...payload, childId }),
    onSuccess: () => {
      refreshData();
      toast({ title: "Berhasil", description: "Data imunisasi diperbarui" });
    },
  });

  const addNutrition = useMutation({
    mutationFn: async (payload: any) =>
      api.post("/nutrition", { ...payload, childId }),
    onSuccess: () => {
      refreshData();
      toast({ title: "Berhasil", description: "Data nutrisi diperbarui" });
    },
  });

  const addHealth = useMutation({
    mutationFn: async (payload: any) =>
      api.post("/health-history", { ...payload, childId }),
    onSuccess: () => {
      refreshData();
      toast({ title: "Berhasil", description: "Riwayat kesehatan diperbarui" });
    },
  });

  return {
    addImmunization: addImmunization.mutate,
    addNutrition: addNutrition.mutate,
    addHealth: addHealth.mutate,
    isLoading:
      addImmunization.isPending ||
      addNutrition.isPending ||
      addHealth.isPending,
  };
};

export const useAddAnthropometry = (childId: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: {
      weightKg: number;
      heightCm: number;
      measurementDate: string; // Sesuai JSON Anda
      headCircumferenceCm?: number;
      armCircumferenceCm?: number;
    }) => {
      const response = await api.post(`/anthropometry`, {
        ...payload,
        childId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["child-detail", childId] });
      toast({
        title: "Berhasil",
        description: "Data antropometri telah diperbarui",
      });
    },
  });
};
