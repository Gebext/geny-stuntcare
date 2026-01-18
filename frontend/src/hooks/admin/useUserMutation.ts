import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: any) => {
      const { data } = await api.post("/users/admin/create", payload);
      return data;
    },
    onSuccess: (res) => {
      toast({
        title: "Registrasi Berhasil ✨",
        description: `${res.data.name} telah terdaftar sebagai sistem personil.`,
        variant: "default",
      });

      // Merefresh data kader agar muncul yang terbaru di tabel/list
      queryClient.invalidateQueries({ queryKey: ["kaders"] });

      // Logic redirect dihapus agar user tetap di halaman yang sama
    },
    onError: (error: any) => {
      const errorMsg =
        error.response?.data?.message || "Gagal mendaftarkan user";
      toast({
        title: "Terjadi Kesalahan",
        description: errorMsg,
        variant: "destructive",
      });
    },
  });
};
