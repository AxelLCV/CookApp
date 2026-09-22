import { Router } from "express";
import { validateRequest } from "../../middlewares/index.js";
import {
  createSchema,
  getSchema,
  updateSchema,
  deleteSchema,
  addMemberSchema,
  removeMemberSchema,
} from "../../validators/households.schema.js";
import { householdsController } from "../../controllers/households.controller.js";

const router = Router();

router.post("/", validateRequest(createSchema), householdsController.create);
router.get("/", householdsController.getMine);
router.get("/:id", validateRequest(getSchema), householdsController.get);
router.patch("/:id", validateRequest(updateSchema), householdsController.update);
router.delete("/:id", validateRequest(deleteSchema), householdsController.delete);
router.post("/:id/members", validateRequest(addMemberSchema), householdsController.addMember);
router.delete("/:id/members/:userId", validateRequest(removeMemberSchema), householdsController.removeMember);

export default router;
