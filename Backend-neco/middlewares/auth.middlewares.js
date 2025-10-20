import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'

export const verify_JWT = asyncHandler (async (req,res,next)=>{
    try {
            const authHeader = req.header("Authorization") || "";
            const bearerToken = authHeader.startsWith("Bearer ") ? authHeader.replace(/^Bearer\s+/i, "") : "";
            const token = req.cookies?.accessToken || bearerToken;
        
            if(!token){
                throw new ApiError(401,"Unauthorized request")
        
            }
        
            const decodedToken = await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        
            const user = await User.findById(decodedToken?._id).select(
                "-password -refreshToken"
            )
        
            if(!user){
                throw new ApiError(401,"Invalid Acess Token")
            }
        
            req.user = user;
            next()
    } catch (error) {
        throw new ApiError(401,error?.message|| "Invalid access token")
    }
})