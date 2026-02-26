// errorHandler.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";

const isDev = process.env.NODE_ENV === "development";

const logError = (err: Error | AppError, req: Request) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] ${req.method} ${req.originalUrl}`;

  if (err instanceof AppError) {
    console.error(`❌ ${prefix} → [${err.code}] (${err.statusCode})`);
    if (err.meta) console.error("   Meta:", JSON.stringify(err.meta, null, 2));
  } else {
    console.error(`💥 ${prefix} → Unexpected error: ${err.message}`);
    console.error("   Stack:", err.stack);
  }
};

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logError(err, req);

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        code: err.code,
        ...(err.meta && { details: err.meta }),
        ...(isDev && { stack: err.stack }),
      },
    });
  }

  return res.status(500).json({
    success: false,
    error: {
      code: ErrorCodes.INTERNAL_ERROR.code,
      ...(isDev && { 
        message: err.message,
        stack: err.stack 
      }),
    },
  });
};