import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

// sommets added as requested
const sommets = "sommets-value";

const userSchema = new mongoose.Schema({
    // username: {
    //     type: String,
    //     required: true,
    //     index:true,
    //     trim:true,
    // },
    name: {
        type: String,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    refreshToken:{
        type:String
    },
    //avatar here
    
    // Watchlist: User's saved anime to watch later (similar to Crunchyroll watchlist)
    watchlist: [{
        animeId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],

    // Favourites: User's favorite anime (liked/hearted anime)
    favourites: [{
        animeId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        addedAt: {
            type: Date,
            default: Date.now
        }
    }],

    createdAt: { type: Date, default: Date.now },
},{timestamps:true})


userSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next()
      this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return  await bcrypt.compare(password , this.password)
}


userSchema.methods.generateAccesToken = function(){
    return jwt.sign({
        //key and this from db
        _id:this._id,
        email:this.email,
        // username:this.username, // Commented out since username field is not in schema

    }, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY || '15m'
    })   
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        //key and this from db
        _id:this._id,
        // email:this.email,
        // username:this.username,

    }, process.env.REFRESH_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY || process.env.ACCESS_TOKEN_EXPIRY || '7d'
    })   
}


export const User = mongoose.model("User", userSchema);