import express from "express"
import * as AuthController from "../controllers/auth.controller"
import upload from "../middlewares/upload"

const router = express.Router()

// Public routes
router.post("/login", AuthController.loginUser)
router.post(
  "/register",
  upload.single("profileImage"),
  AuthController.registerUser
)
router.post("/refresh-token", AuthController.refreshToken)

export default router
