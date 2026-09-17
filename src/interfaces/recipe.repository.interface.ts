import { Prisma, Recipe } from "../generated/prisma/client.js";
export interface IRecipeRepository {
  findBySlug(slug: string): Promise<Recipe | null>;
  create(data: Prisma.RecipeCreateInput | Prisma.RecipeUncheckedCreateInput): Promise<Recipe>;
  findMany(args: Prisma.RecipeFindManyArgs): Promise<Recipe[]>;
  count(args: Prisma.RecipeCountArgs): Promise<number>;
  delete(where: Prisma.RecipeWhereUniqueInput): Promise<Recipe>;
}
