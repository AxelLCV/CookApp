import { z } from "zod";
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugMessage = "Slug must contain only lowercase letters (a–z), numbers (0–9), and hyphens (-)";

export const createSchema = {
  body: z.object({
    name: z.string(),
    description: z.string().optional(),
    stage: z.array(z.string()),
    slug: z.string().regex(slugRegex, slugMessage),
    images: z.array(z.string()).optional(),
    part: z.number().int(),
    note: z.number().gte(0).lte(5).optional(),
    preparationTime: z.number().int().optional(),
    cookingTime: z.number().int().optional(),
    restTime: z.number().int().optional(),
    isPublished: z.boolean().optional(),
    ingredients: z.array(z.object({
      ingredientId: z.number().int(),
      unitId: z.number().int(),
      quantity: z.number().positive(),
    })).optional(),
    ustensils: z.array(z.object({
      ustensilId: z.number().int(),
    })).optional(),
    tags: z.array(z.object({
      tagId: z.number().int(),
    })).optional(),
    wines: z.array(z.object({
      wineId: z.number().int(),
    })).optional(),
  }),
};

export type CreateInput = z.infer<typeof createSchema.body>;

export const getManySchema = {
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(10),
    sortBy: z.enum(['createdAt', 'note', 'preparationTime']).optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
    authorId: z.string().optional(),
    favoritedByMe: z.coerce.boolean().optional(),
  }),
};

export type GetManyInput = z.infer<typeof getManySchema.query>;

export const getSchema = {
  params: z.object({
    slug: z.string().regex(slugRegex, slugMessage),
  }),
};

export type GetInput = z.infer<typeof getSchema.params>;

export const deleteSchema = {
  params: z.object({
    slug: z.string().regex(slugRegex, slugMessage),
  }),
};

export type DeleteInput = z.infer<typeof deleteSchema.params>;