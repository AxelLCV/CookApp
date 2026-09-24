import { Prisma, Recipe, Favorite } from "../generated/prisma/client.js";
import { RecipeWithDetails } from "../repositories/recipe.repository.js";
export interface IRecipeRepository {
  findBySlug(slug: string): Promise<RecipeWithDetails | null>;
  findById(id: number): Promise<RecipeWithDetails | null>;
  create(data: Prisma.RecipeCreateInput | Prisma.RecipeUncheckedCreateInput): Promise<Recipe>;
  findMany(args: Prisma.RecipeFindManyArgs): Promise<Recipe[]>;
  count(args: Prisma.RecipeCountArgs): Promise<number>;
  delete(where: Prisma.RecipeWhereUniqueInput): Promise<Recipe>;
  findFavorite(userId: string, recipeId: number): Promise<Favorite | null>;
  addFavorite(userId: string, recipeId: number): Promise<void>;
  removeFavorite(userId: string, recipeId: number): Promise<void>;
}
