import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { authorize, validateRequest } from "../../middlewares/index.js";
import { createSchema, getSchema, deleteSchema } from "../../validators/recipes.schema.js";
import { recipesController } from "../../controllers/recipes.controller.js";

const router = Router();

router.post("/",authorize({allowedRoles: ["USER"]}),validateRequest(createSchema),recipesController.create);
router.get("/",recipesController.getMany);
router.get("/:slug",validateRequest(getSchema),recipesController.get);
router.delete("/:slug",authorize({allowedRoles: ["ADMIN"], model: prisma.recipe, ownerField: "authorId", idParam: "slug"}),validateRequest(deleteSchema),recipesController.delete);
export default router;