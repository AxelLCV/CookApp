import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";
import { TagRepository } from "../repositories/tag.repository.js";
import { TagsService } from "../services/tags.service.js";
const tagsService = new TagsService(new TagRepository(prisma));

export const tagsController = {
  create: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.body;
    const languageId = req.user?.languageId as number;
    const result = await tagsService.create(input, languageId);
    return res.status(201).json(result);
  }),

  getMany: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.query;
    const languageId = req.user?.languageId as number;
    const result = await tagsService.getMany(input, languageId);
    return res.status(200).json(result);
  }),

  delete: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.params;
    await tagsService.delete(input);
    return res.status(204).send();
  })
};
