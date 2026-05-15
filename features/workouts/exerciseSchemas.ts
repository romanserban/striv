import { z } from "zod";

export const exerciseSchema = z.object({
  name: z.string().trim().min(2, "validation.exerciseNameMin"),
  muscleGroup: z.string().trim().min(2, "validation.muscleGroupMin"),
  equipment: z.string().trim().optional(),
  instructions: z.string().trim().optional(),
  mediaUrl: z.string().trim().url("validation.url").or(z.literal("")).optional()
});

export type ExerciseFormValues = z.infer<typeof exerciseSchema>;
