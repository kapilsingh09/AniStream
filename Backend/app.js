// app.js
import express from 'express';
import cors from 'cors';
import cookieParser from "cookie-parser";
import authRoutes from './routes/auth.routes.js'
// import router_login from './routes/login.routes.js'

const app = express();

// Middleware 
app.use(cors({ origin: "http://localhost:5173", // your frontend URL
    credentials: true,}));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/auth",authRoutes)
// app.use("/api/auth",router_login)
// Base route

app.get('/', (req, res) => {
  res.send('Hello from Express app! The server will start from server.js');
});




export default app;
