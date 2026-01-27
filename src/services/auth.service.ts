// src/services/auth.service.ts

import { prisma } from "../config/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError } from "../errors/AppError.js";
import { RegisterInput, LoginInput } from "../validators/auth.schema.js";

const JWT_SECRET = process.env.JWT_SECRET_KEY || "supersecret";
const JWT_EXPIRES_IN = "7d";

export class AuthService {
  
  // -----------------------------
  // REGISTER
  // -----------------------------
  static async register(data: RegisterInput) {
    // 1. Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError("Email already in use", 400);
    }

    // 2. Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // 3. Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword
      },
      select: { id: true, username: true, email: true, roles: true }, // jamais le mot de passe
    });

    // 4. Générer JWT
    const token = jwt.sign(
      { id: user.id, role: user.roles },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return { user, token };
  }

  // -----------------------------
  // LOGIN
  // -----------------------------
  static async login(data: LoginInput) {
    // 1. Chercher l'utilisateur par email
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    // 2. Comparer le mot de passe
    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", 401);
    }

    // 3. Générer JWT
    const token = jwt.sign(
      { id: user.id, role: user.roles },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // 4. Retourner utilisateur safe
    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.roles,
    };

    return { user: safeUser, token };
  }
}
