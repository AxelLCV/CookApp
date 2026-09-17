import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";
import { UnitRepository } from "../repositories/unit.repository.js";
import { UnitsService } from "../services/units.service.js";
const unitsService = new UnitsService(new UnitRepository(prisma));

export const unitsController = {
  create: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.body;
    const languageId = req.user?.languageId as number;
    const result = await unitsService.create(input, languageId);
    return res.status(201).json(result);
  }),

  getMany: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.query;
    const languageId = req.user?.languageId as number;
    const result = await unitsService.getMany(input, languageId);
    return res.status(200).json(result);
  }),

  delete: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.params;
    await unitsService.delete(input);
    return res.status(204).send();
  })
};
