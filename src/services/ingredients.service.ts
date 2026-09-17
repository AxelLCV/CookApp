import { IIngredientRepository } from "../interfaces/ingredient.repository.interface.js";
import { CreateInput, GetManyInput, DeleteInput} from "../validators/ingredients.schema.js";

export class IngredientsService {
  constructor(private repo: IIngredientRepository) {}

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
      where: query.search ? {
        translations: {
          some: {
            name: { contains: query.search, mode: "insensitive" },
            languageId: languageId
          }
        }
      } : undefined,
      select: {
        id: true,
        translations: {
          select: { name: true },
          where: { languageId: languageId }
        }
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
