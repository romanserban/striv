export type WorkoutLog = {
  id: string;
  assigned_workout_id: string;
  client_id: string;
  started_at: string | null;
  completed_at: string | null;
  client_notes: string | null;
  created_at?: string;
};

export type WorkoutSetLog = {
  id: string;
  workout_log_id: string;
  exercise_id: string;
  set_number: number;
  actual_reps: number | null;
  actual_weight: number | null;
  completed: boolean;
  notes: string | null;
  created_at?: string;
};
