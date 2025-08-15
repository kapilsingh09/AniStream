import express, { Router } from "express";

import { login, registerUser } from '../controllers/auth.controller.js'; // Make sure it's a named export
import { register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
//another syntax
router.route('/registerUser').post(registerUser)


export default router;