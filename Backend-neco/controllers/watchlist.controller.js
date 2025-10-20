import mongoose  from "mongoose";

import { Watchlist } from "../models/wathlist.model.js";
import { ApiError } from "../utils/ApiError.js";

export const watchlistController = () =>{
    try {
        // const {animeId,addedBy,addedAt} = req.body;

        res.status(200).json({message:"watchlist added"})
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
} 