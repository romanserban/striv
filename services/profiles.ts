import { supabase } from "@/lib/supabase";
import type { Profile } from "@/types/profile";
import type { ClientProfile, CoachProfile } from "@/types/roleProfiles";

type UpdateBaseProfileInput = {
  userId: string;
  fullName: string;
};

type UpdateCoachProfileInput = UpdateBaseProfileInput & {
  bio?: string;
  specialty?: string;
};

type UpdateClientProfileInput = UpdateBaseProfileInput & {
  goal: string;
  trainingLevel: string;
  heightCm?: number | null;
  startingWeightKg?: number | null;
};

export const profilesService = {
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, full_name, avatar_url, created_at, updated_at")
      .eq("id", userId)
      .single<Profile>();

    if (error) {
      throw error;
    }

    return data;
  },

  async getCoachProfile(userId: string) {
    const { data, error } = await supabase
      .from("coach_profiles")
      .select("id, user_id, bio, specialty, invite_code, created_at, updated_at")
      .eq("user_id", userId)
      .maybeSingle<CoachProfile>();

    if (error) {
      throw error;
    }

    return data;
  },

  async getClientProfile(userId: string) {
    const { data, error } = await supabase
      .from("client_profiles")
      .select("id, user_id, coach_id, goal, training_level, height_cm, starting_weight_kg, created_at, updated_at")
      .eq("user_id", userId)
      .maybeSingle<ClientProfile>();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateBaseProfile({ userId, fullName }: UpdateBaseProfileInput) {
    const { data, error } = await supabase
      .from("profiles")
      .update({ full_name: fullName })
      .eq("id", userId)
      .select("id, role, full_name, avatar_url, created_at, updated_at")
      .single<Profile>();

    if (error) {
      throw error;
    }

    return data;
  },

  async updateCoachProfile({ userId, fullName, bio, specialty }: UpdateCoachProfileInput) {
    const profile = await profilesService.updateBaseProfile({ userId, fullName });
    const { data, error } = await supabase
      .from("coach_profiles")
      .upsert({
        user_id: userId,
        bio: bio || null,
        specialty: specialty || null
      })
      .select("id, user_id, bio, specialty, invite_code, created_at, updated_at")
      .single<CoachProfile>();

    if (error) {
      throw error;
    }

    return { profile, coachProfile: data };
  },

  async updateClientProfile({
    userId,
    fullName,
    goal,
    trainingLevel,
    heightCm,
    startingWeightKg
  }: UpdateClientProfileInput) {
    const profile = await profilesService.updateBaseProfile({ userId, fullName });
    const { data, error } = await supabase
      .from("client_profiles")
      .upsert({
        user_id: userId,
        goal,
        training_level: trainingLevel,
        height_cm: heightCm ?? null,
        starting_weight_kg: startingWeightKg ?? null
      })
      .select("id, user_id, coach_id, goal, training_level, height_cm, starting_weight_kg, created_at, updated_at")
      .single<ClientProfile>();

    if (error) {
      throw error;
    }

    return { profile, clientProfile: data };
  }
};
