import { Prisma, Department } from "../generated/prisma/client.js";

export interface IDepartmentRepository {
  create(data: Prisma.DepartmentCreateInput | Prisma.DepartmentUncheckedCreateInput): Promise<Department>;
  findMany(args: Prisma.DepartmentFindManyArgs): Promise<Department[]>;
  delete(where: Prisma.DepartmentWhereUniqueInput): Promise<Department>;
}
