import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service.js";

export const authController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.validated!.body;
      const result = await AuthService.register(input);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.validated!.body;
      const result = await AuthService.login(input);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },

  userInfo: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.user);
      const userId = req.user?.id as string;
      const result = await AuthService.userInfo(userId);
      return res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  },
};
