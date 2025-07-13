import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`,{
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB connected at host: ${connectionInstance.connection.host}`);
    // console.log(connectionInstance);
    
  } catch (error) {
    console.error('❌ Failed to connect to MongoDB');

    if (error.message.includes('ECONNREFUSED')) {
      console.log('🔴 MongoDB is not running');
      process.exit(12); // Custom code for connection refused
    } else if (!process.env.MONGO_URI) {
      console.log('🔴 MONGO_URI is missing');
      process.exit(13); // Missing environment variable
    } else {
      console.log('🔴 Unknown MongoDB connection error:', error);
      process.exit(1); // Generic failure
    }
  }
};

export default connectDB;
