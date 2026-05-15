import { supabase } from "@/lib/supabase";
import type { AssignedWorkout, AssignedWorkoutDetail } from "@/types/assignedWorkout";

type CreateAssignedWorkoutInput = {
  coachId: string;
  clientId: string;
  workoutTemplateId: string;
  scheduledDate: string;
};

export const assignmentsService = {
  async createAssignedWorkout({
    coachId,
    clientId,
    workoutTemplateId,
    scheduledDate
  }: CreateAssignedWorkoutInput) {
    const { data, error } = await supabase
      .from("assigned_workouts")
      .insert({
        coach_id: coachId,
        client_id: clientId,
        workout_template_id: workoutTemplateId,
        scheduled_date: scheduledDate,
        status: "assigned"
      })
      .select("id, coach_id, client_id, workout_template_id, scheduled_date, status, created_at, updated_at")
      .single<AssignedWorkout>();

    if (error) {
      throw error;
    }

    return data;
  },

  async listClientAssignedWorkouts() {
    const { data, error } = await supabase
      .from("assigned_workouts")
      .select(
        "id, coach_id, client_id, workout_template_id, scheduled_date, status, created_at, updated_at, workout_templates(name, description)"
      )
      .order("scheduled_date", { ascending: true });

    if (error) {
      throw error;
    }

    return ((data ?? []) as unknown as AssignedWorkoutRow[]).map(normalizeAssignedWorkout);
  },

  async listCoachAssignedWorkouts() {
    const { data, error } = await supabase
      .from("assigned_workouts")
      .select(
        "id, coach_id, client_id, workout_template_id, scheduled_date, status, created_at, updated_at, workout_templates(name, description), client_profiles(profiles(full_name))"
      )
      .order("scheduled_date", { ascending: true });

    if (error) {
      throw error;
    }

    return ((data ?? []) as unknown as AssignedWorkoutRow[]).map(normalizeAssignedWorkout);
  },

  async getClientAssignedWorkoutDetail(assignedWorkoutId: string) {
    const { data, error } = await supabase
      .from("assigned_workouts")
      .select(
        "id, coach_id, client_id, workout_template_id, scheduled_date, status, created_at, updated_at, workout_templates(id, name, description, workout_template_exercises(id, workout_template_id, exercise_id, order_index, sets, reps, target_weight, rest_seconds, tempo, notes, exercises(name, muscle_group)))"
      )
      .eq("id", assignedWorkoutId)
      .single<AssignedWorkoutDetailRow>();

    if (error) {
      throw error;
    }

    return normalizeAssignedWorkoutDetail(data);
  }
};

type AssignedWorkoutRow = Omit<AssignedWorkout, "workout_templates" | "client_profiles"> & {
  workout_templates?: AssignedWorkout["workout_templates"] | AssignedWorkout["workout_templates"][];
  client_profiles?: AssignmentClientProfileRow | AssignmentClientProfileRow[];
};

type AssignmentClientProfileRow = Omit<NonNullable<AssignedWorkout["client_profiles"]>, "profiles"> & {
  profiles?: NonNullable<AssignedWorkout["client_profiles"]>["profiles"] | NonNullable<AssignedWorkout["client_profiles"]>["profiles"][];
};

function normalizeAssignedWorkout(row: AssignedWorkoutRow): AssignedWorkout {
  const clientProfile = Array.isArray(row.client_profiles) ? row.client_profiles[0] ?? null : row.client_profiles ?? null;

  return {
    ...row,
    workout_templates: Array.isArray(row.workout_templates)
      ? row.workout_templates[0] ?? null
      : row.workout_templates ?? null,
    client_profiles: clientProfile
      ? {
          ...clientProfile,
          profiles: Array.isArray(clientProfile.profiles)
            ? clientProfile.profiles[0] ?? null
            : clientProfile.profiles ?? null
        }
      : null
  };
}

type AssignedWorkoutDetailRow = Omit<AssignedWorkoutDetail, "workout_templates" | "client_profiles"> & {
  workout_templates?:
    | NonNullable<AssignedWorkoutDetail["workout_templates"]>
    | NonNullable<AssignedWorkoutDetail["workout_templates"]>[];
  client_profiles?: AssignmentClientProfileRow | AssignmentClientProfileRow[];
};

function normalizeAssignedWorkoutDetail(row: AssignedWorkoutDetailRow): AssignedWorkoutDetail {
  const workoutTemplate = Array.isArray(row.workout_templates)
    ? row.workout_templates[0] ?? null
    : row.workout_templates ?? null;
  const exercises = [...(workoutTemplate?.workout_template_exercises ?? [])].sort(
    (firstExercise, secondExercise) => firstExercise.order_index - secondExercise.order_index
  );

  return {
    ...normalizeAssignedWorkout(row),
    workout_templates: workoutTemplate
      ? {
          ...workoutTemplate,
          workout_template_exercises: exercises
        }
      : null
  };
}
