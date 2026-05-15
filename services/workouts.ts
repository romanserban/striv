import { supabase } from "@/lib/supabase";
import type { WorkoutTemplate, WorkoutTemplateExercise } from "@/types/workout";

type CreateWorkoutTemplateInput = {
  coachId: string;
  name: string;
  description?: string;
};

type AddExerciseToWorkoutTemplateInput = {
  workoutTemplateId: string;
  exerciseId: string;
  orderIndex: number;
  sets: number;
  reps: string;
  targetWeight?: string;
  restSeconds?: number | null;
  tempo?: string;
  notes?: string;
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
  },

  async listWorkoutTemplateExercises() {
    const { data, error } = await supabase
      .from("workout_template_exercises")
      .select(
        "id, workout_template_id, exercise_id, order_index, sets, reps, target_weight, rest_seconds, tempo, notes, exercises(name, muscle_group)"
      )
      .order("order_index", { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []).map(normalizeWorkoutTemplateExercise);
  },

  async addExerciseToWorkoutTemplate({
    workoutTemplateId,
    exerciseId,
    orderIndex,
    sets,
    reps,
    targetWeight,
    restSeconds,
    tempo,
    notes
  }: AddExerciseToWorkoutTemplateInput) {
    const { data, error } = await supabase
      .from("workout_template_exercises")
      .insert({
        workout_template_id: workoutTemplateId,
        exercise_id: exerciseId,
        order_index: orderIndex,
        sets,
        reps,
        target_weight: targetWeight || null,
        rest_seconds: restSeconds ?? null,
        tempo: tempo || null,
        notes: notes || null
      })
      .select(
        "id, workout_template_id, exercise_id, order_index, sets, reps, target_weight, rest_seconds, tempo, notes, exercises(name, muscle_group)"
      )
      .single<WorkoutTemplateExercise>();

    if (error) {
      throw error;
    }

    return normalizeWorkoutTemplateExercise(data);
  }
};

type WorkoutTemplateExerciseRow = Omit<WorkoutTemplateExercise, "exercises"> & {
  exercises?: WorkoutTemplateExercise["exercises"] | WorkoutTemplateExercise["exercises"][];
};

function normalizeWorkoutTemplateExercise(row: WorkoutTemplateExerciseRow): WorkoutTemplateExercise {
  return {
    ...row,
    exercises: Array.isArray(row.exercises) ? row.exercises[0] ?? null : row.exercises ?? null
  };
}
