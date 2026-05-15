export type Exercise = {
  id: string;
  coach_id: string | null;
  name: string;
  muscle_group: string;
  equipment: string | null;
  instructions: string | null;
  media_url: string | null;
  is_global: boolean;
  created_at?: string;
  updated_at?: string;
};
