import { Request, Response, NextFunction } from "express";
import { UstensilsService } from "../services/ustensils.service.js";

export const ustensilsController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.validated!.body;
      const languageId = req.user?.languageId as number;
      const result = await UstensilsService.create(input, languageId);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  getMany: async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(req.validated!)
      const input = req.validated!.query;
      const languageId = req.user?.languageId as number;
      const result = await UstensilsService.getMany(input, languageId);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.validated!.params;
      const result = await UstensilsService.delete(input);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
};
