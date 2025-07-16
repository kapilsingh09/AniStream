import available_data from "../available_data/a1.js";
import express, { Router } from 'express'
const router = express.Router();

router.get("/", (req, res, next) => {
    try {
        // console.log("available_data");
        res.json(available_data);
    } catch (err) {
        next(err);
    }
});

export default router;