import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { authorize, validateRequest } from "../../middlewares/index.js";
import { createSchema, getManySchema, getSchema, updateSchema, deleteSchema } from "../../validators/recipes.schema.js";
import { upsertSchema as upsertReviewSchema, getManySchema as getManyReviewsSchema, deleteSchema as deleteReviewSchema } from "../../validators/reviews.schema.js";
import { recipesController } from "../../controllers/recipes.controller.js";
import { reviewsController } from "../../controllers/reviews.controller.js";

const router = Router();

router.post("/",authorize({allowedRoles: ["USER"]}),validateRequest(createSchema),recipesController.create);
router.get("/",validateRequest(getManySchema),recipesController.getMany);
router.get("/:slug",validateRequest(getSchema),recipesController.get);
router.post("/:slug/favorite",validateRequest(getSchema),recipesController.toggleFavorite);
router.get("/:slug/reviews",validateRequest(getManyReviewsSchema),reviewsController.getMany);
router.post("/:slug/reviews",validateRequest(upsertReviewSchema),reviewsController.upsert);
router.delete("/:slug/reviews",validateRequest(deleteReviewSchema),reviewsController.deleteMine);
router.patch("/:slug",authorize({allowedRoles: ["ADMIN"], model: prisma.recipe, ownerField: "authorId", idParam: "slug"}),validateRequest(updateSchema),recipesController.update);
router.delete("/:slug",authorize({allowedRoles: ["ADMIN"], model: prisma.recipe, ownerField: "authorId", idParam: "slug"}),validateRequest(deleteSchema),recipesController.delete);
export default router;