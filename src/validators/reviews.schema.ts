import { z } from "zod";
const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const slugMessage = "Slug must contain only lowercase letters (a–z), numbers (0–9), and hyphens (-)";

export const upsertSchema = {
  params: z.object({
    slug: z.string().regex(slugRegex, slugMessage),
  }),
  body: z.object({
    note: z.number().gte(0).lte(5),
    description: z.string().min(1),
  }),
};

export type UpsertParams = z.infer<typeof upsertSchema.params>;
export type UpsertInput = z.infer<typeof upsertSchema.body>;

export const getManySchema = {
  params: z.object({
    slug: z.string().regex(slugRegex, slugMessage),
  }),
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(50).default(10),
  }),
};

export type GetManyParams = z.infer<typeof getManySchema.params>;
export type GetManyInput = z.infer<typeof getManySchema.query>;

export const deleteSchema = {
  params: z.object({
    slug: z.string().regex(slugRegex, slugMessage),
  }),
};

export type DeleteParams = z.infer<typeof deleteSchema.params>;
