// import express from "express";
// import multer from "multer";
// import * as Middleware from "../middlewares";
// import * as MovieController from "./../controllers/movie.controller";

// const router = express.Router();
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });

// router.get("/all", MovieController.getAllMovies);

// router.get(
//   "/my",
//   Middleware.verifyToken,
//   Middleware.verifyIsTheaterEmployee,
//   MovieController.getMyAllMovies
// );

// router.get("/:name", MovieController.getMovieByName);

// router.get(
//   "/user/:userId",
//   Middleware.verifyToken,
//   Middleware.verifyIsAdmin,
//   MovieController.getMoviesByUser
// );

// router.post(
//   "/",
//   Middleware.verifyToken,
//   Middleware.verifyIsTheaterEmployee,
//   upload.single("file"),
//   MovieController.createMovie
// );

// router.put(
//   "/:id",
//   Middleware.verifyToken,
//   Middleware.verifyIsTheaterEmployee,
//   MovieController.updateMovie
// );

// router.put(
//   "/status/:id",
//   Middleware.verifyToken,
//   Middleware.verifyIsAdmin,
//   MovieController.updateMovieStatus
// );

// router.delete(
//   "/:id",
//   Middleware.verifyToken,
//   Middleware.verifyIsTheaterEmployee,
//   MovieController.deleteMovie
// );

// export default router;

import express from "express"
import * as MovieController from "../controllers/movie.controller"
import {
  authenticateUser,
  authorizeAdmin,
  authorizeTheaterOwner
} from "../middlewares/auth.middleware"

const router = express.Router()

router.get("/", MovieController.getAllMovies) //
router.get("/me", MovieController.getAllMyMovies) //
router.get("/:movieId", MovieController.getMovieById) //
router.post(
  "/",
  authenticateUser,
  authorizeTheaterOwner,
  MovieController.createMovie
) //
router.put(
  "/:movieId",
  authenticateUser,
  authorizeTheaterOwner,
  MovieController.updateMovie
) //
router.delete(
  "/:movieId",
  authenticateUser,
  authorizeTheaterOwner,
  MovieController.deleteMovie
) //

export default router
