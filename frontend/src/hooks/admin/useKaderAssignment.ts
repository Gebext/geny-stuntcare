import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";

function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

export const useKaderAssignment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const limit = 10;
  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, filterStatus]);

  const { data, isLoading } = useQuery({
    queryKey: ["kader-assignments", page, debouncedSearch, filterStatus],
    queryFn: async () => {
      const [resMothers, resKaders] = await Promise.all([
        api.get("/mother/all", {
          params: {
            page,
            limit,
            search: debouncedSearch,
            status: filterStatus,
          },
        }),
        api.get("/users/role/KADER"),
      ]);

      // --- DRILLING DATA MOTHERS (SESUAI JSON POSTMAN KAMU) ---
      // Level 1: resMothers.data
      // Level 2: resMothers.data.data
      // Level 3: resMothers.data.data.data (Object isi 'data' array & 'meta')
      const motherPayload = resMothers.data?.data?.data;

      const mothersArray = motherPayload?.data || []; // Array Ibu ada di sini
      const totalPage = motherPayload?.meta?.totalPage || 1; // Meta ada di sini

      // --- DRILLING DATA KADERS ---
      // Sesuaikan jika Kaders tidak pakai pagination, biasanya cuma .data.data
      const kadersArray =
        resKaders.data?.data?.data || resKaders.data?.data || [];

      return {
        mothers: Array.isArray(mothersArray) ? mothersArray : [],
        kaders: Array.isArray(kadersArray) ? kadersArray : [],
        meta: { totalPage },
      };
    },
  });

  const assignMutation = useMutation({
    mutationFn: (payload: { motherId: string; kaderId: string }) =>
      api.post(`/mother/assign`, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kader-assignments"] });
      toast({ title: "Berhasil", description: "Kader telah ditugaskan." });
    },
    onError: (err: any) => {
      toast({
        title: "Gagal Menugaskan",
        description: err.response?.data?.message || "Terjadi kesalahan",
        variant: "destructive",
      });
    },
  });

  const unassignMutation = useMutation({
    mutationFn: (payload: { motherId: string; kaderId: string }) =>
      api.delete(`/mother/unassign`, { data: payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kader-assignments"] });
      toast({ title: "Berhasil", description: "Penugasan dihapus." });
    },
  });

  return {
    mothers: data?.mothers || [],
    kaders: data?.kaders || [],
    meta: data?.meta || { totalPage: 1 },
    loading: isLoading,
    page,
    setPage,
    search,
    setSearch,
    filterStatus,
    setFilterStatus,
    assignKader: (mId: string, kId: string) =>
      assignMutation.mutate({ motherId: mId, kaderId: kId }),
    unassignKader: (mId: string, kId: string) =>
      unassignMutation.mutate({ motherId: mId, kaderId: kId }),
  };
};
