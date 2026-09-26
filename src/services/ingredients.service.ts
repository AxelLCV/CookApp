import { PrismaClient, Ingredient, Prisma } from "../generated/prisma/client.js";
import { IGenericRepository } from "../interfaces/generic.repository.interface.js";
import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";
import { CreateInput, UpdateInput, GetManyInput, DeleteInput, AddUnitInput } from "../validators/ingredients.schema.js";
import { buildSearchWhere, translationSelect } from "./crud.service.helpers.js";

type IngredientRepo = IGenericRepository<
  Ingredient,
  Prisma.IngredientCreateInput | Prisma.IngredientUncheckedCreateInput,
  Prisma.IngredientUpdateInput | Prisma.IngredientUncheckedUpdateInput,
  Prisma.IngredientWhereUniqueInput,
  Prisma.IngredientFindManyArgs
>;

export class IngredientsService {
  // `prisma` is used directly for operations the generic CRUD repo doesn't
  // cover: fetching one ingredient with its allowed units, and managing the
  // ingredient <-> unit join table.
  constructor(private repo: IngredientRepo, private prisma: PrismaClient) {}

  async create(data: CreateInput, languageId: number) {
    const result = await this.repo.create({
      departmentId: data.departmentId,
      density: data.density,
      averageWeight: data.averageWeight,
      image: data.image,
      translations: {
        create: {
          name: data.name,
          languageId: languageId
        }
      }
    });
    return { result };
  }

  async update(id: number, data: UpdateInput, languageId: number) {
    const result = await this.repo.update(
      { id },
      {
        departmentId: data.departmentId,
        density: data.density,
        averageWeight: data.averageWeight,
        image: data.image,
        translations: data.name !== undefined ? {
          upsert: {
            where: { ingredientId_languageId: { ingredientId: id, languageId } },
            create: { name: data.name, languageId },
            update: { name: data.name },
          }
        } : undefined,
      }
    );
    return { result };
  }

  async getMany(query: GetManyInput, languageId: number) {
    const result = await this.repo.findMany({
      where: buildSearchWhere(query.search, languageId),
      select: {
        id: true,
        image: true,
        translations: translationSelect({ name: true }, languageId)
      }
    });
    return { result };
  }

  async delete(data: DeleteInput) {
    const result = await this.repo.delete({
      id: data.id
    });
    return { result };
  }

  async get(id: number, languageId: number) {
    const result = await this.prisma.ingredient.findUnique({
      where: { id },
      include: {
        translations: translationSelect({ name: true }, languageId),
        units: { include: { unit: { include: { translations: translationSelect({ name: true }, languageId) } } } },
      },
    });
    if (!result) {
      throw new AppError(ErrorCodes.RESOURCE_NOT_FOUND);
    }
    return { result };
  }

  async addUnit(id: number, data: AddUnitInput) {
    const result = await this.prisma.ingredientUnit.upsert({
      where: { ingredientId_unitId: { ingredientId: id, unitId: data.unitId } },
      create: { ingredientId: id, unitId: data.unitId, isDefault: data.isDefault ?? false },
      update: { isDefault: data.isDefault ?? false },
    });
    return { result };
  }

  async removeUnit(id: number, unitId: number) {
    await this.prisma.ingredientUnit.delete({
      where: { ingredientId_unitId: { ingredientId: id, unitId } },
    });
  }
}
