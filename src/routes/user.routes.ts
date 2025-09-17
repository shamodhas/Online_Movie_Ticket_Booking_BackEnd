import express from "express"
import * as UserController from "../controllers/user.controller"
import {
  authenticateUser,
  authorizeAdmin
} from "../middlewares/auth.middleware"

const router = express.Router()

router.get("/", authenticateUser, authorizeAdmin, UserController.getAllUsers)
router.get("/:userId", authenticateUser, UserController.getUserById)
router.post("/", authenticateUser, authorizeAdmin, UserController.createUser)
router.put("/:userId", authenticateUser, UserController.updateUser)
router.delete(
  "/:userId",
  authenticateUser,
  authorizeAdmin,
  UserController.deleteUser
)

export default router
