import { Router } from "express";
import { authorize, validateRequest } from "../../middlewares/index.js";
import { createSchema, getManySchema, getSchema, updateSchema, deleteSchema, addUnitSchema, removeUnitSchema } from "../../validators/ingredients.schema.js";
import { ingredientsController } from "../../controllers/ingredients.controller.js";

const router = Router();

router.post("/",authorize({allowedRoles: ["ADMIN"]}),validateRequest(createSchema),ingredientsController.create);
router.get("/",validateRequest(getManySchema),ingredientsController.getMany);
router.get("/:id",validateRequest(getSchema),ingredientsController.get);
router.patch("/:id",authorize({allowedRoles: ["ADMIN"]}),validateRequest(updateSchema),ingredientsController.update);
router.delete("/:id",authorize({allowedRoles: ["ADMIN"]}),validateRequest(deleteSchema),ingredientsController.delete);
router.post("/:id/units",authorize({allowedRoles: ["ADMIN"]}),validateRequest(addUnitSchema),ingredientsController.addUnit);
router.delete("/:id/units/:unitId",authorize({allowedRoles: ["ADMIN"]}),validateRequest(removeUnitSchema),ingredientsController.removeUnit);
export default router;