import { prisma } from "../config/prisma.js";
import { Ustensil, Prisma } from "../generated/prisma/client.js";
import { GenericRepository } from "../repositories/generic.repository.js";
import { UstensilsService } from "../services/ustensils.service.js";
import { createCrudController } from "./crud.controller.factory.js";

const ustensilsService = new UstensilsService(
  new GenericRepository<
    Ustensil,
    Prisma.UstensilCreateInput | Prisma.UstensilUncheckedCreateInput,
    Prisma.UstensilWhereUniqueInput,
    Prisma.UstensilFindManyArgs
  >(prisma.ustensil)
);

export const ustensilsController = createCrudController(ustensilsService);
