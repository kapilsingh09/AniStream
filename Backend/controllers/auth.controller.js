import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { asyncHandler} from '../utils/asyncHandler.js'

//  should use process.env.JWT_SECRET in production
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || "your_secret_keydsfjkalsdjfodjsiofj121io8936217846hkhfkjdsaf fklsjdfoief fnasf.HIUY689q3wfY(^(3u jfoijofhgaU967w3r9uiofji)) weur37u28547fjY(^&#%(#&$($ #($&# R OHFK#(*RY FH( #Y$(#&FFFFF";

// Register Controller
export const register = async (req, res) => {
    try {
        const { username, name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            username,
            name,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        console.log(newUser);

        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        console.error("Register error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// export const reg = () =>{
export const registerUser = asyncHandler(async (req,res)=>{
    res.status(200).json({message:"ok"})
})
// }

// Login Controller
export const login = async (req, res) => {
    try {
        const { email, password ,rememberMe } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ userId: user._id },JWT_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        });

        const cookieAge = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000;

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", // set true in prod
            sameSite: "strict",
            maxAge: cookieAge,
        })
        
        res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                name: user.name,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
