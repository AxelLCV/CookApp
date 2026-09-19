import { prisma } from "../config/prisma.js";
import { Ingredient, Prisma } from "../generated/prisma/client.js";
import { GenericRepository } from "../repositories/generic.repository.js";
import { IngredientsService } from "../services/ingredients.service.js";
import { createCrudController } from "./crud.controller.factory.js";

const ingredientsService = new IngredientsService(
  new GenericRepository<
    Ingredient,
    Prisma.IngredientCreateInput | Prisma.IngredientUncheckedCreateInput,
    Prisma.IngredientWhereUniqueInput,
    Prisma.IngredientFindManyArgs
  >(prisma.ingredient)
);

export const ingredientsController = createCrudController(ingredientsService);
