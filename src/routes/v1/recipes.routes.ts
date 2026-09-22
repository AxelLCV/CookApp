import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { authorize, validateRequest } from "../../middlewares/index.js";
import { createSchema, getManySchema, getSchema, deleteSchema } from "../../validators/recipes.schema.js";
import { recipesController } from "../../controllers/recipes.controller.js";

const router = Router();

router.post("/",authorize({allowedRoles: ["USER"]}),validateRequest(createSchema),recipesController.create);
router.get("/",validateRequest(getManySchema),recipesController.getMany);
router.get("/:slug",validateRequest(getSchema),recipesController.get);
router.post("/:slug/favorite",validateRequest(getSchema),recipesController.toggleFavorite);
router.delete("/:slug",authorize({allowedRoles: ["ADMIN"], model: prisma.recipe, ownerField: "authorId", idParam: "slug"}),validateRequest(deleteSchema),recipesController.delete);
export default router;