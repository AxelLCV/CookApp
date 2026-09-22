import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";
import { RecipeRepository } from "../repositories/recipe.repository.js";
import { RecipesService } from "../services/recipes.service.js";
const recipesService = new RecipesService(new RecipeRepository(prisma));

export const recipesController = {
  create: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.body;
    const userId = req.user?.id as string;
    const languageId = req.user?.languageId as number;
    const result = await recipesService.create(input, userId, languageId);
    return res.status(201).json(result);
  }),

  getMany: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated?.query;
    const result = await recipesService.getMany(input, req.user?.id);
    return res.status(200).json(result);
  }),

  get: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.params;
    const result = await recipesService.get(input, req.user?.id);
    return res.status(200).json(result);
  }),

  toggleFavorite: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { slug } = req.validated!.params;
    const userId = req.user!.id as string;
    const result = await recipesService.toggleFavorite(slug, userId);
    return res.status(200).json(result);
  }),

  delete: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.params;
    await recipesService.delete(input);
    return res.status(204).send();
  })
};
