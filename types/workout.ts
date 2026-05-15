export type WorkoutTemplate = {
  id: string;
  coach_id: string;
  name: string;
  description: string | null;
  created_at?: string;
  updated_at?: string;
};

export type WorkoutTemplateExercise = {
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
};
