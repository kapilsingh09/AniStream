import express, { Router } from "express";

import { login, logOutUser, registerUser } from '../controllers/auth.controller.js'; // Make sure it's a named export
import { register } from "../controllers/auth.controller.js";
import { verify_JWT } from "../middlewares/auth.middlewares.js";

const router = express.Router();

router.post("/register", register);
// router.post("/login", login);
router.route(
    '/login'
).post(login)
router.route('/logout').post(verify_JWT,logOutUser)
//another syntax
router.route('/registerUser').post(registerUser)


export default router;