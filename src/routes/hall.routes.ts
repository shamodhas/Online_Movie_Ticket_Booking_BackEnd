import express from "express";
import * as Middleware from "../middlewares";
import * as HallController from "./../controllers/hall.controller";

const router = express.Router();

router.get("/all", HallController.getAllTheaters);

router.get("/:hallNumber", HallController.getTheaterByName);

router.get("/user/:userId", HallController.getTheatersByUser);

router.post(
  "/",
  Middleware.verifyToken,
  Middleware.verifyIsTheaterEmployee,
  HallController.saveTheater
);

router.put(
  "/:id",
  Middleware.verifyToken,
  Middleware.verifyIsTheaterEmployee,
  HallController.updateTheater
);

router.delete(
  "/:id",
  Middleware.verifyToken,
  Middleware.verifyIsTheaterEmployee,
  HallController.deleteTheater
);

export default router;
