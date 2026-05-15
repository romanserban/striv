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

export type ProgressPhoto = {
  id: string;
  client_id: string;
  image_path: string;
  photo_type: string | null;
  created_at: string;
  signed_url?: string | null;
};
