import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("validation.email"),
  password: z.string().min(6, "validation.passwordMin")
});

export const signupSchema = z.object({
  fullName: z.string().trim().min(2, "validation.nameMin"),
  email: z.string().trim().email("validation.email"),
  password: z.string().min(6, "validation.passwordMin")
});

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email("validation.email")
});

export const roleSchema = z.object({
  role: z.enum(["coach", "client"])
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
