import jsonwebtoken from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY as string;

export const authMiddleware = async(req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new AppError(ErrorCodes.AUTH_HEADER_MISSING);
    }   
    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new AppError(ErrorCodes.AUTH_TOKEN_MISSING);
    }
    let decoded: { id: string; username?: string; roles?: string[] };
    try {
        decoded = jsonwebtoken.verify(token, secretKey) as typeof decoded;
    } catch (error) {
        if (error instanceof jsonwebtoken.TokenExpiredError) {
            throw new AppError(ErrorCodes.AUTH_TOKEN_EXPIRED);
        }
        throw new AppError(ErrorCodes.AUTH_TOKEN_INVALID);
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { languageId: true },
    });     
    
    if (!user || !user.languageId) {
      throw new AppError(ErrorCodes.USER_LANGUAGE_NOT_FOUND);
    } 

    req.user = {
      ...decoded,
      languageId: user.languageId,
    };

    next();
}; 