import { prisma } from "../config/prisma.js";
import { Unit, Prisma } from "../generated/prisma/client.js";
import { GenericRepository } from "../repositories/generic.repository.js";
import { UnitsService } from "../services/units.service.js";
import { createCrudController } from "./crud.controller.factory.js";

const unitsService = new UnitsService(
  new GenericRepository<
    Unit,
    Prisma.UnitCreateInput | Prisma.UnitUncheckedCreateInput,
    Prisma.UnitWhereUniqueInput,
    Prisma.UnitFindManyArgs
  >(prisma.unit)
);

export const unitsController = createCrudController(unitsService);
