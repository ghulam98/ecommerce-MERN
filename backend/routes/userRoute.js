const express  = require("express");
const {isAuthenticated, authorizedRoles} = require("../middleware/auth")
const { registerUser, loginUser, logout, forgotPassword, resetPassword, getUserDetails, updatePassword, updateProfile, getAllUser, getSingleUserDetail, updateUserRole, deleteUserAccount } = require("../controllers/userController");
const router = express.Router()

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/password/forgot").post(forgotPassword)
router.route("/password/reset/:token").put(resetPassword)
router.route("/logout").post(logout);
router.route("/me").get(isAuthenticated,getUserDetails)
router.route("/update/password").put(isAuthenticated,updatePassword)
router.route("/update/me").put(isAuthenticated,updateProfile)

router.route("/admin/users").get(isAuthenticated, authorizedRoles("admin"), getAllUser)
router.route("/admin/user/:id").get(isAuthenticated,authorizedRoles("admin"), getSingleUserDetail)
.put(isAuthenticated,authorizedRoles("admin"),updateUserRole)
.delete(isAuthenticated, authorizedRoles("admin"), deleteUserAccount)

module.exports = router

