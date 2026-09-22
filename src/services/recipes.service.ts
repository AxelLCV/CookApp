import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";
import { IRecipeRepository } from "../interfaces/recipe.repository.interface.js";
import { CreateInput, GetManyInput, GetInput, DeleteInput} from "../validators/recipes.schema.js";

export class RecipesService {
  constructor(private repo: IRecipeRepository) {}

  async create(data: CreateInput, userId: string, languageId: number) {
    const existingSlug = await this.repo.findBySlug(data.slug);
    if (existingSlug) {
      throw new AppError(ErrorCodes.SLUG_EXIST);
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
          stage: data.stage,
          languageId: languageId
        }
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
    const { page, limit, sortBy, sortOrder, favoritedByMe, ...filters } = query;
    const skip = (page - 1) * limit;
    const where = {
      ...filters,
      ...(favoritedByMe ? { favorites: { some: { userId } } } : {}),
    };
    const [result, total] = await Promise.all([
      this.repo.findMany({
          where,
          orderBy: sortBy ? { [sortBy]: sortOrder } : { createdAt: 'desc' },
          skip,
          take: limit,
          include: { translations: true },
        }),
      this.repo.count({ where }),
    ]);
    return {
    data: result,
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
    return { result: { ...result, isFavorited } };
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
}
