import { prisma } from "../config/prisma.js";
import { Category, Prisma } from "../generated/prisma/client.js";
import { GenericRepository } from "../repositories/generic.repository.js";
import { CategoriesService } from "../services/categories.service.js";
import { createCrudController } from "./crud.controller.factory.js";

const categoriesService = new CategoriesService(
  new GenericRepository<
    Category,
    Prisma.CategoryCreateInput | Prisma.CategoryUncheckedCreateInput,
    Prisma.CategoryWhereUniqueInput,
    Prisma.CategoryFindManyArgs
  >(prisma.category)
);

export const categoriesController = createCrudController(categoriesService);
