import { Wine, Prisma } from "../generated/prisma/client.js";
import { IGenericRepository } from "../interfaces/generic.repository.interface.js";
import { CreateInput, UpdateInput, GetManyInput, DeleteInput } from "../validators/wines.schema.js";
import { buildSearchWhere, translationSelect } from "./crud.service.helpers.js";

type WineRepo = IGenericRepository<
  Wine,
  Prisma.WineCreateInput | Prisma.WineUncheckedCreateInput,
  Prisma.WineUpdateInput | Prisma.WineUncheckedUpdateInput,
  Prisma.WineWhereUniqueInput,
  Prisma.WineFindManyArgs
>;

export class WinesService {
  constructor(private repo: WineRepo) {}

  async create(data: CreateInput, languageId: number) {
    const result = await this.repo.create({
      image: data.image,
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

  async update(id: number, data: UpdateInput, languageId: number) {
    const result = await this.repo.update(
      { id },
      {
        image: data.image,
        translations: (data.name !== undefined || data.country !== undefined || data.region !== undefined) ? {
          upsert: {
            where: { wineId_languageId: { wineId: id, languageId } },
            create: { name: data.name ?? "", country: data.country, region: data.region, languageId },
            update: { name: data.name, country: data.country, region: data.region },
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
        translations: translationSelect({ name: true, country: true, region: true }, languageId)
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
