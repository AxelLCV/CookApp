import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import multer from "multer";
import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";

export const UPLOADS_DIR = process.env.UPLOADS_DIR || path.join(process.cwd(), "uploads");
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, UPLOADS_DIR),
  filename: (_req, file, callback) => {
    const extension = ALLOWED_MIME_TYPES[file.mimetype];
    callback(null, `${randomUUID()}${extension}`);
  },
});

export const uploadImages = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per file
    files: 5,
  },
  fileFilter: (_req, file, callback) => {
    if (!ALLOWED_MIME_TYPES[file.mimetype]) {
      callback(new AppError(ErrorCodes.VALIDATION_ERROR, { message: "Only JPEG, PNG or WEBP images are allowed" }));
      return;
    }
    callback(null, true);
  },
});
