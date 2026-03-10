import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";
import { CreateInput, GetInput, DeleteInput} from "../validators/recipes.schema.js";

export class RecipesService {
  static async create(data: CreateInput, userId: string, languageId: number) {
    const existingSlug = await prisma.recipe.findUnique({
      where: { slug: data.slug },
    });
    if (existingSlug) {
      throw new AppError(ErrorCodes.SLUG_EXIST);
    }

    const result = await prisma.recipe.create({
      data: {
        slug: data.slug,
        images: data.images,
        part: data.part,
        note: data.note,
        preparationTime: data.preparationTime,
        cookingTime: data.cookingTime,
        restTime: data.restTime,
        authorId: userId,
        translations: {
          create: {
            name: data.name,
            description: data.description,
            stage: data.stage,
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

  static async getMany() {
    const result = await prisma.recipe.findMany({

    });
    return { result };
  }

  static async get(data: GetInput) {
    const result = await prisma.recipe.findUnique({
      where: {
        slug: data.slug
      }

    });
    return { result };
  }

  static async delete(data: DeleteInput) {
    const result = await prisma.recipe.delete({
      where: {
        slug: data.slug
      }
      
    });
    return { result };
  }
}
