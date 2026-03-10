import { Router } from "express";
import { authorize, validateRequest } from "../../middlewares/index.js";
import { createSchema, getManySchema, deleteSchema } from "../../validators/ustensils.schema.js";
import { ustensilsController } from "../../controllers/ustensils.controller.js";

const router = Router();

router.post("/",authorize({allowedRoles: ["ADMIN"]}),validateRequest(createSchema),ustensilsController.create);
router.get("/",validateRequest(getManySchema),ustensilsController.getMany);
router.delete("/:id",authorize({allowedRoles: ["ADMIN"]}),validateRequest(deleteSchema),ustensilsController.delete);
export default router;