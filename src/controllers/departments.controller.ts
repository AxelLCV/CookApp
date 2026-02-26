import { Request, Response, NextFunction } from "express";
import { DepartmentsService } from "../services/departments.service.js";

export const departmentsController = {
  createDepartment: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.validated!.body;
      const languageId = req.user?.languageId as number;
      const result = await DepartmentsService.createDepartments(input, languageId);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },

  getDepartments: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const input = req.validated!.query;
      const languageId = req.user?.languageId as number;
      const result = await DepartmentsService.getDepartments(input, languageId);
      return res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
};
