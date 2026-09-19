import { z } from "zod";

export const idParamSchema = z.object({
  id: z.coerce.number(),
});

export const deleteSchema = {
  params: idParamSchema,
};

export type DeleteInput = z.infer<typeof idParamSchema>;

export const searchQuerySchema = z.object({
  search: z.string().optional(),
});

export const getManySchema = {
  query: searchQuerySchema,
};

export type GetManyInput = z.infer<typeof searchQuerySchema>;
