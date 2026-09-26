import { Router } from "express";
import { authorize, validateRequest } from "../../middlewares/index.js";
import {
  createSchema,
  getManySchema,
  updateSchema,
  deleteSchema,
  addConversionSchema,
  getConversionsSchema,
  removeConversionSchema,
  convertQuerySchema,
} from "../../validators/units.schema.js";
import { unitsController } from "../../controllers/units.controller.js";

const router = Router();

router.post("/",authorize({allowedRoles: ["ADMIN"]}),validateRequest(createSchema),unitsController.create);
router.get("/",validateRequest(getManySchema),unitsController.getMany);
router.get("/convert",validateRequest(convertQuerySchema),unitsController.convert);
router.patch("/:id",authorize({allowedRoles: ["ADMIN"]}),validateRequest(updateSchema),unitsController.update);
router.delete("/:id",authorize({allowedRoles: ["ADMIN"]}),validateRequest(deleteSchema),unitsController.delete);
router.post("/:id/conversions",authorize({allowedRoles: ["ADMIN"]}),validateRequest(addConversionSchema),unitsController.addConversion);
router.get("/:id/conversions",validateRequest(getConversionsSchema),unitsController.getConversions);
router.delete("/:id/conversions/:targetUnitId",authorize({allowedRoles: ["ADMIN"]}),validateRequest(removeConversionSchema),unitsController.removeConversion);
export default router;
