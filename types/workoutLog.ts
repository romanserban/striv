export type WorkoutLog = {
  id: string;
  assigned_workout_id: string;
  client_id: string;
  started_at: string | null;
  completed_at: string | null;
  client_notes: string | null;
  created_at?: string;
};
