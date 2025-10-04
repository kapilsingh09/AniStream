import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import animeRoutes from './routes/anime.routes.js'
import unifiedAnimeRoutes from './routes/unifiedAnime.routes.js'
import path from 'path'
import { fileURLToPath } from 'url';
import authRoutes from './routes/auth.routes.js';
import availableDataRoutes from './routes/available.routes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"))

app.use('/videos', express.static(path.join(__dirname, '..', 'videos')));
app.use('/videos', express.static('videos'));
     
app.use("/api/auth", authRoutes);
app.use("/api/available_data", availableDataRoutes);
app.use("/api/anime", animeRoutes);
app.use("/api/unified", unifiedAnimeRoutes);



app.get('/', (req, res) => {
  res.send('Hello from Express app! The server will start from server.js');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});



app.use((req, res, next) => {
  res.status(404).json({ error: "Not Found" });
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Internal Server Error",
    message: err.message || "Something went wrong"
  });
});

export default app;
