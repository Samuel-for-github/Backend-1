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
    const email = decodedToken.email
    const username = decodedToken.username

    const user = await User.findOne({
      $or: [{ username, email}]
    })
    if(!user){
      new ApiError(401, "Invalid Access Token")
    }

    req.user = user

  }catch(err){
    throw new ApiError(401, "Database Failed");
  }
  next();
})