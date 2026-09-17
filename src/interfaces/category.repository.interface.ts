import { Prisma, Category } from "../generated/prisma/client.js";

export interface ICategoryRepository {
  create(data: Prisma.CategoryCreateInput | Prisma.CategoryUncheckedCreateInput): Promise<Category>;
  findMany(args: Prisma.CategoryFindManyArgs): Promise<Category[]>;
  delete(where: Prisma.CategoryWhereUniqueInput): Promise<Category>;
}
