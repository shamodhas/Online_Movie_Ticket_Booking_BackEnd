import express from "express";
import * as Middleware from "../middlewares";
import * as MovieController from "./../controllers/movie.controller";

const router = express.Router();
// /all?size=?page=?
router.get("/all", MovieController.getAllMovies);
// /{name}
router.put("/:name", MovieController.getMovieByName);
// /user/{userId}
router.put("/user/:userId", MovieController.getMovieByUser);
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
