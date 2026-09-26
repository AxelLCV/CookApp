import { Router } from "express";
import { authorize, validateRequest } from "../../middlewares/index.js";
import { createSchema, getManySchema, updateSchema, deleteSchema } from "../../validators/ustensils.schema.js";
import { ustensilsController } from "../../controllers/ustensils.controller.js";

const router = Router();

router.post("/",authorize({allowedRoles: ["ADMIN"]}),validateRequest(createSchema),ustensilsController.create);
router.get("/",validateRequest(getManySchema),ustensilsController.getMany);
router.patch("/:id",authorize({allowedRoles: ["ADMIN"]}),validateRequest(updateSchema),ustensilsController.update);
router.delete("/:id",authorize({allowedRoles: ["ADMIN"]}),validateRequest(deleteSchema),ustensilsController.delete);
export default router;