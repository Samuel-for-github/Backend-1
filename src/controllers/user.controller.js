import { asyncHandler } from "../utils/asyncHandller.js";
import {ApiError} from "../utils/apiError.js";
import {User} from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";


const generateAccessAndRefreshTokens = async(userID)=>{
  try{
   const user = await User.findById(userID);

   const accessToken = await user.generateAccessToken()
  const refreshToken = await user.generateRefreshToken()
    user.refreshToken = refreshToken;
  await user.save({validateBeforeSave: false})
    return {accessToken, refreshToken}
  }catch(error){
    throw new ApiError(500,"Something Went Wrong while generating Access and Refresh Token",error.message);
  }
}

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

const loginUser = asyncHandler(async(req, res) => {
  //req body

  const {email, username, password} = req.body
  //validate fields

  if (!(email || username)){
    throw new ApiError(400, "username or email required")
  }
  if (email && !email.includes("@")){
    throw new ApiError(404, "Invalid email address")
  }

  //find user
  const user = await User.findOne({
    $or: [{email}, {username}]
  })
  if (!user){
    throw new ApiError(404, "User does not exist");
  }
  //password check
  const isPasswordValid =  await user.isPasswordCorrect(password)
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
  }
  //generate access and refresh token
const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

  //send cookies
  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
  const options = {
    httpOnly: true,
    secure: true,
  }
    //response
  return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
    new ApiResponse(200,{
      user: loggedInUser,accessToken,refreshToken,
      message: "Successfully logged in",
    })
  )

})
const logoutUser = asyncHandler(async(req, res) => {
  console.log(req.user);
 await User.findByIdAndUpdate(req.user._id, {
   $set:{
      refreshToken: "",
    }})
  const options = {
    httpOnly: true,
    secure: true,
  }

  return res.status(200).clearCookie("accessToken", options).json(
    new ApiResponse(200, "User logged out successfully")
  )
})

const refreshAccessToken = asyncHandler(async(req, res) => {



    try {
      const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken
      if (!incomingRefreshToken){
         new ApiError(401, "Unauthorized request")
      }

      const decodedRefreshToken= jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
      console.log(decodedRefreshToken);
      const userAgent = await User.findById(decodedRefreshToken?._id);

    if (!userAgent) {
      new ApiError(401, "Invalid refresh token")
    }

    if (incomingRefreshToken !== userAgent?.refreshToken) {
       new ApiError(401, "refresh token is expired or used")
    }
    const options = {
      httpOnly: true,
      secure: true
    }

    const token = await generateAccessAndRefreshTokens(userAgent._id)


    return res.status(200).cookie("accessToken", token.accessToken, options).cookie("refreshToken", token.refreshToken, options).json(
      new ApiResponse(200, {
        accessToken: token.accessToken,
        refreshToken: token.refreshToken
      }, "Access Token Refreshed")
    )
    }catch (e) {
      throw new ApiError(401, "decoding fail")
    }

})


export { registerUser, loginUser, logoutUser, refreshAccessToken}