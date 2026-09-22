import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";
import { HouseholdRepository } from "../repositories/household.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { HouseholdsService } from "../services/households.service.js";

const householdsService = new HouseholdsService(new HouseholdRepository(prisma), new UserRepository(prisma));

export const householdsController = {
  create: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.body;
    const userId = req.user!.id as string;
    const result = await householdsService.create(input, userId);
    return res.status(201).json(result);
  }),

  getMine: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id as string;
    const result = await householdsService.getMine(userId);
    return res.status(200).json(result);
  }),

  get: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated!.params;
    const userId = req.user!.id as string;
    const result = await householdsService.get(id, userId);
    return res.status(200).json(result);
  }),

  update: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated!.params;
    const input = req.validated!.body;
    const userId = req.user!.id as string;
    const result = await householdsService.update(id, input, userId);
    return res.status(200).json(result);
  }),

  delete: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated!.params;
    const userId = req.user!.id as string;
    await householdsService.delete(id, userId);
    return res.status(204).send();
  }),

  addMember: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated!.params;
    const input = req.validated!.body;
    const userId = req.user!.id as string;
    const result = await householdsService.addMember(id, input, userId);
    return res.status(201).json(result);
  }),

  removeMember: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, userId: targetUserId } = req.validated!.params;
    const userId = req.user!.id as string;
    await householdsService.removeMember(id, targetUserId, userId);
    return res.status(204).send();
  }),
};
