import { Tag, Prisma } from "../generated/prisma/client.js";
import { IGenericRepository } from "../interfaces/generic.repository.interface.js";
import { CreateInput, UpdateInput, GetManyInput, DeleteInput } from "../validators/tags.schema.js";
import { buildSearchWhere, translationSelect } from "./crud.service.helpers.js";

type TagRepo = IGenericRepository<
  Tag,
  Prisma.TagCreateInput | Prisma.TagUncheckedCreateInput,
  Prisma.TagUpdateInput | Prisma.TagUncheckedUpdateInput,
  Prisma.TagWhereUniqueInput,
  Prisma.TagFindManyArgs
>;

export class TagsService {
  constructor(private repo: TagRepo) {}

  async create(data: CreateInput, languageId: number) {
    const result = await this.repo.create({
      categoryId: data.categoryId,
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
        categoryId: data.categoryId,
        translations: data.name !== undefined ? {
          upsert: {
            where: { tagId_languageId: { tagId: id, languageId } },
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
