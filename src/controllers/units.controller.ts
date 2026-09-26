import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { prisma } from "../config/prisma.js";
import { Unit, Prisma } from "../generated/prisma/client.js";
import { GenericRepository } from "../repositories/generic.repository.js";
import { UnitsService } from "../services/units.service.js";
import { createCrudController } from "./crud.controller.factory.js";

const unitsService = new UnitsService(
  new GenericRepository<
    Unit,
    Prisma.UnitCreateInput | Prisma.UnitUncheckedCreateInput,
    Prisma.UnitUpdateInput | Prisma.UnitUncheckedUpdateInput,
    Prisma.UnitWhereUniqueInput,
    Prisma.UnitFindManyArgs
  >(prisma.unit),
  prisma
);

export const unitsController = {
  ...createCrudController(unitsService),

  addConversion: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.validated!.params as { id: number };
    const input = req.validated!.body;
    const result = await unitsService.addConversion(id, input);
    return res.status(201).json(result);
  }),

  getConversions: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id } = req.validated!.params as { id: number };
    const result = await unitsService.getConversions(id);
    return res.status(200).json(result);
  }),

  removeConversion: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { id, targetUnitId } = req.validated!.params as { id: number; targetUnitId: number };
    await unitsService.removeConversion(id, targetUnitId);
    return res.status(204).send();
  }),

  convert: asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { fromUnitId, toUnitId, quantity } = req.validated!.query;
    const result = await unitsService.convert(fromUnitId, toUnitId, quantity);
    return res.status(200).json(result);
  }),
};
