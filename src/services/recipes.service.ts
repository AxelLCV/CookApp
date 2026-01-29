// src/services/auth.service.ts

import { prisma } from "../config/prisma.js";
import { AppError } from "../errors/AppError.js";
import { createRecipeInput, deleteRecipeInput} from "../validators/recipes.schema.js";

export class RecipesService {
  static async createRecipe(data: createRecipeInput, userId: string) {
    const existingSlug = await prisma.recipe.findUnique({
      where: { slug: data.slug },
    });
    if (existingSlug) {
      throw new AppError("Slug already exist", 400);
    }
    const recipe = await prisma.recipe.create({
      data: {
        name: data.name,
        slug: data.slug,
        images: data.images,
        description: data.description,
        part: data.part,
        note: data.note,
        preparationTime: data.preparationTime,
        cookingTime: data.cookingTime,
        restTime: data.restTime,
        stage: data.stage,
        authorId: userId
      }
    });
    return { recipe };
  }
  static async getRecipe() {
    const recipe = await prisma.recipe.findMany({

    });
    return { recipe };
  }
  static async deleteRecipe(data: deleteRecipeInput) {
    const recipe = await prisma.recipe.delete({
      where: {
        slug: data.slug
      }
      
    });
    return { recipe };
  }
}
