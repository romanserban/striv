export type ProgressEntry = {
  id: string;
  client_id: string;
  weight_kg: number | null;
  waist_cm: number | null;
  chest_cm: number | null;
  hips_cm: number | null;
  arm_cm: number | null;
  energy_level: number | null;
  notes: string | null;
  created_at: string;
};
