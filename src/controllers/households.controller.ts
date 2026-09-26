import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";
import { HouseholdRepository } from "../repositories/household.repository.js";
import { UserRepository } from "../repositories/user.repository.js";
import { HouseholdsService } from "../services/households.service.js";

const householdsService = new HouseholdsService(new HouseholdRepository(prisma), new UserRepository(prisma));

export const householdsController = {
  create: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const input = req.validated!.body;
    const userId = req.user!.id as string;
    const result = await householdsService.create(input, userId);
    return res.status(201).json(result);
  }),

  getMine: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id as string;
    const result = await householdsService.getMine(userId);
    return res.status(200).json(result);
  }),

  get: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated!.params;
    const userId = req.user!.id as string;
    const result = await householdsService.get(id, userId);
    return res.status(200).json(result);
  }),

  update: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated!.params;
    const input = req.validated!.body;
    const userId = req.user!.id as string;
    const result = await householdsService.update(id, input, userId);
    return res.status(200).json(result);
  }),

  delete: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated!.params;
    const userId = req.user!.id as string;
    await householdsService.delete(id, userId);
    return res.status(204).send();
  }),

  addMember: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated!.params;
    const input = req.validated!.body;
    const userId = req.user!.id as string;
    const result = await householdsService.addMember(id, input, userId);
    return res.status(201).json(result);
  }),

  removeMember: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, userId: targetUserId } = req.validated!.params;
    const userId = req.user!.id as string;
    await householdsService.removeMember(id, targetUserId, userId);
    return res.status(204).send();
  }),

  listIngredients: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated!.params;
    const userId = req.user!.id as string;
    const result = await householdsService.listIngredients(id, userId);
    return res.status(200).json(result);
  }),

  addIngredient: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated!.params;
    const input = req.validated!.body;
    const userId = req.user!.id as string;
    const result = await householdsService.addIngredient(id, input, userId);
    return res.status(201).json(result);
  }),

  updateIngredient: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, ingredientId } = req.validated!.params;
    const input = req.validated!.body;
    const userId = req.user!.id as string;
    const result = await householdsService.updateIngredient(id, ingredientId, input, userId);
    return res.status(200).json(result);
  }),

  removeIngredient: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, ingredientId } = req.validated!.params;
    const userId = req.user!.id as string;
    await householdsService.removeIngredient(id, ingredientId, userId);
    return res.status(204).send();
  }),

  listUstensils: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated!.params;
    const userId = req.user!.id as string;
    const result = await householdsService.listUstensils(id, userId);
    return res.status(200).json(result);
  }),

  addUstensil: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated!.params;
    const { ustensilId } = req.validated!.body;
    const userId = req.user!.id as string;
    const result = await householdsService.addUstensil(id, ustensilId, userId);
    return res.status(201).json(result);
  }),

  removeUstensil: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, ustensilId } = req.validated!.params;
    const userId = req.user!.id as string;
    await householdsService.removeUstensil(id, ustensilId, userId);
    return res.status(204).send();
  }),

  listShoppingListItems: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated!.params;
    const userId = req.user!.id as string;
    const result = await householdsService.listShoppingListItems(id, userId);
    return res.status(200).json(result);
  }),

  addShoppingListItem: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.validated!.params;
    const input = req.validated!.body;
    const userId = req.user!.id as string;
    const result = await householdsService.addShoppingListItem(id, input, userId);
    return res.status(201).json(result);
  }),

  updateShoppingListItem: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, itemId } = req.validated!.params;
    const input = req.validated!.body;
    const userId = req.user!.id as string;
    const result = await householdsService.updateShoppingListItem(id, itemId, input, userId);
    return res.status(200).json(result);
  }),

  removeShoppingListItem: asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { id, itemId } = req.validated!.params;
    const userId = req.user!.id as string;
    await householdsService.removeShoppingListItem(id, itemId, userId);
    return res.status(204).send();
  }),
};
