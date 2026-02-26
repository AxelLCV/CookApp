import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";
import { RegisterInput, LoginInput } from "../validators/auth.schema.js";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY as string;
const JWT_EXPIRES_IN = "7d";

export class AuthService {
  static async register(data: RegisterInput) {
    const existingEmail = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingEmail) {
      throw new AppError(ErrorCodes.EMAIL_EXIST);
    }
    const existingUser = await prisma.user.findUnique({
      where: { username: data.username },
    });

    if (existingUser) {
      throw new AppError(ErrorCodes.USERNAME_EXIST);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword
      },
      select: {id: true, username: true, roles: true },
    });
    const token = jwt.sign(
      { id: user.id, roles: user.roles },
      secretKey,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const safeUser = {
        username: user.username,
        roles: user.roles,
    };
    return {user: safeUser, token };
  }

  static async login(data: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError(ErrorCodes.INVALID_CONNECTION);
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError(ErrorCodes.INVALID_CONNECTION);
    }

    const token = jwt.sign(
      { id: user.id, roles: user.roles },
      secretKey,
      { expiresIn: JWT_EXPIRES_IN }
    );

    const safeUser = {
      username: user.username,
      roles: user.roles,
    };

    return { user: safeUser, token };
  }

  static async userInfo(userId: string){
    if (!userId)
    {
      throw new AppError(ErrorCodes.UNAUTHENTIFIED);
    }
    const user = await prisma.user.findUnique({
      where: { id: userId},
    });
    return user;
  }
}

