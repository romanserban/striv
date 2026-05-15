import type { AuthChangeEvent, Session } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/profile";
import type { UserRole } from "@/types/user";

type LoginInput = {
  email: string;
  password: string;
};

type SignupInput = LoginInput & {
  fullName: string;
  role: UserRole;
};

type ResetPasswordInput = {
  email: string;
};

type ProfileInput = {
  userId: string;
  fullName: string;
  role: UserRole;
};

export const authService = {
  getSession: () => supabase.auth.getSession(),

  onAuthStateChange: (callback: (event: AuthChangeEvent, session: Session | null) => void) =>
    supabase.auth.onAuthStateChange(callback),

  async login({ email, password }: LoginInput) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      throw error;
    }

    return data;
  },

  async signup({ email, password, fullName, role }: SignupInput) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role
        }
      }
    });

    if (error) {
      throw error;
    }

    if (data.user && data.session) {
      await authService.upsertProfile({
        userId: data.user.id,
        fullName,
        role
      });
    }

    return data;
  },

  async resetPassword({ email }: ResetPasswordInput) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      throw error;
    }

    return data;
  },

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, full_name, avatar_url, created_at, updated_at")
      .eq("id", userId)
      .maybeSingle<Profile>();

    if (error) {
      throw error;
    }

    return data;
  },

  async upsertProfile({ userId, fullName, role }: ProfileInput) {
    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        full_name: fullName,
        role
      })
      .select("id, role, full_name, avatar_url, created_at, updated_at")
      .single<Profile>();

    if (error) {
      throw error;
    }

    return data;
  },

  signOut: () => supabase.auth.signOut()
};
