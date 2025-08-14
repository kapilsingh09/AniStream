import available_data from "../available_data/a1.js";
import express, { Router } from 'express'
import  fetchAndSendKitsuAnime  from "../available_data/a1.js";
const router = express.Router();

router.get("/", (req, res, next) => {
    if (!available_data) {
        // Use next() to pass error to error handler
        const error = new Error("Available data not found");
        error.status = 500;
        return next(error);
    }
    res.json(available_data);
});

// router.get('/api/kitsu-anime', (req, res) => fetchAndSendKitsuAnime(res));

export default router;