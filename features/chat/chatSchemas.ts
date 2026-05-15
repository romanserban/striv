import { z } from "zod";

export const messageSchema = z.object({
  body: z.string().trim().min(1, "validation.messageMin")
});

export type MessageFormValues = z.infer<typeof messageSchema>;
