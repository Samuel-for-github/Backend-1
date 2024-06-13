import { Router } from "express";
import {
  changePassword, deleteCoverImg,
  getUser, getUserChannelProfile,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser, updateAvatarAndCoverImage, updateUserDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(upload.fields([
  {
    name: "avatar",
    maxCount: 1,
  }, {
    name: "coverImage",
    maxCount: 1,
  }],
), registerUser);

router.route("/login").post(loginUser);
//secure route
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refreshAccessToken").post(refreshAccessToken);
router.route("changePassword").post(verifyJWT, changePassword);
router.route("/getUser").get(verifyJWT, getUser);
router.route("/update").patch(verifyJWT, updateUserDetails);
router.route("/updateImg").patch(verifyJWT, upload.fields([{ name: "avatar", maxCount: 1 }, {
  name: "coverImage",
  maxCount: 1,
}]), updateAvatarAndCoverImage);
router.route("/deleteImg").delete(verifyJWT, deleteCoverImg);

router.route("/c/:username").get(verifyJWT, getUserChannelProfile);

export default router;