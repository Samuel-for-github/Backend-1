import { asyncHandler } from "../utils/asyncHandller.js";
import {ApiError} from "../utils/apiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async(req, res) => {
  // console.log("request body", req.body);
  // console.log("request files", req.files);
// get user details from frontend or postman
  const {email, username, fullName, password} = req.body
  // console.log(`Email: ${email}`);

  //validation - not empty,correct email input
  if ([email,username, password, fullName].some((field)=>{
    field?.trim() === ""
  })) {
  throw new ApiError(400, "All fields are required")
  }
  if (!email.includes("@")){
    throw new ApiError(400, "Invalid email address")
  }
  if(password.length <= 7){
    throw new ApiError(400, "Password must be at least 8 characters");
  }
  //check if user already exits by email
  const existedUser = await User.findOne({
    $or: [{email}, {username}]
  })
  if (existedUser){
    throw new ApiError(409, "User already exists")
  }
  //check for cover image and avatar
    //log files
      const avatarLocalPath = req.files?.avatar[0]?.path
  // console.log(avatarLocalPath);
  //     const coverImageLocalPath = req.files?.coverImage[0]?.path
      let coverImageLocalPath;
  if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
    coverImageLocalPath = req.files.coverImage[0].path;

  }
      if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required");
      }

  //upload images in cloudinary

    const avatar = await uploadOnCloudinary(avatarLocalPath)
  const coverImage = await uploadOnCloudinary(coverImageLocalPath)
  // console.log(avatar);
    if(!avatar){
      throw new ApiError(400, "Avatar file is required")
    }

  //create a user object - create entry in DB
 const user =  await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || ' ',
    email,
    password,
    username: username.toLowerCase()
  })
  //remove password and refresh token from response
  //check user for creation
 const createdUser = await User.findById(user._id).select(
   "-password -refreshToken"
 )
  if (!createdUser){
    throw new ApiError(500, "Something went wrong while registering user")
  }
  //return response
  return res.status(201).json(
    new ApiResponse(200,createdUser, "User successfully registered"),
  )
})

export { registerUser }