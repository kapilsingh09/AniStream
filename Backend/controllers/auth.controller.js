import { User } from '../models/user.model.js';
import bcrypt from "bcrypt";

export const register = async (req, res) => {
    try {
        console.log('Register request received:', req.body);
        
        const { username, name, email, password, confirmPassword } = req.body;
        
        if (password !== confirmPassword) {
            console.log('Password mismatch');
            return res.status(400).json({ message: "Passwords do not match" });
        }

        console.log('Checking for existing user with email:', email);
        const existingUser = await User.findOne({ email });
        
        if (existingUser) {
            console.log('User already exists');
            return res.status(409).json({ message: "User already exists" });
        }

        console.log('Hashing password...');
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('Creating new user...');
        const user = new User({
            username,
            name,
            email,
            password: hashedPassword,
        });

        console.log('Saving user to database...');
        await user.save();
        
        console.log('User registered successfully');
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}