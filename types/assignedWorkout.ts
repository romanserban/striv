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
