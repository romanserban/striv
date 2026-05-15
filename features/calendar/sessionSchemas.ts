import { z } from "zod";

const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
const timeRegex = /^\d{2}:\d{2}$/;

export const scheduledSessionSchema = z
  .object({
    title: z.string().trim().min(1, "validation.sessionTitleMin"),
    description: z.string().trim().optional(),
    sessionType: z.string().trim().optional(),
    scheduledDate: z.string().trim().regex(dateRegex, "validation.date"),
    startTime: z.string().trim().regex(timeRegex, "validation.time"),
    endTime: z.string().trim().regex(timeRegex, "validation.time"),
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
