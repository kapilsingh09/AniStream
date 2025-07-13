// app.js
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes.js'

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth",authRoutes)

// Base route
app.get('/', (req, res) => {
  res.send('Hello from Express app! The server will start from server.js');
});


export default app;
