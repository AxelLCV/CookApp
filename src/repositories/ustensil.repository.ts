import { PrismaClient, Prisma, Ustensil } from "../generated/prisma/client.js";
import { IUstensilRepository } from "../interfaces/ustensil.repository.interface.js";

export class UstensilRepository implements IUstensilRepository {
  constructor(private prisma: PrismaClient) {}

  create(data: Prisma.UstensilCreateInput | Prisma.UstensilUncheckedCreateInput): Promise<Ustensil> {
    return this.prisma.ustensil.create({
      data,
      include: { translations: true },
    });
  }

  findMany(args: Prisma.UstensilFindManyArgs): Promise<Ustensil[]> {
    return this.prisma.ustensil.findMany(args);
  }

  delete(where: Prisma.UstensilWhereUniqueInput): Promise<Ustensil> {
    return this.prisma.ustensil.delete({ where });
  }
}
