import { z } from "zod";

export const loginSchema = {
  body: z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
};

// Inférer le type TypeScript
export type LoginInput = z.infer<typeof loginSchema.body>;

export const registerSchema = {
  body: z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
};

// Inférer le type TypeScript
export type RegisterInput = z.infer<typeof registerSchema.body>;