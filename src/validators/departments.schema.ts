import { z } from "zod";

export const createDepartmentSchema = {
  body: z.object({
    name: z.string()
  }),
};

export type createDepartmentInput = z.infer<typeof createDepartmentSchema.body>;

export const getDepartmentSchema = {
  query: z.object({
    search: z.string().optional()
  }),
};

export type getDepartmentInput = z.infer<typeof getDepartmentSchema.query>;