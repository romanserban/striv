import { supabase } from "@/lib/supabase";
import type { WorkoutLog } from "@/types/workoutLog";

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
      .select("id, assigned_workout_id, client_id, started_at, completed_at, client_notes, created_at")
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
      .select("id, assigned_workout_id, client_id, started_at, completed_at, client_notes, created_at")
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
      .select("id, assigned_workout_id, client_id, started_at, completed_at, client_notes, created_at")
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
  }
};
