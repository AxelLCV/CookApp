import { PrismaClient, Prisma, Recipe } from "../generated/prisma/client.js";
import { IRecipeRepository } from "../interfaces/recipe.repository.interface.js";

const subRecipeReferenceSelect = {
  id: true,
  slug: true,
  part: true,
  translations: { select: { name: true, languageId: true } },
} satisfies Prisma.RecipeSelect;

export const recipeDetailInclude = {
  translations: true,
  steps: {
    orderBy: { position: "asc" },
    include: {
      translations: true,
      subRecipe: { select: subRecipeReferenceSelect },
    },
  },
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

  findById(id: number): Promise<RecipeWithDetails | null> {
    return this.prisma.recipe.findUnique({
      where: { id },
      include: recipeDetailInclude,
    });
  }

  create(data: Prisma.RecipeCreateInput | Prisma.RecipeUncheckedCreateInput): Promise<Recipe> {
    return this.prisma.recipe.create({
      data,
      include: {
        translations: true,
        steps: { include: { translations: true, subRecipe: { select: subRecipeReferenceSelect } } },
        ingredients: { include: { ingredient: true, unit: true } },
        ustensils: { include: { ustensil: true } },
        tags: { include: { tag: true } },
        wines: { include: { wine: true } },
      },
    });
  }

  update(id: number, data: Prisma.RecipeUpdateInput): Promise<RecipeWithDetails> {
    return this.prisma.recipe.update({
      where: { id },
      data,
      include: recipeDetailInclude,
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

  findFavorite(userId: string, recipeId: number) {
    return this.prisma.favorite.findUnique({
      where: { userId_recipeId: { userId, recipeId } },
    });
  }

  async addFavorite(userId: string, recipeId: number): Promise<void> {
    await this.prisma.favorite.create({ data: { userId, recipeId } });
  }

  async removeFavorite(userId: string, recipeId: number): Promise<void> {
    await this.prisma.favorite.delete({
      where: { userId_recipeId: { userId, recipeId } },
    });
  }
}
