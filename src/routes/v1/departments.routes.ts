import { Router } from "express";
import { prisma } from "../../config/prisma.js";
import { authorize, validateRequest } from "../../middlewares/index.js";
import { createDepartmentSchema, getDepartmentSchema } from "../../validators/index.js";
import { departmentsController } from "../../controllers/departments.controller.js";

const router = Router();

router.post("/",authorize({allowedRoles: ["ADMIN"]}),validateRequest(createDepartmentSchema),departmentsController.createDepartment);
router.get("/",departmentsController.getDepartments);
export default router;