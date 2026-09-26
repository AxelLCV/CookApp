import { Department, Prisma } from "../generated/prisma/client.js";
import { IGenericRepository } from "../interfaces/generic.repository.interface.js";
import { CreateInput, UpdateInput, GetManyInput, DeleteInput } from "../validators/departments.schema.js";
import { buildSearchWhere, translationSelect } from "./crud.service.helpers.js";

type DepartmentRepo = IGenericRepository<
  Department,
  Prisma.DepartmentCreateInput | Prisma.DepartmentUncheckedCreateInput,
  Prisma.DepartmentUpdateInput | Prisma.DepartmentUncheckedUpdateInput,
  Prisma.DepartmentWhereUniqueInput,
  Prisma.DepartmentFindManyArgs
>;

export class DepartmentsService {
  constructor(private repo: DepartmentRepo) {}

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
            where: { departmentId_languageId: { departmentId: id, languageId } },
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
