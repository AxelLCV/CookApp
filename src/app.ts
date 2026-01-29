import express from "express";
import cors from "cors";
import { authMiddleware, logger, errorHandler } from "./middlewares/index.js";
import { authRoutes, recipesRoutes } from "./routes/v1/index.js";


const allowedOrigins = [
  'https://cook-app-front.vercel.app',
  'http://localhost:5173',
]

const app = express();
// Middleware configuration
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true) // Postman ou curl
    if (allowedOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true, // <- important
}))
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