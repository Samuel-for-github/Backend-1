import {v2 as cloudinary} from 'cloudinary'

import { ApiError } from "./apiError.js";


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteOnCloudinary = async (publicId) => {

  try {
    if (!publicId) {
       new ApiError(404, "Public ID is required");
    }

   const response = await cloudinary.uploader.destroy(`${publicId}`);
    return response;
  } catch (error) {
    throw new ApiError(500, "Unable to find publicId");
  }
};

export { deleteOnCloudinary };