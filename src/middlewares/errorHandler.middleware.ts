// errorHandler.middleware.ts
import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { Prisma } from "../generated/prisma/client.js";
import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";

const isDev = process.env.NODE_ENV === "development";

// With the @prisma/adapter-pg driver adapter, some constraint violations reach us
// as a raw DriverAdapterError instead of being wrapped into a PrismaClientKnownRequestError.
const isDriverAdapterError = (
  err: Error
): err is Error & { cause: { kind: string; code?: string; constraint?: unknown } } =>
  err.name === "DriverAdapterError" && typeof (err as any).cause === "object";

const mapPrismaError = (err: Error): AppError | null => {
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": // Unique constraint violation
        return new AppError(ErrorCodes.RESOURCE_ALREADY_EXISTS, { fields: err.meta?.target });
      case "P2003": // Foreign key constraint violation (e.g. deleting a resource that still has children)
        return new AppError(ErrorCodes.RESOURCE_IN_USE, { field: err.meta?.field_name });
      case "P2025": // Record to update/delete not found
        return new AppError(ErrorCodes.RESOURCE_NOT_FOUND);
      default:
        return null;
    }
  }

  if (isDriverAdapterError(err)) {
    switch (err.cause.kind) {
      case "UniqueConstraintViolation":
        return new AppError(ErrorCodes.RESOURCE_ALREADY_EXISTS, { constraint: err.cause.constraint });
      case "ForeignKeyConstraintViolation":
        return new AppError(ErrorCodes.RESOURCE_IN_USE, { constraint: err.cause.constraint });
      case "postgres":
        // Postgres raises SQLSTATE 23001 (restrict_violation) for ON DELETE/UPDATE RESTRICT,
        // which @prisma/adapter-pg does not translate into a named "kind" like it does for 23503.
        if (err.cause.code === "23001") {
          return new AppError(ErrorCodes.RESOURCE_IN_USE);
        }
        return null;
      default:
        return null;
    }
  }

  return null;
};

const mapMulterError = (err: Error): AppError | null => {
  if (!(err instanceof multer.MulterError)) return null;
  return new AppError(ErrorCodes.VALIDATION_ERROR, { message: err.message });
};

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
  err = mapPrismaError(err) ?? mapMulterError(err) ?? err;

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