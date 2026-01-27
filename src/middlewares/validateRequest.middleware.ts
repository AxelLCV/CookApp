import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodIssue } from "zod";
import { AppError } from "../errors/AppError.js";

// Type pour le schéma
type RequestSchema = {
  body?: ZodSchema<any>;
  params?: ZodSchema<any>;
  query?: ZodSchema<any>;
};

// Extension de Request pour TS
export interface ValidatedRequest extends Request {
  validated?: {
    body?: any;
    params?: any;
    query?: any;
  };
}

// Middleware générateur
export const validateRequest = (schema: RequestSchema) => {
  return (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const validated: { body?: any; params?: any; query?: any } = {};

    try {
      // Body
      if (schema.body) {
        const result = schema.body.safeParse(req.body);
        if (!result.success) {
          const errors = result.error.issues.map((e: ZodIssue) => ({
            path: e.path.join(".") || "root",
            message: e.message,
            code: e.code,
          }));
          
          throw new AppError(
            `Validation failed in request body: ${errors.map(e => `${e.path}: ${e.message}`).join(", ")}`,
            400,
            { errors }
          );
        }
        validated.body = result.data;
      }

      // Params
      if (schema.params) {
        const result = schema.params.safeParse(req.params);
        if (!result.success) {
          const errors = result.error.issues.map((e: ZodIssue) => ({
            path: e.path.join(".") || "root",
            message: e.message,
            code: e.code,
          }));
          
          throw new AppError(
            `Validation failed in URL params: ${errors.map(e => `${e.path}: ${e.message}`).join(", ")}`,
            400,
            { errors }
          );
        }
        validated.params = result.data;
      }

      // Query
      if (schema.query) {
        const result = schema.query.safeParse(req.query);
        if (!result.success) {
          const errors = result.error.issues.map((e: ZodIssue) => ({
            path: e.path.join(".") || "root",
            message: e.message,
            code: e.code,
          }));
          
          throw new AppError(
            `Validation failed in query params: ${errors.map(e => `${e.path}: ${e.message}`).join(", ")}`,
            400,
            { errors }
          );
        }
        validated.query = result.data;
      }

      req.validated = validated;
      next();
    } catch (error) {
      next(error);
    }
  };
};