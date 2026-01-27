import express from "express";
import cors from "cors";
import { authMiddleware, logger, errorHandler } from "./middlewares/index.js";
import { authRoutes } from "./routes/v1/index.js";
const app = express();
// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(logger);
//Authentification routes
app.use("/auth", authRoutes);
app.use(authMiddleware);
app.use(errorHandler);
export default app;
