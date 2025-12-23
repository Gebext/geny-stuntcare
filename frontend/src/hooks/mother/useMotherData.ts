import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useMotherStore } from "@/store/useMotherStore";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast"; // Pastikan path hook toast Anda benar

export const useFetchMotherProfile = () => {
  const setMotherData = useMotherStore((state) => state.setMotherData);

  const query = useQuery({
    queryKey: ["mother-profile-me"],
    queryFn: async () => {
      const res = await api.get("/mother/profile/me");
      return res.data.data.data;
    },
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (query.data) {
      setMotherData(query.data);
    }
  }, [query.data, setMotherData]);

  return query;
};

export const useUpdateMotherProfile = () => {
  const queryClient = useQueryClient();
  const updateProfileStore = useMotherStore((state) => state.updateProfile);
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/mother/profile", payload);
      return res.data;
    },
    onSuccess: (data, variables) => {
      // Notifikasi Sukses shadcn
      toast({
        title: "Berhasil!",
        description: "Data kesehatan Bunda telah diperbarui.",
        variant: "default", // atau sesuai theme shadcn Anda
      });

      updateProfileStore(variables);
      queryClient.invalidateQueries({ queryKey: ["mother-profile-me"] });
    },
    onError: (error: any) => {
      // Notifikasi Error shadcn
      toast({
        title: "Terjadi Kesalahan",
        description:
          error.response?.data?.message || "Gagal menyimpan data ke server.",
        variant: "destructive",
      });
    },
  });
};
