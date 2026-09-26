import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";
import { ReviewRepository } from "../repositories/review.repository.js";
import { RecipeRepository } from "../repositories/recipe.repository.js";
import { ReviewsService } from "../services/reviews.service.js";

const reviewsService = new ReviewsService(new ReviewRepository(prisma), new RecipeRepository(prisma));

export const reviewsController = {
  getMany: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.validated!.params;
    const query = req.validated!.query;
    const result = await reviewsService.getMany(slug, query);
    return res.status(200).json(result);
  }),

  upsert: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.validated!.params;
    const input = req.validated!.body;
    const userId = req.user!.id as string;
    const languageId = req.user!.languageId as number;
    const result = await reviewsService.upsert(slug, userId, languageId, input);
    return res.status(200).json(result);
  }),

  deleteMine: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.validated!.params;
    const userId = req.user!.id as string;
    await reviewsService.deleteMine(slug, userId);
    return res.status(204).send();
  }),
};
