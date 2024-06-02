import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: true,
        index: true,
        trim: true,
    },
    avatar: {
        type: String,
        required: true,
    },
    coverImage: {
        type: String,
    },
    watchHistory:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video"
        }],
    password:{
        type: String,
        required: [true, 'Password is required']
    },
    refreshToken:{
        type: String
    }
}, {timestamps: true})

userSchema.pre("save", async function(next){

    if (this.isModified("password")) {
        this.password = await bcryptjs.hash(this.password, 10);
    next()
    }
    return next();
    
})

userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcryptjs.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({
        _id: this.ObjectId_id,
        email: this.email,
        username: this.username,
        fullName: this.fullName
       },
       process.env.ACCESS_TOKEN_SECRECT,{expiresIn: process.env.ACCESS_TOKEN_EXPIRY})
}
 userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
        _id: this.ObjectId_id,
       },
       process.env.REFRESH_TOKEN_SECRECT,{expiresIn: process.env.REFRESH_TOKEN_EXPIRY})
 }

export const User = mongoose.model("User", userSchema)