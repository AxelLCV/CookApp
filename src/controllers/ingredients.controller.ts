import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";
import { Ingredient, Prisma } from "../generated/prisma/client.js";
import { GenericRepository } from "../repositories/generic.repository.js";
import { IngredientsService } from "../services/ingredients.service.js";
import { createCrudController } from "./crud.controller.factory.js";

const ingredientsService = new IngredientsService(
  new GenericRepository<
    Ingredient,
    Prisma.IngredientCreateInput | Prisma.IngredientUncheckedCreateInput,
    Prisma.IngredientUpdateInput | Prisma.IngredientUncheckedUpdateInput,
    Prisma.IngredientWhereUniqueInput,
    Prisma.IngredientFindManyArgs
  >(prisma.ingredient),
  prisma
);

export const ingredientsController = {
  ...createCrudController(ingredientsService),

  get: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.validated!.params as { id: number };
    const languageId = req.user?.languageId as number;
    const result = await ingredientsService.get(id, languageId);
    return res.status(200).json(result);
  }),

  addUnit: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.validated!.params as { id: number };
    const input = req.validated!.body;
    const result = await ingredientsService.addUnit(id, input);
    return res.status(201).json(result);
  }),

  removeUnit: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id, unitId } = req.validated!.params as { id: number; unitId: number };
    await ingredientsService.removeUnit(id, unitId);
    return res.status(204).send();
  }),
};
