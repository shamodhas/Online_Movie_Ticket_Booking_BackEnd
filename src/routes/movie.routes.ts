import express from "express";
import * as Middleware from "../middlewares";
import * as MovieController from "./../controllers/movie.controller";

const router = express.Router();

router.get("/all", MovieController.getAllMovies);

router.get("/:name", MovieController.getMovieByName);
// /user/{userId}
router.get("/user/:userId", MovieController.getMovieByUser);
// /
router.post(
  "/",
  Middleware.verifyToken,
  Middleware.verifyIsTheaterEmployee,
  MovieController.createMovie
);
// /{id}
router.put(
  "/:id",
  Middleware.verifyToken,
  Middleware.verifyIsTheaterEmployee,
  MovieController.createMovie
); 
// /{id}
router.delete(
  "/:id",
  Middleware.verifyToken,
  Middleware.verifyIsTheaterEmployee,
  MovieController.createMovie
);

export default router;
