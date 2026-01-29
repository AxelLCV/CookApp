import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { authorize, validateRequest } from "../../middlewares/index.js";
import { createRecipeSchema, deleteRecipeSchema } from "../../validators/index.js";
import { recipesController } from "../../controllers/recipes.controller.js";

const router = Router();

router.post("/",authorize({allowedRoles: ["USER"]}),validateRequest(createRecipeSchema),recipesController.createRecipe);
router.get("/",recipesController.getRecipe);
router.delete("/:slug",authorize({allowedRoles: ["ADMIN"], model: prisma.recipe, ownerField: "authorId", idParam: "slug"}),validateRequest(deleteRecipeSchema),recipesController.deleteRecipe);
export default router;