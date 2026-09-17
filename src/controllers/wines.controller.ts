import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";
import { WineRepository } from "../repositories/wine.repository.js";
import { WinesService } from "../services/wines.service.js";
const winesService = new WinesService(new WineRepository(prisma));

export const winesController = {
  create: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.body;
    const languageId = req.user?.languageId as number;
    const result = await winesService.create(input, languageId);
    return res.status(201).json(result);
  }),

  getMany: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.query;
    const languageId = req.user?.languageId as number;
    const result = await winesService.getMany(input, languageId);
    return res.status(200).json(result);
  }),

  delete: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.params;
    await winesService.delete(input);
    return res.status(204).send();
  })
};
