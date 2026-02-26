import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodIssue } from "zod";
import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";

type RequestSchema = {
  body?: ZodSchema<any>;
  params?: ZodSchema<any>;
  query?: ZodSchema<any>;
};

export interface ValidatedRequest extends Request {
  validated?: {
    body?: any;
    params?: any;
    query?: any;
  };
}

const parseErrors = (issues: ZodIssue[]) =>
  issues.map((e) => ({
    path: e.path.join(".") || "root",
    message: e.message,
    code: e.code,
  }));

export const validateRequest = (schema: RequestSchema) => {
  return (req: ValidatedRequest, res: Response, next: NextFunction) => {
    const validated: { body?: any; params?: any; query?: any } = {};

    try {
      if (schema.body) {
        const result = schema.body.safeParse(req.body);
        if (!result.success) {
          throw new AppError(ErrorCodes.VALIDATION_ERROR, { 
            source: "body", 
            errors: parseErrors(result.error.issues) 
          });
        }
        validated.body = result.data;
      }

      if (schema.params) {
        const result = schema.params.safeParse(req.params);
        if (!result.success) {
          throw new AppError(ErrorCodes.VALIDATION_ERROR, { 
            source: "params", 
            errors: parseErrors(result.error.issues) 
          });
        }
        validated.params = result.data;
      }

      if (schema.query) {
        const result = schema.query.safeParse(req.query);
        if (!result.success) {
          throw new AppError(ErrorCodes.VALIDATION_ERROR, { 
            source: "query", 
            errors: parseErrors(result.error.issues) 
          });
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