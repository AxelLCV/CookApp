import { prisma } from "../config/prisma.js";
import { Wine, Prisma } from "../generated/prisma/client.js";
import { GenericRepository } from "../repositories/generic.repository.js";
import { WinesService } from "../services/wines.service.js";
import { createCrudController } from "./crud.controller.factory.js";

const winesService = new WinesService(
  new GenericRepository<
    Wine,
    Prisma.WineCreateInput | Prisma.WineUncheckedCreateInput,
    Prisma.WineUpdateInput | Prisma.WineUncheckedUpdateInput,
    Prisma.WineWhereUniqueInput,
    Prisma.WineFindManyArgs
  >(prisma.wine)
);

export const winesController = createCrudController(winesService);
