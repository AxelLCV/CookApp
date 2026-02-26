import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/appError.js";
import { ErrorCodes } from "../errors/errorCode.js";
import { createRecipeInput, findRecipeInput} from "../validators/recipes.schema.js";

export class RecipesService {
  static async createRecipe(data: createRecipeInput, userId: string, languageId: number) {
    const existingSlug = await prisma.recipe.findUnique({
      where: { slug: data.slug },
    });
    if (existingSlug) {
      throw new AppError(ErrorCodes.SLUG_EXIST);
    }

    const recipe = await prisma.recipe.create({
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
    return { recipe };
  }

  static async getRecipes() {
    const recipe = await prisma.recipe.findMany({

    });
    return { recipe };
  }

  static async getRecipe(data: findRecipeInput) {
    const recipe = await prisma.recipe.findUnique({
      where: {
        slug: data.slug
      }

    });
    return { recipe };
  }

  static async deleteRecipe(data: findRecipeInput) {
    const recipe = await prisma.recipe.delete({
      where: {
        slug: data.slug
      }
      
    });
    return { recipe };
  }
}
