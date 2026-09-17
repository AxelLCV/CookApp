import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";
import { UstensilRepository } from "../repositories/ustensil.repository.js";
import { UstensilsService } from "../services/ustensils.service.js";
const ustensilsService = new UstensilsService(new UstensilRepository(prisma));

export const ustensilsController = {
  create: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.body;
    const languageId = req.user?.languageId as number;
    const result = await ustensilsService.create(input, languageId);
    return res.status(201).json(result);
  }),

  getMany: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.query;
    const languageId = req.user?.languageId as number;
    const result = await ustensilsService.getMany(input, languageId);
    return res.status(200).json(result);
  }),

  delete: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.params;
    await ustensilsService.delete(input);
    return res.status(204).send();
  })
};
