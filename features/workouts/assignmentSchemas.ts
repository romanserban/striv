import { z } from "zod";

export const workoutAssignmentSchema = z.object({
  scheduledDate: z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "validation.date")
});

export type WorkoutAssignmentFormValues = z.infer<typeof workoutAssignmentSchema>;
