import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const useUserManagement = (page: number, limit: number) => {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("ALL");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data, isLoading } = useQuery({
    queryKey: ["users-list", page, limit, search, role],
    queryFn: async () => {
      let url = `/users?page=${page}&limit=${limit}`;
      if (search) url += `&search=${search}`;
      if (role !== "ALL") url += `&role=${role}`;

      const res = await api.get(url);
      return res.data.data.data;
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
      toast({
        title: "BERHASIL",
        description: "User telah dihapus dari sistem.",
      });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "GAGAL HAPUS",
        description: err.response?.data?.message || "Internal Server Error",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: any }) => {
      // BERSIHKAN DATA: Buang field relasi & metadata sebelum kirim ke Patch
      const {
        id: _,
        roles,
        isActive,
        motherProfile,
        chatSessions,
        createdAt,
        updatedAt,
        ...cleanData
      } = payload;

      return api.patch(`/users/${id}`, cleanData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users-list"] });
      toast({ title: "UPDATE BERHASIL", description: "Data user diperbarui." });
    },
    onError: (err: any) => {
      toast({
        variant: "destructive",
        title: "UPDATE GAGAL",
        description: err.response?.data?.message || "Cek input data kamu.",
      });
    },
  });

  return {
    users: data?.users || [],
    meta: data?.meta,
    isLoading,
    deleteMutation,
    updateMutation,
    search,
    setSearch,
    role,
    setRole,
  };
};
