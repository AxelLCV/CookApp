import { Prisma, Ustensil } from "../generated/prisma/client.js";

export interface IUstensilRepository {
  create(data: Prisma.UstensilCreateInput | Prisma.UstensilUncheckedCreateInput): Promise<Ustensil>;
  findMany(args: Prisma.UstensilFindManyArgs): Promise<Ustensil[]>;
  delete(where: Prisma.UstensilWhereUniqueInput): Promise<Ustensil>;
}
