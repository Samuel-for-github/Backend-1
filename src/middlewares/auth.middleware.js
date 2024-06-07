import { asyncHandler } from "../utils/asyncHandller.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

export  const verifyJWT = asyncHandler(async(req, _, next) => {
  try{
    const token =  req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '')
    if (!token) {
       new ApiError(401, "Unauthorized" , 'No token provided');
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
    if(!user){
      //
      throw new ApiError(401, "Invalid Access Token")
    }
  }catch(err){
    throw new ApiError(401, "Invalid access Token");
  }

req.user = user
  next();
})