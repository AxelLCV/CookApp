import { Prisma, Wine } from "../generated/prisma/client.js";

export interface IWineRepository {
  create(data: Prisma.WineCreateInput | Prisma.WineUncheckedCreateInput): Promise<Wine>;
  findMany(args: Prisma.WineFindManyArgs): Promise<Wine[]>;
  delete(where: Prisma.WineWhereUniqueInput): Promise<Wine>;
}
