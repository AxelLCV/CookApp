import { PrismaClient, Prisma, Wine } from "../generated/prisma/client.js";
import { IWineRepository } from "../interfaces/wine.repository.interface.js";

export class WineRepository implements IWineRepository {
  constructor(private prisma: PrismaClient) {}

  create(data: Prisma.WineCreateInput | Prisma.WineUncheckedCreateInput): Promise<Wine> {
    return this.prisma.wine.create({
      data,
      include: { translations: true },
    });
  }

  findMany(args: Prisma.WineFindManyArgs): Promise<Wine[]> {
    return this.prisma.wine.findMany(args);
  }

  delete(where: Prisma.WineWhereUniqueInput): Promise<Wine> {
    return this.prisma.wine.delete({ where });
  }
}
