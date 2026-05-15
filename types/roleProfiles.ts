export type CoachProfile = {
  id: string;
  user_id: string;
  bio: string | null;
  specialty: string | null;
  invite_code: string;
  created_at?: string;
  updated_at?: string;
};

export type ClientProfile = {
  id: string;
  user_id: string;
  coach_id: string | null;
  goal: string | null;
  training_level: string | null;
  height_cm: number | null;
  starting_weight_kg: number | null;
  created_at?: string;
  updated_at?: string;
};
