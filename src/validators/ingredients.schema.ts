import { z } from "zod";
import { idParamSchema } from "./common.schema.js";

export { getManySchema, deleteSchema } from "./common.schema.js";
export type { GetManyInput, DeleteInput } from "./common.schema.js";

export const createSchema = {
  body: z.object({
    name: z.string(),
    departmentId: z.number(),
    density: z.number().optional(),
    averageWeight: z.number().optional(),
    image: z.string().url().optional(),
  }),
};

export type CreateInput = z.infer<typeof createSchema.body>;

export const updateSchema = {
  params: idParamSchema,
  body: createSchema.body.partial(),
};

export type UpdateInput = z.infer<typeof updateSchema.body>;

export const getSchema = {
  params: idParamSchema,
};

export type GetInput = z.infer<typeof getSchema.params>;

export const addUnitSchema = {
  params: idParamSchema,
  body: z.object({
    unitId: z.number().int(),
    isDefault: z.boolean().optional(),
  }),
};

export type AddUnitInput = z.infer<typeof addUnitSchema.body>;

export const removeUnitSchema = {
  params: z.object({
    id: z.coerce.number(),
    unitId: z.coerce.number(),
  }),
};

export type RemoveUnitParams = z.infer<typeof removeUnitSchema.params>;
