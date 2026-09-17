import { PrismaClient, Prisma, Department } from "../generated/prisma/client.js";
import { IDepartmentRepository } from "../interfaces/department.repository.interface.js";

export class DepartmentRepository implements IDepartmentRepository {
  constructor(private prisma: PrismaClient) {}

  create(data: Prisma.DepartmentCreateInput | Prisma.DepartmentUncheckedCreateInput): Promise<Department> {
    return this.prisma.department.create({
      data,
      include: { translations: true },
    });
  }

  findMany(args: Prisma.DepartmentFindManyArgs): Promise<Department[]> {
    return this.prisma.department.findMany(args);
  }

  delete(where: Prisma.DepartmentWhereUniqueInput): Promise<Department> {
    return this.prisma.department.delete({ where });
  }
}
