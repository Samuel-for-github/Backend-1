import { Router } from 'express';
import {
  changePassword,
  getUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser, updateUserDetails,
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(upload.fields([
  {
  name: "avatar",
  maxCount: 1,
},{
  name: "coverImage",
  maxCount: 1
}]
),registerUser);

router.route("/login").post(loginUser);
//secure route
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refreshAccessToken").post(refreshAccessToken);
router.route("changePassword").post(verifyJWT,changePassword);
router.route("/getUser").get(verifyJWT,getUser)
router.route("/update").post(verifyJWT,updateUserDetails);

export default router ;