import express from "express"
import * as AuthController from "../controllers/auth.controller"

const router = express.Router()

router.post("/login", AuthController.loginUser)
router.post("/register", AuthController.registerUser)
router.post("/refresh-token", AuthController.refreshToken)

export default router
