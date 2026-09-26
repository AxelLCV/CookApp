import { Ustensil, Prisma } from "../generated/prisma/client.js";
import { IGenericRepository } from "../interfaces/generic.repository.interface.js";
import { CreateInput, UpdateInput, GetManyInput, DeleteInput } from "../validators/ustensils.schema.js";
import { buildSearchWhere, translationSelect } from "./crud.service.helpers.js";

type UstensilRepo = IGenericRepository<
  Ustensil,
  Prisma.UstensilCreateInput | Prisma.UstensilUncheckedCreateInput,
  Prisma.UstensilUpdateInput | Prisma.UstensilUncheckedUpdateInput,
  Prisma.UstensilWhereUniqueInput,
  Prisma.UstensilFindManyArgs
>;

export class UstensilsService {
  constructor(private repo: UstensilRepo) {}

  async create(data: CreateInput, languageId: number) {
    const result = await this.repo.create({
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
        image: data.image,
        translations: data.name !== undefined ? {
          upsert: {
            where: { ustensilId_languageId: { ustensilId: id, languageId } },
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
}
