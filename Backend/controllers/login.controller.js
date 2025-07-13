import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import { Login } from '../models/login.model.js';

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey123#$@!";

export const login = async (req, res) => {
  const { email, password } = req.body;

  // Check for required fields
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Find user by email
  const loginUser = await Login.findOne({ email });
  if (!loginUser) {
    return res.status(404).json({ message: "User not found meo" });
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, loginUser.password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Sign JWT
  const token = jwt.sign(
    { id: loginUser._id, email: loginUser.email },
    JWT_SECRET,
    { expiresIn: "2h" }
  );

  // Return success
  res.status(200).json({
    message: "Login successful",
    token
  });
};
