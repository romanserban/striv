import { supabase } from "@/lib/supabase";
import type { ProgressEntry } from "@/types/progress";

type CreateProgressEntryInput = {
  clientId: string;
  weightKg?: number | null;
  waistCm?: number | null;
  chestCm?: number | null;
  hipsCm?: number | null;
  armCm?: number | null;
  energyLevel?: number | null;
  notes?: string;
};

export const progressService = {
  async listProgressEntries() {
    const { data, error } = await supabase
      .from("progress_entries")
      .select("id, client_id, weight_kg, waist_cm, chest_cm, hips_cm, arm_cm, energy_level, notes, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    return (data ?? []) as ProgressEntry[];
  },

  async createProgressEntry({
    clientId,
    weightKg,
    waistCm,
    chestCm,
    hipsCm,
    armCm,
    energyLevel,
    notes
  }: CreateProgressEntryInput) {
    const { data, error } = await supabase
      .from("progress_entries")
      .insert({
        client_id: clientId,
        weight_kg: weightKg ?? null,
        waist_cm: waistCm ?? null,
        chest_cm: chestCm ?? null,
        hips_cm: hipsCm ?? null,
        arm_cm: armCm ?? null,
        energy_level: energyLevel ?? null,
        notes: notes || null
      })
      .select("id, client_id, weight_kg, waist_cm, chest_cm, hips_cm, arm_cm, energy_level, notes, created_at")
      .single<ProgressEntry>();

    if (error) {
      throw error;
    }

    return data;
  }
};
