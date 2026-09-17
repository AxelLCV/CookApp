import { Prisma, Ingredient } from "../generated/prisma/client.js";

export interface IIngredientRepository {
  create(data: Prisma.IngredientCreateInput | Prisma.IngredientUncheckedCreateInput): Promise<Ingredient>;
  findMany(args: Prisma.IngredientFindManyArgs): Promise<Ingredient[]>;
  delete(where: Prisma.IngredientWhereUniqueInput): Promise<Ingredient>;
}
