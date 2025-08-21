import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        index:true,
        trim:true,
    },
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
        username:this.username,

    }, process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY
    })   
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        //key and this from db
        _id:this._id,
        // email:this.email,
        // username:this.username,

    }, process.env.REFRESH_TOKEN_SECRET || process.env.ACCESS_TOKEN_SECRET,{
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY || process.env.ACCESS_TOKEN_EXPIRY
    })   
}


export const User = mongoose.model("User", userSchema);