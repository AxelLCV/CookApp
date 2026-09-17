import { Prisma, Unit } from "../generated/prisma/client.js";

export interface IUnitRepository {
  create(data: Prisma.UnitCreateInput | Prisma.UnitUncheckedCreateInput): Promise<Unit>;
  findMany(args: Prisma.UnitFindManyArgs): Promise<Unit[]>;
  delete(where: Prisma.UnitWhereUniqueInput): Promise<Unit>;
}
