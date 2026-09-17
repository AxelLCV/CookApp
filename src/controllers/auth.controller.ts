import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";
import { UserRepository } from "../repositories/user.repository.js";
import { AuthService } from "../services/auth.service.js";
const authService = new AuthService(new UserRepository(prisma));

export const authController = {
  register: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.body;
    const result = await authService.register(input);
    return res.status(201).json(result);
  }),

  login: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.body;
    const result = await authService.login(input);
    return res.status(200).json(result);
  }),

  userInfo: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id as string;
    const result = await authService.userInfo(userId);
    return res.status(200).json(result);
  })
};
