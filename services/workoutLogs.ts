import { supabase } from "@/lib/supabase";
import type { WorkoutLog, WorkoutSetLog } from "@/types/workoutLog";

type SaveWorkoutSetLogInput = {
  assignedWorkoutId: string;
  exerciseId: string;
  setNumber: number;
  actualReps?: number | null;
  actualWeight?: number | null;
  completed?: boolean;
  notes?: string | null;
};

const workoutLogSelect = "id, assigned_workout_id, client_id, started_at, completed_at, client_notes, created_at";
const workoutSetLogSelect =
  "id, workout_log_id, exercise_id, set_number, actual_reps, actual_weight, completed, notes, created_at";

export const workoutLogsService = {
  async startWorkout(assignedWorkoutId: string) {
    const { data: assignedWorkout, error: assignedError } = await supabase
      .from("assigned_workouts")
      .select("id, client_id")
      .eq("id", assignedWorkoutId)
      .single<{ id: string; client_id: string }>();

    if (assignedError) {
      throw assignedError;
    }

    const { data: existingLog, error: existingError } = await supabase
      .from("workout_logs")
      .select(workoutLogSelect)
      .eq("assigned_workout_id", assignedWorkoutId)
      .maybeSingle<WorkoutLog>();

    if (existingError) {
      throw existingError;
    }

    if (existingLog) {
      await workoutLogsService.updateAssignedWorkoutStatus(assignedWorkoutId, "in_progress");
      return existingLog;
    }

    const startedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from("workout_logs")
      .insert({
        assigned_workout_id: assignedWorkout.id,
        client_id: assignedWorkout.client_id,
        started_at: startedAt
      })
      .select(workoutLogSelect)
      .single<WorkoutLog>();

    if (error) {
      throw error;
    }

    await workoutLogsService.updateAssignedWorkoutStatus(assignedWorkoutId, "in_progress");
    return data;
  },

  async completeWorkout(assignedWorkoutId: string) {
    const log = await workoutLogsService.startWorkout(assignedWorkoutId);
    const completedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from("workout_logs")
      .update({
        completed_at: completedAt
      })
      .eq("id", log.id)
      .select(workoutLogSelect)
      .single<WorkoutLog>();

    if (error) {
      throw error;
    }

    await workoutLogsService.updateAssignedWorkoutStatus(assignedWorkoutId, "completed");
    return data;
  },

  async updateAssignedWorkoutStatus(assignedWorkoutId: string, status: "in_progress" | "completed") {
    const { error } = await supabase.from("assigned_workouts").update({ status }).eq("id", assignedWorkoutId);

    if (error) {
      throw error;
    }
  },

  async listSetLogs(assignedWorkoutId: string) {
    const { data: workoutLog, error: workoutLogError } = await supabase
      .from("workout_logs")
      .select("id")
      .eq("assigned_workout_id", assignedWorkoutId)
      .maybeSingle<Pick<WorkoutLog, "id">>();

    if (workoutLogError) {
      throw workoutLogError;
    }

    if (!workoutLog) {
      return [];
    }

    const { data, error } = await supabase
      .from("workout_set_logs")
      .select(workoutSetLogSelect)
      .eq("workout_log_id", workoutLog.id)
      .order("set_number", { ascending: true });

    if (error) {
      throw error;
    }

    return (data ?? []) as WorkoutSetLog[];
  },

  async saveSetLog({
    assignedWorkoutId,
    exerciseId,
    setNumber,
    actualReps,
    actualWeight,
    completed = true,
    notes
  }: SaveWorkoutSetLogInput) {
    const workoutLog = await workoutLogsService.startWorkout(assignedWorkoutId);
    const { data, error } = await supabase
      .from("workout_set_logs")
      .upsert(
        {
          workout_log_id: workoutLog.id,
          exercise_id: exerciseId,
          set_number: setNumber,
          actual_reps: actualReps ?? null,
          actual_weight: actualWeight ?? null,
          completed,
          notes: notes || null
        },
        { onConflict: "workout_log_id,exercise_id,set_number" }
      )
      .select(workoutSetLogSelect)
      .single<WorkoutSetLog>();

    if (error) {
      throw error;
    }

    return data;
  }
};
