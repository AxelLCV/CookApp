import express from "express";
import cors from "cors";
import { authMiddleware, logger, errorHandler } from "./middlewares/index.js";
import { UPLOADS_DIR } from "./middlewares/upload.middleware.js";
import { authRoutes, recipesRoutes, departmentsRoutes, ingredientsRoutes, ustensilsRoutes, unitsRoutes, categoriesRoutes, tagsRoutes, winesRoutes, uploadsRoutes } from "./routes/v1/index.js";


const allowedOrigins = [
  // Capacitor WebView origins (Android default scheme, iOS for later)
  'https://localhost',
  'capacitor://localhost',
  // Vite dev server, for testing the frontend in a browser against this API
  'http://localhost:5173',
]

const app = express();
// Railway terminates TLS at its proxy; trust its X-Forwarded-Proto so req.protocol reports https.
app.set('trust proxy', 1);
// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}))
app.use(logger);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Uploaded recipe photos are served publicly, no auth needed to view them.
app.use("/uploads/files", express.static(UPLOADS_DIR));

//Authentification routes
app.use("/auth",authRoutes);

app.use(authMiddleware);

app.use("/recipes",recipesRoutes);
app.use("/departments",departmentsRoutes);
app.use("/ingredients",ingredientsRoutes);
app.use("/ustensils",ustensilsRoutes);
app.use("/units",unitsRoutes);
app.use("/categories",categoriesRoutes);
app.use("/tags",tagsRoutes);
app.use("/wines",winesRoutes);
app.use("/uploads",uploadsRoutes);

app.use(errorHandler);

export default app;