import { Request, Response, NextFunction } from "express";
import { RecipesService } from "../services/recipes.service.js";

export const recipesController = {
  createRecipe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.validated!.body;
      const userId = req.user?.id as string;
      const result = await RecipesService.createRecipe(input, userId);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  getRecipe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await RecipesService.getRecipe();
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  deleteRecipe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.validated!.params;
      console.log(input)
      const result = await RecipesService.deleteRecipe(input);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
};
