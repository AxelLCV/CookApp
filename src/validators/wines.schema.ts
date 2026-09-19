import { z } from "zod";

export { getManySchema, deleteSchema } from "./common.schema.js";
export type { GetManyInput, DeleteInput } from "./common.schema.js";

export const createSchema = {
  body: z.object({
    name: z.string(),
    country: z.string().optional(),
    region: z.string().optional(),
  }),
};

export type CreateInput = z.infer<typeof createSchema.body>;
