import { z } from "zod";

export const createSchema = {
  body: z.object({
    name: z.string(),
    departmentId: z.number(),
    density: z.number().optional(),
    averageWeight: z.number().optional(),
  }),
};

export type CreateInput = z.infer<typeof createSchema.body>;

export const getManySchema = {
  query: z.object({
    search: z.string().optional()
  }),
};

export type GetManyInput = z.infer<typeof getManySchema.query>;

export const deleteSchema = {
  params: z.object({
    id: z.number().optional()
  }),
};

export type DeleteInput = z.infer<typeof deleteSchema.params>;