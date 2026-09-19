import { Unit, Prisma } from "../generated/prisma/client.js";
import { IGenericRepository } from "../interfaces/generic.repository.interface.js";
import { CreateInput, GetManyInput, DeleteInput } from "../validators/units.schema.js";
import { buildSearchWhere, translationSelect } from "./crud.service.helpers.js";

type UnitRepo = IGenericRepository<
  Unit,
  Prisma.UnitCreateInput | Prisma.UnitUncheckedCreateInput,
  Prisma.UnitWhereUniqueInput,
  Prisma.UnitFindManyArgs
>;

export class UnitsService {
  constructor(private repo: UnitRepo) {}

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
      where: buildSearchWhere(query.search, languageId),
      select: {
        id: true,
        type: true,
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
