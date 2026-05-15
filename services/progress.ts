import { supabase } from "@/lib/supabase";
import type { ProgressEntry, ProgressPhoto } from "@/types/progress";

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

type UploadProgressPhotoInput = {
  clientId: string;
  uri: string;
  mimeType?: string;
  photoType?: string;
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
  },

  async listProgressPhotos() {
    const { data, error } = await supabase
      .from("progress_photos")
      .select("id, client_id, image_path, photo_type, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const photos = (data ?? []) as ProgressPhoto[];
    return Promise.all(
      photos.map(async (photo) => {
        const { data: signedUrlData } = await supabase.storage
          .from("progress-photos")
          .createSignedUrl(photo.image_path, 60 * 10);

        return {
          ...photo,
          signed_url: signedUrlData?.signedUrl ?? null
        };
      })
    );
  },

  async uploadProgressPhoto({ clientId, uri, mimeType, photoType }: UploadProgressPhotoInput) {
    const response = await fetch(uri);
    const blob = await response.blob();
    const extension = mimeType?.split("/")[1] ?? "jpg";
    const imagePath = `${clientId}/${Date.now()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("progress-photos")
      .upload(imagePath, blob, {
        contentType: mimeType ?? "image/jpeg",
        upsert: false
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data, error } = await supabase
      .from("progress_photos")
      .insert({
        client_id: clientId,
        image_path: imagePath,
        photo_type: photoType || null
      })
      .select("id, client_id, image_path, photo_type, created_at")
      .single<ProgressPhoto>();

    if (error) {
      throw error;
    }

    return data;
  }
};
