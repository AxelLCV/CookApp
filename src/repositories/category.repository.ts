import { PrismaClient, Prisma, Category } from "../generated/prisma/client.js";
import { ICategoryRepository } from "../interfaces/category.repository.interface.js";

export class CategoryRepository implements ICategoryRepository {
  constructor(private prisma: PrismaClient) {}

  create(data: Prisma.CategoryCreateInput | Prisma.CategoryUncheckedCreateInput): Promise<Category> {
    return this.prisma.category.create({
      data,
      include: { translations: true },
    });
  }

  findMany(args: Prisma.CategoryFindManyArgs): Promise<Category[]> {
    return this.prisma.category.findMany(args);
  }

  delete(where: Prisma.CategoryWhereUniqueInput): Promise<Category> {
    return this.prisma.category.delete({ where });
  }
}
