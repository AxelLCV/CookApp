import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";

export const uploadsController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      throw new AppError(ErrorCodes.VALIDATION_ERROR, { message: "No images provided" });
    }

    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const result = files.map((file) => `${baseUrl}/uploads/files/${file.filename}`);

    return res.status(201).json({ result });
  }),
};
