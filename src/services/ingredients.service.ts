import { Ingredient, Prisma } from "../generated/prisma/client.js";
import { IGenericRepository } from "../interfaces/generic.repository.interface.js";
import { CreateInput, GetManyInput, DeleteInput } from "../validators/ingredients.schema.js";
import { buildSearchWhere, translationSelect } from "./crud.service.helpers.js";

type IngredientRepo = IGenericRepository<
  Ingredient,
  Prisma.IngredientCreateInput | Prisma.IngredientUncheckedCreateInput,
  Prisma.IngredientWhereUniqueInput,
  Prisma.IngredientFindManyArgs
>;

export class IngredientsService {
  constructor(private repo: IngredientRepo) {}

  async create(data: CreateInput, languageId: number) {
    const result = await this.repo.create({
      departmentId: data.departmentId,
      density: data.density,
      averageWeight: data.averageWeight,
      translations: {
        create: {
          name: data.name,
          languageId: languageId
        }
      }
    });
    return { result };
  }

  async getMany(query: GetManyInput, languageId: number) {
    const result = await this.repo.findMany({
      where: buildSearchWhere(query.search, languageId),
      select: {
        id: true,
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
}
