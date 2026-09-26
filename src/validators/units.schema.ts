import { z } from "zod";
import { idParamSchema } from "./common.schema.js";

export { getManySchema, deleteSchema } from "./common.schema.js";
export type { GetManyInput, DeleteInput } from "./common.schema.js";

export const createSchema = {
  body: z.object({
    name: z.string(),
    type: z.enum(["WEIGHT", "VOLUME", "QUANTITY"]),
  }),
};

export type CreateInput = z.infer<typeof createSchema.body>;

export const updateSchema = {
  params: idParamSchema,
  body: createSchema.body.partial(),
};

export type UpdateInput = z.infer<typeof updateSchema.body>;

export const addConversionSchema = {
  params: idParamSchema,
  body: z.object({
    targetUnitId: z.number().int(),
    factor: z.number().positive(),
  }),
};

export type AddConversionInput = z.infer<typeof addConversionSchema.body>;

export const getConversionsSchema = {
  params: idParamSchema,
};

export const removeConversionSchema = {
  params: z.object({
    id: z.coerce.number(),
    targetUnitId: z.coerce.number(),
  }),
};

export type RemoveConversionParams = z.infer<typeof removeConversionSchema.params>;

export const convertQuerySchema = {
  query: z.object({
    fromUnitId: z.coerce.number().int(),
    toUnitId: z.coerce.number().int(),
    quantity: z.coerce.number(),
  }),
};

export type ConvertQueryInput = z.infer<typeof convertQuerySchema.query>;
