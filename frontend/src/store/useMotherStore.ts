import { create } from "zustand";

// Definisikan interface yang lengkap sesuai JSON endpoint
interface MotherProfile {
  id: string;
  userId: string;
  age: number;
  heightCm: number;
  weightKg: number;
  lilaCm: number;
  isPregnant: boolean;
  trimester: number | null;
  ttdCompliance: "Patuh" | "Tidak Patuh";
  createdAt: string;
  environment: any;
}

interface MotherState {
  profile: MotherProfile | null;
  childProfiles: any[];
  // Actions
  setMotherData: (data: any) => void;
  updateProfile: (updatedData: Partial<MotherProfile>) => void;
  clearMotherData: () => void;
}

export const useMotherStore = create<MotherState>((set) => ({
  profile: null,
  childProfiles: [],

  // Menyimpan data lengkap hasil fetching pertama kali
  setMotherData: (data) =>
    set({
      profile: data,
      childProfiles: data.childProfiles || [],
    }),

  // Mengupdate profile secara parsial (untuk optimasi UI setelah POST)
  updateProfile: (updatedData) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updatedData } : null,
    })),

  // Menghapus data saat logout
  clearMotherData: () => set({ profile: null, childProfiles: [] }),
}));
