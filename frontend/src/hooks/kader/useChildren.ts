import api from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export const useChildrenKader = (params: {
  page?: number;
  name?: string;
  gender?: string;
  stuntingRisk?: string;
}) => {
  return useQuery({
    queryKey: ["kader-children-list", params],
    queryFn: async () => {
      // Membersihkan params yang kosong agar URL tidak kotor
      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(([_, v]) => v !== "" && v !== undefined)
      );
      const { data } = await api.get("/children", { params: cleanParams });
      return data.data.data;
    },
  });
};

export const useChildDetail = (id: string) => {
  return useQuery({
    queryKey: ["child-detail", id],
    queryFn: async () => {
      const { data } = await api.get(`/children/${id}`);
      // Mapping sesuai response: data.data.data
      return data.data.data;
    },
    enabled: !!id,
  });
};
