import { prisma } from "../config/prisma.js";
import { Department, Prisma } from "../generated/prisma/client.js";
import { GenericRepository } from "../repositories/generic.repository.js";
import { DepartmentsService } from "../services/departments.service.js";
import { createCrudController } from "./crud.controller.factory.js";

const departmentsService = new DepartmentsService(
  new GenericRepository<
    Department,
    Prisma.DepartmentCreateInput | Prisma.DepartmentUncheckedCreateInput,
    Prisma.DepartmentWhereUniqueInput,
    Prisma.DepartmentFindManyArgs
  >(prisma.department)
);

export const departmentsController = createCrudController(departmentsService);
