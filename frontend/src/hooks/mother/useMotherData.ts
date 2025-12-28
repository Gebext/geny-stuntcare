import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useMotherStore } from "@/store/useMotherStore";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

// 1. Hook Fetch Profile & Sinkronisasi Zustand
export const useFetchMotherProfile = () => {
  const setMotherData = useMotherStore((state) => state.setMotherData);

  const query = useQuery({
    queryKey: ["mother-profile-me"],
    queryFn: async () => {
      const res = await api.get("/mother/profile/me");
      // Menyesuaikan dengan struktur data.data.data dari API kamu
      return res.data.data.data;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (query.data) {
      setMotherData(query.data);
    }
  }, [query.data, setMotherData]);

  return query;
};

// 2. Hook Update Data Lingkungan (POST /environment)
export const useUpdateEnvironment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: {
      motherId: string;
      cleanWater: boolean;
      sanitation: string;
      distanceFaskesKm: number;
      transportation: string;
    }) => {
      const res = await api.post("/environment", payload);
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Berhasil!",
        description: "Data lingkungan Bunda telah tersimpan.",
      });
      queryClient.invalidateQueries({ queryKey: ["mother-profile-me"] });
    },
    onError: (error: any) => {
      toast({
        title: "Gagal Menyimpan",
        description:
          error.response?.data?.message || "Terjadi kesalahan server.",
        variant: "destructive",
      });
    },
  });
};

// 3. Hook Update Profil Fisik Ibu
export const useUpdateMotherProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/mother/profile", payload);
      return res.data;
    },
    onSuccess: () => {
      toast({
        title: "Berhasil!",
        description: "Data profil fisik Bunda telah diperbarui.",
      });
      queryClient.invalidateQueries({ queryKey: ["mother-profile-me"] });
    },
    onError: (error: any) => {
      toast({
        title: "Terjadi Kesalahan",
        description: error.response?.data?.message || "Gagal menyimpan data.",
        variant: "destructive",
      });
    },
  });
};

// 4. Hook Tambah Anak
export const useAddChild = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: any) => {
      const res = await api.post("/children", payload);
      return res.data;
    },
    onSuccess: (res) => {
      toast({
        title: "Anak Berhasil Didaftarkan!",
        description: `${res.data?.name || "Si kecil"} telah masuk daftar.`,
      });
      queryClient.invalidateQueries({ queryKey: ["mother-profile-me"] });
    },
    onError: (error: any) => {
      const status = error.response?.status;
      const message = error.response?.data?.message;

      if (status === 409) {
        toast({
          title: "Nama Sudah Terdaftar",
          description: "Bunda sudah mendaftarkan anak dengan nama ini.",
          variant: "destructive",
        });
      } else if (status === 404) {
        toast({
          title: "Profil Belum Lengkap",
          description: "Silakan isi profil Bunda terlebih dahulu.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Gagal Mendaftarkan",
          description: message || "Terjadi kesalahan server.",
          variant: "destructive",
        });
      }
    },
  });
};
