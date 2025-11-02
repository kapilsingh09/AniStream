import express from 'express';
import { getAnimeDetails } from '../controllers/anime.controller.js';
// import { getAnimeDetails } from '../controllers/animeController.js';

const router = express.Router();

router.get('/:slug', getAnimeDetails);

export default router;
