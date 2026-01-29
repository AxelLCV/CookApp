import { z } from "zod";

export const createRecipeSchema = {
  body: z.object({
    name: z.string(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters (a–z), numbers (0–9), and hyphens (-) "),
    images: z.array(z.string()).optional(),
    description: z.string().optional(),
    part: z.number().int(),
    note: z.number().gte(0).lte(5).optional(),
    preparationTime: z.number().int().optional(),
    cookingTime: z.number().int().optional(),
    restTime: z.number().int().optional(),
    stage: z.array(z.string()),
  }),
};

// Inférer le type TypeScript
export type createRecipeInput = z.infer<typeof createRecipeSchema.body>;

export const deleteRecipeSchema = {
  params: z.object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must contain only lowercase letters (a–z), numbers (0–9), and hyphens (-) ")
  }),
};

// Inférer le type TypeScript
export type deleteRecipeInput = z.infer<typeof deleteRecipeSchema.params>;