import { Tag, Prisma } from "../generated/prisma/client.js";
import { IGenericRepository } from "../interfaces/generic.repository.interface.js";
import { CreateInput, GetManyInput, DeleteInput } from "../validators/tags.schema.js";
import { buildSearchWhere, translationSelect } from "./crud.service.helpers.js";

type TagRepo = IGenericRepository<
  Tag,
  Prisma.TagCreateInput | Prisma.TagUncheckedCreateInput,
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
