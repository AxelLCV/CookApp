import { ReviewWithUser } from "../repositories/review.repository.js";

export interface IReviewRepository {
  findMany(recipeId: number, skip: number, take: number): Promise<ReviewWithUser[]>;
  count(recipeId: number): Promise<number>;
  average(recipeId: number): Promise<number | null>;
  findOne(userId: string, recipeId: number): Promise<ReviewWithUser | null>;
  upsert(userId: string, recipeId: number, languageId: number, note: number, description: string): Promise<ReviewWithUser>;
  delete(userId: string, recipeId: number): Promise<void>;
}
