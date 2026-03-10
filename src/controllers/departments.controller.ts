import { Request, Response, NextFunction } from "express";
import { DepartmentsService } from "../services/departments.service.js";

export const departmentsController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.validated!.body;
      const languageId = req.user?.languageId as number;
      const result = await DepartmentsService.create(input, languageId);
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
      const result = await DepartmentsService.getMany(input, languageId);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.validated!.params;
      const result = await DepartmentsService.delete(input);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
};
