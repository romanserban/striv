import { supabase } from "@/lib/supabase";
import type { WorkoutTemplate } from "@/types/workout";

type CreateWorkoutTemplateInput = {
  coachId: string;
  name: string;
  description?: string;
};

export const workoutsService = {
  async listWorkoutTemplates() {
    const { data, error } = await supabase
      .from("workout_templates")
      .select("id, coach_id, name, description, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as WorkoutTemplate[];
  },

  async createWorkoutTemplate({ coachId, name, description }: CreateWorkoutTemplateInput) {
    const { data, error } = await supabase
      .from("workout_templates")
      .insert({
        coach_id: coachId,
        name,
        description: description || null
      })
      .select("id, coach_id, name, description, created_at, updated_at")
      .single<WorkoutTemplate>();

    if (error) {
      throw error;
    }

    return data;
  }
};
