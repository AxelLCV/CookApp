import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";
import { IUserRepository } from "../interfaces/user.repository.interface.js";
import { RegisterInput, LoginInput } from "../validators/auth.schema.js";
import dotenv from "dotenv";

dotenv.config();
const secretKey = process.env.JWT_SECRET_KEY as string;
const JWT_EXPIRES_IN = "7d";

export class AuthService {
  constructor(private repo: IUserRepository) {}

  async register(data: RegisterInput) {
    const existingEmail = await this.repo.findByEmail(data.email);
    if (existingEmail) {
      throw new AppError(ErrorCodes.EMAIL_EXIST);
    }
    const existingUser = await this.repo.findByUsername(data.username);
    if (existingUser) {
      throw new AppError(ErrorCodes.USERNAME_EXIST);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this.repo.create({
      username: data.username,
      email: data.email,
      password: hashedPassword,
      roles: ["USER"],
      language: { connect: { id: data.languageId } }
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

  async login(data: LoginInput) {
    const user = await this.repo.findByEmail(data.email);
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

  async userInfo(userId: string){
    if (!userId)
    {
      throw new AppError(ErrorCodes.UNAUTHENTIFIED);
    }
    const user = await this.repo.findById(userId);
    if (!user) {
      return null;
    }
    const { password, ...safeUser } = user;
    return safeUser;
  }
}
