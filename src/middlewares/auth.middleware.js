import { asyncHandler } from "../utils/asyncHandller.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/apiError.js";

export  const verifyJWT = asyncHandler(async(req, _, next) => {
  try{

    const token =  req.cookies?.accessToken || req.header('Authorization')?.replace('Bearer ', '')
    console.log(token);
    if (!token) {
       new ApiError(401, "Unauthorized" , 'No token provided');
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const email = decodedToken.email
    const username = decodedToken.username

    const user = await User.findOne({
      $or: [{ username, email}]
    })
    console.log("auth", user);
    if(!user){
      new ApiError(401, "Invalid Access Token")
    }

    req.user = user

  }catch(err){
    console.log(err);
    throw new ApiError(404, "Database Connection took long time");
  }
  next();
})