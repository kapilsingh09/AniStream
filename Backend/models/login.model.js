import mongoose from "mongoose";

const loginSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,  // ✅ Correct spelling: "required"
    unique: true,
  },
  password: {
    type: String,
    required: true,  // ✅ Correct spelling: "required"
  }
}, { timestamps: true });

export const Login = mongoose.model("Login", loginSchema); // ✅ Capitalize model name
