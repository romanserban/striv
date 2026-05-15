import { supabase } from "@/lib/supabase";
import type { Exercise } from "@/types/exercise";

type ListExercisesInput = {
  search?: string;
  muscleGroup?: string;
};

type CreateExerciseInput = {
  coachId: string;
  name: string;
  muscleGroup: string;
  equipment?: string;
  instructions?: string;
  mediaUrl?: string;
};

export const exercisesService = {
  async listExercises({ search, muscleGroup }: ListExercisesInput = {}) {
    let query = supabase
      .from("exercises")
      .select("id, coach_id, name, muscle_group, equipment, instructions, media_url, is_global, created_at, updated_at")
      .order("is_global", { ascending: false })
      .order("name", { ascending: true });

    if (search?.trim()) {
      query = query.ilike("name", `%${search.trim()}%`);
    }

    if (muscleGroup?.trim()) {
      query = query.eq("muscle_group", muscleGroup.trim());
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return (data ?? []) as Exercise[];
  },

  async createCustomExercise({
    coachId,
    name,
    muscleGroup,
    equipment,
    instructions,
    mediaUrl
  }: CreateExerciseInput) {
    const { data, error } = await supabase
      .from("exercises")
      .insert({
        coach_id: coachId,
        name,
        muscle_group: muscleGroup,
        equipment: equipment || null,
        instructions: instructions || null,
        media_url: mediaUrl || null,
        is_global: false
      })
      .select("id, coach_id, name, muscle_group, equipment, instructions, media_url, is_global, created_at, updated_at")
      .single<Exercise>();

    if (error) {
      throw error;
    }

    return data;
  }
};
