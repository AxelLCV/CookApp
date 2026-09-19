import express from "express";
import cors from "cors";
import { authMiddleware, logger, errorHandler } from "./middlewares/index.js";
import { authRoutes, recipesRoutes, departmentsRoutes, ingredientsRoutes, ustensilsRoutes, unitsRoutes, categoriesRoutes, tagsRoutes, winesRoutes } from "./routes/v1/index.js";


const allowedOrigins = [
  'https://cook-app-front.vercel.app',
  'http://localhost:5173',
  // Capacitor WebView origins (Android default scheme, iOS for later)
  'https://localhost',
  'capacitor://localhost',
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

app.use(errorHandler);

export default app;