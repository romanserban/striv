import { z } from "zod";

import { isValidIsoDate, isValidTime } from "@/utils/dateValidation";

export const scheduledSessionSchema = z
  .object({
    title: z.string().trim().min(1, "validation.sessionTitleMin"),
    description: z.string().trim().optional(),
    sessionType: z.string().trim().optional(),
    scheduledDate: z.string().trim().refine(isValidIsoDate, "validation.date"),
    startTime: z.string().trim().refine(isValidTime, "validation.time"),
    endTime: z.string().trim().refine(isValidTime, "validation.time"),
    location: z.string().trim().optional()
  })
  .refine((values) => values.endTime > values.startTime, {
    message: "validation.endTimeAfterStart",
    path: ["endTime"]
  });

export type ScheduledSessionFormValues = z.infer<typeof scheduledSessionSchema>;

export function toSessionDateTime(date: string, time: string) {
  return new Date(`${date}T${time}:00`).toISOString();
}
