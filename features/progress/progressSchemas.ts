import { z } from "zod";

const optionalDecimal = z
  .string()
  .trim()
  .refine((value) => value === "" || /^\d+(\.\d+)?$/.test(value), "validation.number");

export const progressEntrySchema = z.object({
  weightKg: optionalDecimal,
  waistCm: optionalDecimal,
  chestCm: optionalDecimal,
  hipsCm: optionalDecimal,
  armCm: optionalDecimal,
  energyLevel: z.string().trim().regex(/^[1-5]?$/, "validation.energyLevel"),
  notes: z.string().trim().optional()
});

export type ProgressEntryFormValues = z.infer<typeof progressEntrySchema>;
