import { z } from "zod";
import { idParamSchema } from "./common.schema.js";

export { getManySchema, deleteSchema } from "./common.schema.js";
export type { GetManyInput, DeleteInput } from "./common.schema.js";

export const createSchema = {
  body: z.object({
    name: z.string(),
    country: z.string().optional(),
    region: z.string().optional(),
    image: z.string().url().optional(),
  }),
};

export type CreateInput = z.infer<typeof createSchema.body>;

export const updateSchema = {
  params: idParamSchema,
  body: createSchema.body.partial(),
};

export type UpdateInput = z.infer<typeof updateSchema.body>;
