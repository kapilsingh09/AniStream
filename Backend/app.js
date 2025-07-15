// app.js
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";

// Import route modules
// import animeRoutes from './routes/anime.routes.js';
import authRoutes from './routes/auth.routes.js';


const app = express();

// ✅ Middlewares
app.use(cors({
  origin: "http://localhost:5173", // Frontend origin
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// ✅ Route handlers
app.use("/api/auth", authRoutes);         // Handles login, signup, etc.
// app.use("/api/anime", animeRoutes);       // Handles anime endpoints (random, id, stats)
// app.use("/api/auth", router_login);    // (Optional/old)

// ✅ Default route
app.get('/', (req, res) => {
  res.send('Hello from Express app! The server will start from server.js');
});

export default app;
