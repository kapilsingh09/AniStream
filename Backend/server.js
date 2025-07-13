// server.js
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config(); // Load .env variables if needed

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
