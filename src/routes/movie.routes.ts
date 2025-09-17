import express from "express"
import * as MovieController from "../controllers/movie.controller"
import upload from "../middlewares/upload"
import {
  authenticateUser,
  authorizeTheaterOwner
} from "../middlewares/auth.middleware"

const router = express.Router()

router.get("/", MovieController.getAllMovies)
router.get("/me", authenticateUser, MovieController.getAllMyMovies)
router.get("/:movieId", MovieController.getMovieById)

router.post(
  "/",
  authenticateUser,
  authorizeTheaterOwner,
  upload.single("file"),
  MovieController.createMovie
)
router.put(
  "/:movieId",
  authenticateUser,
  authorizeTheaterOwner,
  MovieController.updateMovie
)
router.delete(
  "/:movieId",
  authenticateUser,
  authorizeTheaterOwner,
  MovieController.deleteMovie
)

export default router
