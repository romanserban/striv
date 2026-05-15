import { z } from "zod";

export const workoutTemplateSchema = z.object({
  name: z.string().trim().min(2, "validation.workoutNameMin"),
  description: z.string().trim().optional()
});

export const workoutTemplateExerciseSchema = z.object({
  sets: z.string().trim().regex(/^\d+$/, "validation.integer"),
  reps: z.string().trim().min(1, "validation.repsMin"),
  targetWeight: z.string().trim().optional(),
  restSeconds: z.string().trim().regex(/^\d*$/, "validation.integer").optional(),
  tempo: z.string().trim().optional(),
  notes: z.string().trim().optional()
});

export type WorkoutTemplateFormValues = z.infer<typeof workoutTemplateSchema>;
export type WorkoutTemplateExerciseFormValues = z.infer<typeof workoutTemplateExerciseSchema>;
