export type AssignedWorkoutStatus = "assigned" | "in_progress" | "completed" | "missed";

export type AssignedWorkout = {
  id: string;
  coach_id: string;
  client_id: string;
  workout_template_id: string;
  scheduled_date: string;
  status: AssignedWorkoutStatus;
  created_at?: string;
  updated_at?: string;
  workout_templates?: {
    name: string;
    description: string | null;
  } | null;
  client_profiles?: {
    profiles?: {
      full_name: string;
    } | null;
  } | null;
};

export type AssignedWorkoutDetail = Omit<AssignedWorkout, "workout_templates"> & {
  workout_templates?: {
    id: string;
    name: string;
    description: string | null;
    workout_template_exercises?: {
      id: string;
      workout_template_id: string;
      exercise_id: string;
      order_index: number;
      sets: number;
      reps: string;
      target_weight: string | null;
      rest_seconds: number | null;
      tempo: string | null;
      notes: string | null;
      exercises?: {
        name: string;
        muscle_group: string;
      } | null;
    }[];
  } | null;
};
