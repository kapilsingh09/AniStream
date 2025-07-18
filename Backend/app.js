// app.js
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import animeRoutes from './routes/animeRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url';
// Import route modules
// import animeRoutes from './routes/anime.routes.js';
import authRoutes from './routes/auth.routes.js';
// import animeRoutes from './routes/anime.routes.js'
// import animeRoutes from './routes/anime.routes.js'
import availableDataRoutes from './routes/availableData.js'

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ✅ Middlewares

app.use(cors({
  origin: "http://localhost:5173", // Frontend origin
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// Serve videos from the root /videos directory
app.use('/videos', express.static(path.join(__dirname, '..', 'videos')));

// ✅ Route handlers
app.use("/api/auth", authRoutes);         // Handles login, signup, etc.
// app.use("/api/anime", animeRoutes); // So your route is at /api/anime
app.use("/api/available_data", availableDataRoutes);
// app.use("/api/auth", router_login);    // (Optional/old)
app.use("/api/anime",animeRoutes)
// ✅ Default route
app.get('/', (req, res) => {
  res.send('Hello from Express app! The server will start from server.js');
});

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong"
  });
});

export default app;
