import express from "express";
import * as Middleware from "../middlewares";
import * as MovieController from "./../controllers/movie.controller";

const router = express.Router();

router.get("/all", MovieController.getAllMovies);

router.get("/:name", MovieController.getMovieByName);

router.get("/user/:userId", MovieController.getMoviesByUser);

router.post(
  "/",
  Middleware.verifyToken,
  Middleware.verifyIsTheaterEmployee,
  MovieController.createMovie
);

router.put(
  "/:id",
  Middleware.verifyToken,
  Middleware.verifyIsTheaterEmployee,
  MovieController.updateMovie
);

router.put(
  "/status/:id",
  Middleware.verifyToken,
  Middleware.verifyIsAdmin,
  MovieController.updateMovieStatus
);

router.delete(
  "/:id",
  Middleware.verifyToken,
  Middleware.verifyIsTheaterEmployee,
  MovieController.deleteMovie
);

export default router;
