import express from "express";
import cors from "cors";
import { authMiddleware, logger, errorHandler } from "./middlewares/index.js";
import { authRoutes, recipesRoutes } from "./routes/v1/index.js";

const app = express();
// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(logger);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

//Authentification routes
app.use("/auth",authRoutes);

app.use(authMiddleware);

app.use("/recipes",recipesRoutes);

app.use(errorHandler);

export default app;