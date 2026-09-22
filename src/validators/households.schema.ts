import { z } from "zod";

export const createSchema = {
  body: z.object({
    name: z.string().min(1).max(100),
  }),
};

export type CreateInput = z.infer<typeof createSchema.body>;

export const getSchema = {
  params: z.object({
    id: z.string(),
  }),
};

export type GetInput = z.infer<typeof getSchema.params>;

export const updateSchema = {
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    name: z.string().min(1).max(100),
  }),
};

export type UpdateParams = z.infer<typeof updateSchema.params>;
export type UpdateInput = z.infer<typeof updateSchema.body>;

export const deleteSchema = {
  params: z.object({
    id: z.string(),
  }),
};

export type DeleteInput = z.infer<typeof deleteSchema.params>;

export const addMemberSchema = {
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    username: z.string().min(1),
  }),
};

export type AddMemberParams = z.infer<typeof addMemberSchema.params>;
export type AddMemberInput = z.infer<typeof addMemberSchema.body>;

export const removeMemberSchema = {
  params: z.object({
    id: z.string(),
    userId: z.string(),
  }),
};

export type RemoveMemberParams = z.infer<typeof removeMemberSchema.params>;
