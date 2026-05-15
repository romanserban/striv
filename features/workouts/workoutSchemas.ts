import { z } from "zod";

export const workoutTemplateSchema = z.object({
  name: z.string().trim().min(2, "validation.workoutNameMin"),
  description: z.string().trim().optional()
});

export type WorkoutTemplateFormValues = z.infer<typeof workoutTemplateSchema>;
