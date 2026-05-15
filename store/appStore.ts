import { create } from "zustand";

import type { UserRole } from "@/types/user";

type AppState = {
  role: UserRole | null;
  setRole: (role: UserRole | null) => void;
};

export const useAppStore = create<AppState>((set) => ({
  role: null,
  setRole: (role) => set({ role })
}));
