import { z } from "zod";

import { isValidIsoDate } from "@/utils/dateValidation";

export const workoutAssignmentSchema = z.object({
  scheduledDate: z.string().trim().refine(isValidIsoDate, "validation.date")
});

export type WorkoutAssignmentFormValues = z.infer<typeof workoutAssignmentSchema>;
