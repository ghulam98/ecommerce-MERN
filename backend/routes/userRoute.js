const express  = require("express");
const {isAuthenticated} = require("../middleware/auth")
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile } = require("../controllers/userController");
const router = express.Router()

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").post(logout);
router.route("/me").get(isAuthenticated,getUserDetails)
router.route("/update/password").put(isAuthenticated,updatePassword)
router.route("/update/me").put(isAuthenticated,updateProfile)

module.exports = router

