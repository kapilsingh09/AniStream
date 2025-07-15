// server.js

// Load environment variables from .env
import dotenv from 'dotenv';
dotenv.config();

// Import Express app and DB connection
import app from './app.js';
import connectDB from './db/index.js';

// Connect to MongoDB
connectDB();

// Start the server on the specified PORT
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
