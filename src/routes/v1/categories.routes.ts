import { Router } from "express";
import { authorize, validateRequest } from "../../middlewares/index.js";
import { createSchema, getManySchema, updateSchema, deleteSchema } from "../../validators/categories.schema.js";
import { categoriesController } from "../../controllers/categories.controller.js";

const router = Router();

router.post("/",authorize({allowedRoles: ["ADMIN"]}),validateRequest(createSchema),categoriesController.create);
router.get("/",validateRequest(getManySchema),categoriesController.getMany);
router.patch("/:id",authorize({allowedRoles: ["ADMIN"]}),validateRequest(updateSchema),categoriesController.update);
router.delete("/:id",authorize({allowedRoles: ["ADMIN"]}),validateRequest(deleteSchema),categoriesController.delete);
export default router;
