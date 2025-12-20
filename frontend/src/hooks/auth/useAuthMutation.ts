// src/hooks/auth/useAuthMutation.ts
import { useMutation } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface LoginPayload {
  email: string;
  password: string;
  role: string;
}

interface APIResponse {
  success: boolean;
  message: string;
  data: {
    access_token: string;
  };
}

export const useLoginMutation = () => {
  const setToken = useAuthStore((state) => state.setToken);
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ payload }: { payload: LoginPayload }) => {
      const response = await api.post<APIResponse>("/auth/login", {
        email: payload.email,
        password: payload.password,
      });

      const token = response.data.data.access_token;

      if (!token) {
        throw new Error("Token tidak ditemukan dalam respon server");
      }

      return { token, selectedRole: payload.role };
    },
    onSuccess: ({ token, selectedRole }) => {
      try {
        const decoded: any = jwtDecode(token);
        const userRoles: string[] = decoded.roles || [];

        // Validasi Role
        const isRoleMatch = userRoles.includes(selectedRole.toUpperCase());

        if (!isRoleMatch) {
          toast({
            variant: "destructive",
            title: "Akses Ditolak",
            description: `Akun Anda tidak terdaftar sebagai ${selectedRole.replace(
              "_",
              " "
            )}.`,
          });
          return;
        }

        // Simpan token (ini akan menjalankan setCookie secara otomatis via Zustand)
        setToken(token);

        toast({
          title: "Berhasil Masuk",
          description: "Mengarahkan ke dashboard...",
        });

        // Paksa redirect ke dashboard
        router.push("/dashboard");
        router.refresh(); // Memastikan middleware mendeteksi perubahan cookie
      } catch (err) {
        console.error("JWT Decode Error:", err);
        toast({
          variant: "destructive",
          title: "Error Identitas",
          description: "Gagal memproses data keamanan akun.",
        });
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "Email atau password salah.";
      toast({
        variant: "destructive",
        title: "Gagal Login",
        description: errorMessage,
      });
    },
  });
};
