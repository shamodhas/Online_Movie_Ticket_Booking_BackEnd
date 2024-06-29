import express from "express"
import * as ScreeningController from "../controllers/screening.controller"
import {
  authenticateUser,
  authorizeTheaterOwner
} from "../middlewares/auth.middleware"
const router = express.Router()

router.get("/", authenticateUser, ScreeningController.getAllScreenings)
router.get(
  "/:screeningId",
  authenticateUser,
  ScreeningController.getScreeningById
)
router.post(
  "/",
  authenticateUser,
  authorizeTheaterOwner,
  ScreeningController.createScreening
)
router.put(
  "/:screeningId",
  authenticateUser,
  authorizeTheaterOwner,
  ScreeningController.updateScreening
)
router.delete(
  "/:screeningId",
  authenticateUser,
  authorizeTheaterOwner,
  ScreeningController.deleteScreening
)

export default router
