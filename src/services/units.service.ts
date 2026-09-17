import { IUnitRepository } from "../interfaces/unit.repository.interface.js";
import { CreateInput, GetManyInput, DeleteInput } from "../validators/units.schema.js";

export class UnitsService {
  constructor(private repo: IUnitRepository) {}

  async create(data: CreateInput, languageId: number) {
    const result = await this.repo.create({
      type: data.type,
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
        type: true,
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
