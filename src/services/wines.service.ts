import { IWineRepository } from "../interfaces/wine.repository.interface.js";
import { CreateInput, GetManyInput, DeleteInput } from "../validators/wines.schema.js";

export class WinesService {
  constructor(private repo: IWineRepository) {}

  async create(data: CreateInput, languageId: number) {
    const result = await this.repo.create({
      translations: {
        create: {
          name: data.name,
          country: data.country,
          region: data.region,
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
          select: { name: true, country: true, region: true },
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
