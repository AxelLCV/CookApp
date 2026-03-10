import { Request, Response, NextFunction } from "express";
import { IngredientsService } from "../services/ingredients.service.js";

export const ingredientsController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.validated!.body;
      const languageId = req.user?.languageId as number;
      const result = await IngredientsService.create(input, languageId);
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
      const result = await IngredientsService.getMany(input, languageId);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.validated!.params;
      const result = await IngredientsService.delete(input);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
};
