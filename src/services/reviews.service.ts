import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";
import { IReviewRepository } from "../interfaces/review.repository.interface.js";
import { IRecipeRepository } from "../interfaces/recipe.repository.interface.js";
import { UpsertInput, GetManyInput } from "../validators/reviews.schema.js";

export class ReviewsService {
  constructor(
    private reviewRepo: IReviewRepository,
    private recipeRepo: IRecipeRepository
  ) {}

  async getMany(slug: string, query: GetManyInput) {
    const recipeId = await this.getRecipeId(slug);
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [data, total, average] = await Promise.all([
      this.reviewRepo.findMany(recipeId, skip, limit),
      this.reviewRepo.count(recipeId),
      this.reviewRepo.average(recipeId),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        average,
      },
    };
  }

  async upsert(slug: string, userId: string, languageId: number, data: UpsertInput) {
    const recipeId = await this.getRecipeId(slug);
    const result = await this.reviewRepo.upsert(userId, recipeId, languageId, data.note, data.description);
    return { result };
  }

  async deleteMine(slug: string, userId: string) {
    const recipeId = await this.getRecipeId(slug);
    const existing = await this.reviewRepo.findOne(userId, recipeId);
    if (!existing) {
      throw new AppError(ErrorCodes.REVIEW_NOT_FOUND);
    }
    await this.reviewRepo.delete(userId, recipeId);
  }

  private async getRecipeId(slug: string): Promise<number> {
    const recipe = await this.recipeRepo.findBySlug(slug);
    if (!recipe) {
      throw new AppError(ErrorCodes.RECIPE_NOT_FOUND);
    }
    return recipe.id;
  }
}
