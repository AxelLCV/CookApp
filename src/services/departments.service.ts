import { prisma } from "../config/prisma.js";
import { createDepartmentInput, getDepartmentInput } from "../validators/departments.schema.js";

export class DepartmentsService {
  static async createDepartments(data: createDepartmentInput, languageId: number) {
    const recipe = await prisma.department.create({
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
    return { recipe };
  }

  static async getDepartments(query: getDepartmentInput, languageId: number) {
    const departments = await prisma.department.findMany({
      where: query.search ? {
        translations: {
          some: {
            name: { contains: query.search, mode: "insensitive" },
            languageId: languageId
          }
        }
      } : undefined,
      include: {
        translations: {
          select: { name: true }
        }
      }
    });
    return { departments };
  }
}
