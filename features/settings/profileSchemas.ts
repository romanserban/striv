import { z } from "zod";

const optionalDecimal = z
  .string()
  .trim()
  .refine((value) => value === "" || /^\d+(\.\d+)?$/.test(value), "validation.number");

export const coachProfileSchema = z.object({
  fullName: z.string().trim().min(2, "validation.nameMin"),
  bio: z.string().trim().optional(),
  specialty: z.string().trim().optional()
});

export const clientProfileSchema = z.object({
  fullName: z.string().trim().min(2, "validation.nameMin"),
  goal: z.string().trim().min(2, "validation.goalMin"),
  trainingLevel: z.string().trim().min(2, "validation.trainingLevelMin"),
  heightCm: optionalDecimal,
  startingWeightKg: optionalDecimal
});

export const inviteCodeSchema = z.object({
  inviteCode: z.string().trim().min(4, "validation.inviteCodeMin")
});

export type CoachProfileFormValues = z.infer<typeof coachProfileSchema>;
export type ClientProfileFormValues = z.infer<typeof clientProfileSchema>;
export type InviteCodeFormValues = z.infer<typeof inviteCodeSchema>;
