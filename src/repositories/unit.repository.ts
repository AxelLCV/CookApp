import { PrismaClient, Prisma, Unit } from "../generated/prisma/client.js";
import { IUnitRepository } from "../interfaces/unit.repository.interface.js";

export class UnitRepository implements IUnitRepository {
  constructor(private prisma: PrismaClient) {}

  create(data: Prisma.UnitCreateInput | Prisma.UnitUncheckedCreateInput): Promise<Unit> {
    return this.prisma.unit.create({
      data,
      include: { translations: true },
    });
  }

  findMany(args: Prisma.UnitFindManyArgs): Promise<Unit[]> {
    return this.prisma.unit.findMany(args);
  }

  delete(where: Prisma.UnitWhereUniqueInput): Promise<Unit> {
    return this.prisma.unit.delete({ where });
  }
}
