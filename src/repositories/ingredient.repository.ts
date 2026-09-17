import { PrismaClient, Prisma, Ingredient } from "../generated/prisma/client.js";
import { IIngredientRepository } from "../interfaces/ingredient.repository.interface.js";

export class IngredientRepository implements IIngredientRepository {
  constructor(private prisma: PrismaClient) {}

  create(data: Prisma.IngredientCreateInput | Prisma.IngredientUncheckedCreateInput): Promise<Ingredient> {
    return this.prisma.ingredient.create({
      data,
      include: { translations: true },
    });
  }

  findMany(args: Prisma.IngredientFindManyArgs): Promise<Ingredient[]> {
    return this.prisma.ingredient.findMany(args);
  }

  delete(where: Prisma.IngredientWhereUniqueInput): Promise<Ingredient> {
    return this.prisma.ingredient.delete({ where });
  }
}
