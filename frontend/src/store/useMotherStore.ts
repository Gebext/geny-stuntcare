import { create } from "zustand";

interface ChildProfile {
  id: string;
  motherId: string;
  name: string;
  gender: "L" | "P";
  birthDate: string;
  birthWeight: number;
  birthLength: number;
  asiExclusive: boolean;
  createdAt: string;
}

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
  childProfiles?: ChildProfile[];
}

interface MotherState {
  profile: MotherProfile | null;
  childProfiles: ChildProfile[];
  setMotherData: (data: any) => void;
  updateProfile: (updatedData: Partial<MotherProfile>) => void;
  clearMotherData: () => void;
}

export const useMotherStore = create<MotherState>((set) => ({
  profile: null,
  childProfiles: [],

  setMotherData: (data) =>
    set({
      profile: data,
      childProfiles: data?.childProfiles || [],
    }),

  // Mengupdate profile secara parsial
  updateProfile: (updatedData) =>
    set((state) => ({
      profile: state.profile ? { ...state.profile, ...updatedData } : null,
    })),

  // Menghapus data saat logout
  clearMotherData: () => set({ profile: null, childProfiles: [] }),
}));
