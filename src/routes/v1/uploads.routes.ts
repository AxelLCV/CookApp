import { Router } from "express";
import { uploadImages } from "../../middlewares/upload.middleware.js";
import { uploadsController } from "../../controllers/uploads.controller.js";

const router = Router();

router.post("/images", uploadImages.array("images", 5), uploadsController.create);

export default router;
