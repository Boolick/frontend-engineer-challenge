import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("invalid email format"),
  password: z.string().min(8, "password does not meet policy"),
});

export const registerSchema = z
  .object({
    email: z.string().email("invalid email format"),
    password: z
      .string()
      .min(8, "password does not meet policy")
      .regex(/[A-Z]/, "password does not meet policy")
      .regex(/[a-z]/, "password does not meet policy")
      .regex(/[0-9]/, "password does not meet policy")
      .regex(/[^A-Za-z0-9]/, "password does not meet policy"),
    confirmPassword: z.string().min(8, "password does not meet policy"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords_mismatch",
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email("invalid email format"),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, "password does not meet policy")
      .regex(/[A-Z]/, "password does not meet policy")
      .regex(/[a-z]/, "password does not meet policy")
      .regex(/[0-9]/, "password does not meet policy")
      .regex(/[^A-Za-z0-9]/, "password does not meet policy"),
    confirmPassword: z.string().min(8, "password does not meet policy"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "passwords_mismatch",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

