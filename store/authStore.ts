import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";

import type { Profile } from "@/types/profile";

type AuthState = {
  session: Session | null;
  profile: Profile | null;
  isBootstrapping: boolean;
  setSession: (session: Session | null) => void;
  setProfile: (profile: Profile | null) => void;
  setIsBootstrapping: (isBootstrapping: boolean) => void;
  resetAuth: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  profile: null,
  isBootstrapping: true,
  setSession: (session) => set({ session }),
  setProfile: (profile) => set({ profile }),
  setIsBootstrapping: (isBootstrapping) => set({ isBootstrapping }),
  resetAuth: () => set({ session: null, profile: null, isBootstrapping: false })
}));
