const express = require("express")
const router = express.Router()
const validation = require("../middlewares/validationMiddleware")
const validateCookie = require("../middlewares/validateCookieMiddleware")
const {
  userLoginSchema,
  userRegisterSchema,
} = require("../validations/userValidation")
const {
  register,
  login,
  updateUserDetails,
  getUserDetails,
} = require("../controllers/userController")

// router.post("/", validation(userRegisterSchema), register)
router
  .route("/")
  .post(validation(userRegisterSchema), register)
  .put(validateCookie, updateUserDetails)
  .get(validateCookie, getUserDetails)
router.route("/login").post(validation(userLoginSchema), login)

module.exports = router
