import { Router } from "express";
import { authMiddleware, validateRequest } from "../../middlewares/index.js";
import { registerSchema, loginSchema } from "../../validators/index.js";
import { authController } from "../../controllers/auth.controller.js";

const router = Router();

router.post("/register", validateRequest(registerSchema),authController.register);
router.post("/login", validateRequest(loginSchema),authController.login);
router.get("/",authMiddleware ,authController.userInfo);

export default router;