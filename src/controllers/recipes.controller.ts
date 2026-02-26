import { Request, Response, NextFunction } from "express";
import { RecipesService } from "../services/recipes.service.js";

export const recipesController = {
  createRecipe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.validated!.body;
      const userId = req.user?.id as string;
      const languageId = req.user?.languageId as number;
      const result = await RecipesService.createRecipe(input, userId, languageId);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  getRecipes: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await RecipesService.getRecipes();
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  getRecipe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.validated!.params;
      const result = await RecipesService.getRecipe(input);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  deleteRecipe: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.validated!.params;
      const result = await RecipesService.deleteRecipe(input);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
};
