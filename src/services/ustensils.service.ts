import { prisma } from "../config/prisma.js";
import { CreateInput, GetManyInput, DeleteInput} from "../validators/ustensils.schema.js";

export class UstensilsService {
  static async create(data: CreateInput, languageId: number) {
    const result = await prisma.ustensil.create({
      data: {
        translations: {
          create: {
            name: data.name,
            languageId: languageId
          }
        }
      },
      include: {
        translations: true
      }
    });
    return { result };
  }

  static async getMany(query: GetManyInput, languageId: number) {
    const result = await prisma.ustensil.findMany({
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
          select: { name: true },
          where: { languageId: languageId }
        }
      } 
    });
    return { result };
  }

  static async delete(data: DeleteInput) {
    const result = await prisma.ustensil.delete({
      where: {
        id: data.id
      }
      
    });
    return { result };
  }
}
