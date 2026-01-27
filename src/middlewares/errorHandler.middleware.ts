// errorHandler.middleware.ts
import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError.js";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log l'erreur en développement
  if (process.env.NODE_ENV === "development") {
    console.error("❌ ERROR DETAILS:");
    console.error("Message:", err.message);
    console.error("Stack:", err.stack);
    
    if (err instanceof AppError && err.meta) {
      console.error("Validation errors:", JSON.stringify(err.meta, null, 2));
    }
  }

  // AppError personnalisée
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: {
        message: err.message,
        ...(err.meta && { details: err.meta }),
      },
    });
  }

  // Erreur générique
  return res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === "development" 
        ? err.message 
        : "Internal server error",
    },
  });
};