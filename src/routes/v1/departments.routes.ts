import { Router } from "express";
import { authorize, validateRequest } from "../../middlewares/index.js";
import { createSchema, getManySchema, deleteSchema } from "../../validators/departments.schema.js";
import { departmentsController } from "../../controllers/departments.controller.js";

const router = Router();

router.post("/",authorize({allowedRoles: ["ADMIN"]}),validateRequest(createSchema),departmentsController.create);
router.get("/",validateRequest(getManySchema),departmentsController.getMany);
router.delete("/:id",authorize({allowedRoles: ["ADMIN"]}),validateRequest(deleteSchema),departmentsController.delete);
export default router;