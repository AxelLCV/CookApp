import { Router } from "express";
import { authorize, validateRequest } from "../../middlewares/index.js";
import { createSchema, getManySchema, updateSchema, deleteSchema } from "../../validators/tags.schema.js";
import { tagsController } from "../../controllers/tags.controller.js";

const router = Router();

router.post("/",authorize({allowedRoles: ["ADMIN"]}),validateRequest(createSchema),tagsController.create);
router.get("/",validateRequest(getManySchema),tagsController.getMany);
router.patch("/:id",authorize({allowedRoles: ["ADMIN"]}),validateRequest(updateSchema),tagsController.update);
router.delete("/:id",authorize({allowedRoles: ["ADMIN"]}),validateRequest(deleteSchema),tagsController.delete);
export default router;
