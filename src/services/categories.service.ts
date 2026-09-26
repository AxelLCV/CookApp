import { Category, Prisma } from "../generated/prisma/client.js";
import { IGenericRepository } from "../interfaces/generic.repository.interface.js";
import { CreateInput, UpdateInput, GetManyInput, DeleteInput } from "../validators/categories.schema.js";
import { buildSearchWhere, translationSelect } from "./crud.service.helpers.js";

type CategoryRepo = IGenericRepository<
  Category,
  Prisma.CategoryCreateInput | Prisma.CategoryUncheckedCreateInput,
  Prisma.CategoryUpdateInput | Prisma.CategoryUncheckedUpdateInput,
  Prisma.CategoryWhereUniqueInput,
  Prisma.CategoryFindManyArgs
>;

export class CategoriesService {
  constructor(private repo: CategoryRepo) {}

  async create(data: CreateInput, languageId: number) {
    const result = await this.repo.create({
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
        translations: data.name !== undefined ? {
          upsert: {
            where: { categoryId_languageId: { categoryId: id, languageId } },
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
