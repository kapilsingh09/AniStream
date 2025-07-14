import express, { Router } from "express";

import { login } from '../controllers/auth.controller.js'; // Make sure it's a named export
import { register } from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);


export default router;