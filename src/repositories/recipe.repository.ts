import { PrismaClient, Prisma, Recipe } from "../generated/prisma/client.js";
import { IRecipeRepository } from "../interfaces/recipe.repository.interface.js";

export const recipeDetailInclude = {
  translations: true,
  ingredients: {
    include: {
      ingredient: { include: { translations: true } },
      unit: { include: { translations: true } },
    },
  },
  ustensils: { include: { ustensil: { include: { translations: true } } } },
  tags: { include: { tag: { include: { translations: true } } } },
  wines: { include: { wine: { include: { translations: true } } } },
} satisfies Prisma.RecipeInclude;

export type RecipeWithDetails = Prisma.RecipeGetPayload<{ include: typeof recipeDetailInclude }>;

export class RecipeRepository implements IRecipeRepository {
  constructor(private prisma: PrismaClient) {}

  findBySlug(slug: string): Promise<RecipeWithDetails | null> {
    return this.prisma.recipe.findUnique({
      where: { slug },
      include: recipeDetailInclude,
    });
  }

  create(data: Prisma.RecipeCreateInput | Prisma.RecipeUncheckedCreateInput): Promise<Recipe> {
    return this.prisma.recipe.create({
      data,
      include: {
        translations: true,
        ingredients: { include: { ingredient: true, unit: true } },
        ustensils: { include: { ustensil: true } },
        tags: { include: { tag: true } },
        wines: { include: { wine: true } },
      },
    });
  }

  findMany(args: Prisma.RecipeFindManyArgs): Promise<Recipe[]> {
    return this.prisma.recipe.findMany(args);
  }

  count(args: Prisma.RecipeCountArgs): Promise<number> {
    return this.prisma.recipe.count(args);
  }

  delete(where: Prisma.RecipeWhereUniqueInput): Promise<Recipe> {
    return this.prisma.recipe.delete({ where });
  }
}
