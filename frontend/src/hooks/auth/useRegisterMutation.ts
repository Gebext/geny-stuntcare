import { useMutation } from "@tanstack/react-query";
import api from "@/lib/axios";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export const useRegisterMutation = (onSuccessCallback?: () => void) => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const { data } = await api.post("/users", payload);
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Pendaftaran Berhasil",
        description:
          "Akun Anda telah dibuat. Silakan masuk menggunakan email tersebut.",
      });

      if (onSuccessCallback) onSuccessCallback();
    },
    onError: (error: any) => {
      const msg = error.response?.data?.message || "Gagal mendaftarkan akun.";
      toast({
        variant: "destructive",
        title: "Pendaftaran Gagal",
        description: msg,
      });
    },
  });
};
