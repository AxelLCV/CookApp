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

export const addIngredientSchema = {
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    ingredientId: z.number().int(),
    unitId: z.number().int(),
    quantity: z.number().positive(),
  }),
};

export type AddIngredientParams = z.infer<typeof addIngredientSchema.params>;
export type AddIngredientInput = z.infer<typeof addIngredientSchema.body>;

export const updateIngredientSchema = {
  params: z.object({
    id: z.string(),
    ingredientId: z.coerce.number().int(),
  }),
  body: z.object({
    unitId: z.number().int().optional(),
    quantity: z.number().positive().optional(),
  }),
};

export type UpdateIngredientParams = z.infer<typeof updateIngredientSchema.params>;
export type UpdateIngredientInput = z.infer<typeof updateIngredientSchema.body>;

export const removeIngredientSchema = {
  params: z.object({
    id: z.string(),
    ingredientId: z.coerce.number().int(),
  }),
};

export type RemoveIngredientParams = z.infer<typeof removeIngredientSchema.params>;

export const addUstensilSchema = {
  params: z.object({
    id: z.string(),
  }),
  body: z.object({
    ustensilId: z.number().int(),
  }),
};

export type AddUstensilParams = z.infer<typeof addUstensilSchema.params>;
export type AddUstensilInput = z.infer<typeof addUstensilSchema.body>;

export const removeUstensilSchema = {
  params: z.object({
    id: z.string(),
    ustensilId: z.coerce.number().int(),
  }),
};

export type RemoveUstensilParams = z.infer<typeof removeUstensilSchema.params>;

export const addShoppingListItemSchema = {
  params: z.object({
    id: z.string(),
  }),
  body: z
    .object({
      ingredientId: z.number().int().optional(),
      customLabel: z.string().min(1).optional(),
      quantity: z.number().positive().optional(),
      unitId: z.number().int().optional(),
    })
    .refine((data) => data.ingredientId !== undefined || data.customLabel !== undefined, {
      message: "ingredientId ou customLabel requis",
    }),
};

export type AddShoppingListItemParams = z.infer<typeof addShoppingListItemSchema.params>;
export type AddShoppingListItemInput = z.infer<typeof addShoppingListItemSchema.body>;

export const updateShoppingListItemSchema = {
  params: z.object({
    id: z.string(),
    itemId: z.coerce.number().int(),
  }),
  body: z.object({
    quantity: z.number().positive().optional(),
    unitId: z.number().int().optional(),
    isChecked: z.boolean().optional(),
  }),
};

export type UpdateShoppingListItemParams = z.infer<typeof updateShoppingListItemSchema.params>;
export type UpdateShoppingListItemInput = z.infer<typeof updateShoppingListItemSchema.body>;

export const removeShoppingListItemSchema = {
  params: z.object({
    id: z.string(),
    itemId: z.coerce.number().int(),
  }),
};

export type RemoveShoppingListItemParams = z.infer<typeof removeShoppingListItemSchema.params>;
