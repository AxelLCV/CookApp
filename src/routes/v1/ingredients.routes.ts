import { Router } from "express";
import { authorize, validateRequest } from "../../middlewares/index.js";
import { createSchema, getManySchema, deleteSchema } from "../../validators/ingredients.schema.js";
import { ingredientsController } from "../../controllers/ingredients.controller.js";

const router = Router();

router.post("/",authorize({allowedRoles: ["ADMIN"]}),validateRequest(createSchema),ingredientsController.create);
router.get("/",validateRequest(getManySchema),ingredientsController.getMany);
router.delete("/:id",authorize({allowedRoles: ["ADMIN"]}),validateRequest(deleteSchema),ingredientsController.delete);
export default router;