import { PrismaClient, Unit, Prisma } from "../generated/prisma/client.js";
import { IGenericRepository } from "../interfaces/generic.repository.interface.js";
import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";
import { CreateInput, UpdateInput, GetManyInput, DeleteInput, AddConversionInput } from "../validators/units.schema.js";
import { buildSearchWhere, translationSelect } from "./crud.service.helpers.js";

type UnitRepo = IGenericRepository<
  Unit,
  Prisma.UnitCreateInput | Prisma.UnitUncheckedCreateInput,
  Prisma.UnitUpdateInput | Prisma.UnitUncheckedUpdateInput,
  Prisma.UnitWhereUniqueInput,
  Prisma.UnitFindManyArgs
>;

export class UnitsService {
  // `prisma` is used directly for the conversions table, which the generic
  // CRUD repo (built for the Unit model itself) doesn't cover.
  constructor(private repo: UnitRepo, private prisma: PrismaClient) {}

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

  async update(id: number, data: UpdateInput, languageId: number) {
    const result = await this.repo.update(
      { id },
      {
        type: data.type,
        translations: data.name !== undefined ? {
          upsert: {
            where: { unitId_languageId: { unitId: id, languageId } },
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

  async addConversion(unitId: number, data: AddConversionInput) {
    const result = await this.prisma.conversionUnit.upsert({
      where: { baseId_targetId: { baseId: unitId, targetId: data.targetUnitId } },
      create: { baseId: unitId, targetId: data.targetUnitId, factor: data.factor },
      update: { factor: data.factor },
    });
    return { result };
  }

  async getConversions(unitId: number) {
    const data = await this.prisma.conversionUnit.findMany({ where: { baseId: unitId } });
    return { data };
  }

  async removeConversion(unitId: number, targetUnitId: number) {
    await this.prisma.conversionUnit.delete({
      where: { baseId_targetId: { baseId: unitId, targetId: targetUnitId } },
    });
  }

  // Looks up a direct conversion first, then falls back to the inverse of a
  // conversion defined the other way round, so admins only have to define
  // one direction between any pair of units.
  async convert(fromUnitId: number, toUnitId: number, quantity: number) {
    if (fromUnitId === toUnitId) {
      return { result: quantity };
    }

    const direct = await this.prisma.conversionUnit.findUnique({
      where: { baseId_targetId: { baseId: fromUnitId, targetId: toUnitId } },
    });
    if (direct) {
      return { result: quantity * direct.factor };
    }

    const inverse = await this.prisma.conversionUnit.findUnique({
      where: { baseId_targetId: { baseId: toUnitId, targetId: fromUnitId } },
    });
    if (inverse) {
      return { result: quantity / inverse.factor };
    }

    throw new AppError(ErrorCodes.CONVERSION_NOT_FOUND);
  }
}
