import { Router } from "express";
import { authorize, validateRequest } from "../../middlewares/index.js";
import { createSchema, getManySchema, deleteSchema } from "../../validators/wines.schema.js";
import { winesController } from "../../controllers/wines.controller.js";

const router = Router();

router.post("/",authorize({allowedRoles: ["ADMIN"]}),validateRequest(createSchema),winesController.create);
router.get("/",validateRequest(getManySchema),winesController.getMany);
router.delete("/:id",authorize({allowedRoles: ["ADMIN"]}),validateRequest(deleteSchema),winesController.delete);
export default router;
