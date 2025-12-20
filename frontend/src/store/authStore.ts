// src/store/authStore.ts
import { create } from "zustand";
import { setCookie, deleteCookie, getCookie } from "cookies-next";

interface AuthState {
  token: string | null;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  // Mengambil token awal dari cookie agar sinkron dengan server-side (middleware)
  token: (getCookie("access_token") as string) || null,

  setToken: (token: string) => {
    // Simpan ke cookie dengan nama 'access_token' (samakan dengan middleware)
    setCookie("access_token", token, {
      maxAge: 60 * 60 * 24, // 1 hari
      path: "/", // Tersedia di seluruh route
    });
    set({ token });
  },

  logout: () => {
    deleteCookie("access_token");
    set({ token: null });
    // Opsional: Redirect ke login setelah logout
    window.location.href = "/login";
  },
}));
