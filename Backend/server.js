// server.js
import dotenv from 'dotenv';
import app from './app.js';
import connectDB from './db/index.js'

// Load environment variables from .env file
dotenv.config();
connectDB()
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
