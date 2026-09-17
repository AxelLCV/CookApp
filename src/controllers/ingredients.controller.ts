import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";
import { IngredientRepository } from "../repositories/ingredient.repository.js";
import { IngredientsService } from "../services/ingredients.service.js";
const ingredientsService = new IngredientsService(new IngredientRepository(prisma));

export const ingredientsController = {
  create: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.body;
    const languageId = req.user?.languageId as number;
    const result = await ingredientsService.create(input, languageId);
    return res.status(201).json(result);
  }),

  getMany: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.query;
    const languageId = req.user?.languageId as number;
    const result = await ingredientsService.getMany(input, languageId);
    return res.status(200).json(result);
  }),

  delete: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.params;
    await ingredientsService.delete(input);
    return res.status(204).send();
  })
};
