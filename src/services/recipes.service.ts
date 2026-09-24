import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";
import { Recipe } from "../generated/prisma/client.js";
import { IRecipeRepository } from "../interfaces/recipe.repository.interface.js";
import { RecipeWithDetails } from "../repositories/recipe.repository.js";
import { CreateInput, GetManyInput, GetInput, DeleteInput} from "../validators/recipes.schema.js";

const MAX_STEP_DEPTH = 8;

type ResolvedStep =
  | { type: "text"; translations: RecipeWithDetails["steps"][number]["translations"] }
  | {
      type: "recipe";
      recipe: {
        id: number;
        slug: string;
        translations: { name: string; languageId: number }[];
      };
      scale: number;
      ingredients: RecipeWithDetails["ingredients"];
      steps: ResolvedStep[];
    };

export class RecipesService {
  constructor(private repo: IRecipeRepository) {}

  async create(data: CreateInput, userId: string, languageId: number) {
    const existingSlug = await this.repo.findBySlug(data.slug);
    if (existingSlug) {
      throw new AppError(ErrorCodes.SLUG_EXIST);
    }

    const subRecipeIds = [...new Set(data.stage.filter((step) => step.type === "recipe").map((step) => step.recipeId))];
    if (subRecipeIds.length > 0) {
      const found = await this.repo.findMany({ where: { id: { in: subRecipeIds } } });
      if (found.length !== subRecipeIds.length) {
        throw new AppError(ErrorCodes.RECIPE_NOT_FOUND);
      }
    }

    const result = await this.repo.create({
      slug: data.slug,
      images: data.images,
      part: data.part,
      note: data.note,
      preparationTime: data.preparationTime,
      cookingTime: data.cookingTime,
      restTime: data.restTime,
      authorId: userId,
      translations: {
        create: {
          name: data.name,
          description: data.description,
          languageId: languageId
        }
      },
      steps: {
        create: data.stage.map((step, index) =>
          step.type === "recipe"
            ? { position: index, subRecipeId: step.recipeId }
            : { position: index, translations: { create: { text: step.text, languageId } } }
        ),
      },
      ingredients: data.ingredients ? {
        create: data.ingredients.map((i) => ({
          ingredientId: i.ingredientId,
          unitId: i.unitId,
          quantity: i.quantity,
        }))
      } : undefined,
      ustensils: data.ustensils ? {
        create: data.ustensils.map((u) => ({ ustensilId: u.ustensilId }))
      } : undefined,
      tags: data.tags ? {
        create: data.tags.map((t) => ({ tagId: t.tagId }))
      } : undefined,
      wines: data.wines ? {
        create: data.wines.map((w) => ({ wineId: w.wineId }))
      } : undefined,
    });
    return { result };
  }

  async getMany(query: GetManyInput, userId?: string) {
    const { page, limit, sortBy, sortOrder, favoritedByMe, search, ...filters } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...filters,
      ...(favoritedByMe ? { favorites: { some: { userId } } } : {}),
      ...(search ? { translations: { some: { name: { contains: search, mode: "insensitive" as const } } } } : {}),
    };
    const [result, total] = await Promise.all([
      this.repo.findMany({
          where,
          orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
          skip,
          take: limit,
          include: { translations: true, favorites: userId ? { where: { userId } } : false },
        }),
      this.repo.count({ where }),
    ]);
    const data = (result as Array<Recipe & { favorites?: unknown[] }>).map(({ favorites, ...recipe }) => ({
      ...recipe,
      isFavorited: Array.isArray(favorites) && favorites.length > 0,
    }));
    return {
    data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async get(data: GetInput, userId?: string) {
    const result = await this.repo.findBySlug(data.slug);
    if (!result) {
      throw new AppError(ErrorCodes.RECIPE_NOT_FOUND);
    }
    const isFavorited = userId ? Boolean(await this.repo.findFavorite(userId, result.id)) : false;
    const steps = await this.resolveSteps(result.steps, result.part, 0, new Set([result.id]));
    return { result: { ...result, isFavorited, steps } };
  }

  async toggleFavorite(slug: string, userId: string) {
    const recipe = await this.repo.findBySlug(slug);
    if (!recipe) {
      throw new AppError(ErrorCodes.RECIPE_NOT_FOUND);
    }
    const existing = await this.repo.findFavorite(userId, recipe.id);
    if (existing) {
      await this.repo.removeFavorite(userId, recipe.id);
      return { isFavorited: false };
    }
    await this.repo.addFavorite(userId, recipe.id);
    return { isFavorited: true };
  }

  async delete(data: DeleteInput) {
    const existing = await this.repo.findBySlug(data.slug);
    if (!existing) {
      throw new AppError(ErrorCodes.RECIPE_NOT_FOUND);
    }
    const result = await this.repo.delete({
      slug: data.slug
    });
    return { result };
  }

  // Sub-recipe steps only carry a shallow reference (repo.recipeDetailInclude);
  // each one is fetched and expanded here so nesting can go arbitrarily deep,
  // scaling every ingredient to match the top-level recipe's portions along the way.
  private async resolveSteps(
    steps: RecipeWithDetails["steps"],
    topLevelPart: number,
    depth: number,
    visited: Set<number>
  ): Promise<ResolvedStep[]> {
    const resolved: ResolvedStep[] = [];

    for (const step of steps) {
      if (!step.subRecipe) {
        resolved.push({ type: "text", translations: step.translations });
        continue;
      }

      if (depth >= MAX_STEP_DEPTH || visited.has(step.subRecipe.id)) {
        continue;
      }

      const subRecipe = await this.repo.findById(step.subRecipe.id);
      if (!subRecipe) {
        continue;
      }

      const scale = subRecipe.part > 0 ? topLevelPart / subRecipe.part : 1;
      const nextVisited = new Set(visited);
      nextVisited.add(subRecipe.id);

      resolved.push({
        type: "recipe",
        recipe: {
          id: subRecipe.id,
          slug: subRecipe.slug,
          translations: subRecipe.translations.map((t) => ({ name: t.name, languageId: t.languageId })),
        },
        scale,
        ingredients: this.scaleIngredients(subRecipe.ingredients, scale),
        steps: await this.resolveSteps(subRecipe.steps, topLevelPart, depth + 1, nextVisited),
      });
    }

    return resolved;
  }

  private scaleIngredients(ingredients: RecipeWithDetails["ingredients"], scale: number) {
    return ingredients.map((item) => ({
      ...item,
      quantity: Math.round(item.quantity * scale * 100) / 100,
    }));
  }
}
